"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { COMPANY_INFO, SITE_NAME } from "@/lib/constants";
import { getStoreSettings } from "@/lib/api/settings";
import { CookieSettingsButton } from "./cookie-settings-button";
import { CookieConsentBanner } from "./cookie-consent-banner";
import { CookieSettingsDialog } from "./cookie-settings-dialog";
import { CookieConsentFab } from "./cookie-consent-fab";

export function Footer() {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/success") ||
    pathname.includes("/receipt");
  const [store, setStore] = useState<{
    name: string;
    address: string;
    workingHours: string;
    phone: string;
    email: string;
    lineId: string;
    lineUrl: string;
    facebookUrl: string;
  }>({
    name: COMPANY_INFO.name,
    address: COMPANY_INFO.address,
    workingHours: COMPANY_INFO.workingHours,
    phone: COMPANY_INFO.mobile,
    email: COMPANY_INFO.email,
    lineId: COMPANY_INFO.line,
    lineUrl: COMPANY_INFO.lineUrl,
    facebookUrl: COMPANY_INFO.facebookUrl,
  });

  useEffect(() => {
    void (async () => {
      const settings = await getStoreSettings();
      setStore({
        name: settings.storeName || COMPANY_INFO.name,
        address: settings.storeAddress || COMPANY_INFO.address,
        workingHours: settings.workingHours || COMPANY_INFO.workingHours,
        phone: settings.storePhone || COMPANY_INFO.mobile,
        email: settings.storeEmail || COMPANY_INFO.email,
        lineId: settings.lineId || COMPANY_INFO.line,
        lineUrl: settings.lineUrl || COMPANY_INFO.lineUrl,
        facebookUrl: settings.facebookUrl || COMPANY_INFO.facebookUrl,
      });
    })();
  }, []);

  return (
    <>
      {!hideFooter && (
        <footer className="bg-primary text-primary-foreground print:hidden">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-4 h-[56px] w-[56px] overflow-hidden rounded-xl">
                  <img
                    src="/images/logo.png"
                    alt={SITE_NAME}
                    className="h-full w-full scale-[1.22] object-cover"
                  />
                </div>
                <p className="text-sm leading-7 text-white/85">{store.name}</p>
                <div className="mt-3 flex items-start gap-2 text-sm text-white/75">
                  <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">ข้อมูลเพิ่มเติม</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/fees"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      ค่าใช้จ่ายในระบบ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coupons"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      คูปองส่วนลด
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      เกี่ยวกับเรา
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      สินค้าทั้งหมด
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      ข่าวสารและบทความ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      ติดต่อเรา
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-white/80 transition-colors hover:text-white"
                    >
                      นโยบายความเป็นส่วนตัว
                    </Link>
                  </li>
                  <li>
                    <CookieSettingsButton />
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">เวลาบริการ</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{store.workingHours}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>ฝ่ายขายส่ง: {store.phone}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{store.email}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">เชื่อมต่อกับเรา</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{store.lineId}</span>
                  </li>
                </ul>
                <div className="mt-4 flex gap-3">
                  <a
                    href={store.facebookUrl}
                    className="rounded-full bg-white/12 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={store.lineUrl}
                    className="rounded-full bg-white/12 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs text-white/75">
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-white"
                >
                  ประกาศความเป็นส่วนตัว สำหรับลูกค้า
                </Link>
                <span className="text-white/30">|</span>
                <Link
                  href="/privacy#cookies"
                  className="transition-colors hover:text-white"
                >
                  นโยบายการใช้คุกกี้
                </Link>
                <span className="text-white/30">|</span>
                <CookieSettingsButton />
                <span className="text-white/30">|</span>
                <Link href="/terms" className="transition-colors hover:text-white">
                  ข้อกำหนดและเงื่อนไข
                </Link>
                <span className="text-white/30">|</span>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-white"
                >
                  นโยบายการคุ้มครองข้อมูลส่วนบุคคล
                </Link>
              </nav>
              <p className="mt-3 text-center text-xs text-white/65">
                &copy; {new Date().getFullYear()} {store.name} สงวนลิขสิทธิ์
              </p>
            </div>
          </div>
        </footer>
      )}
      <CookieConsentBanner />
      <CookieSettingsDialog />
      <CookieConsentFab />
    </>
  );
}
