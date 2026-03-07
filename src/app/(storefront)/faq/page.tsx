import type { Metadata } from "next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { getFAQs } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "คำถามที่พบบ่อย",
  description: "คำถามที่พบบ่อยเกี่ยวกับการสั่งซื้อ จัดส่ง และบริการของภูเก็ต โกรเซอรี่",
};

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        คำถามที่พบบ่อย
      </h1>
      <p className="mt-2 text-center text-gray-500">
        รวมคำตอบสำหรับคำถามยอดนิยม
      </p>

      <div className="mt-10">
        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 rounded-xl bg-primary/5 p-6 text-center">
        <p className="text-sm text-gray-700">
          ยังไม่พบคำตอบที่ต้องการ?{" "}
          <a href="/contact" className="font-medium text-primary hover:underline">
            ติดต่อเรา
          </a>{" "}
          เราพร้อมช่วยเหลือคุณ
        </p>
      </div>
    </div>
  );
}
