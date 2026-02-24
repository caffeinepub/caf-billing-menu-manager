import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, ShoppingCart } from 'lucide-react';
import BillLayout from '../components/bill/BillLayout';
import type { ActiveOrderItem, DiscountType } from '../hooks/useOrderState';

interface BillData {
  items: ActiveOrderItem[];
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  total: number;
  timestamp: string; // stored as string with 'n' suffix for bigint
}

function parseBillData(raw: string): BillData & { timestamp: bigint } | null {
  try {
    const parsed = JSON.parse(raw, (_, v) => {
      if (typeof v === 'string' && v.endsWith('n') && /^\d+n$/.test(v)) {
        return BigInt(v.slice(0, -1));
      }
      return v;
    });
    return parsed;
  } catch {
    return null;
  }
}

export default function BillView() {
  const navigate = useNavigate();
  const [billData, setBillData] = useState<(BillData & { timestamp: bigint }) | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('currentBill');
    if (raw) {
      const parsed = parseBillData(raw);
      setBillData(parsed);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    sessionStorage.removeItem('currentBill');
    navigate({ to: '/order' });
  };

  if (!billData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <ShoppingCart size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-base">No bill to display</h3>
        <p className="text-sm text-muted-foreground mt-1">Finalize an order first to see the bill.</p>
        <Button className="mt-4" onClick={() => navigate({ to: '/order' })}>
          Go to Order
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar - hidden on print */}
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

      {/* Bill Content */}
      <div className="py-6 px-4">
        <div className="bg-white rounded-xl shadow-card overflow-hidden border border-border">
          <BillLayout
            items={billData.items}
            subtotal={billData.subtotal}
            discountType={billData.discountType}
            discountValue={billData.discountValue}
            discountAmount={billData.discountAmount}
            total={billData.total}
            timestamp={billData.timestamp}
          />
        </div>

        <div className="no-print mt-4 space-y-3">
          <Button
            className="w-full h-12 gap-2 text-base font-semibold"
            onClick={handlePrint}
          >
            <Printer size={18} />
            Print Bill
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 gap-2"
            onClick={handleNewOrder}
          >
            <ShoppingCart size={16} />
            Start New Order
          </Button>
        </div>
      </div>
    </div>
  );
}
