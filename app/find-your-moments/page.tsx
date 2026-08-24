import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FestivalMomentFinder from "@/components/FestivalMomentFinder";
import { IMG, SITE } from "@/lib/content";
import { breadcrumbJsonLd, FESTIVAL_EVENT_JSONLD, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/find-your-moments";

export const metadata: Metadata = {
  title: "Jesus Festival 2026 Lineup Matcher & Schedule Planner",
  description:
    "Find your best Jesus Festival Hamilton 2026 moments by who you are coming with, what you want to experience and when you can attend—then save them to My Lineup.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Find Your Jesus Festival Moments",
    description: "Turn the confirmed 2026 schedule into a personal festival shortlist in 30 seconds.",
    url: PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival 2026 Lineup Matcher",
    description: "Choose your people, your vibe and your available time. Get your best-fit festival moments instantly.",
    images: ["/brand/banner.png"],
  },
};

const FAQS = [
  {
    question: "Who is performing at Jesus Festival Hamilton 2026?",
    answer:
      "Bethel Gospel Tabernacle leads Friday's Pure Worship Night. Saturday's confirmed worship and music lineup includes Open Heaven, ACTS Kingdom Sound Worship, Christian hip-hop artist Ant Lee Jr. and Friday Night Prayer, alongside speakers, testimonies, prayer and united moments.",
  },
  {
    question: "What are the best Jesus Festival moments for worship?",
    answer:
      "For focused worship, begin with Bethel Gospel Tabernacle on Friday from 6:30–9:00 PM. Saturday includes Open Heaven at 11:50 AM and 1:00 PM, ACTS Kingdom Sound Worship at 1:40 PM and 2:30 PM, and Friday Night Prayer at 4:40 PM and 5:30 PM.",
  },
  {
    question: "When is Ant Lee Jr. performing at Jesus Festival 2026?",
    answer:
      "Ant Lee Jr. performs two Christian hip-hop sets on Saturday, September 5: Set 1 at 3:10 PM and Set 2 at 4:00 PM. His testimony is scheduled between them at 3:40 PM. Festival stage times are approximate and may shift slightly.",
  },
  {
    question: "Which part of Jesus Festival is best for families?",
    answer:
      "Saturday is the Family Festival Day from 10:00 AM–6:00 PM, with live music, speakers, food trucks, vendors, a Kids Zone, bouncy castles and games. Families can come and go freely, so a shorter window built around meals, naps and one or two must-see moments is completely valid.",
  },
  {
    question: "What should a first-time visitor see?",
    answer:
      "A balanced first visit could include Friday worship with Bethel, Saturday's 10:00 AM opening, an Open Heaven set, Ant Lee Jr. and the 5:50 PM closing prayer. The lineup matcher creates a shorter recommendation based on the time you actually have.",
  },
  {
    question: "Can I save my recommended festival moments?",
    answer:
      "Yes. Add every recommendation to My Lineup in one tap. Saved moments remain on your device, appear inside the schedule and can be exported to a calendar with 15-minute reminders. No account is required.",
  },
  {
    question: "How does the Jesus Festival lineup matcher choose recommendations?",
    answer:
      "It scores the confirmed schedule against three choices: who you are attending with, whether you want worship, live music, stories or variety, and which festival window you can attend. It also avoids filling the shortlist with duplicate sets from the same artist when another strong match is available.",
  },
  {
    question: "Are Jesus Festival schedule times guaranteed?",
    answer:
      "The published run of show is the best current plan, but stage times are approximate and may shift slightly during a live outdoor event. Check the app's Schedule and News screens on festival day for the latest information.",
  },
  {
    question: "Does the lineup matcher collect personal information?",
    answer:
      "No. Your choices and starred moments are stored on your device. A shared match link contains only the selected audience, experience type and time window—no name, email address, account or private profile.",
  },
] as const;

const SOURCES = [
  { name: "Jesus Festival — Official Hamilton 2026 Information and Artists", url: "https://www.jesusfestival.ca/" },
  { name: "Jesus Festival App — Complete 2026 Schedule", url: `${SITE.url}/schedule` },
] as const;

const ARTIST_GUIDE = [
  {
    name: "Bethel Gospel Tabernacle",
    when: "Friday · 6:30–9:00 PM",
    tag: "Focused worship night",
    text: "Friday strips the weekend back to worship, prayer and the presence of God under the open sky. Arrive around 6:00 PM to choose a lawn spot before the set begins.",
  },
  {
    name: "Open Heaven",
    when: "Saturday · 11:50 AM + 1:00 PM",
    tag: "Canadian worship ministry",
    text: "Two Saturday sets make Open Heaven an easy anchor for families, first-time visitors and anyone building a worship-forward afternoon.",
  },
  {
    name: "ACTS Kingdom Sound Worship",
    when: "Saturday · 1:40 PM + 2:30 PM",
    tag: "Hamilton-rooted worship",
    text: "Two prophetic-worship sets sit in the heart of Saturday's run of show, surrounded by testimonies and Gospel-centered speakers.",
  },
  {
    name: "Ant Lee Jr.",
    when: "Saturday · 3:10 PM + 4:00 PM",
    tag: "Christian hip-hop",
    text: "Ant Lee Jr. brings music, joy and purpose in two sets, with his personal testimony scheduled at 3:40 PM between them.",
  },
  {
    name: "Friday Night Prayer",
    when: "Saturday · 4:40 PM + 5:30 PM",
    tag: "Worship and prayer",
    text: "The final featured worship voice of Saturday leads toward the closing prayer and festival send-off at 5:50 PM.",
  },
] as const;

export default function FindYourMomentsPage() {
  const pageJsonLd = {
    ...webPageJsonLd({
      path: PATH,
      name: "Jesus Festival 2026 Lineup Matcher and Schedule Planner",
      description: metadata.description as string,
      about: { "@id": `${SITE.url}/#festival-2026` },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", ".moments-answer-summary", ".moments-faqs"],
    },
    citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}${PATH}#faq`,
    mainEntity: FAQS.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE.url}${PATH}#how-to`,
    name: "How to build your Jesus Festival 2026 lineup",
    description: "Use the free lineup matcher to create and save a personalized Jesus Festival shortlist.",
    inLanguage: "en-CA",
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "CAD", value: "0" },
    step: [
      "Choose whether you are attending for the first time, with family, with a youth crew or with a church crew.",
      "Choose worship, live music, stories and faith, or the best variety.",
      "Choose both days, Friday night, Saturday, or Saturday afternoon.",
      "Review the best-fit moments and add them to My Lineup in one tap.",
      "Open My Lineup to share individual moments or export calendar reminders.",
    ].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text, url: `${SITE.url}${PATH}#moment-finder` })),
  };
  const artistListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.url}${PATH}#confirmed-artists`,
    name: "Confirmed Jesus Festival Hamilton 2026 worship and music lineup",
    numberOfItems: ARTIST_GUIDE.length,
    itemListElement: ARTIST_GUIDE.map((artist, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "PerformingGroup", name: artist.name, description: `${artist.when}. ${artist.text}` },
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: "Find Your Moments", path: PATH },
  ]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([FESTIVAL_EVENT_JSONLD, pageJsonLd, faqJsonLd, howToJsonLd, artistListJsonLd, breadcrumbs]) }} />
      <article>
        <header className="relative isolate overflow-hidden border-b border-white/10">
          <Image src={IMG.worshipDusk} alt="Jesus Festival worship at dusk in Gage Park, Hamilton" fill preload sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/45 via-purple-950/70 to-ink" />
          <div className="mx-auto flex min-h-[590px] max-w-5xl flex-col justify-end px-5 pb-16 pt-24 text-center sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70"><Link href="/" className="hover:text-gold-400">Jesus Festival</Link><span className="px-2">/</span><span aria-current="page">Find Your Moments</span></nav>
            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">The confirmed 2026 lineup · personalized</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.98] sm:text-6xl">Twenty moments. <span className="text-gradient-gold">Find yours.</span></h1>
            <p className="moments-answer-summary mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80 sm:text-xl">Tell us who you are coming with, what you want to experience and when you can be there. Get a personal festival shortlist in 30 seconds.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3"><a href="#moment-finder" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Find my moments</a><Link href="/schedule" className="rounded-2xl border border-white/20 bg-ink/45 px-6 py-3.5 text-sm font-bold text-white backdrop-blur">See every set time</Link></div>
            <p className="mt-5 text-[11px] text-white/55">Free · Private · No account · Saves into My Lineup</p>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <section className="relative z-10 -mt-7 grid gap-3 sm:grid-cols-4" aria-label="Lineup matcher benefits">
            {[["30 sec", "to get matched"], ["20", "Saturday moments"], ["5", "confirmed music voices"], ["1 tap", "to save them all"]].map(([value, label]) => <div key={value} className="rounded-2xl border border-white/10 bg-navy-950/95 p-4 text-center shadow-card backdrop-blur"><p className="font-display text-2xl font-extrabold text-gold-300">{value}</p><p className="mt-0.5 text-[11px] font-semibold text-white/55">{label}</p></div>)}
          </section>

          <div className="mt-10"><FestivalMomentFinder /></div>

          <section id="confirmed-artists" className="render-later mt-16 scroll-mt-8" aria-labelledby="artist-guide-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Confirmed worship and music lineup</p>
            <h2 id="artist-guide-heading" className="mt-2 max-w-3xl font-display text-3xl font-extrabold sm:text-4xl">Five voices. One name lifted high.</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">Friday is a single focused worship night. Saturday moves through worship, testimony, Christian hip-hop, speakers and prayer from morning to close.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {ARTIST_GUIDE.map((artist, index) => <article key={artist.name} className={`rounded-3xl border p-6 ${index === 0 ? "border-gold/35 bg-gradient-to-br from-gold/12 to-transparent md:col-span-2" : "border-white/10 bg-white/[0.035]"}`}><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-purple-200">{artist.tag}</p><h3 className="mt-2 font-display text-2xl font-extrabold text-white">{artist.name}</h3><p className="mt-1 text-[12px] font-extrabold text-gold-400">{artist.when}</p><p className="mt-3 text-[13.5px] leading-relaxed text-white/65">{artist.text}</p></article>)}
            </div>
          </section>

          <section className="render-later mt-16" aria-labelledby="time-plan-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">Build around the time you really have</p>
            <h2 id="time-plan-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">There is no wrong-sized visit</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                ["1 hour", "Choose one anchor", "Arrive 20–30 minutes before one must-see set. Enjoy it fully, walk the park and leave without treating a shorter visit like a failure."],
                ["3 hours", "Choose a festival arc", "Pair one worship set, one story or speaker, and one different musical voice. Leave room for food, Vendor Row and the Kids Zone."],
                ["Both days", "Feel the whole shape", "Let Friday be focused worship. Return Saturday for the breadth of music, stories, family experiences, prayer and citywide community."],
              ].map(([time, title, text]) => <article key={time} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><p className="font-display text-xl font-extrabold text-emerald-200">{time}</p><h3 className="mt-2 font-display text-lg font-extrabold text-white">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-white/60">{text}</p></article>)}
            </div>
          </section>

          <section className="render-later mt-16 overflow-hidden rounded-[2rem] border border-purple-300/20 bg-gradient-to-br from-purple-600/[0.12] via-navy-900 to-transparent p-6 sm:p-8" aria-labelledby="honest-match-heading">
            <div className="grid gap-7 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200">Transparent by design</p><h2 id="honest-match-heading" className="mt-2 font-display text-3xl font-extrabold">A recommendation, not a hidden algorithm</h2><p className="mt-4 text-[14px] leading-relaxed text-white/65">The matcher reads only the three buttons you choose. It scores the published schedule for audience fit, experience type and available time, favours variety across performers, and shows why each moment was selected. Nothing is uploaded and there is no sponsored placement.</p></div>
              <div className="rounded-3xl border border-white/10 bg-black/15 p-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-400">What stays on your phone</p><ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/65"><li>• Your three match choices</li><li>• Your starred My Lineup moments</li><li>• Your personal calendar export</li><li>• No name, email or account</li></ul></div>
            </div>
          </section>

          <section className="moments-faqs render-later mt-16" aria-labelledby="moments-faq-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Fast lineup answers</p>
            <h2 id="moments-faq-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Jesus Festival 2026 schedule questions</h2>
            <div className="mt-7 space-y-3">{FAQS.map((item) => <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/30"><summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold text-white">{item.question}</summary><p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p></details>)}</div>
          </section>

          <section className="render-later mt-14 border-t border-white/10 pt-8" aria-labelledby="moments-sources-heading"><h2 id="moments-sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Current authoritative sources</h2><p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-white/45">Artist and schedule information was reviewed August 24, 2026. The app Schedule and official festival updates should be checked again on festival day.</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{SOURCES.map((source) => <li key={source.url}><a href={source.url} target={source.url.startsWith(SITE.url) ? undefined : "_blank"} rel={source.url.startsWith(SITE.url) ? undefined : "noopener noreferrer"} className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-relaxed text-gold-400 hover:border-gold/30">{source.name} ↗</a></li>)}</ul></section>

          <section className="render-later mt-16 rounded-[2rem] border border-gold/25 bg-gradient-to-br from-purple-700/25 via-navy-900 to-gold/10 p-8 text-center sm:p-10"><p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Your weekend does not need to look like anyone else&apos;s</p><h2 className="mt-3 font-display text-3xl font-extrabold">Find the moments you will carry home.</h2><p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-white/65">Jesus Festival Hamilton is free, all ages and open to everyone at Gage Park, September 4–5, 2026.</p><a href="#moment-finder" className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Build my festival match</a></section>
        </div>
      </article>
    </main>
  );
}
