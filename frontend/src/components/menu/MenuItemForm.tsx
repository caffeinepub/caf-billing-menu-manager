import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MenuItem } from '../../backend';

const PRESET_CATEGORIES = [
  'Hot Coffee', 'Cold Coffee', 'Refreshers', 'Snacks',
  'Desserts', 'Hot Drinks', 'Juices', 'Meals'
];

interface MenuItemFormProps {
  mode: 'create' | 'edit';
  initialValues?: { name: string; price: number; category: string };
  onSubmit: (values: { name: string; price: number; category: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function MenuItemForm({ mode, initialValues, onSubmit, onCancel, isLoading }: MenuItemFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [customCategory, setCustomCategory] = useState('');
  const [useCustom, setUseCustom] = useState(
    initialValues?.category ? !PRESET_CATEGORIES.includes(initialValues.category) : false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setPrice(initialValues.price.toString());
      const isPreset = PRESET_CATEGORIES.includes(initialValues.category);
      if (isPreset) {
        setCategory(initialValues.category);
        setUseCustom(false);
      } else {
        setCustomCategory(initialValues.category);
        setUseCustom(true);
      }
    }
  }, []);

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
    onSubmit({ name: name.trim(), price: parseFloat(price), category: finalCategory });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="item-name" className="text-sm font-medium">Item Name</Label>
        <Input
          id="item-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Cappuccino"
          className="h-11"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="item-price" className="text-sm font-medium">Price (₹)</Label>
        <Input
          id="item-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="e.g. 120"
          className="h-11"
        />
        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Category</Label>
        {!useCustom ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {PRESET_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`h-10 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    category === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setUseCustom(true); setCategory(''); }}
              className="text-xs text-primary underline underline-offset-2 h-auto min-h-0 min-w-0 p-0"
            >
              + Add custom category
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              placeholder="Enter category name"
              className="h-11"
            />
            <button
              type="button"
              onClick={() => { setUseCustom(false); setCustomCategory(''); }}
              className="text-xs text-primary underline underline-offset-2 h-auto min-h-0 min-w-0 p-0"
            >
              ← Choose from presets
            </button>
          </div>
        )}
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-11">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1 h-11">
          {isLoading ? 'Saving...' : mode === 'create' ? 'Add Item' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
