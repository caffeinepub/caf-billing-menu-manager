import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  UtensilsCrossed,
  RefreshCw,
  AlertCircle,
  Trash2,
  Tag,
  Loader2,
} from "lucide-react";
import {
  useMenuItemsByCategory,
  useAddMenuItem,
  useEditMenuItem,
  useDeleteMenuItem,
  useGetCategories,
  useCreateCategory,
  useDeleteCategory,
  sortCategoriesByOrder,
} from "../hooks/useQueries";
import { useAdminRole } from "../hooks/useAdminRole";
import MenuCategorySection from "../components/menu/MenuCategorySection";
import MenuItemForm from "../components/menu/MenuItemForm";

export default function MenuManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const {
    data: categories,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useMenuItemsByCategory();

  const { data: categoryList = [], isLoading: categoriesLoading } = useGetCategories();

  const addMutation = useAddMenuItem();
  const editMutation = useEditMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
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

  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    try {
      await createCategoryMutation.mutateAsync(trimmed);
      setNewCategoryName("");
    } catch (err) {
      // error handled by mutation state
    }
  };

  const handleDeleteCategory = async (name: string) => {
    setDeletingCategory(name);
    try {
      await deleteCategoryMutation.mutateAsync(name);
    } finally {
      setDeletingCategory(null);
    }
  };

  const sortedCategories = Array.isArray(categories) ? sortCategoriesByOrder(categories) : [];
  const totalItems = sortedCategories.reduce(
    (sum, [, items]) => sum + (Array.isArray(items) ? items.length : 0),
    0
  );
  const showLoading = isLoading || roleLoading;

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Menu</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {showLoading
              ? "Loading…"
              : `${totalItems} item${totalItems !== 1 ? "s" : ""} across ${sortedCategories.length} categories`}
          </p>
        </div>

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

      {/* Category Management — admin only */}
      {isAdmin && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-primary" />
            <h3 className="font-display font-semibold text-sm text-foreground">
              Category Management
            </h3>
          </div>

          {/* Add new category */}
          <div className="flex gap-2">
            <Input
              placeholder="New category name…"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCategory();
              }}
              className="h-9 text-sm"
              disabled={createCategoryMutation.isPending}
            />
            <Button
              size="sm"
              className="h-9 gap-1.5 shrink-0"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Add
            </Button>
          </div>

          {createCategoryMutation.isError && (
            <p className="text-xs text-destructive">
              {createCategoryMutation.error instanceof Error
                ? createCategoryMutation.error.message
                : "Failed to create category"}
            </p>
          )}

          {/* Existing categories */}
          {categoriesLoading ? (
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          ) : categoryList.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No categories yet. Add one above to get started.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categoryList.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-1 bg-muted rounded-full pl-3 pr-1 py-1"
                >
                  <span className="text-xs font-medium text-foreground">{cat.name}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                        disabled={deletingCategory === cat.name}
                        title={`Delete ${cat.name}`}
                      >
                        {deletingCategory === cat.name ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Trash2 size={11} />
                        )}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{cat.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the category and all menu items in it. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(cat.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Category
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAdmin && <Separator />}

      {/* Loading State */}
      {showLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred. Please try again."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Retrying…" : "Try Again"}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!showLoading && !error && sortedCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <UtensilsCrossed size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-base text-foreground">
            No menu items yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[220px]">
            {isAdmin
              ? "Create a category first, then add items to it"
              : "The menu is currently empty. Please check back later."}
          </p>
          {isAdmin && (
            <Button className="mt-4 gap-1.5" onClick={() => setAddDialogOpen(true)}>
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
