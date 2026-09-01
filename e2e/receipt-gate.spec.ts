import { test, expect, Page } from "@playwright/test";

/**
 * Receipt gate (PHUKETECOM-9 / -10). The real release switch lives in the
 * backoffice, so the API is stubbed here: what has to be proven is that the
 * storefront renders the document *only* on a 200 and never reconstructs it
 * from a client-side cache.
 */

const CUSTOMER_EMAIL = process.env.E2E_CUSTOMER_EMAIL ?? "customer@phuket.local";
const CUSTOMER_PASSWORD = process.env.E2E_CUSTOMER_PASSWORD ?? "customer123";
const ORDER_ID = "gated-order-id";

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
  await page.getByLabel("อีเมล หรือ เบอร์โทรศัพท์").fill(CUSTOMER_EMAIL);
  await page.getByLabel("รหัสผ่าน").fill(CUSTOMER_PASSWORD);
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

/** Poison the cache the old page used to trust, so a regression fails loudly. */
async function seedSessionOrder(page: Page) {
  await page.evaluate((id) => {
    window.sessionStorage.setItem(
      `order-${id}`,
      JSON.stringify({
        id,
        orderNumber: "ORD-999",
        status: "preparing",
        items: [
          {
            productId: "p1",
            productName: "สินค้าทดสอบ",
            productImage: "",
            selectedUnit: { id: "u1", unitType: "piece", labelTh: "ชิ้น", price: 100 },
            quantity: 1,
            subtotal: 100,
          },
        ],
        paymentMethod: "cod",
        shippingMethod: "standard",
        shippingAddress: {
          id: "a1",
          label: "ที่จัดส่ง",
          fullName: "ลูกค้าทดสอบ",
          phone: "0800000000",
          addressLine1: "1/1",
          district: "เมือง",
          subDistrict: "ตลาดใหญ่",
          province: "ภูเก็ต",
          postalCode: "83000",
          isDefault: true,
        },
        discount: 0,
        shippingCost: 0,
        subtotal: 100,
        total: 100,
        receiptReleased: true,
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
      }),
    );
  }, ORDER_ID);
}

test.beforeEach(async ({ page }) => {
  await dismissCookieBanner(page);
});

test("a held receipt shows the hold page, not the document", async ({ page }) => {
  await login(page);
  await page.route(`**/backend/orders/${ORDER_ID}/receipt`, (route) =>
    route.fulfill({
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: {
          code: "RECEIPT_PENDING",
          message: "Receipt is pending review",
          details: {
            receiptReleased: false,
            orderNumber: "ORD-999",
            status: "preparing",
          },
        },
      }),
    }),
  );

  await page.goto(`/account/orders/${ORDER_ID}`);
  await seedSessionOrder(page);
  await page.goto(`/account/orders/${ORDER_ID}/receipt`);

  await expect(page.getByText("อยู่ระหว่างการตรวจสอบ")).toBeVisible();
  await expect(page.getByText("กำลังจัดเตรียมสินค้าเพื่อจัดส่ง")).toBeVisible();
  await expect(page.getByText("ORD-999")).toBeVisible();
  await expect(page.getByText("076-355207")).toBeVisible();
  // The cached order above must not be able to produce a printable document.
  await expect(page.getByRole("button", { name: /พิมพ์ใบสั่งซื้อ/ })).toHaveCount(0);
  await expect(page.getByText("สินค้าทดสอบ")).toHaveCount(0);
});

test("a released receipt renders the document and the print button", async ({
  page,
}) => {
  await login(page);
  await page.route(`**/backend/orders/${ORDER_ID}/receipt`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          id: ORDER_ID,
          orderNumber: "ORD-999",
          status: "preparing",
          paymentMethod: "cod",
          shippingMethod: "standard",
          items: [
            {
              id: "i1",
              productId: "p1",
              productName: "สินค้าทดสอบ",
              unitName: "ชิ้น",
              unitPrice: 100,
              quantity: 1,
              lineTotal: 100,
            },
          ],
          subtotal: 100,
          discount: 0,
          shippingCost: 0,
          total: 100,
          shipping: {
            recipientName: "ลูกค้าทดสอบ",
            phone: "0800000000",
            addressLine: "1/1",
            subDistrict: "ตลาดใหญ่",
            district: "เมือง",
            province: "ภูเก็ต",
            postalCode: "83000",
          },
          receiptReleased: true,
          receiptReleasedAt: new Date(0).toISOString(),
          createdAt: new Date(0).toISOString(),
        },
      }),
    }),
  );

  await page.goto(`/account/orders/${ORDER_ID}/receipt`);

  await expect(page.getByText("สินค้าทดสอบ")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /พิมพ์ใบสั่งซื้อ/ }),
  ).toBeVisible();
  await expect(page.getByText("อยู่ระหว่างการตรวจสอบ")).toHaveCount(0);
});
