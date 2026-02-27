import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useGetCategories } from '../../hooks/useQueries';

interface MenuItemFormProps {
  mode: 'create' | 'edit';
  initialValues?: { name: string; price: number; category: string };
  onSubmit: (values: { name: string; price: number; category: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function MenuItemForm({ mode, initialValues, onSubmit, onCancel, isLoading }: MenuItemFormProps) {
  const { data: categoryList = [], isLoading: categoriesLoading } = useGetCategories();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [customCategory, setCustomCategory] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Determine if initial category is a preset once categories load
  useEffect(() => {
    if (initialValues && categoryList.length > 0) {
      const presetNames = categoryList.map((c) => c.name);
      const isPreset = presetNames.includes(initialValues.category);
      if (isPreset) {
        setCategory(initialValues.category);
        setUseCustom(false);
      } else {
        setCustomCategory(initialValues.category);
        setUseCustom(true);
      }
    }
  }, [categoryList.length]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Item name is required';
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) errs.price = 'Enter a valid price';
    const finalCategory = useCustom ? customCategory.trim() : category;
    if (!finalCategory) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const finalCategory = useCustom ? customCategory.trim() : category;
    const priceInPaise = Math.round(parseFloat(price) * 100);
    onSubmit({ name: name.trim(), price: priceInPaise, category: finalCategory });
  };

  const presetCategories = categoryList.map((c) => c.name);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="item-name">Item Name</Label>
        <Input
          id="item-name"
          placeholder="e.g. Masala Tea"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <Label htmlFor="item-price">Price (₹)</Label>
        <Input
          id="item-price"
          type="number"
          placeholder="e.g. 25"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={isLoading}
        />
        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label>Category</Label>

        {categoriesLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 size={14} className="animate-spin" />
            Loading categories…
          </div>
        ) : presetCategories.length === 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
              No categories found. Please create a category first in Menu Management.
            </p>
            <Input
              placeholder="Or type a category name"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              disabled={isLoading}
            />
          </div>
        ) : (
          <>
            {/* Preset category buttons */}
            <div className="flex flex-wrap gap-1.5">
              {presetCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setUseCustom(false);
                    setErrors((e) => ({ ...e, category: '' }));
                  }}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    !useCustom && category === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:border-primary/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setUseCustom(true);
                  setCategory('');
                  setErrors((e) => ({ ...e, category: '' }));
                }}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  useCustom
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/60'
                }`}
              >
                + Custom
              </button>
            </div>

            {/* Custom category input */}
            {useCustom && (
              <Input
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                disabled={isLoading}
                className="mt-1.5"
              />
            )}
          </>
        )}

        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1.5" />
              {mode === 'create' ? 'Adding…' : 'Saving…'}
            </>
          ) : mode === 'create' ? (
            'Add Item'
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
