import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ActiveOrderItem } from "@/hooks/useOrderState";

interface OrderItemRowProps {
  item: ActiveOrderItem;
  onIncrement: (menuItemId: bigint) => void;
  onDecrement: (menuItemId: bigint) => void;
  onRemove: (menuItemId: bigint) => void;
}

export default function OrderItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: OrderItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onDecrement(item.menuItemId)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm font-semibold">
          {Number(item.quantity)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onIncrement(item.menuItemId)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <span className="text-sm font-semibold text-foreground w-16 text-right shrink-0">
        {formatCurrency(lineTotal)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
        onClick={() => onRemove(item.menuItemId)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
