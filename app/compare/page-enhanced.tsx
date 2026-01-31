'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface FundComparison {
  id: string;
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  currentNav: number;
  returns?: {
    oneMonth?: number;
    threeMonth?: number;
    sixMonth?: number;
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  aum?: number;
  expenseRatio?: number;
  exitLoad?: string;
  minimumInvestment?: number;
  riskLevel?: string;
}

interface ComparisonResult {
  funds: FundComparison[];
  comparison: {
    bestReturns: {
      oneYear: string;
      threeYear: string;
      fiveYear: string;
    };
    lowestExpense: string;
    highestAUM: string;
    bestRiskAdjusted: string;
  };
}

export default function CompareEnhancedPage() {
  const router = useRouter();
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddFund = (fundId: string) => {
    if (!selectedFunds.includes(fundId)) {
      setSelectedFunds([...selectedFunds, fundId]);
    }
  };

  const handleRemoveFund = (fundId: string) => {
    setSelectedFunds(selectedFunds.filter((id) => id !== fundId));
    if (comparisonData) {
      setComparisonData(null); // Clear comparison when removing a fund
    }
  };

  const handleCompare = async () => {
    if (selectedFunds.length < 2) {
      setError('Please select at least 2 funds to compare');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch detailed data for each fund
      const fundPromises = selectedFunds.map((fundId) =>
        api.get(`/funds/${fundId}`)
      );

      const responses = await Promise.all(fundPromises);
      const funds = responses.map((response) => response.data);

      // Calculate best performers
      const oneYearReturns = funds
        .filter((f) => f.returns?.oneYear)
        .sort((a, b) => (b.returns?.oneYear || 0) - (a.returns?.oneYear || 0));
      const threeYearReturns = funds
        .filter((f) => f.returns?.threeYear)
        .sort(
          (a, b) => (b.returns?.threeYear || 0) - (a.returns?.threeYear || 0)
        );
      const fiveYearReturns = funds
        .filter((f) => f.returns?.fiveYear)
        .sort(
          (a, b) => (b.returns?.fiveYear || 0) - (a.returns?.fiveYear || 0)
        );

      const lowestExpense = [...funds]
        .filter((f) => f.expenseRatio)
        .sort((a, b) => (a.expenseRatio || 999) - (b.expenseRatio || 999))[0];

      const highestAUM = [...funds]
        .filter((f) => f.aum)
        .sort((a, b) => (b.aum || 0) - (a.aum || 0))[0];

      setComparisonData({
        funds,
        comparison: {
          bestReturns: {
            oneYear: oneYearReturns[0]?.fundId || '',
            threeYear: threeYearReturns[0]?.fundId || '',
            fiveYear: fiveYearReturns[0]?.fundId || '',
          },
          lowestExpense: lowestExpense?.fundId || '',
          highestAUM: highestAUM?.fundId || '',
          bestRiskAdjusted: oneYearReturns[0]?.fundId || '', // Simplified
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Comparison failed');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setSelectedFunds([]);
    setComparisonData(null);
    setError('');
  };

  const isBest = (
    fundId: string,
    metric: keyof ComparisonResult['comparison']
  ) => {
    if (!comparisonData) return false;

    if (metric === 'bestReturns') {
      const bestReturns = comparisonData.comparison.bestReturns;
      return (
        fundId === bestReturns.oneYear ||
        fundId === bestReturns.threeYear ||
        fundId === bestReturns.fiveYear
      );
    }

    return comparisonData.comparison[metric] === fundId;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Compare Mutual Funds</h1>
            <p className="mt-2 text-muted-foreground">
              Select 2-5 funds to compare their performance, costs, and features
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
                title="Select Funds to Compare"
              />

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleCompare}
                  disabled={loading || selectedFunds.length < 2}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    'Compare Funds'
                  )}
                </Button>
                {selectedFunds.length > 0 && (
                  <Button variant="outline" onClick={handleClearAll}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Comparison Results */}
            <div className="lg:col-span-2">
              {!comparisonData && selectedFunds.length === 0 && (
                <Card>
                  <CardContent className="flex h-[400px] items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        Select at least 2 funds to start comparison
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {comparisonData && (
                <div className="space-y-6">
                  {/* Comparison Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Side-by-Side Comparison</CardTitle>
                      <CardDescription>
                        Key metrics comparison across selected funds
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="p-3 text-left font-medium">
                                Metric
                              </th>
                              {comparisonData.funds.map((fund) => (
                                <th
                                  key={fund.fundId}
                                  className="p-3 text-left font-medium"
                                >
                                  <div className="max-w-[200px]">
                                    <p className="truncate text-sm">
                                      {fund.name}
                                    </p>
                                    <p className="text-xs font-normal text-muted-foreground">
                                      {fund.fundHouse}
                                    </p>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {/* NAV */}
                            <tr className="border-b">
                              <td className="p-3 font-medium">Current NAV</td>
                              {comparisonData.funds.map((fund) => (
                                <td key={fund.fundId} className="p-3">
                                  ₹{fund.currentNav?.toFixed(2)}
                                </td>
                              ))}
                            </tr>

                            {/* 1 Year Returns */}
                            <tr className="border-b bg-muted/50">
                              <td className="p-3 font-medium">1 Year Return</td>
                              {comparisonData.funds.map((fund) => (
                                <td
                                  key={fund.fundId}
                                  className={`p-3 ${
                                    fund.fundId ===
                                    comparisonData.comparison.bestReturns
                                      .oneYear
                                      ? 'font-bold text-green-600 dark:text-green-500'
                                      : ''
                                  }`}
                                >
                                  {fund.returns?.oneYear !== undefined ? (
                                    <div className="flex items-center gap-1">
                                      {fund.returns.oneYear > 0 ? (
                                        <TrendingUp className="h-4 w-4" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4" />
                                      )}
                                      {fund.returns.oneYear.toFixed(2)}%
                                    </div>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              ))}
                            </tr>

                            {/* 3 Year Returns */}
                            <tr className="border-b">
                              <td className="p-3 font-medium">3 Year Return</td>
                              {comparisonData.funds.map((fund) => (
                                <td
                                  key={fund.fundId}
                                  className={`p-3 ${
                                    fund.fundId ===
                                    comparisonData.comparison.bestReturns
                                      .threeYear
                                      ? 'font-bold text-green-600 dark:text-green-500'
                                      : ''
                                  }`}
                                >
                                  {fund.returns?.threeYear !== undefined ? (
                                    <div className="flex items-center gap-1">
                                      {fund.returns.threeYear > 0 ? (
                                        <TrendingUp className="h-4 w-4" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4" />
                                      )}
                                      {fund.returns.threeYear.toFixed(2)}%
                                    </div>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              ))}
                            </tr>

                            {/* 5 Year Returns */}
                            <tr className="border-b bg-muted/50">
                              <td className="p-3 font-medium">5 Year Return</td>
                              {comparisonData.funds.map((fund) => (
                                <td
                                  key={fund.fundId}
                                  className={`p-3 ${
                                    fund.fundId ===
                                    comparisonData.comparison.bestReturns
                                      .fiveYear
                                      ? 'font-bold text-green-600 dark:text-green-500'
                                      : ''
                                  }`}
                                >
                                  {fund.returns?.fiveYear !== undefined ? (
                                    <div className="flex items-center gap-1">
                                      {fund.returns.fiveYear > 0 ? (
                                        <TrendingUp className="h-4 w-4" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4" />
                                      )}
                                      {fund.returns.fiveYear.toFixed(2)}%
                                    </div>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              ))}
                            </tr>

                            {/* AUM */}
                            <tr className="border-b">
                              <td className="p-3 font-medium">AUM</td>
                              {comparisonData.funds.map((fund) => (
                                <td
                                  key={fund.fundId}
                                  className={`p-3 ${
                                    fund.fundId ===
                                    comparisonData.comparison.highestAUM
                                      ? 'font-bold text-blue-600 dark:text-blue-500'
                                      : ''
                                  }`}
                                >
                                  {fund.aum
                                    ? `₹${(fund.aum / 1000).toFixed(1)}K Cr`
                                    : 'N/A'}
                                </td>
                              ))}
                            </tr>

                            {/* Expense Ratio */}
                            <tr className="border-b bg-muted/50">
                              <td className="p-3 font-medium">Expense Ratio</td>
                              {comparisonData.funds.map((fund) => (
                                <td
                                  key={fund.fundId}
                                  className={`p-3 ${
                                    fund.fundId ===
                                    comparisonData.comparison.lowestExpense
                                      ? 'font-bold text-green-600 dark:text-green-500'
                                      : ''
                                  }`}
                                >
                                  {fund.expenseRatio !== undefined
                                    ? `${fund.expenseRatio.toFixed(2)}%`
                                    : 'N/A'}
                                </td>
                              ))}
                            </tr>

                            {/* Risk Level */}
                            <tr className="border-b">
                              <td className="p-3 font-medium">Risk Level</td>
                              {comparisonData.funds.map((fund) => (
                                <td key={fund.fundId} className="p-3">
                                  <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                      fund.riskLevel === 'HIGH'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : fund.riskLevel === 'MEDIUM'
                                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}
                                  >
                                    {fund.riskLevel || 'N/A'}
                                  </span>
                                </td>
                              ))}
                            </tr>

                            {/* Min Investment */}
                            <tr className="border-b bg-muted/50">
                              <td className="p-3 font-medium">
                                Min Investment
                              </td>
                              {comparisonData.funds.map((fund) => (
                                <td key={fund.fundId} className="p-3">
                                  {fund.minimumInvestment
                                    ? `₹${fund.minimumInvestment.toLocaleString()}`
                                    : 'N/A'}
                                </td>
                              ))}
                            </tr>

                            {/* Exit Load */}
                            <tr>
                              <td className="p-3 font-medium">Exit Load</td>
                              {comparisonData.funds.map((fund) => (
                                <td key={fund.fundId} className="p-3 text-sm">
                                  {fund.exitLoad || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {comparisonData.funds.map((fund) => (
                      <Button
                        key={fund.fundId}
                        variant="outline"
                        onClick={() => router.push(`/equity/${fund.fundId}`)}
                        className="flex-1"
                      >
                        View {fund.name.split(' ')[0]} Details
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
