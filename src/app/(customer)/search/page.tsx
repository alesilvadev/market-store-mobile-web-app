/**
 * Product Search Page
 * Allows customers to search products by SKU code and add them to cart
 * URL: /search
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { productService } from '@/services/api/products';
import { useCart } from '@/hooks/useCart';
import { Product, ApiError } from '@/types';
import cn from '@/lib/cn';

interface SearchState {
  isLoading: boolean;
  error: string | null;
  results: Product[];
  searchedSku: string;
}

interface ConfirmDialogState {
  isOpen: boolean;
  product: Product | null;
  quantity: number;
  selectedColor: string;
}

export default function SearchPage() {
  const router = useRouter();
  const cart = useCart();

  // Search state
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: [],
    searchedSku: '',
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    product: null,
    quantity: 1,
    selectedColor: '',
  });

  // Search input
  const [inputValue, setInputValue] = useState('');

  /**
   * Handle SKU search - debounced to avoid excessive API calls
   */
  const handleSearch = useCallback(
    async (sku: string) => {
      if (!sku.trim()) {
        setSearchState({
          isLoading: false,
          error: null,
          results: [],
          searchedSku: '',
        });
        return;
      }

      setSearchState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const results = await productService.searchBySku(sku.trim());
        setSearchState({
          isLoading: false,
          error: null,
          results,
          searchedSku: sku.trim(),
        });
      } catch (err) {
        const error = err as ApiError;
        setSearchState({
          isLoading: false,
          error: error.message || 'Error searching products',
          results: [],
          searchedSku: sku.trim(),
        });
      }
    },
    []
  );

  /**
   * Handle input change with debouncing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length >= 3 || inputValue.length === 0) {
        handleSearch(inputValue);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [inputValue, handleSearch]);

  /**
   * Open confirmation dialog when product selected
   */
  const handleSelectProduct = (product: Product) => {
    setConfirmDialog({
      isOpen: true,
      product,
      quantity: 1,
      selectedColor: product.color || '',
    });
  };

  /**
   * Add product to cart
   */
  const handleConfirmAdd = (list: 'COMPRAR' | 'DESEADOS') => {
    if (!confirmDialog.product) return;

    const item = {
      productId: confirmDialog.product.id,
      sku: confirmDialog.product.sku,
      name: confirmDialog.product.name,
      quantity: confirmDialog.quantity,
      unitPrice: confirmDialog.product.price,
      color: confirmDialog.selectedColor || undefined,
      listType: list,
    };

    cart.addItem(item, list);

    // Close dialog and reset input
    setConfirmDialog({
      isOpen: false,
      product: null,
      quantity: 1,
      selectedColor: '',
    });
    setInputValue('');
    setSearchState({
      isLoading: false,
      error: null,
      results: [],
      searchedSku: '',
    });

    // Show feedback
    const listLabel = list === 'COMPRAR' ? 'tu carrito' : 'deseados';
    console.log(`✓ ${item.name} añadido a ${listLabel}`);
  };

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

  const cartCount = cart.getItemCount('COMPRAR');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => router.back()}
            aria-label="Volver"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Buscar Productos</h1>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            onClick={() => router.push('/cart')}
            aria-label={`Carrito con ${cartCount} productos`}
          >
            🛒
            {cartCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-1 -right-1 text-xs h-5 w-5 flex items-center justify-center"
              >
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="sticky top-[56px] z-10 bg-white border-b border-gray-200 p-4 space-y-2">
        <label htmlFor="sku-input" className="block text-sm font-medium text-gray-700">
          Ingresa el código del producto
        </label>
        <Input
          id="sku-input"
          type="text"
          placeholder="Ej: PROD001"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          disabled={searchState.isLoading}
          autoFocus
        />
        {inputValue.length > 0 && inputValue.length < 3 && (
          <p className="text-xs text-gray-500">Ingresa al menos 3 caracteres</p>
        )}
      </div>

      {/* Results Area */}
      <main className="px-4 py-6 max-w-4xl mx-auto">
        {/* Loading State */}
        {searchState.isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {searchState.error && !searchState.isLoading && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-800 font-medium">Error en la búsqueda</p>
            <p className="text-error-600 text-sm mt-1">{searchState.error}</p>
          </div>
        )}

        {/* No Results */}
        {!searchState.isLoading &&
          !searchState.error &&
          searchState.results.length === 0 &&
          inputValue.length >= 3 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-600">No se encontraron productos con código &quot;{searchState.searchedSku}&quot;</p>
              <p className="text-gray-500 text-sm mt-2">Verifica el código e intenta nuevamente</p>
            </div>
          )}

        {/* Empty Initial State */}
        {!searchState.isLoading &&
          !searchState.error &&
          searchState.results.length === 0 &&
          inputValue.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-600">Ingresa un código de producto para empezar</p>
              <p className="text-gray-500 text-sm mt-2">Encontrarás los códigos en las etiquetas de los productos</p>
            </div>
          )}

        {/* Results Grid */}
        {!searchState.isLoading && searchState.results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Se encontraron {searchState.results.length} producto{searchState.results.length !== 1 ? 's' : ''}
            </p>
            {searchState.results.map((product) => (
              <Card
                key={product.id}
                interactive
                onClick={() => handleSelectProduct(product)}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image / Icon */}
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{product.name}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          Código: <span className="font-bold">{product.sku}</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-primary-600">{formatPrice(product.price)}</p>
                      </div>
                    </div>

                    {/* Product Details */}
                    {product.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                    )}

                    {/* Color Badge */}
                    {product.color && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-600">Color:</span>
                        <Badge variant="info" size="sm">
                          {product.color}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.product && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          {/* Modal Background */}
          <div
            className="absolute inset-0"
            onClick={() =>
              setConfirmDialog({
                isOpen: false,
                product: null,
                quantity: 1,
                selectedColor: '',
              })
            }
          />

          {/* Modal Content */}
          <Card className="relative w-full sm:max-w-md mx-4 sm:mx-0 rounded-t-2xl sm:rounded-xl">
            {/* Close Button */}
            <button
              onClick={() =>
                setConfirmDialog({
                  isOpen: false,
                  product: null,
                  quantity: 1,
                  selectedColor: '',
                })
              }
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="space-y-6">
              {/* Product Summary */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 pr-8">{confirmDialog.product.name}</h2>
                <p className="text-lg font-bold text-primary-600">{formatPrice(confirmDialog.product.price)}</p>
                {confirmDialog.product.description && (
                  <p className="text-sm text-gray-600 mt-2">{confirmDialog.product.description}</p>
                )}
              </div>

              {/* Color Selection */}
              {confirmDialog.product.color && (
                <div>
                  <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <select
                    id="color-select"
                    value={confirmDialog.selectedColor}
                    onChange={(e) =>
                      setConfirmDialog((prev) => ({
                        ...prev,
                        selectedColor: e.target.value,
                      }))
                    }
                    className={cn(
                      'w-full px-3 py-2 rounded-lg border text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500',
                      'bg-white border-gray-300'
                    )}
                  >
                    <option value="">-- Selecciona un color --</option>
                    <option value={confirmDialog.product.color}>{confirmDialog.product.color}</option>
                  </select>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setConfirmDialog((prev) => ({
                        ...prev,
                        quantity: Math.max(1, prev.quantity - 1),
                      }))
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    value={confirmDialog.quantity}
                    onChange={(e) =>
                      setConfirmDialog((prev) => ({
                        ...prev,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg border text-center font-semibold',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500',
                      'bg-white border-gray-300'
                    )}
                  />
                  <button
                    onClick={() =>
                      setConfirmDialog((prev) => ({
                        ...prev,
                        quantity: prev.quantity + 1,
                      }))
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(confirmDialog.product.price * confirmDialog.quantity)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={() => handleConfirmAdd('COMPRAR')}
                  className="bg-accent-500 hover:bg-accent-600"
                >
                  Agregar a Comprar
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  variant="secondary"
                  onClick={() => handleConfirmAdd('DESEADOS')}
                >
                  Agregar a Deseados
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  variant="ghost"
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: false,
                      product: null,
                      quantity: 1,
                      selectedColor: '',
                    })
                  }
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
