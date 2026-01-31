'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
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
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Shield,
  DollarSign,
  Building2,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  Calendar,
  Target,
  TrendingUpDown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : `${BASE_URL}/api`
).replace(/\/+$/, '');

const SECTOR_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
];

export default function FundDetailEnhanced({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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
  const [chartPeriod, setChartPeriod] = useState('1Y');

  // Fetch fund data from API
  useEffect(() => {
    const fetchFundData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/funds/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch fund data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fund data fetched:', data);

        if (data.success && data.data) {
          setFund(data.data);
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
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-lg text-red-600 font-semibold">
              {error ? `⚠️ ${error}` : 'Fund not found'}
            </p>
            {error && (
              <p className="mt-2 text-sm text-muted-foreground">
                Make sure the backend server is running on port 3002
              </p>
            )}
            <Link href="/" className="mt-6 inline-block">
              <Button>← Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(fund.id);
  const navData = getChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl p-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
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
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg">
                  <PieChartIcon className="w-4 h-4" />
                  {fund.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-lg">
                  <TrendingUp className="w-4 h-4" />
                  {fund.returns?.oneYear > 0 ? '+' : ''}
                  {fund.returns?.oneYear?.toFixed(2)}% (1Y)
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
                  <Shield className="w-4 h-4" />₹{(fund.aum / 1000).toFixed(1)}K
                  Cr AUM
                </span>
              </div>
            </div>
            <div className="text-right bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold mb-2">
                CURRENT NAV
              </p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                ₹{fund.currentNav?.toFixed(2) || 'N/A'}
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

        {/* NAV Performance Chart with 10-Year Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 shadow-2xl border-2 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-t-xl border-b-2 border-purple-100 dark:border-purple-800">
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

              {/* Chart */}
              {navData.length > 0 ? (
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
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="50%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ec4899"
                            stopOpacity={0.1}
                          />
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
                            return (
                              <div className="bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl p-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                                  📅 {data.displayDate}
                                </p>
                                <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  ₹{data.nav.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                                  Net Asset Value
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="nav"
                        stroke="url(#colorNav)"
                        strokeWidth={4}
                        fill="url(#colorNav)"
                        dot={false}
                        activeDot={{
                          r: 8,
                          fill: '#8b5cf6',
                          stroke: '#fff',
                          strokeWidth: 3,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
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

        {/* Holdings & Sector Allocation */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Top Holdings */}
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Top 15 Holdings (Real Companies)
              </CardTitle>
              <CardDescription>
                Actual portfolio composition - {fund.stats?.totalHoldings} total
                holdings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {fund.holdings && fund.holdings.length > 0 ? (
                <div className="space-y-3">
                  {fund.holdings.map((holding: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {i + 1}. {holding.companyName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {holding.ticker} • {holding.sector}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{
                              width: `${Math.min(
                                holding.percentage * 10,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="w-16 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                          {holding.percentage.toFixed(2)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                      💡 Top 5 holdings concentration:{' '}
                      {fund.stats?.topHoldingsConcentration.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No holdings data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Sector Allocation */}
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                Sector Allocation
              </CardTitle>
              <CardDescription>
                Portfolio distribution across sectors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {fund.sectorAllocation && fund.sectorAllocation.length > 0 ? (
                <>
                  <div className="h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fund.sectorAllocation}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ sector, percentage }: any) =>
                            `${sector}: ${(percentage as number).toFixed(1)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {fund.sectorAllocation.map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  SECTOR_COLORS[index % SECTOR_COLORS.length]
                                }
                              />
                            )
                          )}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: any) => `${value.toFixed(2)}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {fund.sectorAllocation.map((sector: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor:
                              SECTOR_COLORS[idx % SECTOR_COLORS.length],
                          }}
                        />
                        <span className="flex-1 text-sm font-medium">
                          {sector.sector}
                        </span>
                        <span className="text-sm font-bold">
                          {sector.percentage.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No sector allocation data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

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
                      ret.value !== null && ret.value !== undefined
                        ? ret.value >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {ret.value !== null && ret.value !== undefined
                      ? `${ret.value >= 0 ? '+' : ''}${ret.value.toFixed(2)}%`
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ret.period} performance
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
                    {fund.riskMetrics.volatility?.toFixed(2) || 'N/A'}%
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
                    {fund.riskMetrics.sharpeRatio?.toFixed(2) || 'N/A'}
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
                    {fund.riskMetrics.beta?.toFixed(2) || 'N/A'}
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
                    {fund.expenseRatio?.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="font-semibold">Benchmark</span>
                  <span className="font-bold">{fund.benchmark || 'N/A'}</span>
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
                      : 'N/A'}
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
