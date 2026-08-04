import type { Metadata } from "next";
import Link from "next/link";
import { KINGDOM_SITES, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Kingdom Network",
  description:
    "Jesus Festival is one part of a wider family of Kingdom projects — city outreach, global missions, discipleship tools, disaster relief and Kingdom businesses. Explore all of them.",
  alternates: { canonical: "/network" },
  openGraph: {
    title: "The Kingdom Network | Jesus Festival",
    description:
      "One movement, many doors: city outreach, global missions, discipleship tools and Kingdom businesses working together.",
    url: "/network",
    type: "website",
  },
};

const GROUPS: { id: "movement" | "growth" | "business"; title: string; blurb: string }[] = [
  {
    id: "movement",
    title: "The movement",
    blurb: "Gathering the Church, reaching cities, and carrying hope where it's needed most.",
  },
  {
    id: "growth",
    title: "Growing in faith",
    blurb: "Where a first yes becomes a lasting walk — and where you learn to reach the people around you.",
  },
  {
    id: "business",
    title: "Kingdom business",
    blurb: "Companies, tools and stories built by people who refuse to separate Sunday from Monday.",
  },
];

/** An ItemList of the whole network — machine-readable proof these belong together. */
const JSONLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "The Kingdom Network",
  url: `${SITE.url}/network`,
  description:
    "The family of Kingdom projects connected to Jesus Festival Hamilton — outreach, missions, discipleship tools and Kingdom businesses.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: KINGDOM_SITES.length,
    itemListElement: KINGDOM_SITES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: s.url,
      description: s.blurb,
    })),
  },
};

export default function NetworkPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-20 pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <header className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold-400">
          ← Jesus Festival
        </Link>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
          The <span className="text-gradient-gold">Kingdom Network</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-white/65">
          Jesus Festival isn&apos;t a standalone event — it&apos;s one expression of a wider family of
          projects, all aimed at the same thing: <span className="text-white/85">Love God. Love People. Change the World.</span>
        </p>
      </header>

      {GROUPS.map((g) => {
        const sites = KINGDOM_SITES.filter((s) => s.group === g.id);
        if (!sites.length) return null;
        return (
          <section key={g.id} className="mt-12">
            <h2 className="font-display text-2xl font-bold text-white">{g.title}</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-white/55">{g.blurb}</p>
            <div className="mt-5 space-y-2.5">
              {sites.map((s) => (
                <a
                  key={s.domain}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-2xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-[16px] font-bold text-white group-hover:text-gold-400">{s.name}</span>
                      <span className="text-[11px] font-semibold text-gold-400">{s.domain}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-wider text-purple-300">{s.tag}</span>
                    <span className="mt-1.5 block text-[13.5px] leading-relaxed text-white/60">{s.blurb}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-14 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-7 text-center">
        <h2 className="font-display text-2xl font-bold text-white">Start where you are</h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-white/65">
          You don&apos;t need all of it. Pick the one door that fits the season you&apos;re in — and walk through it.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <Link
            href="/blog"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-[14px] font-bold text-white"
          >
            Read the blog
          </Link>
          <Link
            href="/"
            className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-3 font-display text-[14px] font-extrabold text-navy-950 shadow-glow"
          >
            Open the festival app →
          </Link>
        </div>
      </section>
    </main>
  );
}
