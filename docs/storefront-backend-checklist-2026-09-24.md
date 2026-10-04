# Storefront Backend Checklist Handoff

Date: 2026-09-24

## Objective

Prepare the storefront for the backend checklist shared on 2026-09-24. No backend source or API implementation was changed.

## Implemented

- Registration collects the existing member code and one of seven customer types, submits both fields, and shows the next-delivery member-code notice when no code was entered.
- The account profile can update the customer's type through `PATCH /users/me`, alongside the existing member-code field.
- User mapping and profile support `memberCode`, `memberCodeClaim`, and `customerType`. The profile member-code field is hidden after a member code is assigned.
- Product units map `displayLabel` and quantity price tiers. Unit labels use the display label across product, search, campaign, cart, and order surfaces.
- Product listing requests include `expandUnits=true`; product grids expand listing units into separate cards and use listing-specific React keys. Add-to-cart uses the selected listing unit ID.
- Product detail shows tier prices. Cart shows the next tier threshold and prefers the server-provided `lineTotal` and `unitPrice` values.
- Delivery-note labels were already present in the current order document UI and were not changed as part of this checklist implementation.

## Verification Evidence

- `git diff --check` completed without whitespace errors.
- Local HTTP checks returned 200 for `/register`, `/account/profile`, `/cart`, `/checkout`, `/categories`, `/categories/วัตถุดิบ`, `/deals`, and `/featured`.
- `npm.cmd exec tsc -- --noEmit --incremental false` reported no errors under `src`; it exited non-zero because `@playwright/test` is unavailable for `e2e/customer-smoke.spec.ts` and `playwright.config.ts`, causing cascading implicit-any errors in that e2e file.
- Follow-up profile/customer-type UI change: targeted ESLint passed with one existing React Hook Form `watch()` compiler warning; `npm.cmd run build` passed after restoring the declared `@playwright/test` dependency locally without changing package manifests.
- No authenticated registration, profile update, product pricing, or cart transaction was run.

## Limitations

- The backend checkout currently present on disk did not contain the checklist fields in its source. The exact live `priceTiers` payload and `expandUnits=true` response shape therefore remain unverified. The mapper accepts common tier key variants; align it with the deployed API payload when available.
- The deployed backend's support for updating `customerType` via `PATCH /users/me` has not been verified. A separate free-text field for the `อื่นๆ` option was not added because the API contract does not define one.
- Unit cards fall back to expanding each product's units when the API does not return `listingUnit`.

## Next Steps

- Confirm the deployed API's `listingUnit`, `displayLabel`, and `priceTiers` response examples.
- Run authenticated smoke checks for registration with/without member code, profile member-code assignment including the API 403 case, and quantity updates across price tiers.
