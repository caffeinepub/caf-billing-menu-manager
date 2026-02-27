import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useOrderState } from '@/hooks/useOrderState';
import { useSaveFinalizedOrder } from '@/hooks/useQueries';
import OrderSummaryPanel from '@/components/order/OrderSummaryPanel';
import OrderTotalsPanel from '@/components/order/OrderTotalsPanel';
import CategoryGrid from '@/components/order/CategoryGrid';
import CategoryItemsView from '@/components/order/CategoryItemsView';
import DeleteOrderDialog from '@/components/order/DeleteOrderDialog';
import { PUBLIC_MENU } from '@/data/publicMenu';
import type { MenuItem } from '@/backend';

// Convert static menu data to MenuItem[] with bigint fields
// prices in publicMenu.ts are in rupees; backend stores in paise (×100)
let _idCounter = 1;
const STATIC_MENU_ITEMS: MenuItem[] = PUBLIC_MENU.flatMap((cat) =>
  cat.items.map((item) => ({
    id: BigInt(_idCounter++),
    name: item.name,
    price: BigInt(item.price * 100),
    category: cat.name,
  }))
);

// Build [category, MenuItem[]] pairs for CategoryGrid
const STATIC_CATEGORIES: Array<[string, MenuItem[]]> = PUBLIC_MENU.map((cat) => [
  cat.name,
  STATIC_MENU_ITEMS.filter((item) => item.category === cat.name),
]);

let orderCounter = 1;

export default function OrderTaking() {
  const navigate = useNavigate();
  const {
    items,
    discount,
    subtotal,
    total,
    addItem,
    updateQuantity,
    removeItem,
    setDiscount,
    clearOrder,
    toOrderItems,
  } = useOrderState();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const saveFinalizedOrder = useSaveFinalizedOrder();

  // Items for the selected category
  const categoryItems: MenuItem[] = useMemo(() => {
    if (!selectedCategory) return [];
    return STATIC_CATEGORIES.find(([cat]) => cat === selectedCategory)?.[1] ?? [];
  }, [selectedCategory]);

  // Quantity helper for MenuItemCard badges
  const getQuantityInOrder = (menuItemId: bigint): number => {
    const found = items.find((i) => i.menuItemId === menuItemId);
    return found ? Number(found.quantity) : 0;
  };

  const handleFinalize = async () => {
    if (items.length === 0) return;

    const orderId = BigInt(orderCounter++);
    const timestampNs = BigInt(Date.now()) * BigInt(1_000_000);

    const order = {
      id: orderId,
      items: toOrderItems(),
      subtotal,
      discount,
      total,
      timestamp: timestampNs,
      finalized: true,
    };

    // Store bill data in sessionStorage for the bill view
    sessionStorage.setItem(
      'billData',
      JSON.stringify({
        id: Number(orderId),
        items: items.map((i) => ({
          menuItemId: Number(i.menuItemId),
          name: i.name,
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
        subtotal: Number(subtotal),
        discount: Number(discount),
        total: Number(total),
        timestamp: Number(timestampNs),
      })
    );

    try {
      await saveFinalizedOrder.mutateAsync(order);
    } catch (err) {
      // Still navigate to bill even if backend save fails
      console.error('Failed to save order to backend:', err);
    }

    clearOrder();
    navigate({ to: '/bill' });
  };

  const handleClearOrder = () => {
    clearOrder();
  };

  const totalItemCount = items.reduce((s, i) => s + Number(i.quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* ── LEFT / TOP: Menu browsing ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {selectedCategory ? (
          <div className="flex-1 overflow-auto pb-4">
            <CategoryItemsView
              category={selectedCategory}
              menuItems={categoryItems}
              searchQuery={searchQuery}
              getQuantityInOrder={getQuantityInOrder}
              onAdd={addItem}
              onBack={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              onSearchChange={setSearchQuery}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <h2 className="font-display font-bold text-lg text-foreground mb-3">Browse Menu</h2>
            <CategoryGrid
              categories={STATIC_CATEGORIES}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSearchQuery('');
              }}
            />
          </div>
        )}
      </div>

      {/* ── RIGHT / BOTTOM: Order Summary ── */}
      <div className="lg:w-80 xl:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-card">
        {/* Order header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Current Order</span>
            {totalItemCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <DeleteOrderDialog
              onConfirm={handleClearOrder}
              itemCount={items.length}
            />
          )}
        </div>

        {/* Order items — scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto max-h-[40vh] lg:max-h-none">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
              <p className="text-sm font-medium">No items yet</p>
              <p className="text-xs mt-1">Tap a menu item to add it to the order</p>
            </div>
          ) : (
            <div className="px-3 py-2">
              <OrderSummaryPanel
                items={items}
                onIncrement={(id) => {
                  const item = items.find((i) => i.menuItemId === id);
                  if (item) updateQuantity(id, Number(item.quantity) + 1);
                }}
                onDecrement={(id) => {
                  const item = items.find((i) => i.menuItemId === id);
                  if (item) updateQuantity(id, Number(item.quantity) - 1);
                }}
                onRemove={removeItem}
              />
            </div>
          )}
        </div>

        {/* Totals + finalize — always visible at bottom */}
        <div className="px-4 pb-4 pt-3 border-t border-border shrink-0 space-y-3">
          <OrderTotalsPanel
            subtotal={subtotal}
            discount={discount}
            total={total}
            onDiscountChange={setDiscount}
          />

          <button
            onClick={handleFinalize}
            disabled={items.length === 0 || saveFinalizedOrder.isPending}
            className="w-full bg-espresso text-cream font-semibold py-3 rounded-xl hover:bg-espresso/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {saveFinalizedOrder.isPending ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />
                Saving...
              </>
            ) : (
              `Finalize Order · ₹${(Number(total) / 100).toFixed(0)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
