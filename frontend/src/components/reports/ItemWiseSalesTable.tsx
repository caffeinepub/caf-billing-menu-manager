import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { useItemWiseSales } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function ItemWiseSalesTable() {
  const { data: items = [], isLoading } = useItemWiseSales();

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  return (
    <Card className="border-latte/30 shadow-card">
      <CardHeader className="pb-2 pt-4 px-4">
        <h3 className="font-semibold text-espresso text-sm">Item-wise Sales (All Time)</h3>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {items.length === 0 ? (
          <p className="text-center text-espresso/50 text-sm py-8">No sales data yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs pl-4">Item</TableHead>
                <TableHead className="text-xs text-right">Qty</TableHead>
                <TableHead className="text-xs text-right pr-4">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.name}>
                  <TableCell className="text-xs pl-4 font-medium">{item.name}</TableCell>
                  <TableCell className="text-xs text-right">{item.quantity}</TableCell>
                  <TableCell className="text-xs text-right pr-4">{formatCurrency(item.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
