# Staff UI redesign

## Changes
- Replaced the dark hero, metric cards, English eyebrows and repeated status pills with a compact shop header and a column-based order queue.
- Kept the shop's teal palette and Thai typography. Queue actions are outlined; red is reserved for preparation actions.
- Simplified the order summary, product rows and scan station. Added a distinct search-empty state and accessible progress indicator.
- Preserved real order reads and browser-local mock preparation. No backend mutation was added.

## Verification
- Targeted ESLint passed for the three staff components.
- `npx.cmd tsc --noEmit` passed.
- `node scripts/verify-staff-layout.cjs` passed against an isolated API fixture: queue, search, start, invalid barcode, incomplete completion guard, scan counts and completion.
- Reviewed desktop queue/detail and mobile detail screenshots under `artifacts/staff-layout/`.
- Mobile detail at 390px had no horizontal overflow; the browser recorded no page errors.

## Limitations and next steps
- Runtime checks used synthetic data and an isolated browser context, not an authenticated live staff transaction or physical scanner.
- Backend start/scan/complete integration remains pending. No production deployment or full build was run for this redesign.
- Review the new layout with staff using representative multi-item orders before backend integration.

## Files
- `src/components/staff/staff-orders-header.tsx`
- `src/components/staff/staff-order-queue.tsx`
- `src/components/staff/staff-order-detail.tsx`
- `scripts/verify-staff-layout.cjs`

## Git handoff
- Scoped the commit to staff routes, UI, read-only order helpers, barcode mapping/types, route shell and verification documentation.
- Left unrelated storefront, product, membership and manual changes uncommitted.
- `git diff --cached --check` passed. TypeScript also passed against an isolated export of the exact staged files, excluding unrelated working-tree changes.
