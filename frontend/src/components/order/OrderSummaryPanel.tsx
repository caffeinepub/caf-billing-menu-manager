import OrderItemRow from "./OrderItemRow";
import type { ActiveOrderItem } from "@/hooks/useOrderState";

interface OrderSummaryPanelProps {
  items: ActiveOrderItem[];
  onIncrement: (menuItemId: bigint) => void;
  onDecrement: (menuItemId: bigint) => void;
  onRemove: (menuItemId: bigint) => void;
}

export default function OrderSummaryPanel({
  items,
  onIncrement,
  onDecrement,
  onRemove,
}: OrderSummaryPanelProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="px-1">
      {items.map((item) => (
        <OrderItemRow
          key={item.menuItemId.toString()}
          item={item}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
