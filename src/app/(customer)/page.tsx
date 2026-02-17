/**
 * Welcome Page
 * Landing page after QR scan - introduces app and directs to shopping
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const benefits = [
  {
    id: 1,
    title: 'Sin filas',
    icon: '⏱️',
    description: 'Arma tu compra mientras recorres el local',
  },
  {
    id: 2,
    title: 'Rápido',
    icon: '⚡',
    description: 'Pago ágil en caja sin reingresar datos',
  },
  {
    id: 3,
    title: 'Seguro',
    icon: '✓',
    description: 'Confirma cada producto antes de pagar',
  },
];

export default function WelcomePage() {
  const router = useRouter();

  const handleStartShopping = () => {
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-between px-4 py-8">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-lg font-bold text-primary-600">Market Store</h1>
        <button
          className="p-2 hover:bg-white rounded-lg transition-colors"
          aria-label="Cerrar"
          onClick={() => window.history.back()}
        >
          ✕
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-sm mx-auto">
        {/* Logo */}
        <div className="text-6xl">🛒</div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Armá tu compra</h2>
          <p className="text-base text-gray-600">
            Busca productos por código, confirma cantidad y paga en caja. Es así de simple.
          </p>
        </div>

        {/* Benefits */}
        <div className="w-full space-y-3 my-4">
          {benefits.map((benefit) => (
            <Card
              key={benefit.id}
              interactive={false}
              className="border-primary-200 bg-white/50 backdrop-blur"
            >
              <div className="flex gap-3">
                <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-sm space-y-4">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={handleStartShopping}
          className="bg-accent-500 hover:bg-accent-600"
        >
          Empezar a Comprar
        </Button>

        <div className="text-center">
          <button
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            onClick={() => router.push('/login')}
          >
            ¿Ya tienes cuenta? Inicia sesión para obtener descuentos
          </button>
        </div>
      </div>
    </div>
  );
}
