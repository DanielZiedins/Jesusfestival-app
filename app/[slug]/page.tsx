import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { APP_ROUTE_META, APP_ROUTES } from "@/lib/routes";
import { breadcrumbJsonLd, FESTIVAL_EVENT_JSONLD, newBelieverJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

// Every valid slug is enumerated at build time. Without this, Next 16 serves
// a prerendered fallback shell (HTTP 200) for unknown params before notFound()
// can run — a soft-404 that lets search engines index junk URLs.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(APP_ROUTE_META)
    .filter((path) => path !== "/" && path !== "/shop")
    .map((path) => ({ slug: path.slice(1) }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const path = `/${params.slug}`;
  const meta = APP_ROUTE_META[path];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: { title: meta.title, description: meta.description, url: path },
    twitter: { title: meta.title, description: meta.description },
    robots: path === "/settings" ? { index: false, follow: true } : undefined,
  };
}

export default async function AppRoute(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const destination = APP_ROUTES[`/${params.slug}`];
  if (!destination) notFound();
  const path = `/${params.slug}`;
  const meta = APP_ROUTE_META[path];
  const structuredData = [
    webPageJsonLd({
      path,
      name: meta.title,
      description: meta.description,
      ...(path === "/schedule" || path === "/map"
        ? { about: { "@id": "https://www.jesusfestival.app/#festival-2026" } }
        : {}),
    }),
    breadcrumbJsonLd([
      { name: "Jesus Festival", path: "/" },
      { name: meta.title, path },
    ]),
    ...(path === "/schedule" ? [FESTIVAL_EVENT_JSONLD] : []),
    // The seven first steps and the new-believer questions, in a form an answer
    // engine can quote directly.
    ...(path === "/i-said-yes" ? newBelieverJsonLd() : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <AppShell initialDestination={destination} />
    </>
  );
}
