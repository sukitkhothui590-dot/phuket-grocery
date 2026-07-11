import type { Product, ProductUnit } from "@/types";

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

export function getPromoDetails(unit: ProductUnit) {
  const originalPrice = unit.compareAtPrice ?? unit.price;
  const salePrice = unit.price;
  const savedAmount = originalPrice - salePrice;
  const discountPercent = Math.round((savedAmount / originalPrice) * 100);

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
