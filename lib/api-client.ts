// ✅ PRODUCTION-READY: API Configuration for 4000+ Funds Backend
// Backend runs on port 3002 with full REST API
// Total funds available: 4,485+ active mutual funds
const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const API_BASE = RAW_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_URL = `${API_BASE}/api`;

// Configuration
const CONFIG = {
  DEFAULT_PAGE_SIZE: parseInt(
    process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '500'
  ),
  MAX_PAGE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || '15000'),
  TIMEOUT_MS: 60000, // 60 seconds for large requests
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
};

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  metadata?: {
    totalAvailable: number;
    fetchedPages: number;
    duplicatesRemoved: number;
  };
  error?: string;
  message?: string;
  enhancedSearch?: boolean;
}

class ApiClient {
  private logRequest(endpoint: string, options?: RequestInit) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🚀 API Request:',
        options?.method || 'GET',
        `${API_BASE}${endpoint}`
      );
    }
  }

  private logResponse(endpoint: string, status: number, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response [${status}]:`, endpoint);
      if (data?.data && Array.isArray(data.data)) {
        console.log(
          `📊 Data count: ${data.data.length}${data.pagination ? ` (Total: ${data.pagination.total})` : ''}`
        );
      }
    }
  }

  private logError(endpoint: string, error: any) {
    console.error('❌ API Error:', endpoint, error);
  }

  private async fetchWithTimeout(
    url: string,
    options?: RequestInit,
    timeout = CONFIG.TIMEOUT_MS
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async retryRequest<T>(
    fn: () => Promise<T>,
    attempts = CONFIG.RETRY_ATTEMPTS,
    delay = CONFIG.RETRY_DELAY_MS
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempts <= 1) throw error;

      console.warn(
        `⚠️ Request failed, retrying... (${CONFIG.RETRY_ATTEMPTS - attempts + 1}/${CONFIG.RETRY_ATTEMPTS})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retryRequest(fn, attempts - 1, delay * 2);
    }
  }

  async request<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    this.logRequest(endpoint, options);

    try {
      return await this.retryRequest(async () => {
        const fullUrl = endpoint.startsWith('http')
          ? endpoint
          : `${API_URL}${endpoint}`;
        const res = await this.fetchWithTimeout(fullUrl, {
          ...options,
          headers: { 'Content-Type': 'application/json', ...options?.headers },
        });

        this.logResponse(endpoint, res.status);

        // Handle non-OK responses
        if (!res.ok) {
          const errorText = await res.text();

          if (res.status === 404) {
            throw new Error(`API endpoint not found: ${endpoint}`);
          } else if (res.status === 500) {
            throw new Error('Backend server error. Check server logs.');
          } else if (res.status === 0 || !res.status) {
            throw new Error(
              'Network error: Cannot reach backend server. Is it running on port 3002?'
            );
          }

          throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // Validate response structure
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid API response: Expected object');
        }

        // Check for success flag
        if (data.success === false) {
          throw new Error(
            data.error || data.message || 'API returned success: false'
          );
        }

        return data as ApiResponse<T>;
      });
    } catch (error: unknown) {
      this.logError(endpoint, error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Backend server is not running. Please start the server on port 3002.'
        );
      }

      throw error;
    }
  }

  // ✅ PRODUCTION: Enhanced getFunds with validation and defaults
  async getFunds(
    page = 1,
    limit = CONFIG.DEFAULT_PAGE_SIZE,
    filters?: {
      category?: string;
      subCategory?: string;
      fundHouse?: string;
      minAum?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) {
    // Validate and cap limit
    const safeLimit = Math.min(Math.max(1, limit), CONFIG.MAX_PAGE_SIZE);
    const safePage = Math.max(1, page);

    const params = new URLSearchParams();
    params.append('page', safePage.toString());
    params.append('limit', safeLimit.toString());

    if (filters?.category) {
      // ✅ Ensure lowercase for category
      params.append('category', filters.category.toLowerCase());
    }
    if (filters?.subCategory) {
      // ✅ Keep Title Case for subCategory
      params.append('subCategory', filters.subCategory);
    }
    if (filters?.fundHouse) {
      params.append('fundHouse', filters.fundHouse);
    }
    if (filters?.minAum !== undefined) {
      params.append('minAum', filters.minAum.toString());
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    return this.request(`/funds?${params.toString()}`);
  }

  /**
   * Get fund by ID (schemeCode or MongoDB ObjectId)
   * Tries schemeCode first (most common), falls back to MongoDB ID
   * @param id - Fund ID (schemeCode preferred)
   */
  async getFundById(id: string) {
    if (!id) {
      throw new Error('Fund ID is required');
    }

    // schemeCode is typically numeric (e.g., "123287")
    // MongoDB ObjectId is 24 hex characters
    const isSchemeCode = /^\d+$/.test(id);

    if (isSchemeCode) {
      // Use schemeCode endpoint for numeric IDs
      return this.request(`/funds/scheme/${id}`);
    } else {
      // Use MongoDB ObjectId endpoint for hex IDs
      return this.request(`/funds/id/${id}`);
    }
  }

  /**
   * Fetch all funds across multiple pages
   * Optimized for 4000+ funds with progress tracking
   * @param targetCount - Target number of funds to fetch (default: all available)
   * @param filters - Optional filters to apply
   * @param onProgress - Optional callback for progress updates
   */
  async getFundsMultiPage(
    targetCount?: number,
    filters?: Parameters<typeof this.getFunds>[2],
    onProgress?: (loaded: number, total: number) => void
  ) {
    const all: any[] = [];
    let page = 1;
    const limit = CONFIG.MAX_PAGE_SIZE; // Use max for efficiency
    let totalAvailable = 0;

    console.log('🚀 [Multi-Page Fetch] Starting comprehensive fund fetch');
    console.log(`📦 [Multi-Page Fetch] Page size: ${limit}`);
    if (targetCount) {
      console.log(`🎯 [Multi-Page Fetch] Target: ${targetCount} funds`);
    }

    try {
      // First request to get total count
      const firstRes = await this.getFunds(page, limit, filters);

      if (
        !firstRes.success ||
        !firstRes.data ||
        !Array.isArray(firstRes.data)
      ) {
        throw new Error('Invalid response structure from API');
      }

      totalAvailable = firstRes.pagination?.total || firstRes.data.length;
      all.push(...firstRes.data);

      console.log(
        `📊 [Multi-Page Fetch] Total available: ${totalAvailable} funds`
      );
      console.log(
        `✅ [Multi-Page Fetch] Page 1: ${firstRes.data.length} funds loaded`
      );

      // Report progress
      if (onProgress) {
        onProgress(all.length, totalAvailable);
      }

      // Determine actual target
      const actualTarget = targetCount
        ? Math.min(targetCount, totalAvailable)
        : totalAvailable;

      // Continue fetching remaining pages
      while (all.length < actualTarget && firstRes.pagination?.hasNext) {
        page++;

        // Safety: max 100 pages (50,000 funds)
        if (page > 100) {
          console.warn(
            `⚠️ [Multi-Page Fetch] Reached safety limit of 100 pages`
          );
          break;
        }

        console.log(
          `⏳ [Multi-Page Fetch] Page ${page}/${Math.ceil(actualTarget / limit)}...`
        );

        const res = await this.getFunds(page, limit, filters);

        if (!res.success || !res.data || !Array.isArray(res.data)) {
          console.warn(
            `⚠️ [Multi-Page Fetch] Invalid response on page ${page}`
          );
          break;
        }

        all.push(...res.data);
        console.log(
          `✅ [Multi-Page Fetch] Page ${page}: ${res.data.length} funds (total: ${all.length}/${actualTarget})`
        );

        // Report progress
        if (onProgress) {
          onProgress(all.length, actualTarget);
        }

        // Check if we should continue
        if (!res.pagination?.hasNext) {
          console.log('🏁 [Multi-Page Fetch] No more pages available');
          break;
        }
      }

      // Remove duplicates by fundId
      const uniqueFunds = Array.from(
        new Map(
          all.map((fund) => [fund.fundId || fund._id || fund.id, fund])
        ).values()
      );

      if (uniqueFunds.length !== all.length) {
        console.log(
          `🔄 [Multi-Page Fetch] Removed ${all.length - uniqueFunds.length} duplicate funds`
        );
      }

      console.log(
        `✅ [Multi-Page Fetch] Complete: ${uniqueFunds.length} unique funds loaded`
      );

      return {
        success: true,
        data: uniqueFunds,
        pagination: {
          page: 1,
          limit: uniqueFunds.length,
          total: uniqueFunds.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        metadata: {
          totalAvailable,
          fetchedPages: page,
          duplicatesRemoved: all.length - uniqueFunds.length,
        },
      };
    } catch (error) {
      console.error('❌ [Multi-Page Fetch] Error:', error);

      // Return partial data if we have some
      if (all.length > 0) {
        console.warn(
          `⚠️ [Multi-Page Fetch] Returning partial data: ${all.length} funds`
        );
        return {
          success: true,
          data: all,
          pagination: {
            page: 1,
            limit: all.length,
            total: all.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
          warning: 'Partial data due to error',
        };
      }

      throw error;
    }
  }

  getFund(id: string) {
    return this.request(`/funds/${id}`);
  }

  /**
   * 🌐 Get unified fund universe for comparison/overlap pages
   * This is the SINGLE SOURCE OF TRUTH for fund selection
   *
   * Features:
   * - All active funds in one request
   * - Lightweight data (only fields needed for selection)
   * - 12-hour server-side caching
   * - Used by: Compare page, Overlap page, EnhancedFundSelector
   *
   * @param options - Optional filters and limit
   */
  async getFundUniverse(options?: {
    category?: string;
    amc?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams();

    if (options?.category && options.category !== 'all') {
      params.append('category', options.category);
    }
    if (options?.amc && options.amc !== 'all') {
      params.append('amc', options.amc);
    }
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = `/funds/universe${queryString ? `?${queryString}` : ''}`;

    console.log('🌐 [Fund Universe] Fetching unified fund universe...');

    const result = await this.request(endpoint);

    if (result.success) {
      console.log(
        `✅ [Fund Universe] Loaded ${result.data?.length || 0} funds`
      );
    }

    return result;
  }

  // Market indices
  getIndices() {
    return this.request('/market/summary');
  }

  // Compare multiple funds
  compareFunds(fundIds: string[]) {
    return this.request('/comparison/funds', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  // Analyze portfolio overlap
  analyzeFundOverlap(fundIds: string[]) {
    return this.request('/overlap', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  // AI Chat - uses /api/ai/chat endpoint which expects 'message' and returns 'reply'
  chat(message: string, context?: any) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationHistory: context?.conversationHistory,
      }),
    });
  }

  // Calculators
  calculateSIP(params: {
    monthlyInvestment: number;
    annualReturnRate: number;
    investmentPeriod: number;
  }) {
    return this.request('/calculator/sip', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  calculateLumpsum(params: {
    investmentAmount: number;
    annualReturnRate: number;
    investmentPeriod: number;
  }) {
    return this.request('/calculator/lumpsum', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Get fund NAV history
  getFundNavs(fundId: string, from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/funds/${fundId}/navs${query}`);
  }

  // Get fund manager details
  getFundManager(fundId: string) {
    return this.request(`/funds/${fundId}/manager`);
  }

  // Get fund holdings
  getFundHoldings(fundId: string, limit = 15) {
    return this.request(`/funds/${fundId}/holdings?limit=${limit}`);
  }

  // Get fund sector allocation
  getFundSectors(fundId: string) {
    return this.request(`/funds/${fundId}/sectors`);
  }

  // Get complete fund details (with holdings, sectors, manager)
  getFundDetails(fundId: string) {
    return this.request(`/funds/${fundId}/details`);
  }

  // News
  getNews(category?: string, limit = 10) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    return this.request(`/news/latest?${params.toString()}`);
  }

  // ✅ Health check with detailed diagnostics
  async checkHealth(): Promise<{
    healthy: boolean;
    backend: string;
    timestamp: string;
    details?: any;
  }> {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return {
          healthy: false,
          backend: API_BASE,
          timestamp: new Date().toISOString(),
          details: { status: response.status, statusText: response.statusText },
        };
      }

      const data = await response.text();
      return {
        healthy: true,
        backend: API_BASE,
        timestamp: new Date().toISOString(),
        details: { response: data },
      };
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      return {
        healthy: false,
        backend: API_BASE,
        timestamp: new Date().toISOString(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // ✅ Search/autocomplete with external API fallback
  async searchFunds(query: string, limit: number = 5000) {
    if (!query || query.length < 2) {
      return { success: true, data: [], enhancedSearch: false };
    }

    try {
      const params = new URLSearchParams();
      params.append('q', query); // ✅ Fixed: Backend expects 'q' not 'query'
      params.append('limit', limit.toString()); // Add limit parameter

      const response = await this.request(`/funds/search?${params.toString()}`);

      // Log if results came from external APIs
      if (response.enhancedSearch && response.data?.some((f: any) => f.isNew)) {
        console.log('🌐 Some results fetched from external APIs');
      }

      return response;
    } catch (error) {
      console.error('❌ Search error:', error);
      return {
        success: false,
        data: [],
        error: 'Search failed',
        enhancedSearch: false,
      };
    }
  }

  /**
   * Get API statistics and configuration
   */
  getApiInfo() {
    return {
      baseUrl: API_BASE,
      apiUrl: API_URL,
      config: CONFIG,
      timestamp: new Date().toISOString(),
    };
  }
}

export const api = new ApiClient();
export const apiClient = api; // Backward compatibility
