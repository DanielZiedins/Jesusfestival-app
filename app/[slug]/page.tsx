import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { APP_ROUTE_META, APP_ROUTES } from "@/lib/routes";

export function generateStaticParams() {
  return Object.keys(APP_ROUTE_META)
    .filter((path) => path !== "/")
    .map((path) => ({ slug: path.slice(1) }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const path = `/${params.slug}`;
  const meta = APP_ROUTE_META[path];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: { title: meta.title, description: meta.description, url: path },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default function AppRoute({ params }: { params: { slug: string } }) {
  const destination = APP_ROUTES[`/${params.slug}`];
  if (!destination) notFound();
  return <AppShell initialDestination={destination} />;
}
