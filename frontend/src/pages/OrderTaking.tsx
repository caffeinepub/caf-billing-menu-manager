import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, CheckCircle, ShoppingCart, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import {
  useMenuItemsByCategory,
  useFinalizeOrder,
  useSeedDefaultMenu,
  sortCategoriesByOrder,
} from '../hooks/useQueries';
import { useOrderState } from '../hooks/useOrderState';
import MenuCategoryAccordion from '../components/order/MenuCategoryAccordion';
import OrderSummaryPanel from '../components/order/OrderSummaryPanel';
import OrderTotalsPanel from '../components/order/OrderTotalsPanel';
import type { OrderItem } from '../backend';

export default function OrderTaking() {
  const navigate = useNavigate();
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const seedAttemptedRef = useRef(false);

  const { data: categories, isLoading, error, refetch, isFetching } = useMenuItemsByCategory();
  const finalizeMutation = useFinalizeOrder();
  const seedMutation = useSeedDefaultMenu();

  const {
    items,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    addItem, updateQuantity, removeItem, clearOrder,
    subtotal, discountAmount, total,
  } = useOrderState();

  const billDataRef = useRef<{
    items: typeof items;
    subtotal: number;
    discountType: typeof discountType;
    discountValue: number;
    discountAmount: number;
    total: number;
    timestamp: bigint;
  } | null>(null);

  // Auto-seed default menu when the menu is empty after a successful load.
  // Use a ref to prevent repeated seed attempts across re-renders.
  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      !error &&
      !seedAttemptedRef.current &&
      !seedMutation.isPending &&
      Array.isArray(categories) &&
      categories.length === 0
    ) {
      seedAttemptedRef.current = true;
      seedMutation.mutate();
    }
  }, [isLoading, isFetching, error, categories, seedMutation]);

  const getQuantityInOrder = (menuItemId: bigint) => {
    return items.find(i => i.menuItemId === menuItemId)?.quantity ?? 0;
  };

  const handleFinalize = async () => {
    if (items.length === 0) return;

    const orderItems: OrderItem[] = items.map(item => ({
      menuItemId: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: BigInt(item.quantity),
    }));

    try {
      const order = await finalizeMutation.mutateAsync({
        orderItems,
        discount: BigInt(Math.round(discountAmount)),
      });

      const billData = {
        items,
        subtotal,
        discountType,
        discountValue,
        discountAmount,
        total,
        timestamp: order.timestamp,
      };
      sessionStorage.setItem('currentBill', JSON.stringify(billData, (_, v) =>
        typeof v === 'bigint' ? v.toString() + 'n' : v
      ));

      clearOrder();
      navigate({ to: '/bill' });
    } catch (err) {
      console.error('Failed to finalize order:', err);
    }
  };

  // Sort categories in canonical order before rendering
  const sortedCategories = Array.isArray(categories) ? sortCategoriesByOrder(categories) : [];
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isSeeding = seedMutation.isPending;
  const showLoading = isLoading || isSeeding;

  return (
    <div className="flex flex-col h-full">
      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-xl text-foreground">New Order</h2>
          {totalItemCount > 0 && (
            <Badge className="rounded-full px-2.5">
              {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {showLoading && (
          <div className="space-y-3">
            {isSeeding && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <Loader2 size={28} className="animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Setting up menu…</p>
              </div>
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="h-[52px] w-full" />
                  <div className="p-3 space-y-2">
                    {[1, 2, 3].map(j => <Skeleton key={j} className="h-14 rounded-lg" />)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Error State */}
        {error && !showLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle size={26} className="text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Failed to load menu</p>
              <p className="text-xs text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                seedAttemptedRef.current = false;
                refetch();
              }}
              disabled={isFetching}
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              {isFetching ? 'Retrying…' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!showLoading && !error && sortedCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ShoppingCart size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-base text-foreground">No menu items</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
              Add items to the menu first to start taking orders
            </p>
          </div>
        )}

        {/* Menu Categories — rendered in canonical order */}
        {!showLoading && !error && sortedCategories.length > 0 && (
          <div className="space-y-2">
            {sortedCategories.map(([category, menuItems]) => (
              <MenuCategoryAccordion
                key={category}
                category={category}
                menuItems={Array.isArray(menuItems) ? menuItems : []}
                getQuantityInOrder={getQuantityInOrder}
                onAdd={addItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      {items.length > 0 && (
        <div className="border-t border-border bg-card">
          {/* Collapse Toggle */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
            onClick={() => setSummaryExpanded(prev => !prev)}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" />
              Order Summary
              <Badge variant="secondary" className="rounded-full text-xs px-2 py-0">
                {totalItemCount}
              </Badge>
            </span>
            {summaryExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          {summaryExpanded && (
            <>
              <Separator />
              <div className="px-4 pt-3 pb-2 max-h-52 overflow-y-auto">
                <OrderSummaryPanel
                  items={items}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              </div>
              <Separator />
              <div className="px-4 py-3">
                <OrderTotalsPanel
                  subtotal={subtotal}
                  discountType={discountType}
                  discountValue={discountValue}
                  discountAmount={discountAmount}
                  total={total}
                  onDiscountTypeChange={setDiscountType}
                  onDiscountValueChange={setDiscountValue}
                />
              </div>
            </>
          )}

          <div className="px-4 pb-4 pt-1">
            <Button
              className="w-full h-12 text-base font-semibold gap-2"
              onClick={handleFinalize}
              disabled={items.length === 0 || finalizeMutation.isPending}
            >
              {finalizeMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Finalize Order · ₹{total}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
