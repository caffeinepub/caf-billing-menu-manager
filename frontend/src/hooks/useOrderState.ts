import { useState, useCallback } from "react";
import type { MenuItem } from "../backend";
import type { OrderItem } from "./useQueries";

export interface ActiveOrderItem {
  menuItemId: bigint;
  name: string;
  quantity: bigint;
  price: bigint;
}

export type DiscountType = "flat" | "percentage";

export interface UseOrderStateReturn {
  items: ActiveOrderItem[];
  discountType: DiscountType;
  discountValue: number;
  subtotal: bigint;
  discountAmount: bigint;
  total: bigint;
  addItem: (item: MenuItem) => void;
  updateQuantity: (menuItemId: bigint, quantity: number) => void;
  removeItem: (menuItemId: bigint) => void;
  setDiscountType: (type: DiscountType) => void;
  setDiscountValue: (value: number) => void;
  clearOrder: () => void;
  getOrderItems: () => OrderItem[];
  getDiscountBigInt: () => bigint;
}

function calcTotals(
  items: ActiveOrderItem[],
  discountType: DiscountType,
  discountValue: number
): { subtotal: bigint; discountAmount: bigint; total: bigint } {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    BigInt(0)
  );

  let discountAmount: bigint;
  if (discountType === "flat") {
    const flat = BigInt(Math.max(0, Math.floor(discountValue)));
    discountAmount = flat > subtotal ? subtotal : flat;
  } else {
    const pct = Math.min(100, Math.max(0, discountValue));
    discountAmount = BigInt(Math.floor((Number(subtotal) * pct) / 100));
  }

  const total = subtotal - discountAmount;
  return { subtotal, discountAmount, total };
}

export function useOrderState(): UseOrderStateReturn {
  const [items, setItems] = useState<ActiveOrderItem[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>("flat");
  const [discountValue, setDiscountValue] = useState<number>(0);

  const { subtotal, discountAmount, total } = calcTotals(items, discountType, discountValue);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem.id
            ? { ...i, quantity: i.quantity + BigInt(1) }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: BigInt(1),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity: BigInt(quantity) } : i
        )
      );
    }
  }, []);

  const removeItem = useCallback((menuItemId: bigint) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setDiscountType("flat");
    setDiscountValue(0);
  }, []);

  const getOrderItems = useCallback((): OrderItem[] => {
    return items.map((i) => ({
      menuItemId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    }));
  }, [items]);

  const getDiscountBigInt = useCallback((): bigint => {
    return discountAmount;
  }, [discountAmount]);

  return {
    items,
    discountType,
    discountValue,
    subtotal,
    discountAmount,
    total,
    addItem,
    updateQuantity,
    removeItem,
    setDiscountType,
    setDiscountValue,
    clearOrder,
    getOrderItems,
    getDiscountBigInt,
  };
}
