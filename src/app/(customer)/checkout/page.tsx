/**
 * Checkout Page
 * Order review, creation, and confirmation
 * URL: /checkout
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/api/orders';
import { ApiError, PaymentMethod } from '@/types';
import cn from '@/lib/cn';

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  notes: string;
  selectedPayment: PaymentMethod | null;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'CASH', label: 'Efectivo', icon: '💵' },
  { value: 'CARD', label: 'Tarjeta', icon: '💳' },
  { value: 'MOBILE_PAYMENT', label: 'Billetera Digital', icon: '📱' },
  { value: 'OTHER', label: 'Otro', icon: '❓' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    isLoading: false,
    error: null,
    notes: '',
    selectedPayment: 'CASH',
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get items from cart
  const items = cart.comprar;
  const subtotal = cart.getSubtotal();
  const tax = cart.getTax();
  const total = cart.getTotal();

  /**
   * Format price for display
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price);
  };

  /**
   * Handle order creation
   */
  const handleCreateOrder = async () => {
    if (!checkoutState.selectedPayment) {
      setCheckoutState((prev) => ({
        ...prev,
        error: 'Por favor selecciona un método de pago',
      }));
      return;
    }

    if (items.length === 0) {
      setCheckoutState((prev) => ({
        ...prev,
        error: 'Tu carrito está vacío',
      }));
      return;
    }

    setCheckoutState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Create order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          quantity: item.quantity,
          color: item.color,
        })),
        notes: checkoutState.notes || undefined,
      };

      // Create order via API
      const order = await orderService.create(orderData);

      // Clear cart after successful creation
      cart.clearCart();

      // Redirect to order code page
      router.push(`/order-code?code=${order.code}`);
    } catch (err) {
      const error = err as ApiError;
      setCheckoutState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al crear la orden',
      }));
    }
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrito vacío</h1>
          <p className="text-gray-600 mb-6">No tienes productos para finalizar la compra</p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => router.push('/search')}
            className="bg-accent-500 hover:bg-accent-600"
          >
            Volver a Buscar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => router.push('/cart')}
            aria-label="Volver"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Finalizar Compra</h1>
          <div className="p-2 w-10 h-10" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-40">
        {/* Error Message */}
        {checkoutState.error && (
          <div className="mb-6 bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-800 font-medium">Error</p>
            <p className="text-error-600 text-sm mt-1">{checkoutState.error}</p>
          </div>
        )}

        {/* Order Summary */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen de Compra</h2>

          {/* Items */}
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-sm">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.name} {item.color && `(${item.color})`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.quantity * item.unitPrice)}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Totals */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>IVA (21%):</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary-600">{formatPrice(total)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Method Selection */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Método de Pago</h2>

          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                onClick={() =>
                  setCheckoutState((prev) => ({
                    ...prev,
                    selectedPayment: method.value,
                  }))
                }
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-center',
                  checkoutState.selectedPayment === method.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <p className="text-sm font-medium text-gray-900">{method.label}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Notes Section */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Notas Adicionales (Opcional)</h2>

          <textarea
            value={checkoutState.notes}
            onChange={(e) =>
              setCheckoutState((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            placeholder="Ej: Pedir bolsa grande, no dejar en la puerta, etc."
            className={cn(
              'w-full px-4 py-3 rounded-lg border text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'bg-white border-gray-300 focus:border-primary-500',
              'min-h-[100px] resize-none'
            )}
            disabled={checkoutState.isLoading}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-2">
            {checkoutState.notes.length}/500 caracteres
          </p>
        </Card>

        {/* Confirmation Checkbox */}
        <Card className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={cn(
                'w-5 h-5 rounded border-gray-300 flex-shrink-0 mt-1',
                'focus:ring-2 focus:ring-primary-500'
              )}
            />
            <span className="text-sm text-gray-700">
              Confirmo que los productos y cantidades son correctos. La orden será visible en caja
              con el código que recibiré.
            </span>
          </label>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 sticky bottom-0 bg-gray-50 p-4 -mx-4">
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={handleCreateOrder}
            isLoading={checkoutState.isLoading}
            disabled={!termsAccepted || checkoutState.isLoading}
            className="bg-accent-500 hover:bg-accent-600 disabled:opacity-50"
          >
            {checkoutState.isLoading ? 'Creando orden...' : 'Crear Orden'}
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="secondary"
            onClick={() => router.push('/cart')}
            disabled={checkoutState.isLoading}
          >
            Volver al Carrito
          </Button>
        </div>
      </main>
    </div>
  );
}
