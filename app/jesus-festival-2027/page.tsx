import type { Metadata } from "next";
import Link from "next/link";
import NotifyForm from "@/components/NotifyForm";
import { SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";
import { ArrowRight } from "@/components/icons";

/**
 * The page for everyone searching "when is the next Jesus Festival?".
 *
 * Nothing about 2027 has been announced, so this page must never guess. Every
 * fact here is one already published elsewhere in the app: the three festivals
 * so far, where they happen, that they're free. When the team confirms 2027,
 * change NEXT_FESTIVAL below and the answers, schema and copy follow.
 */

const PATH = "/jesus-festival-2027";

/** Flip `announced` and fill in the dates the day they're confirmed. */
const NEXT_FESTIVAL = {
  year: 2027,
  announced: false as boolean,
  dates: "", // e.g. "September 3–4, 2027"
};

const TITLE = "Jesus Festival 2027: Dates, Updates & How to Know First";
const DESCRIPTION =
  "When is Jesus Festival 2027 in Hamilton? Dates aren't announced yet. See what we know, the story so far, and get told the moment 2027 is confirmed.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: "Jesus Festival returns to Hamilton. Be the first to know when 2027 is announced.",
    url: PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Be the first to know when Jesus Festival 2027 is announced.",
    images: ["/brand/banner.png"],
  },
};

const WHEN_ANSWER = NEXT_FESTIVAL.announced
  ? `Jesus Festival ${NEXT_FESTIVAL.year} is ${NEXT_FESTIVAL.dates} at Gage Park in Hamilton, Ontario.`
  : `Dates for Jesus Festival ${NEXT_FESTIVAL.year} have not been announced yet. The festival has been held every year since 2024 — most recently Friday and Saturday, September 4–5, 2026, at Gage Park in Hamilton. Sign up on this page to be told as soon as the ${NEXT_FESTIVAL.year} dates are confirmed.`;

// The card's headline already says "not announced", so the visible follow-up
// skips that sentence. The FAQ keeps the whole thing: answer engines quote an
// answer standalone, and it has to make sense without the headline above it.
const WHEN_DETAIL = NEXT_FESTIVAL.announced
  ? WHEN_ANSWER
  : `The festival has been held every year since 2024 — most recently Friday and Saturday, September 4–5, 2026, at Gage Park in Hamilton. Sign up below to be told as soon as the ${NEXT_FESTIVAL.year} dates are confirmed.`;

const FAQS = [
  { question: `When is Jesus Festival ${NEXT_FESTIVAL.year}?`, answer: WHEN_ANSWER },
  {
    question: "Where is Jesus Festival held?",
    answer:
      "Every Jesus Festival so far has been held at Gage Park, 1000 Main St E in Hamilton, Ontario. The venue for 2027 will be confirmed alongside the dates.",
  },
  {
    question: "Is Jesus Festival free?",
    answer:
      "Yes. Jesus Festival has always been free to attend, for all ages — worship, the Gospel, family activities and community, with no ticket required.",
  },
  {
    question: "How many times has Jesus Festival happened?",
    answer:
      "Three. The first Jesus Festival was in 2024, it returned in 2025, and the third was held September 4–5, 2026. The festival team reported 70+ salvations and 50+ baptisms from the 2026 weekend in its early post-event report.",
  },
  {
    question: "How do I find out when the next Jesus Festival is announced?",
    answer:
      "Join the updates list on this page, install the Jesus Festival app, or follow Jesus Festival on Instagram (@jesusfestival.ca) and Facebook. Dates, artists and volunteer openings are shared there first.",
  },
  {
    question: "Can I volunteer, sponsor or bring a vendor booth next year?",
    answer:
      "Yes — volunteers, vendors, sponsors and partner churches make the festival possible. Opportunities for the next festival are shared with the updates list first, and you can reach the team any time at hello@jesusfestival.ca.",
  },
];

const STORY = [
  { year: "2024", title: "The first yes", text: "Jesus Festival began in Hamilton — worship, Gospel hope, and a city gathering around the name of Jesus." },
  { year: "2025", title: "The fruit multiplied", text: "It returned with growing unity, baptisms, outreach, family joy, and testimonies pointing to Jesus." },
  { year: "2026", title: "A record weekend", text: "September 4–5 at Gage Park: early reports of 70+ salvations, 50+ baptisms, and a record turnout." },
  { year: String(NEXT_FESTIVAL.year), title: "The next chapter", text: NEXT_FESTIVAL.announced ? NEXT_FESTIVAL.dates : "Dates coming soon. Be the first to know." },
];

export default function JesusFestival2027Page() {
  const pageJsonLd = {
    ...webPageJsonLd({ path: PATH, name: TITLE, description: DESCRIPTION }),
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".next-festival-answer", ".next-festival-faqs"] },
  };
  // The series node is defined right here, so every reference to it resolves
  // on this page. Only the one festival with confirmed dates is a subEvent.
  const seriesJsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "@id": `${SITE.url}${PATH}#series`,
    name: "Jesus Festival Hamilton",
    description: "A free annual festival of worship, the Gospel, baptisms and community at Gage Park in Hamilton, Ontario, held every year since 2024.",
    url: `${SITE.url}${PATH}`,
    organizer: { "@id": `${SITE.url}/#organization` },
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: "Gage Park",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1000 Main St E",
        addressLocality: "Hamilton",
        addressRegion: "ON",
        postalCode: "L8M 1N2",
        addressCountry: "CA",
      },
    },
    subEvent: [
      {
        "@type": "Event",
        name: "Jesus Festival Hamilton 2026",
        startDate: "2026-09-04T18:00:00-04:00",
        endDate: "2026-09-05T19:00:00-04:00",
        eventStatus: "https://schema.org/EventCompleted",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: "Gage Park", address: "1000 Main St E, Hamilton, ON L8M 1N2, Canada" },
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: `Jesus Festival ${NEXT_FESTIVAL.year}`, path: PATH },
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-20 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([pageJsonLd, seriesJsonLd, faqJsonLd, breadcrumbs]) }}
      />

      <nav aria-label="Breadcrumb" className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">
        <Link href="/" className="hover:text-gold-400">Festival</Link>
        <span className="px-2">/</span>
        <span className="text-white/80">{NEXT_FESTIVAL.year}</span>
      </nav>

      <header className="mt-8 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-gold-400">
          Hamilton · Gage Park · Free
        </p>
        <h1 className="mt-3 font-display text-[40px] font-extrabold leading-[1.02] text-white">
          Jesus Festival
          <br />
          <span className="text-gradient-gold">{NEXT_FESTIVAL.year}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
          Three years in, the same fire: a whole city in a park, worshipping Jesus together. The
          next chapter is coming — and you can be the first to know.
        </p>
      </header>

      {/* The direct answer, first, for people and for answer engines alike. */}
      <section
        aria-labelledby="when-heading"
        className="next-festival-answer mt-8 rounded-3xl border border-gold/35 bg-gradient-to-br from-gold/12 via-purple-900/25 to-transparent p-5"
      >
        <h2 id="when-heading" className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
          When is Jesus Festival {NEXT_FESTIVAL.year}?
        </h2>
        <p className="mt-2 font-display text-[22px] font-extrabold leading-snug text-white">
          {NEXT_FESTIVAL.announced ? NEXT_FESTIVAL.dates : "Dates haven't been announced yet."}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{WHEN_DETAIL}</p>
      </section>

      {/* NotifyForm is its own card with its own "Be the first to know"
          heading — wrapping it in another card doubled both. */}
      <section aria-label="Get told when 2027 is announced" className="mt-8">
        <p className="mb-3 px-1 text-center text-[13.5px] leading-relaxed text-white/65">
          Dates, the first artists and volunteer openings go to this list before anywhere else —
          just the news that matters, a handful of times a year.
        </p>
        <NotifyForm />
      </section>

      <section aria-labelledby="story-heading" className="mt-10">
        <h2 id="story-heading" className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
          The story so far
        </h2>
        <ol className="mt-4 space-y-0">
          {STORY.map((s, i) => {
            const next = i === STORY.length - 1;
            return (
              <li key={s.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[11px] font-black ${
                      next ? "border-2 border-dashed border-gold/70 text-gold-400" : "bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950"
                    }`}
                  >
                    {s.year.slice(2)}
                  </span>
                  {!next && <span className="w-px flex-1 bg-white/15" />}
                </div>
                <div className="pb-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">{s.year}</p>
                  <h3 className="font-display text-lg font-extrabold text-white">{s.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-white/65">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="meantime-heading" className="mt-6">
        <h2 id="meantime-heading" className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
          Until then
        </h2>
        <div className="mt-3 grid gap-2.5">
          {[
            { href: "/blog/jesus-festival-hamilton-2026-recap", emoji: "🔥", title: "Read the 2026 recap", sub: "70+ salvations, 50+ baptisms, and the stories behind them" },
            { href: "/i-said-yes", emoji: "🕊️", title: "Said yes to Jesus?", sub: "Seven practical first steps, prayer and baptism" },
            { href: "/photos", emoji: "📸", title: "Relive the weekend", sub: "Photos and testimonies from Gage Park" },
            { href: "/movement", emoji: "🌍", title: "Join the year-round mission", sub: "The festival is one weekend. The movement is every day." },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40 active:scale-[0.99]"
            >
              <span className="text-2xl" aria-hidden>{l.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[14px] font-extrabold text-white">{l.title}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-white/60">{l.sub}</span>
              </span>
              <ArrowRight width={16} height={16} className="shrink-0 text-gold-400" />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="next-festival-faqs mt-10">
        <h2 id="faq-heading" className="font-display text-xl font-extrabold text-white">
          Questions about Jesus Festival {NEXT_FESTIVAL.year}
        </h2>
        <div className="mt-4 space-y-2.5">
          {FAQS.map((f) => (
            <details key={f.question} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <summary className="cursor-pointer list-none font-display text-[14.5px] font-bold text-white">
                {f.question}
              </summary>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center font-display text-[15px] italic leading-relaxed text-white/75">
        &ldquo;Let us not become weary in doing good, for at the proper time we will reap a harvest
        if we do not give up.&rdquo;
        <span className="mt-1 block text-[11px] font-bold uppercase not-italic tracking-[0.2em] text-gold-400">
          Galatians 6:9
        </span>
      </p>
    </main>
  );
}
