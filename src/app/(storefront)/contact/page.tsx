import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Truck, Facebook } from "lucide-react";
import { COMPANY_INFO, DELIVERY_AREAS } from "@/lib/constants";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: `ติดต่อ ${COMPANY_INFO.name} โทร ${COMPANY_INFO.phone} | LINE: ${COMPANY_INFO.line}`,
};

const contactItems = [
  { icon: Phone, label: "โทรศัพท์", value: COMPANY_INFO.phone, href: `tel:${COMPANY_INFO.phone}` },
  { icon: Phone, label: "มือถือ / สั่งซื้อ", value: COMPANY_INFO.mobile, href: `tel:${COMPANY_INFO.mobile}` },
  { icon: Mail, label: "อีเมล", value: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
  { icon: MessageCircle, label: "LINE Official", value: COMPANY_INFO.line, href: `https://line.me/R/ti/p/${COMPANY_INFO.line}` },
  { icon: Facebook, label: "Facebook", value: `fb.com/${COMPANY_INFO.facebook}`, href: `https://facebook.com/${COMPANY_INFO.facebook}` },
  { icon: MapPin, label: "ที่อยู่", value: COMPANY_INFO.address },
  { icon: Clock, label: "เวลาทำการ", value: `${COMPANY_INFO.workingHours} (${COMPANY_INFO.workingHoursNote})` },
  { icon: Truck, label: "เวลาจัดส่ง", value: COMPANY_INFO.deliveryHours },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        ติดต่อเรา
      </h1>
      <p className="mt-2 text-center text-gray-500">
        สอบถามราคาส่ง สั่งซื้อจำนวนมาก หรือมีข้อเสนอแนะ ติดต่อเราได้เลย
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            ช่องทางการติดต่อ
          </h2>
          <div className="mt-6 space-y-5">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-primary hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Coverage */}
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="text-sm font-semibold text-primary">
              พื้นที่จัดส่ง
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              ครอบคลุมทุกพื้นที่ในเกาะภูเก็ต
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DELIVERY_AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-600 ring-1 ring-gray-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <iframe
              title="แผนที่ ภูเก็ต โกรเซอรี่"
              src={COMPANY_INFO.googleMapEmbed}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            ส่งข้อความถึงเรา
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            กรอกรายละเอียดด้านล่าง เราจะติดต่อกลับภายใน 1 วันทำการ
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
