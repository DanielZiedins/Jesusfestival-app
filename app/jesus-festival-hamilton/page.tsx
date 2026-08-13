import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FestivalWeekendPass from "@/components/FestivalWeekendPass";
import { ARTISTS, EXPECT, IMG, LINKS, SCHEDULE, SITE } from "@/lib/content";
import {
  breadcrumbJsonLd,
  FESTIVAL_EVENT_JSONLD,
  FESTIVAL_FAQS,
  FESTIVAL_GUIDE_PATH,
  serializeJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jesus Festival Hamilton 2026: Free Festival Guide",
  description:
    "Plan Jesus Festival Hamilton 2026 at Gage Park: September 4–5 dates and times, free admission, full lineup, schedule, parking, transit, Kids Zone and what to bring.",
  alternates: { canonical: FESTIVAL_GUIDE_PATH },
  openGraph: {
    title: "Jesus Festival Hamilton 2026 — The Complete Festival Guide",
    description: "Free admission · September 4–5 · Gage Park · Worship, family fun, food trucks and baptisms.",
    url: FESTIVAL_GUIDE_PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival Hamilton 2026 — Free Festival Guide",
    description: "Dates, times, lineup, parking, family activities and everything to know before Gage Park.",
    images: ["/brand/banner.png"],
  },
};

const QUICK_FACTS = [
  { label: "Dates", value: SITE.dates, icon: "🗓️" },
  { label: "Location", value: "Gage Park, Hamilton", icon: "📍" },
  { label: "Admission", value: "Free · No ticket required", icon: "🎟️" },
  { label: "Who can come", value: "Everyone · All ages", icon: "💛" },
];

export default function FestivalGuidePage() {
  const pageJsonLd = webPageJsonLd({
    path: FESTIVAL_GUIDE_PATH,
    name: "Jesus Festival Hamilton 2026 — Complete Festival Guide",
    description: metadata.description as string,
    about: { "@id": `${SITE.url}/#festival-2026` },
  });
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: "Hamilton 2026 Festival Guide", path: FESTIVAL_GUIDE_PATH },
  ]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([FESTIVAL_EVENT_JSONLD, pageJsonLd, breadcrumbs]) }}
      />

      <header className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src={IMG.heroCrowd}
          alt="A crowd worshipping together at Jesus Festival in Gage Park, Hamilton"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/50 via-ink/70 to-ink" />
        <div className="mx-auto flex min-h-[570px] max-w-4xl flex-col justify-end px-5 pb-14 pt-24 text-center sm:px-8">
          <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
            <Link href="/" className="hover:text-gold-400">Jesus Festival</Link>
            <span className="px-2">/</span>
            <span aria-current="page">Hamilton 2026 Guide</span>
          </nav>
          <p className="mt-6 text-[12px] font-extrabold uppercase tracking-[0.24em] text-gold-400">The official 2026 guide</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[0.98] sm:text-6xl">
            Jesus Festival <span className="text-gradient-gold">Hamilton 2026</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80 sm:text-xl">
            A completely free, all-ages weekend of worship, the Gospel, baptisms, family fun and citywide unity at Gage Park.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/schedule" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">
              View the full schedule
            </Link>
            <a href={LINKS.directions} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/20 bg-ink/55 px-6 py-3.5 text-sm font-bold text-white backdrop-blur">
              Get directions
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <section aria-labelledby="quick-facts" className="-mt-7 relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <h2 id="quick-facts" className="sr-only">Jesus Festival quick facts</h2>
          {QUICK_FACTS.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-white/10 bg-navy-900/95 p-4 shadow-card backdrop-blur">
              <span className="text-xl" aria-hidden>{fact.icon}</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">{fact.label}</p>
              <p className="mt-1 text-sm font-bold text-white">{fact.value}</p>
            </div>
          ))}
        </section>

        <div className="mx-auto mt-8 max-w-xl">
          <FestivalWeekendPass compact />
        </div>

        <section className="mt-16" aria-labelledby="weekend-heading">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Two powerful days</p>
          <h2 id="weekend-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">The shape of the weekend</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {SCHEDULE.days.map((day) => (
              <article key={day.id} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-purple-300">{day.label} · {day.date}</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-white">{day.theme}</h3>
                <p className="mt-1 font-bold text-gold-400">{day.window}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-white/65">{day.blurb}</p>
                <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-[13px] text-white/70">
                  {day.items.filter((_, index) => index < 4).map((item) => (
                    <li key={`${day.id}-${item.time}-${item.title}`} className="flex gap-3">
                      <time className="w-20 shrink-0 font-bold text-white">{item.time}</time>
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Link href="/schedule" className="mt-5 inline-flex text-sm font-bold text-gold-400 hover:text-gold-300">See every set and speaker →</Link>
        </section>

        <section className="mt-16" aria-labelledby="lineup-heading">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Worship & voices</p>
          <h2 id="lineup-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Jesus Festival 2026 lineup</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {ARTISTS.map((artist) => (
              <article key={artist.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-purple-300">{artist.role}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-white">{artist.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">{artist.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="expect-heading">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Come and see</p>
          <h2 id="expect-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">What to expect at Gage Park</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXPECT.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-[1.15fr_.85fr]" aria-labelledby="visit-heading">
          <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Plan your visit</p>
            <h2 id="visit-heading" className="mt-2 font-display text-3xl font-extrabold">Getting to Gage Park</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Gage Park is at <strong className="text-white">1000 Main Street East, Hamilton, Ontario</strong>. Free on-site festival parking fills quickly, so come early. Street parking and HSR stops are nearby; rideshare, carpooling, cycling and walking are excellent options.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/map" className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-navy-950">Map & arrival guide</Link>
              <a href={LINKS.directions} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white">Open Google Maps</a>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
            <h2 className="font-display text-2xl font-bold">Bring with you</h2>
            <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-white/65">
              <li>✓ Lawn chair or picnic blanket</li>
              <li>✓ Sunscreen, hat and water bottle</li>
              <li>✓ A layer for Friday evening</li>
              <li>✓ Comfortable shoes</li>
              <li>✓ Your family, church and neighbours</li>
            </ul>
          </aside>
        </section>

        <section className="mt-16" aria-labelledby="answers-heading">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Fast answers</p>
          <h2 id="answers-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Before you come</h2>
          <div className="mt-7 space-y-3">
            {FESTIVAL_FAQS.slice(0, 5).map((item) => (
              <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/30">
                <summary className="cursor-pointer list-none pr-6 font-display text-[17px] font-bold text-white">{item.question}</summary>
                <p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="mt-5 inline-flex text-sm font-bold text-gold-400 hover:text-gold-300">Read every festival answer →</Link>
        </section>

        <section className="mt-16 rounded-[2rem] border border-purple-400/25 bg-gradient-to-br from-purple-700/25 via-navy-900 to-gold/10 p-8 text-center sm:p-10">
          <Image src="/brand/logo-mark-white.png" alt="Jesus Festival" width={110} height={56} className="mx-auto h-auto w-24" />
          <h2 className="mt-5 font-display text-3xl font-extrabold">Carry the whole weekend in your pocket</h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
            Open the official app for your personal lineup, live updates, notifications, the Prayer Wall, festival map and offline essentials.
          </p>
          <Link href="/install" className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Install Jesus Festival App</Link>
        </section>
      </div>
    </main>
  );
}
