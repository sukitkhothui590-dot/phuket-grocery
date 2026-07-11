"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COMPANY_INFO } from "@/lib/constants";
import { getStoreSettings } from "@/lib/api/settings";
import { useAuthStore } from "@/stores/auth-store";
import { signOut } from "@/lib/auth-actions";
import { User, LogOut } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [storeName, setStoreName] = useState<string>(COMPANY_INFO.shortName);
  const [workingHours, setWorkingHours] = useState<string>(
    COMPANY_INFO.workingHours,
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    void (async () => {
      const settings = await getStoreSettings();
      setStoreName(settings.storeName || COMPANY_INFO.shortName);
      setWorkingHours(settings.workingHours || COMPANY_INFO.workingHours);
    })();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="bg-slate-900 text-slate-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
        <span className="hidden sm:inline">
          ยินดีต้อนรับสู่ {storeName} | {workingHours}
        </span>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
          <Link
            href="/categories"
            className="hidden transition-colors hover:text-white sm:inline"
          >
            สินค้าทั้งหมด
          </Link>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <Link
            href="/faq"
            className="hidden transition-colors hover:text-white sm:inline"
          >
            FAQ
          </Link>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <Link
            href="/contact"
            className="transition-colors hover:text-white"
          >
            ติดต่อเรา
          </Link>
          <span className="text-slate-600">|</span>

          {mounted && isAuthenticated && user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-1 transition-colors hover:text-white"
              >
                <User className="h-3 w-3" />
                <span className="hidden sm:inline">สวัสดี, {user.firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 transition-colors hover:text-white"
                title="ออกจากระบบ"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded bg-primary px-2 py-0.5 font-semibold text-white transition-colors hover:bg-primary/70 sm:px-3"
              >
                เข้าสู่ระบบ
              </Link>
              <span className="hidden text-slate-500 sm:inline">หรือ</span>
              <Link
                href="/register"
                className="rounded border border-primary/60 px-2 py-0.5 font-semibold text-primary/70 transition-colors hover:bg-primary/70 hover:text-white sm:px-3"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
