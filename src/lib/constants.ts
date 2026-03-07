import type { BankAccount } from "@/types";

export const SITE_NAME = "ภูเก็ต โกรเซอรี่";
export const SITE_NAME_EN = "Phuket Grocery";
export const SITE_DESCRIPTION =
  "ร้านขายส่งสินค้าอุปโภคบริโภค ราคาส่ง จัดส่งถึงร้านทั่วภูเก็ต สินค้าครบ ซื้อชิ้น กล่อง ลัง";
export const SITE_URL = "https://phuketgrocery.com";

export const COMPANY_INFO = {
  name: "ห้างหุ้นส่วนจำกัด ภูเก็ต โกรเซอรี่",
  shortName: "ภูเก็ต โกรเซอรี่",
  registrationNo: "0833542001808",
  businessType: "ขายปลีกสินค้าอุปโภค - บริโภค",
  businessCategory: "ร้านขายของชำ",
  businessDescription: "จำหน่ายสินค้าอุปโภค บริโภค",
  phone: "076-354-789",
  mobile: "093-549-8822",
  fax: "076-354-790",
  email: "sales@phuketgrocery.com",
  line: "@phuketgrocery",
  facebook: "PhuketGrocery",
  address:
    "54/51 ถนนอ๋องซิมผ่าย ตำบลตลาดใหญ่ อำเภอเมืองภูเก็ต จ.ภูเก็ต 83000",
  addressShort: "ถ.อ๋องซิมผ่าย ต.ตลาดใหญ่ อ.เมืองภูเก็ต",
  workingHours: "จันทร์ - เสาร์ 07:30 - 17:30 น.",
  workingHoursNote: "หยุดวันอาทิตย์ และวันหยุดนักขัตฤกษ์",
  deliveryHours: "จัดส่งทุกวัน จันทร์-เสาร์ 09:00-16:00 น.",
  googleMapUrl: "https://maps.google.com/?q=7.8804,98.3923",
  googleMapEmbed:
    "https://maps.google.com/maps?q=7.8804,98.3923&z=15&output=embed",
  googlePlaceId: "ChIJxxxxxxxxxxxxx",
  yearEstablished: 2015,
  totalProducts: "10,000+",
  deliveryCoverage: "ทั่วเกาะภูเก็ต",
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bankName: "ธนาคารกสิกรไทย (KBANK)",
    accountName: "หจก. ภูเก็ต โกรเซอรี่",
    accountNumber: "630-2-XXXXX-X",
    branch: "สาขาเซ็นทรัล ภูเก็ต ฟลอเรสต้า",
  },
  {
    bankName: "ธนาคารไทยพาณิชย์ (SCB)",
    accountName: "หจก. ภูเก็ต โกรเซอรี่",
    accountNumber: "649-XXXXXX-X",
    branch: "สาขาถนนเทพกระษัตรี",
  },
  {
    bankName: "ธนาคารกรุงไทย (KTB)",
    accountName: "หจก. ภูเก็ต โกรเซอรี่",
    accountNumber: "827-X-XXXXX-X",
    branch: "สาขาภูเก็ต",
  },
];

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  pending_payment: { label: "รอชำระเงิน", color: "bg-yellow-100 text-yellow-800" },
  pending_verify: { label: "รอตรวจสอบสลิป", color: "bg-orange-100 text-orange-800" },
  preparing: { label: "กำลังจัดเตรียมสินค้า", color: "bg-primary/10 text-primary" },
  shipped: { label: "จัดส่งแล้ว", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "ส่งสำเร็จ", color: "bg-green-100 text-green-800" },
  cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800" },
};

export const SHIPPING_COST = {
  standard: 50,
  express: 100,
};

export const FREE_SHIPPING_THRESHOLD = 1500;

export const DELIVERY_AREAS = [
  "อ.เมืองภูเก็ต",
  "อ.กะทู้",
  "อ.ถลาง",
  "ป่าตอง",
  "กะรน",
  "กะตะ",
  "ราไวย์",
  "ฉลอง",
  "เชิงทะเล",
  "ในยาง",
  "ไม้ขาว",
  "สะพานหิน",
];
