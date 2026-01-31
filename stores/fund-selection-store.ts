/**
 * 🎯 Global Fund Selection Store
 *
 * Production-grade state management for Compare & Overlap functionality
 * Persists selections in sessionStorage across navigation and refresh
 *
 * Used by: Fund cards, Compare page, Overlap page
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Constants
export const MIN_FUNDS = 2;
export const MAX_FUNDS = 5;

// Fund interface matching universe API response
export interface SelectedFund {
  id: string; // schemeCode (primary identifier)
  schemeCode: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
  riskLevel?: string;
}

interface FundSelectionState {
  // Selected funds for comparison
  compareFunds: SelectedFund[];
  // Selected funds for overlap analysis
  overlapFunds: SelectedFund[];

  // Compare actions
  addToCompare: (fund: SelectedFund) => boolean;
  removeFromCompare: (schemeCode: string) => void;
  clearCompare: () => void;
  isInCompare: (schemeCode: string) => boolean;
  canAddToCompare: () => boolean;
  canCompare: () => boolean;

  // Overlap actions
  addToOverlap: (fund: SelectedFund) => boolean;
  removeFromOverlap: (schemeCode: string) => void;
  clearOverlap: () => void;
  isInOverlap: (schemeCode: string) => boolean;
  canAddToOverlap: () => boolean;
  canAnalyzeOverlap: () => boolean;

  // Toggle actions (for buttons)
  toggleCompare: (fund: SelectedFund) => {
    added: boolean;
    shouldRedirect: boolean;
  };
  toggleOverlap: (fund: SelectedFund) => {
    added: boolean;
    shouldRedirect: boolean;
  };
}

export const useFundSelectionStore = create<FundSelectionState>()(
  persist(
    (set, get) => ({
      compareFunds: [],
      overlapFunds: [],

      // ========== COMPARE ACTIONS ==========

      addToCompare: (fund: SelectedFund) => {
        const state = get();
        if (state.compareFunds.length >= MAX_FUNDS) {
          console.warn(`⚠️ Cannot add more than ${MAX_FUNDS} funds to compare`);
          return false;
        }
        if (state.compareFunds.some((f) => f.schemeCode === fund.schemeCode)) {
          console.warn('⚠️ Fund already in compare list');
          return false;
        }

        set({ compareFunds: [...state.compareFunds, fund] });
        console.log(
          `✅ Added to compare: ${fund.name} (${state.compareFunds.length + 1}/${MAX_FUNDS})`
        );
        return true;
      },

      removeFromCompare: (schemeCode: string) => {
        set((state) => ({
          compareFunds: state.compareFunds.filter(
            (f) => f.schemeCode !== schemeCode
          ),
        }));
        console.log(`🗑️ Removed from compare: ${schemeCode}`);
      },

      clearCompare: () => {
        set({ compareFunds: [] });
        console.log('🧹 Cleared all compare funds');
      },

      isInCompare: (schemeCode: string) => {
        return get().compareFunds.some((f) => f.schemeCode === schemeCode);
      },

      canAddToCompare: () => {
        return get().compareFunds.length < MAX_FUNDS;
      },

      canCompare: () => {
        const count = get().compareFunds.length;
        return count >= MIN_FUNDS && count <= MAX_FUNDS;
      },

      // ========== OVERLAP ACTIONS ==========

      addToOverlap: (fund: SelectedFund) => {
        const state = get();
        if (state.overlapFunds.length >= MAX_FUNDS) {
          console.warn(`⚠️ Cannot add more than ${MAX_FUNDS} funds to overlap`);
          return false;
        }
        if (state.overlapFunds.some((f) => f.schemeCode === fund.schemeCode)) {
          console.warn('⚠️ Fund already in overlap list');
          return false;
        }

        set({ overlapFunds: [...state.overlapFunds, fund] });
        console.log(
          `✅ Added to overlap: ${fund.name} (${state.overlapFunds.length + 1}/${MAX_FUNDS})`
        );
        return true;
      },

      removeFromOverlap: (schemeCode: string) => {
        set((state) => ({
          overlapFunds: state.overlapFunds.filter(
            (f) => f.schemeCode !== schemeCode
          ),
        }));
        console.log(`🗑️ Removed from overlap: ${schemeCode}`);
      },

      clearOverlap: () => {
        set({ overlapFunds: [] });
        console.log('🧹 Cleared all overlap funds');
      },

      isInOverlap: (schemeCode: string) => {
        return get().overlapFunds.some((f) => f.schemeCode === schemeCode);
      },

      canAddToOverlap: () => {
        return get().overlapFunds.length < MAX_FUNDS;
      },

      canAnalyzeOverlap: () => {
        const count = get().overlapFunds.length;
        return count >= MIN_FUNDS && count <= MAX_FUNDS;
      },

      // ========== TOGGLE ACTIONS (for fund card buttons) ==========

      toggleCompare: (fund: SelectedFund) => {
        const state = get();
        const isSelected = state.isInCompare(fund.schemeCode);

        if (isSelected) {
          state.removeFromCompare(fund.schemeCode);
          return { added: false, shouldRedirect: false };
        } else {
          const added = state.addToCompare(fund);
          // Redirect to compare page when adding
          return { added, shouldRedirect: added };
        }
      },

      toggleOverlap: (fund: SelectedFund) => {
        const state = get();
        const isSelected = state.isInOverlap(fund.schemeCode);

        if (isSelected) {
          state.removeFromOverlap(fund.schemeCode);
          return { added: false, shouldRedirect: false };
        } else {
          const added = state.addToOverlap(fund);
          // Redirect to overlap page when adding
          return { added, shouldRedirect: added };
        }
      },
    }),
    {
      name: 'fund-selection-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        compareFunds: state.compareFunds,
        overlapFunds: state.overlapFunds,
      }),
    }
  )
);

// Helper hooks for common operations
export const useCompareFunds = () => {
  const store = useFundSelectionStore();
  return {
    funds: store.compareFunds,
    add: store.addToCompare,
    remove: store.removeFromCompare,
    clear: store.clearCompare,
    isSelected: store.isInCompare,
    canAdd: store.canAddToCompare,
    canCompare: store.canCompare,
    toggle: store.toggleCompare,
    count: store.compareFunds.length,
  };
};

export const useOverlapFunds = () => {
  const store = useFundSelectionStore();
  return {
    funds: store.overlapFunds,
    add: store.addToOverlap,
    remove: store.removeFromOverlap,
    clear: store.clearOverlap,
    isSelected: store.isInOverlap,
    canAdd: store.canAddToOverlap,
    canAnalyze: store.canAnalyzeOverlap,
    toggle: store.toggleOverlap,
    count: store.overlapFunds.length,
  };
};
