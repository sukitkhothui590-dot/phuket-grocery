import { apiGet } from "@/lib/api/client";
import { COD_FEE, COMPANY_INFO, SHIPPING_COST } from "@/lib/constants";

export interface PublicSetting {
  key: string;
  value: string;
  isPublic: boolean;
  updatedAt: string;
}

export async function getPublicSettings(): Promise<Record<string, string>> {
  const response = await apiGet<PublicSetting[]>("/public/settings");

  if (!response.success) {
    return {};
  }

  return Object.fromEntries(
    response.data.map((setting) => [setting.key, setting.value]),
  );
}

export async function getPublicSetting(key: string): Promise<string | null> {
  const settings = await getPublicSettings();
  return settings[key] ?? null;
}

function resolveFacebookUrl(value?: string | null): string {
  const url = (value ?? "").trim();
  if (!url || url.includes("[")) {
    return COMPANY_INFO.facebookUrl;
  }

  // Known broken handle from older settings — keep storefront on the live page.
  if (
    /facebook\.com\/phuketgrocery\/?$/i.test(url) &&
    !/facebook\.com\/G\.phuketgrocery/i.test(url)
  ) {
    return COMPANY_INFO.facebookUrl;
  }

  return url;
}

export async function getStoreSettings(): Promise<{
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  workingHours: string;
  lineId: string;
  lineUrl: string;
  facebookUrl: string;
  freeShippingThreshold: number;
  shippingCostStandard: number;
  shippingCostExpress: number;
  codFee: number;
  bankAccount: string;
  googleReviewLink: string;
}> {
  const settings = await getPublicSettings();

  return {
    storeName: settings.store_name ?? COMPANY_INFO.shortName,
    storePhone: settings.store_phone || COMPANY_INFO.phone,
    storeEmail: settings.store_email || COMPANY_INFO.email,
    storeAddress: settings.store_address || COMPANY_INFO.address,
    workingHours: settings.working_hours || COMPANY_INFO.workingHours,
    lineId: settings.line_id || COMPANY_INFO.line,
    lineUrl:
      settings.line_url && !settings.line_url.includes("[")
        ? settings.line_url
        : COMPANY_INFO.lineUrl,
    facebookUrl: resolveFacebookUrl(settings.facebook_url),
    freeShippingThreshold: Number(
      settings.free_shipping_threshold ?? 1500,
    ),
    shippingCostStandard: Number(
      settings.shipping_cost_standard ?? SHIPPING_COST.standard,
    ),
    shippingCostExpress: Number(
      settings.shipping_cost_express ?? SHIPPING_COST.express,
    ),
    codFee: Number(settings.cod_fee ?? COD_FEE),
    bankAccount: settings.company_bank_account ?? "",
    googleReviewLink: settings.google_review_link ?? "",
  };
}
