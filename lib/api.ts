// API utility with axios for authenticated requests
// Handles JWT token storage and automatic attachment to requests
// Usage: import { api } from '@/lib/api'

// ✅ FIXED: Remove /api from base URL (routes already include /api)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS: 'varta_token',
  REFRESH: 'varta_refresh_token',
  USER: 'varta_user',
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.ACCESS);
};

// Set token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEYS.ACCESS, token);
  }
};

// Get refresh token
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.REFRESH);
};

// Set refresh token
export const setRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEYS.REFRESH, token);
  }
};

// Get user data
export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(TOKEN_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

// Set user data
export const setUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
  }
};

// Clear all auth data
export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// API helper using fetch (no axios dependency needed)
interface ApiRequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export const api = {
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          },
          {} as Record<string, string>
        )
      ).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Attach auth token
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  },

  post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

// Watchlist API helpers
export const watchlistApi = {
  getAll: () => api.get('/watchlist'),
  add: (fundId: string) => api.post('/watchlist', { fundId }),
  remove: (itemId: string) => api.delete(`/watchlist/${itemId}`),
};
