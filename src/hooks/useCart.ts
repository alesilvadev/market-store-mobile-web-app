/**
 * Cart State Management Hook
 * Uses Zustand for state management with localStorage persistence
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem } from '@/types';

const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE || '0.21');

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      comprar: [],
      deseados: [],

      // =====================================================================
      // Item Management
      // =====================================================================

      addItem: (item, listType) => {
        set((state) => {
          const cartList = state[listType.toLowerCase() as 'comprar' | 'deseados'];

          // Check if item already exists
          const existingIndex = cartList.findIndex((i) => i.productId === item.productId);

          let newList: CartItem[];
          if (existingIndex >= 0) {
            // Item exists, increase quantity
            newList = [...cartList];
            newList[existingIndex].quantity += item.quantity;
          } else {
            // New item
            newList = [...cartList, { ...item, listType }];
          }

          return {
            [listType.toLowerCase()]: newList,
          } as unknown as CartState;
        });
      },

      removeItem: (productId, listType) => {
        set((state) => {
          const cartList = state[listType.toLowerCase() as 'comprar' | 'deseados'];
          const newList = cartList.filter((item) => item.productId !== productId);

          return {
            [listType.toLowerCase()]: newList,
          } as unknown as CartState;
        });
      },

      updateQuantity: (productId, quantity, listType) => {
        set((state) => {
          const cartList = state[listType.toLowerCase() as 'comprar' | 'deseados'];
          const newList = cartList.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          );

          return {
            [listType.toLowerCase()]: newList,
          } as unknown as CartState;
        });
      },

      moveItem: (productId, from, to) => {
        set((state) => {
          const fromList = state[from.toLowerCase() as 'comprar' | 'deseados'];
          const toList = state[to.toLowerCase() as 'comprar' | 'deseados'];

          const item = fromList.find((i) => i.productId === productId);
          if (!item) return state;

          const newFromList = fromList.filter((i) => i.productId !== productId);
          const newToList = [...toList, { ...item, listType: to }];

          return {
            [from.toLowerCase()]: newFromList,
            [to.toLowerCase()]: newToList,
          } as unknown as CartState;
        });
      },

      clearCart: () => {
        set({
          comprar: [],
          deseados: [],
        });
      },

      // =====================================================================
      // Calculations
      // =====================================================================

      getSubtotal: () => {
        const state = get();
        const comprarTotal = state.comprar.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        );
        return Math.round(comprarTotal * 100) / 100;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * TAX_RATE * 100) / 100;
      },

      getTotal: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        const tax = state.getTax();
        return Math.round((subtotal + tax) * 100) / 100;
      },

      getItemCount: (listType) => {
        const state = get();
        const list = state[listType.toLowerCase() as 'comprar' | 'deseados'];
        return list.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'market-store-cart',
      partialize: (state: CartState) => ({
        comprar: state.comprar,
        deseados: state.deseados,
      }),
    } as never
  )
);
