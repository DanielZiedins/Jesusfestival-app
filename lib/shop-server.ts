import "server-only";
import { SHOP_URL, type ShopData, type ShopProduct } from "@/lib/shop";

type RawVariant = {
  price?: string;
  compare_at_price?: string | null;
  available?: boolean;
  title?: string;
};

type RawProduct = {
  id: number;
  title: string;
  handle: string;
  published_at?: string;
  variants?: RawVariant[];
  images?: { src?: string; alt?: string | null; width?: number; height?: number }[];
};

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});

function numericPrice(value?: string | null) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function normalize(product: RawProduct): ShopProduct | null {
  const variants = product.variants ?? [];
  const availableVariants = variants.filter((variant) => variant.available !== false);
  const purchasable = availableVariants.length ? availableVariants : variants;
  const prices = purchasable.map((variant) => numericPrice(variant.price)).filter((price): price is number => price !== null);
  if (!prices.length) return null;

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const comparePrices = purchasable
    .map((variant) => numericPrice(variant.compare_at_price))
    .filter((price): price is number => price !== null && price > minPrice);
  const compareAt = comparePrices.length ? Math.min(...comparePrices) : null;
  const image = product.images?.[0];
  const colors = new Set(
    variants
      .map((variant) => variant.title?.split(" / ")[0]?.trim())
      .filter((value): value is string => Boolean(value && value !== "Default Title")),
  );
  const publishedAt = product.published_at ? new Date(product.published_at).getTime() : 0;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    url: `${SHOP_URL}/products/${product.handle}?utm_source=jesusfestival.app&utm_medium=app&utm_campaign=festival_shop`,
    price: money.format(minPrice),
    priceAmount: minPrice,
    maxPrice: maxPrice > minPrice ? money.format(maxPrice) : null,
    maxPriceAmount: maxPrice,
    priceVaries: maxPrice > minPrice,
    compareAt: compareAt ? money.format(compareAt) : null,
    available: availableVariants.length > 0,
    availableVariants: availableVariants.length,
    colorCount: colors.size,
    image: image?.src ?? null,
    imageAlt: image?.alt || product.title,
    imageWidth: image?.width ?? 1200,
    imageHeight: image?.height ?? 1200,
    isNew: publishedAt > thirtyDaysAgo,
    onSale: compareAt !== null,
  };
}

async function fetchCollection(handle: string, limit: number): Promise<ShopProduct[] | null> {
  try {
    // Pin the catalog context to Canada so Vercel's U.S. build region cannot
    // silently localize dollar amounts to USD while the app labels them CAD.
    const response = await fetch(`${SHOP_URL}/collections/${handle}/products.json?limit=${limit}&country=CA`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { products?: RawProduct[] };
    return (data.products ?? []).map(normalize).filter((product): product is ShopProduct => Boolean(product?.image));
  } catch {
    return null;
  }
}

/** Live Shopify inventory, cached briefly by Next.js for speed and resilience. */
export async function getShopData(): Promise<ShopData | null> {
  const [festival, drops] = await Promise.all([
    fetchCollection("jesus-festival", 24),
    fetchCollection("new-drops", 24),
  ]);
  if (festival === null && drops === null) return null;
  const featuredIds = new Set((festival ?? []).map((product) => product.id));
  return {
    festival: festival ?? [],
    fresh: (drops ?? []).filter((product) => !featuredIds.has(product.id)).slice(0, 8),
    refreshedAt: new Date().toISOString(),
  };
}
