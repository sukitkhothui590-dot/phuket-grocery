import { getPlaceholderUrl } from "@/lib/placeholder";
import type {
  Address,
  Banner,
  BlogPost,
  Category,
  Coupon,
  FAQ,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductUnit,
  Subcategory,
  UnitType,
  User,
} from "@/types";

interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  icon: string | null;
  sortOrder?: number;
  isActive?: boolean;
  productCount?: number;
}

interface BackendProductUnit {
  id: string;
  productId: string;
  unitName: string;
  unitType?: string;
  labelTh?: string | null;
  labelEn?: string | null;
  sku: string;
  level: number;
  conversionToBase: number;
  conversionRate?: number;
  price: number;
  compareAtPrice?: number | null;
  isBaseUnit: boolean;
  isActive: boolean;
  stock?: number;
  stockStatus?: string;
}

interface BackendProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  images?: string[];
  categoryId: string;
  baseUnit: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  category?: { id: string; name: string; slug: string };
  units: BackendProductUnit[];
  stock?: {
    balance: number;
    reserved: number;
    available: number;
    lowStockThreshold: number;
    status: string;
  };
}

interface BackendBanner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string | null;
  order: number;
}

interface BackendBlog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  author?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}

interface BackendFaq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

interface BackendUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role?: string;
  status?: string;
  createdAt: string;
}

interface BackendOrderItem {
  id?: string;
  productId: string;
  productName?: string;
  name?: string;
  productImage?: string | null;
  productUnitId?: string;
  unitName?: string;
  unitPrice?: number;
  quantity: number;
  lineTotal?: number;
  selectedUnit?: ProductUnit;
}

interface BackendShipping {
  recipientName: string;
  phone: string;
  addressLine: string;
  subDistrict?: string;
  district?: string;
  province: string;
  postalCode: string;
}

interface BackendOrder {
  id: string;
  orderNumber?: string;
  number?: string;
  status: string;
  paymentMethod?: string;
  shippingMethod?: string;
  items: BackendOrderItem[];
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  shippingFee?: number;
  total?: number;
  couponCode?: string | null;
  paymentSlipUrl?: string | null;
  slipImage?: string | null;
  slipUploadedAt?: string | null;
  paymentBank?: string | null;
  paymentAmount?: number | null;
  transferredAt?: string | null;
  trackingNumber?: string | null;
  shipping?: BackendShipping;
  recipientName?: string;
  phone?: string;
  addressLine?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface BackendAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  subDistrict?: string | null;
  district?: string | null;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

function mapUnitType(unit: BackendProductUnit): UnitType {
  if (unit.unitType === "box" || unit.unitType === "case" || unit.unitType === "piece") {
    return unit.unitType;
  }
  if (unit.isBaseUnit || unit.level <= 1) return "piece";
  if (unit.level === 2) return "box";
  return "case";
}

export function mapProductUnit(unit: BackendProductUnit): ProductUnit {
  return {
    id: unit.id,
    unitType: mapUnitType(unit),
    labelTh: unit.labelTh ?? unit.unitName,
    labelEn: unit.labelEn ?? unit.unitName,
    price: unit.price,
    compareAtPrice: unit.compareAtPrice ?? undefined,
    conversionRate: unit.conversionRate ?? unit.conversionToBase,
    sku: unit.sku,
    stock:
      unit.stock ??
      (unit.stockStatus === "OUT_OF_STOCK" ? 0 : 999),
  };
}

export function mapProduct(product: BackendProduct): Product {
  const baseUnit = product.units.find((unit) => unit.isBaseUnit) ?? product.units[0];
  const createdAt = new Date(product.createdAt);
  const isNew =
    product.isNew ??
    Date.now() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 30;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [getPlaceholderUrl(400, 400, product.name)];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    images,
    categoryId: product.categoryId,
    units: product.units.filter((unit) => unit.isActive).map(mapProductUnit),
    baseUnit: baseUnit ? mapUnitType(baseUnit) : "piece",
    baseStock: product.stock?.available ?? 0,
    isFeatured: product.isFeatured ?? false,
    isNew,
    createdAt: product.createdAt,
  };
}

export function mapCategories(items: BackendCategory[]): Category[] {
  const activeItems = items.filter((item) => item.isActive !== false);
  const roots = activeItems
    .filter((item) => !item.parentId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const toSubcategory = (item: BackendCategory): Subcategory => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    parentId: item.parentId ?? "",
    image: item.icon ?? undefined,
  });

  return roots.map((root) => ({
    id: root.id,
    name: root.name,
    slug: root.slug,
    image: root.icon ?? getPlaceholderUrl(120, 120, root.name),
    productCount: root.productCount,
    subcategories: activeItems
      .filter((item) => item.parentId === root.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(toSubcategory),
  }));
}

export function mapBanner(banner: BackendBanner): Banner {
  return {
    id: banner.id,
    title: banner.title,
    image: banner.imageUrl,
    link: banner.link ?? undefined,
    order: banner.order,
  };
}

export function mapBlog(blog: BackendBlog): BlogPost {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    content: blog.content,
    coverImage:
      blog.featuredImage ?? getPlaceholderUrl(800, 400, blog.title),
    publishedAt: blog.publishedAt ?? blog.createdAt,
    author: blog.author ?? "ภูเก็ตโกรเซอรี่",
  };
}

export function mapFaq(faq: BackendFaq): FAQ {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    order: faq.sortOrder,
  };
}

export function mapAddress(address: BackendAddress): Address {
  return {
    id: address.id,
    label: address.label || "ที่อยู่",
    fullName: address.recipientName,
    phone: address.phone,
    addressLine1: address.addressLine,
    district: address.district ?? "",
    subDistrict: address.subDistrict ?? "",
    province: address.province,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
  };
}

export function mapUser(user: BackendUser): User {
  const [firstName, ...rest] = (user.name || "ลูกค้า").trim().split(/\s+/);

  return {
    id: user.id,
    email: user.email ?? "",
    phone: user.phone ?? "",
    firstName,
    lastName: rest.join(" "),
    addresses: [],
    createdAt: user.createdAt,
  };
}

function mapOrderStatus(status: string): OrderStatus {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "pending_payment":
    case "pending":
      return "pending_payment";
    case "pending_verify":
      return "pending_verify";
    case "preparing":
    case "paid":
      return "preparing";
    case "shipped":
      return "shipped";
    case "delivered":
    case "fulfilled":
      return "delivered";
    case "cancelled":
      return "cancelled";
    default:
      return "pending_payment";
  }
}

function mapPaymentMethod(value?: string): Order["paymentMethod"] {
  return value === "bank_transfer" ? "bank_transfer" : "cod";
}

function mapShippingMethod(value?: string): Order["shippingMethod"] {
  return value === "express" ? "express" : "standard";
}

function mapOrderItem(item: BackendOrderItem): OrderItem {
  const productName = item.productName ?? item.name ?? "สินค้า";
  const unitPrice = item.unitPrice ?? item.selectedUnit?.price ?? 0;
  const unitId = item.selectedUnit?.id ?? item.productUnitId ?? item.productId;

  return {
    id: item.id,
    productId: item.productId,
    productName,
    productImage:
      item.productImage ??
      getPlaceholderUrl(120, 120, productName),
    selectedUnit: item.selectedUnit ?? {
      id: unitId,
      unitType: "piece",
      labelTh: item.unitName ?? "ชิ้น",
      labelEn: item.unitName ?? "piece",
      price: unitPrice,
      conversionRate: 1,
      sku: item.productUnitId ?? `${item.productId}-unit`,
      stock: 0,
    },
    quantity: item.quantity,
    subtotal: item.lineTotal ?? unitPrice * item.quantity,
  };
}

export function mapOrder(order: BackendOrder): Order {
  const items = order.items.map(mapOrderItem);
  const subtotal =
    order.subtotal ?? items.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = order.shipping;
  const shippingCost = order.shippingCost ?? order.shippingFee ?? 0;
  const slipImage = order.slipImage ?? order.paymentSlipUrl ?? undefined;

  return {
    id: order.id,
    orderNumber: order.orderNumber ?? order.number ?? order.id,
    items,
    status: mapOrderStatus(order.status),
    paymentMethod: mapPaymentMethod(order.paymentMethod),
    shippingMethod: mapShippingMethod(order.shippingMethod),
    slipImage,
    slipUploadedAt: order.slipUploadedAt ?? undefined,
    shippingAddress: {
      id: `addr-${order.id}`,
      label: "จัดส่ง",
      fullName: shipping?.recipientName ?? order.recipientName ?? "",
      phone: shipping?.phone ?? order.phone ?? "",
      addressLine1: shipping?.addressLine ?? order.addressLine ?? "",
      district: shipping?.district ?? order.district ?? "",
      subDistrict: shipping?.subDistrict ?? order.subDistrict ?? "",
      province: shipping?.province ?? order.province ?? "",
      postalCode: shipping?.postalCode ?? order.postalCode ?? "",
      isDefault: true,
    },
    couponCode: order.couponCode ?? undefined,
    discount: order.discount ?? 0,
    shippingCost,
    subtotal,
    total: order.total ?? subtotal - (order.discount ?? 0) + shippingCost,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt ?? order.createdAt,
  };
}

export function mapCoupon(data: {
  id?: string;
  code: string;
  type?: string;
  value?: number;
  minPurchase?: number;
  maxDiscount?: number;
  endsAt?: string;
  isActive?: boolean;
}): Coupon {
  return {
    id: data.id ?? data.code,
    code: data.code,
    discountType: data.type === "FIXED" ? "fixed" : "percentage",
    discountValue: data.value ?? 0,
    minPurchase: data.minPurchase,
    maxDiscount: data.maxDiscount,
    usageLimit: 9999,
    usedCount: 0,
    expiresAt: data.endsAt ?? new Date(Date.now() + 86400000).toISOString(),
    isActive: data.isActive ?? true,
  };
}

export type {
  BackendProduct,
  BackendCategory,
  BackendUser,
  BackendOrder,
};
