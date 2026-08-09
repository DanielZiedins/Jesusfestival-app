import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import { SITE } from "@/lib/content";
import { FESTIVAL_EVENT_JSONLD, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  const pageJsonLd = webPageJsonLd({
    path: "/",
    name: "Jesus Festival App — Hamilton 2026",
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
