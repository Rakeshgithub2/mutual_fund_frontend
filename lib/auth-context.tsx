'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  emailVerified?: boolean;
  preferences?: any;
  subscription?: any;
  kyc?: any;
}

interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (idToken: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    age?: number
  ) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('[Auth Context] Loading user from localStorage...');
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          console.log('[Auth Context] User loaded:', parsedUser.email);
          setUser(parsedUser);
        } else {
          console.log('[Auth Context] No stored user found');
        }
      } catch (error) {
        console.error('[Auth Context] Failed to load user:', error);
        setError({
          message: 'Failed to restore session',
          details: error,
        });
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Setup automatic token refresh (refresh 1 minute before expiry)
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        // If refresh fails, logout user
        await logout();
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes (access token expires in 15 minutes)

    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = async (idToken: string) => {
    try {
      console.log('[Auth Context] Login with Google token initiated...');
      console.log('[Auth Context] API_BASE_URL:', API_BASE_URL);
      console.log('[Auth Context] Token length:', idToken?.length);
      setIsLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/api/auth/google`;
      console.log('[Auth Context] Fetching:', url);

      const response = await fetch(url, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token: idToken }),
      });

      console.log('[Auth Context] Response status:', response.status);
      console.log(
        '[Auth Context] Response headers:',
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error(
          '[Auth Context] Non-JSON response received:',
          text.substring(0, 500)
        );
        throw new Error('Invalid response from server. Please try again.');
      }

      const data = await response.json();
      console.log('[Auth Context] Response data:', data);

      if (!response.ok) {
        const errorMessage = data.error || 'Authentication failed';
        console.error('[Auth Context] Login failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('[Auth Context] Login successful:', data.data.user.email);

      // Store tokens - Google OAuth and manual login both return 'accessToken'
      localStorage.setItem('accessToken', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setUser(data.data.user);

      // Redirect to home page after successful login
      router.push('/');

      return data;
    } catch (error: any) {
      console.error('[Auth Context] Login error:', error);
      setError({
        message: error.message || 'Failed to login',
        details: error,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      console.log('[Auth Context] Email login initiated for:', email);
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Invalid email or password';
        console.error('[Auth Context] Email login failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log(
        '[Auth Context] Email login successful:',
        data.data.user.email
      );

      // Store tokens - Login/Register returns accessToken directly
      localStorage.setItem('accessToken', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setUser(data.data.user);

      // Redirect to home page after successful login
      router.push('/');
    } catch (error: any) {
      console.error('[Auth Context] Email login error:', error);
      setError({
        message: error.message || 'Failed to login with email',
        details: error,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    age?: number
  ) => {
    try {
      console.log('[Auth Context] Registration initiated for:', email);
      setIsLoading(true);
      setError(null);

      const requestBody: any = { name, email, password };
      if (age) {
        requestBody.age = age;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Registration failed';
        console.error('[Auth Context] Registration failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log(
        '[Auth Context] Registration successful:',
        data.data.user.email
      );

      // Store tokens - Register returns accessToken directly
      localStorage.setItem('accessToken', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setUser(data.data.user);

      // Redirect to home page after successful registration
      router.push('/');
    } catch (error: any) {
      console.error('[Auth Context] Registration error:', error);
      setError({
        message: error.message || 'Failed to register',
        details: error,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (idToken: string) => {
    console.log('[Auth Context] Google Sign-In initiated');
    return login(idToken);
  };

  const logout = async () => {
    try {
      console.log('[Auth Context] Logout initiated');
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');

      // Call logout endpoint
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      }).catch((err) => {
        console.log('[Auth Context] Logout API call failed (ignoring):', err);
      });

      console.log('[Auth Context] Logout successful');
    } finally {
      // Clear local state regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      router.push('/auth/login');
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      console.log('[Auth Context] Token refresh initiated');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error('[Auth Context] No refresh token available');
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Token refresh failed';
        console.error('[Auth Context] Token refresh failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Update access token
      localStorage.setItem('accessToken', data.data.accessToken);
      console.log('[Auth Context] Token refresh successful');

      return data.data.accessToken;
    } catch (error: any) {
      console.error('[Auth Context] Token refresh error:', error);
      setError({
        message: 'Session expired. Please login again.',
        details: error,
      });
      // Clear tokens and logout user
      await logout();
      return null;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    console.log('[Auth Context] User updated:', updates);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    console.log('[Auth Context] Error cleared');
    setError(null);
  };

  // Helper function to handle post-login redirect
  const handlePostLoginRedirect = () => {
    try {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        console.log('[Auth Context] Redirecting to:', redirectPath);
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        console.log('[Auth Context] No redirect path, navigating to home page');
        router.push('/');
      }
    } catch (error) {
      console.error('[Auth Context] Redirect error:', error);
      router.push('/');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    loginWithEmail,
    register,
    googleSignIn,
    logout,
    refreshAccessToken,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get access token with automatic refresh
export async function getAccessToken(): Promise<string | null> {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  // Check if token is expired (JWT payload contains exp)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();

    // If token expires in less than 1 minute, refresh it
    if (expiresAt - now < 60000) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.data.accessToken);
        return data.data.accessToken;
      }

      return null;
    }

    return token;
  } catch (error) {
    console.error('Token validation error:', error);
    return token; // Return token anyway if parsing fails
  }
}

// Helper function to make authenticated API calls
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
