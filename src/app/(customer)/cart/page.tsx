/**
 * Shopping Cart Page
 * Manage items in two lists: Comprar and Deseados
 * URL: /cart
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types';
import cn from '@/lib/cn';

type TabType = 'COMPRAR' | 'DESEADOS';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: 'COMPRAR', label: 'Comprar', icon: '🛒' },
  { id: 'DESEADOS', label: 'Deseados', icon: '❤️' },
];

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('COMPRAR');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Get items for current tab
  const currentItems = cart[activeTab.toLowerCase() as 'comprar' | 'deseados'];
  const otherTab = activeTab === 'COMPRAR' ? 'DESEADOS' : 'COMPRAR';

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
   * Handle quantity change
   */
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setItemToDelete(productId);
      return;
    }
    cart.updateQuantity(productId, newQuantity, activeTab);
  };

  /**
   * Handle item removal
   */
  const handleRemoveItem = (productId: string) => {
    cart.removeItem(productId, activeTab);
    setItemToDelete(null);
  };

  /**
   * Handle moving item to other list
   */
  const handleMoveItem = (productId: string) => {
    cart.moveItem(productId, activeTab, otherTab);
  };

  /**
   * Render cart item
   */
  const renderCartItem = (item: CartItem) => (
    <Card
      key={item.productId}
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      {/* Item Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Código: <span className="font-bold">{item.sku}</span>
            </p>
            {item.color && (
              <Badge variant="info" size="sm" className="mt-2">
                {item.color}
              </Badge>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-primary-600">{formatPrice(item.unitPrice)}</p>
            <p className="text-sm text-gray-500 mt-1">c/u</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-gray-600">Cantidad:</span>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
            <button
              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center font-semibold bg-transparent focus:outline-none"
            />
            <button
              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="font-bold text-primary-600">{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:flex-col sm:w-auto">
        <Button
          size="sm"
          variant="ghost"
          fullWidth
          onClick={() => handleMoveItem(item.productId)}
          className="text-xs"
        >
          {activeTab === 'COMPRAR' ? 'Mover a Deseados' : 'Mover a Comprar'}
        </Button>
        <Button
          size="sm"
          variant="danger"
          fullWidth
          onClick={() => {
            setItemToDelete(item.productId);
          }}
          className="text-xs"
        >
          Eliminar
        </Button>
      </div>

      {/* Delete Confirmation */}
      {itemToDelete === item.productId && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
          <Card className="w-4/5 max-w-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900">¿Eliminar este producto?</h3>
                <p className="text-sm text-gray-600 mt-2">{item.name}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  fullWidth
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Eliminar
                </Button>
                <Button
                  fullWidth
                  size="sm"
                  variant="secondary"
                  onClick={() => setItemToDelete(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => router.push('/search')}
            aria-label="Volver"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Mi Carrito</h1>
          <div className="p-2 w-10 h-10" />
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[56px] z-10 bg-white border-b border-gray-200">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {TABS.map((tab) => {
            const items = tab.id === 'COMPRAR' ? cart.comprar : cart.deseados;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {items.length > 0 && (
                  <Badge
                    variant={isActive ? 'info' : 'gray'}
                    size="sm"
                    className="ml-1"
                  >
                    {items.length}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto">
        {currentItems.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="text-5xl mb-4">{activeTab === 'COMPRAR' ? '🛒' : '❤️'}</div>
            <p className="text-gray-600 font-medium">
              {activeTab === 'COMPRAR'
                ? 'Tu carrito está vacío'
                : 'No tienes productos en deseados'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {activeTab === 'COMPRAR'
                ? 'Busca productos para agregar a tu carrito'
                : 'Agrega productos que te gusten para verlos después'}
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={() => router.push('/search')}
              className="mt-6 bg-accent-500 hover:bg-accent-600"
            >
              Buscar Productos
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pb-40">
            {/* Items List */}
            <div className="space-y-4 relative">
              {currentItems.map((item) => renderCartItem(item))}
            </div>

            {/* Summary - Only show for Comprar tab */}
            {activeTab === 'COMPRAR' && (
              <Card className="sticky bottom-0 bg-white border-t border-gray-200 rounded-t-lg">
                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(cart.getSubtotal())}</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center text-gray-700">
                    <span>IVA (21%):</span>
                    <span className="font-semibold">{formatPrice(cart.getTax())}</span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(cart.getTotal())}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    fullWidth
                    size="lg"
                    variant="primary"
                    onClick={() => router.push('/checkout')}
                    className="mt-4 bg-accent-500 hover:bg-accent-600"
                  >
                    Ir a Pagar
                  </Button>

                  {/* Continue Shopping */}
                  <Button
                    fullWidth
                    size="lg"
                    variant="secondary"
                    onClick={() => router.push('/search')}
                  >
                    Seguir Comprando
                  </Button>
                </div>
              </Card>
            )}

            {/* Continue Shopping Button - For Deseados tab */}
            {activeTab === 'DESEADOS' && (
              <div className="flex gap-3 sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-t-lg">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={() => router.push('/search')}
                  className="bg-accent-500 hover:bg-accent-600"
                >
                  Seguir Buscando
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FAB - Go to checkout when items in cart */}
      {activeTab === 'COMPRAR' && currentItems.length > 0 && (
        <button
          onClick={() => router.push('/checkout')}
          className={cn(
            'fixed bottom-6 right-6 p-4 rounded-full shadow-lg',
            'bg-accent-500 hover:bg-accent-600 text-white',
            'flex items-center justify-center text-2xl',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500',
            'transition-transform duration-200 hover:scale-110'
          )}
          aria-label="Ir a pagar"
        >
          💳
        </button>
      )}
    </div>
  );
}
