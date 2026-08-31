import type { Metadata } from "next";
import {
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { StoreBranchList } from "@/components/contact/store-branch-list";
import { COMPANY_INFO } from "@/lib/constants";
import { getStoreSettings } from "@/lib/api/settings";

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
      href: `tel:${settings.storePhone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: Mail,
      label: "อีเมล",
      value: settings.storeEmail,
      href: `mailto:${settings.storeEmail}`,
    },
    {
      icon: MapPin,
      label: "ที่อยู่",
      value: settings.storeAddress,
      href: COMPANY_INFO.googleMapUrl,
    },
    {
      icon: MessageCircle,
      label: "LINE",
      value: settings.lineId || COMPANY_INFO.line,
      href:
        settings.lineUrl && !settings.lineUrl.includes("[")
          ? settings.lineUrl
          : COMPANY_INFO.lineUrl,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: settings.facebookUrl || COMPANY_INFO.facebookUrl,
      label: "Facebook",
    },
    {
      icon: MessageCircle,
      href:
        settings.lineUrl && !settings.lineUrl.includes("[")
          ? settings.lineUrl
          : COMPANY_INFO.lineUrl,
      label: "LINE",
    },
  ].filter((social) => !!social.href && !social.href.includes("["));

  return (
    <div className="bg-white">
      <section className="px-4 pt-12 pb-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          ติดต่อเรา
        </h1>
        <p className="mt-2 text-gray-500">
          สอบถามสินค้า โปรโมชั่น และการสั่งซื้อสำหรับครัวเรือนหรือองค์กรได้ที่นี่
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-6 sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ช่องทางการติดต่อ
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              ภูเก็ตโกรเซอรี่ พร้อมให้บริการและตอบทุกคำถามของคุณ
              เลือกช่องทางที่สะดวกได้เลย
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "ที่อยู่" || item.label === "LINE" ? "_blank" : undefined}
                rel={
                  item.label === "ที่อยู่" || item.label === "LINE"
                    ? "noopener noreferrer"
                    : undefined
                }
                className="flex items-start gap-3 rounded-xl border border-white bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-base font-semibold text-gray-900">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center border-t border-gray-200/80 pt-6">
            <p className="text-sm font-semibold text-gray-900">โซเชียลมีเดีย</p>
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <StoreBranchList phone={settings.storePhone || COMPANY_INFO.phone} />
      </div>
    </div>
  );
}
