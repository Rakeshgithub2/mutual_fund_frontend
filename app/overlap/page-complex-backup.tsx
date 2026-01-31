'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/header';
import { EnhancedFundSelector } from '@/components/enhanced-fund-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  GitCompare,
  AlertTriangle,
  CheckCircle,
  Info,
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Loader2,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';

interface FundOption {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
  riskLevel?: string;
}

interface Holding {
  name: string;
  ticker?: string;
  percentage: number;
  sector: string;
}

interface FundHoldings {
  [fundId: string]: Holding[];
}

interface CommonHolding {
  name: string;
  ticker?: string;
  sector: string;
  funds: { [fundId: string]: number };
  avgPercentage: number;
}

interface SectorAllocation {
  sector: string;
  funds: { [fundId: string]: number };
  avgPercentage: number;
}

export default function OverlapPage() {
  const [selectedFunds, setSelectedFunds] = useState<FundOption[]>([]);
  const [holdings, setHoldings] = useState<FundHoldings>({});
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // Fetch holdings for selected funds
  useEffect(() => {
    if (selectedFunds.length === 0) {
      setHoldings({});
      setAnalyzed(false);
      return;
    }

    const fetchHoldings = async () => {
      setLoading(true);
      try {
        const holdingsData: FundHoldings = {};
        
        await Promise.all(
          selectedFunds.map(async (fund) => {
            try {
              const response = await apiClient.getFundDetails(fund.id);
              if (response.success && response.data && response.data.holdings) {
                holdingsData[fund.id] = response.data.holdings.map((h: any) => ({
                  name: h.name || h.companyName || h.holding || 'Unknown',
                  ticker: h.ticker || h.symbol,
                  percentage: h.percentage || h.weight || 0,
                  sector: h.sector || h.industry || 'Other',
                }));
              } else {
                // Generate mock holdings for demonstration
                holdingsData[fund.id] = generateMockHoldings(fund);
              }
            } catch (error) {
              console.error(`Failed to fetch holdings for ${fund.id}:`, error);
              // Generate mock holdings as fallback
              holdingsData[fund.id] = generateMockHoldings(fund);
            }
          })
        );

        setHoldings(holdingsData);
      } catch (error) {
        console.error('Failed to fetch holdings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [selectedFunds]);

  // Generate mock holdings based on fund type
  const generateMockHoldings = (fund: FundOption): Holding[] => {
    const category = fund.category?.toLowerCase() || '';
    
    // Different holdings based on category
    if (category.includes('large')) {
      return [
        { name: 'Reliance Industries Ltd', sector: 'Energy', percentage: 8.5 },
        { name: 'HDFC Bank Ltd', sector: 'Financials', percentage: 7.2 },
        { name: 'Infosys Ltd', sector: 'IT', percentage: 6.8 },
        { name: 'ICICI Bank Ltd', sector: 'Financials', percentage: 6.5 },
        { name: 'TCS Ltd', sector: 'IT', percentage: 5.9 },
        { name: 'Hindustan Unilever Ltd', sector: 'FMCG', percentage: 5.3 },
        { name: 'Bharti Airtel Ltd', sector: 'Telecom', percentage: 4.8 },
        { name: 'Kotak Mahindra Bank', sector: 'Financials', percentage: 4.5 },
        { name: 'ITC Ltd', sector: 'FMCG', percentage: 4.2 },
        { name: 'Axis Bank Ltd', sector: 'Financials', percentage: 3.9 },
      ];
    } else if (category.includes('mid')) {
      return [
        { name: 'Dixon Technologies', sector: 'Electronics', percentage: 4.8 },
        { name: 'Tube Investments', sector: 'Industrials', percentage: 4.5 },
        { name: 'Polycab India', sector: 'Industrials', percentage: 4.2 },
        { name: 'PI Industries', sector: 'Chemicals', percentage: 3.9 },
        { name: 'Balkrishna Industries', sector: 'Auto Components', percentage: 3.7 },
        { name: 'Max Healthcare', sector: 'Healthcare', percentage: 3.5 },
        { name: 'Kalyan Jewellers', sector: 'Retail', percentage: 3.3 },
        { name: 'Trent Ltd', sector: 'Retail', percentage: 3.2 },
        { name: 'Zomato Ltd', sector: 'Consumer Services', percentage: 3.0 },
        { name: 'Muthoot Finance', sector: 'Financials', percentage: 2.9 },
      ];
    } else {
      return [
        { name: 'HDFC Bank Ltd', sector: 'Financials', percentage: 6.5 },
        { name: 'Infosys Ltd', sector: 'IT', percentage: 5.8 },
        { name: 'Reliance Industries', sector: 'Energy', percentage: 5.5 },
        { name: 'ICICI Bank Ltd', sector: 'Financials', percentage: 5.2 },
        { name: 'TCS Ltd', sector: 'IT', percentage: 4.9 },
        { name: 'Bharti Airtel', sector: 'Telecom', percentage: 4.5 },
        { name: 'Larsen & Toubro', sector: 'Infrastructure', percentage: 4.2 },
        { name: 'Asian Paints', sector: 'Consumer Durables', percentage: 3.9 },
        { name: 'Maruti Suzuki', sector: 'Automobile', percentage: 3.7 },
        { name: 'HCL Technologies', sector: 'IT', percentage: 3.5 },
      ];
    }
  };

  // Calculate common holdings
  const commonHoldings = useMemo((): CommonHolding[] => {
    if (Object.keys(holdings).length < 2) return [];

    const holdingMap = new Map<string, CommonHolding>();

    Object.entries(holdings).forEach(([fundId, fundHoldings]) => {
      fundHoldings.forEach((holding) => {
        const key = holding.name.toLowerCase().trim();
        
        if (!holdingMap.has(key)) {
          holdingMap.set(key, {
            name: holding.name,
            ticker: holding.ticker,
            sector: holding.sector,
            funds: {},
            avgPercentage: 0,
          });
        }

        const common = holdingMap.get(key)!;
        common.funds[fundId] = holding.percentage;
      });
    });

    // Filter to only common holdings (present in at least 2 funds)
    const commonOnly = Array.from(holdingMap.values())
      .filter((holding) => Object.keys(holding.funds).length >= 2)
      .map((holding) => ({
        ...holding,
        avgPercentage:
          Object.values(holding.funds).reduce((sum, pct) => sum + pct, 0) /
          Object.keys(holding.funds).length,
      }))
      .sort((a, b) => b.avgPercentage - a.avgPercentage);

    return commonOnly;
  }, [holdings]);

  // Calculate sector overlap
  const sectorOverlap = useMemo((): SectorAllocation[] => {
    if (Object.keys(holdings).length < 2) return [];

    const sectorMap = new Map<string, SectorAllocation>();

    Object.entries(holdings).forEach(([fundId, fundHoldings]) => {
      const sectorTotals = new Map<string, number>();

      fundHoldings.forEach((holding) => {
        const sector = holding.sector || 'Other';
        sectorTotals.set(sector, (sectorTotals.get(sector) || 0) + holding.percentage);
      });

      sectorTotals.forEach((percentage, sector) => {
        if (!sectorMap.has(sector)) {
          sectorMap.set(sector, {
            sector,
            funds: {},
            avgPercentage: 0,
          });
        }

        sectorMap.get(sector)!.funds[fundId] = percentage;
      });
    });

    return Array.from(sectorMap.values())
      .map((allocation) => ({
        ...allocation,
        avgPercentage:
          Object.values(allocation.funds).reduce((sum, pct) => sum + pct, 0) /
          Object.keys(allocation.funds).length,
      }))
      .sort((a, b) => b.avgPercentage - a.avgPercentage);
  }, [holdings]);

  // Calculate overlap percentage
  const overlapPercentage = useMemo(() => {
    if (commonHoldings.length === 0 || Object.keys(holdings).length < 2) return 0;

    // Average percentage of portfolio in common holdings
    const totalCommonWeight = commonHoldings.reduce((sum, h) => sum + h.avgPercentage, 0);
    
    // Normalize to 0-100 scale
    return Math.min(100, totalCommonWeight);
  }, [commonHoldings, holdings]);

  // Diversification score (inverse of overlap)
  const diversificationScore = useMemo(() => {
    return Math.max(0, 100 - overlapPercentage);
  }, [overlapPercentage]);

  const canAnalyze = selectedFunds.length >= 2 && selectedFunds.length <= 3;

  const getOverlapLevel = (percentage: number) => {
    if (percentage >= 70) return { level: 'Very High', color: 'text-red-600 dark:text-red-400', icon: AlertTriangle };
    if (percentage >= 50) return { level: 'High', color: 'text-orange-600 dark:text-orange-400', icon: AlertTriangle };
    if (percentage >= 30) return { level: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', icon: Info };
    if (percentage >= 15) return { level: 'Low', color: 'text-blue-600 dark:text-blue-400', icon: CheckCircle };
    return { level: 'Very Low', color: 'text-green-600 dark:text-green-400', icon: CheckCircle };
  };

  const overlapInfo = getOverlapLevel(overlapPercentage);
  const OverlapIcon = overlapInfo.icon;

  // Prepare sector chart data
  const sectorChartData = sectorOverlap.slice(0, 8).map((sector) => ({
    name: sector.sector,
    value: Number(sector.avgPercentage.toFixed(1)),
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button */}
      <Link
        href="/"
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Portfolio Overlap Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Check portfolio overlap and diversification between mutual funds
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fund Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EnhancedFundSelector
            onSelectionChange={setSelectedFunds}
            minSelection={2}
            maxSelection={3}
            placeholder="Search funds to check overlap... (e.g., HDFC Top 100, Parag Parikh Flexi Cap)"
            mode="overlap"
          />
        </motion.div>

        {/* Analyze Button */}
        {canAnalyze && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Button
              size="lg"
              onClick={() => {
                setAnalyzed(true);
                window.scrollTo({ top: document.getElementById('overlap-results')?.offsetTop, behavior: 'smooth' });
              }}
              disabled={!canAnalyze || loading}
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing Holdings...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Overlap
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Overlap Results */}
        {analyzed && selectedFunds.length >= 2 && !loading && (
          <motion.div
            id="overlap-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-8"
          >
            {/* Overlap Score Card */}
            <Card className={`p-8 border-4 ${
              overlapPercentage >= 50
                ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                : overlapPercentage >= 30
                ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800'
                : 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    overlapPercentage >= 50
                      ? 'bg-red-100 dark:bg-red-900/50'
                      : overlapPercentage >= 30
                      ? 'bg-yellow-100 dark:bg-yellow-900/50'
                      : 'bg-green-100 dark:bg-green-900/50'
                  }`}>
                    <OverlapIcon className={`w-8 h-8 ${overlapInfo.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Portfolio Overlap Score
                    </h2>
                    <p className={`text-lg font-semibold ${overlapInfo.color}`}>
                      {overlapInfo.level} Overlap
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                    {overlapPercentage.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Common Holdings Weight
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {diversificationScore.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Diversification Score
                  </p>
                </div>
              </div>

              {/* Interpretation */}
              <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {overlapPercentage >= 70 && (
                    <>
                      <strong className="text-red-600 dark:text-red-400">⚠️ Very High Overlap:</strong> These funds have substantial common holdings. Consider replacing one with a different category fund for better diversification.
                    </>
                  )}
                  {overlapPercentage >= 50 && overlapPercentage < 70 && (
                    <>
                      <strong className="text-orange-600 dark:text-orange-400">⚠️ High Overlap:</strong> Significant overlap detected. These funds may not provide optimal diversification benefits.
                    </>
                  )}
                  {overlapPercentage >= 30 && overlapPercentage < 50 && (
                    <>
                      <strong className="text-yellow-600 dark:text-yellow-400">ℹ️ Moderate Overlap:</strong> Some common holdings exist. This is acceptable if funds have different investment styles or market cap focus.
                    </>
                  )}
                  {overlapPercentage < 30 && (
                    <>
                      <strong className="text-green-600 dark:text-green-400">✅ Good Diversification:</strong> These funds have limited overlap, providing good portfolio diversification across different stocks.
                    </>
                  )}
                </p>
              </div>
            </Card>

            {/* Common Holdings */}
            {commonHoldings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Common Holdings ({commonHoldings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Stock/Company</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Sector</th>
                          {selectedFunds.map((fund, idx) => (
                            <th key={fund.id} className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Fund {idx + 1}
                            </th>
                          ))}
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Avg %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commonHoldings.slice(0, 15).map((holding, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{holding.name}</p>
                                {holding.ticker && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{holding.ticker}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">{holding.sector}</Badge>
                            </td>
                            {selectedFunds.map((fund) => (
                              <td key={fund.id} className="py-3 px-4 text-right">
                                <span className={`font-semibold text-sm ${
                                  holding.funds[fund.id]
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 dark:text-gray-600'
                                }`}>
                                  {holding.funds[fund.id]?.toFixed(2) || '-'}%
                                </span>
                              </td>
                            ))}
                            <td className="py-3 px-4 text-right">
                              <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                                {holding.avgPercentage.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {commonHoldings.length > 15 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                      Showing top 15 of {commonHoldings.length} common holdings
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sector Overlap */}
            {sectorOverlap.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Sector Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-purple-600" />
                      Sector Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={sectorChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sectorChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Sector Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-purple-600" />
                      Sector Overlap Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {sectorOverlap.slice(0, 10).map((sector, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                              {sector.sector}
                            </p>
                            <div className="flex gap-2">
                              {selectedFunds.map((fund, fundIdx) => (
                                <span key={fund.id} className="text-xs text-gray-600 dark:text-gray-400">
                                  F{fundIdx + 1}: {sector.funds[fund.id]?.toFixed(1) || '0'}%
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              {sector.avgPercentage.toFixed(1)}%
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">avg</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* No Common Holdings */}
            {commonHoldings.length === 0 && (
              <Card className="p-8 bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Excellent Diversification!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    These funds have no common holdings, providing maximum portfolio diversification.
                  </p>
                </div>
              </Card>
            )}

            {/* Educational Tooltip */}
            <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    💡 Understanding Portfolio Overlap
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>What is Overlap?</strong> When multiple funds hold the same stocks, reducing diversification benefits.</p>
                    <p><strong>Why It Matters:</strong> High overlap (50%+) means you're essentially investing in the same companies multiple times.</p>
                    <p><strong>Ideal Scenario:</strong> Overlap below 30% ensures good diversification across different stocks and sectors.</p>
                    <p><strong>Action:</strong> If overlap is high, consider replacing one fund with a different category (e.g., swap mid-cap for small-cap).</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
