import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

/**
 * Production-Safe API Configuration
 * ================================
 * This centralized axios instance handles:
 * - Environment-based URL configuration
 * - CORS with credentials
 * - Automatic token refresh
 * - Error handling
 */

// Get API URL from environment (no trailing slash, no /api suffix)
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
).replace(/\/+$/, ''); // Remove trailing slashes

console.log('🌐 Axios API Base URL:', API_BASE_URL);

// Create axios instance with production-safe defaults
// ✅ FIXED: No /api in baseURL - routes already include /api prefix
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ⚠️ CRITICAL: Required for cookies to work cross-origin
});

// ==========================================
// REQUEST INTERCEPTOR - Add Auth Token
// ==========================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try both token keys for backward compatibility
    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('varta_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR - Handle Token Refresh
// ==========================================
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 (Unauthorized) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken =
          localStorage.getItem('refreshToken') ||
          localStorage.getItem('varta_token');

        if (!refreshToken) {
          // No refresh token, redirect to login
          console.log('🔒 No refresh token, redirecting to login');
          clearAuthData();
          window.location.href = '/auth';
          return Promise.reject(error);
        }

        console.log('🔄 Attempting token refresh...');

        // Call refresh endpoint
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        // Save new tokens
        const newAccessToken = data.data.tokens.accessToken;
        const newRefreshToken = data.data.tokens.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log('✅ Token refreshed successfully');

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        console.error('❌ Token refresh failed:', refreshError);
        clearAuthData();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Clear all authentication data
 */
function clearAuthData() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('varta_token');
  localStorage.removeItem('varta_user');

  // Dispatch custom event for auth state change
  window.dispatchEvent(new Event('authChange'));
}

/**
 * Store authentication data
 */
export function storeAuthData(data: {
  user: any;
  tokens: { accessToken: string; refreshToken: string };
}) {
  localStorage.setItem('accessToken', data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));

  // Also store in old keys for backward compatibility
  localStorage.setItem('varta_token', data.tokens.accessToken);
  localStorage.setItem('varta_user', JSON.stringify(data.user));

  // Dispatch custom event for auth state change
  window.dispatchEvent(new Event('authChange'));
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token =
    localStorage.getItem('accessToken') || localStorage.getItem('varta_token');
  return !!token;
}

/**
 * Get current user from storage
 */
export function getCurrentUser() {
  const userStr =
    localStorage.getItem('user') || localStorage.getItem('varta_user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// ==========================================
// EXPORTS
// ==========================================

export default api;

// Export base URL for direct use if needed
export { API_BASE_URL };

// Export auth helpers
export { clearAuthData };
