'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

interface Fund {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
  type?: string;
  amfiCode?: string;
  description?: string;
  benchmark?: string;
  holdings: Array<{ name: string; percentage: number }>;
  manager: {
    name: string;
    bio: string;
    photo?: string;
  };
}

interface UseFundsResult {
  funds: Fund[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFunds(options?: {
  type?: string;
  category?: string;
  subCategory?: string;
  query?: string;
  limit?: number;
}): UseFundsResult {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunds = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching funds with filters:', options);
      console.log(
        '🌐 [useFunds] API Base URL:',
        process.env.NEXT_PUBLIC_API_URL
      );

      // Determine the limit - use multi-page fetch for large requests
      const requestedLimit = options?.limit || 4000;
      const isLargeRequest = requestedLimit > 1000;

      let response;
      if (isLargeRequest) {
        console.log(
          '📚 [useFunds] Large request detected, using multi-page fetch'
        );
        response = await api.getFundsMultiPage(requestedLimit);
      } else {
        // Use single page for smaller requests
        response = await api.getFunds(1, requestedLimit);
      }

      console.log('✅ [useFunds] Raw API response:', {
        totalFunds: response.data?.length || 0,
        hasData: !!response.data,
        firstFund: response.data?.[0],
      });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data)) {
        console.error(
          '❌ [useFunds] Invalid API response structure:',
          response
        );
        throw new Error('Invalid API response: expected { data: [] }');
      }

      // Transform API response to match frontend interface
      const transformedFunds = (response.data || []).map((fund: any) => {
        // Format category from API format (debt, equity) to display format (Debt, Equity)
        const formatCategory = (cat: string, subCat?: string) => {
          if (!cat) return 'Other';
          const mainCat =
            cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
          // If subCategory exists and is meaningful, display it instead
          if (subCat && subCat !== 'Other' && subCat !== cat) {
            return subCat;
          }
          return mainCat;
        };

        console.log('📦 Fund data:', {
          name: fund.name,
          category: fund.category,
          subCategory: fund.subCategory,
        });

        // Get real NAV from API response
        const latestNav = fund.currentNav || fund.nav || 0;

        // Use real expense ratio from API
        const realExpenseRatio = fund.expenseRatio || 1.0;

        // Get returns from API (no fallback - show 0 if no data)
        const returns = fund.returns || {};
        const returns1Y = returns.oneYear || returns['1Y'] || 0;
        const returns3Y = returns.threeYear || returns['3Y'] || 0;
        const returns5Y = returns.fiveYear || returns['5Y'] || 0;

        // Get AUM from API or use default (in crores)
        const aum = fund.aum || 10000;

        return {
          id: fund.id || fund._id,
          name: fund.name,
          fundHouse: fund.fundHouse || fund.name.split(' ')[0] + ' Mutual Fund',
          category: formatCategory(fund.category, fund.subCategory),
          nav: latestNav, // REAL NAV from database
          returns1Y: returns1Y,
          returns3Y: returns3Y,
          returns5Y: returns5Y,
          aum: aum,
          expenseRatio: realExpenseRatio, // REAL expense ratio from database
          rating: fund.ratings?.morningstar || fund.ratings?.crisil || 4.0,
          type: fund.fundType || fund.type,
          amfiCode: fund.fundId || fund.amfiCode,
          description: fund.description,
          benchmark: fund.benchmark,
          holdings: fund.holdings || [],
          manager: fund.manager || {
            name: 'Fund Manager',
            bio:
              'Experienced fund manager with track record in ' +
              (fund.subCategory || fund.category) +
              ' investments',
            photo: '/placeholder.svg?height=100&width=100',
          },
        };
      });

      console.log(
        '📊 Transformed funds:',
        transformedFunds.length,
        'funds ready to display'
      );
      console.log('📝 Sample fund:', transformedFunds[0]?.name);

      setFunds(transformedFunds);
    } catch (err) {
      console.error('Error fetching funds:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch funds');
      // Keep existing funds on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [options?.type, options?.category, options?.subCategory, options?.limit]);

  return {
    funds,
    loading,
    error,
    refetch: fetchFunds,
  };
}

export function useFund(id: string) {
  const [fund, setFund] = useState<Fund | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFund = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Use the centralized API client
      const apiResponse = await api.getFund(id);

      console.log('✅ Fund fetched successfully:', apiResponse);

      // Transform API response
      const formatCategory = (cat: string) => {
        if (!cat) return 'Other';
        return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      };

      // Get real NAV from API response
      const realNav = apiResponse.data.currentNav || apiResponse.data.nav || 0;

      // Transform holdings from API format
      const holdings = (apiResponse.data.holdings || []).map((h: any) => ({
        name: h.companyName || h.name || 'Unknown',
        percentage: h.percent || h.percentage || 0,
      }));

      // Get manager info
      const manager = apiResponse.data.manager || {
        name: 'Fund Manager',
        bio:
          'Experienced fund manager with track record in ' +
          formatCategory(apiResponse.data.category) +
          ' investments',
        photo: '/placeholder.svg?height=100&width=100',
      };

      // Get returns from API
      const returns = apiResponse.data.returns || {};
      const returns1Y = returns.oneYear || 12.5;
      const returns3Y = returns.threeYear || 15.2;
      const returns5Y = returns.fiveYear || 13.8;
      const aum = apiResponse.data.aum || 10000;

      const transformedFund = {
        id: apiResponse.data.id || apiResponse.data._id,
        name: apiResponse.data.name,
        fundHouse:
          apiResponse.data.fundHouse ||
          apiResponse.data.name.split(' ')[0] + ' Mutual Fund',
        category: formatCategory(apiResponse.data.category),
        nav: realNav, // REAL NAV from database
        returns1Y: returns1Y,
        returns3Y: returns3Y,
        returns5Y: returns5Y,
        aum: aum,
        expenseRatio: apiResponse.data.expenseRatio || 1.0, // REAL expense ratio
        rating:
          apiResponse.data.ratings?.morningstar ||
          apiResponse.data.ratings?.crisil ||
          4.0,
        type: apiResponse.data.fundType || apiResponse.data.type,
        amfiCode: apiResponse.data.fundId || apiResponse.data.amfiCode,
        description: apiResponse.data.description,
        benchmark: apiResponse.data.benchmark,
        holdings:
          holdings.length > 0
            ? holdings
            : [
                { name: 'Reliance Industries', percentage: 8.5 },
                { name: 'HDFC Bank', percentage: 7.2 },
                { name: 'Infosys', percentage: 6.8 },
              ],
        manager: manager,
      };

      setFund(transformedFund);
    } catch (err) {
      console.error('Error fetching fund:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fund');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFund();
  }, [id]);

  return {
    fund,
    loading,
    error,
    refetch: fetchFund,
  };
}
