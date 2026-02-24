import { Minus, Plus, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { ActiveOrderItem } from '../../hooks/useOrderState';

interface OrderItemRowProps {
  item: ActiveOrderItem;
  onQuantityChange: (id: bigint, qty: number) => void;
  onRemove: (id: bigint) => void;
}

export default function OrderItemRow({ item, onQuantityChange, onRemove }: OrderItemRowProps) {
  const lineTotal = Number(item.price) * item.quantity;

  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">₹{Number(item.price).toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onQuantityChange(item.menuItemId, item.quantity - 1)}
          className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={12} strokeWidth={2.5} />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.menuItemId, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>

      <span className="text-sm font-semibold text-foreground w-16 text-right shrink-0">
        {formatCurrency(lineTotal)}
      </span>

      <button
        onClick={() => onRemove(item.menuItemId)}
        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
        aria-label="Remove item"
      >
        <X size={14} />
      </button>
    </div>
  );
}
