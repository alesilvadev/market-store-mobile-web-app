/**
 * Customer App Layout
 * Layout for all customer-facing pages (shopping, cart, checkout)
 */

'use client';

import React from 'react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Customer-specific header/navigation can go here */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
