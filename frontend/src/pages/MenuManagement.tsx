import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, UtensilsCrossed, RefreshCw, AlertCircle } from 'lucide-react';
import {
  useMenuItemsByCategory,
  useAddMenuItem,
  useEditMenuItem,
  useDeleteMenuItem,
  sortCategoriesByOrder,
} from '../hooks/useQueries';
import { useAdminRole } from '../hooks/useAdminRole';
import MenuCategorySection from '../components/menu/MenuCategorySection';
import MenuItemForm from '../components/menu/MenuItemForm';

export default function MenuManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const {
    data: categories,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useMenuItemsByCategory();

  const addMutation = useAddMenuItem();
  const editMutation = useEditMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const { isAdmin, isLoading: roleLoading } = useAdminRole();

  const handleAdd = async (values: { name: string; price: number; category: string }) => {
    await addMutation.mutateAsync({
      name: values.name,
      price: BigInt(Math.round(values.price)),
      category: values.category,
    });
    setAddDialogOpen(false);
  };

  const handleEdit = async (id: bigint, name: string, price: number, category: string) => {
    setEditingId(id);
    try {
      await editMutation.mutateAsync({
        id,
        name,
        price: BigInt(Math.round(price)),
        category,
      });
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Sort categories in canonical order before rendering
  const sortedCategories = Array.isArray(categories) ? sortCategoriesByOrder(categories) : [];
  const totalItems = sortedCategories.reduce((sum, [, items]) => sum + (Array.isArray(items) ? items.length : 0), 0);
  const showLoading = isLoading || roleLoading;

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Menu</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {showLoading
              ? 'Loading…'
              : `${totalItems} item${totalItems !== 1 ? 's' : ''} across ${sortedCategories.length} categories`}
          </p>
        </div>

        {/* Add Item button — admin only */}
        {isAdmin && (
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 gap-1.5">
                <Plus size={16} />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
              </DialogHeader>
              <MenuItemForm
                mode="create"
                isLoading={addMutation.isPending}
                onSubmit={handleAdd}
                onCancel={() => setAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Loading State */}
      {showLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ))}
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
            onClick={() => refetch()}
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
            <UtensilsCrossed size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-base text-foreground">No menu items yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
            {isAdmin
              ? 'Add your first item to start building your menu'
              : 'The menu is currently empty. Please check back later.'}
          </p>
          {isAdmin && (
            <Button
              className="mt-4 gap-1.5"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus size={16} />
              Add First Item
            </Button>
          )}
        </div>
      )}

      {/* Menu Categories */}
      {!showLoading && !error && sortedCategories.length > 0 && (
        <div className="space-y-6">
          {sortedCategories.map(([category, items]) => (
            <MenuCategorySection
              key={category}
              category={category}
              items={items}
              isAdmin={isAdmin}
              editingId={editingId}
              deletingId={deletingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
