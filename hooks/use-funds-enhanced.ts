/**
 * 🚀 PRODUCTION HOOK: useFunds
 * Custom React hook for fetching and managing 4000+ mutual funds
 *
 * Features:
 * - Automatic data fetching
 * - Multi-page support
 * - Progress tracking
 * - Filter management
 * - Error handling
 * - Loading states
 * - Caching (optional)
 *
 * @example
 * ```typescript
 * const { funds, loading, error, pagination } = useFunds({
 *   category: 'equity',
 *   limit: 50
 * });
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api-client';

export interface FundFilters {
  category?: string;
  subCategory?: string;
  fundHouse?: string;
  minAum?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UseFundsOptions {
  /**
   * Initial filters to apply
   */
  filters?: FundFilters;

  /**
   * Whether to fetch all funds across multiple pages
   * If true, will use getFundsMultiPage
   * If false, will use getFunds (single page)
   * @default false
   */
  fetchAll?: boolean;

  /**
   * Target number of funds when fetchAll is true
   * @default undefined (fetch all available)
   */
  targetCount?: number;

  /**
   * Whether to automatically fetch on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Callback for progress updates during multi-page fetch
   */
  onProgress?: (loaded: number, total: number) => void;

  /**
   * Enable caching (stores result in ref)
   * @default false
   */
  enableCache?: boolean;
}

export interface UseFundsReturn {
  /** Array of funds */
  funds: any[];

  /** Loading state */
  loading: boolean;

  /** Error message if any */
  error: string | null;

  /** Pagination information */
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  /** Current filters */
  filters: FundFilters;

  /** Update filters (resets to page 1) */
  setFilters: (newFilters: Partial<FundFilters>) => void;

  /** Go to specific page */
  goToPage: (page: number) => void;

  /** Go to next page */
  nextPage: () => void;

  /** Go to previous page */
  prevPage: () => void;

  /** Reload current data */
  refetch: () => Promise<void>;

  /** Reset all filters */
  reset: () => void;

  /** Progress info (for multi-page fetch) */
  progress?: {
    loaded: number;
    total: number;
    percentage: number;
  };

  /** Metadata from multi-page fetch */
  metadata?: {
    totalAvailable: number;
    fetchedPages: number;
    duplicatesRemoved: number;
  };
}

/**
 * Custom hook for fetching mutual funds
 */
export function useFunds(options: UseFundsOptions = {}): UseFundsReturn {
  const {
    filters: initialFilters = {},
    fetchAll = false,
    targetCount,
    autoFetch = true,
    onProgress,
    enableCache = false,
  } = options;

  // State
  const [funds, setFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFiltersState] = useState<FundFilters>({
    page: 1,
    limit: fetchAll ? undefined : 50,
    ...initialFilters,
  });
  const [progress, setProgress] = useState<
    { loaded: number; total: number } | undefined
  >();
  const [metadata, setMetadata] = useState<any>();

  // Cache ref
  const cacheRef = useRef<Map<string, any>>(new Map());
  const isInitialMount = useRef(true);

  /**
   * Generate cache key from filters
   */
  const getCacheKey = useCallback((filters: FundFilters): string => {
    return JSON.stringify(filters);
  }, []);

  /**
   * Fetch funds based on current mode (single/multi page)
   */
  const fetchFunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress(undefined);
      setMetadata(undefined);

      // Check cache
      if (enableCache) {
        const cacheKey = getCacheKey(filters);
        const cached = cacheRef.current.get(cacheKey);
        if (cached) {
          console.log('📦 Using cached data');
          setFunds(cached.data);
          setPagination(cached.pagination);
          setMetadata(cached.metadata);
          setLoading(false);
          return;
        }
      }

      let response;

      if (fetchAll) {
        // Multi-page fetch
        console.log('🚀 Fetching all funds...');

        const progressCallback = (loaded: number, total: number) => {
          setProgress({ loaded, total });
          onProgress?.(loaded, total);
        };

        response = await api.getFundsMultiPage(
          targetCount,
          {
            category: filters.category,
            subCategory: filters.subCategory,
            fundHouse: filters.fundHouse,
            minAum: filters.minAum,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          },
          progressCallback
        );

        setMetadata(response.metadata);
      } else {
        // Single page fetch
        console.log(`🚀 Fetching page ${filters.page || 1}...`);

        response = await api.getFunds(filters.page || 1, filters.limit || 50, {
          category: filters.category,
          subCategory: filters.subCategory,
          fundHouse: filters.fundHouse,
          minAum: filters.minAum,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });
      }

      if (!response.success) {
        throw new Error((response as any).error || 'Failed to fetch funds');
      }

      setFunds(response.data);
      setPagination(response.pagination || null);

      // Cache result
      if (enableCache) {
        const cacheKey = getCacheKey(filters);
        cacheRef.current.set(cacheKey, {
          data: response.data,
          pagination: response.pagination,
          metadata: (response as any).metadata,
        });
      }

      console.log(`✅ Loaded ${response.data.length} funds`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch funds';
      console.error('❌ Error fetching funds:', errorMessage);
      setError(errorMessage);
      setFunds([]);
      setPagination(null);
    } finally {
      setLoading(false);
      setProgress(undefined);
    }
  }, [filters, fetchAll, targetCount, onProgress, enableCache, getCacheKey]);

  /**
   * Auto-fetch on mount and filter changes
   */
  useEffect(() => {
    if (!autoFetch && isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    isInitialMount.current = false;
    fetchFunds();
  }, [fetchFunds, autoFetch]);

  /**
   * Update filters (resets to page 1)
   */
  const setFilters = useCallback((newFilters: Partial<FundFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback(
    (page: number) => {
      if (fetchAll) {
        console.warn('⚠️ goToPage not supported in fetchAll mode');
        return;
      }
      setFiltersState((prev) => ({ ...prev, page }));
    },
    [fetchAll]
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      goToPage((filters.page || 1) + 1);
    }
  }, [pagination, filters.page, goToPage]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (pagination?.hasPrev) {
      goToPage((filters.page || 1) - 1);
    }
  }, [pagination, filters.page, goToPage]);

  /**
   * Reload current data
   */
  const refetch = useCallback(async () => {
    // Clear cache for current filters
    if (enableCache) {
      const cacheKey = getCacheKey(filters);
      cacheRef.current.delete(cacheKey);
    }
    await fetchFunds();
  }, [fetchFunds, enableCache, getCacheKey, filters]);

  /**
   * Reset all filters
   */
  const reset = useCallback(() => {
    setFiltersState({
      page: 1,
      limit: fetchAll ? undefined : 50,
    });
    if (enableCache) {
      cacheRef.current.clear();
    }
  }, [fetchAll, enableCache]);

  return {
    funds,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    goToPage,
    nextPage,
    prevPage,
    refetch,
    reset,
    progress: progress
      ? {
          loaded: progress.loaded,
          total: progress.total,
          percentage: Math.round((progress.loaded / progress.total) * 100),
        }
      : undefined,
    metadata,
  };
}

/**
 * Hook to fetch all equity funds (4000+)
 * Convenience wrapper for common use case
 */
export function useAllEquityFunds() {
  return useFunds({
    filters: { category: 'equity' },
    fetchAll: true,
    onProgress: (loaded, total) => {
      console.log(`📊 Loading equity funds: ${loaded}/${total}`);
    },
  });
}

/**
 * Hook to fetch all debt funds
 */
export function useAllDebtFunds() {
  return useFunds({
    filters: { category: 'debt' },
    fetchAll: true,
  });
}

/**
 * Hook to fetch all funds (4485+)
 */
export function useAllFunds(
  onProgress?: (loaded: number, total: number) => void
) {
  return useFunds({
    fetchAll: true,
    onProgress,
    enableCache: true, // Cache since this is expensive
  });
}

/**
 * Hook for paginated fund list
 */
export function usePaginatedFunds(category?: string, limit = 50) {
  return useFunds({
    filters: { category, limit },
    fetchAll: false,
  });
}
