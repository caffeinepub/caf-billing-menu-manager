import { Card } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { formatCurrencyBigInt, formatDate } from '@/lib/utils';
import type { Order } from '../../backend';

interface DateWiseSalesTableProps {
  data: Order[];
  isLoading?: boolean;
}

interface DayGroup {
  date: string;
  orderCount: number;
  total: bigint;
}

function groupByDay(orders: Order[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const order of orders) {
    const dateStr = formatDate(order.timestamp);
    const existing = map.get(dateStr);
    if (existing) {
      existing.orderCount += 1;
      existing.total += order.total;
    } else {
      map.set(dateStr, { date: dateStr, orderCount: 1, total: order.total });
    }
  }
  return Array.from(map.values()).reverse();
}

export default function DateWiseSalesTable({ data, isLoading }: DateWiseSalesTableProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  const grouped = groupByDay(data);

  if (grouped.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">No orders in this date range.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="text-xs font-semibold">Date</TableHead>
            <TableHead className="text-xs font-semibold text-center w-20">Orders</TableHead>
            <TableHead className="text-xs font-semibold text-right w-24">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grouped.map(row => (
            <TableRow key={row.date}>
              <TableCell className="text-sm py-2.5">{row.date}</TableCell>
              <TableCell className="text-sm py-2.5 text-center font-medium">{row.orderCount}</TableCell>
              <TableCell className="text-sm py-2.5 text-right font-semibold text-primary">
                {formatCurrencyBigInt(row.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
