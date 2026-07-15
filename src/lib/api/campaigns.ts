import { apiGet } from "@/lib/api/client";
import { mapProduct, type BackendProduct } from "@/lib/api/mappers";
import { getPlaceholderUrl } from "@/lib/placeholder";
import type {
  CampaignDetail,
  CampaignDiscountMode,
  CampaignSummary,
  Product,
  ProductUnit,
  UnitType,
} from "@/types";

interface BackendCampaignSummary {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  badge?: string | null;
  discountMode: CampaignDiscountMode;
  value?: number | null;
  startsAt: string;
  endsAt: string;
  sortOrder?: number;
  productCount?: number;
  categoryCount?: number;
}

interface BackendCampaignProductUnit {
  id: string;
  unitName: string;
  sku: string;
  level: number;
  isBaseUnit: boolean;
  price: number;
  listPrice?: number | null;
  basePrice?: number | null;
  compareAtPrice?: number | null;
  salePriceOverride?: number | null;
}

interface BackendCampaignProduct {
  id: string;
  name: string;
  sku: string;
  imageUrl?: string | null;
  images?: string[];
  isActive?: boolean;
  units: BackendCampaignProductUnit[];
}

interface BackendCampaignDetail extends BackendCampaignSummary {
  isActive: boolean;
  categoryIds?: string[];
  categories?: Array<{ id: string; name: string }>;
  products?: BackendCampaignProduct[];
}

function mapSummary(campaign: BackendCampaignSummary): CampaignSummary {
  return {
    id: campaign.id,
    slug: campaign.slug,
    title: campaign.title,
    description: campaign.description ?? "",
    badge: campaign.badge ?? undefined,
    discountMode: campaign.discountMode,
    value: campaign.value ?? undefined,
    startsAt: campaign.startsAt,
    endsAt: campaign.endsAt,
    sortOrder: campaign.sortOrder ?? 0,
    productCount: campaign.productCount ?? 0,
    categoryCount: campaign.categoryCount ?? 0,
  };
}

function unitType(level: number): UnitType {
  if (level <= 1) return "piece";
  if (level === 2) return "box";
  return "case";
}

function fallbackProduct(
  product: BackendCampaignProduct,
  campaign: BackendCampaignSummary,
): Product {
  const units: ProductUnit[] = product.units.map((unit) => {
    const compareAtPrice =
      unit.compareAtPrice && unit.compareAtPrice > unit.price
        ? unit.compareAtPrice
        : unit.listPrice && unit.listPrice > unit.price
          ? unit.listPrice
          : unit.basePrice && unit.basePrice > unit.price
            ? unit.basePrice
            : undefined;

    return {
      id: unit.id,
      unitType: unitType(unit.level),
      labelTh: unit.unitName,
      labelEn: unit.unitName,
      price: unit.price,
      basePrice: unit.basePrice ?? undefined,
      listPrice: unit.listPrice ?? undefined,
      compareAtPrice,
      salePriceOverride: unit.salePriceOverride ?? undefined,
      dealId: campaign.id,
      conversionRate: 1,
      sku: unit.sku,
      stock: 999,
    };
  });

  return {
    id: product.id,
    name: product.name,
    slug: product.id,
    description: "",
    images:
      product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
          ? [product.imageUrl]
          : [getPlaceholderUrl(400, 400, product.name)],
    categoryId: "",
    units,
    baseUnit: units[0]?.unitType ?? "piece",
    baseStock: 999,
    activeDeal: {
      id: campaign.id,
      slug: campaign.slug,
      title: campaign.title,
      badge: campaign.badge ?? undefined,
    },
    createdAt: campaign.startsAt,
  };
}

async function hydrateCampaignProduct(
  campaignProduct: BackendCampaignProduct,
  campaign: BackendCampaignSummary,
): Promise<Product> {
  const response = await apiGet<BackendProduct>(
    `/products/${campaignProduct.id}`,
  );

  if (!response.success) {
    return fallbackProduct(campaignProduct, campaign);
  }

  return mapProduct(response.data);
}

export async function getActiveCampaigns(params?: {
  page?: number;
  limit?: number;
}): Promise<{ campaigns: CampaignSummary[]; total: number }> {
  const response = await apiGet<BackendCampaignSummary[]>("/campaigns/active", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    },
  });

  if (!response.success) {
    return { campaigns: [], total: 0 };
  }

  return {
    campaigns: response.data.map(mapSummary),
    total: response.meta?.total ?? response.data.length,
  };
}

export async function getCampaignBySlug(
  slug: string,
): Promise<CampaignDetail | null> {
  const response = await apiGet<BackendCampaignDetail>(
    `/campaigns/by-slug/${encodeURIComponent(slug)}`,
  );

  if (!response.success || !response.data.isActive) {
    return null;
  }

  const products = await Promise.all(
    (response.data.products ?? []).map((product) =>
      hydrateCampaignProduct(product, response.data),
    ),
  );

  return {
    ...mapSummary(response.data),
    isActive: response.data.isActive,
    categoryIds: response.data.categoryIds ?? [],
    categories: response.data.categories ?? [],
    products,
  };
}
