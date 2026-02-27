import { formatCurrency, formatDateTime } from "@/lib/utils";
import BillItemsTable from "./BillItemsTable";
import type { ActiveOrderItem } from "@/hooks/useOrderState";

interface BillLayoutProps {
  orderId: bigint;
  items: ActiveOrderItem[];
  subtotal: bigint;
  discountAmount: bigint;
  total: bigint;
  timestamp: bigint;
}

export default function BillLayout({
  orderId,
  items,
  subtotal,
  discountAmount,
  total,
  timestamp,
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
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <h2 className="font-bold text-base tracking-wide">Simple Sips Cafe</h2>
        <p className="text-[10px] text-gray-500 mt-0.5">ESTD 2026 · Billing Receipt</p>
        <div className="border-t border-dashed border-gray-400 mt-2 pt-2">
          <p className="text-[10px]">{formatDateTime(timestamp)}</p>
          <p className="text-[10px]">Bill #{orderId.toString()}</p>
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
        {discountAmount > BigInt(0) && (
          <div className="flex justify-between">
            <span>Discount</span>
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
