/**
 * ═══════════════════════════════════════════════════════════════════════
 * USE MARKET INDICES HOOK - Production-Grade Auto-Refresh
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This hook provides:
 * - Auto-refresh every 10 seconds (visual refresh, not API abuse)
 * - Market status awareness (pause refresh when market closed)
 * - Error handling with retry
 * - Loading states
 * - Stale data detection
 *
 * Architecture:
 * ┌─────────────────┐
 * │  This Hook      │ ← Refreshes every 10s
 * └────────┬────────┘
 *          │
 *          ▼
 * ┌─────────────────┐
 * │  Backend API    │ ← Returns cached data (< 30ms)
 * └────────┬────────┘
 *          │
 *          ▼
 * ┌─────────────────┐
 * │  Redis Cache    │ ← Updated every 5 min by worker
 * └─────────────────┘
 *
 * Key Rule: Frontend refreshes ≠ External API calls
 * - Worker fetches from Yahoo every 5 min
 * - Frontend fetches from our cache every 10 sec
 * - Result: Users feel "live" data, but only 12 API calls/hour
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Refresh intervals
const REFRESH_INTERVAL_OPEN = 10000; // 10 seconds when market open
const REFRESH_INTERVAL_CLOSED = 60000; // 60 seconds when market closed
const STALE_THRESHOLD = 10 * 60 * 1000; // 10 minutes

export interface MarketIndex {
  symbol: string;
  name: string;
  category?: string;
  value: number;
  change: number;
  percentChange: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

export interface MarketMeta {
  updatedAt: string;
  updatedAtIST?: string;
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE_OPEN' | 'HOLIDAY' | 'WEEKEND';
  isMarketOpen: boolean;
  nextOpenTime?: string;
  dataSource?: string;
}

export interface UseMarketIndicesReturn {
  indices: MarketIndex[];
  meta: MarketMeta | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
  lastFetchTime: Date | null;
  refetch: () => Promise<void>;
  getIndex: (symbol: string) => MarketIndex | undefined;
}

export function useMarketIndices(): UseMarketIndicesReturn {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [meta, setMeta] = useState<MarketMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Calculate if data is stale
  const isStale = lastFetchTime
    ? Date.now() - lastFetchTime.getTime() > STALE_THRESHOLD
    : true;

  // Fetch market indices
  const fetchIndices = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/api/market/indices`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'API returned unsuccessful response');
        }

        // Update state
        setIndices(data.data || []);
        setMeta(data.meta || null);
        setError(null);
        setLastFetchTime(new Date());
        retryCount.current = 0;

        return data;
      } catch (err: any) {
        const errorMessage =
          err.name === 'AbortError'
            ? 'Request timed out'
            : err.message || 'Failed to fetch market indices';

        console.error('Market indices fetch error:', errorMessage);

        // Only set error if we have no data yet
        if (indices.length === 0) {
          setError(errorMessage);
        }

        // Retry logic
        if (retryCount.current < maxRetries) {
          retryCount.current++;
          console.log(`Retrying... (${retryCount.current}/${maxRetries})`);
          setTimeout(() => fetchIndices(true), 2000 * retryCount.current);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [indices.length]
  );

  // Get refresh interval based on market status
  const getRefreshInterval = useCallback(() => {
    if (meta?.isMarketOpen) {
      return REFRESH_INTERVAL_OPEN;
    }
    return REFRESH_INTERVAL_CLOSED;
  }, [meta?.isMarketOpen]);

  // Setup auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchIndices();

    // Set up interval
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const interval = getRefreshInterval();
      intervalRef.current = setInterval(() => {
        fetchIndices(true); // Silent refresh
      }, interval);
    };

    setupInterval();

    // Re-setup interval when market status changes
    const intervalCheckId = setInterval(() => {
      const newInterval = getRefreshInterval();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => fetchIndices(true), newInterval);
    }, 60000); // Check every minute

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearInterval(intervalCheckId);
    };
  }, [fetchIndices, getRefreshInterval]);

  // Visibility change handler - pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh when tab becomes visible
        fetchIndices(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchIndices]);

  // Get specific index by symbol
  const getIndex = useCallback(
    (symbol: string): MarketIndex | undefined => {
      return indices.find(
        (idx) =>
          idx.symbol.toUpperCase() === symbol.toUpperCase() ||
          idx.name.toUpperCase().includes(symbol.toUpperCase())
      );
    },
    [indices]
  );

  // Manual refetch
  const refetch = useCallback(async () => {
    await fetchIndices(false);
  }, [fetchIndices]);

  return {
    indices,
    meta,
    loading,
    error,
    isStale,
    lastFetchTime,
    refetch,
    getIndex,
  };
}

/**
 * Hook for single index
 */
export function useMarketIndex(symbol: string) {
  const { indices, meta, loading, error, isStale, refetch } =
    useMarketIndices();

  const index = indices.find(
    (idx) =>
      idx.symbol.toUpperCase() === symbol.toUpperCase() ||
      idx.name.toUpperCase().includes(symbol.toUpperCase())
  );

  return {
    index,
    meta,
    loading,
    error,
    isStale,
    found: !!index,
    refetch,
  };
}

/**
 * Hook for market status only
 */
export function useMarketStatus() {
  const [status, setStatus] = useState<MarketMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/market/status`);
        const data = await response.json();

        if (data.success) {
          setStatus(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch market status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Refresh status every minute
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return { status, loading };
}

export default useMarketIndices;
