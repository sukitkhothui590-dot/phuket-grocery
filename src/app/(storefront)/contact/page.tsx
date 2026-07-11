import type { Metadata } from "next";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { getStoreSettings } from "@/lib/api/settings";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: `ติดต่อ ${COMPANY_INFO.shortName} ผ่านโทรศัพท์ อีเมล และโซเชียลมีเดีย`,
};

export default async function ContactPage() {
  const settings = await getStoreSettings();

  const contactItems = [
    {
      icon: Phone,
      label: "โทรศัพท์",
      value: settings.storePhone,
    },
    {
      icon: Mail,
      label: "อีเมล",
      value: settings.storeEmail,
    },
    {
      icon: MapPin,
      label: "ที่อยู่",
      value: settings.storeAddress,
    },
    {
      icon: Instagram,
      label: "LINE",
      value: settings.lineId,
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: settings.facebookUrl, label: "Facebook" },
    { icon: Instagram, href: COMPANY_INFO.instagramUrl, label: "Instagram" },
    { icon: MessageCircle, href: settings.lineUrl, label: "LINE" },
    { icon: Youtube, href: COMPANY_INFO.tiktokUrl, label: "TikTok" },
  ];

  const mapEmbedSrc =
    COMPANY_INFO.googleMapEmbed ||
    `https://www.google.com/maps?q=${encodeURIComponent(
      settings.storeAddress || COMPANY_INFO.address,
    )}&output=embed`;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="px-4 pt-12 pb-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          ติดต่อเรา
        </h1>
        <p className="mt-2 text-gray-500">
          สอบถามสินค้า โปรโมชั่น และการสั่งซื้อสำหรับครัวเรือนหรือองค์กรได้ที่นี่
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Left: Get in touch */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ช่องทางการติดต่อ
            </h2>
            <p className="mt-3 max-w-md text-sm text-gray-500">
              ภูเก็ตโกรเซอรี่ พร้อมให้บริการและตอบทุกคำถามของคุณ
              เลือกช่องทางที่สะดวกได้เลย
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-sm font-semibold text-gray-900">โซเชียลมีเดีย</p>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form panel */}
          <div className="rounded-2xl bg-secondary/60 p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>

        {/* Map */}
        <div className="relative mt-12 overflow-hidden rounded-2xl border border-gray-200">
          <iframe
            title="แผนที่ภูเก็ตโกรเซอรี่"
            src={mapEmbedSrc}
            className="h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={COMPANY_INFO.googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary/90"
          >
            <MapPin className="h-4 w-4" />
            เปิดใน Google Maps เพื่อนำทาง
          </a>
        </div>
      </div>
    </div>
  );
}
