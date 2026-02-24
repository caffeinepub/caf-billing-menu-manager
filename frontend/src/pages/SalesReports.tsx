import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDailySalesSummary, useItemWiseSales, useDateWiseSalesHistory } from '../hooks/useQueries';
import DailySummaryCard from '../components/reports/DailySummaryCard';
import ItemWiseSalesTable from '../components/reports/ItemWiseSalesTable';
import DateWiseSalesTable from '../components/reports/DateWiseSalesTable';
import DateRangeFilter from '../components/reports/DateRangeFilter';
import { dateToNanoseconds, startOfDay, endOfDay } from '../lib/utils';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function thirtyDaysAgoStr() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
}

export default function SalesReports() {
  const [startDate, setStartDate] = useState(thirtyDaysAgoStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [appliedStart, setAppliedStart] = useState(thirtyDaysAgoStr());
  const [appliedEnd, setAppliedEnd] = useState(todayStr());

  const startNs = dateToNanoseconds(startOfDay(new Date(appliedStart)));
  const endNs = dateToNanoseconds(endOfDay(new Date(appliedEnd)));

  const { data: dailySummary, isLoading: dailyLoading } = useDailySalesSummary();
  const { data: itemWiseSales, isLoading: itemLoading } = useItemWiseSales();
  const { data: dateWiseHistory, isLoading: historyLoading } = useDateWiseSalesHistory(startNs, endNs);

  const handleApplyFilter = useCallback(() => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  }, [startDate, endDate]);

  return (
    <div className="px-4 py-5 space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">Sales Reports</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Track your café's performance</p>
      </div>

      {/* Daily Summary */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Today's Summary</h3>
        <DailySummaryCard
          total={dailySummary?.total ?? 0n}
          tax={dailySummary?.tax ?? 0n}
          itemCount={dailySummary?.itemCount ?? 0n}
          isLoading={dailyLoading}
        />
      </section>

      {/* Tabs for Item-wise and Date-wise */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList className="w-full h-10">
          <TabsTrigger value="items" className="flex-1 text-sm">Item-wise Sales</TabsTrigger>
          <TabsTrigger value="dates" className="flex-1 text-sm">Date-wise History</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-3 mt-0">
          <p className="text-xs text-muted-foreground">All-time sales by item</p>
          <ItemWiseSalesTable
            data={itemWiseSales ?? []}
            isLoading={itemLoading}
          />
        </TabsContent>

        <TabsContent value="dates" className="space-y-3 mt-0">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApply={handleApplyFilter}
          />
          <DateWiseSalesTable
            data={dateWiseHistory ?? []}
            isLoading={historyLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="pt-4 pb-2 text-center text-xs text-muted-foreground">
        <p>
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'cafe-billing-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
          {' '}· © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
