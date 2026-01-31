import api, {
  storeAuthData,
  clearAuthData,
  isAuthenticated as checkAuth,
  getCurrentUser as getUser,
} from './axios';

/**
 * Authentication Service
 * =====================
 * Centralized service for all authentication operations
 * Works seamlessly in both local and production environments
 */

// ==========================================
// TYPES
// ==========================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AuthResponse {
  user: {
    userId?: string;
    id?: string;
    email: string;
    name: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GoogleAuthResponse {
  success: boolean;
  user: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ==========================================
// AUTH SERVICE CLASS
// ==========================================

class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      console.log('📝 Registering user:', data.email);

      const response = await api.post('/auth/register', data);

      if (response.data?.data) {
        const authData = response.data.data;

        // Store tokens and user data
        storeAuthData(authData);

        console.log('✅ Registration successful');

        return {
          success: true,
          user: authData.user,
        };
      }

      return {
        success: false,
        error: 'Registration failed - Invalid response',
      };
    } catch (error: any) {
      console.error('❌ Registration error:', error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Registration failed. Please try again.',
      };
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      console.log('🔐 Logging in user:', credentials.email);

      const response = await api.post('/auth/login', credentials);

      if (response.data?.data) {
        const authData = response.data.data;

        // Store tokens and user data
        storeAuthData(authData);

        console.log('✅ Login successful');

        return {
          success: true,
          user: authData.user,
        };
      }

      return {
        success: false,
        error: 'Login failed - Invalid response',
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Login failed. Please check your credentials.',
      };
    }
  }

  /**
   * Google OAuth Login
   * Opens Google OAuth flow in same window
   */
  googleLogin(): void {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const googleAuthUrl = `${API_URL}/api/auth/google`;

    console.log('🔗 Redirecting to Google OAuth:', googleAuthUrl);

    // Redirect to backend Google OAuth endpoint
    window.location.href = googleAuthUrl;
  }

  /**
   * Handle Google OAuth callback
   * Called after Google redirects back to frontend
   */
  async handleGoogleCallback(code: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      console.log('🔄 Processing Google OAuth callback');

      const response = await api.get(`/auth/google/callback?code=${code}`);

      if (response.data?.data) {
        const authData = response.data.data;

        // Store tokens and user data
        storeAuthData(authData);

        console.log('✅ Google authentication successful');

        return {
          success: true,
          user: authData.user,
        };
      }

      return {
        success: false,
        error: 'Google authentication failed',
      };
    } catch (error: any) {
      console.error('❌ Google callback error:', error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Google authentication failed',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out user');

      // Call logout endpoint (optional - for server-side cleanup)
      await api.post('/auth/logout').catch(() => {
        // Ignore errors - still clear local data
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      clearAuthData();

      // Redirect to home page
      window.location.href = '/';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return checkAuth();
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    return getUser();
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token available',
        };
      }

      const response = await api.post('/auth/refresh', { refreshToken });

      if (response.data?.data?.tokens) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data.tokens;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return { success: true };
      }

      return {
        success: false,
        error: 'Token refresh failed',
      };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: {
    name?: string;
    age?: number;
    riskLevel?: string;
  }): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await api.put('/auth/profile', data);

      if (response.data?.data?.user) {
        const updatedUser = response.data.data.user;

        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('varta_user', JSON.stringify(updatedUser));

        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));

        return {
          success: true,
          user: updatedUser,
        };
      }

      return {
        success: false,
        error: 'Profile update failed',
      };
    } catch (error: any) {
      console.error('Profile update error:', error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Profile update failed',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Password change error:', error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Password change failed',
      };
    }
  }
}

// ==========================================
// EXPORTS
// ==========================================

// Create singleton instance
export const authService = new AuthService();

// Export as default
export default authService;
