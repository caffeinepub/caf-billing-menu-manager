import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface OrderTotalsPanelProps {
  subtotal: bigint;
  discount: bigint;
  total: bigint;
  onDiscountChange: (amount: bigint) => void;
}

export default function OrderTotalsPanel({
  subtotal,
  discount,
  total,
  onDiscountChange,
}: OrderTotalsPanelProps) {
  const discountDisplay = discount > BigInt(0) ? (Number(discount) / 100).toFixed(2) : '';

  const handleDiscountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '0') {
      onDiscountChange(BigInt(0));
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      onDiscountChange(BigInt(Math.round(parsed * 100)));
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-latte/30">
      {/* Subtotal */}
      <div className="flex justify-between text-sm text-espresso/70">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-espresso/70 shrink-0">Discount (₹)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={discountDisplay}
          onChange={handleDiscountInput}
          placeholder="0.00"
          className="w-28 text-right text-sm border border-latte/40 rounded-md px-2 py-1 bg-cream focus:outline-none focus:ring-1 focus:ring-amber-warm text-espresso"
        />
      </div>

      {/* Total */}
      <div className="flex justify-between font-bold text-base text-espresso border-t border-latte/30 pt-2">
        <span>Total</span>
        <span className="text-amber-warm">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
