'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const API_URL = (process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`).replace(
  /\/+$/,
  ''
);

export interface FundSearchResult {
  fundId: string;
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  fundManager: string;
  fundManagerId?: string;
  aum: number;
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  currentNav: number;
  expenseRatio: number;
}

export interface FundManagerDetails {
  id: string;
  managerId: string;
  name: string;
  bio: string;
  experience: number;
  qualification: string[];
  currentFundHouse: string;
  designation: string;
  joinedDate: string;
  fundsManaged: number;
  fundsList: Array<{
    fundId: string;
    fundName: string;
    startDate?: string;
    endDate?: string;
    aum: number;
    returns: {
      oneYear: number;
      threeYear: number;
      fiveYear: number;
    };
  }>;
  totalAumManaged: number;
  averageReturns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  awards: Array<{
    title: string;
    year: number;
    organization: string;
  }>;
  email?: string;
  linkedin?: string;
  twitter?: string;
  isActive: boolean;
  lastUpdated: string;
}

interface UseFundSearchResult {
  results: FundSearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  clear: () => void;
}

/**
 * Custom hook for searching funds with debouncing
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms)
 * @param limit - Maximum number of results to return (default: 10)
 */
export function useFundSearch(
  debounceMs: number = 300,
  limit: number = 10
): UseFundSearchResult {
  const [results, setResults] = useState<FundSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          query: query.trim(),
          limit: limit.toString(),
        });

        const apiUrl = `${BASE_URL}/api/funds/search?${params.toString()}`;
        console.log('🔍 Searching funds:', apiUrl);

        const response = await fetch(apiUrl, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Search results:', data.data?.length || 0, 'funds');

        setResults(data.data || []);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('🚫 Search request cancelled');
          return;
        }
        console.error('❌ Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, debounceMs, performSearch]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clear = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setError(null);
    setLoading(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}

/**
 * Hook to get fund manager details by fund ID
 */
export function useFundManagerByFund(fundId: string | null) {
  const [manager, setManager] = useState<FundManagerDetails | null>(null);
  const [fund, setFund] = useState<{
    fundId: string;
    name: string;
    category: string;
    fundHouse: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fundId) {
      setManager(null);
      setFund(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchFundManager = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${API_URL}/funds/${fundId}/manager`;
        console.log('🔍 Fetching fund manager for fund:', fundId);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch fund manager');
        }

        const data = await response.json();
        console.log('✅ Fund manager found:', data.data?.manager?.name);

        setManager(data.data?.manager || null);
        setFund(data.data?.fund || null);
      } catch (err) {
        console.error('❌ Error fetching fund manager:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch manager'
        );
        setManager(null);
        setFund(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFundManager();
  }, [fundId]);

  return {
    manager,
    fund,
    loading,
    error,
  };
}
