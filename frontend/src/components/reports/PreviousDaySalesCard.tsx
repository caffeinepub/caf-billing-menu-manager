import { CalendarDays, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreviousDaySales } from "../../hooks/useQueries";
import { formatCurrency } from "../../lib/utils";

function getPreviousDayDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

function formatPreviousDay(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PreviousDaySalesCard() {
  const { data, isLoading } = usePreviousDaySales();
  const previousDay = getPreviousDayDate();
  const formattedDate = formatPreviousDay(previousDay);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays size={14} />
        <span>{formattedDate}</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <Skeleton className="h-3 w-20" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-7 w-28 mt-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <Skeleton className="h-3 w-20" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-7 w-16 mt-1" />
            </CardContent>
          </Card>
        </div>
      ) : data === null || data === undefined ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <CalendarDays size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No orders yesterday</p>
            <p className="text-xs text-muted-foreground">
              No orders were placed on {formattedDate}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <TrendingUp size={12} />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xl font-bold text-foreground font-display">
                {formatCurrency(data.totalRevenue)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Receipt size={12} />
                Total Bills
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xl font-bold text-foreground font-display">
                {Number(data.totalBills)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
