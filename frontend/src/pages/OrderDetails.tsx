import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllOrderDetails } from "../hooks/useQueries";
import type { FinalizedOrder } from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import OrderDetailsCard from "../components/order-details/OrderDetailsCard";

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="px-4 py-3 space-y-2">
            {[1, 2].map((j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border/60 space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderDetails() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: orders,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAllOrderDetails();

  // Sort orders in reverse chronological order (highest ID first)
  const sortedOrders: FinalizedOrder[] = orders
    ? [...orders].sort((a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0))
    : [];

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-5 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/reports" })}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Order Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">All finalized orders</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <ShieldAlert size={28} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Login Required</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please log in to view order details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/reports" })}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Order Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isLoading
                ? "Loading orders…"
                : `${sortedOrders.length} order${sortedOrders.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 text-xs h-8"
        >
          <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load orders.{" "}
          <button
            onClick={() => refetch()}
            className="underline underline-offset-2 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <OrderDetailsSkeleton />}

      {/* Empty State */}
      {!isLoading && !error && sortedOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <ClipboardList size={28} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No Orders Yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Finalized orders will appear here.
            </p>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && sortedOrders.length > 0 && (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderDetailsCard key={order.id.toString()} order={order} />
          ))}
        </div>
      )}

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
