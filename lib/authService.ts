// Authentication Service
// Handles all authentication-related API calls

import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const API_URL = (process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`).replace(
  /\/+$/,
  ''
);

interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    user: {
      userId: string;
      email: string;
      name: string;
      role: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  timestamp: string;
}

interface RefreshResponse {
  data: {
    tokens: {
      accessToken: string;
    };
  };
}

class AuthService {
  /**
   * Register a new user with email and password
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      if (response.data?.data) {
        // Store tokens and user data
        this.storeAuthData(response.data.data);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || 'Registration failed',
      };
    }
  }

  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data?.data) {
        // Store tokens and user data
        this.storeAuthData(response.data.data);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Invalid email or password',
      };
    }
  }

  /**
   * Google Sign-In
   */
  async googleSignIn(
    idToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/google`,
        {
          idToken,
        }
      );

      if (response.data?.data) {
        // Store tokens and user data
        this.storeAuthData(response.data.data);
        return { success: true };
      }

      return { success: false, error: 'Google sign-in failed' };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Google sign-in failed',
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return null;
      }

      const response = await axios.post<RefreshResponse>(
        `${API_URL}/auth/refresh`,
        {
          refreshToken,
        }
      );

      if (response.data?.data?.tokens?.accessToken) {
        const newAccessToken = response.data.data.tokens.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      }

      return null;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      // If refresh fails, clear all auth data
      this.logout();
      return null;
    }
  }

  /**
   * Logout - clear all stored data
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): any | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(data: { user: any; tokens: any }): void {
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
