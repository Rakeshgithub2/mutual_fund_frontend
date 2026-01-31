/**
 * Fund Data Provider
 * Wraps app with fund data context
 * Initializes data loading once on app mount
 * Shows subtle loading indicator during background fetch
 */

'use client';

import { useEffect, createContext, useContext, ReactNode } from 'react';
import { useFundDataLoader } from '@/hooks/use-fund-loader';
import { useFundStore, LoadingPhase } from '@/stores/fund-store';

interface FundDataContextType {
  isLoading: boolean;
  isLoadingMore: boolean;
  isComplete: boolean;
  loadedCount: number;
  totalFunds: number;
  loadingPhase: LoadingPhase;
}

const FundDataContext = createContext<FundDataContextType>({
  isLoading: true,
  isLoadingMore: false,
  isComplete: false,
  loadedCount: 0,
  totalFunds: 0,
  loadingPhase: 'idle',
});

export function useFundDataContext() {
  return useContext(FundDataContext);
}

export function FundDataProvider({ children }: { children: ReactNode }) {
  const {
    initializeFunds,
    isLoading,
    isLoadingMore,
    isComplete,
    loadedCount,
    totalFunds,
    loadingPhase,
  } = useFundDataLoader();

  // Initialize on mount (only once)
  useEffect(() => {
    initializeFunds();
  }, [initializeFunds]);

  return (
    <FundDataContext.Provider
      value={{
        isLoading,
        isLoadingMore,
        isComplete,
        loadedCount,
        totalFunds,
        loadingPhase,
      }}
    >
      {children}

      {/* Subtle background loading indicator - hidden from UI */}
      {/* Loading happens in background without visible indicator */}
    </FundDataContext.Provider>
  );
}

/**
 * Loading skeleton for fund pages
 */
export function FundPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="grid gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-700 rounded"
          ></div>
        ))}
      </div>
    </div>
  );
}
