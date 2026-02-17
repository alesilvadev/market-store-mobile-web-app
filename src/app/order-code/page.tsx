/**
 * Order Code Display Page
 * Shows order confirmation with unique code to present at checkout
 */

import { Suspense } from 'react';
import OrderCodeContent from './OrderCodeContent';

export default function OrderCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderCodeContent />
    </Suspense>
  );
}
