/**
 * Order API Service
 * All order-related API calls
 */

import { apiClient } from '@/lib/api';
import { Order, CreateOrderRequest, CompleteOrderRequest } from '@/types';

export const orderService = {
  /**
   * Create a new order
   * @param data - Order data with items
   * @returns Created order with unique code
   */
  async create(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', data);
  },

  /**
   * Get order by customer-facing code
   * @param code - 8-character order code
   * @returns Order details
   */
  async getByCode(code: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/code/${code}`);
  },

  /**
   * Get order by ID (authenticated only)
   * @param id - Order ID
   * @returns Order details
   */
  async getById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  /**
   * Complete an order with payment (cashier endpoint)
   * @param id - Order ID
   * @param data - Completion data (payment method, status)
   * @returns Updated order
   */
  async complete(id: string, data: CompleteOrderRequest): Promise<Order> {
    return apiClient.post<Order>(`/orders/${id}/complete`, data);
  },

  /**
   * Update order status
   * @param id - Order ID
   * @param status - New order status
   * @returns Updated order
   */
  async updateStatus(id: string, status: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  },
};
