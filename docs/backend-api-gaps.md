# Backend API Gaps — Storefront

| รายการ | รายละเอียด |
|--------|------------|
| โปรเจกต์ | Phuket Grocery Storefront |
| ตรวจจาก | http://157.85.111.135:8080/docs (Phuket Grocery API `0.1.0`) |
| วันที่ | 2026-07-28 |
| สถานะ | รอ Backend |

เอกสารนี้สรุป endpoint / พฤติกรรมที่ **Frontend พร้อมใช้แล้ว** แต่ **Backend ยังไม่มี หรือปิดไปแล้ว**

---

## 1) ยืนยันอีเมลตอนแก้โปรไฟล์ — ยังขาด

### ปัญหา
หน้า `/account/profile` มี UI ส่งรหัสยืนยันอีเมลแล้ว แต่ตอนนี้ Swagger **ไม่มี** endpoint เหล่านี้:

- `POST /backend/auth/request-email-verification`
- `POST /backend/auth/verify-email`

(และ fallback ที่ FE ลองแล้วก็ 404 เช่นกัน)

- `POST /backend/users/me/request-email-change`
- `POST /backend/users/me/verify-email-change`

ตอนนี้ Frontend **บันทึกอีเมลผ่าน `PATCH /users/me` ได้เลย** (ตาม `UpdateProfileDto`) โดยไม่บังคับ OTP

### สิ่งที่ Backend ควรเพิ่ม

#### 1.1 ขอรหัสยืนยัน

```http
POST /backend/auth/request-email-verification
Authorization: Bearer <CUSTOMER>
Content-Type: application/json
```

```json
{ "email": "new@example.com" }
```

Response:

```json
{
  "success": true,
  "data": { "message": "ส่งรหัสยืนยันไปที่อีเมลแล้ว" }
}
```

กฎที่ต้องการ:
- ต้อง login แล้ว
- `email` ต้อง unique ถ้ายังไม่มี user อื่นใช้
- ส่ง OTP (6 หลัก) หรือ magic link ไปอีเมลใหม่
- OTP หมดอายุภายใน 10–15 นาที
- rate limit กัน spam

#### 1.2 ยืนยันรหัส

```http
POST /backend/auth/verify-email
Authorization: Bearer <CUSTOMER>
Content-Type: application/json
```

```json
{ "email": "new@example.com", "code": "123456" }
```

Response:

```json
{
  "success": true,
  "data": {
    "verified": true,
    "user": { "id": "...", "email": "new@example.com", "..." : "..." }
  }
}
```

หรือถ้าต้องการแยกขั้นตอน:
1. verify สำเร็จ → mark pending email verified
2. `PATCH /users/me` ด้วย email เดิมที่ยืนยันแล้วจึง commit

### Acceptance
- [ ] ส่งรหัสแล้วได้รับอีเมลจริง
- [ ] รหัสผิด / หมดอายุ ตอบ error ชัด
- [ ] อีเมลซ้ำคนอื่น → ปฏิเสธ
- [ ] มีใน Swagger

---

## 2) Claim คูปองเข้ากระเป๋า — Backend ปิดแล้ว

### สถานะปัจจุบัน (ตรวจจาก Swagger 2026-07-28)

ใน `CreateCouponDto` ฟิลด์พวกนี้ถูก mark **deprecated / Ignored — claim wallet removed**:

- `isClaimable`
- `claimLimitPerUser`
- `claimStartsAt`
- `claimEndsAt`

และ **ไม่มี** `POST /backend/coupons/{id}/claim` (เรียกแล้วได้ 404)

### Frontend ปรับไปใช้โหมดโค้ดแล้ว
ใช้ API ที่มีจริง:

| Method | Path | ใช้ทำอะไร |
|--------|------|-----------|
| `GET` | `/coupons/available` | รายการคูปองเปิดใช้ |
| `POST` | `/coupons/for-cart` | คูปองที่เข้ากับตะกร้า + preview ส่วนลด |
| `POST` | `/coupons/validate` | ตรวจโค้ดก่อนใช้ |
| `POST` | `/orders/checkout` | ส่ง `couponCode` |
| `GET` | `/users/me/coupons` | ประวัติ / สถานะคูปองของ user (ถ้ามี) |

Flow ปัจจุบัน:
1. ลูกค้าดูคูปองที่ `/coupons`
2. กดใช้ → ไป `/cart?coupon=CODE`
3. ตะกร้าเรียก `validate` แล้วใส่โค้ด
4. Checkout ส่ง `couponCode`

### ถ้าต้องการเปิด claim wallet กลับ
อ้างอิงสเปกเดิม: `docs/backend-coupon-wallet-spec.md`

ขั้นต่ำที่ต้องมีกลับมา:
1. `POST /coupons/{id}/claim`
2. คืนฟิลด์ claim* ใน admin create/update coupon
3. `GET /users/me/coupons?status=AVAILABLE` ต้องคืนใบที่ claim แล้วจริง
4. checkout mark `USED` ตาม user coupon

จนกว่าจะเปิดกลับ Frontend จะ**ไม่เรียก claim**

---

## 3) Upload สลิปโดย CUSTOMER — ควรยืนยันสิทธิ์

มี `POST /backend/uploads` ใน Swagger (ต้อง Bearer)

Frontend มี fallback `POST /api/upload-slip` → เก็บที่ `public/slips` เมื่อ backend ปฏิเสธ CUSTOMER

ขอ Backend ยืนยัน:
- CUSTOMER อัปโหลดสลิปได้หรือไม่
- response shape ที่ต้องการ เช่น `{ success: true, data: { url: "/uploads/..." } }`

ถ้า CUSTOMER ใช้ได้แล้ว Frontend จะเลิกพึ่ง local fallback ได้

---

## 4) สรุปความเร่งด่วน

| ลำดับ | หัวข้อ | ผลกระทบ | ขอจาก Backend |
|------|--------|----------|----------------|
| P1 | Email verification | แก้เมลได้แต่ยังไม่ยืนยัน OTP | เพิ่ม 2 endpoints ในข้อ 1 |
| P2 | CUSTOMER upload | สลิปพึ่ง fallback ของ FE | อนุญาต role + เอกสาร response |
| P3 | Claim wallet | ไม่บล็อกซื้อของแล้ว | เปิดใหม่เฉพาะถ้าต้องการ UX แบบ Shopee |

---

## 5) ช่องทางตรวจ

- Swagger: http://157.85.111.135:8080/docs
- Base: `http://157.85.111.135:8080/backend`
