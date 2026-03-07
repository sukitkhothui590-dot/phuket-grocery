import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook } from "lucide-react";
import { COMPANY_INFO, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#01A1AF] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <img
              src="/images/logo.png"
              alt={SITE_NAME}
              className="mb-4 h-[48px] w-auto"
            />
            <p className="text-sm leading-relaxed text-white/80">
              {COMPANY_INFO.name}
            </p>
            <div className="mt-3 flex items-start gap-2 text-sm text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{COMPANY_INFO.address}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 font-semibold">ข้อมูลเพิ่มเติม</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/80 transition-colors hover:text-white">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-white/80 transition-colors hover:text-white">
                  สินค้าทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 transition-colors hover:text-white">
                  ข่าวสาร และบล็อก
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4 font-semibold">ช่วยเหลือ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-white/80 transition-colors hover:text-white">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 transition-colors hover:text-white">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">ติดต่อเรา</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-white/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {COMPANY_INFO.mobile}
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                {COMPANY_INFO.email}
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                LINE: {COMPANY_INFO.line}
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Clock className="h-4 w-4 flex-shrink-0" />
                {COMPANY_INFO.workingHours}
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-white/70 transition-colors hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`https://line.me/R/ti/p/${COMPANY_INFO.line}`}
                className="text-white/70 transition-colors hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <p className="text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name} สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </footer>
  );
}
