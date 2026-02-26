import type { MenuItem } from '../../backend';
import { getCategoryDisplayName } from '../../lib/utils';

interface CategoryGridProps {
  categories: Array<[string, MenuItem[]]>;
  onSelectCategory: (category: string) => void;
}

// Emoji map for categories — keyed by backend category name
const CATEGORY_EMOJI: Record<string, string> = {
  'TEA': '🍵',
  'COFFEE': '☕',
  'SANDWICH': '🥪',
  'TOAST': '🍞',
  'LIGHT SNACKS': '🍜',
  'MOMOS': '🥟',
  'BURGERS': '🍔',
  'STARTERS': '🍟',
  'REFRESHERS': '🥤',
  'COMBO': '🎁',
  // Legacy / fallback keys
  'Tea (Non-Alcoholic Beverages)': '🍵',
  'Coffee (Non-Alcoholic Beverages)': '☕',
  'Momo': '🥟',
  'Burger': '🍔',
  'Starter': '🍽️',
  'Refresher': '🥤',
};

// Subtle warm gradient backgrounds per category for a premium feel
const CATEGORY_BG: Record<string, string> = {
  'TEA': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
  'COFFEE': 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
  'SANDWICH': 'from-yellow-50 to-lime-50 dark:from-yellow-950/30 dark:to-lime-950/30',
  'TOAST': 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
  'LIGHT SNACKS': 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
  'MOMOS': 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
  'BURGERS': 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
  'STARTERS': 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
  'REFRESHERS': 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
  'COMBO': 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
  // Legacy fallbacks
  'Tea (Non-Alcoholic Beverages)': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
  'Coffee (Non-Alcoholic Beverages)': 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
  'Momo': 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
  'Burger': 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
  'Starter': 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
  'Refresher': 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
};

export default function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(([category, items]) => {
        const emoji = CATEGORY_EMOJI[category] ?? '🍽️';
        const bg = CATEGORY_BG[category] ?? 'from-muted/40 to-muted/20';
        const displayName = getCategoryDisplayName(category);

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              relative flex flex-col items-center justify-center gap-2.5
              rounded-2xl p-4 min-h-[110px]
              bg-gradient-to-br ${bg}
              border border-border/60
              shadow-card hover:shadow-md active:scale-95
              transition-all duration-150 ease-out
              text-center overflow-hidden
            `}
          >
            {/* Emoji badge */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/70 dark:bg-black/20 shadow-sm text-3xl leading-none">
              {emoji}
            </div>

            {/* Category name */}
            <div>
              <p className="font-display font-bold text-sm text-foreground leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
