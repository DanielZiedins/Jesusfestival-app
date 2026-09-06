import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import { SITE } from "@/lib/content";
import { FESTIVAL_EVENT_JSONLD, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jesus Festival 2026: All Glory to God",
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Jesus Festival 2026: Thank You, Hamilton—All Glory to God",
    description: SITE.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jesus Festival 2026 — All glory to God" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival 2026: All Glory to God",
    description: SITE.description,
    images: ["/opengraph-image"],
  },
};

export default function Page() {
  const pageJsonLd = webPageJsonLd({
    path: "/",
    name: "Jesus Festival Hamilton 2026 Recap and Next Steps",
    description: SITE.description,
    about: { "@id": `${SITE.url}/#festival-2026` },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([FESTIVAL_EVENT_JSONLD, pageJsonLd]) }}
      />
      <AppShell />
    </>
  );
}
