/**
 * Generates a placeholder image URL with recommended dimensions displayed.
 * When real images are available, replace these calls with actual image paths.
 */
export function getPlaceholderUrl(
  width: number,
  height: number,
  label?: string
): string {
  const sizeLabel = `${width}x${height}`;
  const displayText = label && /^[\x20-\x7E]+$/.test(label) ? `${sizeLabel}\\n${label}` : sizeLabel;
  return `https://placehold.co/${width}x${height}/e2e8f0/475569?text=${encodeURIComponent(displayText)}`;
}

/**
 * Recommended image sizes for each placement:
 *
 * | Placement               | Width | Height | Ratio  | Notes                          |
 * |-------------------------|-------|--------|--------|--------------------------------|
 * | Hero Banner             | 1200  | 460    | ~2.6:1 | Full-width, responsive         |
 * | Category Grid (Home)    | 300   | 300    | 1:1    | Square thumbnail               |
 * | Category Page Card      | 400   | 300    | 4:3    | Category listing card          |
 * | Product Card            | 300   | 300    | 1:1    | Square, used in grids          |
 * | Product Detail (Main)   | 600   | 600    | 1:1    | Large, zoomable                |
 * | Product Detail (Thumb)  | 100   | 100    | 1:1    | Gallery thumbnails             |
 * | Cart Item               | 80    | 80     | 1:1    | Small thumbnail                |
 * | Order Item              | 64    | 64     | 1:1    | Small in order detail          |
 * | Blog Cover              | 400   | 225    | 16:9   | Blog card & detail hero        |
 * | Blog Detail Hero        | 1200  | 400    | 3:1    | Full-width blog header         |
 * | Promotion Card          | 200   | 200    | 1:1    | Promo grid icons               |
 * | Slip Upload             | 400   | 600    | 2:3    | Payment slip (portrait)        |
 * | Logo                    | 200   | 60     | ~3:1   | Site logo                      |
 */
export const IMAGE_SIZES = {
  heroBanner: { width: 1200, height: 460, label: "Banner 1200x460" },
  categoryGridHome: { width: 300, height: 300, label: "Category 300x300" },
  categoryCard: { width: 400, height: 300, label: "Category 400x300" },
  productCard: { width: 300, height: 300, label: "Product 300x300" },
  productDetailMain: { width: 600, height: 600, label: "Product 600x600" },
  productDetailThumb: { width: 100, height: 100, label: "Thumb 100x100" },
  cartItem: { width: 80, height: 80, label: "Cart 80x80" },
  orderItem: { width: 64, height: 64, label: "Order 64x64" },
  blogCover: { width: 400, height: 225, label: "Blog 400x225 (16:9)" },
  blogDetailHero: { width: 1200, height: 400, label: "Blog Hero 1200x400" },
  promotionCard: { width: 200, height: 200, label: "Promo 200x200" },
  slipUpload: { width: 400, height: 600, label: "Slip 400x600" },
  logo: { width: 200, height: 60, label: "Logo 200x60" },
} as const;
