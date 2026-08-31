export interface StoreBranch {
  id: string;
  name: string;
  address: string;
  workingHours: string;
  mapUrl: string;
  image?: string;
}

export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: "main",
    name: "ภูเก็ต โกรเซอรี่ Phuket Grocery (สาขาใหญ่)",
    address:
      "54/51 ถ. อ๋องซิมผ่าย ต. ตลาดใหญ่ อ. เมืองภูเก็ต จ. ภูเก็ต 83000",
    workingHours: "ทุกวัน 08:00 น. – 21:00 น.",
    mapUrl: "https://maps.app.goo.gl/j44APUrRmv52AuPV6",
    image: "/about/storefront.jpg",
  },
  {
    id: "chao-fa",
    name: "ภูเก็ต โกรเซอรี่ Phuket Grocery (สาขาเจ้าฟ้า)",
    address:
      "77/45 หมู่ 1 ถ. เจ้าฟ้าตะวันออก ต. วิชิต อ. เมืองภูเก็ต จ. ภูเก็ต 83000",
    workingHours: "ทุกวัน 08:00 น. – 22:00 น.",
    mapUrl: "https://maps.app.goo.gl/8efGe3HbJWEz8Rpx6",
    image: "/branches/chao-fa.jpg",
  },
  {
    id: "tha-kraeng",
    name: "ภูเก็ต โกรเซอรี่ Phuket Grocery (สาขาท่าแครง)",
    address:
      "27/14-15 ถ. ศักดิ์ดิเดช ต. ตลาดเหนือ อ. เมืองภูเก็ต จ. ภูเก็ต 83000",
    workingHours: "ทุกวัน 08:00 น. – 21:00 น.",
    mapUrl: "https://maps.app.goo.gl/RKNNa3oGRPJx4CeQ6",
  },
  {
    id: "thalang",
    name: "ภูเก็ต โกรเซอรี่ Phuket Grocery (สาขาถลาง)",
    address:
      "ถ. เทพกระษัตรี ต. ศรีสุนทร อ. ถลาง จ. ภูเก็ต 83110",
    workingHours: "ทุกวัน 06:00 น. – 22:00 น.",
    mapUrl: "https://maps.app.goo.gl/4NW29xDid6B7yqTt6",
    image: "/branches/thalang.jpg",
  },
];
