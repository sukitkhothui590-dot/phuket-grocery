import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function StaffOrdersHeader({ back = false }: { back?: boolean }) {
  return (
    <header className="border-b border-[#159e9c] bg-[#19b3b1] text-white">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-3 px-4 py-2 sm:px-7">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href="/staff/orders" className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center">
              <Image
                src="/images/logo.png"
                alt="Phuket Grocery"
                width={44}
                height={44}
                className="size-full object-contain"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-wide sm:text-base">ภูเก็ตโกรเซอรี่</span>
                <span className="block truncate text-xs text-white">จัดเตรียมสินค้า</span>
            </span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-white">สำหรับพนักงาน</span>
          {back ? (
            <Link href="/staff/orders" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/40 px-3 text-xs font-medium transition-colors hover:bg-white/10">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">กลับคิว</span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
