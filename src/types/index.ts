/**
 * Market Store Type Definitions
 * Central location for all TypeScript types used in the mobile web app
 */

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'ADMIN' | 'CASHIER';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  color?: string | null;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchRequest {
  sku: string;
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'MOBILE_PAYMENT' | 'OTHER';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  color?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    sku: string;
    quantity: number;
    color?: string;
  }[];
  notes?: string;
}

export interface CompleteOrderRequest {
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

// ============================================================================
// Cart Types (Local Frontend State)
// ============================================================================

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  color?: string;
  imageUrl?: string;
  listType: 'COMPRAR' | 'DESEADOS';
}

export interface CartState {
  comprar: CartItem[];
  deseados: CartItem[];

  // Actions
  addItem: (item: Omit<CartItem, 'listType'>, listType: 'COMPRAR' | 'DESEADOS') => void;
  removeItem: (productId: string, listType: 'COMPRAR' | 'DESEADOS') => void;
  updateQuantity: (productId: string, quantity: number, listType: 'COMPRAR' | 'DESEADOS') => void;
  moveItem: (productId: string, from: 'COMPRAR' | 'DESEADOS', to: 'COMPRAR' | 'DESEADOS') => void;
  clearCart: () => void;

  // Getters
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: (listType: 'COMPRAR' | 'DESEADOS') => number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface CheckoutFormData {
  paymentMethod?: PaymentMethod;
  notes?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}
