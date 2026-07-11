import type { Metadata } from "next";
import { BadgeDollarSign, Handshake, ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: `${COMPANY_INFO.shortName} - ${COMPANY_INFO.heroTagline}`,
};

const strengths = [
  {
    icon: BadgeDollarSign,
    title: "คุ้มค่ากว่าด้วยราคาส่ง",
    description:
      "ช่วยให้ผู้ประกอบการลดต้นทุน เพิ่มกำไร และช่วยให้ครอบครัวประหยัดค่าใช้จ่ายได้มากกว่า",
  },
  {
    icon: ShieldCheck,
    title: "คัดสรรคุณภาพ",
    description:
      "สินค้าสดใหม่และสินค้าแบรนด์ชั้นนำที่มีให้เลือกสรรครบครัน เหมาะทั้งสำหรับครัวเรือนและธุรกิจ",
  },
  {
    icon: Handshake,
    title: "บริการด้วยใจเชิงรุก",
    description:
      "มุ่งมั่นพัฒนาการบริการและระบบการสั่งซื้อให้สะดวก รวดเร็ว และเข้าถึงง่ายในทุกช่องทาง",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        เกี่ยวกับเรา
      </h1>
      <p className="mt-2 text-center text-gray-500">{COMPANY_INFO.shortName}</p>

      <section className="mt-10 rounded-xl bg-primary/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-primary">
          แหล่งรวมสินค้าครบวงจร ตอบโจทย์ทุกความต้องการของครัวเรือนและผู้ประกอบการ
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-gray-700">
          <p>
            {COMPANY_INFO.shortName} คือคลังสินค้าและซูเปอร์มาร์เก็ตท้องถิ่นรายใหญ่ในจังหวัดภูเก็ต
            เราเป็นศูนย์รวมสินค้าอุปโภค-บริโภคทั้งค้าปลีกและค้าส่งที่ครบวงจร
            รองรับทั้งการซื้อของเข้าบ้านของครอบครัว และการจัดหาวัตถุดิบยกลังสำหรับผู้ประกอบการ
            ร้านอาหาร โรงแรม และร้านค้าปลีกรายย่อยในพื้นที่
          </p>
          <p>
            ตลอดระยะเวลากว่า {COMPANY_INFO.yearsInBusinessLabel} ปีที่เราให้บริการ
            เราไม่เคยหยุดพัฒนา เพราะเชื่อว่าความคุ้มค่า คุณภาพสินค้า
            และการบริการที่จริงใจคือหัวใจสำคัญของธุรกิจค้าปลีกท้องถิ่น
          </p>
          <p>
            เรามุ่งมั่นที่จะเป็นมากกว่าแค่ซูเปอร์มาร์เก็ต แต่เป็นเพื่อนคู่คิดที่ช่วยให้การจัดหาสินค้าทั้งสำหรับบ้านและธุรกิจเป็นเรื่องง่าย คุ้มค่า และเชื่อถือได้เสมอ
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-center text-2xl font-semibold text-gray-900">
          จุดเด่นที่เราภาคภูมิใจ
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
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

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">วิสัยทัศน์</h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            {COMPANY_INFO.vision}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">พันธกิจ</h2>
          <ul className="mt-3 space-y-3 text-gray-700">
            {COMPANY_INFO.missions.map((mission) => (
              <li key={mission} className="flex gap-3 leading-relaxed">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span>{mission}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
