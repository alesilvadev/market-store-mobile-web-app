/**
 * Order Code Content Component
 * Client-side component for order code display
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function OrderCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [copied, setCopied] = useState(false);

  // Redirect if no code
  useEffect(() => {
    if (!code) {
      router.push('/');
    }
  }, [code, router]);

  if (!code) {
    return null;
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 to-primary-50 flex flex-col items-center justify-between px-4 py-8">
      {/* Success Icon */}
      <div className="text-6xl mt-8">✓</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-sm mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900">¡Pedido Creado!</h1>

        <p className="text-gray-600">
          Tu pedido está listo. Presenta el código en caja para completar tu compra.
        </p>

        {/* Order Code Display */}
        <Card className="border-2 border-success-400 bg-white w-full">
          <CardTitle className="text-success-700">Tu Código de Pedido</CardTitle>
          <CardContent className="mt-4">
            <div className="space-y-4">
              {/* Code */}
              <div className="bg-gray-900 text-white rounded-lg p-6 text-center">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Código</p>
                <p
                  className="text-5xl font-mono font-bold tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleCopyCode}
                  role="button"
                  aria-label={`Código de pedido: ${code}`}
                >
                  {code}
                </p>
              </div>

              {/* Copy Button */}
              <Button
                fullWidth
                variant={copied ? 'secondary' : 'primary'}
                onClick={handleCopyCode}
              >
                {copied ? '✓ Copiado' : '📋 Copiar Código'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-primary-50 border-primary-200 w-full">
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">1️⃣</span>
                <p className="text-sm text-gray-900">
                  <span className="font-bold">Guarda o copia</span> tu código
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">2️⃣</span>
                <p className="text-sm text-gray-900">
                  <span className="font-bold">Dirígete a caja</span> con tu código
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">3️⃣</span>
                <p className="text-sm text-gray-900">
                  El cajero <span className="font-bold">verifica y cobra</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Badge */}
        <Badge variant="info" className="px-3 py-2">
          ⏱️ Válido por 24 horas
        </Badge>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={() => router.push('/search')}
        >
          Seguir Comprando
        </Button>

        <Button
          fullWidth
          size="lg"
          variant="ghost"
          onClick={() => router.push('/')}
        >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}
