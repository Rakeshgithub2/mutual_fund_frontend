/**
 * Enhanced API Service Layer for 4,459 Funds Backend
 * Comprehensive service with axios, interceptors, and typed responses
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './constants';

// ===============================================
// TYPE DEFINITIONS
// ===============================================

export interface Fund {
  _id: string;
  schemeCode: string;
  schemeName: string;
  amc: {
    name: string;
    logo?: string;
  };
  category: string;
  subCategory: string;
  nav: {
    value: number;
    date: string;
    change: number;
    changePercent: number;
  };
  aum: number;
  expenseRatio: number;
  returns?: {
    oneMonth?: number;
    threeMonth?: number;
    sixMonth?: number;
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  riskLevel: string;
  minInvestment: number;
  isPubliclyVisible: boolean;
  launchDate: string;
  exitLoad: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  lastUpdated: string;
}

export interface NAVHistory {
  date: string;
  nav: number;
  change?: number;
  changePercent?: number;
}

export interface FundsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  search?: string;
  sort?: string;
  minAUM?: number;
  maxExpenseRatio?: number;
  riskLevel?: string;
}

// ===============================================
// AXIOS INSTANCE CONFIGURATION
// ===============================================

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if exists
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          {
            params: config.params,
          }
        );
      }

      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Response] ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Handle errors
      if (error.response?.status === 401) {
        // Unauthorized - clear auth and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/auth/signin';
        }
      }

      if (error.response?.status === 404) {
        console.error('[API] Resource not found');
      }

      if (error.response?.status >= 500) {
        console.error('[API] Server error');
      }

      console.error('[API Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create singleton instance
const apiClient = createApiClient();

// ===============================================
// FUND SERVICE
// ===============================================

export const fundService = {
  /**
   * Get all funds with filters and pagination
   */
  async getAll(params?: FundsQueryParams): Promise<ApiResponse<Fund[]>> {
    const response = await apiClient.get<ApiResponse<Fund[]>>(
      API_ENDPOINTS.FUNDS,
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
          ...params,
        },
      }
    );
    return response.data;
  },

  /**
   * Get fund by ID
   */
  async getById(id: string): Promise<ApiResponse<Fund>> {
    const response = await apiClient.get<ApiResponse<Fund>>(
      API_ENDPOINTS.FUND_DETAIL(id)
    );
    return response.data;
  },

  /**
   * Get NAV history for a fund
   */
  async getNavHistory(
    id: string,
    period: string = '1Y'
  ): Promise<ApiResponse<NAVHistory[]>> {
    const response = await apiClient.get<ApiResponse<NAVHistory[]>>(
      API_ENDPOINTS.FUND_NAV_HISTORY(id),
      {
        params: { period },
      }
    );
    return response.data;
  },

  /**
   * Search funds by query
   */
  async search(
    query: string,
    limit: number = 50
  ): Promise<ApiResponse<Fund[]>> {
    const response = await apiClient.get<ApiResponse<Fund[]>>(
      API_ENDPOINTS.FUNDS,
      {
        params: {
          search: query,
          limit,
        },
      }
    );
    return response.data;
  },

  /**
   * Get funds by category
   */
  async getByCategory(
    category: string,
    params?: FundsQueryParams
  ): Promise<ApiResponse<Fund[]>> {
    return this.getAll({
      ...params,
      category,
    });
  },

  /**
   * Get funds by AMC
   */
  async getByAMC(
    amcName: string,
    params?: FundsQueryParams
  ): Promise<ApiResponse<Fund[]>> {
    const response = await apiClient.get<ApiResponse<Fund[]>>(
      API_ENDPOINTS.FUNDS,
      {
        params: {
          amc: amcName,
          ...params,
        },
      }
    );
    return response.data;
  },
};

// ===============================================
// MARKET SERVICE
// ===============================================

export const marketService = {
  /**
   * Get all market indices
   */
  async getIndices(): Promise<ApiResponse<MarketIndex[]>> {
    const response = await apiClient.get<ApiResponse<MarketIndex[]>>(
      API_ENDPOINTS.MARKET_INDICES
    );
    return response.data;
  },

  /**
   * Get specific market index
   */
  async getIndex(symbol: string): Promise<ApiResponse<MarketIndex>> {
    const response = await apiClient.get<ApiResponse<MarketIndex>>(
      `${API_ENDPOINTS.MARKET_INDICES}/${symbol}`
    );
    return response.data;
  },
};

// ===============================================
// CUSTOM HOOKS FOR REACT QUERY (OPTIONAL)
// ===============================================

/**
 * Custom hook for fetching funds with state management
 * Can be used without React Query
 */
export const useFundsQuery = (params?: FundsQueryParams) => {
  // This can be enhanced with React Query or SWR
  // For now, returns the service method
  return fundService.getAll(params);
};

// ===============================================
// ERROR HANDLING UTILITIES
// ===============================================

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.response?.status === 404) {
      return 'Resource not found';
    }

    if (axiosError.response?.status === 500) {
      return 'Server error. Please try again later.';
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    if (!axiosError.response) {
      return 'Network error. Please check your connection.';
    }
  }

  return 'An unexpected error occurred';
};

// ===============================================
// EXPORTS
// ===============================================

export default apiClient;
export { apiClient };
