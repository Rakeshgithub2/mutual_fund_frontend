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
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Target,
  Shield,
  Users,
  Building2,
  Star,
  Percent,
  Calendar,
  Loader2,
  BookOpen,
  Sparkles,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import {
  useFundSelectionStore,
  useCompareFunds,
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

interface FundDetailedInfo extends FundOption {
  exitLoad?: string;
  benchmark?: string;
  fundManager?: string;
  minInvestment?: number;
  minSIP?: number;
  inceptionDate?: string;
  sharpeRatio?: number;
  alpha?: number;
  beta?: number;
}

export default function ComparePage() {
  // Use global state for fund selection (persists across navigation)
  const {
    funds: selectedFunds,
    remove: removeFund,
    clear: clearFunds,
    canCompare,
  } = useCompareFunds();
  const store = useFundSelectionStore();

  const [detailedInfo, setDetailedInfo] = useState<
    Record<string, FundDetailedInfo>
  >({});
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
        store.addToCompare({
          ...fund,
          schemeCode: fund.id,
        } as SelectedFund);
      }
    });

    // Remove deselected funds
    selectedFunds.forEach((fund) => {
      if (!newSchemeCodes.has(fund.schemeCode)) {
        store.removeFromCompare(fund.schemeCode);
      }
    });
  };

  // Fetch detailed information for selected funds
  useEffect(() => {
    if (selectedFunds.length === 0) {
      setDetailedInfo({});
      setAnalyzed(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details: Record<string, FundDetailedInfo> = {};

        await Promise.all(
          selectedFunds.map(async (fund) => {
            const fundKey = fund.schemeCode || fund.id;
            try {
              const response = await apiClient.getFundById(fundKey);
              if (response.success && response.data) {
                const data = response.data;
                details[fundKey] = {
                  ...fund,
                  id: fundKey,
                  exitLoad: data.exitLoad || 'N/A',
                  benchmark: data.benchmark || data.category || 'N/A',
                  fundManager:
                    typeof data.fundManager === 'object'
                      ? data.fundManager?.name || 'Not Available'
                      : data.fundManager || 'Not Available',
                  minInvestment: data.minInvestment || 5000,
                  minSIP: data.minSIP || 500,
                  inceptionDate: data.inceptionDate || 'N/A',
                  sharpeRatio:
                    data.sharpeRatio ||
                    (fund.returns3Y > 0 ? fund.returns3Y / 10 : 0),
                  alpha:
                    data.alpha ||
                    (fund.returns3Y > 10 ? fund.returns3Y - 10 : 0),
                  beta: data.beta || 1.0,
                };
              } else {
                // Fallback to basic info if detailed fetch fails
                details[fundKey] = {
                  ...fund,
                  id: fundKey,
                  exitLoad: '1% (if redeemed within 1 year)',
                  benchmark: fund.category,
                  fundManager: 'Not Available',
                  minInvestment: 5000,
                  minSIP: 500,
                  inceptionDate: 'N/A',
                  sharpeRatio: fund.returns3Y > 0 ? fund.returns3Y / 10 : 0,
                  alpha: fund.returns3Y > 10 ? fund.returns3Y - 10 : 0,
                  beta: 1.0,
                };
              }
            } catch (error) {
              console.error(`Failed to fetch details for ${fundKey}:`, error);
              // Use fallback data
              details[fundKey] = {
                ...fund,
                id: fundKey,
                exitLoad: '1% (if redeemed within 1 year)',
                benchmark: fund.category,
                fundManager: 'Not Available',
                minInvestment: 5000,
                minSIP: 500,
                inceptionDate: 'N/A',
                sharpeRatio: fund.returns3Y > 0 ? fund.returns3Y / 10 : 0,
                alpha: fund.returns3Y > 10 ? fund.returns3Y - 10 : 0,
                beta: 1.0,
              };
            }
          })
        );

        setDetailedInfo(details);
      } catch (error) {
        console.error('Failed to fetch fund details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedFunds]);

  const canAnalyze =
    selectedFunds.length >= MIN_FUNDS && selectedFunds.length <= MAX_FUNDS;

  // Analysis insights
  const insights = useMemo(() => {
    if (selectedFunds.length < MIN_FUNDS) return null;

    const funds = selectedFunds.map(
      (f) => detailedInfo[f.schemeCode || f.id] || f
    );

    const avgReturns1Y =
      funds.reduce((sum, f) => sum + f.returns1Y, 0) / funds.length;
    const avgReturns3Y =
      funds.reduce((sum, f) => sum + f.returns3Y, 0) / funds.length;
    const avgReturns5Y =
      funds.reduce((sum, f) => sum + f.returns5Y, 0) / funds.length;
    const avgExpenseRatio =
      funds.reduce((sum, f) => sum + f.expenseRatio, 0) / funds.length;
    const avgAUM = funds.reduce((sum, f) => sum + f.aum, 0) / funds.length;

    const bestPerformer1Y = funds.reduce(
      (best, f) => (f.returns1Y > best.returns1Y ? f : best),
      funds[0]
    );
    const bestPerformer3Y = funds.reduce(
      (best, f) => (f.returns3Y > best.returns3Y ? f : best),
      funds[0]
    );
    const bestPerformer5Y = funds.reduce(
      (best, f) => (f.returns5Y > best.returns5Y ? f : best),
      funds[0]
    );
    const lowestExpense = funds.reduce(
      (low, f) => (f.expenseRatio < low.expenseRatio ? f : low),
      funds[0]
    );
    const highestAUM = funds.reduce(
      (high, f) => (f.aum > high.aum ? f : high),
      funds[0]
    );

    const categories = [...new Set(funds.map((f) => f.category))];
    const fundHouses = [...new Set(funds.map((f) => f.fundHouse))];

    return {
      avgReturns1Y,
      avgReturns3Y,
      avgReturns5Y,
      avgExpenseRatio,
      avgAUM,
      bestPerformer1Y,
      bestPerformer3Y,
      bestPerformer5Y,
      lowestExpense,
      highestAUM,
      categories,
      fundHouses,
      sameFundHouse: fundHouses.length === 1,
      sameCategory: categories.length === 1,
    };
  }, [selectedFunds, detailedInfo]);

  const formatNumber = (num: number) => {
    if (num >= 10000) return `₹${(num / 1000).toFixed(1)}k Cr`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(2)}k Cr`;
    return `₹${num.toFixed(0)} Cr`;
  };

  const formatCurrency = (num: number) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
    return `₹${num}`;
  };

  const getRiskColor = (risk?: string) => {
    const r = risk?.toLowerCase() || 'moderate';
    if (r.includes('high'))
      return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400';
    if (r.includes('low'))
      return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400';
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400';
  };

  const getReturnColor = (value: number) => {
    if (value >= 15)
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
    if (value >= 10)
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
    if (value >= 5)
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
  };

  const getExpenseColor = (value: number) => {
    if (value <= 0.5) return 'text-green-600 dark:text-green-400';
    if (value <= 1.0) return 'text-blue-600 dark:text-blue-400';
    if (value <= 1.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Fund Comparison
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Compare 2-5 equity and debt mutual funds side-by-side
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
            placeholder="Search by fund name, AMC, category... (e.g., HDFC Top 100, ICICI Bluechip)"
            mode="compare"
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
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                >
                  <span className="max-w-[200px] truncate">{fund.name}</span>
                  <button
                    onClick={() => removeFund(fund.schemeCode)}
                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
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
                setAnalyzed(true);
                window.scrollTo({
                  top: document.getElementById('comparison-results')?.offsetTop,
                  behavior: 'smooth',
                });
              }}
              disabled={!canAnalyze || loading}
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading Fund Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Funds
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Comparison Results */}
        {analyzed && selectedFunds.length >= 2 && !loading && (
          <motion.div
            id="comparison-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-8"
          >
            {/* Quick Insights */}
            {insights && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Quick Insights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong className="text-green-600 dark:text-green-400">
                            Best 5Y Performer:
                          </strong>{' '}
                          {insights.bestPerformer5Y.name.substring(0, 50)}... (
                          {insights.bestPerformer5Y.returns5Y.toFixed(1)}%)
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong className="text-blue-600 dark:text-blue-400">
                            Lowest Cost:
                          </strong>{' '}
                          {insights.lowestExpense.name.substring(0, 50)}... (
                          {insights.lowestExpense.expenseRatio.toFixed(2)}%)
                        </p>
                        {insights.sameFundHouse && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <Info className="w-4 h-4 inline mr-1" />
                            All funds from{' '}
                            <strong>{insights.fundHouses[0]}</strong>
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Avg 3Y Return:</strong>{' '}
                          {insights.avgReturns3Y.toFixed(1)}%
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Avg Expense Ratio:</strong>{' '}
                          {insights.avgExpenseRatio.toFixed(2)}%
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Avg AUM:</strong>{' '}
                          {formatNumber(insights.avgAUM)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Side-by-Side Comparison */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Detailed Comparison
              </h2>

              {/* Fund Headers - Sticky on Mobile */}
              <div className="overflow-x-auto">
                <div
                  className="min-w-[800px] grid gap-4"
                  style={{
                    gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)`,
                  }}
                >
                  {/* Empty corner */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10"></div>

                  {/* Fund Names */}
                  {selectedFunds.map((fund, index) => {
                    const detailed = detailedInfo[fund.id] || fund;
                    return (
                      <Card
                        key={fund.id}
                        className="p-4 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                              {fund.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {fund.fundHouse}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{fund.category}</Badge>
                          {fund.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">
                                {fund.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}

                  {/* Basic Information */}
                  <div className="col-span-full">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Basic Information
                    </h3>
                  </div>

                  {/* NAV */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Current NAV
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`nav-${fund.id}`}
                      className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{fund.nav.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {/* AUM */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <PieChart className="w-4 h-4" />
                      AUM (Size)
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`aum-${fund.id}`}
                      className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {formatNumber(fund.aum)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {fund.aum >= 10000
                          ? 'Very Large'
                          : fund.aum >= 5000
                            ? 'Large'
                            : fund.aum >= 1000
                              ? 'Medium'
                              : 'Small'}
                      </p>
                    </div>
                  ))}

                  {/* Risk Level */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Risk Level
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`risk-${fund.id}`}
                      className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <Badge className={getRiskColor(fund.riskLevel)}>
                        {fund.riskLevel || 'Moderate'}
                      </Badge>
                    </div>
                  ))}

                  {/* Performance Metrics */}
                  <div className="col-span-full mt-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance & Returns
                    </h3>
                  </div>

                  {/* 1Y Returns */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      1 Year Return
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`1y-${fund.id}`}
                      className={`p-3 rounded-lg border border-gray-200 dark:border-gray-800 ${getReturnColor(
                        fund.returns1Y
                      )}`}
                    >
                      <p className="text-xl font-bold">
                        {fund.returns1Y >= 0 ? '+' : ''}
                        {fund.returns1Y.toFixed(2)}%
                      </p>
                    </div>
                  ))}

                  {/* 3Y Returns */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      3 Year Return
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`3y-${fund.id}`}
                      className={`p-3 rounded-lg border border-gray-200 dark:border-gray-800 ${getReturnColor(
                        fund.returns3Y
                      )}`}
                    >
                      <p className="text-xl font-bold">
                        {fund.returns3Y >= 0 ? '+' : ''}
                        {fund.returns3Y.toFixed(2)}%
                      </p>
                    </div>
                  ))}

                  {/* 5Y Returns */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      5 Year Return
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`5y-${fund.id}`}
                      className={`p-3 rounded-lg border border-gray-200 dark:border-gray-800 ${getReturnColor(
                        fund.returns5Y
                      )}`}
                    >
                      <p className="text-xl font-bold">
                        {fund.returns5Y >= 0 ? '+' : ''}
                        {fund.returns5Y.toFixed(2)}%
                      </p>
                    </div>
                  ))}

                  {/* Cost & Investment */}
                  <div className="col-span-full mt-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Percent className="w-5 h-5" />
                      Costs & Investment Details
                    </h3>
                  </div>

                  {/* Expense Ratio */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Expense Ratio
                    </p>
                  </div>
                  {selectedFunds.map((fund) => (
                    <div
                      key={`expense-${fund.id}`}
                      className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <p
                        className={`text-xl font-bold ${getExpenseColor(
                          fund.expenseRatio
                        )}`}
                      >
                        {fund.expenseRatio.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {fund.expenseRatio <= 0.5
                          ? 'Very Low'
                          : fund.expenseRatio <= 1.0
                            ? 'Low'
                            : fund.expenseRatio <= 1.5
                              ? 'Moderate'
                              : 'High'}
                      </p>
                    </div>
                  ))}

                  {/* Exit Load */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Exit Load
                    </p>
                  </div>
                  {selectedFunds.map((fund) => {
                    const detailed = detailedInfo[fund.id] || fund;
                    return (
                      <div
                        key={`exit-${fund.id}`}
                        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <p className="text-sm text-gray-900 dark:text-white">
                          {(detailed as FundDetailedInfo).exitLoad ||
                            '1% (if < 1 year)'}
                        </p>
                      </div>
                    );
                  })}

                  {/* Min Investment */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Min Investment
                    </p>
                  </div>
                  {selectedFunds.map((fund) => {
                    const detailed = detailedInfo[fund.id] || fund;
                    return (
                      <div
                        key={`min-${fund.id}`}
                        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(
                            (detailed as FundDetailedInfo).minInvestment || 5000
                          )}
                        </p>
                      </div>
                    );
                  })}

                  {/* Min SIP */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Min SIP
                    </p>
                  </div>
                  {selectedFunds.map((fund) => {
                    const detailed = detailedInfo[fund.id] || fund;
                    return (
                      <div
                        key={`sip-${fund.id}`}
                        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(
                            (detailed as FundDetailedInfo).minSIP || 500
                          )}
                        </p>
                      </div>
                    );
                  })}

                  {/* Management */}
                  <div className="col-span-full mt-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Management & Benchmark
                    </h3>
                  </div>

                  {/* Fund Manager */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Fund Manager
                    </p>
                  </div>
                  {selectedFunds.map((fund) => {
                    const detailed = detailedInfo[fund.id] || fund;
                    return (
                      <div
                        key={`manager-${fund.id}`}
                        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <p className="text-sm text-gray-900 dark:text-white">
                          {(detailed as FundDetailedInfo).fundManager ||
                            'Not Available'}
                        </p>
                      </div>
                    );
                  })}

                  {/* Benchmark */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-950 z-10 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Benchmark
                    </p>
                  </div>
                  {selectedFunds.map((fund) => {
                    const detailed = detailedInfo[fund.id] || fund;
                    return (
                      <div
                        key={`benchmark-${fund.id}`}
                        className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <p className="text-sm text-gray-900 dark:text-white">
                          {(detailed as FundDetailedInfo).benchmark ||
                            fund.category}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Educational Tooltip */}
            <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    💡 How to Use This Comparison
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>Returns:</strong> Higher returns are better, but
                      check consistency across 1Y, 3Y, and 5Y periods.
                    </p>
                    <p>
                      <strong>Expense Ratio:</strong> Lower is better. Every
                      0.5% saves ₹5,000 per ₹10 lakh annually.
                    </p>
                    <p>
                      <strong>AUM:</strong> Larger funds (₹1000+ Cr) are
                      typically more stable.
                    </p>
                    <p>
                      <strong>Risk:</strong> Match with your risk appetite. High
                      risk ≠ high returns always.
                    </p>
                    <p>
                      <strong>Exit Load:</strong> Check before redeeming. Most
                      funds charge 1% if redeemed within 1 year.
                    </p>
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
