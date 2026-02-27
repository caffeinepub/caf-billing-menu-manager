import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface ItemWiseSalesTableProps {
  data: Array<[string, bigint, bigint]>;
  isLoading?: boolean;
}

export default function ItemWiseSalesTable({ data, isLoading }: ItemWiseSalesTableProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">No sales data available yet.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="text-xs font-semibold">Item</TableHead>
            <TableHead className="text-xs font-semibold text-center w-16">Qty</TableHead>
            <TableHead className="text-xs font-semibold text-right w-24">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(([name, qty, revenue]) => (
            <TableRow key={name}>
              <TableCell className="text-sm py-2.5">{name}</TableCell>
              <TableCell className="text-sm py-2.5 text-center font-medium">
                {qty.toString()}
              </TableCell>
              <TableCell className="text-sm py-2.5 text-right font-semibold text-primary">
                {formatCurrency(revenue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
