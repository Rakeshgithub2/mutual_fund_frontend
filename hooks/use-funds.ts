import { useState, useEffect } from 'react';
import { apiClient, Fund, FundDetails } from '@/lib/api-client';
import { fetchInitialFunds, fetchAllFundsFromDB } from '@/app/actions/funds';

export function useFunds(filters?: {
  query?: string;
  type?: string;
  category?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
  noFilter?: boolean; // New option to fetch ALL funds without any filter
}) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFundsData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 [useFunds] Fetching with filters:', filters);

        // ✅ DIRECT DB FETCH via Server Actions (NO API)
        // Phase 1: Quick initial load (500 funds)
        console.log(
          '📦 [useFunds] Phase 1: Loading initial 500 funds from DB...'
        );
        const initialResponse = await fetchInitialFunds();

        if (initialResponse.success && initialResponse.data) {
          setFunds(initialResponse.data as Fund[]);
          setTotalCount(initialResponse.total);
          console.log(
            `✅ [useFunds] Phase 1 complete: ${initialResponse.data.length} funds from DB`
          );
          setLoading(false);

          // Phase 2: Load ALL funds from DB in background
          setLoadingMore(true);
          console.log(
            `🔄 [useFunds] Phase 2: Loading ALL funds from DB in background...`
          );

          const fullResponse = await fetchAllFundsFromDB();

          if (fullResponse.success && fullResponse.data) {
            setFunds(fullResponse.data as Fund[]);
            setTotalCount(fullResponse.data.length);
            console.log(
              `✅ [useFunds] Phase 2 complete: ALL ${fullResponse.data.length} funds loaded from DB!`
            );
          }
          setLoadingMore(false);
        }
      } catch (err) {
        setError(err as Error);
        console.error('❌ [useFunds] Failed to fetch funds:', err);
        console.error('❌ [useFunds] Error details:', {
          message: (err as Error).message,
          name: (err as Error).name,
        });
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchFundsData();
  }, [JSON.stringify(filters)]);

  return { funds, pagination, loading, loadingMore, totalCount, error };
}

export function useFundDetails(fundId: string | null) {
  const [fund, setFund] = useState<FundDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fundId) {
      setFund(null);
      setLoading(false);
      return;
    }

    const fetchFund = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getFundById(fundId);
        setFund(response.data);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch fund details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFund();
  }, [fundId]);

  return { fund, loading, error };
}

export function useSuggestions(query: string, debounceMs: number = 300) {
  const [suggestions, setSuggestions] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getSuggestions(query);
        setSuggestions(response.data.suggestions);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  return { suggestions, loading, error };
}
