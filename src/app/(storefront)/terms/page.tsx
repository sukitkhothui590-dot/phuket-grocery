import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_INFO, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ข้อกำหนดและเงื่อนไข",
  description: `ข้อกำหนดและเงื่อนไขการใช้บริการของ ${SITE_NAME}`,
};

const sections = [
  {
    title: "1. การยอมรับข้อกำหนด",
    body: "การเข้าใช้งานเว็บไซต์และบริการของเรา ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้ในหน้านี้ หากไม่ยอมรับ กรุณางดใช้บริการ",
  },
  {
    title: "2. การสั่งซื้อและการชำระเงิน",
    body: "ราคาสินค้าทั้งหมดเป็นเงินบาทไทยและอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า คำสั่งซื้อจะสมบูรณ์เมื่อได้รับการยืนยันการชำระเงินเรียบร้อยแล้ว",
  },
  {
    title: "3. การจัดส่งสินค้า",
    body: "เราจัดส่งสินค้าภายในพื้นที่ที่ให้บริการตามรอบและเงื่อนไขที่กำหนด ระยะเวลาจัดส่งอาจแตกต่างกันตามพื้นที่และปริมาณการสั่งซื้อ",
  },
  {
    title: "4. การคืนสินค้าและการคืนเงิน",
    body: "กรณีสินค้าชำรุด เสียหาย หรือไม่ตรงตามคำสั่งซื้อ กรุณาติดต่อทีมงานภายใน 24 ชั่วโมงหลังได้รับสินค้า เพื่อดำเนินการเปลี่ยนหรือคืนสินค้าตามนโยบาย",
  },
  {
    title: "5. ข้อจำกัดความรับผิด",
    body: "เราพยายามรักษาความถูกต้องของข้อมูลสินค้าและราคา แต่ไม่รับผิดชอบต่อความผิดพลาดทางเทคนิคหรือข้อมูลที่อาจคลาดเคลื่อนโดยไม่เจตนา",
  },
  {
    title: "6. ทรัพย์สินทางปัญญา",
    body: "เนื้อหา รูปภาพ และเครื่องหมายการค้าทั้งหมดบนเว็บไซต์เป็นทรัพย์สินของบริษัท ห้ามนำไปใช้โดยไม่ได้รับอนุญาต",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        ข้อกำหนดและเงื่อนไข
      </h1>
      <p className="mt-2 text-center text-gray-500">{COMPANY_INFO.shortName}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-gray-700">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-gray-900">
              {section.title}
            </h2>
            <p className="mt-3">{section.body}</p>
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold text-gray-900">ติดต่อเรา</h2>
          <p className="mt-3">
            หากมีคำถามเกี่ยวกับข้อกำหนดและเงื่อนไข กรุณาติดต่อ{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              หน้าติดต่อเรา
            </Link>{" "}
            หรืออีเมล {COMPANY_INFO.email}
          </p>
        </section>
      </div>
    </div>
  );
}
