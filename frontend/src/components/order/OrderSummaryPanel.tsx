import { ShoppingCart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import OrderItemRow from './OrderItemRow';
import type { ActiveOrderItem } from '../../hooks/useOrderState';

interface OrderSummaryPanelProps {
  items: ActiveOrderItem[];
  onQuantityChange: (id: bigint, qty: number) => void;
  onRemove: (id: bigint) => void;
}

export default function OrderSummaryPanel({ items, onQuantityChange, onRemove }: OrderSummaryPanelProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <ShoppingCart size={22} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No items yet</p>
        <p className="text-xs text-muted-foreground mt-1">Tap items from the menu to add</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-52">
      <div className="px-1">
        {items.map(item => (
          <OrderItemRow
            key={item.menuItemId.toString()}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
