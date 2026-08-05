import { defineConfig } from "@playwright/test";

/**
 * Storefront smoke tests. Servers are started by phuket-backend/scripts/e2e.sh,
 * which also sets API_PROXY_TARGET so /backend/* proxies to the local API
 * instead of the remote default baked into next.config.ts.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.STOREFRONT_URL ?? "http://localhost:3002",
    trace: "on-first-retry",
  },
});
