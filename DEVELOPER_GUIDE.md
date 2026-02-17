# Market Store Mobile Web App - Developer Guide

## Quick Start

### Installation
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure backend API URL (required)
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Development
```bash
# Start dev server (port 3001)
npm run dev

# Open browser: http://localhost:3001
```

### Verification
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (customer)/
│   │   ├── page.tsx              # Welcome page
│   │   ├── layout.tsx            # Customer layout with header
│   │   ├── search/page.tsx       # Product search
│   │   ├── cart/page.tsx         # Shopping cart (2 lists)
│   │   └── checkout/page.tsx     # Order creation
│   ├── order-code/
│   │   ├── page.tsx              # Order confirmation
│   │   └── OrderCodeContent.tsx  # Client component
│   └── layout.tsx                # Root layout
│
├── components/
│   └── ui/                       # Design system components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Badge.tsx
│
├── hooks/
│   └── useCart.ts               # Cart state (Zustand + localStorage)
│
├── services/
│   └── api/
│       ├── products.ts          # Product API calls
│       ├── orders.ts            # Order API calls
│       └── auth.ts              # Auth API calls
│
├── lib/
│   ├── api.ts                   # HTTP client with error handling
│   └── cn.ts                    # Class name utility
│
├── types/
│   └── index.ts                 # TypeScript type definitions
│
└── styles/
    └── globals.css              # Design tokens + global styles
```

---

## 🏗️ Architecture

### State Management

**Local Component State**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Global Cart State (Zustand)**
```typescript
import { useCart } from '@/hooks/useCart';

const cart = useCart();
cart.addItem(item, 'COMPRAR');      // Add to cart
const total = cart.getTotal();       // Get total with tax
cart.moveItem(id, 'COMPRAR', 'DESEADOS');  // Move to wishlist
```

**Cart Persistence**
- Automatically persisted to localStorage
- Restored on page load
- Key: `market-store-cart`

### API Client

**Centralized HTTP client with:**
- Error handling
- JWT token injection
- Consistent response parsing

**Usage:**
```typescript
import { productService } from '@/services/api/products';
import { orderService } from '@/services/api/orders';

// Search products
const results = await productService.searchBySku('CODE123');

// Create order
const order = await orderService.create({
  items: [{ productId, sku, quantity, color }],
  notes: 'Optional notes'
});

// Error handling
try {
  const result = await productService.searchBySku('CODE');
} catch (err) {
  const error = err as ApiError;
  console.error(error.message);
}
```

---

## 🎨 Design System Usage

### Colors
```typescript
// Primary actions
className="bg-primary-600 hover:bg-primary-700"

// CTA buttons
className="bg-accent-500 hover:bg-accent-600"

// Status colors
className="text-success-600"  // Success
className="text-error-600"    // Error
className="text-warning-600"  // Warning
className="text-info-600"     // Info
```

### Typography
```typescript
// Large heading
<h1 className="text-3xl font-bold">Title</h1>

// Medium heading
<h2 className="text-2xl font-semibold">Heading</h2>

// Body text (default)
<p className="text-base text-gray-700">Text</p>

// Small text
<p className="text-sm text-gray-600">Small</p>

// Captions
<p className="text-xs text-gray-500">Caption</p>
```

### Spacing (8px grid)
```typescript
// Padding
className="p-4"     // 16px all sides
className="px-4"    // 16px horizontal
className="py-6"    // 24px vertical
className="pt-8"    // 32px top

// Gaps
className="gap-2"   // 8px gap
className="gap-4"   // 16px gap
className="gap-6"   // 24px gap

// Margins
className="m-4"     // 16px all sides
className="mb-6"    // 24px bottom
className="mt-8"    // 32px top
```

### Components
```typescript
// Button
<Button variant="primary" size="lg" fullWidth>
  Click me
</Button>

// Input
<Input type="text" placeholder="Enter..." disabled />

// Card
<Card interactive className="p-6">
  Content here
</Card>

// Badge
<Badge variant="success" size="sm">
  Status
</Badge>
```

---

## 🛣️ Page Implementation Guide

### Structure Template
```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/api/products';
import { ApiError } from '@/types';

export default function YourPage() {
  const router = useRouter();
  const cart = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Your logic here
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        {/* Header content */}
      </header>

      {/* Main content */}
      <main className="px-4 py-6 max-w-4xl mx-auto">
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
            <p className="text-error-800">{error}</p>
          </div>
        )}

        {/* Your content */}
      </main>
    </div>
  );
}
```

---

## 🔄 User Flow Implementation

### Search Flow
```
1. User enters SKU code
2. Debounce 300ms, then search
3. Display results or error
4. User clicks product
5. Modal opens with quantity/color selection
6. User chooses "Comprar" or "Deseados"
7. Item added to cart
8. Toast/feedback (console for now)
9. Modal closes, input cleared
```

### Cart Management Flow
```
1. Tab between "Comprar" and "Deseados"
2. Adjust quantities (buttons or input)
3. Move items between lists
4. Delete items (with confirmation)
5. View totals (Comprar tab only)
6. Checkout button visible (Comprar with items)
```

### Checkout Flow
```
1. Review order summary
2. Select payment method
3. Add optional notes
4. Accept terms (checkbox)
5. Click "Crear Orden"
6. API creates order (loading state shown)
7. Success: Clear cart, redirect to order code page
8. Error: Show error message, allow retry
```

---

## ✅ Best Practices

### Error Handling
```typescript
try {
  const result = await apiCall();
} catch (err) {
  const error = err as ApiError;

  // Show user-friendly message
  setError(error.message);

  // Log for debugging
  console.error('API Error:', {
    message: error.message,
    status: error.statusCode,
    details: error.details
  });
}
```

### Loading States
```typescript
// Show spinner
{isLoading && (
  <div className="text-center py-8">
    <div className="animate-spin text-4xl">⏳</div>
    <p className="text-gray-600 mt-4">Cargando...</p>
  </div>
)}

// Or disable button
<Button isLoading={isLoading}>
  {isLoading ? 'Procesando...' : 'Enviar'}
</Button>
```

### Empty States
```typescript
{items.length === 0 && (
  <div className="text-center py-12">
    <div className="text-5xl mb-4">📭</div>
    <p className="text-gray-600 font-medium">No hay items</p>
    <p className="text-gray-500 text-sm mt-2">Agrega productos para continuar</p>
    <Button size="lg" onClick={() => router.push('/search')} className="mt-6">
      Buscar Productos
    </Button>
  </div>
)}
```

### Responsive Layout
```typescript
// Mobile-first approach
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  {/* Items */}
</div>

// Or stack
<div className="flex flex-col gap-4 sm:flex-row">
  {/* Items */}
</div>
```

### Accessibility
```typescript
// Always use semantic HTML
<button className="...">Click</button>  // ✅ Good
<div onClick={}>Click</div>             // ❌ Bad

// Label form inputs
<label htmlFor="input-id">Label</label>
<input id="input-id" />

// ARIA labels for icon buttons
<button aria-label="Close dialog">✕</button>

// Link error messages to inputs
<input aria-describedby="error-msg" />
<p id="error-msg" className="text-error-600">Error</p>
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

**For Each Page:**
- [ ] Renders without errors
- [ ] All buttons clickable
- [ ] Inputs accept text
- [ ] Loading states appear
- [ ] Error handling works
- [ ] Mobile responsive (320px)
- [ ] Tablet responsive (640px)
- [ ] Desktop responsive (1024px)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Color contrast sufficient

**Specific Tests:**

Search Page:
- [ ] Empty state shows initially
- [ ] Search debounces (wait 300ms)
- [ ] Results display correctly
- [ ] "No results" message shows
- [ ] Modal opens on product click
- [ ] Quantity can be adjusted
- [ ] Color can be selected
- [ ] Both add buttons work
- [ ] Modal closes on cancel
- [ ] Cart count updates

Cart Page:
- [ ] Empty states show correctly
- [ ] Tabs switch content
- [ ] Quantities adjust correctly
- [ ] Items can be moved to other list
- [ ] Items can be deleted
- [ ] Totals calculate correctly
- [ ] Tax shows 21%
- [ ] Buttons navigate correctly

Checkout Page:
- [ ] Order summary shows all items
- [ ] Prices match cart
- [ ] Payment method can be selected
- [ ] Notes can be entered
- [ ] Terms checkbox required
- [ ] Order creates successfully
- [ ] Redirect works
- [ ] Error handling works

### Performance Testing
```bash
# Lighthouse audit
npm run build
npm start
# Then use Chrome DevTools → Lighthouse
```

**Target Metrics:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Lighthouse Score: > 90

---

## 🐛 Debugging Tips

### Check Cart State
```typescript
// In browser console
import { useCart } from '@/hooks/useCart';
const cart = useCart.getState();
console.log(cart);
```

### Check API Calls
```typescript
// Network tab shows requests
// Check headers for Authorization: Bearer {token}
// Check response format
```

### Check Store
```typescript
// In browser console
localStorage.getItem('market-store-cart');
localStorage.getItem('auth_token');
```

### Clear Cache
```bash
# Delete Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## 📦 Dependencies

**Core:**
- `next@14.2.35` - Framework
- `react@18.3.1` - UI library
- `typescript@5` - Type safety
- `tailwindcss@3.4.1` - Styling

**State & API:**
- `zustand@4.4.7` - State management
- `axios@1.6.2` - HTTP client

**Build & Dev:**
- `eslint@8.56.0` - Linting
- `prettier@3.1.1` - Formatting (if configured)

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repository
# Vercel auto-deploys on push

# Or manual deploy
npm i -g vercel
vercel deploy
```

### Environment Variables
```env
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_TAX_RATE=0.21
NEXT_PUBLIC_CURRENCY=ARS

# Production (.env.production)
NEXT_PUBLIC_API_URL=https://api.marketstore.com/api
```

### Build Optimization
- Next.js auto-optimizes with code splitting
- CSS minified by Tailwind
- JS tree-shaken by esbuild
- Images optimized by Next.js Image
- Static pages pre-rendered

---

## 📚 Additional Resources

- **Design System:** `/tmp/market-store-design/design/`
- **Backend API:** `../backend-api/API_ENDPOINTS.md`
- **Type Definitions:** `src/types/index.ts`
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zustand:** https://github.com/pmndrs/zustand

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Strict mode enforcement
# Ensure all variables have types
```

### API Not Working
```
1. Check NEXT_PUBLIC_API_URL is set
2. Verify backend is running
3. Check CORS headers from backend
4. Check network tab for 401/403 errors
5. Verify auth token in localStorage
```

### Cart Not Persisting
```
1. Check localStorage is enabled
2. Clear browser cache
3. Check browser console for errors
4. Verify localStorage key: 'market-store-cart'
```

### Styling Issues
```bash
# Rebuild Tailwind cache
npm run build

# Check class names are correct
# Use DevTools Inspector to verify applied styles
```

---

## 📞 Support

- **Issues:** Check browser console for errors
- **API Issues:** Check `/order-code` page for error details
- **Design Questions:** See `/tmp/market-store-design/`
- **Backend Questions:** See `../backend-api/`

---

**Happy coding! 🚀**

For questions, refer to inline code comments or the design specification documents.
