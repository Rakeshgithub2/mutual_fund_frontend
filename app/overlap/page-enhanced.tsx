'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FundSelector } from '@/components/FundSelector';
import api from '@/lib/axios';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  PieChart,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FundHolding {
  ticker?: string;
  name: string;
  percentage: number;
  sector: string;
}

interface CommonHolding {
  name: string;
  ticker?: string;
  sector: string;
  fundWeights: { [fundId: string]: number };
  avgWeight: number;
}

interface SectorOverlap {
  sector: string;
  fundAllocations: { [fundId: string]: number };
  avgAllocation: number;
}

interface OverlapResult {
  funds: Array<{
    fundId: string;
    name: string;
    fundHouse: string;
    holdings: FundHolding[];
  }>;
  overlapPercentage: number;
  commonHoldings: CommonHolding[];
  sectorOverlap: SectorOverlap[];
  diversificationScore: number;
  recommendation: string;
}

export default function OverlapEnhancedPage() {
  const router = useRouter();
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [overlapData, setOverlapData] = useState<OverlapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddFund = (fundId: string) => {
    if (!selectedFunds.includes(fundId)) {
      setSelectedFunds([...selectedFunds, fundId]);
    }
  };

  const handleRemoveFund = (fundId: string) => {
    setSelectedFunds(selectedFunds.filter((id) => id !== fundId));
    if (overlapData) {
      setOverlapData(null);
    }
  };

  const calculateOverlap = async () => {
    if (selectedFunds.length < 2) {
      setError('Please select at least 2 funds to analyze overlap');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch detailed holdings for each fund
      const fundPromises = selectedFunds.map((fundId) =>
        api.get(`/funds/${fundId}`)
      );

      const responses = await Promise.all(fundPromises);
      const funds = responses.map((response) => ({
        fundId: response.data.fundId,
        name: response.data.name,
        fundHouse: response.data.fundHouse,
        holdings: response.data.holdings || [],
      }));

      // Calculate common holdings
      const commonHoldingsMap = new Map<string, CommonHolding>();
      const sectorOverlapMap = new Map<string, SectorOverlap>();

      funds.forEach((fund) => {
        fund.holdings.forEach((holding) => {
          const key = holding.ticker || holding.name;

          if (!commonHoldingsMap.has(key)) {
            commonHoldingsMap.set(key, {
              name: holding.name,
              ticker: holding.ticker,
              sector: holding.sector,
              fundWeights: {},
              avgWeight: 0,
            });
          }

          const common = commonHoldingsMap.get(key)!;
          common.fundWeights[fund.fundId] = holding.percentage;

          // Track sector overlap
          if (!sectorOverlapMap.has(holding.sector)) {
            sectorOverlapMap.set(holding.sector, {
              sector: holding.sector,
              fundAllocations: {},
              avgAllocation: 0,
            });
          }

          const sectorData = sectorOverlapMap.get(holding.sector)!;
          if (!sectorData.fundAllocations[fund.fundId]) {
            sectorData.fundAllocations[fund.fundId] = 0;
          }
          sectorData.fundAllocations[fund.fundId] += holding.percentage;
        });
      });

      // Filter to only common holdings (present in at least 2 funds)
      const commonHoldings = Array.from(commonHoldingsMap.values())
        .filter((h) => Object.keys(h.fundWeights).length >= 2)
        .map((h) => ({
          ...h,
          avgWeight:
            Object.values(h.fundWeights).reduce((a, b) => a + b, 0) /
            Object.keys(h.fundWeights).length,
        }))
        .sort((a, b) => b.avgWeight - a.avgWeight);

      // Calculate sector overlap
      const sectorOverlap = Array.from(sectorOverlapMap.values())
        .map((s) => ({
          ...s,
          avgAllocation:
            Object.values(s.fundAllocations).reduce((a, b) => a + b, 0) /
            Object.keys(s.fundAllocations).length,
        }))
        .sort((a, b) => b.avgAllocation - a.avgAllocation);

      // Calculate overall overlap percentage
      const totalCommonWeight = commonHoldings.reduce(
        (sum, h) => sum + h.avgWeight,
        0
      );
      const overlapPercentage = Math.min(totalCommonWeight, 100);

      // Calculate diversification score (0-100, higher is better)
      const diversificationScore = Math.max(0, 100 - overlapPercentage * 0.8);

      // Generate recommendation
      let recommendation = '';
      if (overlapPercentage > 70) {
        recommendation =
          'High overlap detected! These funds have very similar holdings. Consider replacing some funds with different categories for better diversification.';
      } else if (overlapPercentage > 40) {
        recommendation =
          'Moderate overlap. Your funds share some common holdings but maintain reasonable diversification. Monitor for any concentration risk.';
      } else {
        recommendation =
          'Good diversification! Your selected funds have minimal overlap and provide broad market exposure across different stocks and sectors.';
      }

      setOverlapData({
        funds,
        overlapPercentage,
        commonHoldings,
        sectorOverlap,
        diversificationScore,
        recommendation,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || 'Failed to analyze overlap'
      );
      console.error('Overlap calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setSelectedFunds([]);
    setOverlapData(null);
    setError('');
  };

  const getOverlapSeverity = (percentage: number) => {
    if (percentage > 70) return { label: 'High', color: 'text-red-600' };
    if (percentage > 40) return { label: 'Moderate', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Overlap Analysis</h1>
            <p className="mt-2 text-muted-foreground">
              Analyze holdings overlap between funds to ensure proper
              diversification
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Fund Selection */}
            <div className="lg:col-span-1">
              <FundSelector
                selectedFunds={selectedFunds}
                onAddFund={handleAddFund}
                onRemoveFund={handleRemoveFund}
                maxFunds={5}
                title="Select Funds to Analyze"
                categoryFilter="equity"
              />

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={calculateOverlap}
                  disabled={loading || selectedFunds.length < 2}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <PieChart className="mr-2 h-4 w-4" />
                      Analyze Overlap
                    </>
                  )}
                </Button>
                {selectedFunds.length > 0 && (
                  <Button variant="outline" onClick={handleClearAll}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Overlap Results */}
            <div className="lg:col-span-2">
              {!overlapData && selectedFunds.length === 0 && (
                <Card>
                  <CardContent className="flex h-[400px] items-center justify-center">
                    <div className="text-center">
                      <PieChart className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        Select at least 2 funds to analyze portfolio overlap
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {overlapData && (
                <div className="space-y-6">
                  {/* Overlap Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Overlap Summary</CardTitle>
                      <CardDescription>
                        Overall portfolio overlap analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Overall Overlap */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Overall Overlap
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              getOverlapSeverity(overlapData.overlapPercentage)
                                .color
                            }`}
                          >
                            {overlapData.overlapPercentage.toFixed(1)}%
                            <span className="ml-2 text-sm font-normal">
                              (
                              {
                                getOverlapSeverity(
                                  overlapData.overlapPercentage
                                ).label
                              }
                              )
                            </span>
                          </span>
                        </div>
                        <Progress
                          value={overlapData.overlapPercentage}
                          className="h-3"
                        />
                      </div>

                      {/* Diversification Score */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Diversification Score
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {overlapData.diversificationScore.toFixed(0)}/100
                          </span>
                        </div>
                        <Progress
                          value={overlapData.diversificationScore}
                          className="h-3"
                        />
                      </div>

                      {/* Recommendation */}
                      <div
                        className={`flex items-start gap-3 rounded-lg border p-4 ${
                          overlapData.overlapPercentage > 70
                            ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
                            : overlapData.overlapPercentage > 40
                              ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20'
                              : 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20'
                        }`}
                      >
                        {overlapData.overlapPercentage > 70 ? (
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                        ) : overlapData.overlapPercentage > 40 ? (
                          <Info className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                        ) : (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                        )}
                        <div>
                          <p className="font-medium">Recommendation</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {overlapData.recommendation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Common Holdings */}
                  {overlapData.commonHoldings.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Common Holdings ({overlapData.commonHoldings.length})
                        </CardTitle>
                        <CardDescription>
                          Stocks held by multiple funds in your selection
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="p-3 text-left font-medium">
                                  Stock
                                </th>
                                <th className="p-3 text-left font-medium">
                                  Sector
                                </th>
                                <th className="p-3 text-right font-medium">
                                  Avg Weight
                                </th>
                                <th className="p-3 text-right font-medium">
                                  In Funds
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {overlapData.commonHoldings
                                .slice(0, 20)
                                .map((holding, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-3">
                                      <div>
                                        <p className="font-medium">
                                          {holding.name}
                                        </p>
                                        {holding.ticker && (
                                          <p className="text-xs text-muted-foreground">
                                            {holding.ticker}
                                          </p>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                                        {holding.sector}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right font-medium">
                                      {holding.avgWeight.toFixed(2)}%
                                    </td>
                                    <td className="p-3 text-right">
                                      {Object.keys(holding.fundWeights).length}/
                                      {overlapData.funds.length}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Sector Overlap */}
                  {overlapData.sectorOverlap.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Sector Allocation</CardTitle>
                        <CardDescription>
                          Average sector exposure across your funds
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {overlapData.sectorOverlap
                            .slice(0, 10)
                            .map((sector, index) => (
                              <div key={index}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                  <span className="font-medium">
                                    {sector.sector}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {sector.avgAllocation.toFixed(1)}%
                                  </span>
                                </div>
                                <Progress
                                  value={sector.avgAllocation}
                                  className="h-2"
                                />
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
