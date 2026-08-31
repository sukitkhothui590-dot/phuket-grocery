"use client";

import { useSearchParams } from "next/navigation";
import { ProductSearchBar } from "@/components/product/product-search-bar";

interface MainHeaderSearchProps {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

export function MainHeaderSearch({
  className,
  inputClassName,
  autoFocus,
  onSubmitted,
}: MainHeaderSearchProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") ?? "";

  return (
    <ProductSearchBar
      initialQuery={initialQuery}
      className={className}
      inputClassName={
        inputClassName ??
        "border-0 bg-white py-2.5 pl-5 pr-12 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-0"
      }
      autoFocus={autoFocus}
      onSubmitted={onSubmitted}
    />
  );
}
