export interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
}

export const PROMOTION_NAV_ITEMS: NavLinkItem[] = [
  {
    label: "แคมเปญลดราคา",
    href: "/campaigns",
    description: "รวมสินค้าราคาพิเศษจากร้าน",
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
