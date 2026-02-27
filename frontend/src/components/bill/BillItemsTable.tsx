import { formatCurrency } from "@/lib/utils";
import type { ActiveOrderItem } from "@/hooks/useOrderState";

interface BillItemsTableProps {
  items: ActiveOrderItem[];
}

export default function BillItemsTable({ items }: BillItemsTableProps) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-dashed border-gray-400">
          <th className="text-left py-1 font-semibold">Item</th>
          <th className="text-center py-1 font-semibold w-8">Qty</th>
          <th className="text-right py-1 font-semibold w-16">Price</th>
          <th className="text-right py-1 font-semibold w-16">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className="border-b border-dotted border-gray-300 last:border-0">
            <td className="py-1 pr-2">{item.name}</td>
            <td className="py-1 text-center">{Number(item.quantity)}</td>
            <td className="py-1 text-right">{formatCurrency(item.price)}</td>
            <td className="py-1 text-right font-medium">
              {formatCurrency(item.price * item.quantity)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
