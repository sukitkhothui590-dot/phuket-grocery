import type { Product } from "@/types";
import { getPlaceholderUrl } from "@/lib/placeholder";

export const products: Product[] = [
  // ─── cat-1: อาหารแห้ง ──────────────────────────────────────────
  {
    id: "prod-1",
    name: "มาม่า รสต้มยำกุ้ง",
    slug: "mama-tom-yum-kung",
    description:
      "บะหมี่กึ่งสำเร็จรูปยอดฮิตของคนไทย รสต้มยำกุ้งเข้มข้นหอมเครื่องสมุนไพร เผ็ดร้อนถูกปากทั้งชาวไทยและนักท่องเที่ยว เหมาะสำหรับร้านค้าปลีก โรงแรม และร้านอาหารในภูเก็ต",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-1",
    units: [
      { unitType: "piece", labelTh: "ซอง", labelEn: "Pack", price: 7, conversionRate: 1, sku: "MAMA-TYK-PC", stock: 2400 },
      { unitType: "box", labelTh: "กล่อง (30 ซอง)", labelEn: "Box (30 packs)", price: 189, compareAtPrice: 210, conversionRate: 30, sku: "MAMA-TYK-BX", stock: 80 },
      { unitType: "case", labelTh: "ลัง (3 กล่อง)", labelEn: "Case (3 boxes)", price: 540, compareAtPrice: 567, conversionRate: 3, sku: "MAMA-TYK-CS", stock: 26 },
    ],
    baseUnit: "piece",
    baseStock: 2400,
    isFeatured: true,
    createdAt: "2025-12-01",
  },
  {
    id: "prod-2",
    name: "มาม่า รสหมูสับ",
    slug: "mama-minced-pork",
    description:
      "บะหมี่กึ่งสำเร็จรูป มาม่า รสหมูสับ สูตรยอดนิยมตลอดกาล น้ำซุปใสรสกลมกล่อม ทานง่ายอิ่มท้อง ขายดีตลอดทั้งปีทั้งร้านโชห่วยและร้านอาหารตามสั่ง",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-1",
    units: [
      { unitType: "piece", labelTh: "ซอง", labelEn: "Pack", price: 7, conversionRate: 1, sku: "MAMA-MP-PC", stock: 1800 },
      { unitType: "box", labelTh: "กล่อง (30 ซอง)", labelEn: "Box (30 packs)", price: 189, conversionRate: 30, sku: "MAMA-MP-BX", stock: 60 },
      { unitType: "case", labelTh: "ลัง (3 กล่อง)", labelEn: "Case (3 boxes)", price: 540, conversionRate: 3, sku: "MAMA-MP-CS", stock: 20 },
    ],
    baseUnit: "piece",
    baseStock: 1800,
    createdAt: "2025-12-01",
  },
  {
    id: "prod-3",
    name: "ไวไว รสต้มยำ",
    slug: "waiwai-tom-yum",
    description:
      "บะหมี่กึ่งสำเร็จรูปไวไว เส้นเล็กกรอบ รสต้มยำจัดจ้าน อร่อยทั้งแบบต้มและแบบแห้ง เป็นอีกหนึ่งตัวเลือกยอดนิยมคู่คนไทยมานาน เหมาะสำหรับสต็อกในร้านค้า",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-1",
    units: [
      { unitType: "piece", labelTh: "ซอง", labelEn: "Pack", price: 7, conversionRate: 1, sku: "WAIWAI-TY-PC", stock: 1200 },
      { unitType: "box", labelTh: "กล่อง (30 ซอง)", labelEn: "Box (30 packs)", price: 185, conversionRate: 30, sku: "WAIWAI-TY-BX", stock: 40 },
      { unitType: "case", labelTh: "ลัง (3 กล่อง)", labelEn: "Case (3 boxes)", price: 530, conversionRate: 3, sku: "WAIWAI-TY-CS", stock: 13 },
    ],
    baseUnit: "piece",
    baseStock: 1200,
    createdAt: "2025-12-05",
  },
  {
    id: "prod-4",
    name: "ข้าวหอมมะลิ ตราฉัตร 5 กก.",
    slug: "royal-umbrella-jasmine-rice-5kg",
    description:
      "ข้าวหอมมะลิแท้ 100% ตราฉัตร ขนาด 5 กิโลกรัม คัดสรรข้าวคุณภาพเกรดพรีเมียม หุงขึ้นหม้อ เมล็ดสวย หอมนุ่ม เหมาะสำหรับร้านอาหารและโรงแรมในภูเก็ต",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-2",
    units: [
      { unitType: "piece", labelTh: "ถุง (5 กก.)", labelEn: "Bag (5 kg)", price: 199, conversionRate: 1, sku: "RICE-RU5K-PC", stock: 200 },
      { unitType: "case", labelTh: "ลัง (4 ถุง)", labelEn: "Case (4 bags)", price: 750, compareAtPrice: 796, conversionRate: 4, sku: "RICE-RU5K-CS", stock: 50 },
    ],
    baseUnit: "piece",
    baseStock: 200,
    isFeatured: true,
    createdAt: "2025-12-08",
  },

  // ─── cat-2: อาหารกระป๋อง ────────────────────────────────────────
  {
    id: "prod-5",
    name: "ปลากระป๋อง ตราสามแม่ครัว ซอสมะเขือเทศ",
    slug: "three-lady-cooks-canned-fish-tomato",
    description:
      "ปลาซาร์ดีนในซอสมะเขือเทศ ตราสามแม่ครัว ขนาด 155 กรัม เนื้อปลาชิ้นใหญ่แน่น ซอสรสเข้มข้น อุดมด้วยโอเมก้า 3 และโปรตีน สะดวกพร้อมทาน ขายดีทั้งปลีกและส่ง",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-2",
    subcategoryId: "sub-2-1",
    units: [
      { unitType: "piece", labelTh: "กระป๋อง", labelEn: "Can", price: 20, conversionRate: 1, sku: "3LC-ST155-PC", stock: 600 },
      { unitType: "box", labelTh: "กล่อง (50 กระป๋อง)", labelEn: "Box (50 cans)", price: 900, compareAtPrice: 1000, conversionRate: 50, sku: "3LC-ST155-BX", stock: 12 },
    ],
    baseUnit: "piece",
    baseStock: 600,
    createdAt: "2025-12-10",
  },

  {
    id: "prod-5b",
    name: "ยำยำ จัมโบ้ รสต้มยำกุ้ง 67 กรัม",
    slug: "yumyum-jumbo-tomyum-67g",
    description:
      "บะหมี่กึ่งสำเร็จรูป ยำยำ จัมโบ้ รสต้มยำกุ้ง ขนาด 67 กรัม ซองใหญ่เต็มอิ่ม รสชาติจัดจ้านต้นตำรับ ขายดีทั้งปลีกและส่ง",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-1",
    units: [
      { unitType: "piece", labelTh: "ซอง", labelEn: "Pack", price: 8, conversionRate: 1, sku: "YY-JTY67-PC", stock: 1800 },
      { unitType: "box", labelTh: "แพ็ค (6 ซอง)", labelEn: "Pack (6 packs)", price: 44, conversionRate: 6, sku: "YY-JTY67-PK", stock: 300 },
      { unitType: "case", labelTh: "ลัง (6 แพ็ค)", labelEn: "Case (6 packs)", price: 249, compareAtPrice: 264, conversionRate: 6, sku: "YY-JTY67-CS", stock: 50 },
    ],
    baseUnit: "piece",
    baseStock: 1800,
    createdAt: "2026-01-15",
  },
  {
    id: "prod-5c",
    name: "โจ๊ก คนอร์ รสหมู 35 กรัม",
    slug: "knorr-porridge-pork-35g",
    description:
      "โจ๊กคัพ คนอร์ รสหมู ขนาด 35 กรัม แค่เติมน้ำร้อน รสชาติกลมกล่อม สะดวกรวดเร็ว เหมาะสำหรับมื้อเช้าหรือของว่าง",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-3",
    units: [
      { unitType: "piece", labelTh: "ถ้วย", labelEn: "Cup", price: 15, conversionRate: 1, sku: "KNR-PP35-PC", stock: 600 },
      { unitType: "box", labelTh: "ลัง (12 ถ้วย)", labelEn: "Case (12 cups)", price: 165, conversionRate: 12, sku: "KNR-PP35-CS", stock: 50 },
    ],
    baseUnit: "piece",
    baseStock: 600,
    createdAt: "2026-01-18",
  },
  {
    id: "prod-5d",
    name: "เส้นหมี่ จันทร์ ขนาด 200 กรัม",
    slug: "chan-rice-vermicelli-200g",
    description:
      "เส้นหมี่ ตราจันทร์ ขนาด 200 กรัม เส้นเล็กเหนียวนุ่ม ไม่เปื่อยง่าย เหมาะทำผัดหมี่ ใส่น้ำซุป หรือยำต่างๆ สินค้าขายดีประจำร้านค้า",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-4",
    units: [
      { unitType: "piece", labelTh: "ห่อ", labelEn: "Pack", price: 18, conversionRate: 1, sku: "CHAN-RV200-PC", stock: 500 },
      { unitType: "box", labelTh: "ลัง (30 ห่อ)", labelEn: "Case (30 packs)", price: 490, compareAtPrice: 540, conversionRate: 30, sku: "CHAN-RV200-CS", stock: 16 },
    ],
    baseUnit: "piece",
    baseStock: 500,
    createdAt: "2026-01-20",
  },
  {
    id: "prod-5e",
    name: "สปาเก็ตตี้ ควิกเชฟ 500 กรัม",
    slug: "quick-chef-spaghetti-500g",
    description:
      "เส้นสปาเก็ตตี้ ตราควิกเชฟ ขนาด 500 กรัม เส้นเหนียวนุ่มอร่อย ต้มง่าย เหมาะกับซอสทุกชนิด นิยมใช้ในร้านอาหารและครัวเรือน",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-1",
    subcategoryId: "sub-1-5",
    units: [
      { unitType: "piece", labelTh: "ห่อ", labelEn: "Pack", price: 25, conversionRate: 1, sku: "QC-SP500-PC", stock: 400 },
      { unitType: "box", labelTh: "ลัง (20 ห่อ)", labelEn: "Case (20 packs)", price: 450, compareAtPrice: 500, conversionRate: 20, sku: "QC-SP500-CS", stock: 20 },
    ],
    baseUnit: "piece",
    baseStock: 400,
    createdAt: "2026-01-22",
  },

  // ─── cat-3: เครื่องดื่มและนม ─────────────────────────────────────
  {
    id: "prod-6",
    name: "น้ำดื่มสิงห์ 600ml",
    slug: "singha-drinking-water-600ml",
    description:
      "น้ำดื่มสิงห์ ขนาด 600 มิลลิลิตร ผ่านกระบวนการกรองและฆ่าเชื้อด้วยโอโซน สะอาด ปลอดภัย ได้มาตรฐาน อย. เป็นที่นิยมในโรงแรม ร้านอาหาร และมินิมาร์ทในภูเก็ต",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    subcategoryId: "sub-3-1",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 10, conversionRate: 1, sku: "SNG-W600-PC", stock: 2400 },
      { unitType: "box", labelTh: "แพ็ค (12 ขวด)", labelEn: "Pack (12 bottles)", price: 99, compareAtPrice: 120, conversionRate: 12, sku: "SNG-W600-BX", stock: 200 },
      { unitType: "case", labelTh: "ลัง (2 แพ็ค)", labelEn: "Case (2 packs)", price: 189, conversionRate: 2, sku: "SNG-W600-CS", stock: 100 },
    ],
    baseUnit: "piece",
    baseStock: 2400,
    isFeatured: true,
    createdAt: "2025-12-01",
  },
  {
    id: "prod-7",
    name: "โค้ก (โคคา-โคล่า) 1.5 ลิตร",
    slug: "coca-cola-1500ml",
    description:
      "น้ำอัดลม โคคา-โคล่า ขนาด 1.5 ลิตร ซ่าสดชื่นคลายร้อน ขนาดแบ่งดื่มในครอบครัวหรือเสิร์ฟในร้านอาหาร เป็นเครื่องดื่มยอดนิยมตลอดกาลที่ขายดีทุกฤดูกาล",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    subcategoryId: "sub-3-2",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 35, conversionRate: 1, sku: "COKE-1500-PC", stock: 600 },
      { unitType: "box", labelTh: "แพ็ค (6 ขวด)", labelEn: "Pack (6 bottles)", price: 195, conversionRate: 6, sku: "COKE-1500-BX", stock: 100 },
      { unitType: "case", labelTh: "ลัง (4 แพ็ค)", labelEn: "Case (4 packs)", price: 740, compareAtPrice: 780, conversionRate: 4, sku: "COKE-1500-CS", stock: 25 },
    ],
    baseUnit: "piece",
    baseStock: 600,
    isFeatured: true,
    createdAt: "2025-12-15",
  },
  {
    id: "prod-8",
    name: "เนสกาแฟ เรดคัพ 200 กรัม",
    slug: "nescafe-red-cup-200g",
    description:
      "กาแฟสำเร็จรูป เนสกาแฟ เรดคัพ ขนาด 200 กรัม คั่วบดละเอียด กลิ่นหอมกรุ่น รสเข้มนุ่มลึก เหมาะสำหรับร้านกาแฟ โรงแรม และจำหน่ายปลีกในร้านสะดวกซื้อ",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Jar", price: 159, conversionRate: 1, sku: "NES-RC200-PC", stock: 150 },
      { unitType: "box", labelTh: "กล่อง (6 ขวด)", labelEn: "Box (6 jars)", price: 890, compareAtPrice: 954, conversionRate: 6, sku: "NES-RC200-BX", stock: 25 },
    ],
    baseUnit: "piece",
    baseStock: 150,
    createdAt: "2025-12-20",
  },
  {
    id: "prod-9",
    name: "นมไทย-เดนมาร์ค รสจืด 200ml",
    slug: "thai-denmark-plain-milk-200ml",
    description:
      "นมพร้อมดื่ม ยูเอชที ไทย-เดนมาร์ค รสจืด ขนาด 200 มล. นมโคแท้ 100% อุดมด้วยแคลเซียมและวิตามิน บำรุงกระดูกและฟัน เก็บได้นานไม่ต้องแช่เย็น นิยมจำหน่ายในร้านค้าและโรงเรียน",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    subcategoryId: "sub-3-4",
    units: [
      { unitType: "piece", labelTh: "กล่อง", labelEn: "Box", price: 14, conversionRate: 1, sku: "TDK-PM200-PC", stock: 960 },
      { unitType: "box", labelTh: "แพ็ค (36 กล่อง)", labelEn: "Pack (36 boxes)", price: 459, conversionRate: 36, sku: "TDK-PM200-BX", stock: 26 },
      { unitType: "case", labelTh: "ลัง (2 แพ็ค)", labelEn: "Case (2 packs)", price: 889, conversionRate: 2, sku: "TDK-PM200-CS", stock: 13 },
    ],
    baseUnit: "piece",
    baseStock: 960,
    isFeatured: true,
    createdAt: "2026-01-10",
  },

  {
    id: "prod-9b",
    name: "น้ำส้ม ทิปโก้ 100% 1 ลิตร",
    slug: "tipco-orange-juice-1l",
    description:
      "น้ำส้มแท้ 100% ตราทิปโก้ ขนาด 1 ลิตร ไม่ผสมน้ำตาล อุดมด้วยวิตามินซี สดชื่นดื่มง่าย เหมาะสำหรับร้านอาหาร โรงแรม และจำหน่ายปลีก",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    subcategoryId: "sub-3-2",
    units: [
      { unitType: "piece", labelTh: "กล่อง", labelEn: "Box", price: 59, conversionRate: 1, sku: "TPC-OJ1L-PC", stock: 300 },
      { unitType: "box", labelTh: "ลัง (12 กล่อง)", labelEn: "Case (12 boxes)", price: 649, compareAtPrice: 708, conversionRate: 12, sku: "TPC-OJ1L-CS", stock: 25 },
    ],
    baseUnit: "piece",
    baseStock: 300,
    createdAt: "2026-01-05",
  },
  {
    id: "prod-9c",
    name: "นมถั่วเหลือง แลคตาซอย 300ml",
    slug: "lactasoy-soymilk-300ml",
    description:
      "นมถั่วเหลือง แลคตาซอย ขนาด 300 มล. รสหวาน หอมมัน อุดมด้วยโปรตีนจากถั่วเหลือง เหมาะสำหรับทุกวัย นิยมจำหน่ายในร้านสะดวกซื้อและร้านค้าปลีก",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    subcategoryId: "sub-3-5",
    units: [
      { unitType: "piece", labelTh: "กล่อง", labelEn: "Box", price: 12, conversionRate: 1, sku: "LACT-SM300-PC", stock: 1200 },
      { unitType: "box", labelTh: "แพ็ค (36 กล่อง)", labelEn: "Pack (36 boxes)", price: 389, conversionRate: 36, sku: "LACT-SM300-BX", stock: 33 },
    ],
    baseUnit: "piece",
    baseStock: 1200,
    createdAt: "2026-01-08",
  },
  {
    id: "prod-9d",
    name: "สไปรท์ 1.25 ลิตร",
    slug: "sprite-1250ml",
    description:
      "น้ำอัดลม สไปรท์ ขนาด 1.25 ลิตร ซ่าสดชื่น รสมะนาว ดื่มแล้วสดชื่นคลายร้อน เป็นเครื่องดื่มยอดนิยมในร้านอาหารและร้านค้าปลีก",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-3",
    subcategoryId: "sub-3-2",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 29, conversionRate: 1, sku: "SPR-1250-PC", stock: 480 },
      { unitType: "box", labelTh: "แพ็ค (6 ขวด)", labelEn: "Pack (6 bottles)", price: 159, conversionRate: 6, sku: "SPR-1250-BX", stock: 80 },
    ],
    baseUnit: "piece",
    baseStock: 480,
    createdAt: "2026-01-12",
  },

  // ─── cat-4: เครื่องปรุงรส ──────────────────────────────────────
  {
    id: "prod-10",
    name: "น้ำปลาทิพรส 700ml",
    slug: "tiparos-fish-sauce-700ml",
    description:
      "น้ำปลาทิพรส สูตรต้นตำรับ ขนาด 700 มล. หมักจากปลาทะเลแท้ หอม กลมกล่อม ให้รสเค็มนัว เป็นเครื่องปรุงหลักของทุกครัวไทย เหมาะสำหรับร้านอาหารและโรงแรมที่ต้องการคุณภาพ",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-4",
    subcategoryId: "sub-4-1",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 35, conversionRate: 1, sku: "TPR-FS700-PC", stock: 400 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 380, conversionRate: 12, sku: "TPR-FS700-BX", stock: 33 },
    ],
    baseUnit: "piece",
    baseStock: 400,
    isFeatured: true,
    createdAt: "2025-12-05",
  },
  {
    id: "prod-11",
    name: "ซอสพริก ศรีราชา พานิช 300ml",
    slug: "sriracha-panich-chili-sauce-300ml",
    description:
      "ซอสพริก ศรีราชา พานิช สูตรดั้งเดิม ขนาด 300 มล. รสเผ็ดหวานหอมกลิ่นพริกและกระเทียม ใช้จิ้มได้ทุกเมนู ติดครัวทุกร้านอาหารในภูเก็ต ส่งออกทั่วโลก",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-4",
    subcategoryId: "sub-4-4",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 25, conversionRate: 1, sku: "SRI-CS300-PC", stock: 350 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 270, conversionRate: 12, sku: "SRI-CS300-BX", stock: 29 },
    ],
    baseUnit: "piece",
    baseStock: 350,
    createdAt: "2025-12-22",
  },
  {
    id: "prod-12",
    name: "ซอสหอยนางรม ตราแม่กรุณา 600ml",
    slug: "maekrua-oyster-sauce-600ml",
    description:
      "ซอสหอยนางรม ตราแม่กรุณา ขนาด 600 มล. สกัดจากหอยนางรมแท้ ให้รสชาติกลมกล่อมหอมเข้มข้น เหมาะสำหรับผัด ราดหน้า หรือหมักเนื้อสัตว์ ขายดีอันดับต้นๆ ในหมวดเครื่องปรุงรส",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-4",
    subcategoryId: "sub-4-2",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 39, conversionRate: 1, sku: "MKR-OY600-PC", stock: 300 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 420, conversionRate: 12, sku: "MKR-OY600-BX", stock: 25 },
    ],
    baseUnit: "piece",
    baseStock: 300,
    createdAt: "2026-01-05",
  },
  {
    id: "prod-13",
    name: "น้ำตาลทราย มิตรผล 1 กก.",
    slug: "mitr-phol-white-sugar-1kg",
    description:
      "น้ำตาลทรายขาวบริสุทธิ์ ตรามิตรผล ขนาด 1 กิโลกรัม ผลิตจากอ้อยคุณภาพ ให้ความหวานกลมกล่อม ละลายง่าย เหมาะสำหรับประกอบอาหาร ทำขนม และเครื่องดื่ม",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-4",
    units: [
      { unitType: "piece", labelTh: "ถุง (1 กก.)", labelEn: "Bag (1 kg)", price: 28, conversionRate: 1, sku: "MP-SG1K-PC", stock: 500 },
      { unitType: "box", labelTh: "กล่อง (10 ถุง)", labelEn: "Box (10 bags)", price: 260, conversionRate: 10, sku: "MP-SG1K-BX", stock: 50 },
    ],
    baseUnit: "piece",
    baseStock: 500,
    createdAt: "2026-01-12",
  },

  // ─── cat-6: ขนมและของว่าง ──────────────────────────────────────
  {
    id: "prod-14",
    name: "เลย์ รสสาหร่าย 75 กรัม",
    slug: "lays-nori-seaweed-75g",
    description:
      "มันฝรั่งทอดกรอบ เลย์ รสสาหร่าย ขนาด 75 กรัม กรอบบางเบา โรยผงสาหร่ายหอมอร่อย เป็นรสที่ขายดีที่สุดในไทย เหมาะวางขายในร้านสะดวกซื้อและมินิมาร์ท",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-6",
    subcategoryId: "sub-6-1",
    units: [
      { unitType: "piece", labelTh: "ถุง", labelEn: "Bag", price: 20, conversionRate: 1, sku: "LAY-NR75-PC", stock: 480 },
      { unitType: "box", labelTh: "กล่อง (12 ถุง)", labelEn: "Box (12 bags)", price: 220, compareAtPrice: 240, conversionRate: 12, sku: "LAY-NR75-BX", stock: 40 },
      { unitType: "case", labelTh: "ลัง (4 กล่อง)", labelEn: "Case (4 boxes)", price: 840, conversionRate: 4, sku: "LAY-NR75-CS", stock: 10 },
    ],
    baseUnit: "piece",
    baseStock: 480,
    createdAt: "2025-12-10",
  },
  {
    id: "prod-15",
    name: "ทาโร่ รสดั้งเดิม 52 กรัม",
    slug: "taro-original-52g",
    description:
      "ขนมปลาเส้นอบกรอบ ทาโร่ รสดั้งเดิม ขนาด 52 กรัม กรอบ หอม อร่อย ทานเพลินเป็นของว่าง สินค้าใหม่ที่เพิ่มเข้าสต็อก ได้รับความนิยมจากทั้งเด็กและผู้ใหญ่",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-6",
    subcategoryId: "sub-6-1",
    units: [
      { unitType: "piece", labelTh: "ซอง", labelEn: "Pack", price: 10, conversionRate: 1, sku: "TARO-OG52-PC", stock: 600 },
      { unitType: "box", labelTh: "กล่อง (12 ซอง)", labelEn: "Box (12 packs)", price: 108, conversionRate: 12, sku: "TARO-OG52-BX", stock: 50 },
      { unitType: "case", labelTh: "ลัง (6 กล่อง)", labelEn: "Case (6 boxes)", price: 610, conversionRate: 6, sku: "TARO-OG52-CS", stock: 8 },
    ],
    baseUnit: "piece",
    baseStock: 600,
    isNew: true,
    createdAt: "2026-02-15",
  },
  {
    id: "prod-16",
    name: "โพคกี้ ช็อกโกแลต 47 กรัม",
    slug: "pocky-chocolate-47g",
    description:
      "ขนมบิสกิตแท่งเคลือบช็อกโกแลต โพคกี้ ขนาด 47 กรัม รสช็อกโกแลตเข้มข้น หวานมัน อร่อยทุกแท่ง เป็นขนมยอดฮิตที่นักท่องเที่ยวในภูเก็ตชื่นชอบ",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-6",
    subcategoryId: "sub-6-1",
    units: [
      { unitType: "piece", labelTh: "กล่อง", labelEn: "Pack", price: 15, conversionRate: 1, sku: "POCKY-CH47-PC", stock: 720 },
      { unitType: "box", labelTh: "แพ็ค (10 กล่อง)", labelEn: "Box (10 packs)", price: 135, conversionRate: 10, sku: "POCKY-CH47-BX", stock: 72 },
      { unitType: "case", labelTh: "ลัง (6 แพ็ค)", labelEn: "Case (6 boxes)", price: 750, conversionRate: 6, sku: "POCKY-CH47-CS", stock: 12 },
    ],
    baseUnit: "piece",
    baseStock: 720,
    isFeatured: true,
    createdAt: "2025-12-25",
  },
  {
    id: "prod-17",
    name: "ลูกอมนมอัดเม็ด จิตรลดา 100 เม็ด",
    slug: "chitralada-milk-tablet-100pcs",
    description:
      "ลูกอมนมอัดเม็ด ตราจิตรลดา ซองขนาด 100 เม็ด ผลิตจากนมโคแท้สดใหม่จากฟาร์มสวนจิตรลดา รสนมหวานมันอร่อย เป็นของฝากชื่อดังของไทยที่นักท่องเที่ยวนิยมซื้อ",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-6",
    subcategoryId: "sub-6-1",
    units: [
      { unitType: "piece", labelTh: "ซอง", labelEn: "Pack", price: 30, conversionRate: 1, sku: "CTL-MT100-PC", stock: 300 },
      { unitType: "box", labelTh: "กล่อง (12 ซอง)", labelEn: "Box (12 packs)", price: 330, conversionRate: 12, sku: "CTL-MT100-BX", stock: 25 },
    ],
    baseUnit: "piece",
    baseStock: 300,
    isNew: true,
    createdAt: "2026-02-25",
  },
  {
    id: "prod-18",
    name: "โอรีโอ้ ช็อกโกแลตครีม 119.6 กรัม",
    slug: "oreo-chocolate-cream-119g",
    description:
      "บิสกิตสอดไส้ครีมช็อกโกแลต โอรีโอ้ ขนาด 119.6 กรัม บิสกิตกรอบรสโกโก้เข้มข้น ไส้ครีมหวานมัน อร่อยสนุกทุกคำ เป็นขนมยอดนิยมระดับโลกที่ขายดีตลอดทั้งปี",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-6",
    subcategoryId: "sub-6-1",
    units: [
      { unitType: "piece", labelTh: "ห่อ", labelEn: "Pack", price: 15, conversionRate: 1, sku: "OREO-CC119-PC", stock: 400 },
      { unitType: "box", labelTh: "กล่อง (24 ห่อ)", labelEn: "Box (24 packs)", price: 330, conversionRate: 24, sku: "OREO-CC119-BX", stock: 16 },
    ],
    baseUnit: "piece",
    baseStock: 400,
    createdAt: "2026-01-15",
  },

  // ─── cat-7: ของใช้ในบ้าน ───────────────────────────────────────
  {
    id: "prod-19",
    name: "น้ำยาล้างจาน มาม่าเลมอน 800ml",
    slug: "mama-lemon-dishwash-800ml",
    description:
      "น้ำยาล้างจาน มาม่าเลมอน ขนาด 800 มล. สูตรมะนาวเข้มข้น ล้างสะอาดหมดจด ขจัดคราบไขมันได้อย่างมีประสิทธิภาพ ไม่ทิ้งกลิ่นคาว ถนอมมือ",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-7",
    subcategoryId: "sub-7-3",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 55, conversionRate: 1, sku: "MML-LM800-PC", stock: 240 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 600, conversionRate: 12, sku: "MML-LM800-BX", stock: 20 },
    ],
    baseUnit: "piece",
    baseStock: 240,
    createdAt: "2025-12-12",
  },
  {
    id: "prod-20",
    name: "กระดาษทิชชู่ สก็อตต์ 24 ม้วน",
    slug: "scott-tissue-roll-24pk",
    description:
      "กระดาษทิชชู่ม้วน สก็อตต์ แพ็ค 24 ม้วน เนื้อกระดาษนุ่มหนา ดูดซับได้ดีเยี่ยม ไม่ขาดง่าย เหมาะสำหรับห้องน้ำในโรงแรม ร้านอาหาร และครัวเรือน ใช้ได้อย่างคุ้มค่า",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-7",
    subcategoryId: "sub-7-1",
    units: [
      { unitType: "piece", labelTh: "แพ็ค (24 ม้วน)", labelEn: "Pack (24 rolls)", price: 189, compareAtPrice: 209, conversionRate: 1, sku: "SCT-TS24R-PC", stock: 120 },
      { unitType: "case", labelTh: "ลัง (4 แพ็ค)", labelEn: "Case (4 packs)", price: 699, conversionRate: 4, sku: "SCT-TS24R-CS", stock: 30 },
    ],
    baseUnit: "piece",
    baseStock: 120,
    createdAt: "2025-12-28",
  },
  {
    id: "prod-21",
    name: "ถุงขยะ ตราช้าง 30×40 นิ้ว",
    slug: "elephant-garbage-bag-30x40",
    description:
      "ถุงขยะ ตราช้าง ขนาด 30×40 นิ้ว แพ็ค 10 ใบ ทำจากพลาสติกเกรดเอ หนาแข็งแรง ไม่ขาดง่าย รับน้ำหนักได้ดี เหมาะสำหรับร้านค้า ร้านอาหาร และโรงแรม",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-7",
    units: [
      { unitType: "piece", labelTh: "แพ็ค (10 ใบ)", labelEn: "Pack (10 pcs)", price: 25, conversionRate: 1, sku: "ELP-GB3040-PC", stock: 500 },
      { unitType: "box", labelTh: "กล่อง (20 แพ็ค)", labelEn: "Box (20 packs)", price: 450, conversionRate: 20, sku: "ELP-GB3040-BX", stock: 25 },
    ],
    baseUnit: "piece",
    baseStock: 500,
    createdAt: "2026-01-20",
  },

  // ─── cat-9: ของใช้ส่วนตัว ─────────────────────────────────────
  {
    id: "prod-22",
    name: "สบู่ลักส์ ไวท์ อิมเพรส 70 กรัม",
    slug: "lux-white-impress-70g",
    description:
      "สบู่ก้อน ลักส์ สูตรไวท์ อิมเพรส ขนาด 70 กรัม ผสมสารสกัดจากดอกไม้ขาว ช่วยให้ผิวกระจ่างใส เนียนนุ่ม กลิ่นหอมหรูหรา เป็นสบู่ขายดีประจำร้านโชห่วยทั่วภูเก็ต",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-9",
    units: [
      { unitType: "piece", labelTh: "ก้อน", labelEn: "Bar", price: 19, conversionRate: 1, sku: "LUX-WI70-PC", stock: 800 },
      { unitType: "box", labelTh: "แพ็ค (4 ก้อน)", labelEn: "Pack (4 bars)", price: 69, conversionRate: 4, sku: "LUX-WI70-BX", stock: 200 },
      { unitType: "case", labelTh: "ลัง (12 แพ็ค)", labelEn: "Case (12 packs)", price: 780, compareAtPrice: 828, conversionRate: 12, sku: "LUX-WI70-CS", stock: 16 },
    ],
    baseUnit: "piece",
    baseStock: 800,
    isFeatured: true,
    createdAt: "2026-01-02",
  },
  {
    id: "prod-23",
    name: "แชมพู แพนทีน สูตรเส้นผมเข้มแข็ง 300ml",
    slug: "pantene-hair-fall-control-300ml",
    description:
      "แชมพู แพนทีน สูตรลดผมหลุดร่วง ขนาด 300 มล. เทคโนโลยี Pro-V ช่วยบำรุงเส้นผมจากรากถึงปลาย ลดการหลุดร่วงจากการหวี ผมนุ่มสลวย มีน้ำหนัก",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-9",
    subcategoryId: "sub-9-6",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 99, conversionRate: 1, sku: "PAN-HFC300-PC", stock: 160 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 1080, conversionRate: 12, sku: "PAN-HFC300-BX", stock: 13 },
    ],
    baseUnit: "piece",
    baseStock: 160,
    createdAt: "2026-01-18",
  },
  {
    id: "prod-24",
    name: "ยาสีฟัน คอลเกต สดชื่นเย็นซ่า 150 กรัม",
    slug: "colgate-cool-mint-150g",
    description:
      "ยาสีฟัน คอลเกต สูตรสดชื่นเย็นซ่า ขนาด 150 กรัม มีฟลูออไรด์ช่วยป้องกันฟันผุ สดชื่นยาวนาน ฟันขาวสะอาด เป็นยาสีฟันอันดับ 1 ที่ขายดีที่สุดในประเทศไทย",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-9",
    subcategoryId: "sub-9-1",
    units: [
      { unitType: "piece", labelTh: "หลอด", labelEn: "Tube", price: 39, conversionRate: 1, sku: "CLG-CM150-PC", stock: 350 },
      { unitType: "box", labelTh: "กล่อง (12 หลอด)", labelEn: "Box (12 tubes)", price: 430, conversionRate: 12, sku: "CLG-CM150-BX", stock: 29 },
    ],
    baseUnit: "piece",
    baseStock: 350,
    isFeatured: true,
    createdAt: "2026-01-25",
  },

  // ─── cat-5: น้ำมันปรุงอาหาร ──────────────────────────────────────
  {
    id: "prod-25",
    name: "น้ำมันถั่วเหลือง ตราองุ่น 1 ลิตร",
    slug: "angoon-soybean-oil-1l",
    description:
      "น้ำมันถั่วเหลืองบริสุทธิ์ ตราองุ่น ขนาด 1 ลิตร เหมาะสำหรับทอด ผัด และประกอบอาหารทุกประเภท ทนความร้อนสูง ให้สีอาหารสวย เป็นน้ำมันพืชยอดนิยมในครัวไทย",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-5",
    subcategoryId: "sub-5-1",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 55, conversionRate: 1, sku: "AGN-SB1L-PC", stock: 240 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 600, compareAtPrice: 660, conversionRate: 12, sku: "AGN-SB1L-BX", stock: 20 },
    ],
    baseUnit: "piece",
    baseStock: 240,
    isFeatured: true,
    createdAt: "2026-01-05",
  },
  {
    id: "prod-26",
    name: "น้ำมันรำข้าว ตราคิง 1 ลิตร",
    slug: "king-rice-bran-oil-1l",
    description:
      "น้ำมันรำข้าว ตราคิง ขนาด 1 ลิตร สกัดจากรำข้าวคุณภาพ มีวิตามินอีสูง ช่วยลดคอเลสเตอรอล ทอดอาหารได้สีสวยน่าทาน กลิ่นหอม เหมาะสำหรับผู้รักสุขภาพ",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-5",
    subcategoryId: "sub-5-1",
    units: [
      { unitType: "piece", labelTh: "ขวด", labelEn: "Bottle", price: 69, conversionRate: 1, sku: "KING-RBO1L-PC", stock: 180 },
      { unitType: "box", labelTh: "กล่อง (12 ขวด)", labelEn: "Box (12 bottles)", price: 750, conversionRate: 12, sku: "KING-RBO1L-BX", stock: 15 },
    ],
    baseUnit: "piece",
    baseStock: 180,
    isNew: true,
    createdAt: "2026-03-01",
  },
  {
    id: "prod-27",
    name: "มาการีน ตราอิมพีเรียล 1 กก.",
    slug: "imperial-margarine-1kg",
    description:
      "มาการีน ตราอิมพีเรียล ขนาด 1 กิโลกรัม เนื้อเนียนนุ่มทาขนมปังง่าย รสชาติหอมมัน ใช้แทนเนยได้ทั้งทำขนมอบ เบเกอรี่ และประกอบอาหาร เหมาะสำหรับร้านเบเกอรี่และโรงแรม",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-5",
    subcategoryId: "sub-5-1",
    units: [
      { unitType: "piece", labelTh: "กล่อง (1 กก.)", labelEn: "Box (1 kg)", price: 75, conversionRate: 1, sku: "IMP-MG1K-PC", stock: 100 },
      { unitType: "box", labelTh: "ลัง (12 กล่อง)", labelEn: "Case (12 boxes)", price: 830, conversionRate: 12, sku: "IMP-MG1K-BX", stock: 8 },
    ],
    baseUnit: "piece",
    baseStock: 100,
    createdAt: "2026-03-05",
  },

  // ─── cat-8: ผลิตภัณฑ์ซักรีด ───────────────────────────────────
  {
    id: "prod-28",
    name: "น้ำยาซักผ้า แอทแทค สูตรเข้มข้น 800ml",
    slug: "attack-concentrated-liquid-800ml",
    description:
      "น้ำยาซักผ้า แอทแทค สูตรเข้มข้นพิเศษ ขนาด 800 มล. ซักสะอาดหมดจดแม้คราบฝังแน่น หอมสดชื่นยาวนาน ถนอมเนื้อผ้า ใช้ได้ทั้งซักมือและเครื่องซักผ้า",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-8",
    subcategoryId: "sub-8-1",
    units: [
      { unitType: "piece", labelTh: "ถุง", labelEn: "Pouch", price: 65, conversionRate: 1, sku: "ATK-LQ800-PC", stock: 200 },
      { unitType: "box", labelTh: "กล่อง (12 ถุง)", labelEn: "Box (12 pouches)", price: 720, compareAtPrice: 780, conversionRate: 12, sku: "ATK-LQ800-BX", stock: 16 },
    ],
    baseUnit: "piece",
    baseStock: 200,
    isFeatured: true,
    createdAt: "2026-01-08",
  },
  {
    id: "prod-29",
    name: "น้ำยาซักผ้า บรีส เอกเซล 600ml",
    slug: "breeze-excel-liquid-600ml",
    description:
      "น้ำยาซักผ้า บรีส เอกเซล ขนาด 600 มล. สูตรขจัดคราบเข้มข้น ซักหมดจดในครั้งเดียว หอมสะอาดยาวนาน เหมาะสำหรับทุกประเภทผ้า ถนอมสีผ้าไม่ให้ซีดจาง",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-8",
    subcategoryId: "sub-8-1",
    units: [
      { unitType: "piece", labelTh: "ถุง", labelEn: "Pouch", price: 55, conversionRate: 1, sku: "BRZ-EX600-PC", stock: 180 },
      { unitType: "box", labelTh: "กล่อง (12 ถุง)", labelEn: "Box (12 pouches)", price: 600, conversionRate: 12, sku: "BRZ-EX600-BX", stock: 15 },
    ],
    baseUnit: "piece",
    baseStock: 180,
    createdAt: "2026-02-01",
  },
  {
    id: "prod-30",
    name: "น้ำยาปรับผ้านุ่ม ดาวน์นี่ สวนดอกไม้ 600ml",
    slug: "downy-garden-bloom-600ml",
    description:
      "น้ำยาปรับผ้านุ่ม ดาวน์นี่ สูตรสวนดอกไม้ ขนาด 600 มล. ช่วยให้ผ้านุ่มฟู กลิ่นหอมดอกไม้สดชื่นติดผ้ายาวนานตลอดวัน ลดรอยยับ รีดเรียบง่าย สินค้าใหม่เข้าสต็อกล่าสุด",
    images: [getPlaceholderUrl(600, 600, "Product")],
    categoryId: "cat-8",
    subcategoryId: "sub-8-2",
    units: [
      { unitType: "piece", labelTh: "ถุง", labelEn: "Pouch", price: 49, conversionRate: 1, sku: "DWN-GB600-PC", stock: 200 },
      { unitType: "box", labelTh: "กล่อง (12 ถุง)", labelEn: "Box (12 pouches)", price: 540, conversionRate: 12, sku: "DWN-GB600-BX", stock: 16 },
    ],
    baseUnit: "piece",
    baseStock: 200,
    isNew: true,
    createdAt: "2026-03-01",
  },
];
