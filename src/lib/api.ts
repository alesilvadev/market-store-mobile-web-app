/**
 * API Client for Market Store Mobile Web App
 * Handles all HTTP communication with the backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to every request if available
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses consistently
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Log error for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.error('[API Error]', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  // =========================================================================
  // Token Management
  // =========================================================================

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('auth_token');
      return stored ? stored : null;
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // =========================================================================
  // Error Handling
  // =========================================================================

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiResponse | undefined;

      // If backend returned an error response
      if (apiError?.success === false && apiError.error) {
        return {
          message: apiError.error.message || 'An error occurred',
          statusCode: error.response?.status,
          details: apiError.error.details,
        };
      }

      // Handle other HTTP errors
      const statusCode = error.response?.status;
      const message = this.getErrorMessage(statusCode);
      return {
        message,
        statusCode,
      };
    }

    // Non-Axios errors (network, timeout, etc.)
    if (error instanceof Error) {
      return {
        message: error.message || 'An unknown error occurred',
      };
    }

    return {
      message: 'An unknown error occurred',
    };
  }

  private getErrorMessage(statusCode?: number): string {
    switch (statusCode) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to access this resource';
      case 404:
        return 'Resource not found';
      case 409:
        return 'This resource already exists';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable';
      default:
        if (statusCode && statusCode >= 500) {
          return 'Server error. Please try again later.';
        }
        return 'Network error. Please check your connection.';
    }
  }

  // =========================================================================
  // HTTP Methods
  // =========================================================================

  async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, { params });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      return response.data.data as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      return response.data.data as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      return response.data.data as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T = unknown>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      return response.data.data as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = unknown>(url: string): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      return response.data.data as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Helper method for paginated requests
   */
  async getPaginated<T = unknown>(
    url: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T[]>>(url, {
        params: { page, limit },
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      return {
        data: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || page,
        limit: response.data.meta?.limit || limit,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for use in other parts of the app
export default apiClient;
