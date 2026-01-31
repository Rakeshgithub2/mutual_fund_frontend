/**
 * Global Fund Store
 * Zustand store with IndexedDB persistence
 * Provides centralized fund data for all pages
 * Enables instant Compare/Overlap functionality
 */

import { create } from 'zustand';
import {
  CachedFund,
  storeFunds,
  getAllFunds,
  getFundCount,
  setMetadata,
  getMetadata,
  isCacheValid,
  isIndexedDBAvailable,
  clearFunds,
} from '@/lib/indexeddb';
import { normalizeCategory } from '@/lib/category-mapping';

// Loading state
export type LoadingPhase =
  | 'idle'
  | 'initial'
  | 'background'
  | 'complete'
  | 'error';

interface FundStoreState {
  // Fund data
  funds: CachedFund[];
  totalFunds: number;

  // Loading state
  loadingPhase: LoadingPhase;
  loadedCount: number;
  error: string | null;

  // Cache state
  isCached: boolean;
  lastUpdated: number | null;

  // Compare/Overlap selections (persisted)
  compareList: string[]; // schemeCode array
  overlapList: string[]; // schemeCode array

  // Actions
  setFunds: (funds: CachedFund[]) => void;
  addFunds: (funds: CachedFund[]) => void;
  setLoadingPhase: (phase: LoadingPhase) => void;
  setError: (error: string | null) => void;

  // Compare/Overlap actions
  addToCompare: (schemeCode: string) => void;
  removeFromCompare: (schemeCode: string) => void;
  clearCompare: () => void;
  addToOverlap: (schemeCode: string) => void;
  removeFromOverlap: (schemeCode: string) => void;
  clearOverlap: () => void;

  // Data loading
  loadFromCache: () => Promise<boolean>;
  initializeStore: () => Promise<void>;

  // Getters
  getFundBySchemeCode: (schemeCode: string) => CachedFund | undefined;
  getFundsByCategory: (category: string) => CachedFund[];
  getCompareFunds: () => CachedFund[];
  getOverlapFunds: () => CachedFund[];
  searchFunds: (query: string) => CachedFund[];
}

export const useFundStore = create<FundStoreState>((set, get) => ({
  // Initial state
  funds: [],
  totalFunds: 0,
  loadingPhase: 'idle',
  loadedCount: 0,
  error: null,
  isCached: false,
  lastUpdated: null,
  compareList: [],
  overlapList: [],

  // Set funds (replace all)
  setFunds: (funds) => {
    set({
      funds,
      totalFunds: funds.length,
      loadedCount: funds.length,
    });
  },

  // Add funds (append to existing)
  addFunds: (newFunds) => {
    set((state) => {
      const existingIds = new Set(state.funds.map((f) => f.id));
      const uniqueNewFunds = newFunds.filter((f) => !existingIds.has(f.id));
      const allFunds = [...state.funds, ...uniqueNewFunds];
      return {
        funds: allFunds,
        totalFunds: allFunds.length,
        loadedCount: allFunds.length,
      };
    });
  },

  setLoadingPhase: (phase) => set({ loadingPhase: phase }),
  setError: (error) =>
    set({ error, loadingPhase: error ? 'error' : get().loadingPhase }),

  // Compare actions
  addToCompare: (schemeCode) => {
    set((state) => {
      if (state.compareList.includes(schemeCode)) return state;
      if (state.compareList.length >= 6) return state; // Max 6 funds
      const newList = [...state.compareList, schemeCode];
      // Persist to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('compareList', JSON.stringify(newList));
      }
      return { compareList: newList };
    });
  },

  removeFromCompare: (schemeCode) => {
    set((state) => {
      const newList = state.compareList.filter((id) => id !== schemeCode);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('compareList', JSON.stringify(newList));
      }
      return { compareList: newList };
    });
  },

  clearCompare: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('compareList');
    }
    set({ compareList: [] });
  },

  // Overlap actions
  addToOverlap: (schemeCode) => {
    set((state) => {
      if (state.overlapList.includes(schemeCode)) return state;
      if (state.overlapList.length >= 6) return state;
      const newList = [...state.overlapList, schemeCode];
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('overlapList', JSON.stringify(newList));
      }
      return { overlapList: newList };
    });
  },

  removeFromOverlap: (schemeCode) => {
    set((state) => {
      const newList = state.overlapList.filter((id) => id !== schemeCode);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('overlapList', JSON.stringify(newList));
      }
      return { overlapList: newList };
    });
  },

  clearOverlap: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('overlapList');
    }
    set({ overlapList: [] });
  },

  // Load from IndexedDB cache
  loadFromCache: async () => {
    if (!isIndexedDBAvailable()) {
      console.log('⚠️ [FundStore] IndexedDB not available');
      return false;
    }

    try {
      const isValid = await isCacheValid();
      if (!isValid) {
        console.log('⚠️ [FundStore] Cache expired or empty');
        return false;
      }

      const cachedFunds = await getAllFunds();
      if (cachedFunds.length === 0) {
        return false;
      }

      const lastUpdate = await getMetadata('lastUpdate');

      set({
        funds: cachedFunds,
        totalFunds: cachedFunds.length,
        loadedCount: cachedFunds.length,
        isCached: true,
        lastUpdated: lastUpdate,
        loadingPhase: 'complete',
      });

      console.log(
        `✅ [FundStore] Loaded ${cachedFunds.length} funds from cache`
      );
      return true;
    } catch (error) {
      console.error('❌ [FundStore] Failed to load from cache:', error);
      return false;
    }
  },

  // Initialize store (called once on app load)
  initializeStore: async () => {
    // Restore compare/overlap from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const savedCompare = sessionStorage.getItem('compareList');
        const savedOverlap = sessionStorage.getItem('overlapList');
        if (savedCompare) set({ compareList: JSON.parse(savedCompare) });
        if (savedOverlap) set({ overlapList: JSON.parse(savedOverlap) });
      } catch {
        // Ignore parse errors
      }
    }
  },

  // Getters
  getFundBySchemeCode: (schemeCode) => {
    return get().funds.find(
      (f) => f.schemeCode === schemeCode || f.id === schemeCode
    );
  },

  getFundsByCategory: (category) => {
    const normalizedTarget = category.toLowerCase().replace(/\s+/g, '-');
    return get().funds.filter((f) => {
      const fundCategory = (f.normalizedCategory || '').toLowerCase();
      return (
        fundCategory === normalizedTarget ||
        fundCategory.includes(normalizedTarget) ||
        normalizedTarget.includes(fundCategory)
      );
    });
  },

  getCompareFunds: () => {
    const { funds, compareList } = get();
    return compareList
      .map((id) => funds.find((f) => f.schemeCode === id || f.id === id))
      .filter((f): f is CachedFund => f !== undefined);
  },

  getOverlapFunds: () => {
    const { funds, overlapList } = get();
    return overlapList
      .map((id) => funds.find((f) => f.schemeCode === id || f.id === id))
      .filter((f): f is CachedFund => f !== undefined);
  },

  searchFunds: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return get().funds;

    return get().funds.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.fundHouse?.toLowerCase().includes(q) ||
        f.schemeCode?.includes(q)
    );
  },
}));

// Helper to cache funds to IndexedDB
export async function cacheFundsToIndexedDB(
  funds: CachedFund[]
): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    // Normalize categories before storing
    const normalizedFunds = funds.map((fund) => ({
      ...fund,
      normalizedCategory: normalizeCategory(fund),
    }));

    await storeFunds(normalizedFunds);
    await setMetadata('lastUpdate', Date.now());
    await setMetadata('totalCount', normalizedFunds.length);

    console.log(
      `✅ [FundStore] Cached ${normalizedFunds.length} funds to IndexedDB`
    );
  } catch (error) {
    console.error('❌ [FundStore] Failed to cache funds:', error);
  }
}

// Export singleton instance for direct access
export const fundStore = useFundStore;
