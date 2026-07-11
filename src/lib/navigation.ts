export interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
}

export const PROMOTION_NAV_ITEMS: NavLinkItem[] = [
  {
    label: "โปรโมชั่นทั้งหมด",
    href: "/#promotions",
    description: "รวมดีลและสิทธิพิเศษล่าสุด",
  },
  {
    label: "สินค้าแนะนำ",
    href: "/#featured-products",
    description: "สินค้าคัดสรรขายดี",
  },
  {
    label: "ซื้อยกลังราคาส่ง",
    href: "/categories",
    description: "เหมาะสำหรับร้านค้าและองค์กร",
  },
  {
    label: "ส่งฟรีเมื่อครบ 1,500",
    href: "/categories",
    description: "จัดส่งทั่วภูเก็ต",
  },
];

export const SELL_WITH_US_HREF = "/contact";
