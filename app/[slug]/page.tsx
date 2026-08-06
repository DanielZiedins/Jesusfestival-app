import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { APP_ROUTE_META, APP_ROUTES } from "@/lib/routes";

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
  };
}

export default async function AppRoute(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const destination = APP_ROUTES[`/${params.slug}`];
  if (!destination) notFound();
  return <AppShell initialDestination={destination} />;
}
