import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useDailySalesSummary } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailySummaryCard() {
  const { data, isLoading } = useDailySalesSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  const revenue = data?.totalRevenue ?? BigInt(0);
  const items = data?.totalItems ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="bg-espresso text-cream border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-warm" />
            <span className="text-xs text-cream/70">Today's Revenue</span>
          </div>
          <p className="text-xl font-bold font-display">{formatCurrency(revenue)}</p>
        </CardContent>
      </Card>

      <Card className="bg-amber-warm text-espresso border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-espresso/70" />
            <span className="text-xs text-espresso/70">Items Sold</span>
          </div>
          <p className="text-xl font-bold font-display">{items}</p>
        </CardContent>
      </Card>
    </div>
  );
}
