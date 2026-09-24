# Storefront and staff UI branch handoff

## Scope
- Branch: `feat/storefront-staff-full-ui`.
- Includes the complete local storefront source changes (8392197) and staff workspace (5888f95).
- Preserves the local implementation for backend review; does not merge into or replace master.
- Excludes generated screenshots/artifacts, the separate Guie manual directory, and the unrelated Mermaid preview document.

## Decisions for backend review
- This branch labels the customer document as a delivery note; newer master uses a purchase order with a staff approval gate.
- Review the approval gate, out-of-stock handling, and recent checkout/upload fixes on master when integrating. This branch intentionally does not resolve those differences.
- Staff order reads use the API, but preparation/scanning/completion remain browser-local mocks and do not update backend order status.

## Verification and limitations
- Confirmed all local source changes are committed: `git diff --name-only HEAD -- src` was empty before branch creation.
- Prior staff checks and fixture-based UI verification are documented in `staff-ui-redesign-2026-09-24.md`.
- No new build, runtime test, or production deployment was performed for this branch publishing task.
- Next step: backend team compares this branch against master and decides which changes to integrate.
