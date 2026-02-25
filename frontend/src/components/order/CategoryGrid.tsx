import type { MenuItem } from '../../backend';
import { getCategoryDisplayName } from '../../lib/utils';

interface CategoryGridProps {
  categories: Array<[string, MenuItem[]]>;
  onSelectCategory: (category: string) => void;
}

// Emoji map for categories — keyed by backend category name
const CATEGORY_EMOJI: Record<string, string> = {
  'Tea (Non-Alcoholic Beverages)': '🍵',
  'Coffee (Non-Alcoholic Beverages)': '☕',
  'Sandwich': '🥪',
  'Toast': '🍞',
  'Light Snacks': '🍿',
  'Momo': '🥟',
  'Burger': '🍔',
  'Starter': '🍽️',
  'Refresher': '🥤',
  'Combo': '🎁',
  // Legacy / fallback keys (in case old data uses display names)
  'Tea': '🍵',
  'Coffee': '☕',
  'Momos': '🥟',
  'Burgers': '🍔',
  'Starters': '🍽️',
  'Refreshers': '🥤',
};

export default function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(([category, items]) => {
        const emoji = CATEGORY_EMOJI[category] ?? '🍴';
        const displayName = getCategoryDisplayName(category);
        const count = Array.isArray(items) ? items.length : 0;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card shadow-xs hover:shadow-card active:scale-[0.97] transition-all min-h-[100px] px-3 py-4 text-center"
          >
            <span className="text-3xl leading-none">{emoji}</span>
            <span className="font-display font-semibold text-sm uppercase tracking-wide text-foreground leading-tight">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              {count} item{count !== 1 ? 's' : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
