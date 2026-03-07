"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Category } from "@/types";

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryDrawer({ open, onClose }: CategoryDrawerProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const handleCategoryClick = (cat: Category) => {
    if (cat.subcategories.length > 0) {
      setExpandedCat(expandedCat === cat.id ? null : cat.id);
    } else {
      onClose();
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setExpandedCat(null);
        }
      }}
    >
      <SheetContent
        side="left"
        className="w-[340px] p-0 sm:max-w-[340px]"
        showCloseButton
      >
        <SheetHeader className="border-b bg-primary px-5 py-4">
          <SheetTitle className="text-base font-semibold text-primary-foreground">
            หมวดหมู่สินค้า
          </SheetTitle>
          <SheetDescription className="sr-only">
            เลือกหมวดหมู่สินค้าที่ต้องการ
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Link
            href="/categories"
            onClick={onClose}
            className="flex items-center gap-3 border-b px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
          >
            ดูสินค้าทั้งหมด
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>

          <ul>
            {categories.map((cat) => (
              <li key={cat.id} className="border-b last:border-b-0">
                <div className="flex items-center">
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="flex flex-1 items-center gap-3 px-5 py-3 transition-colors hover:bg-accent"
                  >
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          —
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                  </Link>

                  {cat.subcategories.length > 0 && (
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className="flex h-full items-center px-4 py-3 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`ขยาย${cat.name}`}
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expandedCat === cat.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {expandedCat === cat.id && cat.subcategories.length > 0 && (
                  <ul className="border-t bg-muted/30 pb-2">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/categories/${cat.slug}?sub=${sub.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 py-2 pl-8 pr-5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          {sub.image ? (
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded border bg-white">
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 flex-shrink-0 rounded border bg-white" />
                          )}
                          <span>{sub.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
