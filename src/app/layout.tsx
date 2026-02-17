/**
 * Root Layout
 * Base HTML structure for the entire application
 */

import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Market Store - Armá tu compra',
  description: 'Sistema de autogestión de pedidos en local - Compra fácil, rápido y seguro',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Market Store',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY">
      <body>
        {/* App shell */}
        <div id="app-root" className="bg-white min-h-screen">
          {children}
        </div>

        {/* Toast container portal target */}
        <div id="toast-container" />
      </body>
    </html>
  );
}
