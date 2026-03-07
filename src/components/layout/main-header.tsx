"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LayoutGrid,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { COMPANY_INFO } from "@/lib/constants";

interface MainHeaderProps {
  onMenuOpen: () => void;
  onCategoryDrawerOpen: () => void;
}

export function MainHeader({ onMenuOpen, onCategoryDrawerOpen }: MainHeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/categories?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <div className="bg-[#01A1AF]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-4">
        {/* Mobile menu */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={onMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <img
            src="/images/logo.png"
            alt="ภูเก็ต โกรเซอรี่"
            className="h-[40px] w-auto sm:h-[48px]"
          />
        </Link>

        {/* Shop by Category button (desktop) */}
        <button
          onClick={onCategoryDrawerOpen}
          className="hidden items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 lg:flex"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Shop by Category</span>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden flex-1 lg:flex">
          <div className="relative w-full max-w-2xl">
            <input
              type="search"
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-white py-2.5 pl-5 pr-12 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          {/* Mobile search */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => router.push("/categories?search=")}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Help / Phone (desktop) */}
          <Link
            href="/contact"
            className="hidden items-center gap-2 text-sm text-white transition-colors hover:text-white/80 xl:flex"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Phone className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] text-white/70">
                โทรสั่งสินค้า
              </span>
              <span className="block text-xs font-semibold">
                {COMPANY_INFO.mobile}
              </span>
            </div>
          </Link>

          {/* User menu */}
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
                  <DropdownMenuItem
                    onClick={() => router.push("/account/orders")}
                  >
                    ประวัติการสั่งซื้อ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
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

          {/* Cart with amount */}
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
              <span className="block text-[11px] text-white/70">
                ตะกร้าสินค้า
              </span>
              <span className="block text-xs font-semibold text-white">
                {mounted ? `฿${subtotal.toLocaleString()}` : "฿0"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
