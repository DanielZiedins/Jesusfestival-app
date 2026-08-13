import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import { getShopData } from "@/lib/shop-server";
import { APP_ROUTES, APP_ROUTE_META } from "@/lib/routes";

export const revalidate = 900;

const meta = APP_ROUTE_META["/shop"];

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/shop" },
  openGraph: { title: meta.title, description: meta.description, url: "/shop" },
  twitter: { title: meta.title, description: meta.description },
};

export default async function ShopPage() {
  const shopData = await getShopData();
  const structuredData = shopData
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Jesus Festival Shop",
        description: meta.description,
        url: "https://www.jesusfestival.app/shop",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: shopData.festival.length,
          itemListElement: shopData.festival.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: product.title,
              image: product.image,
              url: product.url,
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "CAD",
                lowPrice: product.priceAmount.toFixed(2),
                highPrice: product.maxPriceAmount.toFixed(2),
                offerCount: product.availableVariants,
                availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              },
            },
          })),
        },
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      )}
      <AppShell initialDestination={APP_ROUTES["/shop"]} initialShopData={shopData ?? undefined} />
    </>
  );
}
