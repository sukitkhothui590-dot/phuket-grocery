import type { Metadata } from "next";
import { Store, Truck, ShieldCheck, Package, Users, Clock } from "lucide-react";
import { COMPANY_INFO, SITE_NAME, DELIVERY_AREAS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: `${COMPANY_INFO.name} - ร้านขายส่งสินค้าอุปโภคบริโภค ราคาส่ง จัดส่งทั่วภูเก็ต`,
};

const highlights = [
  {
    icon: Store,
    title: "สินค้าครบกว่า 10,000 รายการ",
    description:
      "คัดสรรสินค้าอุปโภคบริโภคจากแบรนด์ชั้นนำ ครบทุกหมวดหมู่ ทั้งอาหารแห้ง เครื่องดื่ม ขนม เครื่องปรุง ของใช้ในบ้าน และของใช้ส่วนตัว รองรับทั้งร้านค้าปลีก ร้านอาหาร โรงแรม และผู้บริโภคทั่วไป",
  },
  {
    icon: Package,
    title: "ซื้อชิ้น กล่อง ลัง ราคาส่ง",
    description:
      "เลือกซื้อได้ตามความต้องการ ไม่ว่าจะซื้อเป็นชิ้น กล่อง หรือยกลัง ราคาแตกต่างตามปริมาณ ซื้อเยอะยิ่งประหยัด เหมาะทั้งร้านค้าที่ต้องการซื้อยกลัง และลูกค้าทั่วไปที่ต้องการซื้อเป็นชิ้น",
  },
  {
    icon: Truck,
    title: "จัดส่งรวดเร็วทั่วภูเก็ต",
    description:
      "บริการจัดส่งถึงหน้าร้านหรือบ้านคุณทุกวันจันทร์-เสาร์ ภายใน 1-2 วันทำการ ครอบคลุมทั้ง 3 อำเภอ ทั้งเมืองภูเก็ต กะทู้ และถลาง สั่งครบ 1,500 บาท ส่งฟรี!",
  },
  {
    icon: ShieldCheck,
    title: "สินค้าคุณภาพ มั่นใจได้",
    description:
      "สินค้าทุกชิ้นมาจากตัวแทนจำหน่ายโดยตรง มีการตรวจสอบคุณภาพและวันหมดอายุอย่างสม่ำเสมอ จัดเก็บในคลังสินค้าที่ได้มาตรฐาน พร้อมบริการเปลี่ยนคืนสินค้าที่มีปัญหา",
  },
  {
    icon: Users,
    title: "ให้บริการร้านค้ากว่า 500 ร้าน",
    description:
      "ได้รับความไว้วางใจจากร้านค้าปลีก มินิมาร์ท ร้านอาหาร เกสต์เฮาส์ โรงแรม และร้านกาแฟทั่วเกาะภูเก็ต ด้วยบริการที่รวดเร็ว ราคายุติธรรม และสินค้าครบวงจร",
  },
  {
    icon: Clock,
    title: "เปิดมานานกว่า 10 ปี",
    description:
      "ก่อตั้งตั้งแต่ปี 2558 ด้วยประสบการณ์กว่า 10 ปีในธุรกิจขายส่งสินค้าอุปโภคบริโภค เราเข้าใจความต้องการของร้านค้าในภูเก็ตอย่างแท้จริง",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        เกี่ยวกับเรา
      </h1>
      <p className="mt-2 text-center text-gray-500">
        {COMPANY_INFO.name}
      </p>

      {/* Company Story */}
      <section className="mt-12 rounded-2xl bg-primary/5 p-8">
        <h2 className="text-xl font-semibold text-primary">
          เรื่องราวของเรา
        </h2>
        <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>{SITE_NAME}</strong>{" "}
            เริ่มต้นจากร้านขายส่งสินค้าอุปโภคบริโภคเล็กๆ ในจังหวัดภูเก็ตเมื่อปี 2558
            ด้วยเป้าหมายที่จะเป็นคู่ค้าที่เชื่อถือได้ของร้านค้าปลีกในพื้นที่
            เราเริ่มจากสินค้าไม่กี่ร้อยรายการ ส่งของด้วยรถกระบะเพียงคันเดียว
          </p>
          <p>
            จากร้านค้าเล็กๆ ในตลาดรัษฎา วันนี้เรามีคลังสินค้าขนาดกว่า 800 ตารางเมตร
            บนถนนเทพกระษัตรี มีสินค้ามากกว่า 10,000 รายการ จากแบรนด์ชั้นนำ
            ทั้งสินค้าอาหาร เครื่องดื่ม ของใช้ในครัวเรือน และของใช้ส่วนตัว
            รถจัดส่ง 5 คัน พร้อมทีมงานกว่า 20 คนที่ดูแลลูกค้าทั่วเกาะภูเก็ต
          </p>
          <p>
            ปัจจุบันเราได้พัฒนาระบบสั่งซื้อออนไลน์
            เพื่อให้ลูกค้าสามารถเลือกซื้อสินค้าได้สะดวกตลอด 24 ชั่วโมง
            ไม่ว่าจะซื้อเป็นชิ้น กล่อง หรือยกลัง
            ระบบจะคำนวณราคาและส่วนลดให้อัตโนมัติ
            พร้อมจัดส่งถึงหน้าร้านหรือบ้านคุณภายใน 1-2 วันทำการ
          </p>
          <p>
            เราให้ความสำคัญกับทุกออเดอร์เท่าเทียมกัน ไม่ว่าจะสั่งซื้อ 100 บาทหรือ 100,000 บาท
            เพราะเราเชื่อว่าการบริการที่ดีและราคาที่ยุติธรรมคือพื้นฐานของธุรกิจที่ยั่งยืน
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-semibold text-gray-900">
          ทำไมต้องเลือกเรา?
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Coverage */}
      <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8">
        <h2 className="text-xl font-semibold text-gray-900">พื้นที่จัดส่ง</h2>
        <p className="mt-2 text-sm text-gray-600">
          เราให้บริการจัดส่งครอบคลุมทุกพื้นที่ในเกาะภูเก็ต
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {DELIVERY_AREAS.map((area) => (
            <span
              key={area}
              className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 ring-1 ring-gray-200"
            >
              {area}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-primary">
          สั่งครบ 1,500 บาท จัดส่งฟรีทุกพื้นที่ในภูเก็ต!
        </p>
      </section>

      {/* Company Info */}
      <section className="mt-16 rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900">ข้อมูลบริษัท</h2>
        <dl className="mt-4 space-y-3 text-sm text-gray-700">
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">ชื่อบริษัท</dt>
            <dd>{COMPANY_INFO.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">ที่อยู่</dt>
            <dd>{COMPANY_INFO.address}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">โทรศัพท์</dt>
            <dd>{COMPANY_INFO.phone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">มือถือ</dt>
            <dd>{COMPANY_INFO.mobile}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">อีเมล</dt>
            <dd>{COMPANY_INFO.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">LINE</dt>
            <dd>{COMPANY_INFO.line}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">เวลาทำการ</dt>
            <dd>
              {COMPANY_INFO.workingHours}
              <span className="ml-1 text-gray-400">
                ({COMPANY_INFO.workingHoursNote})
              </span>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-500 w-28 shrink-0">เวลาจัดส่ง</dt>
            <dd>{COMPANY_INFO.deliveryHours}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
