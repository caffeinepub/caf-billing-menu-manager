import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, ShoppingCart } from 'lucide-react';
import BillLayout from '../components/bill/BillLayout';
import type { ActiveOrderItem, DiscountType } from '../hooks/useOrderState';

interface BillData {
  items: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  timestamp: number;
  discountType: DiscountType;
  discountValue: number;
}

export default function BillView() {
  const navigate = useNavigate();
  const [billData, setBillData] = useState<BillData | null>(null);
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('billData');
      if (!raw) {
        setParseError(true);
        return;
      }
      const parsed: BillData = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) {
        setParseError(true);
        return;
      }
      setBillData(parsed);
    } catch {
      setParseError(true);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    sessionStorage.removeItem('billData');
    navigate({ to: '/order' });
  };

  if (parseError) {
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

  if (!billData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-sm">Loading bill…</p>
      </div>
    );
  }

  // Convert plain number items back to ActiveOrderItem shape (bigint fields)
  const activeItems: ActiveOrderItem[] = billData.items.map(i => ({
    menuItemId: BigInt(i.menuItemId),
    name: i.name,
    quantity: i.quantity,
    price: BigInt(i.price),
  }));

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
            items={activeItems}
            subtotal={billData.subtotal}
            discountType={billData.discountType}
            discountValue={billData.discountValue}
            discountAmount={billData.discountAmount}
            total={billData.total}
            timestamp={BigInt(billData.timestamp)}
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
