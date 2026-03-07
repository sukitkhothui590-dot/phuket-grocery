"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categories } from "@/lib/mock-data";
import { useState } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-80 p-0" showCloseButton={false}>
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold text-primary">
              ภูเก็ต โกรเซอรี่
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto">
          <div className="border-b p-4">
            <Link
              href="/categories"
              onClick={onClose}
              className="block py-2 font-medium text-foreground"
            >
              สินค้าทั้งหมด
            </Link>
          </div>

          <div className="py-2">
            {categories.map((cat) => (
              <div key={cat.id} className="border-b last:border-0">
                <div className="flex items-center">
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {cat.name}
                  </Link>
                  {cat.subcategories.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedCat(
                          expandedCat === cat.id ? null : cat.id
                        )
                      }
                      className="px-4 py-3"
                    >
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedCat === cat.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                {expandedCat === cat.id && (
                  <div className="bg-muted/50 pb-2">
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
