# Backend Spec (ฉบับละเอียด) — ระบบคูปองแบบเก็บเข้ากระเป๋า + ค่าใช้จ่าย

| รายการ | รายละเอียด |
|--------|------------|
| โปรเจกต์ | Phuket Grocery |
| ผู้ขอ | Frontend Storefront |
| วันที่ | 2026-07-11 |
| Base URL | `http://<host>:8080/backend` |
| Auth | Bearer JWT (`CUSTOMER` / `ADMIN`) |
| รูปแบบ response | `{ "success": true/false, "data": ..., "error"?: { "code", "message" }, "meta"?: {...} }` |
| สถานะ Frontend | UI พร้อมแล้ว (ใช้ localStorage ชั่วคราว) — รอ API จริง |

---

## สารบัญ

1. [เป้าหมายธุรกิจ / UX](#1-เป้าหมายธุรกิจ--ux)
2. [ขอบเขตงาน](#2-ขอบเขตงาน)
3. [นิยามคำศัพท์](#3-นิยามคำศัพท์)
4. [Data Model](#4-data-model)
5. [Business Rules](#5-business-rules)
6. [API ที่มีแล้ว (คงไว้ / ขยาย)](#6-api-ที่มีแล้ว)
7. [API ที่ต้องสร้างใหม่](#7-api-ที่ต้องสร้างใหม่)
8. [Admin API ที่ต้องขยาย](#8-admin-api-ที่ต้องขยาย)
9. [Settings](#9-settings)
10. [Flow แบบละเอียด](#10-flow-แบบละเอียด)
11. [Error Code มาตรฐาน](#11-error-code-มาตรฐาน)
12. [ตัวอย่าง Request / Response ครบชุด](#12-ตัวอย่าง-request--response-ครบชุด)
13. [การคำนวณส่วนลด](#13-การคำนวณส่วนลด)
14. [Test Cases ที่ต้องผ่าน](#14-test-cases-ที่ต้องผ่าน)
15. [Acceptance Criteria](#15-acceptance-criteria)
16. [Migration / Rollout](#16-migration--rollout)
17. [สิ่งที่ Frontend ใช้ชั่วคราวตอนนี้](#17-สิ่งที่-frontend-ใช้ชั่วคราวตอนนี้)

---

## 1) เป้าหมายธุรกิจ / UX

ต้องการระบบคูปองคล้าย Shopee:

1. แอดมินกำหนดว่า **คูปองไหนเปิดให้เก็บ** (แคมเปญรายวัน / ตามช่วงเวลา)
2. ลูกค้าเปิดหน้า **เก็บคูปอง** เห็นแยกประเภท
   - โค้ดส่งฟรี (`shipping`)
   - โค้ดลดทุกการสั่งซื้อ (`order_discount`)
3. กดเก็บ → เข้า **คูปองของฉัน**
4. ตอนตะกร้า/checkout
   - เลือกคูปองจากกระเป๋า หรือพิมพ์โค้ดเอง
   - ระบบ validate แล้วหักส่วนลด
5. ใช้แล้ว / หมดอายุ ต้องแยกสถานะชัด

หน้า Frontend ที่เกี่ยวข้อง:
- `/coupons` — ศูนย์เก็บคูปอง
- `/coupons?type=shipping` / `?type=order_discount`
- `/account/coupons` — คูปองของฉัน
- `/cart` — เลือกคูปองใช้
- `/checkout` — ส่ง `couponCode` ตอนสร้างออเดอร์
- `/fees` — แสดงค่าใช้จ่าย (อ่านจาก settings)

---

## 2) ขอบเขตงาน

### In scope
- ขยายตาราง/โมเดล Coupon
- ตาราง UserCoupon (กระเป๋าคูปอง)
- API available / claim / my coupons
- เชื่อม checkout ให้ mark ใช้แล้ว
- ขยาย validate ให้รองรับกระเป๋า + reason ครบ
- public setting `cod_fee`
- อัปเดต Swagger

### Out of scope (รอบนี้ยังไม่ต้อง)
- คูปองเฉพาะหมวดสินค้า / SKU เฉพาะ
- คูปองซ้อนหลายใบใน 1 ออเดอร์
- Flash claim (แย่งคูปองจำนวนจำกัดแบบ realtime queue)
- Push notification แจ้งคูปองใหม่

---

## 3) นิยามคำศัพท์

| คำ | ความหมาย |
|----|----------|
| Coupon | แม่แบบคูปองที่แอดมินสร้าง (โค้ด, ส่วนลด, เงื่อนไข) |
| Claimable | คูปองที่เปิดให้กดเก็บได้ในช่วงเวลานั้น |
| UserCoupon | สำเนาคูปองในกระเป๋าของ user คนนั้น |
| Validate | ตรวจว่าโค้ดใช้กับตะกร้านี้ได้ไหม และคิดส่วนลดเท่าไร |
| Redeem / Use | ใช้คูปองกับออเดอร์จริง แล้วเปลี่ยนสถานะเป็น USED |
| Category | ประเภทโชว์บนหน้าบ้าน: `shipping` หรือ `order_discount` |

---

## 4) Data Model

### 4.1 Coupon (ขยายของเดิม)

ของเดิมมีแล้วโดยประมาณ: `code`, `description`, `type`, `value`, `maxDiscount`, `minPurchase`, `startsAt`, `endsAt`, `maxRedemptions`, `perUserLimit`, `redeemedCount`, `isActive`

**ขอเพิ่มฟิลด์:**

| Field | Type | Required | Default | คำอธิบาย |
|-------|------|----------|---------|----------|
| `title` | string(120) | แนะนำ | `code` | ชื่อโชว์บนการ์ด เช่น “ลดทันที ฿100” |
| `category` | enum | **ใช่** | `order_discount` | `shipping` \| `order_discount` |
| `appliesTo` | string(255) | แนะนำ | `"ทุกสินค้าในร้าน"` | ข้อความ “ใช้ได้กับอะไร” |
| `isClaimable` | boolean | **ใช่** | `false` | เปิดให้กดเก็บจากหน้าบ้านไหม |
| `claimLimitPerUser` | int | แนะนำ | = `perUserLimit` หรือ `1` | เก็บเข้ากระเป๋าได้กี่ครั้งต่อ user |
| `badge` | string(40) | ไม่บังคับ | null | เช่น `คูปองวันนี้`, `แนะนำ` |
| `claimStartsAt` | datetime | ไม่บังคับ | null | เปิดให้เก็บตั้งแต่เมื่อไหร่ (ถ้า null ใช้ `startsAt`) |
| `claimEndsAt` | datetime | ไม่บังคับ | null | เปิดให้เก็บถึงเมื่อไหร่ (ถ้า null ใช้ `endsAt`) |
| `sortOrder` | int | ไม่บังคับ | 0 | เรียงในหน้า available |

**Enum `type` (ของเดิม):**
- `FIXED` = ลดเป็นบาท
- `PERCENT` = ลดเป็นเปอร์เซ็นต์ (0–100) อาจมี `maxDiscount`

**Index แนะนำ**
- unique(`code`) case-insensitive
- index(`isActive`, `isClaimable`, `category`, `endsAt`)

### 4.2 UserCoupon (ตารางใหม่)

| Field | Type | Required | คำอธิบาย |
|-------|------|----------|----------|
| `id` | string/cuid | ใช่ | PK |
| `userId` | string | ใช่ | FK user |
| `couponId` | string | ใช่ | FK coupon |
| `code` | string | ใช่ | denormalize ไว้ค้นง่าย |
| `status` | enum | ใช่ | `AVAILABLE` \| `USED` \| `EXPIRED` \| `REVOKED` |
| `claimedAt` | datetime | ใช่ | เวลาที่กดเก็บ |
| `usedAt` | datetime | ไม่บังคับ | เวลาที่ใช้กับออเดอร์ |
| `orderId` | string | ไม่บังคับ | ออเดอร์ที่ใช้คูปอง |
| `expiresAt` | datetime | ใช่ | สำเนาจาก coupon.endsAt ตอน claim |
| `createdAt` | datetime | ใช่ | |
| `updatedAt` | datetime | ใช่ | |

**Constraint แนะนำ**
- ถ้า `claimLimitPerUser = 1` → unique(`userId`, `couponId`) สำหรับสถานะที่ไม่ใช่ `REVOKED`
- ถ้า > 1 → นับจำนวน row ของ user+coupon ที่ status เป็น AVAILABLE/USED ต้อง ≤ limit

**Index**
- (`userId`, `status`, `claimedAt`)
- (`couponId`, `userId`)
- (`code`, `userId`)

### 4.3 Order (ของเดิม — ตรวจให้มี)

| Field | ต้องมี |
|-------|--------|
| `couponCode` | ใช่ (มีแล้วฝั่ง FE ส่ง) |
| `discount` | ใช่ |
| `shippingCost` / `shippingFee` | ใช่ |
| (แนะนำ) `codFee` | ถ้าคิด COD ที่หลังบ้าน |
| (แนะนำ) `userCouponId` | อ้างอิงใบที่ถูกใช้ |

---

## 5) Business Rules

### 5.1 เงื่อนไขที่คูปอง “โชว์ใน available”

ต้องผ่านทุกข้อ:
1. `isActive = true`
2. `isClaimable = true`
3. ตอนนี้อยู่ในช่วง claim window  
   - `now >= coalesce(claimStartsAt, startsAt, -∞)`  
   - `now <= coalesce(claimEndsAt, endsAt, +∞)`
4. ยังไม่เกิน `maxRedemptions` ระดับระบบ (ถ้ามี)
5. ถ้า login แล้ว และเก็บครบ `claimLimitPerUser` แล้ว → ยังโชว์ได้ แต่ `claimedByMe=true`, `remainingClaims=0`

### 5.2 เงื่อนไขตอนกด claim

1. ต้อง login (`CUSTOMER`)
2. คูปองต้องผ่านเงื่อนไข available
3. จำนวนที่ user เคย claim (AVAILABLE+USED) < `claimLimitPerUser`
4. สร้าง `UserCoupon` status=`AVAILABLE`, `expiresAt=coupon.endsAt`

### 5.3 นโยบายการใช้คูปอง (ขอให้ยืนยัน — แนะนำแบบนี้)

**แนะนำ (Flexible):**
- ใส่โค้ดตรงๆ ได้ โดยไม่ต้อง claim ก่อน
- หรือเลือกจากกระเป๋าก็ได้
- ถ้ามีใบในกระเป๋าสถานะ AVAILABLE อยู่ และ validate ผ่าน ตอน checkout ให้ mark ใบนั้นเป็น USED

**ทางเลือกเข้มงวด (Strict):**
- ต้อง claim ก่อนถึงจะใช้ได้
- validate ถ้ายังไม่ claim → `reason=NOT_CLAIMED`

> Frontend พร้อมรองรับทั้งสองแบบ แต่ตอนนี้ UI ออกแบบมาแบบ Flexible

### 5.4 Validate rules (ขยายของเดิม)

เรียงลำดับเช็ค:
1. มีโค้ดไหม → ไม่มี `NOT_FOUND`
2. `isActive` → ไม่ผ่าน `INACTIVE`
3. อยู่ใน `startsAt`–`endsAt` → ไม่ผ่าน `EXPIRED` / `NOT_STARTED`
4. `maxRedemptions` ถึงแล้ว → `LIMIT_REACHED`
5. `perUserLimit` ถึงแล้ว (นับจากออเดอร์ที่ใช้โค้ดนี้สำเร็จ) → `PER_USER_LIMIT`
6. (ถ้า Strict) ยังไม่ claim → `NOT_CLAIMED`
7. คำนวณ subtotal จาก `items` (ราคาจาก DB ตาม `unitId`)
8. subtotal < `minPurchase` → `MIN_PURCHASE_NOT_MET`
9. คำนวณ `discount` ตาม type
10. สำเร็จ → `valid=true`

### 5.5 Checkout / Redeem

เมื่อ `POST /orders/checkout` มี `couponCode`:
1. validate ซ้ำด้วย cart จริงฝั่ง server (อย่าวางใจ FE)
2. บันทึก `discount`, `couponCode` ในออเดอร์
3. หา `UserCoupon` ของ user ที่ `code` ตรง และ `AVAILABLE` (ใบเก่าสุดก่อน)
4. ถ้าเจอ → mark `USED`, set `usedAt`, `orderId`
5. เพิ่ม `coupon.redeemedCount`
6. ถ้าออเดอร์ถูกยกเลิกภายหลัง (optional รอบหน้า) → คืนสถานะคูปองได้ตามนโยบาย

### 5.6 Job หมดอายุ (แนะนำ)

cron รายชั่วโมง/รายวัน:
- `UserCoupon` ที่ `status=AVAILABLE` และ `expiresAt < now` → ตั้งเป็น `EXPIRED`

หรือคำนวณตอน GET my coupons แบบ soft-expire ก็ได้

---

## 6) API ที่มีแล้ว

| Method | Path | Role | สถานะ |
|--------|------|------|-------|
| `POST` | `/coupons/validate` | public/optional auth | มีแล้ว — ขอขยาย response/reason |
| `GET` | `/coupons` | ADMIN | มีแล้ว |
| `POST` | `/coupons` | ADMIN | มีแล้ว — ขอรับฟิลด์ใหม่ |
| `GET` | `/coupons/{id}` | ADMIN | มีแล้ว |
| `PATCH` | `/coupons/{id}` | ADMIN | มีแล้ว — ขอรับฟิลด์ใหม่ |
| `DELETE` | `/coupons/{id}` | ADMIN | มีแล้ว |

### 6.1 Validate (ของเดิมที่ FE ใช้อยู่)

```http
POST /backend/coupons/validate
Content-Type: application/json
Authorization: Bearer <optional แต่แนะนำส่งถ้า login แล้ว>
```

**Body ปัจจุบัน**

```json
{
  "code": "SAVE100",
  "items": [
    {
      "productId": "cmrd...",
      "unitId": "cmrd...",
      "quantity": 2
    }
  ]
}
```

**หมายเหตุ OpenAPI เดิมมี `userId` ใน DTO**  
ถ้ามี JWT แล้ว ควรอ่าน user จาก token เอง อย่าให้ client ส่ง `userId` มาปลอมได้

**Response ที่ต้องการหลังขยาย**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "discount": 100,
    "subtotal": 850,
    "reason": null,
    "coupon": {
      "id": "cmrd...",
      "code": "SAVE100",
      "title": "ลดทันที ฿100",
      "description": "ลด ฿100 เมื่อซื้อครบ ฿500",
      "category": "order_discount",
      "appliesTo": "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
      "type": "FIXED",
      "value": 100,
      "minPurchase": 500,
      "maxDiscount": null,
      "startsAt": "2026-07-01T00:00:00.000Z",
      "endsAt": "2027-01-05T23:59:59.000Z",
      "isActive": true
    },
    "userCouponId": "user-coupon-id-or-null"
  }
}
```

ถ้าไม่ผ่าน:

```json
{
  "success": true,
  "data": {
    "valid": false,
    "discount": 0,
    "subtotal": 85,
    "reason": "MIN_PURCHASE_NOT_MET",
    "message": "ยอดสั่งซื้อขั้นต่ำ 500 บาท",
    "coupon": null
  }
}
```

> ตอนนี้ API ตอบ HTTP 201 แม้ `valid=false` — FE รองรับแล้ว ขอคงพฤติกรรมนี้หรือเปลี่ยนเป็น 200 ก็ได้ แต่ต้อง consistent

---

## 7) API ที่ต้องสร้างใหม่

### 7.1 รายการคูปองที่เปิดให้เก็บ

```http
GET /backend/coupons/available
Authorization: Bearer <optional>
```

**Query**

| Param | Type | Default | คำอธิบาย |
|-------|------|---------|----------|
| `category` | `shipping` \| `order_discount` | - | กรองประเภท |
| `page` | number | 1 | |
| `limit` | number | 20 | max 50 |
| `onlyClaimableForMe` | boolean | false | ถ้า true ซ่อนใบที่เก็บครบแล้ว |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "cmrd...",
      "code": "FREESHIP",
      "title": "ช่วยค่าส่ง ฿60",
      "description": "ลดค่าจัดส่ง ฿60 เมื่อยอดสั่งซื้อครบ ฿400",
      "category": "shipping",
      "appliesTo": "ค่าจัดส่งทุกรายการในร้าน (มาตรฐาน / ด่วน)",
      "type": "FIXED",
      "value": 60,
      "minPurchase": 400,
      "maxDiscount": null,
      "startsAt": "2026-07-01T00:00:00.000Z",
      "endsAt": "2027-07-09T23:59:59.000Z",
      "badge": "คูปองวันนี้",
      "claimLimitPerUser": 1,
      "isClaimable": true,
      "claimedByMe": false,
      "claimedCountByMe": 0,
      "remainingClaims": 1,
      "sortOrder": 1
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

**สิทธิ์:** public ได้ (guest เห็นรายการ) แต่ field `claimedByMe/remainingClaims` จะแม่นเมื่อมี token

---

### 7.2 กดเก็บคูปอง

```http
POST /backend/coupons/{couponId}/claim
Authorization: Bearer <required CUSTOMER>
```

**Body:** ว่างได้ หรือ `{}`

**ทางเลือกเทียบเท่า**

```http
POST /backend/coupons/claim
Authorization: Bearer <required>

{ "couponId": "cmrd..." }
```

**Response สำเร็จ (201)**

```json
{
  "success": true,
  "data": {
    "id": "user-coupon-id",
    "userId": "user-id",
    "couponId": "cmrd...",
    "code": "SAVE100",
    "title": "ลดทันที ฿100",
    "description": "ลด ฿100 เมื่อซื้อครบ ฿500",
    "category": "order_discount",
    "appliesTo": "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
    "type": "FIXED",
    "value": 100,
    "minPurchase": 500,
    "maxDiscount": null,
    "startsAt": "2026-07-01T00:00:00.000Z",
    "endsAt": "2027-01-05T23:59:59.000Z",
    "status": "AVAILABLE",
    "claimedAt": "2026-07-11T10:00:00.000Z",
    "usedAt": null,
    "expiresAt": "2027-01-05T23:59:59.000Z"
  }
}
```

**Error**

| HTTP | error.code | เมื่อไหร่ |
|------|------------|----------|
| 401 | `UNAUTHORIZED` | ไม่มี token |
| 403 | `FORBIDDEN` | ไม่ใช่ CUSTOMER |
| 404 | `NOT_FOUND` | ไม่พบคูปอง |
| 400 | `NOT_CLAIMABLE` | ยังไม่เปิดให้เก็บ / นอกช่วง |
| 400 | `INACTIVE` | ปิดใช้งาน |
| 400 | `EXPIRED` | หมดอายุ |
| 409 | `ALREADY_CLAIMED` | เก็บครบตาม limit |
| 409 | `LIMIT_REACHED` | คูปองระบบถูกใช้ครบจำนวน |

---

### 7.3 คูปองของฉัน

```http
GET /backend/users/me/coupons
Authorization: Bearer <required CUSTOMER>
```

**Query**

| Param | Type | คำอธิบาย |
|-------|------|----------|
| `status` | `AVAILABLE` \| `USED` \| `EXPIRED` \| `ALL` | default `ALL` |
| `category` | `shipping` \| `order_discount` | optional |
| `page` | number | |
| `limit` | number | |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "user-coupon-id",
      "couponId": "cmrd...",
      "code": "SAVE100",
      "title": "ลดทันที ฿100",
      "description": "ลด ฿100 เมื่อซื้อครบ ฿500",
      "category": "order_discount",
      "appliesTo": "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
      "type": "FIXED",
      "value": 100,
      "minPurchase": 500,
      "maxDiscount": null,
      "startsAt": "2026-07-01T00:00:00.000Z",
      "endsAt": "2027-01-05T23:59:59.000Z",
      "status": "AVAILABLE",
      "claimedAt": "2026-07-11T10:00:00.000Z",
      "usedAt": null,
      "orderId": null,
      "expiresAt": "2027-01-05T23:59:59.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "counts": {
      "AVAILABLE": 1,
      "USED": 0,
      "EXPIRED": 0
    }
  }
}
```

---

### 7.4 (Optional แต่แนะนำ) รายละเอียดคูปองในกระเป๋า

```http
GET /backend/users/me/coupons/{userCouponId}
Authorization: Bearer <required>
```

---

### 7.5 Checkout — ขยายพฤติกรรม

`POST /backend/orders/checkout` (ของเดิม)

Body ที่ FE ส่งอยู่แล้วมีประมาณ:

```json
{
  "paymentMethod": "cod",
  "shippingMethod": "standard",
  "addressId": "...",
  "couponCode": "SAVE100",
  "note": ""
}
```

**สิ่งที่ต้องทำเพิ่มฝั่ง backend เมื่อมี `couponCode`**
1. validate จากตะกร้า server จริง
2. ใส่ `discount` ในออเดอร์
3. mark UserCoupon เป็น USED ถ้ามีใบ AVAILABLE
4. ตอบออเดอร์กลับพร้อม `couponCode`, `discount`

**Response ออเดอร์ควรมี**

```json
{
  "success": true,
  "data": {
    "id": "order-id",
    "orderNumber": "PG-...",
    "couponCode": "SAVE100",
    "discount": 100,
    "shippingCost": 50,
    "subtotal": 850,
    "total": 800
  }
}
```

---

## 8) Admin API ที่ต้องขยาย

### Create / Update Coupon รับฟิลด์เพิ่ม

```json
{
  "code": "SAVE100",
  "title": "ลดทันที ฿100",
  "description": "ลด ฿100 เมื่อซื้อครบ ฿500",
  "category": "order_discount",
  "appliesTo": "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
  "type": "FIXED",
  "value": 100,
  "minPurchase": 500,
  "maxDiscount": null,
  "startsAt": "2026-07-01T00:00:00.000Z",
  "endsAt": "2027-01-05T23:59:59.000Z",
  "maxRedemptions": 200,
  "perUserLimit": 1,
  "claimLimitPerUser": 1,
  "isActive": true,
  "isClaimable": true,
  "badge": "คูปองวันนี้",
  "claimStartsAt": "2026-07-01T00:00:00.000Z",
  "claimEndsAt": "2027-01-05T23:59:59.000Z",
  "sortOrder": 10
}
```

### Admin list ควร filter ได้
- `search` (code/title)
- `active`
- `claimable`
- `category`

---

## 9) Settings

### มีแล้ว (ใช้ต่อ)

| key | ตัวอย่าง | ความหมาย |
|-----|----------|----------|
| `shipping_cost_standard` | `50` | ค่าส่งมาตรฐาน |
| `shipping_cost_express` | `100` | ค่าส่งด่วน |
| `free_shipping_threshold` | `1500` | ส่งฟรีเมื่อครบ |

### ขอเพิ่ม

| key | ตัวอย่าง | ความหมาย |
|-----|----------|----------|
| `cod_fee` | `20` | ค่าธรรมเนียม COD ต่อออเดอร์ |

อ่านผ่าน:

```http
GET /backend/public/settings
```

ต้องเป็น `isPublic=true`

---

## 10) Flow แบบละเอียด

### 10.1 เก็บคูปอง

```
User (login) → GET /coupons/available
             → กดเก็บ
             → POST /coupons/{id}/claim
             → GET /users/me/coupons?status=AVAILABLE
```

### 10.2 ใช้คูปองตอนตะกร้า

```
User → เปิดตะกร้า
     → เลือกคูปองจากกระเป๋า หรือพิมพ์โค้ด
     → POST /coupons/validate { code, items }
     → ถ้า valid: โชว์ส่วนลดบน UI
     → ไป checkout
     → POST /orders/checkout { ..., couponCode }
     → backend validate ซ้ำ + mark USED
```

### 10.3 Sequence (Claim)

```
FE                    API                     DB
|                      |                       |
|-- POST claim ------->|                       |
|                      |-- check coupon ------>|
|                      |<-- coupon ok ---------|
|                      |-- count userCoupons ->|
|                      |-- insert userCoupon ->|
|                      |<-- created -----------|
|<-- 201 UserCoupon ---|                       |
```

### 10.4 Sequence (Checkout + Redeem)

```
FE                    API                     DB
|-- checkout+code ---->|                       |
|                      |-- load cart --------->|
|                      |-- validate coupon --->|
|                      |-- create order ------>|
|                      |-- mark userCoupon --->|
|                      |-- redeemedCount++ --->|
|<-- order -------------|                       |
```

---

## 11) Error Code มาตรฐาน

ใช้รูปแบบ:

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_CLAIMED",
    "message": "คุณเก็บคูปองนี้ไว้แล้ว"
  }
}
```

หรือสำหรับ validate ที่ `success=true` แต่ `valid=false` ให้ใส่ `reason` ตามตาราง:

| reason / code | ความหมายภาษาไทยที่ FE จะโชว์ |
|---------------|-------------------------------|
| `NOT_FOUND` | ไม่พบโค้ดส่วนลดนี้ |
| `INACTIVE` | โค้ดส่วนลดนี้ไม่สามารถใช้งานได้ |
| `EXPIRED` | โค้ดส่วนลดหมดอายุแล้ว |
| `NOT_STARTED` | ยังไม่ถึงวันเริ่มใช้โค้ด |
| `MIN_PURCHASE_NOT_MET` | ยอดสั่งซื้อยังไม่ถึงขั้นต่ำ |
| `LIMIT_REACHED` | โค้ดถูกใช้ครบจำนวนแล้ว |
| `PER_USER_LIMIT` | คุณใช้โค้ดนี้ครบจำนวนครั้งแล้ว |
| `NOT_CLAIMED` | กรุณาเก็บคูปองก่อนใช้งาน |
| `NOT_CLAIMABLE` | คูปองนี้ยังไม่เปิดให้เก็บ |
| `ALREADY_CLAIMED` | คุณเก็บคูปองนี้ไว้แล้ว |
| `UNAUTHORIZED` | กรุณาเข้าสู่ระบบ |

---

## 12) ตัวอย่าง Request / Response ครบชุด

### 12.1 Available — กรองส่งฟรี

```http
GET /backend/coupons/available?category=shipping
Authorization: Bearer <token>
```

### 12.2 Claim

```http
POST /backend/coupons/cmrd.../claim
Authorization: Bearer <token>
```

### 12.3 My coupons พร้อมใช้

```http
GET /backend/users/me/coupons?status=AVAILABLE
Authorization: Bearer <token>
```

### 12.4 Validate สำเร็จ (PERCENT)

Request:

```json
{
  "code": "WELCOME",
  "items": [
    { "productId": "p1", "unitId": "u1", "quantity": 1 }
  ]
}
```

ถ้า unit ราคา 85:

```json
{
  "success": true,
  "data": {
    "valid": true,
    "discount": 4.25,
    "subtotal": 85,
    "coupon": {
      "code": "WELCOME",
      "type": "PERCENT",
      "value": 5,
      "minPurchase": 0
    }
  }
}
```

### 12.5 Validate ไม่ถึงขั้นต่ำ

`SAVE100` min 500, subtotal 85:

```json
{
  "success": true,
  "data": {
    "valid": false,
    "reason": "MIN_PURCHASE_NOT_MET",
    "discount": 0,
    "subtotal": 85
  }
}
```

---

## 13) การคำนวณส่วนลด

ให้ backend คำนวณเป็น source of truth เสมอ

### FIXED
```
discount = value
```
ตัวอย่าง: `SAVE100` → ลด 100

### PERCENT
```
raw = subtotal * (value / 100)
discount = maxDiscount ? min(raw, maxDiscount) : raw
```
ตัวอย่าง:
- `WELCOME` 5% ของ 85 = 4.25
- `PHUKET20` 20% ของ 1275 = 255 (ถ้า maxDiscount=500 ก็ยังได้ 255)
- `SUMMER25` 25% ของ 2000 = 500 แต่ maxDiscount=300 → ได้ 300

### ยอดสุทธิออเดอร์ (อ้างอิงหน้าบ้าน)
```
total = subtotal - discount + shippingCost + (paymentMethod==COD ? codFee : 0)
total = max(total, 0)
```

หมายเหตุ:
- คูปองประเภท `shipping` ตอนนี้ในระบบจริงยังเป็น FIXED ช่วยค่าส่งเป็นจำนวนเงิน (เช่น ลด 60)  
  ถ้าอนาคตอยากให้ “ส่งฟรี 100%” ต้องออกแบบ type เพิ่ม เช่น `FREE_SHIPPING` (รอบหน้า)

---

## 14) Test Cases ที่ต้องผ่าน

### Claim
1. Guest เรียก claim → 401
2. Claim คูปอง `isClaimable=true` → สำเร็จ ได้ AVAILABLE
3. Claim ซ้ำเมื่อ limit=1 → 409 ALREADY_CLAIMED
4. Claim คูปองหมดอายุ → 400 EXPIRED
5. Claim คูปอง `isClaimable=false` → 400 NOT_CLAIMABLE

### Available
6. Guest เห็นรายการ claimable
7. Filter `category=shipping` เห็นเฉพาะส่งฟรี
8. User ที่เก็บแล้วเห็น `claimedByMe=true`

### Validate
9. โค้ดถูก + ยอดพอ → valid + discount ถูก
10. ยอดไม่พอ → MIN_PURCHASE_NOT_MET
11. โค้ดไม่มี → NOT_FOUND
12. items ว่าง / unitId ว่าง → 400 validation error

### Checkout
13. checkout พร้อม couponCode ที่ valid → order.discount ถูกต้อง
14. UserCoupon ของโค้ดนั้นกลายเป็น USED
15. checkout โดยไม่ส่ง couponCode → ปกติ

### Settings
16. public settings มี `cod_fee`

---

## 15) Acceptance Criteria

- [ ] มี `GET /coupons/available` แยก category ได้
- [ ] มี `POST /coupons/{id}/claim` ต้อง login
- [ ] มี `GET /users/me/coupons` กรอง status ได้
- [ ] Create/Update coupon รับฟิลด์ใหม่ครบ
- [ ] Validate คืน `discount` + `reason` ครบ และมีข้อมูลคูปองพอสำหรับ UI
- [ ] Checkout ใช้คูปองแล้ว mark USED
- [ ] คูปองใช้แล้วไม่โชว์ใน AVAILABLE
- [ ] มี `cod_fee` ใน public settings
- [ ] อัปเดต Swagger `/docs` ให้ครบ endpoint ใหม่
- [ ] มี test/postman collection หรือตัวอย่าง curl ส่งกลับ FE

---

## 16) Migration / Rollout

1. เพิ่มคอลัมน์ใหม่ใน Coupon (default ปลอดภัย)
2. สร้างตาราง UserCoupon
3. backfill:
   - คูปอง active เดิมที่อยากให้เก็บได้ → ตั้ง `isClaimable=true`
   - ใส่ `category` / `title` / `appliesTo`
4. deploy API ใหม่
5. แจ้ง FE เพื่อสลับจาก localStorage → API
6. ใส่ `cod_fee=20` ใน settings (หรือค่าที่ตกลง)

### ข้อมูลอ้างอิงโค้ดที่มีใน DB ตอนนี้
`WELCOME`, `NEWUSER`, `SAVE100`, `FREESHIP`, `PHUKET20`, `SUMMER25`, `VIP500`, `TEST50`

แนะนำ mapping เริ่มต้น:
- `FREESHIP` → `category=shipping`, `isClaimable=true`
- ที่เหลือ → `category=order_discount`, `isClaimable=true` (ตามที่ต้องการเปิด)

---

## 17) สิ่งที่ Frontend ใช้ชั่วคราวตอนนี้

| ส่วน | ตอนนี้ | พอ API พร้อม |
|------|--------|---------------|
| รายการเก็บคูปอง | mock catalog ใน FE | `GET /coupons/available` |
| กดเก็บ | localStorage wallet | `POST /coupons/{id}/claim` |
| คูปองของฉัน | localStorage | `GET /users/me/coupons` |
| Validate | **ยิง backend จริงแล้ว** | ใช้ต่อ + ฟิลด์ที่ขยาย |
| Checkout couponCode | ส่งอยู่แล้ว | backend mark USED |
| COD fee | fallback `20` ใน FE | อ่าน `cod_fee` จาก settings |

ไฟล์ UI ที่เกี่ยวข้องฝั่ง FE:
- `src/app/(storefront)/coupons/*`
- `src/app/(storefront)/account/coupons/page.tsx`
- `src/stores/coupon-wallet-store.ts`
- `src/lib/coupons/catalog.ts`
- `src/lib/api/orders.ts` (`validateCoupon`, checkout)

---

## คำถามที่ขอให้ Backend ตอบกลับก่อนลงมือ (สั้นๆ)

1. เลือกนโยบาย **Flexible** หรือ **Strict** (ต้อง claim ก่อนใช้)?
2. คูปอง `shipping` จะคิดเป็นลดเงินท้ายบิลแบบ FIXED เหมือนตอนนี้ หรือจะทำประเภท FREE_SHIPPING แยก?
3. ถ้าออเดอร์ยกเลิก จะคืนคูปองให้ user ไหม (รอบนี้หรือรอบหน้า)?
4. กำหนด `cod_fee` เริ่มต้นเท่าไร?

---

**ติดต่อประสานงาน:** เมื่อ API พร้อม ส่งลิงก์ Swagger + ตัวอย่าง response จริงมาได้เลย Frontend จะสลับจาก mock → API ให้
