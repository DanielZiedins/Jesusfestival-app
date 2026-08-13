import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/content";
import { breadcrumbJsonLd, FESTIVAL_FAQ_JSONLD, FESTIVAL_FAQS, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jesus Festival Hamilton FAQ",
  description:
    "Answers about Jesus Festival Hamilton 2026: dates, times, free admission, Gage Park directions, parking, lineup, Kids Zone, what to bring and the official app.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Jesus Festival Hamilton 2026 FAQ",
    description: "Everything to know before the free September 4–5 festival at Gage Park.",
    url: "/faq",
    type: "article",
  },
};

export default function FaqPage() {
  const pageJsonLd = webPageJsonLd({
    path: "/faq",
    name: "Jesus Festival Hamilton 2026 Frequently Asked Questions",
    description: metadata.description as string,
    about: { "@id": `${SITE.url}/#festival-2026` },
  });
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: "Frequently Asked Questions", path: "/faq" },
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([FESTIVAL_FAQ_JSONLD, pageJsonLd, breadcrumbs]) }}
      />

      <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        <Link href="/" className="hover:text-gold-400">Jesus Festival</Link>
        <span className="px-2">/</span>
        <span aria-current="page">FAQ</span>
      </nav>

      <header className="mt-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-400">Know before you go</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Jesus Festival <span className="text-gradient-gold">FAQ</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/65">
          Clear answers for Jesus Festival Hamilton 2026 at Gage Park. The short version: it&apos;s free, it&apos;s for everyone, and you&apos;re invited.
        </p>
      </header>

      <section aria-labelledby="faq-heading" className="mt-12 space-y-4">
        <h2 id="faq-heading" className="sr-only">Frequently asked questions</h2>
        {FESTIVAL_FAQS.map((item, index) => (
          <article key={item.question} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 sm:p-7">
            <div className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/10 text-xs font-extrabold text-gold-400" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold leading-snug text-white">{item.question}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{item.answer}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-7 text-center sm:p-9">
        <h2 className="font-display text-2xl font-extrabold text-white">Ready for Gage Park?</h2>
        <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-white/65">
          See the complete Hamilton 2026 guide, build your personal lineup and get directions before festival weekend.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/jesus-festival-hamilton" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow">Open the festival guide</Link>
          <Link href="/schedule" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white">View the schedule</Link>
        </div>
      </section>
    </main>
  );
}
