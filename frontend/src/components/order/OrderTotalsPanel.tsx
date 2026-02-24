import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import type { DiscountType } from '../../hooks/useOrderState';

interface OrderTotalsPanelProps {
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  total: number;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (value: number) => void;
}

export default function OrderTotalsPanel({
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  total,
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

      {/* Discount */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Discount</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDiscountTypeChange('flat')}
              className={`h-7 px-2 text-xs rounded-l-md border transition-colors ${
                discountType === 'flat'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground'
              }`}
            >
              ₹
            </button>
            <button
              type="button"
              onClick={() => onDiscountTypeChange('percentage')}
              className={`h-7 px-2 text-xs rounded-r-md border-t border-r border-b transition-colors ${
                discountType === 'percentage'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground'
              }`}
            >
              %
            </button>
            <Input
              type="number"
              min="0"
              value={discountValue || ''}
              onChange={e => onDiscountValueChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-16 h-7 text-xs text-center px-1"
            />
          </div>
        </div>
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          {discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : formatCurrency(0)}
        </span>
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="font-display font-bold text-base text-foreground">Total</span>
        <span className="font-display font-bold text-xl text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
