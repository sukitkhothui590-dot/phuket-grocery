"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LayoutGrid,
  Phone,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { signOut } from "@/lib/auth-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { COMPANY_INFO } from "@/lib/constants";
import { getStoreSettings } from "@/lib/api/settings";
import { MainHeaderSearch } from "@/components/layout/main-header-search";

interface MainHeaderProps {
  onMenuOpen: () => void;
  onCategoryDrawerOpen: () => void;
}

export function MainHeader({
  onMenuOpen,
  onCategoryDrawerOpen,
}: MainHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [storePhone, setStorePhone] = useState<string>(COMPANY_INFO.mobile);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    void (async () => {
      const settings = await getStoreSettings();
      setStorePhone(settings.storePhone || COMPANY_INFO.mobile);
    })();
  }, []);

  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="bg-primary">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-4">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={onMenuOpen}
          aria-label="เปิดเมนู"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex flex-shrink-0 items-center">
          <div className="h-[40px] w-[40px] overflow-hidden rounded-md sm:h-[48px] sm:w-[48px]">
            <img
              src="/images/logo.png"
              alt="ภูเก็ต โกรเซอรี่"
              className="h-full w-full scale-[1.22] object-cover"
            />
          </div>
        </Link>

        <button
          onClick={onCategoryDrawerOpen}
          className="hidden items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 lg:flex"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Shop by Category</span>
        </button>

        <Suspense fallback={null}>
          <MainHeaderSearch className="hidden max-w-2xl flex-1 lg:flex" />
        </Suspense>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileSearchOpen((open) => !open)}
            aria-label={mobileSearchOpen ? "ปิดช่องค้นหา" : "ค้นหาสินค้า"}
            aria-expanded={mobileSearchOpen}
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>

          <Link
            href="/contact"
            className="hidden items-center gap-2 text-sm text-white transition-colors hover:text-white/80 xl:flex"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Phone className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] text-white/70">โทรสั่งสินค้า</span>
              <span className="block text-xs font-semibold">{storePhone}</span>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25">
              <User className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {mounted && isAuthenticated ? (
                <>
                  <DropdownMenuItem className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/account")}>
                    บัญชีของฉัน
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/coupons")}>
                    คูปองส่วนลด
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/account/orders")}>
                    ประวัติการสั่งซื้อ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      router.push("/");
                    }}
                  >
                    ออกจากระบบ
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => router.push("/login")}>
                    เข้าสู่ระบบ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/register")}>
                    สมัครสมาชิก
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => router.push("/cart")}
            className="relative flex items-center gap-2 rounded-md px-2 py-1.5 text-white transition-colors hover:bg-white/10"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-0 text-[9px] text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </div>
            <div className="hidden text-left leading-tight lg:block">
              <span className="block text-[11px] text-white/70">ตะกร้าสินค้า</span>
              <span className="block text-xs font-semibold text-white">
                {mounted ? `฿${subtotal.toLocaleString()}` : "฿0"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-white/10 px-4 pb-3 lg:hidden">
          <Suspense fallback={null}>
            <MainHeaderSearch
              autoFocus
              onSubmitted={() => setMobileSearchOpen(false)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
