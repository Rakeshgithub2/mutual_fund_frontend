/**
 * API Configuration
 * Centralized API endpoints with V2 support and fallback
 */

// Base URLs
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';
const API_V1_BASE = `${BACKEND_BASE_URL}/api`;
const API_V2_BASE = `${BACKEND_BASE_URL}/api/v2`;

export const API_CONFIG = {
  // V2 Endpoints (with Redis caching and professional architecture)
  V2: {
    FUNDS: {
      DETAILS: (fundCode: string) => `${API_V2_BASE}/funds/${fundCode}`,
      NAV: (fundCode: string) => `${API_V2_BASE}/funds/${fundCode}/nav`,
      SEARCH: `${API_V2_BASE}/funds`,
      SUGGEST: `${API_V2_BASE}/suggest`,
    },
    MARKET: {
      INDICES: `${API_V2_BASE}/market/indices`,
    },
  },

  // V1 Endpoints (fallback)
  V1: {
    FUNDS: {
      DETAILS: (fundId: string) => `${API_V1_BASE}/funds/${fundId}`,
      LIST: `${API_V1_BASE}/funds`,
      SEARCH: `${API_V1_BASE}/funds/search`,
    },
    MARKET: {
      INDICES: `${API_V1_BASE}/market-indices`,
      SUMMARY: `${API_V1_BASE}/market/summary`,
    },
    NEWS: {
      LIST: `${API_V1_BASE}/news`,
      DETAILS: (id: string) => `${API_V1_BASE}/news/${id}`,
    },
    FUND_MANAGERS: {
      LIST: `${API_V1_BASE}/fund-managers`,
      DETAILS: (name: string) => `${API_V1_BASE}/fund-managers/${name}`,
    },
  },
};

/**
 * Fetch with automatic fallback from V2 to V1
 * Note: V2 routes not currently mounted in backend - skipping V2 attempt
 * @param v2Url - V2 API endpoint (unused)
 * @param v1Url - V1 API fallback endpoint
 * @param options - Fetch options
 * @returns Response data
 */
export async function fetchWithFallback(
  v2Url: string,
  v1Url: string,
  options?: RequestInit
): Promise<any> {
  // Skip V2 attempt since routes aren't mounted - go directly to V1
  try {
    const v1Response = await fetch(v1Url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!v1Response.ok) {
      throw new Error(`API failed: ${v1Response.statusText}`);
    }

    const data = await v1Response.json();
    return data;
  } catch (error) {
    console.error('❌ API request failed:', v1Url, error);
    throw error;
  }
}

/**
 * Fetch fund details with V2/V1 fallback
 */
export async function fetchFundDetails(fundIdOrCode: string) {
  return fetchWithFallback(
    API_CONFIG.V2.FUNDS.DETAILS(fundIdOrCode),
    API_CONFIG.V1.FUNDS.DETAILS(fundIdOrCode)
  );
}

/**
 * Fetch market indices with V2/V1 fallback
 */
export async function fetchMarketIndices() {
  return fetchWithFallback(
    API_CONFIG.V2.MARKET.INDICES,
    API_CONFIG.V1.MARKET.INDICES
  );
}

export default API_CONFIG;
