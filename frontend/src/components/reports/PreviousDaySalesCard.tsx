import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { usePreviousDaySales } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function PreviousDaySalesCard() {
  const { data, isLoading } = usePreviousDaySales();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  const revenue = data?.revenue ?? BigInt(0);
  const itemsSold = data?.itemsSold ?? 0;

  return (
    <div>
      <p className="text-xs text-espresso/50 mb-2 font-medium uppercase tracking-wide">Yesterday</p>
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-latte/30 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-warm" />
              <span className="text-xs text-espresso/70">Revenue</span>
            </div>
            <p className="text-xl font-bold font-display text-espresso">{formatCurrency(revenue)}</p>
          </CardContent>
        </Card>

        <Card className="border-latte/30 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-amber-warm" />
              <span className="text-xs text-espresso/70">Items Sold</span>
            </div>
            <p className="text-xl font-bold font-display text-espresso">{itemsSold}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
