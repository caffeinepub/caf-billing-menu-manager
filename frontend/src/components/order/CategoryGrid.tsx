import { getCategoryDisplayName } from '../../lib/utils';
import type { MenuItem } from '../../backend';

interface CategoryGridProps {
  categories: Array<[string, MenuItem[]]>;
  onSelectCategory: (category: string) => void;
}

// Emoji map for categories — keyed by exact backend category name
const CATEGORY_EMOJI: Record<string, string> = {
  // Mixed case (actual backend values)
  'Tea': '🍵',
  'Coffee': '☕',
  'Sandwich': '🥪',
  'Toast': '🍞',
  'Light Snacks': '🍜',
  'Momos': '🥟',
  'Burgers': '🍔',
  'Starters': '🍟',
  'Refreshers': '🥤',
  'Beverages': '💧',
  'Combo': '🎁',
  // Legacy uppercase fallbacks
  'TEA': '🍵',
  'COFFEE': '☕',
  'SANDWICH': '🥪',
  'TOAST': '🍞',
  'LIGHT SNACKS': '🍜',
  'MOMOS': '🥟',
  'BURGERS': '🍔',
  'STARTERS': '🍟',
  'REFRESHERS': '🥤',
  'BEVERAGES': '💧',
  'COMBO': '🎁',
  // Other legacy fallbacks
  'Tea (Non-Alcoholic Beverages)': '🍵',
  'Coffee (Non-Alcoholic Beverages)': '☕',
  'Momo': '🥟',
  'Burger': '🍔',
  'Starter': '🍽️',
  'Refresher': '🥤',
};

// Subtle warm gradient backgrounds per category for a premium feel
const CATEGORY_BG: Record<string, string> = {
  // Mixed case (actual backend values)
  'Tea': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
  'Coffee': 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
  'Sandwich': 'from-yellow-50 to-lime-50 dark:from-yellow-950/30 dark:to-lime-950/30',
  'Toast': 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
  'Light Snacks': 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
  'Momos': 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
  'Burgers': 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
  'Starters': 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
  'Refreshers': 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
  'Beverages': 'from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30',
  'Combo': 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
  // Legacy uppercase fallbacks
  'TEA': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
  'COFFEE': 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
  'SANDWICH': 'from-yellow-50 to-lime-50 dark:from-yellow-950/30 dark:to-lime-950/30',
  'TOAST': 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
  'LIGHT SNACKS': 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
  'MOMOS': 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
  'BURGERS': 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
  'STARTERS': 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
  'REFRESHERS': 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
  'BEVERAGES': 'from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30',
  'COMBO': 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
  // Other legacy fallbacks
  'Tea (Non-Alcoholic Beverages)': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
  'Coffee (Non-Alcoholic Beverages)': 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
  'Momo': 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
  'Burger': 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
  'Starter': 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
  'Refresher': 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
};

// Rotating gradient palette for custom categories not in the predefined list
const FALLBACK_GRADIENTS = [
  'from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30',
  'from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30',
  'from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30',
  'from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30',
  'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30',
];

function getFallbackGradient(category: string): string {
  // Deterministic gradient based on category name hash
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) & 0xffff;
  }
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length];
}

export default function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(([category, items]) => {
        const emoji = CATEGORY_EMOJI[category] ?? '🍽️';
        const bg = CATEGORY_BG[category] ?? getFallbackGradient(category);
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
