# Specification

## Summary
**Goal:** Fix the menu failing to load on the Menu Management page.

**Planned changes:**
- Investigate and fix the root cause of the `getMenuItems` backend call failing to return seeded menu items
- Ensure the frontend correctly handles the response from `getMenuItems` without errors
- Verify the auto-seed logic in `MenuManagement.tsx` runs successfully when the menu is empty on first load
- Ensure the Order page accordion also loads menu items correctly

**User-visible outcome:** The Menu Management page displays menu items grouped by category without any error state, and the Order page accordion also loads menu items correctly.
