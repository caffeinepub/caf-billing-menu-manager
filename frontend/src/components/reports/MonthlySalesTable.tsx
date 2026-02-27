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
import { formatCurrency } from "@/lib/utils";

interface MonthlySalesTableProps {
  data: Array<[bigint, bigint]>;
  isLoading?: boolean;
}

// Backend uses 30-day months approximation: month = timestamp / (30 * dayInNanoseconds)
const DAY_IN_NS = BigInt(24 * 60 * 60) * 1_000_000_000n;
const MONTH_IN_NS = 30n * DAY_IN_NS;

function formatMonthYear(monthIndex: bigint): string {
  const nsTimestamp = monthIndex * MONTH_IN_NS;
  if (nsTimestamp === 0n) {
    return new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  const ms = Number(nsTimestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export default function MonthlySalesTable({ data, isLoading }: MonthlySalesTableProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">No monthly sales data available.</p>
      </Card>
    );
  }

  const sorted = [...data].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const grandTotal = sorted.reduce((sum, [, total]) => sum + total, 0n);

  return (
    <Card className="overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="text-xs font-semibold">Month</TableHead>
            <TableHead className="text-xs font-semibold text-right w-36">Total Sales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(([monthIndex, totalSales]) => (
            <TableRow key={monthIndex.toString()}>
              <TableCell className="text-sm py-2.5 font-medium">
                {formatMonthYear(monthIndex)}
              </TableCell>
              <TableCell className="text-sm py-2.5 text-right font-semibold text-primary">
                {formatCurrency(totalSales)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-secondary/30 font-bold">
            <TableCell className="text-sm py-2.5 font-bold">Grand Total</TableCell>
            <TableCell className="text-sm py-2.5 text-right font-bold text-primary">
              {formatCurrency(grandTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
