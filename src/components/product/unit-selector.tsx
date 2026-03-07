"use client";

import { cn } from "@/lib/utils";
import type { ProductUnit } from "@/types";

interface UnitSelectorProps {
  units: ProductUnit[];
  selectedSku: string;
  onChange: (unit: ProductUnit) => void;
}

export function UnitSelector({ units, selectedSku, onChange }: UnitSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {units.map((unit) => {
        const isSelected = unit.sku === selectedSku;
        return (
          <button
            key={unit.sku}
            type="button"
            onClick={() => onChange(unit)}
            className={cn(
              "flex flex-col items-center rounded-lg border px-4 py-2.5 text-sm transition-all",
              isSelected
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:bg-primary/[0.02]"
            )}
          >
            <span className="font-medium">{unit.labelTh}</span>
            <span className="mt-0.5 text-xs font-semibold">
              ฿{unit.price.toLocaleString()}
            </span>
            {unit.compareAtPrice && unit.compareAtPrice > unit.price && (
              <span className="mt-0.5 text-[11px] text-muted-foreground line-through">
                ฿{unit.compareAtPrice.toLocaleString()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
