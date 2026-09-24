# Staff Order UI Summary

Date: 2026-09-24

## Objective

Create a staff-only order preparation flow separate from the customer storefront. Order data is read from the backoffice API; barcode scanning and preparation progress are explicitly mock-only until backend endpoints are available.

## Implemented

- `/staff/orders` loads `preparing` orders from `GET /admin/orders`; `/staff/orders/[id]` loads the selected order from `GET /admin/orders/:id`.
- Order detail displays the API order's product image, name, unit label, SKU/barcode, customer, and delivery address.
- The barcode input, next-item scan button, counters, start/complete actions, and queue hiding are a browser-local mock. They do not call a scanner device, update order notes, or change backend order status; mock progress can be reset from the detail page.
- Kept the staff screen aligned with the Phuket Grocery storefront: shop logo, teal brand header, pale blue-tinted canvas, teal scan/status accents, and red primary actions.
- Aligned the staff screen with the Phuket Grocery storefront: reused the shop logo, teal brand header, pale blue-tinted canvas, teal scanning/status accents, and red completion action.
- Added a staff shell and suppresses the storefront header/footer only on `/staff` routes.
- The real order queue requires a valid backoffice `ADMIN` token. Product/order data is real, while scan progress and preparation completion remain mock data in the current browser.

## Previous Verification

- Live unauthenticated API check confirmed `/backend/products` returns real catalog items and unit SKUs; `/backend/admin/orders` correctly requires authentication (401 without a token).
- Targeted ESLint and production build passed after the API-backed queue and detail flow were added.
- Authenticated order retrieval and barcode scan flow had not yet been verified in the earlier implementation.

## Backend Handoff

- The current backend has no distinct `preparation_completed` order status or scan-progress endpoint. Keep the UI mock-only until the backend provides endpoints to start preparation, record scan progress, and submit completion.
- Add a first-class preparation state/endpoint and include it in the admin order list response before wiring mock actions to production order mutations.
- Backend `ADMIN` authorization is enforced by `/admin/orders`; confirm staff accounts use that role.

## Current Mock Implementation

- Starting, scanning, completing, and resetting are stored per order in browser `localStorage`; the mock queue hides completed orders on that device.
- A reset action clears local mock state and restores the order to the queue without changing backend data.
- The queue can reveal orders hidden by a completed mock so staff can reopen and reset the demo.
- The mock scan button uses the next outstanding order item's barcode/SKU, so the flow can be demonstrated without a physical scanner.
