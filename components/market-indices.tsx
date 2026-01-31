'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Building2,
  BarChart3,
  Coins,
  Globe,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface MarketIndex {
  id: string;
  name: string;
  symbol: string; // Backend symbol for routing
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
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'indian' | 'global'>('indian'); // ✅ NEW: Tab state
  const [retryCount, setRetryCount] = useState(0);

  // ✅ NEW: Refresh interval for real-time updates (every 5 minutes)
  useEffect(() => {
    fetchRealMarketData();
    const interval = setInterval(fetchRealMarketData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // ✅ Retry mechanism if initial fetch fails
  useEffect(() => {
    if (indices.length === 0 && !loading && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying market indices fetch (${retryCount + 1}/3)...`);
        setLoading(true);
        setRetryCount((prev) => prev + 1);
        fetchRealMarketData();
      }, 2000); // Retry after 2 seconds

      return () => clearTimeout(retryTimeout);
    }
  }, [indices, loading, retryCount]);

  // Fetch real market data from backend API
  const fetchRealMarketData = async () => {
    try {
      // Fetch from our backend proxy API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/market/indices`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('API Error Response:', errorText);
        throw new Error(
          `Failed to fetch market data: ${response.status} ${response.statusText}`
        );
      }

      const apiData = await response.json();

      if (!apiData.success) {
        throw new Error('Invalid API response');
      }

      // Backend may return array or structured object
      let indicesArray = [];

      if (Array.isArray(apiData.data)) {
        // Direct array format from /api/market/indices - this is what we use now
        indicesArray = apiData.data;
      } else if (apiData.majorIndices) {
        // Backend /api/market/summary returns { success: true, majorIndices: [...] }
        indicesArray = apiData.majorIndices;
      } else if (apiData.data && apiData.data.majorIndices) {
        // Nested format
        indicesArray = apiData.data.majorIndices;
      } else if (apiData.data.indian) {
        // Structured format: { indian: [...], global: [...] }
        indicesArray = apiData.data.indian;
      } else if (apiData.majorIndices) {
        // Direct majorIndices format
        indicesArray = apiData.majorIndices;
      }

      // If no data received, throw error to use fallback
      if (!indicesArray || indicesArray.length === 0) {
        throw new Error('No market data available from backend');
      }

      // Map API data to our MarketIndex interface
      const realIndices: MarketIndex[] = indicesArray.map((index: any) => {
        // Use lowercase name from backend
        const indexKey = (index.name || index.id || '').toLowerCase();

        // Icon mapping - all lowercase
        const iconMap: Record<string, any> = {
          nifty50: BarChart3,
          sensex: Building2,
          niftymidcap: Activity,
          niftysmallcap: Activity,
          niftybank: Coins,
          niftyit: TrendingUp,
          niftypharma: TrendingUp,
          niftyauto: Activity,
          niftyfmcg: Activity,
          niftymetal: Activity,
          commodity: Coins,
          giftnifty: Globe,
        };

        // Color mapping - all lowercase
        const colorMap: Record<string, string> = {
          nifty50: 'from-blue-500 to-blue-600',
          sensex: 'from-purple-500 to-purple-600',
          niftymidcap: 'from-green-500 to-green-600',
          niftysmallcap: 'from-orange-500 to-orange-600',
          niftybank: 'from-red-500 to-red-600',
          niftyit: 'from-cyan-500 to-cyan-600',
          niftypharma: 'from-pink-500 to-pink-600',
          niftyauto: 'from-indigo-500 to-indigo-600',
          niftyfmcg: 'from-emerald-500 to-emerald-600',
          niftymetal: 'from-amber-500 to-amber-600',
          commodity: 'from-yellow-500 to-yellow-600',
          giftnifty: 'from-teal-500 to-teal-600',
        };

        // Handle both formats: {change: number} and {change: {value: number, percent: number}}
        const changeValue =
          typeof index.change === 'object' ? index.change.value : index.change;
        const changePercentValue =
          typeof index.change === 'object'
            ? index.change.percent
            : index.changePercent;

        return {
          id: indexKey,
          name: indexKey,
          symbol: indexKey,
          shortName: indexKey.toUpperCase(),
          value: index.value || 0,
          change: index.change || 0,
          changePercent: index.percent_change || 0,
          high: index.value || 0,
          low: index.value || 0,
          open: index.value || 0,
          previousClose: (index.value || 0) - (index.change || 0),
          lastUpdated: new Date(
            index.updated_at || index.updatedAt
          ).toLocaleTimeString('en-IN'),
          icon: iconMap[indexKey] || Activity,
          color: colorMap[indexKey] || 'from-gray-500 to-gray-600',
          description: `${index.name} index`,
          constituents: index.constituents,
        };
      });

      if (realIndices.length > 0) {
        setIndices(realIndices);
        setLoading(false);
      } else {
        throw new Error('No market data received from API');
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch market indices:', error);
      console.error('API URL:', `${API_BASE_URL}/api/market/indices`);

      // Show detailed error for debugging
      if (error.name === 'AbortError') {
        console.error('Request timeout - backend may be slow or unavailable');
      } else if (error.message?.includes('fetch')) {
        console.error(
          'Network error - check if backend is running on',
          API_BASE_URL
        );
      }

      setIndices([]); // Empty - only show backend data
      setLoading(false);
    }
  }; // Close the fetchRealMarketData function

  // Don't render if loading
  if (loading) {
    return (
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-700 py-3">
        <div className="animate-pulse flex gap-4 px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // If no indices data from backend, show a message
  if (indices.length === 0) {
    return (
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-700 py-3">
        <div className="flex items-center justify-center gap-2 px-4 text-sm text-gray-500 dark:text-gray-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>
            {retryCount > 0
              ? `Loading market indices... (attempt ${retryCount}/3)`
              : 'Market indices temporarily unavailable'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Scrolling Ticker */}
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 py-3 px-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {indices.map((index) => (
              <Link
                key={index.id}
                href={`/market/${index.symbol}`}
                className="flex-shrink-0"
              >
                <motion.div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg flex-shrink-0 transition-all hover:scale-105 cursor-pointer ${
                    index.change >= 0
                      ? 'bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50'
                      : 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <index.icon
                    className={`w-6 h-6 ${
                      index.change >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  />

                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {index.shortName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {index.value.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-0.5 ${
                          index.change >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {index.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(index.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedIndex && (
          <Dialog
            open={!!selectedIndex}
            onOpenChange={() => setSelectedIndex(null)}
          >
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg bg-${selectedIndex.color}-100 dark:bg-${selectedIndex.color}-950/30`}
                    >
                      <selectedIndex.icon
                        className={`w-6 h-6 text-${selectedIndex.color}-600 dark:text-${selectedIndex.color}-400`}
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold">
                        {selectedIndex.name}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedIndex.description}
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Current Value Card */}
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Current Value
                        </p>
                        <p className="text-4xl font-bold text-foreground">
                          {selectedIndex.value.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          selectedIndex.change >= 0
                            ? 'bg-green-100 dark:bg-green-950/30'
                            : 'bg-red-100 dark:bg-red-950/30'
                        }`}
                      >
                        {selectedIndex.change >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              selectedIndex.change >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {selectedIndex.change >= 0 ? '+' : ''}
                            {selectedIndex.change.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${
                              selectedIndex.change >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {selectedIndex.change >= 0 ? '+' : ''}
                            {selectedIndex.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Open
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedIndex.open.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Prev. Close
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedIndex.previousClose.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Day High
                        </p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {selectedIndex.high.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Day Low
                        </p>
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {selectedIndex.low.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {(selectedIndex.volume ||
                      selectedIndex.marketCap ||
                      selectedIndex.constituents) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        {selectedIndex.volume && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Volume
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedIndex.volume}
                            </p>
                          </div>
                        )}
                        {selectedIndex.marketCap && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Market Cap
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedIndex.marketCap}
                            </p>
                          </div>
                        )}
                        {selectedIndex.constituents && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Constituents
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedIndex.constituents} Companies
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Live Market Data
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Data updates every few seconds during market hours. Last
                      updated at {selectedIndex.lastUpdated}.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
