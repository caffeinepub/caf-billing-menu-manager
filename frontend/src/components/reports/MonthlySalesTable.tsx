import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { useGetMonthlyTotalSales } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function MonthlySalesTable() {
  const { data: months = [], isLoading } = useGetMonthlyTotalSales();

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  return (
    <Card className="border-latte/30 shadow-card">
      <CardHeader className="pb-2 pt-4 px-4">
        <h3 className="font-semibold text-espresso text-sm">Monthly Sales</h3>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {months.length === 0 ? (
          <p className="text-center text-espresso/50 text-sm py-8">No monthly data yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs pl-4">Month</TableHead>
                <TableHead className="text-xs text-right">Orders</TableHead>
                <TableHead className="text-xs text-right pr-4">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.map(m => (
                <TableRow key={m.month}>
                  <TableCell className="text-xs pl-4 font-medium">{m.label}</TableCell>
                  <TableCell className="text-xs text-right">{m.orderCount}</TableCell>
                  <TableCell className="text-xs text-right pr-4">{formatCurrency(m.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
