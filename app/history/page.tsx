import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jesus Festival History",
  description:
    "Explore the story of Jesus Festival Hamilton from 2024 through 2026, including the preserved 2026 website, festival archive, photos, recaps and reported ministry fruit.",
  alternates: { canonical: "/history" },
  openGraph: {
    type: "website",
    url: "/history",
    title: "Jesus Festival History | Hamilton 2024–2026",
    description: "Remember the gatherings, the people, the worship and the stories—and explore the preserved Jesus Festival 2026 website.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jesus Festival Hamilton history" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival History | Hamilton 2024–2026",
    description: "The story so far, including the preserved Jesus Festival 2026 website.",
    images: ["/opengraph-image"],
  },
};

type HistoryYear = {
  year: string;
  title: string;
  text: string;
  status: string;
  href?: string;
};

const YEARS: readonly HistoryYear[] = [
  {
    year: "2024",
    title: "The first yes",
    text: "Jesus Festival began in Hamilton with worship, Gospel hope, community and a city gathering around the name of Jesus.",
    status: "Story preserved",
  },
  {
    year: "2025",
    title: "The fruit multiplied",
    text: "The gathering returned with growing unity, baptisms, outreach, family joy and testimonies pointing back to Jesus.",
    status: "Story preserved",
  },
  {
    year: "2026",
    title: "The city gathered again",
    text: "The two-day Gage Park gathering returned with worship, the Gospel, baptisms, artists, families, vendors and thousands of neighbours served.",
    status: "Full website archive",
    href: "/history/2026",
  },
];

const pageDescription = metadata.description as string;

export default function HistoryPage() {
  const structuredData = [
    webPageJsonLd({ path: "/history", name: "Jesus Festival History", description: pageDescription }),
    breadcrumbJsonLd([
      { name: "Jesus Festival", path: "/" },
      { name: "History", path: "/history" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE.url}/history#collection`,
      name: "Jesus Festival Hamilton history archive",
      url: `${SITE.url}/history`,
      description: pageDescription,
      inLanguage: "en-CA",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: YEARS.length,
        itemListElement: YEARS.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `Jesus Festival ${item.year}: ${item.title}`,
          description: item.text,
          ...(item.href ? { url: `${SITE.url}${item.href}` } : {}),
        })),
      },
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-ink pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      <header className="relative isolate min-h-[640px] overflow-hidden">
        <Image src="/brand/banner-splash.webp" alt="Jesus Festival purple and gold artwork" fill preload sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/35 via-purple-950/65 to-ink" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,rgba(245,190,72,0.22),transparent_34%)]" />

        <div className="mx-auto flex min-h-[640px] max-w-4xl flex-col px-5 pb-16 pt-10 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
            <Link href="/" className="hover:text-gold-300">Jesus Festival</Link><span className="px-2">/</span><span aria-current="page">History</span>
          </nav>
          <div className="my-auto max-w-2xl py-20">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gold-300">Remember His faithfulness</p>
            <h1 className="mt-4 font-display text-5xl font-black leading-[0.92] tracking-[-0.045em] text-white sm:text-7xl">
              THE STORY{" "}
              <br />
              <span className="text-gradient-gold">SO FAR.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/75 sm:text-lg">
              A growing archive of Jesus Festival in Hamilton—the prayers, people, worship, outreach, memories and digital experiences that helped tell each year&apos;s story.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/history/2026" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-3 text-sm font-black text-navy-950 shadow-glow">Explore the 2026 archive</Link>
              <Link href="/blog/jesus-festival-hamilton-2026-recap" className="rounded-2xl border border-white/20 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur">Read the 2026 recap</Link>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="years-heading" className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.24em] text-gold-300">Hamilton · Ontario · Canada</p>
        <h2 id="years-heading" className="mt-3 text-center font-display text-4xl font-black text-white">Three years. One faithful God.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {YEARS.map((item) => {
            const body = (
              <>
                <span className="font-display text-5xl font-black text-gradient-gold">{item.year}</span>
                <span className="mt-4 block text-[10px] font-black uppercase tracking-[0.18em] text-purple-200">{item.status}</span>
                <h3 className="mt-2 font-display text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.text}</p>
                {item.href && <span className="mt-5 inline-flex text-xs font-black text-gold-300">Open the time capsule →</span>}
              </>
            );
            return item.href ? (
              <Link key={item.year} href={item.href} className="group rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/[0.12] via-purple-800/20 to-transparent p-6 transition hover:-translate-y-1 hover:border-gold/60">{body}</Link>
            ) : (
              <article key={item.year} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">{body}</article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 sm:px-8">
        <blockquote className="rounded-[2rem] border border-gold/25 bg-gradient-to-br from-purple-800/20 to-gold/[0.08] p-8 text-center sm:p-10">
          <p className="font-display text-2xl font-bold italic leading-relaxed text-white">“One generation shall praise thy works to another, and shall declare thy mighty acts.”</p>
          <footer className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-gold-300">Psalm 145:4 (KJV)</footer>
        </blockquote>
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-7 text-center">
          <h2 className="font-display text-2xl font-black text-white">Why preserve the website?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Because the practical guides, artwork, lineup, invitations and language capture how the community prepared for Jesus Festival 2026. This archive keeps that memory available while clearly separating historical planning information from current next steps.
          </p>
        </div>
      </section>
    </main>
  );
}
