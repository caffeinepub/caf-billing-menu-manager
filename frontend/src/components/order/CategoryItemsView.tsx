import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MenuItemCard from "./MenuItemCard";
import type { MenuItem } from "../../backend";
import type { ActiveOrderItem } from "../../hooks/useOrderState";
import { getCategoryDisplayName } from "../../lib/utils";

interface CategoryItemsViewProps {
  category: string;
  menuItems: MenuItem[];
  searchQuery: string;
  getQuantityInOrder: (id: bigint) => number;
  onAdd: (item: MenuItem) => void;
  onBack: () => void;
  onSearchChange?: (query: string) => void;
}

export default function CategoryItemsView({
  category,
  menuItems,
  searchQuery,
  getQuantityInOrder,
  onAdd,
  onBack,
  onSearchChange,
}: CategoryItemsViewProps) {
  const trimmed = searchQuery.trim().toLowerCase();
  const filteredItems = trimmed
    ? menuItems.filter((item) => item.name.toLowerCase().includes(trimmed))
    : menuItems;

  const displayName = getCategoryDisplayName(category);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/80 active:scale-95 transition-all shrink-0"
          aria-label="Back to categories"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-base uppercase tracking-wide text-foreground leading-tight truncate">
            {displayName}
          </h2>
          <p className="text-xs text-muted-foreground">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            {trimmed ? " found" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      {onSearchChange && (
        <div className="relative px-4 pb-3">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search in ${displayName}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      )}

      {/* Items grid */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {trimmed ? "No items match your search" : "No items in this category"}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id.toString()}
                item={item}
                quantityInOrder={getQuantityInOrder(item.id)}
                onAdd={onAdd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
