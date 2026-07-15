"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Home,
  Star,
  Share2,
  Heart,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UnitSelector } from "@/components/product/unit-selector";
import { ProductCard } from "@/components/product/product-card";
import { ProductReviews } from "@/components/product/product-reviews";
import { addToCart } from "@/lib/cart-actions";
import { getPlaceholderUrl } from "@/lib/placeholder";
import type { Product, ProductUnit } from "@/types";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  categoryName: string;
  categorySlug: string;
}

export function ProductDetailClient({
  product,
  relatedProducts,
  categoryName,
  categorySlug,
}: ProductDetailClientProps) {
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit>(
    product.units[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "review">(
    "desc"
  );

  const baseImages =
    product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("http") || img.startsWith("/")
            ? img
            : getPlaceholderUrl(600, 600, "Product")
        )
      : [getPlaceholderUrl(600, 600, "Product")];

  const images =
    baseImages.length >= 4
      ? baseImages
      : [
          ...baseImages,
          ...Array.from({ length: 4 - baseImages.length }, (_, i) =>
            getPlaceholderUrl(600, 600, `Product ${i + 2}`)
          ),
        ];

  const hasDiscount =
    selectedUnit.compareAtPrice &&
    selectedUnit.compareAtPrice > selectedUnit.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((selectedUnit.compareAtPrice! - selectedUnit.price) /
          selectedUnit.compareAtPrice!) *
          100
      )
    : 0;

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      productName: product.name,
      productImage: images[0],
      selectedUnit,
      quantity,
      dealId: selectedUnit.dealId ?? product.activeDeal?.id,
      dealBadge: product.activeDeal?.badge ?? product.activeDeal?.title,
      dealTitle: product.activeDeal?.title,
      dealSlug: product.activeDeal?.slug,
      sourceLabel: product.activeDeal ? "แคมเปญ" : undefined,
      promoDiscountPercent: hasDiscount ? discountPercent : undefined,
      promoSavedAmount: hasDiscount
        ? selectedUnit.compareAtPrice! - selectedUnit.price
        : undefined,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
    setQuantity(1);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, Math.min(value, selectedUnit.stock)));
  };

  const prevImage = () =>
    setMainImageIdx(
      (i) => (i - 1 + images.length) % images.length
    );
  const nextImage = () =>
    setMainImageIdx((i) => (i + 1) % images.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-primary"
        >
          <Home className="h-3.5 w-3.5" />
          <span>หน้าแรก</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/categories/${categorySlug}`}
          className="transition-colors hover:text-primary"
        >
          {categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      {/* Product Detail Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="space-y-3">
          <div className="group relative aspect-square overflow-hidden rounded-lg border bg-white">
            <img
              src={
                images[mainImageIdx] ||
                getPlaceholderUrl(600, 600, "Product")
              }
              alt={product.name}
              className="h-full w-full object-contain p-4"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {hasDiscount && (
              <Badge className="absolute left-3 top-3 bg-red-500 text-white hover:bg-red-500">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMainImageIdx(idx)}
                  className={cn(
                    "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1.5 transition-all sm:h-24 sm:w-24",
                    mainImageIdx === idx
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-primary/40"
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div>
          {/* Category */}
          <Link
            href={`/categories/${categorySlug}`}
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            {categoryName}
          </Link>

          {/* Name + badges */}
          <div className="mt-1 flex items-start gap-2">
            <h1 className="text-xl font-bold text-foreground lg:text-2xl">
              {product.name}
            </h1>
            {product.isNew && (
              <Badge className="mt-1 bg-green-500 text-white hover:bg-green-500">
                ใหม่
              </Badge>
            )}
            {product.activeDeal && (
              <Link href={`/campaigns/${product.activeDeal.slug}`}>
                <Badge className="mt-1 bg-primary text-white hover:bg-primary/90">
                  {product.activeDeal.badge ?? "แคมเปญ"}
                </Badge>
              </Link>
            )}
          </div>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              4.0 (ยังไม่มีรีวิว)
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ฿{selectedUnit.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                ฿{selectedUnit.compareAtPrice!.toLocaleString()}
              </span>
            )}
          </div>
          {product.activeDeal && (
            <Link
              href={`/campaigns/${product.activeDeal.slug}`}
              className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline"
            >
              ดูแคมเปญ: {product.activeDeal.title}
            </Link>
          )}

          <Separator className="my-4" />

          {/* Short description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <Separator className="my-4" />

          {/* Unit Selector */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              เลือกหน่วย :
            </span>
            <UnitSelector
              units={product.units}
              selectedSku={selectedUnit.sku}
              onChange={(unit) => {
                setSelectedUnit(unit);
                setQuantity(1);
              }}
            />
          </div>

          {/* Stock */}
          <div className="mt-3 flex items-center gap-2">
            {selectedUnit.stock > 0 ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="h-3.5 w-3.5" />
                มีสินค้า ({selectedUnit.stock} {selectedUnit.labelTh})
              </span>
            ) : (
              <span className="text-sm text-red-500">สินค้าหมด</span>
            )}
          </div>

          {/* Quantity + Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                max={selectedUnit.stock}
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(Number(e.target.value))
                }
                className="h-10 w-14 border-x bg-transparent text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= selectedUnit.stock}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className={cn(
                "gap-2 px-8 transition-all",
                addedFeedback && "bg-green-600 hover:bg-green-600"
              )}
              onClick={handleAddToCart}
              disabled={selectedUnit.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
              {addedFeedback ? "เพิ่มแล้ว ✓" : "เพิ่มลงตะกร้า"}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary px-8 text-primary hover:bg-primary/5"
              onClick={handleAddToCart}
              disabled={selectedUnit.stock <= 0}
            >
              ซื้อเลย
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-red-500"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Meta info */}
          <div className="space-y-1.5 text-sm">
            <p>
              <span className="text-muted-foreground">SKU :</span>{" "}
              <span className="font-medium">{selectedUnit.sku}</span>
            </p>
            <p>
              <span className="text-muted-foreground">หมวดหมู่ :</span>{" "}
              <Link
                href={`/categories/${categorySlug}`}
                className="font-medium text-primary hover:underline"
              >
                {categoryName}
              </Link>
            </p>
          </div>

          {/* Share */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">แชร์ :</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Additional Info / Review */}
      <div className="mt-12">
        <div className="flex border-b">
          {(
            [
              { key: "desc", label: "รายละเอียดสินค้า" },
              { key: "info", label: "ข้อมูลเพิ่มเติม" },
              { key: "review", label: "รีวิว" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "desc" && (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === "info" && (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b bg-muted/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      ชื่อสินค้า
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {product.name}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      SKU
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {selectedUnit.sku}
                    </td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      หน่วยนับ
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {product.units
                        .map((u) => u.labelTh)
                        .join(", ")}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      หมวดหมู่
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {categoryName}
                    </td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      สต็อก
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {selectedUnit.stock} {selectedUnit.labelTh}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "review" && (
            <ProductReviews productSlug={product.slug} />
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            สินค้าที่เกี่ยวข้อง
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
