/**
 * Funds API Module
 *
 * Provides typed API calls for fund operations following the backend contract.
 * Backend guaranteed to have 4,459 active funds as of December 28, 2025.
 */

import {
  normalizeCategory,
  normalizeSubCategory,
} from '../utils/categoryNormalizer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Type definitions (matching backend contract exactly)
export interface FundFilters {
  category?: string; // lowercase: 'equity', 'debt', etc.
  subCategory?: string; // Title Case: 'Large Cap', 'Mid Cap', etc.
  fundHouse?: string;
  minAum?: number;
  maxAum?: number;
  minExpenseRatio?: number;
  maxExpenseRatio?: number;
  sortBy?:
    | 'aum'
    | 'returns.oneYear'
    | 'returns.threeYear'
    | 'returns.fiveYear'
    | 'name'
    | 'currentNav';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Fund {
  fundId: string;
  name: string;
  category: string;
  subCategory: string;
  fundHouse: string;
  fundType: 'mutual_fund' | 'etf';
  currentNav: number;
  previousNav?: number;
  navDate?: string;
  returns: {
    day?: number;
    week?: number;
    month?: number;
    threeMonth?: number;
    sixMonth?: number;
    oneYear: number;
    threeYear?: number;
    fiveYear?: number;
    sinceInception?: number;
  };
  riskMetrics?: {
    sharpeRatio?: number;
    standardDeviation?: number;
    beta?: number;
    alpha?: number;
    rSquared?: number;
    sortino?: number;
  };
  aum?: number;
  expenseRatio?: number;
  exitLoad?: number;
  minInvestment?: number;
  sipMinAmount?: number;
  ratings?: {
    morningstar?: number;
    crisil?: number;
    valueResearch?: number;
  };
  tags?: string[];
  popularity?: number;
  isActive: boolean;
}

export interface FundsResponse {
  success: boolean;
  data: Fund[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SingleFundResponse {
  success: boolean;
  data: Fund;
}

/**
 * Fetch funds with filters
 *
 * @param filters - Filter options for funds
 * @returns Promise with funds response
 *
 * @example
 * const response = await fetchFunds({ category: 'equity', page: 1, limit: 20 });
 * console.log(response.data); // Array of funds
 * console.log(response.pagination.total); // 4459
 */
export const fetchFunds = async (
  filters: FundFilters = {}
): Promise<FundsResponse> => {
  try {
    const params = new URLSearchParams();

    // Normalize and add filters
    if (filters.category) {
      params.append('category', normalizeCategory(filters.category));
    }
    if (filters.subCategory) {
      params.append('subCategory', normalizeSubCategory(filters.subCategory));
    }
    if (filters.fundHouse) {
      params.append('fundHouse', filters.fundHouse);
    }
    if (filters.minAum !== undefined) {
      params.append('minAum', filters.minAum.toString());
    }
    if (filters.maxAum !== undefined) {
      params.append('maxAum', filters.maxAum.toString());
    }
    if (filters.minExpenseRatio !== undefined) {
      params.append('minExpenseRatio', filters.minExpenseRatio.toString());
    }
    if (filters.maxExpenseRatio !== undefined) {
      params.append('maxExpenseRatio', filters.maxExpenseRatio.toString());
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    // Pagination
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const url = `${API_BASE_URL}/api/funds?${params.toString()}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Fetching funds:', url);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API endpoint not found. Check API URL configuration.');
      }
      if (response.status === 500) {
        throw new Error('Backend server error. Check server logs.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: FundsResponse = await response.json();

    // Validate response structure
    if (!data.success) {
      throw new Error('API returned success: false');
    }

    if (!Array.isArray(data.data)) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Expected data to be an array');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ Fetched ${data.data.length} funds (Total: ${data.pagination.total})`
      );
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching funds:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Backend server is not running. Please start the server on port 3002.'
      );
    }

    throw error;
  }
};

/**
 * Fetch a single fund by ID
 *
 * @param fundId - Unique fund identifier
 * @returns Promise with fund details
 */
export const fetchFundById = async (fundId: string): Promise<Fund> => {
  try {
    const url = `${API_BASE_URL}/api/funds/${fundId}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Fetching fund details:', url);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Fund not found');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: SingleFundResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error('Fund not found');
    }

    return data.data;
  } catch (error) {
    console.error('❌ Error fetching fund details:', error);
    throw error;
  }
};

/**
 * Search funds (autocomplete)
 *
 * @param query - Search query string
 * @returns Promise with array of matching funds
 */
export const searchFunds = async (query: string): Promise<Fund[]> => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const url = `${API_BASE_URL}/api/search/suggest?query=${encodeURIComponent(
      query
    )}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Searching funds:', url);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Search failed:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }

    // Fallback: try results field
    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  } catch (error) {
    console.error('❌ Error searching funds:', error);
    return [];
  }
};

/**
 * Check backend health
 *
 * @returns Promise with boolean indicating if backend is healthy
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for better error handling
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const isHealthy = response.ok;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        isHealthy ? '✅ Backend is healthy' : '❌ Backend is not responding'
      );
    }

    return isHealthy;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '❌ Backend health check failed:',
        error instanceof Error ? error.message : 'Network error'
      );
      console.warn(`   API URL: ${API_BASE_URL}/health`);
      console.warn('   Make sure backend is running on port 3002');
    }
    return false;
  }
};

/**
 * Get fund houses (for filter dropdown)
 *
 * @returns Promise with array of unique fund houses
 */
export const getFundHouses = async (): Promise<string[]> => {
  try {
    // Fetch first page to get some fund houses
    const response = await fetchFunds({ limit: 100 });

    const fundHouses = [
      ...new Set(response.data.map((fund) => fund.fundHouse)),
    ];

    return fundHouses.sort();
  } catch (error) {
    console.error('❌ Error fetching fund houses:', error);
    return [];
  }
};

/**
 * Compare multiple funds
 *
 * @param fundIds - Array of fund IDs to compare
 * @returns Promise with comparison data
 */
export const compareFunds = async (fundIds: string[]): Promise<any> => {
  try {
    const url = `${API_BASE_URL}/api/compare`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fundIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error comparing funds:', error);
    throw error;
  }
};

/**
 * Check portfolio overlap
 *
 * @param fundIds - Array of fund IDs to check overlap
 * @returns Promise with overlap data
 */
export const checkOverlap = async (fundIds: string[]): Promise<any> => {
  try {
    const url = `${API_BASE_URL}/api/overlap`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fundIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error checking overlap:', error);
    throw error;
  }
};

/**
 * Fetch ALL funds without pagination (for category pages)
 * Returns complete dataset - 4000-8000+ funds
 *
 * @param category - Fund category (equity, debt, etc.)
 * @param subcategory - Fund subcategory (Large Cap, etc.)
 * @returns Promise with all funds (no pagination)
 */
export const fetchAllFunds = async (
  category?: string,
  subcategory?: string
): Promise<{ success: boolean; data: Fund[]; count: number }> => {
  try {
    const params = new URLSearchParams();

    if (category) {
      params.append('category', normalizeCategory(category));
    }
    if (subcategory) {
      params.append('subcategory', normalizeSubCategory(subcategory));
    }

    const url = `${API_BASE_URL}/api/funds/all?${params.toString()}`;

    console.log(`🔄 Fetching ALL funds (no pagination)...`);

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.count} funds (NO LIMIT)`);

    return data;
  } catch (error) {
    console.error('❌ Error fetching all funds:', error);
    throw error;
  }
};
