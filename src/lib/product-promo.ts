import type { Product, ProductUnit } from "@/types";

const unitOrder: Record<ProductUnit["unitType"], number> = {
  piece: 0,
  box: 1,
  case: 2,
};

export function formatUnitDisplayLabel(labelValue: string, conversionRate: number): string {
  const label = labelValue.trim();
  const contents = label.match(/^(.+?)\s*\((.+)\)$/);
  if (contents) return `${contents[1]} × ${contents[2]}`;
  return conversionRate > 1 ? `${label} × ${conversionRate}` : label;
}

export function getUnitDisplayLabel(unit: ProductUnit): string {
  return unit.displayLabel?.trim() || formatUnitDisplayLabel(unit.labelTh, unit.conversionRate);
}

export function getNextPriceTier(unit: ProductUnit, quantity: number) {
  return unit.priceTiers
    ?.filter((tier) => tier.minQuantity > quantity)
    .sort((first, second) => first.minQuantity - second.minQuantity)[0];
}

export function sortProductUnits(units: ProductUnit[]): ProductUnit[] {
  return [...units].sort(
    (first, second) => unitOrder[first.unitType] - unitOrder[second.unitType],
  );
}

export function getBestPromoUnit(product: Product): ProductUnit | null {
  const discounted = product.units.filter(
    (unit) => unit.compareAtPrice && unit.compareAtPrice > unit.price
  );

  if (discounted.length === 0) return null;

  return discounted.reduce((best, unit) => {
    const bestSaving = best.compareAtPrice! - best.price;
    const unitSaving = unit.compareAtPrice! - unit.price;
    return unitSaving > bestSaving ? unit : best;
  });
}

/** Prefer the best discounted unit; fall back to the first catalog unit. */
export function getDisplayUnit(product: Product): ProductUnit | undefined {
  return getBestPromoUnit(product) ?? product.units[0];
}

export function getPromoDetails(unit: ProductUnit) {
  const originalPrice =
    unit.compareAtPrice && unit.compareAtPrice > unit.price
      ? unit.compareAtPrice
      : unit.price;
  const salePrice = unit.price;
  const savedAmount = Math.max(0, originalPrice - salePrice);
  const discountPercent =
    originalPrice > 0 && savedAmount > 0
      ? Math.round((savedAmount / originalPrice) * 100)
      : 0;

  return {
    originalPrice,
    salePrice,
    savedAmount,
    discountPercent,
  };
}

export function hasPromo(product: Product): boolean {
  return getBestPromoUnit(product) !== null;
}
