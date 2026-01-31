/**
 * 🚀 PRODUCTION-GRADE API CLIENT
 *
 * Single source of truth for all API calls in the application.
 * Prevents URL construction errors, handles retries, CORS, and logging.
 *
 * Backend Routes (from Vercel deployment):
 * - GET  /api/health
 * - GET  /api/funds
 * - GET  /api/funds/:id
 * - POST /api/compare
 * - POST /api/overlap
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/auth/google
 * - POST /api/auth/google
 * - GET  /api/market/indices    ⚠️ NOT /api/indices
 * - GET  /api/market/summary    ⚠️ NOT /api/market-indices
 */

// ===========================
// CONFIGURATION
// ===========================

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

/**
 * Normalize URL: Remove trailing slashes and /api suffix
 * Examples:
 *   https://backend.com/    → https://backend.com
 *   https://backend.com/api → https://backend.com
 */
const normalizeUrl = (url: string): string => {
  return url.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

const API_BASE = normalizeUrl(RAW_URL);

// ===========================
// TYPES
// ===========================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
  message?: string;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  percentChange: number;
  timestamp?: string;
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// ===========================
// CONFIGURATION CONSTANTS
// ===========================

const CONFIG = {
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  LOG_REQUESTS: process.env.NODE_ENV === 'development',
};

// ===========================
// CORE API CLIENT
// ===========================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Log API requests in development
   */
  private log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
    if (!CONFIG.LOG_REQUESTS) return;

    const emoji = {
      info: '🌐',
      error: '❌',
      warn: '⚠️',
    }[level];

    console[level](`${emoji} [API]`, message, data || '');
  }

  /**
   * Build full URL with proper path concatenation
   */
  private buildUrl(path: string): string {
    // Ensure path starts with /api/
    const normalizedPath = path.startsWith('/api/')
      ? path
      : path.startsWith('/')
      ? `/api${path}`
      : `/api/${path}`;

    const fullUrl = `${this.baseUrl}${normalizedPath}`;

    this.log('info', `Request URL: ${fullUrl}`);
    return fullUrl;
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const timeout = options.timeout || CONFIG.TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest<T>(
    fn: () => Promise<T>,
    retries = CONFIG.RETRY_ATTEMPTS,
    delay = CONFIG.RETRY_DELAY_MS
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 1) throw error;

      this.log(
        'warn',
        `Retrying... (${CONFIG.RETRY_ATTEMPTS - retries + 1}/${
          CONFIG.RETRY_ATTEMPTS
        })`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retryRequest(fn, retries - 1, delay * 2);
    }
  }

  /**
   * Generic request method
   */
  private async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path);
    const method = options.method || 'GET';

    this.log('info', `${method} ${path}`);

    try {
      const response = await this.retryRequest(
        () => this.fetchWithTimeout(url, options),
        options.retries
      );

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        this.log('error', `Non-JSON response: ${response.status}`, text);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return {
          success: true,
          data: text as any,
        };
      }

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        this.log('error', `HTTP ${response.status}`, data);
        throw new Error(data.error || data.message || 'Request failed');
      }

      this.log('info', `✅ Success`, {
        status: response.status,
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
      });

      return data;
    } catch (error: any) {
      this.log('error', `Request failed: ${path}`, error.message);

      // Detect specific error types
      if (error.message.includes('CORS')) {
        console.error(
          '🚨 CORS ERROR: Backend not allowing requests from this origin'
        );
        console.error('   Check ALLOWED_ORIGINS in backend .env');
        console.error(`   Frontend URL: ${window.location.origin}`);
      }

      if (
        error.message.includes('404') ||
        error.message.includes('Cannot GET')
      ) {
        console.error('🚨 404 ERROR: Route not found on backend');
        console.error(`   Attempted URL: ${url}`);
        console.error('   Valid routes: /api/funds, /api/market/indices, etc.');
      }

      throw error;
    }
  }

  // ===========================
  // PUBLIC API METHODS
  // ===========================

  /**
   * GET request
   */
  async get<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  // ===========================
  // SPECIALIZED ENDPOINTS
  // ===========================

  /**
   * Health check
   */
  async health() {
    return this.get('/api/health');
  }

  /**
   * Get market indices
   * ⚠️ CORRECT: /api/market/indices (NOT /api/indices)
   */
  async getMarketIndices(): Promise<ApiResponse<MarketIndex[]>> {
    return this.get<MarketIndex[]>('/api/market/indices');
  }

  /**
   * Get market summary
   */
  async getMarketSummary(): Promise<ApiResponse<any>> {
    return this.get('/api/market/summary');
  }

  /**
   * Get specific market index by ID
   * ⚠️ CORRECT: /api/market/indices/:id (NOT /api/indices/:id)
   */
  async getMarketIndex(id: string): Promise<ApiResponse<MarketIndex>> {
    return this.get<MarketIndex>(`/api/market/indices/${id}`);
  }

  /**
   * Get all funds
   */
  async getFunds(params?: Record<string, any>): Promise<ApiResponse<any[]>> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/api/funds${query}`);
  }

  /**
   * Get fund by ID
   */
  async getFund(id: string): Promise<ApiResponse<any>> {
    return this.get(`/api/funds/${id}`);
  }

  /**
   * Compare funds
   */
  async compareFunds(fundIds: string[]): Promise<ApiResponse<any>> {
    return this.post('/api/compare', { fundIds });
  }

  /**
   * Check portfolio overlap
   */
  async checkOverlap(fundIds: string[]): Promise<ApiResponse<any>> {
    return this.post('/api/overlap', { fundIds });
  }

  /**
   * Login
   */
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.post('/api/auth/login', { email, password });
  }

  /**
   * Register
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/api/auth/register', data);
  }

  /**
   * Initiate Google OAuth
   */
  async getGoogleAuthUrl(): Promise<ApiResponse<{ authUrl: string }>> {
    return this.get('/api/auth/google');
  }
}

// ===========================
// SINGLETON INSTANCE
// ===========================

export const apiClient = new ApiClient(API_BASE);

// ===========================
// CONVENIENCE EXPORTS
// ===========================

export const api = {
  // Health
  health: () => apiClient.health(),

  // Market Data ⚠️ CORRECTED ROUTES
  market: {
    indices: () => apiClient.getMarketIndices(),
    summary: () => apiClient.getMarketSummary(),
    index: (id: string) => apiClient.getMarketIndex(id),
  },

  // Funds
  funds: {
    list: (params?: Record<string, any>) => apiClient.getFunds(params),
    get: (id: string) => apiClient.getFund(id),
    compare: (fundIds: string[]) => apiClient.compareFunds(fundIds),
    overlap: (fundIds: string[]) => apiClient.checkOverlap(fundIds),
  },

  // Auth
  auth: {
    login: (email: string, password: string) =>
      apiClient.login(email, password),
    register: (data: { name: string; email: string; password: string }) =>
      apiClient.register(data),
    googleAuthUrl: () => apiClient.getGoogleAuthUrl(),
  },
};

// ===========================
// DEBUGGING UTILITIES
// ===========================

if (typeof window !== 'undefined') {
  (window as any).__API_DEBUG__ = {
    baseUrl: API_BASE,
    rawUrl: RAW_URL,
    testConnection: async () => {
      console.log('🧪 Testing API connection...');
      console.log('Base URL:', API_BASE);

      try {
        const health = await apiClient.health();
        console.log('✅ Health check:', health);

        const indices = await apiClient.getMarketIndices();
        console.log('✅ Market indices:', indices);

        return { success: true, health, indices };
      } catch (error) {
        console.error('❌ Connection test failed:', error);
        return { success: false, error };
      }
    },
  };

  console.log('💡 Debug API in console: window.__API_DEBUG__.testConnection()');
}

export default apiClient;
