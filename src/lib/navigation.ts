export interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
}

export const PROMOTION_NAV_ITEMS: NavLinkItem[] = [
  {
    label: "ดีลพิเศษ",
    href: "/deals",
    description: "สินค้าราคาพิเศษจากร้านและแคมเปญ",
  },
  {
    label: "แคมเปญลดราคา",
    href: "/campaigns",
    description: "รายละเอียดแคมเปญที่กำลังจัด",
  },
  {
    label: "สินค้าแนะนำ",
    href: "/#featured-products",
    description: "สินค้าคัดสรรขายดี",
  },
  {
    label: "ส่งฟรีเมื่อครบ 1,500",
    href: "/categories",
    description: "จัดส่งทั่วภูเก็ต",
  },
];

export const SELL_WITH_US_HREF = "/contact";
