import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RETIRED_TOKENS, STATIONS, stationByToken } from "@/lib/hunt";
import ClaimStation from "@/components/hunt/ClaimStation";
import { ArrowRight } from "@/components/icons";

// Only the printed tokens are valid params — anything else is a genuine 404
// rather than a prerendered shell served with a 200.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...STATIONS.map((s) => s.token), ...RETIRED_TOKENS].map((token) => ({ token }));
}

export async function generateMetadata(props: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await props.params;
  const station = stationByToken(token);
  // Each printed code is a one-off physical thing; keep them out of the index
  // so they never compete with /hunt itself.
  const base: Metadata = { robots: { index: false, follow: true }, alternates: { canonical: "/hunt" } };
  if (!station) return { ...base, title: "This light has moved — Light Hunt" };
  return {
    ...base,
    title: `${station.name} — Light Hunt`,
    description: `You found a light at Jesus Festival: ${station.name}. ${station.verse.text} — ${station.verse.ref}`,
  };
}

export default async function ClaimPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  const station = stationByToken(token);
  if (station) return <ClaimStation token={token} />;

  // A code from a previous year's sheet. Never dead-end someone standing in a
  // park holding up a phone — send them to the live hunt instead.
  if (RETIRED_TOKENS.includes(token)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
        <div className="text-5xl" aria-hidden>🕯️</div>
        <h1 className="mt-5 font-display text-[30px] font-extrabold leading-tight text-white">
          This light has moved
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/65">
          You found an older code — good eyes. The Light Hunt is still running, and there are twelve
          lamps waiting for you. Start here and the next code you scan will count.
        </p>
        <Link
          href="/hunt"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-[15px] font-extrabold text-navy-950 shadow-glow active:scale-95"
        >
          Open the Light Hunt <ArrowRight width={16} height={16} />
        </Link>
        <Link href="/" className="mt-4 text-[13px] font-semibold text-white/50 underline underline-offset-4">
          Back to the festival app
        </Link>
      </main>
    );
  }

  notFound();
}
