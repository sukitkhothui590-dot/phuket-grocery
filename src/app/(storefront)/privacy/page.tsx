import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_INFO, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัวและคุกกี้",
  description: `นโยบายความเป็นส่วนตัวและการใช้คุกกี้ของ ${SITE_NAME}`,
};

const cookieTypes = [
  {
    title: "คุกกี้ที่จำเป็น",
    description:
      "จำเป็นต่อการทำงานของเว็บไซต์ เช่น การเข้าสู่ระบบ ตะกร้าสินค้า และการจดจำการตั้งค่าความปลอดภัย ไม่สามารถปิดได้",
  },
  {
    title: "คุกกี้เพื่อการวิเคราะห์",
    description:
      "ช่วยให้เราเข้าใจพฤติกรรมการใช้งานเว็บไซต์ เพื่อปรับปรุงเนื้อหา สินค้า และประสบการณ์การใช้งาน",
  },
  {
    title: "คุกกี้เพื่อการตลาด",
    description:
      "ใช้แสดงโปรโมชั่นหรือเนื้อหาที่เกี่ยวข้องกับความสนใจของคุณผ่านช่องทางต่าง ๆ",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        นโยบายความเป็นส่วนตัวและคุกกี้
      </h1>
      <p className="mt-2 text-center text-gray-500">{COMPANY_INFO.shortName}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            การเก็บรวบรวมข้อมูล
          </h2>
          <p className="mt-3">
            {COMPANY_INFO.name} อาจเก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้เมื่อสมัครสมาชิก
            สั่งซื้อสินค้า ติดต่อเรา หรือใช้งานเว็บไซต์ เช่น ชื่อ อีเมล หมายเลขโทรศัพท์
            และที่อยู่จัดส่ง
          </p>
        </section>

        <section id="cookies" className="scroll-mt-28">
          <h2 className="text-xl font-semibold text-gray-900">
            การใช้คุกกี้
          </h2>
          <p className="mt-3">
            คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่ถูกจัดเก็บในอุปกรณ์ของคุณ
            เพื่อช่วยให้เว็บไซต์ทำงานได้อย่างถูกต้องและปรับปรุงประสบการณ์การใช้งาน
            คุณสามารถจัดการความยินยอมได้จากแบนเนอร์คุกกี้เมื่อเข้าใช้งานครั้งแรก
          </p>

          <div className="mt-5 space-y-4">
            {cookieTypes.map((type) => (
              <div
                key={type.title}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <h3 className="font-semibold text-gray-900">{type.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">สิทธิของคุณ</h2>
          <p className="mt-3">
            คุณมีสิทธิในการเข้าถึง แก้ไข ลบ หรือถอนความยินยอมในการใช้ข้อมูลส่วนบุคคล
            โดยติดต่อเราได้ที่{" "}
            <a
              href={`mailto:${COMPANY_INFO.supportEmail}`}
              className="font-medium text-primary hover:underline"
            >
              {COMPANY_INFO.supportEmail}
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">ติดต่อเรา</h2>
          <p className="mt-3">
            หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ{" "}
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
