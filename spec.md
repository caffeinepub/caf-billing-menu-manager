# Specification

## Summary
**Goal:** Add a "Clear All Data" admin feature that resets all persistent app data (orders, menu items, categories, user profiles) for a fresh start.

**Planned changes:**
- Add a backend `clearAllData` function accessible only to admin/controller that wipes all stored orders, menu items, categories, and user profiles
- Add a "Clear All Data" button in the admin section of the frontend, visible only to authenticated admin users
- Show a confirmation dialog warning before executing the reset
- After a successful reset, invalidate all React Query caches (orders, menu items, categories, reports) so the UI reflects empty state immediately
- Display a success toast/notification after clearing is complete

**User-visible outcome:** Admin users can clear all app data in one action via a confirmed button press, and the UI immediately reflects the empty state with a success notification.
