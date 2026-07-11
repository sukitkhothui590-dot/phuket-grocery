import type { Category } from "@/types";

const img = (name: string) => `/images/Categoriesproduct/${name}`;
const catImg = (name: string) => `/categories/${name}`;
const customCatImg = (index: number) => catImg(`custom/category-${index}.png`);

const cat1Image = customCatImg(1);
const cat2Image = customCatImg(2);
const cat3Image = customCatImg(3);
const cat4Image = customCatImg(4);
const cat5Image = customCatImg(5);
const cat6Image = customCatImg(6);
const cat7Image = customCatImg(7);
const cat8Image = customCatImg(8);
const cat9Image = customCatImg(9);
const cat10Image = customCatImg(10);
const cat11Image = customCatImg(11);
const cat12Image = customCatImg(12);

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "อาหารแห้งและบะหมี่",
    slug: "dry-food-noodles",
    image: cat1Image,
    description: "บะหมี่กึ่งสำเร็จรูป ข้าวสาร โจ๊ก วุ้นเส้น เส้นสปาเก็ตตี้ อาหารแห้ง และอาหารพร้อมทาน",
    subcategories: [
      { id: "sub-1-1", name: "บะหมี่กึ่งสำเร็จรูป", slug: "instant-noodles", parentId: "cat-1", image: cat1Image },
      { id: "sub-1-2", name: "ข้าวสาร", slug: "rice", parentId: "cat-1", image: cat1Image },
      { id: "sub-1-3", name: "โจ๊กและข้าวต้ม", slug: "porridge-congee", parentId: "cat-1", image: cat1Image },
      { id: "sub-1-4", name: "วุ้นเส้น / เส้นหมี่", slug: "vermicelli", parentId: "cat-1", image: cat1Image },
      { id: "sub-1-5", name: "เส้นสปาเก็ตตี้", slug: "spaghetti", parentId: "cat-1", image: cat1Image },
      { id: "sub-1-6", name: "อาหารแห้ง", slug: "dry-food", parentId: "cat-1", image: cat1Image },
      { id: "sub-1-7", name: "อาหารพร้อมทาน", slug: "ready-to-eat", parentId: "cat-1", image: cat1Image },
    ],
  },
  {
    id: "cat-2",
    name: "อาหารกระป๋อง",
    slug: "canned-food",
    image: cat2Image,
    description: "ปลากระป๋อง ผลไม้กระป๋อง และผักสำเร็จรูป",
    subcategories: [
      { id: "sub-2-1", name: "ปลากระป๋อง", slug: "canned-fish", parentId: "cat-2", image: cat2Image },
      { id: "sub-2-2", name: "ผลไม้กระป๋อง", slug: "canned-fruit", parentId: "cat-2", image: cat2Image },
      { id: "sub-2-3", name: "ผักสำเร็จรูป", slug: "processed-vegetables", parentId: "cat-2", image: cat2Image },
    ],
  },
  {
    id: "cat-3",
    name: "เครื่องดื่มและนม",
    slug: "beverages-milk",
    image: cat3Image,
    description: "น้ำดื่ม น้ำอัดลม นม นมยูเอชที นมถั่วเหลือง และนมผง",
    subcategories: [
      { id: "sub-3-1", name: "น้ำดื่ม", slug: "water", parentId: "cat-3", image: cat3Image },
      { id: "sub-3-2", name: "น้ำอัดลม", slug: "soft-drinks", parentId: "cat-3", image: cat3Image },
      { id: "sub-3-3", name: "นม", slug: "milk", parentId: "cat-3", image: cat3Image },
      { id: "sub-3-4", name: "นมยูเอชที", slug: "uht-milk", parentId: "cat-3", image: cat3Image },
      { id: "sub-3-5", name: "นมถั่วเหลือง", slug: "soy-milk", parentId: "cat-3", image: cat3Image },
      { id: "sub-3-6", name: "นมผง", slug: "powdered-milk", parentId: "cat-3", image: cat3Image },
    ],
  },
  {
    id: "cat-4",
    name: "เครื่องปรุงรส",
    slug: "condiments",
    image: cat4Image,
    description: "น้ำปลา ซอสหอยนางรม ซีอิ๊ว น้ำจิ้ม น้ำพริกเผา เต้าเจี้ยว เครื่องแกง และน้ำส้มสายชู",
    subcategories: [
      { id: "sub-4-1", name: "น้ำปลา", slug: "fish-sauce", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-2", name: "ซอสหอยนางรม", slug: "oyster-sauce", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-3", name: "ซีอิ๊ว / เห็ดหอม", slug: "soy-sauce", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-4", name: "น้ำจิ้ม", slug: "dipping-sauce", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-5", name: "น้ำพริกเผา", slug: "chili-paste", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-6", name: "เต้าเจี้ยว", slug: "soybean-paste", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-7", name: "เครื่องแกงกะหรี่", slug: "curry-paste", parentId: "cat-4", image: cat4Image },
      { id: "sub-4-8", name: "น้ำส้มสายชู", slug: "vinegar", parentId: "cat-4", image: cat4Image },
    ],
  },
  {
    id: "cat-5",
    name: "น้ำมันปรุงอาหาร",
    slug: "cooking-oil",
    image: cat5Image,
    description: "น้ำมันพืช น้ำมันรำข้าว น้ำมันมะกอก และน้ำมันปาล์ม",
    subcategories: [
      { id: "sub-5-1", name: "น้ำมันพืช", slug: "vegetable-oil", parentId: "cat-5", image: cat5Image },
    ],
  },
  {
    id: "cat-6",
    name: "ขนมและของว่าง",
    slug: "snacks",
    image: cat6Image,
    description: "เวเฟอร์ คุกกี้ บิสกิต ขนมขบเคี้ยว ช็อกโกแลต และลูกอม",
    subcategories: [
      { id: "sub-6-1", name: "เวเฟอร์ / คุกกี้", slug: "wafer-cookies", parentId: "cat-6", image: cat6Image },
    ],
  },
  {
    id: "cat-7",
    name: "ของใช้ในบ้าน",
    slug: "household",
    image: cat7Image,
    description: "กระดาษทิชชู่ น้ำยาถูพื้น น้ำยาขจัดคราบ น้ำยาเช็ดกระจก และสเปรย์ปรับอากาศ",
    subcategories: [
      { id: "sub-7-1", name: "กระดาษทิชชู่", slug: "tissue", parentId: "cat-7", image: cat7Image },
      { id: "sub-7-2", name: "น้ำยาถูพื้น", slug: "floor-cleaner", parentId: "cat-7", image: cat7Image },
      { id: "sub-7-3", name: "น้ำยาขจัดคราบ", slug: "stain-remover", parentId: "cat-7", image: cat7Image },
      { id: "sub-7-4", name: "น้ำยาเช็ดกระจก", slug: "glass-cleaner", parentId: "cat-7", image: cat7Image },
      { id: "sub-7-5", name: "ล้างห้องน้ำ / ท่ออุดตัน", slug: "bathroom-drain-cleaner", parentId: "cat-7", image: cat7Image },
      { id: "sub-7-6", name: "สเปรย์ปรับอากาศ / ก้อนดับกลิ่น", slug: "air-freshener", parentId: "cat-7", image: cat7Image },
    ],
  },
  {
    id: "cat-8",
    name: "ผลิตภัณฑ์ซักรีด",
    slug: "laundry",
    image: cat8Image,
    description: "น้ำยาปรับผ้านุ่ม น้ำยารีดผ้า น้ำยาซักผ้า และผงซักฟอก",
    subcategories: [
      { id: "sub-8-1", name: "น้ำยาปรับผ้านุ่ม", slug: "fabric-softener", parentId: "cat-8", image: cat8Image },
      { id: "sub-8-2", name: "น้ำยารีดผ้า / อัดกลีบ", slug: "ironing-spray", parentId: "cat-8", image: cat8Image },
    ],
  },
  {
    id: "cat-9",
    name: "ของใช้ส่วนตัว",
    slug: "personal-care",
    image: cat9Image,
    description: "แปรงสีฟัน ครีมขจัดขน ผ้าอนามัย สำลี เจลล้างมือ โลชั่น และวิตามิน",
    subcategories: [
      { id: "sub-9-1", name: "แปรงสีฟัน", slug: "toothbrush", parentId: "cat-9", image: cat9Image },
      { id: "sub-9-2", name: "ครีมขจัดขน", slug: "hair-removal", parentId: "cat-9", image: cat9Image },
      { id: "sub-9-3", name: "ผ้าอนามัย", slug: "sanitary-pads", parentId: "cat-9", image: cat9Image },
      { id: "sub-9-4", name: "สำลี / คัตตอนบัด", slug: "cotton-buds", parentId: "cat-9", image: cat9Image },
      { id: "sub-9-5", name: "เจลล้างมือ", slug: "hand-sanitizer", parentId: "cat-9", image: cat9Image },
      { id: "sub-9-6", name: "โลชั่น / บำรุงผม / วิตามิน", slug: "lotion-hair-vitamin", parentId: "cat-9", image: cat9Image },
    ],
  },
  {
    id: "cat-10",
    name: "สัตว์เลี้ยงและเกษตร",
    slug: "pet-garden",
    image: cat10Image,
    description: "อาหารสัตว์เลี้ยง ทรายแมว และเมล็ดพันธุ์ผัก",
    subcategories: [
      { id: "sub-10-1", name: "อาหารกระต่าย", slug: "rabbit-food", parentId: "cat-10", image: cat10Image },
      { id: "sub-10-2", name: "ทรายแมว / ขี้เลื่อย", slug: "cat-litter", parentId: "cat-10", image: cat10Image },
      { id: "sub-10-3", name: "เมล็ดพันธุ์ผัก", slug: "vegetable-seeds", parentId: "cat-10", image: cat10Image },
    ],
  },
  {
    id: "cat-11",
    name: "อาหารเสริมและสุขภาพ",
    slug: "supplements-health",
    image: cat11Image,
    description: "อาหารเสริม วิตามิน และผลิตภัณฑ์เพื่อสุขภาพ",
    subcategories: [
      { id: "sub-11-1", name: "อาหารเสริม", slug: "supplements", parentId: "cat-11", image: cat11Image },
    ],
  },
  {
    id: "cat-12",
    name: "ยานยนต์และดูแลรองเท้า",
    slug: "automotive-shoe-care",
    image: cat12Image,
    description: "น้ำยาขัดสีรถ แว็กซ์ น้ำมันหล่อลื่น และผลิตภัณฑ์ดูแลรองเท้า",
    subcategories: [
      { id: "sub-12-1", name: "น้ำยาขัดสีรถ / แว็กซ์ / น้ำมันหล่อลื่น", slug: "car-wax-lubricant", parentId: "cat-12", image: cat12Image },
      { id: "sub-12-2", name: "ผลิตภัณฑ์ดูแลเท้า / น้ำยาขัดรองเท้า", slug: "foot-shoe-care", parentId: "cat-12", image: cat12Image },
    ],
  },
];
