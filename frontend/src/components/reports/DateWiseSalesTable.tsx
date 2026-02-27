import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { useDateWiseSales } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DateWiseSalesTable() {
  const { data: dates = [], isLoading } = useDateWiseSales();

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  return (
    <Card className="border-latte/30 shadow-card">
      <CardHeader className="pb-2 pt-4 px-4">
        <h3 className="font-semibold text-espresso text-sm">Date-wise Sales</h3>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {dates.length === 0 ? (
          <p className="text-center text-espresso/50 text-sm py-8">No date-wise data yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs pl-4">Date</TableHead>
                <TableHead className="text-xs text-right">Bills</TableHead>
                <TableHead className="text-xs text-right pr-4">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dates.map(d => (
                <TableRow key={d.date}>
                  <TableCell className="text-xs pl-4 font-medium">{d.date}</TableCell>
                  <TableCell className="text-xs text-right">{d.billCount}</TableCell>
                  <TableCell className="text-xs text-right pr-4">{formatCurrency(d.totalRevenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
