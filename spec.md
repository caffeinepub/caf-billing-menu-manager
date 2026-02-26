# Specification

## Summary
**Goal:** Remove the Menu tab from the bottom navigation bar and make the Order page the default landing page of the Café Billing Manager app.

**Planned changes:**
- Change the default route `/` to redirect to `/order` instead of `/menu`
- Remove the "Menu" tab from the bottom navigation bar, leaving only "Order" and "Reports" tabs
- Keep the `/menu` route accessible for admin users, and add an admin-only link (e.g., in the app header) to reach Menu Management

**User-visible outcome:** When users open the app, they land directly on the Order page. The bottom navigation only shows "Order" and "Reports." Admin users can still access Menu Management via a link in the header.
