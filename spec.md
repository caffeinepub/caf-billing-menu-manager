# Specification

## Summary
**Goal:** Fix the menu failing to load on the Menu Management and Order Taking screens.

**Planned changes:**
- Investigate and fix the backend query responsible for fetching all menu items so it returns data correctly.
- Resolve any actor initialization, deserialization, or migration errors preventing menu data from loading.
- Ensure the frontend MenuManagement page successfully retrieves and displays menu items grouped by category.
- Ensure the frontend OrderTaking page successfully retrieves and displays menu items grouped by category.
- Re-seed or re-migrate menu data if the store was left empty due to a migration issue, restoring all items across categories.

**User-visible outcome:** The Menu Management and Order Taking screens both load and display all menu items grouped by category with no error messages.
