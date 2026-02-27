import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { FinalizedOrder, DailySales } from "../../hooks/useQueries";

const DAY_IN_NS = BigInt(24 * 60 * 60) * 1_000_000_000n;

interface DateWiseSalesTableProps {
  dailySales: DailySales[];
  orders: FinalizedOrder[];
  isLoading?: boolean;
}

interface DayRow {
  dateLabel: string;
  billCount: number;
  totalSale: bigint;
}

function buildRows(dailySales: DailySales[], orders: FinalizedOrder[]): DayRow[] {
  const billCountMap = new Map<string, number>();
  for (const order of orders) {
    const label = formatDate(order.timestamp);
    billCountMap.set(label, (billCountMap.get(label) ?? 0) + 1);
  }

  const rows: DayRow[] = dailySales.map((ds) => {
    const nsTimestamp = ds.date * DAY_IN_NS;
    const dateLabel = formatDate(nsTimestamp);
    return {
      dateLabel,
      billCount: billCountMap.get(dateLabel) ?? 0,
      totalSale: ds.totalSales,
    };
  });

  const sorted = dailySales
    .map((ds, i) => ({ ds, row: rows[i] }))
    .sort((a, b) => (a.ds.date < b.ds.date ? -1 : a.ds.date > b.ds.date ? 1 : 0))
    .map(({ row }) => row);

  return sorted;
}

export default function DateWiseSalesTable({
  dailySales,
  orders,
  isLoading,
}: DateWiseSalesTableProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded" />
          ))}
        </div>
      </Card>
    );
  }

  const rows = buildRows(dailySales, orders);

  if (rows.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">No sales data in this date range.</p>
      </Card>
    );
  }

  const grandTotal = rows.reduce((sum, row) => sum + row.totalSale, 0n);
  const totalBills = rows.reduce((sum, row) => sum + row.billCount, 0);

  return (
    <Card className="overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="text-xs font-semibold">Date</TableHead>
            <TableHead className="text-xs font-semibold text-center w-28">Total Bills</TableHead>
            <TableHead className="text-xs font-semibold text-right w-32">Total Sale</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.dateLabel}>
              <TableCell className="text-sm py-2.5">{row.dateLabel}</TableCell>
              <TableCell className="text-sm py-2.5 text-center font-medium">
                {row.billCount > 0 ? (
                  <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold min-w-[2rem]">
                    {row.billCount}
                  </span>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-sm py-2.5 text-right font-semibold text-primary">
                {formatCurrency(row.totalSale)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-secondary/30 font-bold">
            <TableCell className="text-sm py-2.5 font-bold">Grand Total</TableCell>
            <TableCell className="text-sm py-2.5 text-center font-bold">
              {totalBills > 0 ? (
                <span className="inline-flex items-center justify-center bg-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs font-bold min-w-[2rem]">
                  {totalBills}
                </span>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className="text-sm py-2.5 text-right font-bold text-primary">
              {formatCurrency(grandTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
