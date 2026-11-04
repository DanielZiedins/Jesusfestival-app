import type { Metadata } from "next";
import Link from "next/link";
import Festival2026ArchiveExperience from "@/components/Festival2026ArchiveExperience";
import { POST_EVENT, SITE } from "@/lib/content";
import { breadcrumbJsonLd, FESTIVAL_EVENT_JSONLD, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jesus Festival 2026 Website Archive",
  description:
    "Explore the preserved Jesus Festival Hamilton 2026 homepage, lineup, Gage Park planning content, festival features, photos and the story behind the completed September 4–5 gathering.",
  alternates: { canonical: "/history/2026" },
  openGraph: {
    type: "article",
    url: "/history/2026",
    title: "Jesus Festival 2026 Website Archive",
    description: "Step back into the final pre-event Jesus Festival 2026 homepage and explore the story, lineup and planning experience preserved as a digital time capsule.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jesus Festival 2026 website archive" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival 2026 Website Archive",
    description: "The final pre-event homepage, preserved as a digital time capsule.",
    images: ["/opengraph-image"],
  },
};

const FAQS = [
  {
    question: "What is the Jesus Festival 2026 website archive?",
    answer: "It is a preserved version of the final JesusFestival.App homepage used to help people prepare for the September 4–5, 2026 gathering at Gage Park in Hamilton. Historical labels distinguish the archived planning experience from current information.",
  },
  {
    question: "Did Jesus Festival Hamilton take place in 2026?",
    answer: "Yes. Jesus Festival took place at Gage Park in Hamilton on September 4–5, 2026. Friday featured Pure Worship Night, followed by Saturday's free all-ages festival day.",
  },
  {
    question: "What results were reported after Jesus Festival 2026?",
    answer: "As of September 6, 2026, the Jesus Festival team reported 70+ salvations, 50+ baptisms, more than 3,000 hot dogs and drinks shared, and record attendance. These are preliminary ministry reports that may be updated as follow-up continues.",
  },
] as const;

const description = metadata.description as string;

export default function History2026Page() {
  const url = `${SITE.url}/history/2026`;
  const structuredData = [
    webPageJsonLd({ path: "/history/2026", name: "Jesus Festival 2026 Website Archive", description, about: { "@id": `${SITE.url}/#festival-2026` } }),
    breadcrumbJsonLd([
      { name: "Jesus Festival", path: "/" },
      { name: "History", path: "/history" },
      { name: "2026 Website Archive", path: "/history/2026" },
    ]),
    FESTIVAL_EVENT_JSONLD,
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#archive`,
      name: "JesusFestival.App 2026 homepage archive",
      url,
      description,
      dateCreated: "2026-11-04",
      temporalCoverage: "2026",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE.url}/history#collection` },
      about: { "@id": `${SITE.url}/#festival-2026` },
      creator: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-ink pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      <header className="relative overflow-hidden border-b border-white/10 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(147,51,234,0.26),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(245,190,72,0.15),transparent_26%)]" />
        <div className="relative mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">
            <Link href="/" className="hover:text-gold-300">Jesus Festival</Link><span className="px-2">/</span><Link href="/history" className="hover:text-gold-300">History</Link><span className="px-2">/</span><span aria-current="page">2026</span>
          </nav>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-gold-300">Digital time capsule · Hamilton</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.94] tracking-[-0.04em] text-white sm:text-7xl">
                JESUS FESTIVAL{" "}
                <br />
                <span className="text-gradient-gold">2026 ARCHIVE.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
                The final pre-event homepage is still here. We preserved its hero, artists, schedule invitations, festival tools, photos, Scriptures, shop and movement content as a memory of how Hamilton prepared for September 4–5, 2026.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:w-64">
              <div className="rounded-2xl border border-gold/20 bg-gold/[0.08] p-4 text-center"><p className="font-display text-2xl font-black text-gold-300">2</p><p className="text-[9px] font-black uppercase tracking-wider text-white/55">Festival days</p></div>
              <div className="rounded-2xl border border-purple-300/20 bg-purple-400/[0.08] p-4 text-center"><p className="font-display text-2xl font-black text-purple-200">2026</p><p className="text-[9px] font-black uppercase tracking-wider text-white/55">Preserved</p></div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#website-archive" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-3 text-sm font-black text-navy-950 shadow-glow">Enter the original homepage ↓</a>
            <Link href="/blog/jesus-festival-hamilton-2026-recap" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white">Read what happened</Link>
          </div>
        </div>
      </header>

      <section id="website-archive" aria-labelledby="snapshot-heading" className="scroll-mt-4 px-3 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200">Preserved experience</p>
          <h2 id="snapshot-heading" className="mt-3 font-display text-3xl font-black text-white sm:text-4xl">The 2026 homepage, as a memory.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Planning language and buttons below are historical. The festival has ended; current results and next steps live in the recap.
          </p>
        </div>
        <Festival2026ArchiveExperience />
      </section>

      <section aria-labelledby="results-heading" className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="rounded-[2rem] border border-gold/25 bg-gradient-to-br from-gold/[0.11] via-purple-900/20 to-transparent p-7 sm:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gold-300">What followed</p>
          <h2 id="results-heading" className="mt-3 font-display text-3xl font-black text-white">From invitation to testimony.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            The preserved homepage shows the invitation. The post-event story records the first reports: {POST_EVENT.impact[0].stat} {POST_EVENT.impact[0].label.toLowerCase()}, {POST_EVENT.impact[1].stat} {POST_EVENT.impact[1].label.toLowerCase()}, {POST_EVENT.impact[2].stat} {POST_EVENT.impact[2].label.toLowerCase()}, and record attendance reported by the festival team. These preliminary September 6 reports may change as testimonies and follow-up continue.
          </p>
          <Link href="/blog/jesus-festival-hamilton-2026-recap" className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-3 text-sm font-black text-navy-950">Read the complete thank-you recap →</Link>
        </div>
      </section>

      <section aria-labelledby="archive-faq" className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <h2 id="archive-faq" className="font-display text-3xl font-black text-white">About this archive</h2>
        <div className="mt-6 grid gap-3">
          {FAQS.map((item) => (
            <article key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-display text-lg font-black text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
