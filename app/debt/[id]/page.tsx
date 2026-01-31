'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { useLanguage } from '@/lib/hooks/use-language';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Building2,
  AlertCircle,
  CheckCircle2,
  Star,
  Loader2,
  PieChart as PieChartIcon,
  Activity,
  Target,
  TrendingUpDown,
  BarChart3,
  DollarSign,
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { HoldingsTable } from '@/components/holdings-table';
import { SectorAllocationChart } from '@/components/sector-allocation-chart';
import { FundManagerCard } from '@/components/fund-manager-card';
import { fetchFundDetails } from '@/lib/api-config';
import {
  ReturnsBarChart,
  NAVLineChart,
  SectorDonutChart,
  HoldingsDonutChart,
} from '@/components/enhanced-fund-charts';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function FundDetailEnhanced({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Add custom styles for scrollbar
  const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #3b82f6, #8b5cf6);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #2563eb, #7c3aed);
    }
  `;

  const { language, mounted: langMounted } = useLanguage();
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    mounted: watchlistMounted,
  } = useWatchlist();

  const [fund, setFund] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<
    '1M' | '6M' | '1Y' | '3Y' | '5Y' | '10Y'
  >('1Y');

  // Fetch fund data from API (V2 with fallback to V1)
  useEffect(() => {
    const fetchFundData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching fund details for:', id);

        const data = await fetchFundDetails(id);
        console.log('Fund data received:', data);

        // Handle both V2 and V1 response formats
        if (data.success && data.data) {
          setFund(data.data);
        } else if (data.fund) {
          setFund(data.fund);
        } else if (data.id || data.fundId) {
          setFund(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching fund:', err);
        setError(err.message || 'Failed to load fund details');
      } finally {
        setLoading(false);
      }
    };

    fetchFundData();
  }, [id]);

  // Format chart data based on period
  const getChartData = () => {
    if (!fund?.performanceHistory || fund.performanceHistory.length === 0) {
      return [];
    }

    const history = [...fund.performanceHistory];
    const now = new Date();
    let filteredData = history;

    // Filter based on selected period
    switch (chartPeriod) {
      case '1M':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = history.filter(
          (item) => new Date(item.date) >= oneMonthAgo
        );
        break;
      case '6M':
        const sixMonthsAgo = new Date(
          now.getTime() - 180 * 24 * 60 * 60 * 1000
        );
        filteredData = history.filter(
          (item) => new Date(item.date) >= sixMonthsAgo
        );
        break;
      case '1Y':
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredData = history.filter(
          (item) => new Date(item.date) >= oneYearAgo
        );
        break;
      case '3Y':
        const threeYearsAgo = new Date(
          now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000
        );
        filteredData = history.filter(
          (item) => new Date(item.date) >= threeYearsAgo
        );
        break;
      case '5Y':
        const fiveYearsAgo = new Date(
          now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000
        );
        filteredData = history.filter(
          (item) => new Date(item.date) >= fiveYearsAgo
        );
        break;
      case '10Y':
        // Show all data (up to 10 years)
        filteredData = history;
        break;
    }

    return filteredData.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-IN', {
        month: 'short',
        year:
          chartPeriod === '10Y' || chartPeriod === '5Y' ? '2-digit' : undefined,
        day: chartPeriod === '1M' ? 'numeric' : undefined,
      }),
      nav: item.nav,
      displayDate: new Date(item.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
  };

  if (!langMounted || !watchlistMounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted">Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Data Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The requested fund information is not available in our database.
            </p>
            <Link href="/" className="inline-block">
              <Button>← Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(fund.id);
  const navData = getChartData();

  // Generate unique fund highlights based on characteristics
  const generateFundHighlights = (fund: any) => {
    const highlights: string[] = [];

    // 1. Strategy & Risk Profile
    if (fund.category?.toLowerCase().includes('small cap')) {
      highlights.push(
        '💎 High-Growth Potential: Invests in emerging small companies with significant growth opportunities'
      );
      highlights.push(
        '⚠️ Higher Volatility: Suitable for aggressive investors with 5+ year investment horizon'
      );
    } else if (fund.category?.toLowerCase().includes('large cap')) {
      highlights.push(
        "🏛️ Blue-Chip Focus: Invests in India's top 100 established companies with stable track records"
      );
      highlights.push(
        '🛡️ Lower Risk: Ideal for conservative investors seeking steady long-term wealth creation'
      );
    } else if (fund.category?.toLowerCase().includes('mid cap')) {
      highlights.push(
        '⚡ Growth Leaders: Targets companies ranked 101-250 by market cap with strong expansion potential'
      );
      highlights.push(
        '⚖️ Balanced Risk-Reward: Mid-level volatility suitable for moderately aggressive investors'
      );
    } else if (
      fund.category?.toLowerCase().includes('flexi') ||
      fund.category?.toLowerCase().includes('multi')
    ) {
      highlights.push(
        '🎯 Flexible Strategy: Dynamically allocates across large, mid, and small cap stocks based on market conditions'
      );
      highlights.push(
        '📊 Market-Adaptive: Fund manager adjusts allocation to capture best opportunities across market segments'
      );
    } else if (fund.category?.toLowerCase().includes('index')) {
      highlights.push(
        '📈 Passive Tracking: Mirrors benchmark index (Nifty/Sensex) with minimal tracking error'
      );
      highlights.push(
        '💰 Low Cost: Ultra-low expense ratios (typically 0.1-0.5%) maximize your returns'
      );
    }

    // 2. Performance Highlights
    if (fund.returns?.oneYear > 25) {
      highlights.push(
        `🚀 Outstanding Performance: Delivered ${fund.returns.oneYear.toFixed(
          1
        )}% returns in last year, significantly outperforming category average`
      );
    } else if (fund.returns?.oneYear > 15) {
      highlights.push(
        `✅ Strong Returns: ${fund.returns.oneYear.toFixed(
          1
        )}% annual growth demonstrates consistent wealth creation ability`
      );
    } else if (fund.returns?.oneYear > 0) {
      highlights.push(
        `📊 Positive Momentum: ${fund.returns.oneYear.toFixed(
          1
        )}% returns show steady performance in current market conditions`
      );
    }

    // 3. Scale & Stability
    if (fund.aum > 10000) {
      highlights.push(
        `🏆 Large Fund Size: ₹${(fund.aum / 1000).toFixed(
          0
        )}K Cr AUM indicates strong investor confidence and fund stability`
      );
    } else if (fund.aum > 5000) {
      highlights.push(
        `📦 Established Fund: ₹${(fund.aum / 1000).toFixed(
          0
        )}K Cr AUM provides good liquidity and operational efficiency`
      );
    } else if (fund.aum > 1000) {
      highlights.push(
        `🌱 Growing Fund: ₹${(fund.aum / 1000).toFixed(
          1
        )}K Cr AUM offers nimble portfolio management with growth potential`
      );
    }

    // 4. Cost Efficiency
    if (fund.expenseRatio && fund.expenseRatio < 1.0) {
      highlights.push(
        `💵 Cost Efficient: ${fund.expenseRatio.toFixed(
          2
        )}% expense ratio means more of your returns stay with you`
      );
    } else if (fund.expenseRatio && fund.expenseRatio < 1.5) {
      highlights.push(
        `💳 Reasonable Costs: ${fund.expenseRatio.toFixed(
          2
        )}% expense ratio is competitive within the category`
      );
    }

    // Ensure minimum 3-4 highlights
    if (highlights.length < 3) {
      highlights.push(
        '📚 Diversified Portfolio: Spreads risk across multiple securities for balanced exposure'
      );
      highlights.push(
        '👨‍💼 Professional Management: Experienced fund managers with proven track record handle investments'
      );
    }

    return highlights.slice(0, 4); // Return top 4 most relevant points
  };

  const fundHighlights = generateFundHighlights(fund);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
      <style>{customScrollbarStyles}</style>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 mt-2 hidden md:block">
          <BackButton />
        </div>
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(99,102,241,0.15)] dark:shadow-[0_8px_32px_0_rgba(99,102,241,0.25)] p-8 relative overflow-hidden"
        >
          {/* Glassmorphism effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 leading-tight">
                    {fund.name}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {fund.type} • {fund.category}
                  </p>
                </div>
                <button
                  onClick={() =>
                    inWatchlist
                      ? removeFromWatchlist(fund.id)
                      : addToWatchlist(fund.id)
                  }
                  className="text-4xl hover:scale-125 transition-transform duration-300"
                >
                  {inWatchlist ? '⭐' : '☆'}
                </button>
              </div>
              <div className="flex gap-3 flex-wrap mt-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <PieChartIcon className="w-4 h-4" />
                  {fund.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <TrendingUp className="w-4 h-4" />
                  {fund.returns?.oneYear > 0 ? '+' : ''}
                  {fund.returns?.oneYear?.toFixed(2)}% (1Y)
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Shield className="w-4 h-4" />₹{(fund.aum / 1000).toFixed(1)}K
                  Cr AUM
                </span>
              </div>
            </div>
            <div className="text-right bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 rounded-3xl p-8 shadow-xl border-2 border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold mb-2">
                CURRENT NAV
              </p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                ₹{fund.currentNav?.toFixed(2) || '0.00'}
              </p>
              <div className="flex items-center justify-end gap-2">
                {fund.returns?.oneYear >= 0 ? (
                  <>
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                      +{fund.returns.oneYear.toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                      {fund.returns?.oneYear?.toFixed(2)}%
                    </span>
                  </>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-1 font-medium">
                  (1 Year)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                As of {new Date(fund.navDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* What Makes This Fund Unique Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <Card className="shadow-[0_8px_32px_0_rgba(99,102,241,0.15)] dark:shadow-[0_8px_32px_0_rgba(99,102,241,0.3)] border border-white/20 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-b border-gray-200/50 dark:border-gray-700/50">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                What Makes This Fund Unique?
              </CardTitle>
              <CardDescription className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Key highlights to help you make an informed investment decision
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {fundHighlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed flex-1">
                      {highlight}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Decision Helper */}
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                      💡 Investment Suitability
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      {fund.category?.toLowerCase().includes('small cap') &&
                        'Best for: Aggressive investors with 5-7 year horizon | High risk, high reward | Not suitable for conservative investors'}
                      {fund.category?.toLowerCase().includes('large cap') &&
                        'Best for: Conservative to moderate investors | 3-5 year horizon | Stable, predictable returns'}
                      {fund.category?.toLowerCase().includes('mid cap') &&
                        'Best for: Moderate to aggressive investors | 4-6 year horizon | Balanced growth with manageable volatility'}
                      {(fund.category?.toLowerCase().includes('flexi') ||
                        fund.category?.toLowerCase().includes('multi')) &&
                        'Best for: All types of investors | 3-5 year horizon | Professional allocation across market caps'}
                      {fund.category?.toLowerCase().includes('index') &&
                        'Best for: Passive investors seeking market returns | Long-term (5+ years) | Low maintenance, cost-effective'}
                      {!fund.category
                        ?.toLowerCase()
                        .match(/(small|large|mid|flexi|multi|index)/) &&
                        'Evaluate your risk tolerance and investment horizon before investing. Consult a financial advisor if needed.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Enhanced Sections */}
        {/* Top 15 Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <HoldingsTable
            holdings={fund.topHoldings || []}
            holdingsCount={fund.holdingsCount}
          />
        </motion.div>

        {/* Sector Allocation Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <SectorAllocationChart
            sectors={fund.sectorAllocation || []}
            sectorAllocationCount={fund.sectorAllocationCount}
          />
        </motion.div>

        {/* Fund Manager Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FundManagerCard
            managerDetails={fund.managerDetails}
            fallbackName={fund.fundManager}
          />
        </motion.div>

        {/* NAV Performance Chart with 10-Year Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="mb-8 shadow-[0_8px_32px_0_rgba(99,102,241,0.15)] dark:shadow-[0_8px_32px_0_rgba(99,102,241,0.3)] border border-white/20 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <Activity className="w-7 h-7 text-blue-600" />
                    Historical Performance (Real Data)
                  </CardTitle>
                  <CardDescription className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Track up to 10 years of actual NAV data from database
                  </CardDescription>
                </div>
                <Tabs
                  value={chartPeriod}
                  onValueChange={setChartPeriod}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1"
                >
                  <TabsList className="grid grid-cols-6 gap-1">
                    {['1M', '6M', '1Y', '3Y', '5Y', '10Y'].map((period) => (
                      <TabsTrigger
                        key={period}
                        value={period}
                        className="text-sm font-semibold px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                      >
                        {period}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {/* Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: 'Starting NAV',
                    value: `₹${navData[0]?.nav?.toFixed(2) || 'N/A'}`,
                    icon: Target,
                    gradient: 'from-blue-400 to-indigo-500',
                  },
                  {
                    label: 'Current NAV',
                    value: `₹${
                      navData[navData.length - 1]?.nav?.toFixed(2) || 'N/A'
                    }`,
                    icon: Activity,
                    gradient: 'from-purple-400 to-pink-500',
                  },
                  {
                    label: 'Absolute Return',
                    value:
                      navData.length > 1
                        ? `${
                            navData[navData.length - 1]?.nav >= navData[0]?.nav
                              ? '+'
                              : ''
                          }₹${(
                            navData[navData.length - 1]?.nav - navData[0]?.nav
                          ).toFixed(2)}`
                        : 'N/A',
                    icon: TrendingUpDown,
                    gradient:
                      navData.length > 1 &&
                      navData[navData.length - 1]?.nav >= navData[0]?.nav
                        ? 'from-green-400 to-emerald-500'
                        : 'from-red-400 to-rose-500',
                  },
                  {
                    label: 'Total Return %',
                    value:
                      navData.length > 1
                        ? `${
                            navData[navData.length - 1]?.nav >= navData[0]?.nav
                              ? '+'
                              : ''
                          }${(
                            ((navData[navData.length - 1]?.nav -
                              navData[0]?.nav) /
                              navData[0]?.nav) *
                            100
                          ).toFixed(2)}%`
                        : 'N/A',
                    icon: BarChart3,
                    gradient:
                      navData.length > 1 &&
                      navData[navData.length - 1]?.nav >= navData[0]?.nav
                        ? 'from-green-400 to-emerald-500'
                        : 'from-red-400 to-rose-500',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className={`p-5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg text-white`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5" />
                      <p className="text-xs font-semibold opacity-90">
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart with Side Explanation */}
              {navData.length > 0 ? (
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                  {/* Main Chart */}
                  <div className="h-[450px] bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={navData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorNav"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="50%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.5}
                            />
                            <stop
                              offset="100%"
                              stopColor="#ec4899"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                          <linearGradient
                            id="lineGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#9ca3af"
                          strokeOpacity={0.3}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          tick={{
                            fontSize: 13,
                            fill: '#4b5563',
                            fontWeight: 500,
                          }}
                          tickLine={false}
                          axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                          dy={10}
                        />
                        <YAxis
                          stroke="#6b7280"
                          tick={{
                            fontSize: 13,
                            fill: '#4b5563',
                            fontWeight: 500,
                          }}
                          tickLine={false}
                          axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                          dx={-10}
                          tickFormatter={(value) => `₹${value}`}
                          domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const startNav = navData[0]?.nav || data.nav;
                              const changeFromStart = data.nav - startNav;
                              const percentChange = (
                                (changeFromStart / startNav) *
                                100
                              ).toFixed(2);
                              return (
                                <div className="bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl p-5 min-w-[200px]">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold flex items-center gap-1">
                                    📅 {data.displayDate}
                                  </p>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        NAV on this day
                                      </p>
                                      <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ₹{data.nav.toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Change from start
                                      </p>
                                      <p
                                        className={`text-lg font-bold ${
                                          changeFromStart >= 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}
                                      >
                                        {changeFromStart >= 0 ? '+' : ''}₹
                                        {changeFromStart.toFixed(2)} (
                                        {percentChange}%)
                                      </p>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                      <p className="text-xs text-gray-600 dark:text-gray-300">
                                        💡 Hover along the line to see NAV
                                        changes
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="nav"
                          stroke="url(#lineGradient)"
                          strokeWidth={5}
                          fill="url(#colorNav)"
                          dot={false}
                          activeDot={{
                            r: 10,
                            fill: '#8b5cf6',
                            stroke: '#fff',
                            strokeWidth: 4,
                            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Enhanced Side Explanation Panel */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50 shadow-lg space-y-4 h-[450px] overflow-y-auto custom-scrollbar"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        📊 Performance Guide
                      </h3>
                    </div>

                    {/* What is NAV? */}
                    <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">💡</span> What is NAV?
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Net Asset Value (NAV)</strong> is the price per
                        unit of this mutual fund. Think of it like a stock price
                        - if you invested ₹10,000 when NAV was ₹100, you'd get
                        100 units.
                      </p>
                    </div>

                    {/* How to Read the Graph */}
                    <div className="bg-purple-50/50 dark:bg-purple-950/30 rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">📈</span> Reading the Graph
                      </h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5 font-bold">
                            ↗
                          </span>
                          <span>
                            <strong>Rising trend:</strong> Your investment value
                            is growing
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5 font-bold">
                            ↘
                          </span>
                          <span>
                            <strong>Falling trend:</strong> Temporary decline
                            (markets fluctuate)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5 font-bold">
                            ━
                          </span>
                          <span>
                            <strong>Flat line:</strong> Stable period with
                            minimal change
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5 font-bold">
                            ~
                          </span>
                          <span>
                            <strong>Volatile:</strong> Quick ups and downs
                            (higher risk)
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Current Period Analysis */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">🎯</span> {chartPeriod}{' '}
                        Performance
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                          <span className="text-gray-700 dark:text-gray-300">
                            Starting NAV:
                          </span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            ₹{navData[0]?.nav?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                          <span className="text-gray-700 dark:text-gray-300">
                            Current NAV:
                          </span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            ₹{navData[navData.length - 1]?.nav?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-900/50 rounded">
                          <span className="text-gray-700 dark:text-gray-300">
                            Absolute Change:
                          </span>
                          <span
                            className={`font-bold ${
                              navData[navData.length - 1]?.nav >=
                              navData[0]?.nav
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {navData[navData.length - 1]?.nav >= navData[0]?.nav
                              ? '+'
                              : ''}
                            ₹
                            {(
                              navData[navData.length - 1]?.nav - navData[0]?.nav
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t-2 border-green-200 dark:border-green-800 p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded font-semibold">
                          <span className="text-gray-800 dark:text-gray-200">
                            Total Return:
                          </span>
                          <span
                            className={`font-bold text-lg ${
                              navData[navData.length - 1]?.nav >=
                              navData[0]?.nav
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {navData[navData.length - 1]?.nav >= navData[0]?.nav
                              ? '+'
                              : ''}
                            {(
                              ((navData[navData.length - 1]?.nav -
                                navData[0]?.nav) /
                                navData[0]?.nav) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Example */}
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg p-4 border-l-4 border-indigo-500">
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">💰</span> Real Example
                      </h4>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <p className="leading-relaxed">
                          If you invested{' '}
                          <strong className="text-indigo-600 dark:text-indigo-400">
                            ₹10,000
                          </strong>{' '}
                          at the start of this period:
                        </p>
                        <div className="bg-white/60 dark:bg-gray-900/60 p-3 rounded-lg space-y-1.5">
                          <div className="flex justify-between">
                            <span>Units purchased:</span>
                            <span className="font-bold">
                              {(10000 / (navData[0]?.nav || 1)).toFixed(2)}{' '}
                              units
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current value:</span>
                            <span
                              className={`font-bold ${
                                navData[navData.length - 1]?.nav >=
                                navData[0]?.nav
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              ₹
                              {(
                                (10000 / (navData[0]?.nav || 1)) *
                                (navData[navData.length - 1]?.nav || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800">
                            <span className="font-semibold">Profit/Loss:</span>
                            <span
                              className={`font-bold ${
                                navData[navData.length - 1]?.nav >=
                                navData[0]?.nav
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {navData[navData.length - 1]?.nav >=
                              navData[0]?.nav
                                ? '+'
                                : ''}
                              ₹
                              {(
                                (10000 / (navData[0]?.nav || 1)) *
                                  (navData[navData.length - 1]?.nav || 0) -
                                10000
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expert Tips */}
                    <div className="bg-amber-50/50 dark:bg-amber-950/30 rounded-lg p-4 border-l-4 border-amber-500">
                      <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">🎓</span> Expert Tips
                      </h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">✓</span>
                          <span>
                            <strong>Long-term view:</strong> Check 3Y-10Y for
                            true fund quality
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">✓</span>
                          <span>
                            <strong>Ignore short dips:</strong> Markets recover
                            over time
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">✓</span>
                          <span>
                            <strong>Compare tabs:</strong> Different periods
                            show different stories
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">✓</span>
                          <span>
                            <strong>Smooth line:</strong> Lower volatility =
                            lower risk
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Data Info */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400 font-semibold">
                          📅 Data Points:
                        </span>
                        <span className="font-bold text-gray-800 dark:text-white">
                          {navData.length} days
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Real historical data from fund house records
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="h-[450px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-gray-500">
                    No performance data available for this period
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Returns Grid */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Complete Returns Analysis (Real Data)
            </CardTitle>
            <CardDescription>
              Actual returns calculated from historical NAV data
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: '1 Month',
                  value: fund.returns?.oneMonth,
                  period: '1M',
                },
                {
                  label: '3 Months',
                  value: fund.returns?.threeMonth,
                  period: '3M',
                },
                {
                  label: '6 Months',
                  value: fund.returns?.sixMonth,
                  period: '6M',
                },
                { label: '1 Year', value: fund.returns?.oneYear, period: '1Y' },
                {
                  label: '3 Years',
                  value: fund.returns?.threeYear,
                  period: '3Y',
                },
                {
                  label: '5 Years',
                  value: fund.returns?.fiveYear,
                  period: '5Y',
                },
                {
                  label: '10 Years',
                  value: fund.returns?.tenYear,
                  period: '10Y',
                },
                {
                  label: 'Since Inception',
                  value: fund.returns?.sinceInception,
                  period: 'All',
                },
              ].map((ret, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {ret.label}
                    </p>
                    {ret.value !== null && ret.value !== undefined ? (
                      ret.value >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )
                    ) : null}
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      ret.value !== null &&
                      ret.value !== undefined &&
                      ret.value !== 0
                        ? ret.value >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {ret.value !== null &&
                    ret.value !== undefined &&
                    ret.value !== 0
                      ? `${ret.value >= 0 ? '+' : ''}${ret.value.toFixed(2)}%`
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ret.value !== null &&
                    ret.value !== undefined &&
                    ret.value !== 0
                      ? `${ret.period} performance`
                      : 'Data not available'}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fund Manager Details with Board Info */}
        {fund.managedBy && fund.managedBy.length > 0 && (
          <Card className="mb-8 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Fund Management Team
              </CardTitle>
              <CardDescription>
                Experienced professionals managing your investments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {fund.managedBy.map((manager: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                          {manager.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                          {manager.name}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {manager.bio}
                        </p>

                        {/* Manager Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Briefcase className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Experience
                              </p>
                            </div>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {manager.experience}+ Years
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-1">
                              <GraduationCap className="w-4 h-4 text-purple-600" />
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Qualification
                              </p>
                            </div>
                            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {manager.qualification}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="w-4 h-4 text-green-600" />
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Track Record
                              </p>
                            </div>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                              Excellent
                            </p>
                          </div>
                        </div>

                        {/* Education & Previous Roles */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Education
                            </h4>
                            <ul className="space-y-1">
                              {manager.education?.map(
                                (edu: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    {edu}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Previous Roles
                            </h4>
                            <ul className="space-y-1">
                              {manager.previousRoles?.map(
                                (role: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {role}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Holdings Section */}
        <div className="mb-8">
          <HoldingsTable
            holdings={fund.topHoldings || []}
            holdingsCount={fund.holdingsCount || 0}
          />
        </div>

        {/* Sector Allocation Section */}
        <div className="mb-8">
          <SectorAllocationChart
            sectors={fund.sectorAllocation || []}
            sectorAllocationCount={fund.sectorAllocationCount || 0}
          />
        </div>

        {/* Risk Metrics */}
        {fund.riskMetrics && (
          <Card className="mb-8 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Risk & Performance Metrics
              </CardTitle>
              <CardDescription>
                Statistical measures of fund performance and risk
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Volatility (Risk)
                  </p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {fund.riskMetrics.volatility?.toFixed(2) || '0.00'}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Standard deviation of returns
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Sharpe Ratio
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {fund.riskMetrics.sharpeRatio?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Risk-adjusted return measure
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Beta (Market Sensitivity)
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {fund.riskMetrics.beta?.toFixed(2) || '1.00'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Relative to market benchmark
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fund Details */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Fund Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Assets Under Management</span>
                  <span className="font-bold text-blue-600">
                    ₹{(fund.aum / 1000).toFixed(1)}K Cr
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Expense Ratio</span>
                  <span className="font-bold">
                    {fund.expenseRatio
                      ? Number(fund.expenseRatio).toFixed(2)
                      : 'N/A'}
                    %
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Benchmark</span>
                  <span className="font-bold">
                    {fund.benchmark || 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">AMFI Code</span>
                  <span className="font-bold">{fund.amfiCode}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Inception Date</span>
                  <span className="font-bold">
                    {fund.inceptionDate
                      ? new Date(fund.inceptionDate).toLocaleDateString()
                      : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Total Holdings</span>
                  <span className="font-bold">
                    {fund.stats?.totalHoldings || 0}
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Portfolio Turnover</span>
                  <span className="font-bold">
                    {fund.stats?.portfolioTurnoverRatio || 0}%
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Data Updated</span>
                  <span className="font-bold">
                    {new Date(
                      fund.stats?.dataAsOf || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link href="/compare" className="flex-1 min-w-[200px]">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Compare Funds
            </Button>
          </Link>
          <Button
            onClick={() =>
              inWatchlist
                ? removeFromWatchlist(fund.id)
                : addToWatchlist(fund.id)
            }
            variant="outline"
            size="lg"
            className="flex-1 min-w-[200px] border-2 font-bold shadow-lg"
          >
            {inWatchlist ? '⭐ Remove from Watchlist' : '☆ Add to Watchlist'}
          </Button>
          <Link href="/" className="min-w-[150px]">
            <Button variant="outline" size="lg" className="w-full font-bold">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
