"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { searchProductSuggestions } from "@/lib/api/products";
import { getDisplayUnit } from "@/lib/product-promo";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductSearchBarProps {
  initialQuery?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  categorySlug?: string;
  onSearch?: (query: string) => void;
  minChars?: number;
}

const SUGGESTION_LIMIT = 8;
const DEBOUNCE_MS = 300;

export function ProductSearchBar({
  initialQuery = "",
  className,
  inputClassName,
  autoFocus,
  onSubmitted,
  categorySlug,
  onSearch,
  minChars = 1,
}: ProductSearchBarProps) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < minChars) {
      setSuggestions([]);
      setTotal(0);
      setLoading(false);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const result = await searchProductSuggestions(query, {
          categorySlug,
          limit: SUGGESTION_LIMIT,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setSuggestions(result.products);
        setTotal(result.total);
        setOpen(true);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setTotal(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, categorySlug, minChars]);

  const navigateToResults = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setOpen(false);
    onSubmitted?.();

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    router.push(`/categories?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigateToResults(searchQuery);
  };

  const showDropdown = open && searchQuery.trim().length >= minChars;

  return (
    <form onSubmit={handleSearch} className={className}>
      <div ref={containerRef} className="relative w-full">
        <input
          type="search"
          placeholder="ค้นหาสินค้า..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onFocus={() => {
            if (searchQuery.trim().length >= minChars) {
              setOpen(true);
            }
          }}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className={cn(
            "w-full rounded-lg border border-input bg-white py-2.5 pl-5 pr-12 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            inputClassName,
          )}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors hover:text-primary"
          aria-label="ค้นหา"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </button>

        {showDropdown && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            {loading && suggestions.length === 0 ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังค้นหา...
              </div>
            ) : suggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                ไม่พบสินค้าที่ตรงกับ &ldquo;{searchQuery.trim()}&rdquo;
              </div>
            ) : (
              <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
                {suggestions.map((product) => {
                  const displayUnit = getDisplayUnit(product);
                  const image =
                    product.images[0] ??
                    getPlaceholderUrl(64, 64, product.name.slice(0, 8));

                  return (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        role="option"
                        onClick={() => {
                          setOpen(false);
                          onSubmitted?.();
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-slate-50"
                      >
                        <img
                          src={image}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-md border border-slate-100 bg-slate-50 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          {displayUnit && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {displayUnit.labelTh} · ฿
                              {displayUnit.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {!loading && suggestions.length > 0 && (
              <button
                type="button"
                onClick={() => navigateToResults(searchQuery)}
                className="w-full border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                ดูผลลัพธ์ทั้งหมด
                {total > suggestions.length
                  ? ` (${total.toLocaleString()} รายการ)`
                  : ""}
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
