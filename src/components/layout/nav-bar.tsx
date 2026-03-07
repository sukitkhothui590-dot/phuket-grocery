"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { useState } from "react";

const quickCategories = categories.slice(0, 6);

export function NavBar() {
  const [hoverCatId, setHoverCatId] = useState<string | null>(null);

  return (
    <nav className="hidden border-b-[3px] border-b-primary bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center px-4">
        <ul className="flex items-center">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              หน้าแรก
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              สินค้า
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>
          </li>

          {quickCategories.map((cat) => (
            <li
              key={cat.id}
              className="relative"
              onMouseEnter={() => setHoverCatId(cat.id)}
              onMouseLeave={() => setHoverCatId(null)}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="inline-flex items-center gap-1 px-3 py-2.5 text-sm text-foreground transition-colors hover:text-primary"
              >
                {cat.name}
                {cat.subcategories.length > 0 && (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                )}
              </Link>

              {cat.subcategories.length > 0 && hoverCatId === cat.id && (
                <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-b-md border border-t-0 bg-white py-1 shadow-lg">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/categories/${cat.slug}?sub=${sub.slug}`}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                      {sub.image && (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                      )}
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center">
          <Link
            href="/blog"
            className="inline-block px-4 py-2.5 text-sm text-foreground transition-colors hover:text-primary"
          >
            ข่าวสาร
          </Link>
          <Link
            href="/about"
            className="inline-block px-4 py-2.5 text-sm text-foreground transition-colors hover:text-primary"
          >
            เกี่ยวกับเรา
          </Link>
          <Link
            href="/contact"
            className="inline-block px-4 py-2.5 text-sm text-foreground transition-colors hover:text-primary"
          >
            ติดต่อ
          </Link>
        </div>
      </div>
    </nav>
  );
}
