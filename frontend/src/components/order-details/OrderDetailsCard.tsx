import type { FinalizedOrder } from "../../hooks/useQueries";
import { formatCurrency } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

interface OrderDetailsCardProps {
  order: FinalizedOrder;
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const hasDiscount = order.discount > 0n;

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-espresso/5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-espresso/10 flex items-center justify-center">
            <ShoppingBag size={15} className="text-espresso" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground leading-tight">
              Order #{order.id.toString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-semibold border-amber-warm/40 text-amber-warm bg-amber-warm/10"
        >
          {formatCurrency(order.total)}
        </Badge>
      </div>

      {/* Items Table */}
      <div className="px-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/60">
              <TableHead className="text-xs font-semibold text-muted-foreground py-2 pl-3">
                Item
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-2 text-center w-14">
                Qty
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-2 text-right w-20">
                Price
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-2 text-right pr-3 w-20">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item, idx) => {
              const lineTotal = item.price * item.quantity;
              return (
                <TableRow
                  key={idx}
                  className="hover:bg-muted/30 border-b border-border/40 last:border-0"
                >
                  <TableCell className="py-2 pl-3 text-sm font-medium text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-2 text-sm text-center text-muted-foreground">
                    {Number(item.quantity)}
                  </TableCell>
                  <TableCell className="py-2 text-sm text-right text-muted-foreground">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="py-2 pr-3 text-sm text-right font-medium text-foreground">
                    {formatCurrency(lineTotal)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Totals Footer */}
      <div className="px-4 py-3 bg-muted/20 border-t border-border/60 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {hasDiscount && (
          <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>− {formatCurrency(order.discount)}</span>
          </div>
        )}
        <Separator className="my-1 opacity-50" />
        <div className="flex justify-between text-sm font-bold text-foreground">
          <span>Total</span>
          <span className="text-espresso">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
