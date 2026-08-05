import { test, expect, Page } from "@playwright/test";

/**
 * Customer smoke — proves the storefront is really wired to the API.
 * Correctness of pricing/stock/status lives in the API flow suites; this only
 * has to catch broken frontend<->backend wiring.
 */

const CUSTOMER_EMAIL = process.env.E2E_CUSTOMER_EMAIL ?? "customer@phuket.local";
const CUSTOMER_PASSWORD = process.env.E2E_CUSTOMER_PASSWORD ?? "customer123";

/**
 * The consent banner overlays the page on first visit and swallows clicks.
 * Pre-seed the zustand persist key (src/stores/cookie-consent-store.ts) so it
 * never renders, rather than clicking it away on every test.
 */
async function dismissCookieBanner(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "phuket-grocery-cookie-consent",
      JSON.stringify({
        state: {
          status: "accepted",
          acceptedAt: new Date(0).toISOString(),
          preferences: { analytics: false, marketing: false },
        },
        version: 0,
      }),
    );
  });
}

async function login(page: Page) {
  await page.goto("/login");
  // Note the spaces — the backoffice uses a different label string.
  await page.getByLabel("อีเมล หรือ เบอร์โทรศัพท์").fill(CUSTOMER_EMAIL);
  await page.getByLabel("รหัสผ่าน").fill(CUSTOMER_PASSWORD);
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

test.beforeEach(async ({ page }) => {
  await dismissCookieBanner(page);
});

test("customer can log in", async ({ page }) => {
  await login(page);
  // The session is persisted client-side under this key.
  const stored = await page.evaluate(() => window.localStorage.getItem("phuket-grocery-auth"));
  expect(stored).toContain("accessToken");
});

test("wrong credentials are rejected", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("อีเมล หรือ เบอร์โทรศัพท์").fill(CUSTOMER_EMAIL);
  await page.getByLabel("รหัสผ่าน").fill("definitely-wrong");
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL(/\/login/);
});

test("checkout is gated behind login", async ({ page }) => {
  await page.goto("/checkout");
  // Guards run client-side after the auth store rehydrates.
  await expect(page).toHaveURL(/\/login/, { timeout: 20_000 });
});

test("customer adds a product to the cart and reaches checkout", async ({ page }) => {
  await login(page);

  await page.goto("/");
  const addToCart = page.getByTestId("add-to-cart").first();
  await addToCart.waitFor({ state: "visible" });
  await addToCart.click();
  // The button flips to "เพิ่มแล้ว" only after the store accepts the item.
  await expect(addToCart).toContainText("เพิ่มแล้ว");

  await page.goto("/cart");
  const checkout = page.getByTestId("cart-checkout");
  await expect(checkout).toBeVisible();
  await checkout.click();

  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByTestId("place-order")).toBeVisible();
});

test("anonymous visitors are asked to log in before reviewing", async ({ page }) => {
  await page.goto("/");
  const firstProduct = page.locator('a[href^="/products/"]').first();
  await firstProduct.waitFor({ state: "visible", timeout: 20_000 });
  await firstProduct.click();
  await expect(page).toHaveURL(/\/products\//);

  // Reviews sit behind the รีวิว tab; the panel is not mounted until it is active.
  await page.getByRole("button", { name: "รีวิว" }).click();

  await expect(page.getByTestId("review-login-required")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("review-form")).toHaveCount(0);
});

test("a logged-in customer who never bought the product cannot review it", async ({ page }) => {
  await login(page);

  await page.goto("/");
  const firstProduct = page.locator('a[href^="/products/"]').first();
  await firstProduct.waitFor({ state: "visible", timeout: 20_000 });
  await firstProduct.click();
  await expect(page).toHaveURL(/\/products\//);

  // Reviews sit behind the รีวิว tab; the panel is not mounted until it is active.
  await page.getByRole("button", { name: "รีวิว" }).click();

  // Eligibility resolves to one of the three non-form states or the form; the
  // seeded customer has no delivered order for an arbitrary product.
  await expect(page.getByTestId("review-not-purchased")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("review-form")).toHaveCount(0);
});

test("order history renders for a logged-in customer", async ({ page }) => {
  await login(page);
  await page.goto("/account/orders");
  await expect(page).toHaveURL(/\/account\/orders/);
});
