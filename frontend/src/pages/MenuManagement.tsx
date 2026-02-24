import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { useMenuItemsByCategory, useAddMenuItem, useEditMenuItem, useDeleteMenuItem } from '../hooks/useQueries';
import MenuCategorySection from '../components/menu/MenuCategorySection';
import MenuItemForm from '../components/menu/MenuItemForm';

export default function MenuManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const { data: categories, isLoading, error } = useMenuItemsByCategory();
  const addMutation = useAddMenuItem();
  const editMutation = useEditMenuItem();
  const deleteMutation = useDeleteMenuItem();

  const handleAdd = async (values: { name: string; price: number; category: string }) => {
    await addMutation.mutateAsync({
      name: values.name,
      price: BigInt(Math.round(values.price * 100)) / 100n,
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

  const totalItems = categories?.reduce((sum, [, items]) => sum + items.length, 0) ?? 0;

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Menu</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalItems} item{totalItems !== 1 ? 's' : ''} across {categories?.length ?? 0} categories
          </p>
        </div>

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
      </div>

      {/* Loading State */}
      {isLoading && (
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
      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-destructive">Failed to load menu items. Please try again.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!categories || categories.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <UtensilsCrossed size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-base text-foreground">No menu items yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
            Add your first item to start building your menu
          </p>
          <Button
            className="mt-4 gap-1.5"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus size={16} />
            Add First Item
          </Button>
        </div>
      )}

      {/* Categories */}
      {!isLoading && categories && categories.length > 0 && (
        <div className="space-y-6">
          {categories.map(([category, items]) => (
            <MenuCategorySection
              key={category}
              category={category}
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editingId={editingId}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
