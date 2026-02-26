import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem } from '../../backend';
import { getCategoryDisplayName } from '../../lib/utils';

interface MenuCategoryAccordionProps {
  category: string;
  menuItems: MenuItem[];
  getQuantityInOrder: (id: bigint) => number;
  onAdd: (item: MenuItem) => void;
  /** When true (search active), auto-expand the accordion */
  isFiltered?: boolean;
}

export default function MenuCategoryAccordion({
  category,
  menuItems,
  getQuantityInOrder,
  onAdd,
  isFiltered = false,
}: MenuCategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Auto-expand when a search filter is active
  useEffect(() => {
    if (isFiltered) {
      setIsOpen(true);
    }
  }, [isFiltered]);

  // Guard against undefined/null menuItems array
  const safeItems = Array.isArray(menuItems) ? menuItems : [];
  const displayName = getCategoryDisplayName(category);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Category heading / toggle */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 bg-muted/60 hover:bg-muted transition-colors min-h-[52px] py-3"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm uppercase tracking-wide text-foreground">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            ({safeItems.length} item{safeItems.length !== 1 ? 's' : ''})
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* Collapsible items */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-3 grid grid-cols-2 gap-2">
          {safeItems.map((item: MenuItem) => (
            <MenuItemCard
              key={item.id.toString()}
              item={item}
              quantityInOrder={getQuantityInOrder(item.id)}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
