'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TrendingUp,
  TrendingDown,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  DollarSign,
  Plus,
  LogIn,
  UserPlus,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Lightbulb,
  Search,
  Calendar,
  Eye,
  Wallet,
  Activity,
  ArrowUpDown,
  Briefcase,
  Home,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : `${BASE_URL}/api`
).replace(/\/+$/, '');

// Mock portfolio data for demo
const MOCK_PORTFOLIO_DATA = {
  totalInvested: 500000,
  currentValue: 625000,
  totalReturns: 125000,
  returnsPercent: 25.0,
  xirr: 18.5,
  cagr: 17.2,
  holdings: [
    {
      id: '1',
      fundName: 'Axis Bluechip Fund',
      category: 'Large Cap',
      invested: 150000,
      currentValue: 187500,
      units: 2500,
      avgNav: 60,
      currentNav: 75,
      pl: 37500,
      plPercent: 25,
    },
    {
      id: '2',
      fundName: 'Mirae Asset Emerging Bluechip',
      category: 'Mid Cap',
      invested: 200000,
      currentValue: 260000,
      units: 3200,
      avgNav: 62.5,
      currentNav: 81.25,
      pl: 60000,
      plPercent: 30,
    },
    {
      id: '3',
      fundName: 'HDFC Balanced Advantage Fund',
      category: 'Hybrid',
      invested: 150000,
      currentValue: 177500,
      units: 5000,
      avgNav: 30,
      currentNav: 35.5,
      pl: 27500,
      plPercent: 18.33,
    },
  ],
  categoryAllocation: [
    { name: 'Large Cap', value: 30, amount: 187500, color: '#3b82f6' },
    { name: 'Mid Cap', value: 41.6, amount: 260000, color: '#8b5cf6' },
    { name: 'Hybrid', value: 28.4, amount: 177500, color: '#ec4899' },
  ],
  growthData: [
    { month: 'Jan', value: 500000 },
    { month: 'Feb', value: 520000 },
    { month: 'Mar', value: 540000 },
    { month: 'Apr', value: 570000 },
    { month: 'May', value: 590000 },
    { month: 'Jun', value: 625000 },
  ],
  recommendations: [
    {
      id: 'r1',
      name: 'Parag Parikh Flexi Cap',
      category: 'Flexi Cap',
      return1Y: 22.5,
      risk: 'Moderate',
    },
    {
      id: 'r2',
      name: 'SBI Small Cap Fund',
      category: 'Small Cap',
      return1Y: 28.3,
      risk: 'High',
    },
    {
      id: 'r3',
      name: 'ICICI Prudential Liquid Fund',
      category: 'Liquid',
      return1Y: 6.8,
      risk: 'Low',
    },
  ],
};

export default function PortfolioPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(MOCK_PORTFOLIO_DATA);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'pl'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem('varta_token') ||
        localStorage.getItem('accessToken');
      const userData =
        localStorage.getItem('varta_user') || localStorage.getItem('user');
      setIsAuthenticated(!!(token && userData));
      setLoading(false);
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Calculate risk score based on portfolio composition
  const riskScore = useMemo(() => {
    const { categoryAllocation } = portfolioData;
    let score = 0;
    categoryAllocation.forEach((cat) => {
      if (
        cat.name.includes('Large') ||
        cat.name.includes('Liquid') ||
        cat.name.includes('Debt')
      ) {
        score += cat.value * 0.3;
      } else if (cat.name.includes('Mid') || cat.name.includes('Hybrid')) {
        score += cat.value * 0.5;
      } else if (cat.name.includes('Small')) {
        score += cat.value * 0.8;
      }
    });
    return Math.min(score, 100);
  }, [portfolioData]);

  const riskLevel =
    riskScore < 35 ? 'Low' : riskScore < 65 ? 'Moderate' : 'High';
  const riskColor =
    riskScore < 35
      ? 'text-green-600'
      : riskScore < 65
        ? 'text-yellow-600'
        : 'text-red-600';
  const riskBg =
    riskScore < 35
      ? 'bg-green-100 dark:bg-green-950/30'
      : riskScore < 65
        ? 'bg-yellow-100 dark:bg-yellow-950/30'
        : 'bg-red-100 dark:bg-red-950/30';

  // Generate smart insights
  const insights = useMemo(() => {
    const topPerformer = [...portfolioData.holdings].sort(
      (a, b) => b.plPercent - a.plPercent
    )[0];
    const highestAllocation = [...portfolioData.categoryAllocation].sort(
      (a, b) => b.value - a.value
    )[0];

    return {
      topPerformer: topPerformer?.fundName || 'N/A',
      topPerformerReturn: topPerformer?.plPercent.toFixed(1) || '0',
      highestCategory: highestAllocation?.name || 'N/A',
      highestPercent: highestAllocation?.value.toFixed(1) || '0',
      oneYearReturn: portfolioData.returnsPercent.toFixed(1),
    };
  }, [portfolioData]);

  // Sort holdings
  const sortedHoldings = useMemo(() => {
    const sorted = [...portfolioData.holdings];
    sorted.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case 'name':
          compareA = a.fundName.toLowerCase();
          compareB = b.fundName.toLowerCase();
          break;
        case 'value':
          compareA = a.currentValue;
          compareB = b.currentValue;
          break;
        case 'pl':
          compareA = a.plPercent;
          compareB = b.plPercent;
          break;
        default:
          compareA = a.currentValue;
          compareB = b.currentValue;
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      }
      return compareA < compareB ? 1 : -1;
    });

    return sorted;
  }, [portfolioData.holdings, sortBy, sortOrder]);

  const handleSort = (column: 'name' | 'value' | 'pl') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const csv = [
      ['Fund Name', 'Category', 'Invested', 'Current Value', 'P&L', 'P&L %'],
      ...portfolioData.holdings.map((h) => [
        h.fundName,
        h.category,
        h.invested.toString(),
        h.currentValue.toString(),
        h.pl.toString(),
        h.plPercent.toFixed(2),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    // In a real app, use a library like jsPDF
    alert(
      'PDF export feature coming soon! For now, you can use Print to PDF from your browser.'
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading your portfolio...
          </p>
        </div>
      </div>
    );
  }

  // LOGIN REQUIRED VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <Header />
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardContent className="pt-10 pb-8 px-8">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-xl"
                >
                  <Wallet className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
                >
                  Please Login to View Your Portfolio
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-gray-600 dark:text-gray-400 mb-8 text-lg"
                >
                  Sign in to track your investments, returns, and MF insights.
                </motion.p>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3 mb-8"
                >
                  {[
                    { icon: Activity, text: 'Real-time portfolio tracking' },
                    {
                      icon: TrendingUp,
                      text: 'Performance analytics & insights',
                    },
                    { icon: Target, text: 'Personalized recommendations' },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-3"
                >
                  <Link href="/auth" className="block">
                    <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all">
                      <LogIn className="w-5 h-5 mr-2" />
                      Login to Your Account
                    </Button>
                  </Link>

                  <Link href="/auth" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-semibold border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create New Account
                    </Button>
                  </Link>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                  className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-xl opacity-50"
                />
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 3, repeat: Infinity },
                  }}
                  className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-50"
                />
              </CardContent>
            </Card>

            {/* Bottom Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400"
            >
              New to investing?{' '}
              <Link
                href="/funds"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Explore Mutual Funds
              </Link>
            </motion.p>
          </motion.div>
        </main>
      </div>
    );
  }

  // MAIN PORTFOLIO DASHBOARD (When logged in)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-6"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <div className="fixed left-4 top-24 hidden lg:flex flex-col gap-4 z-40">
        {[
          { icon: Home, label: 'Dashboard', href: '/' },
          {
            icon: Briefcase,
            label: 'Portfolio',
            href: '/portfolio',
            active: true,
          },
          { icon: Search, label: 'Explore', href: '/funds' },
          { icon: UserIcon, label: 'Profile', href: '/auth' },
        ].map((item, idx) => (
          <Link key={idx} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-lg ${
                item.active
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
              title={item.label}
            >
              <item.icon className="w-6 h-6" />
            </motion.div>
          </Link>
        ))}
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Portfolio
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track and manage your mutual fund investments
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddInvestmentModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Investment
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              title: 'Total Investment',
              value: `₹${portfolioData.totalInvested.toLocaleString()}`,
              icon: Wallet,
              color: 'from-blue-500 to-cyan-500',
              bgColor:
                'from-blue-100 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50',
              delay: 0.1,
            },
            {
              title: 'Current Value',
              value: `₹${portfolioData.currentValue.toLocaleString()}`,
              icon: DollarSign,
              color: 'from-purple-500 to-pink-500',
              bgColor:
                'from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50',
              delay: 0.2,
            },
            {
              title: 'Total Returns',
              value: `₹${portfolioData.totalReturns.toLocaleString()}`,
              subtitle: `+${portfolioData.returnsPercent.toFixed(1)}%`,
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-500',
              bgColor:
                'from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50',
              delay: 0.3,
            },
            {
              title: 'XIRR',
              value: `${portfolioData.xirr.toFixed(1)}%`,
              subtitle: `CAGR: ${portfolioData.cagr.toFixed(1)}%`,
              icon: BarChart3,
              color: 'from-orange-500 to-red-500',
              bgColor:
                'from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50',
              delay: 0.4,
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay }}
            >
              <Card
                className={`shadow-xl border-2 border-white/50 dark:border-gray-800/50 bg-gradient-to-br ${card.bgColor} backdrop-blur-sm hover:shadow-2xl transition-all group`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                      {card.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Smart Insights Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Smart Insights</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI-powered portfolio analysis
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Top Performer
                    </h4>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {insights.topPerformer}
                  </p>
                  <p className="text-sm text-green-600 font-semibold">
                    +{insights.topPerformerReturn}% returns
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Highest Allocation
                    </h4>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {insights.highestCategory}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold">
                    {insights.highestPercent}% of portfolio
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      1-Year Return
                    </h4>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Your Portfolio
                  </p>
                  <p className="text-sm text-purple-600 font-semibold">
                    +{insights.oneYearReturn}% absolute
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Portfolio Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={portfolioData.growthData}>
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        }}
                        formatter={(value: number) => [
                          `₹${value.toLocaleString()}`,
                          'Value',
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Holdings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      Holdings
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {portfolioData.holdings.length} funds
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 pb-3 border-b-2 border-gray-200 dark:border-gray-800 mb-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <button
                      onClick={() => handleSort('name')}
                      className="col-span-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1 group"
                    >
                      Fund Name
                      <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Category
                    </div>
                    <button
                      onClick={() => handleSort('value')}
                      className="col-span-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center justify-end gap-1 group"
                    >
                      Current
                      <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => handleSort('pl')}
                      className="col-span-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center justify-end gap-1 group"
                    >
                      P&L
                      <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="col-span-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Actions
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {sortedHoldings.map((holding, idx) => (
                        <motion.div
                          key={holding.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: idx * 0.05 }}
                          className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group"
                        >
                          <div className="col-span-4">
                            <Link href={`/funds/${holding.id}`}>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                                {holding.fundName}
                              </h4>
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {holding.units.toFixed(2)} units • NAV ₹
                              {holding.currentNav.toFixed(2)}
                            </p>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                              {holding.category}
                            </span>
                          </div>
                          <div className="col-span-2 text-right">
                            <p className="font-bold text-gray-900 dark:text-gray-100">
                              ₹{holding.currentValue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Inv: ₹{holding.invested.toLocaleString()}
                            </p>
                          </div>
                          <div className="col-span-2 text-right">
                            <p
                              className={`font-bold ${
                                holding.pl >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {holding.pl >= 0 ? '+' : ''}₹
                              {holding.pl.toLocaleString()}
                            </p>
                            <p
                              className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                                holding.pl >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {holding.pl >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {holding.plPercent.toFixed(1)}%
                            </p>
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <Link href={`/funds/${holding.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Allocation Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <PieChartIcon className="w-5 h-5 text-white" />
                    </div>
                    Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={portfolioData.categoryAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          `${name}: ${value.toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioData.categoryAllocation.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                        }}
                        formatter={(
                          value: number,
                          name: string,
                          entry: any
                        ) => [
                          `₹${entry.payload.amount.toLocaleString()} (${value.toFixed(
                            1
                          )}%)`,
                          entry.payload.name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="mt-6 space-y-2">
                    {portfolioData.categoryAllocation.map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {cat.value.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Meter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className={`shadow-xl border-2 ${riskBg}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${
                        riskScore < 35
                          ? 'from-green-500 to-emerald-600'
                          : riskScore < 65
                            ? 'from-yellow-500 to-orange-600'
                            : 'from-red-500 to-pink-600'
                      } rounded-xl flex items-center justify-center`}
                    >
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    Risk Meter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Portfolio Risk
                      </span>
                      <span className={`text-2xl font-bold ${riskColor}`}>
                        {riskLevel}
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${riskScore}%` }}
                        transition={{ duration: 1, delay: 1 }}
                        className={`h-full rounded-full ${
                          riskScore < 35
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : riskScore < 65
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                              : 'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2">
                    <div className="flex items-start gap-2">
                      {riskScore < 35 ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : riskScore < 65 ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {riskScore < 35
                            ? 'Well-balanced portfolio'
                            : riskScore < 65
                              ? 'Moderate risk exposure'
                              : 'High risk concentration'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {riskScore < 35
                            ? 'Your portfolio is well-diversified across safe and stable fund categories.'
                            : riskScore < 65
                              ? 'Consider diversifying into more stable categories to reduce risk.'
                              : 'High allocation to volatile categories. Consider rebalancing for better risk management.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="shadow-xl border-2 border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    Recommendations
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Funds matching your portfolio theme
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolioData.recommendations.map((fund, idx) => (
                      <motion.div
                        key={fund.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + idx * 0.1 }}
                        className="p-4 bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all group cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {fund.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full font-semibold">
                            {fund.category}
                          </span>
                          <div className="text-right">
                            <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                              +{fund.return1Y}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {fund.risk} Risk
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/funds">
                    <Button className="w-full mt-4" variant="outline">
                      Explore More Funds
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Add Investment Modal */}
      <Dialog
        open={showAddInvestmentModal}
        onOpenChange={setShowAddInvestmentModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add New Investment
            </DialogTitle>
            <DialogDescription>
              Enter the details of your mutual fund investment
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div>
              <Label htmlFor="fundName">Fund Name</Label>
              <Input
                id="fundName"
                placeholder="Search for a fund..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount">Investment Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="₹ 10,000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date">Investment Date</Label>
              <Input id="date" type="date" className="mt-1" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddInvestmentModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Investment added successfully! (This is a demo)');
                  setShowAddInvestmentModal(false);
                }}
              >
                Add Investment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
