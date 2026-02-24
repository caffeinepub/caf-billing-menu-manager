import { formatCurrency, formatDateTime } from '@/lib/utils';
import BillItemsTable from './BillItemsTable';
import type { ActiveOrderItem, DiscountType } from '../../hooks/useOrderState';

interface BillLayoutProps {
  items: ActiveOrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  total: number;
  timestamp: bigint;
  orderNumber?: number;
}

export default function BillLayout({
  items,
  subtotal,
  taxRate,
  taxAmount,
  discountType,
  discountValue,
  discountAmount,
  total,
  timestamp,
  orderNumber,
}: BillLayoutProps) {
  return (
    <div className="bill-print-area font-mono text-xs text-black bg-white p-4 max-w-[320px] mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          <img
            src="/assets/generated/cafe-logo.png"
            alt="Simple Sips Cafe Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="font-bold text-base tracking-wide">Simple Sips Cafe</h2>
        <p className="text-[10px] text-gray-500 mt-0.5">ESTD 2026 · Billing Receipt</p>
        <div className="border-t border-dashed border-gray-400 mt-2 pt-2">
          <p className="text-[10px]">{formatDateTime(timestamp)}</p>
          {orderNumber !== undefined && (
            <p className="text-[10px]">Order #{orderNumber}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <BillItemsTable items={items} />

      {/* Totals */}
      <div className="mt-3 space-y-1 border-t border-dashed border-gray-400 pt-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({taxRate}%)</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'flat'})</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm border-t border-dashed border-gray-400 pt-1 mt-1">
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 pt-2 border-t border-dashed border-gray-400">
        <p className="text-[10px] text-gray-600">Thank you for visiting Simple Sips Cafe!</p>
        <p className="text-[10px] text-gray-600">Please come again ☕</p>
      </div>
    </div>
  );
}
