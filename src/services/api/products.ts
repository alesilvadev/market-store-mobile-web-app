/**
 * Product API Service
 * All product-related API calls
 */

import { apiClient } from '@/lib/api';
import { Product } from '@/types';

export const productService = {
  /**
   * Search products by SKU code
   * @param sku - Product SKU code to search for
   * @returns Array of matching products
   */
  async searchBySku(sku: string): Promise<Product[]> {
    return apiClient.get<Product[]>('/products/search', { sku });
  },

  /**
   * Get product by ID
   * @param id - Product ID
   * @returns Product details or throws error if not found
   */
  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * List all active products with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Paginated product list
   */
  async list(page: number = 1, limit: number = 20) {
    return apiClient.getPaginated<Product>('/products', page, limit);
  },
};
