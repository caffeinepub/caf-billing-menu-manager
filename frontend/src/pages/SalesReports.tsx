import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, ClipboardList, ChevronRight } from "lucide-react";
import {
  useDailySalesSummary,
  useItemWiseSales,
  useGetMonthlyTotalSales,
  usePreviousDaySales,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import DailySummaryCard from "../components/reports/DailySummaryCard";
import ItemWiseSalesTable from "../components/reports/ItemWiseSalesTable";
import MonthlySalesTable from "../components/reports/MonthlySalesTable";
import PreviousDaySalesCard from "../components/reports/PreviousDaySalesCard";

export default function SalesReports() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();

  const {
    data: dailySummary,
    isLoading: dailyLoading,
    error: dailyError,
    refetch: refetchDaily,
    isFetching: dailyFetching,
  } = useDailySalesSummary();

  const {
    data: itemWiseSales,
    isLoading: itemLoading,
    refetch: refetchItems,
    isFetching: itemFetching,
  } = useItemWiseSales();

  const {
    data: monthlyTotals,
    isLoading: monthlyLoading,
    refetch: refetchMonthly,
    isFetching: monthlyFetching,
  } = useGetMonthlyTotalSales();

  const {
    refetch: refetchPreviousDay,
    isFetching: previousDayFetching,
  } = usePreviousDaySales();

  const handleRefreshAll = useCallback(() => {
    refetchDaily();
    refetchItems();
    refetchMonthly();
    refetchPreviousDay();
  }, [refetchDaily, refetchItems, refetchMonthly, refetchPreviousDay]);

  const isAnyFetching =
    dailyFetching || itemFetching || monthlyFetching || previousDayFetching;

  const displayRevenue = dailySummary?.total ?? 0n;
  const displayItemCount = dailySummary?.itemCount ?? 0n;

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-5 space-y-5">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Sales Reports</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Track your café's performance</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <ShieldAlert size={28} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Login Required</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please log in to view sales reports.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Sales Reports</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Track your café's performance</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          disabled={isAnyFetching}
          className="gap-1.5 text-xs h-8"
        >
          <RefreshCw size={13} className={isAnyFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Daily Summary */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Today's Summary</h3>
        {dailyError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Failed to load today's summary.{" "}
            <button
              onClick={() => refetchDaily()}
              className="underline underline-offset-2 font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <DailySummaryCard
            total={displayRevenue}
            itemCount={displayItemCount}
            isLoading={dailyLoading}
          />
        )}
      </section>

      {/* Previous Day Sales */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Yesterday's Sales</h3>
        <PreviousDaySalesCard />
      </section>

      {/* Tabs */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList className="w-full h-10">
          <TabsTrigger value="items" className="flex-1 text-xs">
            Item-wise Sales
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 text-xs">
            Monthly Sales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-3 mt-0">
          <p className="text-xs text-muted-foreground">All-time sales by item</p>
          <ItemWiseSalesTable data={itemWiseSales ?? []} isLoading={itemLoading} />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-3 mt-0">
          <p className="text-xs text-muted-foreground">Total sales grouped by month</p>
          <MonthlySalesTable data={monthlyTotals ?? []} isLoading={monthlyLoading} />
        </TabsContent>
      </Tabs>

      {/* Order Details Navigation */}
      <button
        onClick={() => navigate({ to: "/order-details" })}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors shadow-sm group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-espresso/10 flex items-center justify-center">
            <ClipboardList size={17} className="text-espresso" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Order Details</p>
            <p className="text-xs text-muted-foreground">View all finalized orders & items</p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-muted-foreground group-hover:text-foreground transition-colors"
        />
      </button>

      {/* Footer */}
      <footer className="pt-4 pb-2 text-center text-xs text-muted-foreground">
        <p>
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname || "cafe-billing-app"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>{" "}
          · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
