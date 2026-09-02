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

/** Prefer the best discounted unit; fall back to the first catalog unit. */
export function getDisplayUnit(product: Product): ProductUnit | undefined {
  const promo = getBestPromoUnit(product);
  if (promo && promo.stock > 0) return promo;
  // A sold-out promo unit (e.g. the last ลัง) must not make a product with
  // plenty of base units on the shelf render as out of stock.
  return product.units.find((unit) => unit.stock > 0) ?? promo ?? product.units[0];
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

/**
 * Out of stock = every sellable unit is at zero. The base unit always holds the
 * largest count (unit stock = floor(available / conversionRate)), so this is
 * equivalent to "base unit empty" but survives odd unit ordering from the API.
 */
export function isOutOfStock(product: Product): boolean {
  return product.units.every((unit) => unit.stock <= 0);
}
