/** Public, serializable storefront types shared by server and client. */

export const SHOP_URL = "https://thykingdom.shop";
export const SHOP_JF_COLLECTION_URL = `${SHOP_URL}/collections/jesus-festival?utm_source=jesusfestival.app&utm_medium=app&utm_campaign=festival_shop`;

export type ShopProduct = {
  id: number;
  title: string;
  handle: string;
  url: string;
  price: string;
  priceAmount: number;
  maxPrice: string | null;
  maxPriceAmount: number;
  priceVaries: boolean;
  compareAt: string | null;
  available: boolean;
  availableVariants: number;
  colorCount: number;
  image: string | null;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  isNew: boolean;
  onSale: boolean;
};

export type ShopData = {
  festival: ShopProduct[];
  fresh: ShopProduct[];
  refreshedAt: string;
};

function isShopData(value: unknown): value is ShopData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ShopData>;
  return Array.isArray(candidate.festival) && Array.isArray(candidate.fresh) && typeof candidate.refreshedAt === "string";
}

/** Fetch the app's cached, same-origin storefront feed. */
export async function fetchShop(signal?: AbortSignal): Promise<ShopData | null> {
  try {
    const response = await fetch("/api/shop", {
      signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return isShopData(data) ? data : null;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return null;
  }
}
