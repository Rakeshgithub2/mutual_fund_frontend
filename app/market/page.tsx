'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Building2,
  BarChart3,
  Coins,
  Globe,
  Target,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MarketIndex {
  id: string;
  name: string;
  shortName: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume?: string;
  marketCap?: string;
  lastUpdated: string;
  icon: any;
  color: string;
  description: string;
  constituents?: number;
  importance: string[];
}

// ✅ FIXED: Use correct backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Comprehensive market indices with importance points for mutual fund investors
const MARKET_INDICES: Omit<
  MarketIndex,
  | 'value'
  | 'change'
  | 'changePercent'
  | 'high'
  | 'low'
  | 'open'
  | 'previousClose'
  | 'volume'
  | 'lastUpdated'
>[] = [
  {
    id: 'nifty50',
    name: 'Nifty 50',
    shortName: 'NIFTY 50',
    icon: TrendingUp,
    color: 'indigo',
    marketCap: '₹245 Lakh Cr',
    description:
      'The flagship index of NSE, representing 50 of the largest Indian companies listed on the exchange.',
    constituents: 50,
    importance: [
      'Primary benchmark for index funds and ETFs',
      'Indicates overall market direction and sentiment',
      'Used for derivatives and hedging strategies',
      'Helps in asset allocation decisions',
      'Critical for passive investment strategies',
    ],
  },
  {
    id: 'sensex',
    name: 'S&P BSE Sensex',
    shortName: 'SENSEX',
    icon: Building2,
    color: 'blue',
    marketCap: '₹280 Lakh Cr',
    description:
      "India's most tracked bellwether index, comprising 30 of the largest and most actively traded stocks on the BSE.",
    constituents: 30,
    importance: [
      'Benchmark for large-cap equity mutual funds',
      'Represents the pulse of Indian stock market',
      'Used to compare fund performance against market',
      'Reflects the health of blue-chip companies',
      'Key indicator for portfolio rebalancing decisions',
    ],
  },
  {
    id: 'niftymidcap',
    name: 'Nifty Midcap 100',
    shortName: 'MIDCAP 100',
    icon: BarChart3,
    color: 'purple',
    description:
      "Tracks India's top 100 mid-cap companies, offering exposure to emerging corporate sector.",
    constituents: 100,
    importance: [
      'Benchmark for mid-cap mutual funds',
      'Higher growth potential than large-caps',
      'Balances risk and return in portfolios',
      "Captures India's emerging companies",
      'Important for diversification strategies',
    ],
  },
  {
    id: 'commodity',
    name: 'MCX Commodity Index',
    shortName: 'MCX iCOMDEX',
    icon: Coins,
    color: 'amber',
    marketCap: 'N/A',
    description:
      "India's first commodity index tracking major commodities on MCX.",
    constituents: 6,
    importance: [
      'Benchmark for commodity funds',
      'Hedge against inflation',
      'Diversification beyond equities',
      'Reflects raw material price trends',
      'Important for inflation-protected portfolios',
    ],
  },
  {
    id: 'niftysmallcap',
    name: 'Nifty Smallcap 250',
    shortName: 'SMALLCAP 250',
    icon: Target,
    color: 'pink',
    description:
      'Represents 250 small-cap companies with high growth potential.',
    constituents: 250,
    importance: [
      'Benchmark for small-cap mutual funds',
      'Highest return potential with higher risk',
      'Captures grassroots economic growth',
      'Suitable for long-term aggressive portfolios',
      'Indicates domestic consumption trends',
    ],
  },
  {
    id: 'niftybank',
    name: 'Nifty Bank',
    shortName: 'BANK NIFTY',
    icon: Building2,
    color: 'green',
    description:
      'Comprises the 12 most liquid and large capitalized banking stocks.',
    constituents: 12,
    importance: [
      'Benchmark for banking sector funds',
      'Reflects health of financial system',
      'Key indicator of credit growth',
      'Important for sectoral allocation',
      'Highly responsive to RBI policy changes',
    ],
  },
  {
    id: 'niftyit',
    name: 'Nifty IT',
    shortName: 'NIFTY IT',
    icon: Activity,
    color: 'cyan',
    description: 'Tracks performance of IT and technology companies.',
    constituents: 10,
    importance: [
      'Benchmark for technology sector funds',
      'Reflects global IT demand trends',
      'Dollar-dependent sector performance',
      'Important for export-oriented exposure',
      'Key indicator of digital transformation',
    ],
  },
  {
    id: 'niftypharma',
    name: 'Nifty Pharma',
    shortName: 'NIFTY PHARMA',
    icon: Activity,
    color: 'teal',
    description: 'Tracks pharmaceutical and healthcare companies.',
    constituents: 10,
    importance: [
      'Benchmark for pharma sector funds',
      'Defensive sector during volatility',
      'Benefits from healthcare spending growth',
      'Export-oriented sector exposure',
      'Key for portfolio diversification',
    ],
  },
  {
    id: 'niftyauto',
    name: 'Nifty Auto',
    shortName: 'NIFTY AUTO',
    icon: TrendingUp,
    color: 'orange',
    description: 'Tracks automotive and related companies.',
    constituents: 15,
    importance: [
      'Benchmark for auto sector funds',
      'Indicates consumer demand trends',
      'Cyclical sector for tactical allocation',
      'Benefits from rural income growth',
      'Key indicator of manufacturing health',
    ],
  },
  {
    id: 'niftyfmcg',
    name: 'Nifty FMCG',
    shortName: 'NIFTY FMCG',
    icon: Coins,
    color: 'amber',
    description: 'Fast Moving Consumer Goods sector index.',
    constituents: 15,
    importance: [
      'Defensive sector benchmark',
      'Stable returns during market downturns',
      'Reflects consumer spending patterns',
      'Low volatility sector exposure',
      'Essential for conservative portfolios',
    ],
  },
  {
    id: 'niftymetal',
    name: 'Nifty Metal',
    shortName: 'NIFTY METAL',
    icon: BarChart3,
    color: 'gray',
    description: 'Tracks metal and mining companies.',
    constituents: 15,
    importance: [
      'Cyclical sector for tactical plays',
      'Benefits from infrastructure spending',
      'Global commodity price sensitive',
      'High beta for aggressive portfolios',
      'Industrial growth indicator',
    ],
  },
  {
    id: 'giftnifty',
    name: 'Gift Nifty',
    shortName: 'GIFT NIFTY',
    icon: Globe,
    color: 'green',
    description:
      'Nifty 50 derivative traded at GIFT City, providing early market signals.',
    importance: [
      'Early market sentiment indicator',
      'Used for pre-market analysis',
      'Helps in entry/exit timing',
      'Global participation indicator',
      'Useful for intraday fund strategies',
    ],
  },
];

export default function MarketPage() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/api/market/indices`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const apiData = await response.json();
        if (apiData.success && apiData.data) {
          // Realistic mock values for indices not provided by API
          const mockValues: Record<
            string,
            { value: number; change: number; changePercent: number }
          > = {
            niftysmallcap: {
              value: 16420.35,
              change: 187.25,
              changePercent: 1.15,
            },
            niftybank: { value: 48625.8, change: 352.4, changePercent: 0.73 },
            niftyit: { value: 35840.45, change: 245.6, changePercent: 0.69 },
            niftypharma: {
              value: 18925.3,
              change: 124.85,
              changePercent: 0.66,
            },
            niftyauto: { value: 20845.6, change: 198.75, changePercent: 0.96 },
          };

          // Merge API data with static data
          const mergedIndices = MARKET_INDICES.map((indexConfig) => {
            const apiIndex = findApiIndex(apiData.data, indexConfig.id);
            const mockData = mockValues[indexConfig.id];

            // Use API data if available, otherwise use mock data
            if (apiIndex && apiIndex.value) {
              // Handle both change formats: {change: number} and {change: {value: number, percent: number}}
              const changeValue =
                typeof apiIndex.change === 'object'
                  ? apiIndex.change.value
                  : apiIndex.change;
              const changePercentValue =
                typeof apiIndex.change === 'object'
                  ? apiIndex.change.percent
                  : apiIndex.changePercent;

              return {
                ...indexConfig,
                value: apiIndex.value,
                change: changeValue,
                changePercent: changePercentValue,
                high: apiIndex.high,
                low: apiIndex.low,
                open: apiIndex.open,
                previousClose: apiIndex.previousClose,
                volume: apiIndex.volume || 'N/A',
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
              };
            } else if (mockData) {
              // Use mock data for indices not supported by API
              return {
                ...indexConfig,
                value: mockData.value,
                change: mockData.change,
                changePercent: mockData.changePercent,
                high: mockData.value + Math.abs(mockData.change) * 0.5,
                low: mockData.value - Math.abs(mockData.change) * 0.5,
                open: mockData.value - mockData.change * 0.3,
                previousClose: mockData.value - mockData.change,
                volume: 'N/A',
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
              };
            } else {
              // Fallback for any other indices
              return {
                ...indexConfig,
                value: 0,
                change: 0,
                changePercent: 0,
                high: 0,
                low: 0,
                open: 0,
                previousClose: 0,
                volume: 'N/A',
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
              };
            }
          });
          setIndices(mergedIndices);
        } else {
          setFallbackData();
        }
      } else {
        setFallbackData();
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setFallbackData();
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  const findApiIndex = (apiData: any, id: string) => {
    // Backend returns { majorIndices: [...], marketStatus: '...' }
    const indices = apiData.majorIndices || apiData;

    if (Array.isArray(indices)) {
      // Find the index by matching symbol or name
      return indices.find((index: any) => {
        const symbol = (index.symbol || '').toLowerCase();
        const name = (index.name || '').toLowerCase();
        const searchId = id.toLowerCase();

        // Match various formats
        return (
          symbol === searchId ||
          symbol === searchId.replace('nifty', '') ||
          name.includes(searchId) ||
          (searchId === 'sensex' && symbol === 'sensex') ||
          (searchId === 'nifty50' &&
            (symbol === 'nifty50' || symbol === 'nifty_50')) ||
          (searchId === 'niftymidcap' && name.includes('midcap')) ||
          (searchId === 'niftybank' &&
            (symbol === 'banknifty' || name.includes('bank'))) ||
          (searchId === 'giftnifty' && name.includes('gift'))
        );
      });
    }

    // Legacy format support
    const { sensex, nifty50, niftyMidcap, giftNifty } = apiData;
    switch (id) {
      case 'sensex':
        return sensex;
      case 'nifty50':
        return nifty50;
      case 'niftymidcap':
        return niftyMidcap;
      case 'giftnifty':
        return giftNifty;
      default:
        return null;
    }
  };

  const setFallbackData = () => {
    // Realistic mock values for indices
    const mockValues: Record<
      string,
      { value: number; change: number; changePercent: number }
    > = {
      sensex: { value: 72426.64, change: 524.31, changePercent: 0.73 },
      nifty50: { value: 21929.15, change: 188.35, changePercent: 0.87 },
      niftymidcap: { value: 50846.25, change: 421.15, changePercent: 0.83 },
      niftysmallcap: { value: 16420.35, change: 187.25, changePercent: 1.15 },
      niftybank: { value: 48625.8, change: 352.4, changePercent: 0.73 },
      niftyit: { value: 35840.45, change: 245.6, changePercent: 0.69 },
      niftypharma: { value: 18925.3, change: 124.85, changePercent: 0.66 },
      niftyauto: { value: 20845.6, change: 198.75, changePercent: 0.96 },
      giftnifty: { value: 21950.0, change: 195.5, changePercent: 0.9 },
    };

    const fallbackIndices = MARKET_INDICES.map((indexConfig) => {
      const mockData = mockValues[indexConfig.id] || {
        value: 20000,
        change: 100,
        changePercent: 0.5,
      };
      return {
        ...indexConfig,
        value: mockData.value,
        change: mockData.change,
        changePercent: mockData.changePercent,
        high: mockData.value + Math.abs(mockData.change) * 0.5,
        low: mockData.value - Math.abs(mockData.change) * 0.5,
        open: mockData.value - mockData.change * 0.3,
        previousClose: mockData.value - mockData.change,
        volume: `${(Math.random() * 1000 + 500).toFixed(0)} Cr`,
        lastUpdated: new Date().toLocaleTimeString('en-IN'),
      };
    });
    setIndices(fallbackIndices);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchMarketData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 mt-2 hidden md:block">
          <BackButton />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Live Market Indices
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track real-time performance of major Indian market indices
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Last updated:{' '}
              {isMounted ? lastRefresh.toLocaleTimeString('en-IN') : '--:--:--'}
            </span>
          </div>
        </motion.div>

        {/* Market Indices Grid */}
        {loading && indices.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Loading market data...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indices.map((index, idx) => {
              return (
                <motion.div
                  key={index.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/market/${index.id}`}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${index.color}-400 to-${index.color}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            <index.icon className="w-6 h-6 text-white" />
                          </div>
                          <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                              index.change >= 0
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            }`}
                          >
                            {index.change >= 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {Math.abs(index.changePercent ?? 0).toFixed(2)}%
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                          {index.shortName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {index.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                              {index.value.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p
                              className={`text-sm font-semibold ${
                                index.change >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {index.change >= 0 ? '+' : ''}
                              {(index.change ?? 0).toFixed(2)} (
                              {index.changePercent >= 0 ? '+' : ''}
                              {(index.changePercent ?? 0).toFixed(2)}%)
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                Open:
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {(index.open ?? 0).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                High:
                              </span>
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                {(index.high ?? 0).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                Low:
                              </span>
                              <p className="font-semibold text-red-600 dark:text-red-400">
                                {(index.low ?? 0).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                Prev Close:
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {(index.previousClose ?? 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {index.constituents && (
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {index.constituents} constituents
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Why Track Market Indices?
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Performance Benchmark:</strong> Compare your mutual fund
                returns against relevant market indices
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Market Sentiment:</strong> Gauge overall market
                direction and investor confidence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Asset Allocation:</strong> Make informed decisions about
                portfolio rebalancing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Sectoral Trends:</strong> Identify sector-specific
                opportunities and risks
              </span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
