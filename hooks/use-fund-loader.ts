/**
 * Fund Data Loader Hook
 * Handles two-phase loading with IndexedDB caching
 * 1. Check cache first → instant load
 * 2. If no cache → load 500 instantly, then background load all
 * 3. Cache everything to IndexedDB
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import {
  useFundStore,
  cacheFundsToIndexedDB,
  LoadingPhase,
} from '@/stores/fund-store';
import { fetchFundsBatch, getTotalFundCount } from '@/app/actions/funds';
import {
  getAllFunds,
  getFundCount,
  isCacheValid,
  isIndexedDBAvailable,
  setMetadata,
} from '@/lib/indexeddb';

const BATCH_SIZE = 500;

export function useFundDataLoader() {
  const {
    funds,
    totalFunds,
    loadingPhase,
    loadedCount,
    error,
    setFunds,
    addFunds,
    setLoadingPhase,
    setError,
    initializeStore,
  } = useFundStore();

  const isLoadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Background batch loader
  const loadAllFundsInBackground = useCallback(
    async (totalCount: number, initialFunds: any[]) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      // Create abort controller for cleanup
      abortControllerRef.current = new AbortController();

      setLoadingPhase('background');
      console.log(
        `🔄 [Loader] Starting background load for ${totalCount} total funds...`
      );

      let allFunds = [...initialFunds];
      let offset = BATCH_SIZE; // Start after initial batch

      try {
        while (offset < totalCount) {
          // Check if aborted
          if (abortControllerRef.current?.signal.aborted) {
            console.log('⚠️ [Loader] Background loading aborted');
            break;
          }

          const batchResult = await fetchFundsBatch(offset, BATCH_SIZE);

          if (batchResult.success && batchResult.data.length > 0) {
            allFunds = [...allFunds, ...batchResult.data];

            // Update store WITHOUT re-rendering list (just update count)
            useFundStore.setState({
              loadedCount: allFunds.length,
            });

            console.log(
              `📦 [Loader] Loaded ${allFunds.length}/${totalCount} funds`
            );
          }

          offset += BATCH_SIZE;

          // Small delay to prevent overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Final update with all funds
        setFunds(allFunds);
        setLoadingPhase('complete');

        // Cache to IndexedDB
        await cacheFundsToIndexedDB(allFunds);

        console.log(
          `✅ [Loader] Complete! ${allFunds.length} funds loaded and cached`
        );
      } catch (error) {
        console.error('❌ [Loader] Background loading error:', error);
        setError('Failed to load all funds');
      } finally {
        isLoadingRef.current = false;
      }
    },
    [setFunds, setLoadingPhase, setError]
  );

  // Main initialization function
  const initializeFunds = useCallback(async () => {
    // Already loading or loaded
    if (
      loadingPhase === 'complete' ||
      loadingPhase === 'background' ||
      isLoadingRef.current
    ) {
      return;
    }

    console.log('🚀 [Loader] Initializing fund data...');

    // Initialize store (restore compare/overlap lists)
    await initializeStore();

    // Step 1: Try to load from IndexedDB cache
    if (isIndexedDBAvailable()) {
      try {
        const cacheValid = await isCacheValid();
        if (cacheValid) {
          const cachedFunds = await getAllFunds();
          if (cachedFunds.length > 0) {
            setFunds(cachedFunds);
            setLoadingPhase('complete');
            console.log(
              `✅ [Loader] Loaded ${cachedFunds.length} funds from cache (instant!)`
            );
            return;
          }
        }
      } catch (error) {
        console.warn('⚠️ [Loader] Cache check failed:', error);
      }
    }

    // Step 2: No cache - do fresh load
    setLoadingPhase('initial');

    try {
      // Get total count first
      const countResult = await getTotalFundCount();
      const totalCount = countResult.count || 15000;

      // Load first 500 funds (instant display)
      console.log('📦 [Loader] Loading initial 500 funds...');
      const initialResult = await fetchFundsBatch(0, BATCH_SIZE);

      if (initialResult.success && initialResult.data.length > 0) {
        setFunds(initialResult.data);
        useFundStore.setState({ totalFunds: totalCount });

        console.log(
          `✅ [Loader] Initial ${initialResult.data.length} funds displayed`
        );

        // Step 3: Load remaining in background (if more exist)
        if (totalCount > BATCH_SIZE) {
          // Don't await - let it run in background
          loadAllFundsInBackground(totalCount, initialResult.data);
        } else {
          setLoadingPhase('complete');
          await cacheFundsToIndexedDB(initialResult.data);
        }
      } else {
        setError('No funds found');
      }
    } catch (error) {
      console.error('❌ [Loader] Initial load failed:', error);
      setError('Failed to load funds');
    }
  }, [
    loadingPhase,
    initializeStore,
    setFunds,
    setLoadingPhase,
    setError,
    loadAllFundsInBackground,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    funds,
    totalFunds,
    loadingPhase,
    loadedCount,
    error,
    initializeFunds,
    isLoading: loadingPhase === 'initial',
    isLoadingMore: loadingPhase === 'background',
    isComplete: loadingPhase === 'complete',
  };
}

/**
 * Hook to use cached funds (for Compare/Overlap pages)
 * Does NOT trigger new data loading
 */
export function useCachedFunds() {
  const {
    funds,
    totalFunds,
    loadingPhase,
    getFundBySchemeCode,
    getFundsByCategory,
    searchFunds,
    compareList,
    overlapList,
    getCompareFunds,
    getOverlapFunds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    addToOverlap,
    removeFromOverlap,
    clearOverlap,
  } = useFundStore();

  return {
    funds,
    totalFunds,
    isReady: loadingPhase === 'complete' || funds.length > 0,
    getFundBySchemeCode,
    getFundsByCategory,
    searchFunds,
    // Compare
    compareList,
    compareFunds: getCompareFunds(),
    addToCompare,
    removeFromCompare,
    clearCompare,
    // Overlap
    overlapList,
    overlapFunds: getOverlapFunds(),
    addToOverlap,
    removeFromOverlap,
    clearOverlap,
  };
}
