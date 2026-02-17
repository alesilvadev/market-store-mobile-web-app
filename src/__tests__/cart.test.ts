import { describe, it, expect, beforeEach } from 'vitest';

// Mock cart state structure
interface CartItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  color?: string;
  listType: 'COMPRAR' | 'DESEADOS';
}

interface CartState {
  comprar: CartItem[];
  deseados: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  moveItem: (productId: string, from: 'COMPRAR' | 'DESEADOS', to: 'COMPRAR' | 'DESEADOS') => void;
  calculateTotal: () => { subtotal: number; tax: number; total: number };
  clear: () => void;
}

describe('Shopping Cart', () => {
  let cart: CartState;

  beforeEach(() => {
    // Initialize empty cart
    cart = {
      comprar: [],
      deseados: [],
      addItem: (item: CartItem) => {
        if (item.listType === 'COMPRAR') {
          const exists = cart.comprar.find((i) => i.productId === item.productId);
          if (exists) {
            exists.quantity += item.quantity;
          } else {
            cart.comprar.push(item);
          }
        } else {
          const exists = cart.deseados.find((i) => i.productId === item.productId);
          if (exists) {
            exists.quantity += item.quantity;
          } else {
            cart.deseados.push(item);
          }
        }
      },
      removeItem: (productId: string) => {
        cart.comprar = cart.comprar.filter((i) => i.productId !== productId);
        cart.deseados = cart.deseados.filter((i) => i.productId !== productId);
      },
      updateQuantity: (productId: string, quantity: number) => {
        const itemComprar = cart.comprar.find((i) => i.productId === productId);
        if (itemComprar && quantity > 0) {
          itemComprar.quantity = quantity;
        }
        const itemDeseados = cart.deseados.find((i) => i.productId === productId);
        if (itemDeseados && quantity > 0) {
          itemDeseados.quantity = quantity;
        }
      },
      moveItem: (productId: string, from: 'COMPRAR' | 'DESEADOS', to: 'COMPRAR' | 'DESEADOS') => {
        if (from === to) return;
        const fromList = from === 'COMPRAR' ? cart.comprar : cart.deseados;
        const toList = to === 'COMPRAR' ? cart.comprar : cart.deseados;
        const item = fromList.find((i) => i.productId === productId);
        if (item) {
          item.listType = to;
          fromList.splice(fromList.indexOf(item), 1);
          toList.push(item);
        }
      },
      calculateTotal: () => {
        const subtotal = [...cart.comprar, ...cart.deseados].reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
        const tax = subtotal * 0.21; // 21% IVA
        return { subtotal, tax, total: subtotal + tax };
      },
      clear: () => {
        cart.comprar = [];
        cart.deseados = [];
      },
    };
  });

  describe('Adding Items', () => {
    it('should add item to comprar list', () => {
      const item: CartItem = {
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Test Product',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      };

      cart.addItem(item);

      expect(cart.comprar).toHaveLength(1);
      expect(cart.comprar[0].productId).toBe('prod-1');
      expect(cart.comprar[0].quantity).toBe(2);
    });

    it('should add item to deseados list', () => {
      const item: CartItem = {
        productId: 'prod-2',
        sku: 'PROD-002',
        name: 'Wish Product',
        quantity: 1,
        unitPrice: 50,
        listType: 'DESEADOS',
      };

      cart.addItem(item);

      expect(cart.deseados).toHaveLength(1);
      expect(cart.deseados[0].productId).toBe('prod-2');
    });

    it('should accumulate quantity if item already exists', () => {
      const item: CartItem = {
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Test Product',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      };

      cart.addItem(item);
      cart.addItem({ ...item, quantity: 3 });

      expect(cart.comprar).toHaveLength(1);
      expect(cart.comprar[0].quantity).toBe(5);
    });

    it('should accept optional color attribute', () => {
      const item: CartItem = {
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Colored Product',
        quantity: 1,
        unitPrice: 75,
        color: 'red',
        listType: 'COMPRAR',
      };

      cart.addItem(item);

      expect(cart.comprar[0].color).toBe('red');
    });
  });

  describe('Removing Items', () => {
    beforeEach(() => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Test Product',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      });
      cart.addItem({
        productId: 'prod-2',
        sku: 'PROD-002',
        name: 'Another Product',
        quantity: 1,
        unitPrice: 50,
        listType: 'DESEADOS',
      });
    });

    it('should remove item from comprar list', () => {
      cart.removeItem('prod-1');

      expect(cart.comprar).toHaveLength(0);
      expect(cart.deseados).toHaveLength(1);
    });

    it('should remove item from deseados list', () => {
      cart.removeItem('prod-2');

      expect(cart.comprar).toHaveLength(1);
      expect(cart.deseados).toHaveLength(0);
    });

    it('should handle removing non-existent item', () => {
      cart.removeItem('non-existent');

      expect(cart.comprar).toHaveLength(1);
      expect(cart.deseados).toHaveLength(1);
    });
  });

  describe('Updating Quantities', () => {
    beforeEach(() => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Test Product',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      });
    });

    it('should update quantity to valid number', () => {
      cart.updateQuantity('prod-1', 5);

      expect(cart.comprar[0].quantity).toBe(5);
    });

    it('should reject zero quantity', () => {
      cart.updateQuantity('prod-1', 0);

      // Quantity should not be updated
      expect(cart.comprar[0].quantity).toBe(2);
    });

    it('should reject negative quantity', () => {
      cart.updateQuantity('prod-1', -5);

      expect(cart.comprar[0].quantity).toBe(2);
    });

    it('should handle large quantities', () => {
      cart.updateQuantity('prod-1', 9999);

      expect(cart.comprar[0].quantity).toBe(9999);
    });
  });

  describe('Moving Items Between Lists', () => {
    beforeEach(() => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Test Product',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      });
    });

    it('should move item from comprar to deseados', () => {
      cart.moveItem('prod-1', 'COMPRAR', 'DESEADOS');

      expect(cart.comprar).toHaveLength(0);
      expect(cart.deseados).toHaveLength(1);
      expect(cart.deseados[0].listType).toBe('DESEADOS');
    });

    it('should move item from deseados to comprar', () => {
      cart.moveItem('prod-1', 'COMPRAR', 'DESEADOS');
      cart.moveItem('prod-1', 'DESEADOS', 'COMPRAR');

      expect(cart.comprar).toHaveLength(1);
      expect(cart.deseados).toHaveLength(0);
      expect(cart.comprar[0].listType).toBe('COMPRAR');
    });

    it('should not move if source and destination are same', () => {
      const originalComprar = [...cart.comprar];

      cart.moveItem('prod-1', 'COMPRAR', 'COMPRAR');

      expect(cart.comprar).toEqual(originalComprar);
    });

    it('should preserve quantity when moving', () => {
      const originalQty = cart.comprar[0].quantity;

      cart.moveItem('prod-1', 'COMPRAR', 'DESEADOS');

      expect(cart.deseados[0].quantity).toBe(originalQty);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct subtotal', () => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product 1',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      });
      cart.addItem({
        productId: 'prod-2',
        sku: 'PROD-002',
        name: 'Product 2',
        quantity: 3,
        unitPrice: 50,
        listType: 'COMPRAR',
      });

      const { subtotal } = cart.calculateTotal();

      expect(subtotal).toBe(350); // (2*100) + (3*50)
    });

    it('should calculate 21% tax correctly', () => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product 1',
        quantity: 1,
        unitPrice: 100,
        listType: 'COMPRAR',
      });

      const { tax } = cart.calculateTotal();

      expect(tax).toBe(21); // 100 * 0.21
    });

    it('should calculate correct total with tax', () => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product 1',
        quantity: 1,
        unitPrice: 100,
        listType: 'COMPRAR',
      });

      const { total } = cart.calculateTotal();

      expect(total).toBe(121); // 100 + 21
    });

    it('should include both lists in total', () => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product 1',
        quantity: 1,
        unitPrice: 100,
        listType: 'COMPRAR',
      });
      cart.addItem({
        productId: 'prod-2',
        sku: 'PROD-002',
        name: 'Product 2',
        quantity: 1,
        unitPrice: 100,
        listType: 'DESEADOS',
      });

      const { subtotal } = cart.calculateTotal();

      expect(subtotal).toBe(200);
    });

    it('should handle zero-price items', () => {
      cart.addItem({
        productId: 'free-item',
        sku: 'FREE-001',
        name: 'Free Item',
        quantity: 1,
        unitPrice: 0,
        listType: 'COMPRAR',
      });

      const { subtotal, tax, total } = cart.calculateTotal();

      expect(subtotal).toBe(0);
      expect(tax).toBe(0);
      expect(total).toBe(0);
    });

    it('should handle decimal prices', () => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product',
        quantity: 1,
        unitPrice: 99.99,
        listType: 'COMPRAR',
      });

      const { subtotal } = cart.calculateTotal();

      expect(Math.round(subtotal * 100) / 100).toBe(99.99);
    });
  });

  describe('Clear Cart', () => {
    beforeEach(() => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product 1',
        quantity: 2,
        unitPrice: 100,
        listType: 'COMPRAR',
      });
      cart.addItem({
        productId: 'prod-2',
        sku: 'PROD-002',
        name: 'Product 2',
        quantity: 1,
        unitPrice: 50,
        listType: 'DESEADOS',
      });
    });

    it('should clear all items from cart', () => {
      cart.clear();

      expect(cart.comprar).toHaveLength(0);
      expect(cart.deseados).toHaveLength(0);
    });

    it('should reset total to zero after clear', () => {
      cart.clear();

      const { subtotal, tax, total } = cart.calculateTotal();

      expect(subtotal).toBe(0);
      expect(tax).toBe(0);
      expect(total).toBe(0);
    });
  });

  describe('Cart Persistence', () => {
    it('should be serializable to JSON', () => {
      cart.addItem({
        productId: 'prod-1',
        sku: 'PROD-001',
        name: 'Product',
        quantity: 2,
        unitPrice: 100,
        color: 'red',
        listType: 'COMPRAR',
      });

      const json = JSON.stringify(cart.comprar);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].productId).toBe('prod-1');
    });

    it('should be deserializable from JSON', () => {
      const json = JSON.stringify([
        {
          productId: 'prod-1',
          sku: 'PROD-001',
          name: 'Product',
          quantity: 2,
          unitPrice: 100,
          listType: 'COMPRAR',
        },
      ]);

      const restored = JSON.parse(json) as CartItem[];

      expect(restored).toHaveLength(1);
      expect(restored[0].quantity).toBe(2);
    });
  });
});
