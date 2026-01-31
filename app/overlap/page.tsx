'use client';

export const dynamic = 'force-dynamic';

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
  PieChart as PieChartIcon,
  Target,
  Sparkles,
  Loader2,
  TrendingUp,
  Building2,
  Activity,
  Layers,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  useFundSelectionStore,
  useOverlapFunds,
  MIN_FUNDS,
  MAX_FUNDS,
  type SelectedFund,
} from '@/stores/fund-selection-store';

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

export default function OverlapPage() {
  // Use global state for fund selection (persists across navigation)
  const {
    funds: selectedFunds,
    remove: removeFund,
    clear: clearFunds,
    canAnalyze: canAnalyzeOverlap,
  } = useOverlapFunds();
  const store = useFundSelectionStore();

  const [holdings, setHoldings] = useState<Record<string, Holding[]>>({});
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // Handle selection changes from EnhancedFundSelector
  const handleSelectionChange = (funds: FundOption[]) => {
    // Sync with global store
    const currentSchemeCodes = new Set(selectedFunds.map((f) => f.schemeCode));
    const newSchemeCodes = new Set(funds.map((f) => f.id));

    // Add new funds
    funds.forEach((fund) => {
      if (!currentSchemeCodes.has(fund.id)) {
        store.addToOverlap({
          ...fund,
          schemeCode: fund.id,
        } as SelectedFund);
      }
    });

    // Remove deselected funds
    selectedFunds.forEach((fund) => {
      if (!newSchemeCodes.has(fund.schemeCode)) {
        store.removeFromOverlap(fund.schemeCode);
      }
    });
  };

  // Generate mock holdings for demo
  const generateMockHoldings = (fund: FundOption): Holding[] => {
    const category = fund.category?.toLowerCase() || '';

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
        { name: 'HDFC Bank Ltd', sector: 'Financials', percentage: 3.7 },
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

  // Fetch holdings when funds are selected
  useEffect(() => {
    if (selectedFunds.length === 0) {
      setHoldings({});
      setAnalyzed(false);
      return;
    }
  }, [selectedFunds]);

  // Analyze overlap
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const holdingsData: Record<string, Holding[]> = {};

      await Promise.all(
        selectedFunds.map(async (fund) => {
          try {
            // Try multiple sources for holdings data
            // 1. First try dedicated holdings endpoint
            let holdings: Holding[] = [];

            try {
              const holdingsResponse = await apiClient.getFundHoldings(fund.id);
              if (
                holdingsResponse.success &&
                holdingsResponse.data?.holdings?.length > 0
              ) {
                holdings = holdingsResponse.data.holdings.map((h: any) => ({
                  name: h.name || h.companyName || h.holding || 'Unknown',
                  ticker: h.ticker || h.symbol,
                  percentage: h.percentage || h.weight || h.percent || 0,
                  sector: h.sector || h.industry || 'Other',
                }));
              }
            } catch (e) {
              console.log(
                `Holdings endpoint failed for ${fund.id}, trying fund details`
              );
            }

            // 2. If no holdings, try fund details endpoint
            if (holdings.length === 0) {
              const response = await apiClient.getFundById(fund.id);
              if (response.success && response.data) {
                const fundData = response.data;
                // Try various field names for holdings
                const holdingsList =
                  fundData.holdings ||
                  fundData.topHoldings ||
                  fundData.portfolio ||
                  fundData.equityHoldings ||
                  [];
                if (Array.isArray(holdingsList) && holdingsList.length > 0) {
                  holdings = holdingsList.map((h: any) => ({
                    name:
                      h.name ||
                      h.companyName ||
                      h.holding ||
                      h.stockName ||
                      'Unknown',
                    ticker: h.ticker || h.symbol || h.isin,
                    percentage:
                      h.percentage ||
                      h.weight ||
                      h.percent ||
                      h.allocation ||
                      0,
                    sector: h.sector || h.industry || h.sectorName || 'Other',
                  }));
                }
              }
            }

            // 3. Fall back to mock data only if API completely fails
            if (holdings.length === 0) {
              console.warn(
                `No holdings found for fund ${fund.id}, using category-based estimates`
              );
              holdings = generateMockHoldings(fund);
            }

            holdingsData[fund.id] = holdings;
          } catch (error) {
            console.error(`Failed to fetch holdings for ${fund.id}:`, error);
            holdingsData[fund.id] = generateMockHoldings(fund);
          }
        })
      );

      setHoldings(holdingsData);
      setAnalyzed(true);
    } catch (error) {
      console.error('Failed to fetch holdings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overlap analysis
  const overlapAnalysis = useMemo(() => {
    if (Object.keys(holdings).length < 2) return null;

    const holdingMap = new Map<
      string,
      { funds: Set<string>; percentages: number[]; sectors: Set<string> }
    >();

    Object.entries(holdings).forEach(([fundId, fundHoldings]) => {
      fundHoldings.forEach((holding) => {
        const key = holding.name.toLowerCase().trim();
        if (!holdingMap.has(key)) {
          holdingMap.set(key, {
            funds: new Set(),
            percentages: [],
            sectors: new Set(),
          });
        }
        const data = holdingMap.get(key)!;
        data.funds.add(fundId);
        data.percentages.push(holding.percentage);
        data.sectors.add(holding.sector);
      });
    });

    const commonHoldings = Array.from(holdingMap.entries())
      .filter(([_, data]) => data.funds.size >= 2)
      .map(([name, data]) => ({
        name,
        fundCount: data.funds.size,
        avgPercentage:
          data.percentages.reduce((sum, p) => sum + p, 0) /
          data.percentages.length,
        sector: Array.from(data.sectors)[0],
      }))
      .sort((a, b) => b.avgPercentage - a.avgPercentage);

    const overlapPercentage = Math.min(
      100,
      commonHoldings.reduce((sum, h) => sum + h.avgPercentage, 0)
    );

    // Sector overlap analysis
    const sectorMap = new Map<string, { funds: Set<string>; weight: number }>();
    Object.entries(holdings).forEach(([fundId, fundHoldings]) => {
      const sectorWeights = new Map<string, number>();
      fundHoldings.forEach((holding) => {
        const current = sectorWeights.get(holding.sector) || 0;
        sectorWeights.set(holding.sector, current + holding.percentage);
      });

      sectorWeights.forEach((weight, sector) => {
        if (!sectorMap.has(sector)) {
          sectorMap.set(sector, { funds: new Set(), weight: 0 });
        }
        const data = sectorMap.get(sector)!;
        data.funds.add(fundId);
        data.weight += weight;
      });
    });

    const commonSectors = Array.from(sectorMap.entries())
      .filter(([_, data]) => data.funds.size >= 2)
      .map(([sector, data]) => ({
        sector,
        fundCount: data.funds.size,
        avgWeight: data.weight / data.funds.size,
      }))
      .sort((a, b) => b.avgWeight - a.avgWeight);

    return {
      commonHoldings,
      commonSectors,
      overlapPercentage,
      diversificationScore: Math.max(0, 100 - overlapPercentage),
      totalCommonStocks: commonHoldings.length,
      totalCommonSectors: commonSectors.length,
    };
  }, [holdings]);

  const canAnalyze =
    selectedFunds.length >= MIN_FUNDS && selectedFunds.length <= MAX_FUNDS;

  const getOverlapLevel = (percentage: number) => {
    if (percentage >= 70)
      return {
        level: 'Very High',
        color: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-300',
      };
    if (percentage >= 50)
      return {
        level: 'High',
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-300',
      };
    if (percentage >= 30)
      return {
        level: 'Moderate',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-300',
      };
    return {
      level: 'Low',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-300',
    };
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return `₹${(num / 1000).toFixed(1)}k Cr`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(2)}k Cr`;
    return `₹${num.toFixed(0)} Cr`;
  };

  const insights = useMemo(() => {
    if (!overlapAnalysis) return null;

    const level = getOverlapLevel(overlapAnalysis.overlapPercentage);
    const messages = [];

    if (overlapAnalysis.overlapPercentage >= 50) {
      messages.push({
        type: 'warning',
        text: `High overlap detected! ${overlapAnalysis.totalCommonStocks} stocks appear in multiple funds.`,
      });
      messages.push({
        type: 'info',
        text: 'Consider adding funds from different sectors or categories for better diversification.',
      });
    } else if (overlapAnalysis.overlapPercentage >= 30) {
      messages.push({
        type: 'info',
        text: `Moderate overlap with ${overlapAnalysis.totalCommonStocks} common holdings.`,
      });
      messages.push({
        type: 'success',
        text: 'Your portfolio shows reasonable diversification.',
      });
    } else {
      messages.push({
        type: 'success',
        text: `Excellent diversification! Only ${overlapAnalysis.totalCommonStocks} common holdings.`,
      });
      messages.push({
        type: 'info',
        text: 'Your funds invest in different stocks, reducing concentration risk.',
      });
    }

    return { level, messages };
  }, [overlapAnalysis]);

  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Fixed Back Button */}
      <Link
        href="/"
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
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
                Analyze 2-5 equity/debt funds for portfolio overlap
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
            onSelectionChange={handleSelectionChange}
            minSelection={MIN_FUNDS}
            maxSelection={MAX_FUNDS}
            placeholder="Search by fund name, AMC, category..."
            mode="overlap"
            initialSelection={selectedFunds.map((f) => ({
              id: f.schemeCode || f.id,
              name: f.name,
              fundHouse: f.fundHouse,
              category: f.category,
              subCategory: f.subCategory,
              nav: f.nav,
              returns1Y: f.returns1Y,
              returns3Y: f.returns3Y,
              returns5Y: f.returns5Y,
              aum: f.aum,
              expenseRatio: f.expenseRatio,
              rating: f.rating,
              riskLevel: f.riskLevel,
            }))}
          />
        </motion.div>

        {/* Selected Funds Pills */}
        {selectedFunds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Selected ({selectedFunds.length}/{MAX_FUNDS}):
              </span>
              {selectedFunds.map((fund) => (
                <Badge
                  key={fund.schemeCode}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                >
                  <span className="max-w-[200px] truncate">{fund.name}</span>
                  <button
                    onClick={() => removeFund(fund.schemeCode)}
                    className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {selectedFunds.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFunds}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear All
                </Button>
              )}
            </div>
          </motion.div>
        )}

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
                handleAnalyze();
                setAnalyzed(true);
                setTimeout(() => {
                  window.scrollTo({
                    top:
                      document.getElementById('overlap-results')?.offsetTop ||
                      0,
                    behavior: 'smooth',
                  });
                }, 100);
              }}
              disabled={!canAnalyze || loading}
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing Overlap...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Portfolio Overlap
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Overlap Results */}
        {analyzed && overlapAnalysis && !loading && (
          <motion.div
            id="overlap-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-8"
          >
            {/* Quick Insights */}
            {insights && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Overlap Analysis Insights
                    </h3>
                    <div className="space-y-2">
                      {insights.messages.map((msg, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {msg.type === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          )}
                          {msg.type === 'warning' && (
                            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          )}
                          {msg.type === 'info' && (
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          )}
                          <p className="text-gray-700 dark:text-gray-300">
                            {msg.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Overlap Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overlap Percentage */}
              <Card
                className={`p-6 ${getOverlapLevel(overlapAnalysis.overlapPercentage).bg} border-2 ${getOverlapLevel(overlapAnalysis.overlapPercentage).border}`}
              >
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Portfolio Overlap
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-center">
                    <div
                      className={`text-5xl font-bold ${getOverlapLevel(overlapAnalysis.overlapPercentage).color} mb-2`}
                    >
                      {overlapAnalysis.overlapPercentage.toFixed(1)}%
                    </div>
                    <Badge
                      className={`${getOverlapLevel(overlapAnalysis.overlapPercentage).color} text-sm px-3 py-1`}
                    >
                      {getOverlapLevel(overlapAnalysis.overlapPercentage).level}{' '}
                      Overlap
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Common Stocks */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Common Stocks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {overlapAnalysis.totalCommonStocks}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stocks in multiple funds
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Diversification Score */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Diversification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {overlapAnalysis.diversificationScore.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Portfolio diversity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Common Holdings Table */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b-2 border-blue-100 dark:border-blue-900">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Common Stock Holdings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                          Stock Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                          Sector
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                          # of Funds
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                          Avg. Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {overlapAnalysis.commonHoldings.map((holding, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {holding.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {holding.sector}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {holding.fundCount}/{selectedFunds.length}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                            {holding.avgPercentage.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Common Sectors */}
            {overlapAnalysis.commonSectors.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b-2 border-green-100 dark:border-green-900">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <PieChartIcon className="w-6 h-6 text-green-600" />
                    Common Sector Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={overlapAnalysis.commonSectors.map(
                              (s, idx) => ({
                                name: s.sector,
                                value: s.avgWeight,
                              })
                            )}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) =>
                              `${entry.name} (${entry.value.toFixed(1)}%)`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {overlapAnalysis.commonSectors.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Sector List */}
                    <div className="space-y-3">
                      {overlapAnalysis.commonSectors.map((sector, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: COLORS[idx % COLORS.length],
                              }}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {sector.sector}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {sector.fundCount}/{selectedFunds.length} funds
                            </Badge>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {sector.avgWeight.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
