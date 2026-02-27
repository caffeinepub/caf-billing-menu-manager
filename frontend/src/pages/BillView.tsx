import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, AlertCircle } from "lucide-react";
import BillLayout from "@/components/bill/BillLayout";
import type { ActiveOrderItem } from "@/hooks/useOrderState";

interface StoredBillItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
}

interface StoredBillData {
  id: number;
  items: StoredBillItem[];
  subtotal: number;
  discount: number;
  total: number;
  timestamp: number;
}

interface ParsedBill {
  orderId: bigint;
  items: ActiveOrderItem[];
  subtotal: bigint;
  discountAmount: bigint;
  total: bigint;
  timestamp: bigint;
}

function parseBillData(raw: unknown): ParsedBill | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;

  if (
    typeof d.id !== "number" ||
    !Array.isArray(d.items) ||
    typeof d.subtotal !== "number" ||
    typeof d.discount !== "number" ||
    typeof d.total !== "number"
  ) {
    return null;
  }

  const items: ActiveOrderItem[] = (d.items as StoredBillItem[]).map((item) => ({
    menuItemId: BigInt(item.menuItemId ?? 0),
    name: typeof item.name === "string" ? item.name : "",
    quantity: BigInt(item.quantity ?? 1),
    price: BigInt(item.price ?? 0),
  }));

  return {
    orderId: BigInt(d.id as number),
    items,
    subtotal: BigInt(d.subtotal as number),
    discountAmount: BigInt(d.discount as number),
    total: BigInt(d.total as number),
    timestamp: BigInt(typeof d.timestamp === "number" ? d.timestamp : 0),
  };
}

export default function BillView() {
  const navigate = useNavigate();
  const [bill, setBill] = useState<ParsedBill | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("billData");
      if (!raw) {
        setError("No bill data found. Please finalize an order first.");
        return;
      }
      const parsed = JSON.parse(raw);
      const result = parseBillData(parsed);
      if (!result) {
        setError("Bill data is corrupted or missing required fields.");
        return;
      }
      setBill(result);
    } catch {
      setError("Failed to load bill data.");
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    sessionStorage.removeItem("billData");
    navigate({ to: "/order" });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate({ to: "/order" })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Order
        </Button>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-sm">Loading bill…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action bar — hidden on print */}
      <div className="no-print sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={handleNewOrder} className="gap-1.5 h-10">
          <ArrowLeft size={16} />
          New Order
        </Button>
        <h2 className="font-display font-bold text-base text-foreground">Bill</h2>
        <Button size="sm" onClick={handlePrint} className="gap-1.5 h-10">
          <Printer size={16} />
          Print
        </Button>
      </div>

      {/* Bill content */}
      <div className="py-6 px-4">
        <div className="bg-white rounded-xl shadow-card overflow-hidden border border-border">
          <BillLayout
            orderId={bill.orderId}
            items={bill.items}
            subtotal={bill.subtotal}
            discountAmount={bill.discountAmount}
            total={bill.total}
            timestamp={bill.timestamp}
          />
        </div>

        <div className="no-print mt-4 space-y-3">
          <Button className="w-full h-12 gap-2 text-base font-semibold" onClick={handlePrint}>
            <Printer size={18} />
            Print Bill
          </Button>
          <Button variant="outline" className="w-full h-12 gap-2" onClick={handleNewOrder}>
            <ArrowLeft size={16} />
            Start New Order
          </Button>
        </div>
      </div>
    </div>
  );
}
