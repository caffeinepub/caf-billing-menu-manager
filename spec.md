# Specification

## Summary
**Goal:** Build a Café Billing & Menu Management app for café staff to manage menus, take orders, generate bills, and view sales reports — with a warm, mobile-first UI.

**Planned changes:**
- **Menu Management screen:** Add, edit, and delete menu items (name, price, category). Items grouped and displayed by category. Data persisted in backend.
- **Order Taking screen:** Full menu displayed by category; tap items to add to current order, adjust quantities (increment/decrement/remove), real-time order summary with line totals.
- **Bill Calculation:** Subtotal, configurable tax (percentage), optional discount (flat or percentage), and final total — all updating in real time.
- **Bill Generation & Print:** Finalize order to produce a receipt-style bill (café name, date/time, items, subtotal, tax, discount, total). "Print Bill" button triggers browser print dialog. Finalized orders saved as sales records. Order screen resets after finalization.
- **Sales Reports screen:** Today's total sales summary, item-wise sales (quantity + revenue per item), date-wise sales history with date range filter — all derived from persisted sales records.
- **Visual theme:** Earthy warm tones (espresso brown, cream, amber), clean sans-serif typography, bottom tab navigation (Menu, Order, Reports), large tap targets, mobile-first layout.

**User-visible outcome:** Café staff can manage the menu, take orders, calculate totals with tax and discounts, print bills, and review daily/item-wise/date-wise sales — all from a fast, warm-themed mobile interface.
