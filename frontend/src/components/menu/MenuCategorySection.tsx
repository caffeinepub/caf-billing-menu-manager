import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import type { MenuItem } from '../../backend';
import MenuItemForm from './MenuItemForm';
import DeleteMenuItemDialog from './DeleteMenuItemDialog';
import { formatCurrencyBigInt } from '@/lib/utils';

interface MenuCategorySectionProps {
  category: string;
  items: MenuItem[];
  onEdit: (id: bigint, name: string, price: number, category: string) => Promise<void>;
  onDelete: (id: bigint) => Promise<void>;
  editingId: bigint | null;
  deletingId: bigint | null;
}

export default function MenuCategorySection({
  category,
  items,
  onEdit,
  onDelete,
  editingId,
  deletingId,
}: MenuCategorySectionProps) {
  const [openEditId, setOpenEditId] = useState<bigint | null>(null);

  // Guard against undefined/null items array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <h3 className="font-display font-semibold text-base text-foreground">{category}</h3>
        <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
          {safeItems.length}
        </Badge>
      </div>

      <div className="space-y-2">
        {safeItems.map(item => (
          <Card key={item.id.toString()} className="flex items-center px-4 py-3 gap-3 shadow-xs">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{category}</p>
            </div>
            <span className="font-semibold text-sm text-primary shrink-0">
              {formatCurrencyBigInt(item.price)}
            </span>

            {/* Edit Dialog */}
            <Dialog
              open={openEditId === item.id}
              onOpenChange={open => setOpenEditId(open ? item.id : null)}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                  <Pencil size={15} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                <MenuItemForm
                  mode="edit"
                  initialValues={{
                    name: item.name,
                    price: Number(item.price),
                    category: item.category,
                  }}
                  isLoading={editingId === item.id}
                  onSubmit={async values => {
                    await onEdit(item.id, values.name, values.price, values.category);
                    setOpenEditId(null);
                  }}
                  onCancel={() => setOpenEditId(null)}
                />
              </DialogContent>
            </Dialog>

            <DeleteMenuItemDialog
              itemName={item.name}
              isLoading={deletingId === item.id}
              onConfirm={() => onDelete(item.id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
