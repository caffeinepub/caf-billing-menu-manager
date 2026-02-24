import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, CheckCircle, ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react';
import { useMenuItemsByCategory, useFinalizeOrder } from '../hooks/useQueries';
import { useOrderState } from '../hooks/useOrderState';
import MenuCategoryAccordion from '../components/order/MenuCategoryAccordion';
import OrderSummaryPanel from '../components/order/OrderSummaryPanel';
import OrderTotalsPanel from '../components/order/OrderTotalsPanel';
import type { MenuItem, OrderItem } from '../backend';

export default function OrderTaking() {
  const navigate = useNavigate();
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const { data: categories, isLoading, error, refetch, isFetching } = useMenuItemsByCategory();
  const finalizeMutation = useFinalizeOrder();

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

  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

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
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-[52px] w-full" />
                <div className="p-3 space-y-2">
                  {[1, 2, 3].map(j => <Skeleton key={j} className="h-14 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
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
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              {isFetching ? 'Retrying…' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!categories || categories.length === 0) && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No menu items found.</p>
            <p className="text-xs text-muted-foreground mt-1">Add items in the Menu tab first.</p>
          </div>
        )}

        {/* Menu Categories */}
        {!isLoading && !error && categories && categories.map(([category, menuItems]) => (
          <MenuCategoryAccordion
            key={category}
            category={category}
            menuItems={menuItems as MenuItem[]}
            getQuantityInOrder={getQuantityInOrder}
            onAdd={addItem}
          />
        ))}
      </div>

      {/* Order Summary Panel (sticky bottom) */}
      <div className="no-print border-t border-border bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        {/* Toggle Header */}
        <button
          onClick={() => setSummaryExpanded(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[52px]"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-primary" />
            <span className="font-semibold text-sm text-foreground">
              Order Summary
            </span>
            {totalItemCount > 0 && (
              <Badge variant="secondary" className="rounded-full text-xs px-2 py-0">
                {totalItemCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary text-sm">₹{total.toFixed(2)}</span>
            {summaryExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </button>

        {summaryExpanded && (
          <div className="px-4 pb-4 space-y-3 animate-slide-up">
            <OrderSummaryPanel
              items={items}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />

            {items.length > 0 && (
              <>
                <Separator />
                <OrderTotalsPanel
                  subtotal={subtotal}
                  discountType={discountType}
                  discountValue={discountValue}
                  discountAmount={discountAmount}
                  total={total}
                  onDiscountTypeChange={setDiscountType}
                  onDiscountValueChange={setDiscountValue}
                />
                <Button
                  className="w-full h-12 text-base font-semibold gap-2 mt-2"
                  onClick={handleFinalize}
                  disabled={finalizeMutation.isPending || items.length === 0}
                >
                  <CheckCircle size={18} />
                  {finalizeMutation.isPending ? 'Processing...' : 'Finalize Order'}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
