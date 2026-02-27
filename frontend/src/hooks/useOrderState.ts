import { useState, useCallback } from 'react';
import { OrderItem } from './useQueries';

export interface ActiveOrderItem {
  menuItemId: bigint;
  name: string;
  quantity: bigint;
  price: bigint;
}

interface OrderState {
  items: ActiveOrderItem[];
  discount: bigint;
}

interface UseOrderStateReturn {
  items: ActiveOrderItem[];
  discount: bigint;
  subtotal: bigint;
  total: bigint;
  addItem: (item: { id: bigint; name: string; price: bigint }) => void;
  updateQuantity: (menuItemId: bigint, quantity: number) => void;
  removeItem: (menuItemId: bigint) => void;
  setDiscount: (amount: bigint) => void;
  clearOrder: () => void;
  toOrderItems: () => OrderItem[];
}

export function useOrderState(): UseOrderStateReturn {
  const [state, setState] = useState<OrderState>({
    items: [],
    discount: BigInt(0),
  });

  const addItem = useCallback((item: { id: bigint; name: string; price: bigint }) => {
    setState(prev => {
      const existing = prev.items.find(i => i.menuItemId === item.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map(i =>
            i.menuItemId === item.id
              ? { ...i, quantity: i.quantity + BigInt(1) }
              : i
          ),
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            menuItemId: item.id,
            name: item.name,
            quantity: BigInt(1),
            price: item.price,
          },
        ],
      };
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: bigint, quantity: number) => {
    setState(prev => {
      if (quantity <= 0) {
        return {
          ...prev,
          items: prev.items.filter(i => i.menuItemId !== menuItemId),
        };
      }
      return {
        ...prev,
        items: prev.items.map(i =>
          i.menuItemId === menuItemId
            ? { ...i, quantity: BigInt(quantity) }
            : i
        ),
      };
    });
  }, []);

  const removeItem = useCallback((menuItemId: bigint) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.menuItemId !== menuItemId),
    }));
  }, []);

  const setDiscount = useCallback((amount: bigint) => {
    setState(prev => ({
      ...prev,
      discount: amount < BigInt(0) ? BigInt(0) : amount,
    }));
  }, []);

  const clearOrder = useCallback(() => {
    setState({ items: [], discount: BigInt(0) });
  }, []);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    BigInt(0)
  );

  const total = subtotal - state.discount > BigInt(0)
    ? subtotal - state.discount
    : BigInt(0);

  const toOrderItems = useCallback((): OrderItem[] => {
    return state.items.map(item => ({
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
  }, [state.items]);

  return {
    items: state.items,
    discount: state.discount,
    subtotal,
    total,
    addItem,
    updateQuantity,
    removeItem,
    setDiscount,
    clearOrder,
    toOrderItems,
  };
}
