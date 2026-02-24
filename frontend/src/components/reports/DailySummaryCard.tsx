import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { formatCurrencyBigInt } from '@/lib/utils';

interface DailySummaryCardProps {
  total: bigint;
  itemCount: bigint;
  isLoading?: boolean;
}

export default function DailySummaryCard({ total, itemCount, isLoading }: DailySummaryCardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Revenue",
      value: formatCurrencyBigInt(total),
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Items Sold',
      value: itemCount.toString(),
      icon: ShoppingBag,
      color: 'text-accent-foreground',
      bg: 'bg-accent/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(stat => (
        <Card key={stat.label} className="shadow-xs">
          <CardContent className="p-3">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="font-bold text-base text-foreground leading-tight">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
