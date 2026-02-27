import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Loader2, UtensilsCrossed, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinalizeOrder } from "@/hooks/useQueries";
import { useOrderState } from "@/hooks/useOrderState";
import OrderSummaryPanel from "@/components/order/OrderSummaryPanel";
import OrderTotalsPanel from "@/components/order/OrderTotalsPanel";
import DeleteOrderDialog from "@/components/order/DeleteOrderDialog";
import CategoryGrid from "@/components/order/CategoryGrid";
import CategoryItemsView from "@/components/order/CategoryItemsView";
import { PUBLIC_MENU } from "@/data/publicMenu";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/backend";

// Build MenuItem[] from static PUBLIC_MENU data (no auth required)
// Assign stable numeric IDs based on position across all categories
let _idCounter = 1;
const STATIC_MENU_ITEMS: MenuItem[] = PUBLIC_MENU.flatMap((cat) =>
  cat.items.map((item) => ({
    id: BigInt(_idCounter++),
    name: item.name,
    // prices in publicMenu.ts are in rupees; backend stores in paise (×100)
    price: BigInt(item.price * 100),
    category: cat.name,
  }))
);

// Build the [category, MenuItem[]] pairs that CategoryGrid expects
const STATIC_CATEGORIES: Array<[string, MenuItem[]]> = PUBLIC_MENU.map((cat) => [
  cat.name,
  STATIC_MENU_ITEMS.filter((item) => item.category === cat.name),
]);

export default function OrderTaking() {
  const navigate = useNavigate();
  const finalizeOrderMutation = useFinalizeOrder();

  const {
    items,
    discountType,
    discountValue,
    subtotal,
    discountAmount,
    total,
    addItem,
    updateQuantity,
    removeItem,
    setDiscountType,
    setDiscountValue,
    clearOrder,
    getOrderItems,
    getDiscountBigInt,
  } = useOrderState();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Items for the selected category
  const categoryItems: MenuItem[] = selectedCategory
    ? (STATIC_CATEGORIES.find(([cat]) => cat === selectedCategory)?.[1] ?? [])
    : [];

  // Quantity helper for MenuItemCard badges
  const getQuantityInOrder = (menuItemId: bigint): number => {
    const found = items.find((i) => i.menuItemId === menuItemId);
    return found ? Number(found.quantity) : 0;
  };

  const handleFinalize = async () => {
    if (items.length === 0) return;

    const orderItems = getOrderItems();
    const discount = getDiscountBigInt();

    // Store bill data locally before attempting finalize (which may be stubbed)
    const billData = {
      id: Date.now(),
      items: items.map((item) => ({
        menuItemId: Number(item.menuItemId),
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      subtotal: Number(subtotal),
      discount: Number(discountAmount),
      total: Number(total),
      timestamp: Date.now() * 1_000_000,
    };

    try {
      const result = await finalizeOrderMutation.mutateAsync({
        items: orderItems,
        discount,
      });

      if (result && result.id !== undefined) {
        const serverBillData = {
          id: Number(result.id),
          items: result.items.map((item) => ({
            menuItemId: Number(item.menuItemId),
            name: item.name,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
          subtotal: Number(result.subtotal),
          discount: Number(result.discount),
          total: Number(result.total),
          timestamp: Number(result.timestamp),
        };
        sessionStorage.setItem("billData", JSON.stringify(serverBillData));
      } else {
        sessionStorage.setItem("billData", JSON.stringify(billData));
      }
    } catch {
      // Finalize not available on backend — use local data for bill
      sessionStorage.setItem("billData", JSON.stringify(billData));
    }

    clearOrder();
    navigate({ to: "/bill" });
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
                setSearchQuery("");
              }}
              onSearchChange={setSearchQuery}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <h2 className="font-display font-bold text-lg text-foreground mb-3">
              Browse Menu
            </h2>
            <CategoryGrid
              categories={STATIC_CATEGORIES}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSearchQuery("");
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
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Current Order</span>
            {totalItemCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalItemCount} item{totalItemCount !== 1 ? "s" : ""}
              </Badge>
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
        <ScrollArea className="flex-1 min-h-0 max-h-[40vh] lg:max-h-none">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
              <UtensilsCrossed className="h-10 w-10 mb-3 opacity-30" />
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
        </ScrollArea>

        {/* Totals + finalize — always visible at bottom */}
        <div className="px-4 pb-4 pt-3 border-t border-border shrink-0 space-y-3">
          <OrderTotalsPanel
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            discountType={discountType}
            discountValue={discountValue}
            onDiscountTypeChange={setDiscountType}
            onDiscountValueChange={setDiscountValue}
          />

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleFinalize}
            disabled={items.length === 0}
          >
            {finalizeOrderMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Finalize · {formatCurrency(total)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
