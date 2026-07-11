import type { BankAccount } from "@/types";

export const SITE_NAME = "ภูเก็ตโกรเซอรี่";
export const SITE_NAME_EN = "Phuket Grocery";
export const SITE_DESCRIPTION =
  "ภูเก็ตโกรเซอรี่ แหล่งรวมสินค้าอุปโภคบริโภคครบวงจรสำหรับครัวเรือน ร้านอาหาร โรงแรม และผู้ประกอบการในจังหวัดภูเก็ต";
export const SITE_URL = "https://phuketgrocery.com";

export const COMPANY_INFO = {
  name: "ภูเก็ตโกรเซอรี่ (Phuket Grocery)",
  shortName: "ภูเก็ตโกรเซอรี่",
  registrationNo: "0833542001808",
  businessType: "ค้าปลีกและค้าส่งสินค้าอุปโภคบริโภค",
  businessCategory: "ซูเปอร์มาร์เก็ตและคลังสินค้าท้องถิ่น",
  businessDescription:
    "ศูนย์รวมสินค้าอุปโภค-บริโภคครบวงจร รองรับทั้งการซื้อของเข้าบ้านของครอบครัว และการจัดหาวัตถุดิบยกลังสำหรับผู้ประกอบการ ร้านอาหาร โรงแรม และร้านค้าปลีกรายย่อยในพื้นที่",
  phone: "094-582-1435",
  mobile: "094-582-1435",
  fax: "076-XXX-XXX",
  b2bPhone: "094-582-1435",
  email: "contact@phuketgrocery.com",
  supportEmail: "support@phuketgrocery.com",
  line: "@phuketgrocery",
  lineUrl: "[ลิงก์เพิ่มเพื่อน]",
  facebook: "ภูเก็ตโกรเซอรี่ - Phuket Grocery",
  facebookUrl: "[ลิงก์หน้าเพจ]",
  instagram: "@phuketgrocery",
  instagramUrl: "[ลิงก์ Instagram]",
  tiktok: "@phuketgrocery",
  tiktokUrl: "[ลิงก์ TikTok]",
  address:
    "54/51 ถ. อ๋องซิมผ่าย ตำบลตลาดใหญ่ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000",
  addressShort: "ตำบลตลาดใหญ่ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต",
  workingHours: "เปิดให้บริการทุกวัน ตั้งแต่เวลา 08:00 น. – 21:00 น.",
  workingHoursNote: "เปิดให้บริการทุกวัน",
  deliveryHours: "กรุณาติดต่อทีมงานเพื่อสอบถามรอบจัดส่งและบริการสำหรับองค์กร",
  googleMapUrl: "https://maps.app.goo.gl/zHrRLVtJFz4pgr2r9",
  googleMapEmbed: "",
  googlePlaceId: "ChIJxxxxxxxxxxxxx",
  yearEstablished: null,
  yearsInBusinessLabel: "[ใส่จำนวนปี]",
  totalProducts: "สินค้าครบครันสำหรับครัวเรือนและผู้ประกอบการ",
  deliveryCoverage: "ทั่วจังหวัดภูเก็ต",
  heroTagline:
    "แหล่งรวมสินค้าครบวงจร ตอบโจทย์ทุกความต้องการของครัวเรือนและผู้ประกอบการ",
  vision:
    "มุ่งสู่การเป็นซูเปอร์มาร์เก็ตท้องถิ่นอันดับหนึ่งในใจชาวภูเก็ต ที่ส่งมอบสินค้าคุณภาพในราคาที่คุ้มค่าที่สุด พร้อมบริการที่ประทับใจ",
  missions: [
    "จัดหาและคัดสรรสินค้าอุปโภคบริโภคที่หลากหลาย สด ใหม่ และปลอดภัย",
    "รักษามาตรฐานราคาที่ยุติธรรม เพื่อสนับสนุนทั้งผู้บริโภคและขับเคลื่อนเศรษฐกิจท้องถิ่น",
    "พัฒนาช่องทางการจัดจำหน่ายและการบริการให้ทันสมัย สะดวกสบาย เข้าถึงง่ายสำหรับทุกคน",
  ],
} as const;

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bankName: "ธนาคารกสิกรไทย (KBANK)",
    accountName: "ภูเก็ตโกรเซอรี่",
    accountNumber: "630-2-XXXXX-X",
    branch: "สาขาภูเก็ต",
  },
  {
    bankName: "ธนาคารไทยพาณิชย์ (SCB)",
    accountName: "ภูเก็ตโกรเซอรี่",
    accountNumber: "649-XXXXXX-X",
    branch: "สาขาภูเก็ต",
  },
  {
    bankName: "ธนาคารกรุงไทย (KTB)",
    accountName: "ภูเก็ตโกรเซอรี่",
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

/** COD fee per order (can be overridden by public setting `cod_fee`) */
export const COD_FEE = 20;

export const DELIVERY_AREAS = [
  "อำเภอเมืองภูเก็ต",
  "กะทู้",
  "ถลาง",
  "ป่าตอง",
  "ราไวย์",
  "ฉลอง",
  "กะรน",
  "กะตะ",
  "เชิงทะเล",
  "ในยาง",
  "ไม้ขาว",
  "พื้นที่อื่นในจังหวัดภูเก็ต",
];
