import { ArrowLeft } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem } from '../../backend';
import { getCategoryDisplayName } from '../../lib/utils';

interface CategoryItemsViewProps {
  category: string;
  menuItems: MenuItem[];
  searchQuery: string;
  getQuantityInOrder: (id: bigint) => number;
  onAdd: (item: MenuItem) => void;
  onBack: () => void;
}

export default function CategoryItemsView({
  category,
  menuItems,
  searchQuery,
  getQuantityInOrder,
  onAdd,
  onBack,
}: CategoryItemsViewProps) {
  const trimmed = searchQuery.trim().toLowerCase();
  const filteredItems = trimmed
    ? menuItems.filter((item) => item.name.toLowerCase().includes(trimmed))
    : menuItems;

  const displayName = getCategoryDisplayName(category);

  return (
    <div>
      {/* Category header with back button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/80 active:scale-95 transition-all shrink-0"
          aria-label="Back to categories"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h2 className="font-display font-bold text-base uppercase tracking-wide text-foreground leading-tight">
            {displayName}
          </h2>
          <p className="text-xs text-muted-foreground">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            {trimmed ? ' found' : ''}
          </p>
        </div>
      </div>

      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {trimmed ? 'No items match your search' : 'No items in this category'}
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
  );
}
