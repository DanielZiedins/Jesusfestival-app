import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIONS, stationByToken } from "@/lib/hunt";
import ClaimStation from "@/components/hunt/ClaimStation";

// The nine tokens are the only valid params — anything else is a genuine 404
// rather than a prerendered shell served with a 200.
export const dynamicParams = false;

export function generateStaticParams() {
  return STATIONS.map((s) => ({ token: s.token }));
}

export async function generateMetadata(props: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await props.params;
  const station = stationByToken(token);
  if (!station) return {};
  return {
    title: `${station.name} — Light Hunt`,
    description: `You found a light at Jesus Festival: ${station.name}. ${station.verse.text} — ${station.verse.ref}`,
    // Each printed code is a one-off physical thing; keep them out of the index
    // so they never compete with /hunt itself.
    robots: { index: false, follow: true },
    alternates: { canonical: "/hunt" },
  };
}

export default async function ClaimPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  const station = stationByToken(token);
  if (!station) notFound();
  return <ClaimStation token={token} />;
}
