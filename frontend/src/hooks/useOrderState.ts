import { useState, useCallback, useMemo } from 'react';
import type { MenuItem } from '../backend';

export interface ActiveOrderItem {
  menuItemId: bigint;
  name: string;
  price: bigint;
  quantity: number;
}

export type DiscountType = 'flat' | 'percentage';

export function useOrderState() {
  const [items, setItems] = useState<ActiveOrderItem[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>('flat');
  const [discountValue, setDiscountValue] = useState<number>(0);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.menuItemId === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      }];
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.menuItemId !== menuItemId));
    } else {
      setItems(prev =>
        prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity } : i)
      );
    }
  }, []);

  const removeItem = useCallback((menuItemId: bigint) => {
    setItems(prev => prev.filter(i => i.menuItemId !== menuItemId));
  }, []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setDiscountValue(0);
    setDiscountType('flat');
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (discountType === 'flat') {
      return Math.min(discountValue, subtotal);
    } else {
      return Math.round((subtotal * discountValue) / 100);
    }
  }, [discountType, discountValue, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  return {
    items,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    addItem,
    updateQuantity,
    removeItem,
    clearOrder,
    subtotal,
    discountAmount,
    total,
  };
}
