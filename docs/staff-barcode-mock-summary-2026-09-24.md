# Staff Barcode Mock Summary

Date: 2026-09-24

## Objective

Provide a demonstrable staff order-preparation and barcode-scanning UI before the real scanner and backoffice workflow APIs are available.

## Changes

- Keep loading order and product details from the authenticated backoffice read APIs.
- Make start, scan counts, completion, reset, and queue hiding browser-local mock state only. These actions do not send `PATCH` requests or alter backend orders.
- Add manual Barcode/SKU entry and a button that simulates scanning the next outstanding item without a physical scanner.
- Label the mock boundary in the UI and allow completed mock orders to be shown and reset for another demo.
- Restyle the staff queue as an operations view with queue totals, search, readable order rows, and a login recovery action.
- Restyle order checking as a responsive split workspace: order items on the left and a sticky mock scanner/progress panel on desktop, stacked on mobile.
- Align the staff header and neutral/teal/red palette with the Phuket Grocery storefront.
- Update the staff UI summary to reflect the current API-read/mock-write boundary.

## Verification

- `npx.cmd eslint src/components/staff/staff-orders-header.tsx src/components/staff/staff-order-detail.tsx src/components/staff/staff-order-queue.tsx` passed.
- `npx.cmd tsc --noEmit` passed.
- `npm.cmd run build` passed; Next.js generated the staff order routes.
- Browser check confirmed the queue redesign and the explicit login action when the browser has no staff token. An authenticated queue/detail visual check was not completed in this pass because the browser session was logged out.

## Limitations and Next Step

- No physical scanner/camera integration or backoffice scan-progress endpoint is connected.
- Scan validation uses Barcode/SKU values from the loaded order snapshot; mock progress is stored in the current browser only.
- When the backoffice API is ready, replace the local mock handlers with the agreed start, scan-progress, and completion endpoints; keep the visible mock notice until that integration is verified.
