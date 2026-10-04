import type { Product, ProductUnit } from "@/types";

export interface ProductListing {
  product: Product;
  listingUnit: ProductUnit;
  listingKey: string;
}

export function expandProductListings(products: Product[]): ProductListing[] {
  return products.flatMap((product) => {
    const units = product.listingUnit ? [product.listingUnit] : product.units;
    return units.map((listingUnit) => ({
      product,
      listingUnit,
      listingKey:
        product.listingKey ?? `${product.id}:${listingUnit.id ?? listingUnit.sku}`,
    }));
  });
}
