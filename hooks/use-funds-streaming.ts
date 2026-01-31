'use client';

/**
 * ================================================================
 * useFundsStreaming - Background Loading Hook
 * ================================================================
 *
 * This hook implements Groww/Zerodha-style fund loading:
 *
 * 1. INSTANT: First 500 funds render in < 2 seconds
 * 2. SILENT: Background loads remaining pages without UI blocking
 * 3. CACHED: Already-loaded pages are instantly available
 * 4. SMART: Respects category/subcategory filters
 *
 * ================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchFundsBatch } from '@/app/actions/funds';

// ================================================================
// TYPES
// ================================================================
export interface Fund {
  id: string;
  schemeCode?: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  nav: number;
  navChange?: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  expenseRatio: number;
  riskLevel?: string;
  planType?: 'Direct' | 'Regular';
  optionType?: 'Growth' | 'IDCW';
}

interface FundsCache {
  [pageKey: string]: Fund[];
}

interface StreamingState {
  // Current page data (what user sees)
  currentPageFunds: Fund[];

  // Loading states
  isInitialLoading: boolean; // First page loading
  isBackgroundLoading: boolean; // Background pages loading

  // Pagination info
  currentPage: number;
  totalPages: number;
  totalFunds: number;
  loadedPages: number;

  // Cache status
  cachedPages: number[];

  // Error state
  error: Error | null;
}

interface UseFundsStreamingOptions {
  category?: string;
  subCategory?: string;
  searchQuery?: string;
  pageSize?: number;
}

// ================================================================
// CONSTANTS
// ================================================================
const DEFAULT_PAGE_SIZE = 500;
const BACKGROUND_FETCH_DELAY = 100; // ms between background fetches

// ================================================================
// IN-MEMORY CACHE (persists across re-renders)
// ================================================================
const globalFundsCache: FundsCache = {};
let globalTotalCount = 0;
let globalAllFunds: Fund[] = [];
let globalCacheKey = '';

// ================================================================
// MAIN HOOK
// ================================================================
export function useFundsStreaming(options: UseFundsStreamingOptions = {}) {
  const {
    category = '',
    subCategory = '',
    searchQuery = '',
    pageSize = DEFAULT_PAGE_SIZE,
  } = options;

  // Generate cache key based on filters
  const cacheKey = `${category}|${subCategory}`;

  // State
  const [state, setState] = useState<StreamingState>({
    currentPageFunds: [],
    isInitialLoading: true,
    isBackgroundLoading: false,
    currentPage: 1,
    totalPages: 0,
    totalFunds: 0,
    loadedPages: 0,
    cachedPages: [],
    error: null,
  });

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef(false);
  const backgroundLoadingRef = useRef(false);

  // ================================================================
  // TRANSFORM FUND DATA
  // ================================================================
  const transformFund = useCallback(
    (fund: any): Fund => ({
      id: fund.schemeCode || fund.id || fund.fundId,
      schemeCode: fund.schemeCode,
      name: fund.schemeName || fund.name || '',
      fundHouse: fund.amc?.name || fund.amcName || fund.fundHouse || '',
      category: fund.category || 'Equity',
      subCategory: fund.subCategory || '',
      nav: fund.nav?.value || fund.nav || 0,
      navChange: fund.navChange || 0,
      returns1Y: fund.returns?.['1Y'] || fund.returns1Y || 0,
      returns3Y: fund.returns?.['3Y'] || fund.returns3Y || 0,
      returns5Y: fund.returns?.['5Y'] || fund.returns5Y || 0,
      expenseRatio: fund.expenseRatio?.value || fund.expenseRatio || 0,
      riskLevel: fund.riskLevel || 'Moderately High',
      planType: fund.name?.toLowerCase().includes('direct')
        ? 'Direct'
        : 'Regular',
      optionType: fund.name?.toLowerCase().includes('idcw') ? 'IDCW' : 'Growth',
    }),
    []
  );

  // ================================================================
  // FILTER FUNDS (for category/search)
  // ================================================================
  const filterFunds = useCallback(
    (funds: Fund[], cat: string, subCat: string, query: string): Fund[] => {
      let filtered = funds;

      // Category filter
      if (cat) {
        const catLower = cat.toLowerCase();
        filtered = filtered.filter((fund) => {
          const fundCat = (fund.category || '').toLowerCase();
          const fundSubCat = (fund.subCategory || '').toLowerCase();
          const fundName = (fund.name || '').toLowerCase();

          return (
            fundCat.includes(catLower) ||
            fundSubCat.includes(catLower) ||
            fundName.includes(catLower)
          );
        });
      }

      // SubCategory filter
      if (subCat) {
        const subCatLower = subCat.toLowerCase().replace(/-/g, ' ');
        filtered = filtered.filter((fund) => {
          const fundSubCat = (fund.subCategory || '').toLowerCase();
          return fundSubCat.includes(subCatLower);
        });
      }

      // Search filter
      if (query.trim()) {
        const queryLower = query.toLowerCase().trim();
        filtered = filtered.filter(
          (fund) =>
            fund.name.toLowerCase().includes(queryLower) ||
            fund.fundHouse.toLowerCase().includes(queryLower) ||
            fund.schemeCode?.toLowerCase().includes(queryLower)
        );
      }

      return filtered;
    },
    []
  );

  // ================================================================
  // LOAD FIRST PAGE (INSTANT)
  // ================================================================
  const loadFirstPage = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    console.log('🚀 [Streaming] Loading first page INSTANTLY...');
    const startTime = performance.now();

    try {
      setState((prev) => ({ ...prev, isInitialLoading: true, error: null }));

      // Check if we have cached data
      if (globalCacheKey === cacheKey && globalAllFunds.length > 0) {
        console.log('⚡ [Streaming] Using cached data!');
        const filtered = filterFunds(
          globalAllFunds,
          category,
          subCategory,
          searchQuery
        );
        const firstPageFunds = filtered.slice(0, pageSize);
        const totalPages = Math.ceil(filtered.length / pageSize);

        setState((prev) => ({
          ...prev,
          currentPageFunds: firstPageFunds,
          isInitialLoading: false,
          totalPages,
          totalFunds: filtered.length,
          loadedPages: Math.ceil(globalAllFunds.length / pageSize),
          cachedPages: Array.from({ length: totalPages }, (_, i) => i + 1),
        }));

        isLoadingRef.current = false;
        return;
      }

      // Fetch first batch from server
      const response = await fetchFundsBatch(0, pageSize);

      if (response.success && response.data) {
        const transformedFunds = response.data.map(transformFund);
        const totalCount = response.total || transformedFunds.length * 20; // Estimate if not provided
        const totalPages = Math.ceil(totalCount / pageSize);

        // Store in cache
        globalFundsCache['page_1'] = transformedFunds;
        globalAllFunds = transformedFunds;
        globalTotalCount = totalCount;
        globalCacheKey = cacheKey;

        // Filter for display
        const filtered = filterFunds(
          transformedFunds,
          category,
          subCategory,
          searchQuery
        );

        const elapsed = performance.now() - startTime;
        console.log(
          `✅ [Streaming] First page loaded in ${elapsed.toFixed(0)}ms (${transformedFunds.length} funds)`
        );

        setState((prev) => ({
          ...prev,
          currentPageFunds: filtered.slice(0, pageSize),
          isInitialLoading: false,
          totalPages,
          totalFunds: totalCount,
          loadedPages: 1,
          cachedPages: [1],
        }));

        // Start background loading
        startBackgroundLoading(1, totalPages);
      }
    } catch (error) {
      console.error('❌ [Streaming] First page error:', error);
      setState((prev) => ({
        ...prev,
        isInitialLoading: false,
        error: error as Error,
      }));
    }

    isLoadingRef.current = false;
  }, [
    cacheKey,
    category,
    subCategory,
    searchQuery,
    pageSize,
    filterFunds,
    transformFund,
  ]);

  // ================================================================
  // BACKGROUND LOADING (SILENT)
  // ================================================================
  const startBackgroundLoading = useCallback(
    async (startPage: number, totalPages: number) => {
      if (backgroundLoadingRef.current) return;
      backgroundLoadingRef.current = true;

      console.log(
        `🔄 [Streaming] Starting background load from page ${startPage + 1}...`
      );

      setState((prev) => ({ ...prev, isBackgroundLoading: true }));

      let currentOffset = startPage * pageSize;
      let pageNum = startPage + 1;
      let allLoadedFunds = [...globalAllFunds];

      while (pageNum <= totalPages + 5) {
        // Load a few extra pages just in case
        try {
          // Small delay to not overwhelm the server
          await new Promise((resolve) =>
            setTimeout(resolve, BACKGROUND_FETCH_DELAY)
          );

          const response = await fetchFundsBatch(currentOffset, pageSize);

          if (
            !response.success ||
            !response.data ||
            response.data.length === 0
          ) {
            console.log(
              `✅ [Streaming] Background loading complete at page ${pageNum}`
            );
            break;
          }

          const transformedFunds = response.data.map(transformFund);

          // Add to cache
          globalFundsCache[`page_${pageNum}`] = transformedFunds;
          allLoadedFunds = [...allLoadedFunds, ...transformedFunds];
          globalAllFunds = allLoadedFunds;

          // Update state silently (no re-render of current view)
          setState((prev) => ({
            ...prev,
            loadedPages: pageNum,
            cachedPages: [...prev.cachedPages, pageNum],
            totalFunds: allLoadedFunds.length,
          }));

          console.log(
            `📦 [Streaming] Background page ${pageNum} loaded (${allLoadedFunds.length} total)`
          );

          currentOffset += pageSize;
          pageNum++;

          // Stop if no more data
          if (!response.hasMore) {
            break;
          }
        } catch (error) {
          console.error(
            `❌ [Streaming] Background page ${pageNum} error:`,
            error
          );
          break;
        }
      }

      backgroundLoadingRef.current = false;
      setState((prev) => ({
        ...prev,
        isBackgroundLoading: false,
        totalPages: Math.ceil(allLoadedFunds.length / pageSize),
        totalFunds: allLoadedFunds.length,
      }));

      console.log(
        `✅ [Streaming] All background loading complete! ${allLoadedFunds.length} funds cached.`
      );
    },
    [pageSize, transformFund]
  );

  // ================================================================
  // GO TO PAGE
  // ================================================================
  const goToPage = useCallback(
    (page: number) => {
      console.log(`📄 [Streaming] Going to page ${page}`);

      // Filter all cached funds
      const filtered = filterFunds(
        globalAllFunds,
        category,
        subCategory,
        searchQuery
      );
      const totalPages = Math.ceil(filtered.length / pageSize);

      // Clamp page number
      const targetPage = Math.max(1, Math.min(page, totalPages));

      // Get page data from filtered results
      const startIndex = (targetPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageFunds = filtered.slice(startIndex, endIndex);

      setState((prev) => ({
        ...prev,
        currentPage: targetPage,
        currentPageFunds: pageFunds,
        totalPages,
        totalFunds: filtered.length,
      }));

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [category, subCategory, searchQuery, pageSize, filterFunds]
  );

  // ================================================================
  // REFRESH DATA
  // ================================================================
  const refresh = useCallback(() => {
    // Clear cache
    globalCacheKey = '';
    globalAllFunds = [];
    globalTotalCount = 0;
    Object.keys(globalFundsCache).forEach(
      (key) => delete globalFundsCache[key]
    );

    // Reload
    loadFirstPage();
  }, [loadFirstPage]);

  // ================================================================
  // EFFECT: Load on mount and filter changes
  // ================================================================
  useEffect(() => {
    // If cache key changed (category/subCategory changed), reset
    if (globalCacheKey !== cacheKey) {
      globalCacheKey = '';
      globalAllFunds = [];
    }

    loadFirstPage();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cacheKey]); // Only reload when filters change

  // ================================================================
  // EFFECT: Re-filter when search changes
  // ================================================================
  useEffect(() => {
    if (globalAllFunds.length > 0 && !state.isInitialLoading) {
      const filtered = filterFunds(
        globalAllFunds,
        category,
        subCategory,
        searchQuery
      );
      const totalPages = Math.ceil(filtered.length / pageSize);

      setState((prev) => ({
        ...prev,
        currentPage: 1,
        currentPageFunds: filtered.slice(0, pageSize),
        totalPages,
        totalFunds: filtered.length,
      }));
    }
  }, [
    searchQuery,
    filterFunds,
    category,
    subCategory,
    pageSize,
    state.isInitialLoading,
  ]);

  // ================================================================
  // RETURN
  // ================================================================
  return {
    // Data
    funds: state.currentPageFunds,
    allFundsCount: globalAllFunds.length,

    // Loading states
    isLoading: state.isInitialLoading,
    isBackgroundLoading: state.isBackgroundLoading,

    // Pagination
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalFunds: state.totalFunds,
    loadedPages: state.loadedPages,
    pageSize,

    // Cache info
    cachedPages: state.cachedPages,
    isCached: (page: number) => state.cachedPages.includes(page),

    // Actions
    goToPage,
    nextPage: () => goToPage(state.currentPage + 1),
    prevPage: () => goToPage(state.currentPage - 1),
    refresh,

    // Error
    error: state.error,
  };
}
