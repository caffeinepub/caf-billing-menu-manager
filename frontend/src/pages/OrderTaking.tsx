import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMenuItemsByCategory, sortCategoriesByOrder } from '@/hooks/useQueries';
import { useOrderState } from '@/hooks/useOrderState';
import { useAdminRole } from '@/hooks/useAdminRole';
import CategoryGrid from '@/components/order/CategoryGrid';
import CategoryItemsView from '@/components/order/CategoryItemsView';
import OrderSummaryPanel from '@/components/order/OrderSummaryPanel';
import OrderTotalsPanel from '@/components/order/OrderTotalsPanel';
import DeleteOrderDialog from '@/components/order/DeleteOrderDialog';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useActor } from '@/hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle } from 'lucide-react';

export default function OrderTaking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: menuCategories, isLoading } = useMenuItemsByCategory();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminRole();

  const {
    items,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    addItem,
    updateQuantity,
    removeItem,
    clearOrder,
    subtotal,
    discountAmount,
    total,
  } = useOrderState();

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not connected');
      const orderItems = items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: BigInt(item.quantity),
        price: item.price,
      }));
      return actor.finalizeOrder(orderItems, BigInt(Math.round(discountAmount)));
    },
    onSuccess: (finalizedOrder) => {
      const billData = {
        id: Number(finalizedOrder.id),
        items: finalizedOrder.items.map((item) => ({
          menuItemId: Number(item.menuItemId),
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        subtotal: Number(finalizedOrder.subtotal),
        discount: Number(finalizedOrder.discount),
        total: Number(finalizedOrder.total),
        timestamp: Number(finalizedOrder.timestamp),
      };
      sessionStorage.setItem('billData', JSON.stringify(billData));
      queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
      clearOrder();
      window.location.href = '/bill';
    },
    onError: (error) => {
      toast.error('Failed to finalize order: ' + error.message);
    },
  });

  const handleDeleteOrder = () => {
    clearOrder();
    toast.success('Order cleared successfully');
  };

  const getQuantityInOrder = (menuItemId: bigint) => {
    return items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;
  };

  // Sort categories
  const sortedCategories = Array.isArray(menuCategories)
    ? sortCategoriesByOrder(menuCategories as Array<[string, import('../backend').MenuItem[]]>)
    : [];

  // When a category is selected, get its items
  const selectedCategoryItems = selectedCategory
    ? (sortedCategories.find(([cat]) => cat === selectedCategory)?.[1] ?? [])
    : [];

  // When searching, auto-select the first matching category if none selected
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const hasItems = items.length > 0;
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Menu Section */}
      <div className={`flex-1 p-4 ${hasItems ? 'pb-80' : 'pb-4'}`}>
        {/* Search — only show when a category is selected */}
        {selectedCategory && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search in ${selectedCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[100px] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sortedCategories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No menu items available
          </div>
        ) : selectedCategory ? (
          <CategoryItemsView
            category={selectedCategory}
            menuItems={selectedCategoryItems}
            searchQuery={trimmedQuery}
            getQuantityInOrder={getQuantityInOrder}
            onAdd={addItem}
            onBack={handleBack}
          />
        ) : (
          <CategoryGrid
            categories={sortedCategories}
            onSelectCategory={handleSelectCategory}
          />
        )}
      </div>

      {/* Order Panel - Fixed Bottom */}
      {hasItems && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border shadow-card-shadow z-10">
          <div className="max-w-2xl mx-auto">
            {/* Order Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">Current Order</span>
                <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
                </span>
              </div>
              <DeleteOrderDialog
                onConfirm={handleDeleteOrder}
                itemCount={items.length}
              />
            </div>

            {/* Order Items */}
            <OrderSummaryPanel
              items={items}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />

            {/* Totals */}
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

            {/* Action Buttons */}
            <div className="px-4 pb-4 pt-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() => finalizeMutation.mutate()}
                disabled={!identity || finalizeMutation.isPending || !hasItems}
              >
                {finalizeMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {identity ? 'Finalize & Print Bill' : 'Login to Finalize'}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
