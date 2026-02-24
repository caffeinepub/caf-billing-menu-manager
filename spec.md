# Specification

## Summary
**Goal:** Remove tax entirely from the Simple Sips Cafe application — including the order screen, printed bill, backend order records, and sales reports.

**Planned changes:**
- Remove the tax rate input and tax line from `OrderTotalsPanel`; update `useOrderState` so the final total is subtotal minus discount only
- Remove the tax line from the `BillLayout` print receipt so it shows only subtotal, optional discount, and final total
- Update backend `finalizeOrder` logic to store tax as 0 (or omit it) and compute total as subtotal minus discount
- Remove the "Tax Collected" stat card from `DailySummaryCard` on the Sales Reports screen

**User-visible outcome:** Tax no longer appears anywhere in the app — not on the order screen, printed receipts, or sales reports. Totals are calculated and displayed as subtotal minus discount only.
