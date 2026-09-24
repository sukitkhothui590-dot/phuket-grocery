const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => {
      localStorage.setItem('phuket-grocery-auth', JSON.stringify({ state: {
        user: null, accessToken: 'isolated-ui-fixture', refreshToken: null, isAuthenticated: false,
      }, version: 0 }));
    });
    const order = {
      id: 'ui-fixture', orderNumber: 'PG-260924-001', status: 'preparing',
      customerName: 'ร้านครัวตัวอย่าง', phone: '080-000-0000', recipientName: 'ลูกค้าทดสอบ',
      addressLine: '99 ถนนตัวอย่าง', district: 'เมืองภูเก็ต', province: 'ภูเก็ต', postalCode: '83000',
      createdAt: '2026-09-24T03:30:00Z', paymentMethod: 'cod',
      items: [{ id: 'item-1', productId: 'product-1', productName: 'น้ำดื่มสำหรับทดสอบ',
        productImage: '/images/logo.png', quantity: 2, unitPrice: 60, sku: '885000000001',
        selectedUnit: { id: 'pack', labelTh: 'แพ็ค × 12', sku: '885000000001' } }],
    };
    // Intercept all browser API traffic; never send the fixture token to a backend.
    await context.route('**/*', async (route) => {
      const request = route.request();
      if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
        if (request.url().includes('/admin/orders')) {
          if (request.method() !== 'GET') throw new Error('Unexpected order mutation');
          const path = new URL(request.url()).pathname;
          return route.fulfill({ json: { success: true, data: path.endsWith('/ui-fixture') ? order : [order] } });
        }
        if (request.url().includes('/api/')) return route.fulfill({ json: { success: true, data: [] } });
      }
      return route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    fs.mkdirSync('artifacts/staff-layout', { recursive: true });
    await page.goto('http://localhost:3000/staff/orders');
    await expect(page.getByText(order.orderNumber, { exact: true })).toBeVisible();
    await page.screenshot({ path: 'artifacts/staff-layout/queue-desktop.png', fullPage: true });
    await page.getByLabel('ค้นหาออเดอร์').fill('not-an-order');
    await expect(page.getByText('ไม่พบคำสั่งซื้อที่ค้นหา')).toBeVisible();
    await page.getByLabel('ค้นหาออเดอร์').fill('');
    await page.getByRole('link', { name: 'จัดสินค้า', exact: true }).click();
    await page.getByRole('button', { name: 'เริ่มจัดสินค้า', exact: true }).click();
    await page.getByLabel('สแกนบาร์โค้ด หรือพิมพ์รหัสสินค้า').fill('wrong');
    await page.getByLabel('สแกนบาร์โค้ด หรือพิมพ์รหัสสินค้า').press('Enter');
    await expect(page.getByText('ไม่พบรหัส wrong ในรายการออเดอร์นี้')).toBeVisible();
    await expect(page.getByRole('button', { name: 'เตรียมสินค้าเสร็จสิ้น' })).toBeDisabled();
    await page.getByRole('button', { name: 'จำลองสแกนรายการถัดไป' }).click();
    await page.screenshot({ path: 'artifacts/staff-layout/detail-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'artifacts/staff-layout/detail-mobile.png', fullPage: true });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Mobile overflow');
    await page.getByRole('button', { name: 'จำลองสแกนรายการถัดไป' }).click();
    await page.getByRole('button', { name: 'เตรียมสินค้าเสร็จสิ้น' }).click();
    await expect(page.getByText('ผลอยู่ในเบราว์เซอร์นี้ ไม่ได้ส่งหรือเปลี่ยนสถานะในหลังบ้าน')).toBeVisible();
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('PASS: queue, search, start, invalid scan, count, completion, mobile overflow, runtime errors. Isolated API fixture only.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
