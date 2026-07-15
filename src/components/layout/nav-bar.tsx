"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PROMOTION_NAV_ITEMS, SELL_WITH_US_HREF } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { useState } from "react";

type OpenMenu = "products" | "promotions" | null;

function NavTrigger({
  label,
  isOpen,
  isActive,
}: {
  label: string;
  isOpen: boolean;
  isActive?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium transition-colors",
        isOpen || isActive
          ? "text-primary"
          : "text-foreground hover:text-primary"
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform",
          isOpen && "rotate-180 text-primary"
        )}
      />
    </span>
  );
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-4 py-2.5 text-sm font-medium transition-colors",
        isActive ? "text-primary" : "text-foreground hover:text-primary"
      )}
    >
      {label}
    </Link>
  );
}

export function NavBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const isProductsActive =
    pathname.startsWith("/categories") || pathname.startsWith("/products");
  const isPromotionsActive = pathname.startsWith("/campaigns");
  const isSellActive = pathname === SELL_WITH_US_HREF;

  return (
    <nav className="hidden border-b-[3px] border-b-primary bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center px-4">
        <ul className="flex items-center">
          <li>
            <NavLink href="/" label="หน้าแรก" isActive={pathname === "/"} />
          </li>

          <li
            className="relative"
            onMouseEnter={() => setOpenMenu("products")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link href="/categories">
              <NavTrigger
                label="สินค้า"
                isOpen={openMenu === "products"}
                isActive={isProductsActive}
              />
            </Link>

            {openMenu === "products" && (
              <div className="absolute left-0 top-full z-50 w-[760px] overflow-hidden rounded-b-lg border border-t-0 border-slate-200 bg-white shadow-xl">
                <Link
                  href="/categories"
                  className="block border-b border-slate-100 bg-secondary/60 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                >
                  ดูสินค้าทั้งหมด
                </Link>

                <div className="grid max-h-[420px] grid-cols-3 gap-x-2 gap-y-1 overflow-y-auto p-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="rounded-md px-2 py-2 transition-colors hover:bg-accent/60">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <ul className="mt-1.5 space-y-1">
                          {cat.subcategories.slice(0, 4).map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/categories/${cat.slug}?sub=${sub.slug}`}
                                className="block text-xs text-muted-foreground transition-colors hover:text-primary"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>

          <li
            className="relative"
            onMouseEnter={() => setOpenMenu("promotions")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link href="/#promotions">
              <NavTrigger
                label="โปรโมชั่น"
                isOpen={openMenu === "promotions"}
                isActive={isPromotionsActive}
              />
            </Link>

            {openMenu === "promotions" && (
              <div className="absolute left-0 top-full z-50 min-w-[280px] overflow-hidden rounded-b-lg border border-t-0 border-slate-200 bg-white py-1 shadow-xl">
                {PROMOTION_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2.5 transition-colors hover:bg-accent"
                  >
                    <span className="block text-sm font-medium text-foreground hover:text-primary">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </li>

          <li>
            <NavLink
              href={SELL_WITH_US_HREF}
              label="ขายสินค้ากับเรา"
              isActive={isSellActive}
            />
          </li>
        </ul>

        <div className="ml-auto flex items-center">
          <NavLink
            href="/blog"
            label="ข่าวสาร"
            isActive={pathname.startsWith("/blog")}
          />
          <NavLink
            href="/about"
            label="เกี่ยวกับเรา"
            isActive={pathname === "/about"}
          />
          <NavLink
            href="/contact"
            label="ติดต่อ"
            isActive={pathname === "/contact"}
          />
        </div>
      </div>
    </nav>
  );
}
