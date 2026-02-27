import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DailySummaryCard from '@/components/reports/DailySummaryCard';
import PreviousDaySalesCard from '@/components/reports/PreviousDaySalesCard';
import ItemWiseSalesTable from '@/components/reports/ItemWiseSalesTable';
import MonthlySalesTable from '@/components/reports/MonthlySalesTable';
import DateWiseSalesTable from '@/components/reports/DateWiseSalesTable';
import { ClipboardList } from 'lucide-react';

export default function SalesReports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="flex flex-col min-h-full bg-cream/30">
      <div className="p-4 pb-2">
        <h1 className="text-xl font-display font-bold text-espresso">Sales Reports</h1>
        <p className="text-sm text-espresso/60">Track your café's performance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col px-4">
        <TabsList className="grid grid-cols-4 mb-4 bg-latte/20">
          <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
          <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
          <TabsTrigger value="dates" className="text-xs">Dates</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 flex-1">
          <DailySummaryCard />
          <PreviousDaySalesCard />
        </TabsContent>

        <TabsContent value="items" className="flex-1">
          <ItemWiseSalesTable />
        </TabsContent>

        <TabsContent value="monthly" className="flex-1">
          <MonthlySalesTable />
        </TabsContent>

        <TabsContent value="dates" className="flex-1">
          <DateWiseSalesTable />
        </TabsContent>
      </Tabs>

      {/* Order Details link */}
      <div className="p-4 pt-2">
        <button
          onClick={() => navigate({ to: '/order-details' })}
          className="w-full flex items-center justify-center gap-2 py-3 border border-latte/40 rounded-xl text-espresso/70 hover:bg-latte/10 transition-colors text-sm"
        >
          <ClipboardList className="w-4 h-4" />
          View All Order Details
        </button>
      </div>
    </div>
  );
}
