/**
 * The Kingdom Shop (thykingdom.shop) — Shopify storefront.
 *
 * Product data comes from Shopify's public collection JSON endpoints, which
 * this store serves with `access-control-allow-origin: *`, so the browser can
 * fetch live inventory directly: no API keys, no proxy, never stale. Checkout
 * happens on thykingdom.shop itself — we only ever link out.
 */

export const SHOP_URL = "https://thykingdom.shop";
export const SHOP_JF_COLLECTION_URL = `${SHOP_URL}/collections/jesus-festival`;

export type ShopProduct = {
  id: number;
  title: string;
  handle: string;
  url: string;
  price: string;
  compareAt: string | null;
  image: string | null;
  imageAlt: string;
};

type RawProduct = {
  id: number;
  title: string;
  handle: string;
  variants?: { price?: string; compare_at_price?: string | null }[];
  images?: { src?: string; alt?: string | null }[];
};

const money = (v?: string | null) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? `$${n.toFixed(2)}` : "";
};

function normalize(p: RawProduct): ShopProduct {
  const v = p.variants?.[0] ?? {};
  const img = p.images?.[0];
  const compare = Number(v.compare_at_price);
  const price = Number(v.price);
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    url: `${SHOP_URL}/products/${p.handle}`,
    price: money(v.price),
    compareAt: Number.isFinite(compare) && compare > price ? money(v.compare_at_price) : null,
    image: img?.src ?? null,
    imageAlt: img?.alt || p.title,
  };
}

async function fetchCollection(handle: string, limit: number): Promise<ShopProduct[] | null> {
  try {
    const res = await fetch(`${SHOP_URL}/collections/${handle}/products.json?limit=${limit}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { products?: RawProduct[] };
    return (data.products ?? []).map(normalize).filter((p) => p.image && p.price);
  } catch {
    return null;
  }
}

export type ShopData = {
  festival: ShopProduct[];
  fresh: ShopProduct[];
};

/**
 * The featured Jesus Festival collection plus the newest drops from the wider
 * shop (minus anything already featured). Null only when the store itself is
 * unreachable, so the screen can show a retry instead of an empty shelf.
 */
export async function fetchShop(): Promise<ShopData | null> {
  const [festival, drops] = await Promise.all([
    fetchCollection("jesus-festival", 24),
    fetchCollection("new-drops", 24),
  ]);
  if (festival === null && drops === null) return null;
  const featured = new Set((festival ?? []).map((p) => p.id));
  return {
    festival: festival ?? [],
    fresh: (drops ?? []).filter((p) => !featured.has(p.id)).slice(0, 8),
  };
}
