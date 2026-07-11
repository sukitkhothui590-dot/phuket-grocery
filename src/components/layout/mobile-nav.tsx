"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PROMOTION_NAV_ITEMS, SELL_WITH_US_HREF } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { useState } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}

type ExpandedSection = "products" | "promotions" | null;

export function MobileNav({ open, onClose, categories }: MobileNavProps) {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection((current) => (current === section ? null : section));
    if (section !== "products") {
      setExpandedCat(null);
    }
  };

  const mainLinks = [
    { href: "/", label: "หน้าแรก", active: pathname === "/" },
    {
      href: SELL_WITH_US_HREF,
      label: "ขายสินค้ากับเรา",
      active: pathname === SELL_WITH_US_HREF,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-80 p-0" showCloseButton={false}>
        <SheetHeader className="border-b bg-primary px-4 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold text-white">
              เมนู
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto">
          <div className="border-b py-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "block px-4 py-3 text-sm font-semibold transition-colors",
                  link.active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-b">
            <button
              type="button"
              onClick={() => toggleSection("products")}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-foreground"
            >
              สินค้า
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  expandedSection === "products" && "rotate-90"
                )}
              />
            </button>

            {expandedSection === "products" && (
              <div className="border-t bg-slate-50 pb-2">
                <Link
                  href="/categories"
                  onClick={onClose}
                  className="block border-b border-slate-200 px-4 py-2.5 text-sm font-medium text-primary"
                >
                  ดูสินค้าทั้งหมด
                </Link>

                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-slate-200 last:border-0">
                    <div className="flex items-center">
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCat(expandedCat === cat.id ? null : cat.id)
                          }
                          className="px-4 py-2.5"
                        >
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              expandedCat === cat.id && "rotate-90"
                            )}
                          />
                        </button>
                      )}
                    </div>
                    {expandedCat === cat.id && (
                      <div className="bg-white pb-2">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${cat.slug}?sub=${sub.slug}`}
                            onClick={onClose}
                            className="block px-8 py-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-b">
            <button
              type="button"
              onClick={() => toggleSection("promotions")}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-foreground"
            >
              โปรโมชั่น
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  expandedSection === "promotions" && "rotate-90"
                )}
              />
            </button>

            {expandedSection === "promotions" && (
              <div className="border-t bg-slate-50 py-1">
                {PROMOTION_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="block px-4 py-2.5 transition-colors hover:bg-white"
                  >
                    <span className="block text-sm font-medium text-foreground">
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
          </div>

          <div className="border-t py-2">
            <Link
              href="/blog"
              onClick={onClose}
              className="block px-4 py-3 text-sm font-medium text-foreground"
            >
              ข่าวสาร
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="block px-4 py-3 text-sm font-medium text-foreground"
            >
              เกี่ยวกับเรา
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block px-4 py-3 text-sm font-medium text-foreground"
            >
              ติดต่อเรา
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="block px-4 py-3 text-sm font-medium text-foreground"
            >
              คำถามที่พบบ่อย
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
