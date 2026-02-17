/**
 * Authentication API Service
 * User login and auth-related calls
 */

import { apiClient } from '@/lib/api';
import { User, AuthResponse, LoginRequest } from '@/types';

export const authService = {
  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @returns User info and JWT token
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  /**
   * Get current authenticated user info
   * @returns Current user details
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Logout the current user
   */
  logout(): void {
    apiClient.clearToken();
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if token exists
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return !!localStorage.getItem('auth_token');
    } catch {
      return false;
    }
  },

  /**
   * Get stored token
   * @returns JWT token or null
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  },
};
