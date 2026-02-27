import { useState } from 'react';
import { PUBLIC_MENU, PublicMenuCategory } from '../data/publicMenu';
import { cn } from '@/lib/utils';

function CategorySection({ category }: { category: PublicMenuCategory }) {
  return (
    <section className="mb-6">
      {/* Category Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-warm/10 border-l-4 border-amber-warm mb-3 rounded-r-lg">
        <span className="text-xl">{category.emoji}</span>
        <h2 className="font-display text-base font-bold text-espresso tracking-wide uppercase">
          {category.name}
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
          {category.items.length} items
        </span>
      </div>

      {/* Items Grid */}
      <div className="px-4 grid grid-cols-1 gap-1.5">
        {category.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-card border border-border/50 hover:border-amber-warm/40 hover:bg-amber-warm/5 transition-colors"
          >
            <span className="text-sm text-foreground font-medium leading-snug flex-1 pr-3">
              {item.name}
            </span>
            <span className="text-sm font-bold text-amber-warm shrink-0 tabular-nums">
              ₹{item.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PublicMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = activeCategory
    ? PUBLIC_MENU.filter((c) => c.name === activeCategory)
    : PUBLIC_MENU;

  return (
    <div className="min-h-full bg-background">
      {/* Page Hero */}
      <div className="bg-gradient-to-br from-espresso to-latte px-4 pt-5 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img
            src="/assets/generated/cafe-logo.png"
            alt="Simple Sips Cafe"
            className="h-10 w-10 object-contain"
          />
          <h1 className="font-display text-2xl font-bold text-cream tracking-tight">
            Our Menu
          </h1>
        </div>
        <p className="text-cream/70 text-xs">All prices inclusive of taxes</p>
      </div>

      {/* Category Filter Pills */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors',
              activeCategory === null
                ? 'bg-amber-warm text-white border-amber-warm'
                : 'bg-card text-muted-foreground border-border hover:border-amber-warm/50 hover:text-foreground'
            )}
          >
            All
          </button>
          {PUBLIC_MENU.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
              className={cn(
                'shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap',
                activeCategory === cat.name
                  ? 'bg-amber-warm text-white border-amber-warm'
                  : 'bg-card text-muted-foreground border-border hover:border-amber-warm/50 hover:text-foreground'
              )}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="pt-4 pb-24">
        {filteredCategories.map((category) => (
          <CategorySection key={category.name} category={category} />
        ))}
      </div>

      {/* Footer */}
      <footer className="no-print fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border py-3 text-center z-10">
        <p className="text-xs text-muted-foreground">
          Built with{' '}
          <span className="text-red-500">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'unknown-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-warm hover:underline font-medium"
          >
            caffeine.ai
          </a>
          {' '}· © {new Date().getFullYear()} Simple Sips Cafe
        </p>
      </footer>
    </div>
  );
}
