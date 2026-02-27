import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { MenuItem } from "../../backend";
import { formatCurrency } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  quantityInOrder: number;
  onAdd: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, quantityInOrder, onAdd }: MenuItemCardProps) {
  return (
    <Card
      className="relative flex items-center justify-between px-4 py-3 cursor-pointer active:scale-[0.98] transition-transform shadow-xs hover:shadow-card"
      onClick={() => onAdd(item)}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p className="font-medium text-sm text-foreground leading-snug break-words">{item.name}</p>
        <p className="text-sm font-semibold text-primary mt-0.5">{formatCurrency(item.price)}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {quantityInOrder > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {quantityInOrder}
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus size={16} className="text-primary" strokeWidth={2.5} />
        </div>
      </div>
    </Card>
  );
}
