import { formatCurrency } from "@/lib/utils";
import type { DiscountType } from "@/hooks/useOrderState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrderTotalsPanelProps {
  subtotal: bigint;
  discountAmount: bigint;
  total: bigint;
  discountType: DiscountType;
  discountValue: number;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (value: number) => void;
}

export default function OrderTotalsPanel({
  subtotal,
  discountAmount,
  total,
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
}: OrderTotalsPanelProps) {
  return (
    <div className="space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount controls */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant={discountType === "flat" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => onDiscountTypeChange("flat")}
          >
            Flat (₹)
          </Button>
          <Button
            variant={discountType === "percentage" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => onDiscountTypeChange("percentage")}
          >
            Percent (%)
          </Button>
        </div>
        <Input
          type="number"
          min={0}
          max={discountType === "percentage" ? 100 : undefined}
          value={discountValue === 0 ? "" : discountValue}
          placeholder={discountType === "flat" ? "Discount amount (₹)" : "Discount %"}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onDiscountValueChange(isNaN(val) ? 0 : val);
          }}
          className="h-8 text-sm"
        />
      </div>

      {/* Discount row */}
      {discountAmount > BigInt(0) && (
        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
          <span>Discount</span>
          <span>- {formatCurrency(discountAmount)}</span>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-border pt-2">
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
