import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, CheckCircle, ShoppingCart } from 'lucide-react';
import { useMenuItemsByCategory, useFinalizeOrder } from '../hooks/useQueries';
import { useOrderState } from '../hooks/useOrderState';
import MenuItemCard from '../components/order/MenuItemCard';
import OrderSummaryPanel from '../components/order/OrderSummaryPanel';
import OrderTotalsPanel from '../components/order/OrderTotalsPanel';
import type { MenuItem, OrderItem } from '../backend';

export default function OrderTaking() {
  const navigate = useNavigate();
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const { data: categories, isLoading } = useMenuItemsByCategory();
  const finalizeMutation = useFinalizeOrder();

  const {
    items,
    taxRate, setTaxRate,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    addItem, updateQuantity, removeItem, clearOrder,
    subtotal, taxAmount, discountAmount, total,
  } = useOrderState();

  // Store bill data for navigation
  const billDataRef = useRef<{
    items: typeof items;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
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
      const order = await finalizeMutation.mutateAsync(orderItems);

      // Store bill data in sessionStorage for the bill page
      const billData = {
        items,
        subtotal,
        taxRate,
        taxAmount,
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
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-foreground">New Order</h2>
          {totalItemCount > 0 && (
            <Badge className="rounded-full px-2.5">
              {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(j => <Skeleton key={j} className="h-16 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!categories || categories.length === 0) && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No menu items found.</p>
            <p className="text-xs text-muted-foreground mt-1">Add items in the Menu tab first.</p>
          </div>
        )}

        {!isLoading && categories && categories.map(([category, menuItems]) => (
          <div key={category} className="space-y-2">
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide px-1">
              {category}
            </h3>
            <div className="space-y-2">
              {menuItems.map((item: MenuItem) => (
                <MenuItemCard
                  key={item.id.toString()}
                  item={item}
                  quantityInOrder={getQuantityInOrder(item.id)}
                  onAdd={addItem}
                />
              ))}
            </div>
          </div>
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
                  taxRate={taxRate}
                  taxAmount={taxAmount}
                  discountType={discountType}
                  discountValue={discountValue}
                  discountAmount={discountAmount}
                  total={total}
                  onTaxRateChange={setTaxRate}
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
