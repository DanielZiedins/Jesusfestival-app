import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GageParkArrivalPlanner from "@/components/GageParkArrivalPlanner";
import { IMG, SITE } from "@/lib/content";
import { breadcrumbJsonLd, FESTIVAL_EVENT_JSONLD, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/getting-to-gage-park";
const LAST_REVIEWED = "2026-08-26";

export const metadata: Metadata = {
  title: "Getting to Gage Park for Jesus Festival 2026",
  description:
    "Plan your Jesus Festival arrival at Gage Park with current Hamilton road and HSR detours, parking facts, live directions and a personalized leave-by time.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Get to Jesus Festival at Gage Park Without the Guesswork",
    description: "Current Hamilton construction guidance, parking and HSR facts, plus a private personalized arrival planner.",
    url: PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026 at Gage Park" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Getting to Gage Park for Jesus Festival 2026",
    description: "Build a leave-by time for driving, HSR, rideshare, cycling or walking.",
    images: ["/brand/banner.png"],
  },
};

const SOURCES = [
  { name: "City of Hamilton — Main & Ottawa Construction", url: "https://www.hamilton.ca/city-council/news-notices/news-releases/bus-news-fall-2026" },
  { name: "City of Hamilton — Current HSR Schedules and Detours", url: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/schedules-detours" },
  { name: "City of Hamilton — Gage Park Event Location", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
  { name: "City of Hamilton — Current HSR Fares", url: "https://www.hamilton.ca/home-neighbourhood/hsr/fares/fares-photo-ids" },
  { name: "City of Hamilton — Bike Parking and Fix-It Stations", url: "https://www.hamilton.ca/home-neighbourhood/getting-around/biking-cyclists/bike-parking" },
] as const;

const FAQS = [
  {
    question: "Where is Jesus Festival Hamilton 2026?",
    answer: "Jesus Festival takes place at Gage Park, 1000 Main Street East, Hamilton, Ontario, L8M 1N2. Friday is September 4 from 6:00–9:00 PM. Saturday is September 5 from 10:00 AM–7:00 PM, with the stage program from 11:00 AM–7:00 PM.",
  },
  {
    question: "Is there parking at Gage Park for Jesus Festival?",
    answer: "The City of Hamilton lists 150 parking spaces at Gage Park. Festival demand can exceed that number, so parking is limited and a space is not guaranteed. Arrive early, carpool when possible, follow posted restrictions, and use final event signs and volunteer direction.",
  },
  {
    question: "Are there road closures near Gage Park in September 2026?",
    answer: "Yes. The City says the Main Street East and Ottawa Street North intersection fully closed on August 17, 2026 for approximately four months. That intersection is west of Gage Park and can affect driving and HSR trips. Allow extra time and check the City's current closure page before leaving.",
  },
  {
    question: "Can I take HSR to Jesus Festival at Gage Park?",
    answer: "Yes. HSR serves the Gage Park area. The active Main and Ottawa closure detours Routes 1/1A King, 10 B-Line Express and 41 Mohawk, with temporary stops in the area. Use current City schedules or a live navigation app on festival day because stops and times can change.",
  },
  {
    question: "How much is HSR in 2026?",
    answer: "The City currently lists a $3.75 cash or contactless adult fare and a $2.85 adult PRESTO fare. Children ages 6–12 ride free with a valid PRESTO card, and children five and under ride free with a paying customer. Check the official fare page before travelling.",
  },
  {
    question: "Can I bike to Gage Park?",
    answer: "Yes. Cycling can avoid parking pressure. The City lists a public bike repair station at Gage Park's Cumberland Avenue entrance. Bring a strong lock, use only approved bike parking, and do not block walkways or accessible routes.",
  },
  {
    question: "Where should a rideshare pick me up after the festival?",
    answer: "Choose a well-lit public location away from the most congested park entrance, send the exact location to your driver and group, and follow event-day signs. The app's park map can save and share a meeting spot, but final signs and staff direction take priority.",
  },
  {
    question: "What time should I leave for Jesus Festival?",
    answer: "Start with your normal travel time, then add time for the active construction area, parking or a changed transit stop, walking into the park and settling in. The arrival planner calculates a personalized leave-by time based on travel method, target arrival and group pace.",
  },
  {
    question: "Is accessible parking or an accessible drop-off confirmed?",
    answer: "The City confirms permanent Gage Park facilities, but the final festival-day accessible parking and drop-off layout is not yet confirmed in the public information reviewed for this guide. If the exact arrangement is essential, email hello@jesusfestival.ca before travelling.",
  },
] as const;

const MODES = [
  { emoji: "🚗", title: "Driving or carpooling", label: "Most flexible, least predictable parking", text: "The City lists 150 park spaces, not 150 festival-reserved spaces. Build in the walk from wherever you legally park and never count on the closest lot.", action: "Open driving directions", href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}&travelmode=driving` },
  { emoji: "🚌", title: "HSR transit", label: "No parking search, active route detours", text: "Routes 1/1A, 10 and 41 are affected by the Main & Ottawa closure. Current City information shows temporary stops, including Gage at Main for part of the detour plan.", action: "Check current HSR detours", href: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/schedules-detours" },
  { emoji: "📍", title: "Rideshare or taxi", label: "Simple arrival, coordinate the pickup", text: "Pick one public, well-lit meeting location before the event. After the closing prayer, walk a short distance from the busiest entrance before requesting the ride if conditions allow.", action: "Open Gage Park map", href: "/map" },
  { emoji: "🚲", title: "Cycling or walking", label: "Avoid parking pressure entirely", text: "The City lists a bike repair station at the Cumberland Avenue entrance. Bring a lock, lights for the return trip and a weather layer for Friday evening.", action: "Open cycling directions", href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}&travelmode=bicycling` },
] as const;

export default function GettingToGageParkPage() {
  const pageJsonLd = {
    ...webPageJsonLd({ path: PATH, name: "Getting to Gage Park for Jesus Festival 2026", description: metadata.description as string, about: { "@id": `${SITE.url}/#gage-park` } }),
    dateModified: LAST_REVIEWED,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["article h1", ".arrival-answer-summary", ".arrival-alert", ".arrival-faqs"] },
    citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage", "@id": `${SITE.url}${PATH}#faq`,
    mainEntity: FAQS.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  const howToJsonLd = {
    "@context": "https://schema.org", "@type": "HowTo", "@id": `${SITE.url}${PATH}#how-to`,
    name: "How to plan your Jesus Festival arrival at Gage Park", description: "Build a realistic departure and arrival plan for Jesus Festival Hamilton 2026.", inLanguage: "en-CA", totalTime: "PT3M",
    step: [
      "Choose whether you are driving, taking HSR, using rideshare, cycling or walking.",
      "Choose the festival opening or moment you want to arrive for.",
      "Enter your normal travel-time estimate.",
      "Choose a simple, family or lower-stress arrival pace.",
      "Save the calculated departure reminder and check live conditions before leaving.",
    ].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text, url: `${SITE.url}${PATH}#arrival-planner` })),
  };
  const breadcrumbs = breadcrumbJsonLd([{ name: "Jesus Festival", path: "/" }, { name: "Getting to Gage Park", path: PATH }]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([FESTIVAL_EVENT_JSONLD, pageJsonLd, faqJsonLd, howToJsonLd, breadcrumbs]) }} />
      <article>
        <header className="relative isolate overflow-hidden border-b border-white/10">
          <Image src={IMG.heroCrowd} alt="Jesus Festival crowd gathered outdoors at Gage Park in Hamilton" fill preload sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/40 via-emerald-950/75 to-ink" />
          <div className="mx-auto flex min-h-[590px] max-w-5xl flex-col justify-end px-5 pb-16 pt-24 text-center sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70"><Link href="/" className="hover:text-gold-400">Jesus Festival</Link><span className="px-2">/</span><span aria-current="page">Getting to Gage Park</span></nav>
            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-emerald-200">Hamilton 2026 arrival guide</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.98] sm:text-6xl">Get to Gage Park <span className="text-gradient-gold">without the guesswork.</span></h1>
            <p className="arrival-answer-summary mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80 sm:text-xl">Current construction and transit guidance, honest parking facts, live map links—and a personal leave-by time for your festival plan.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3"><a href="#arrival-planner" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Calculate when to leave</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/20 bg-ink/45 px-6 py-3.5 text-sm font-bold text-white backdrop-blur">Open live directions</a></div>
            <p className="mt-5 text-[11px] text-white/55">Reviewed August 26, 2026 · Official City sources linked below</p>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <section className="arrival-alert relative z-10 -mt-7 rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/15 via-navy-950 to-purple-950 p-5 shadow-card sm:p-6" aria-labelledby="construction-alert-heading">
            <div className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-300/15 text-2xl" aria-hidden>🚧</span><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-300">Important for September 4–5</p><h2 id="construction-alert-heading" className="mt-1 font-display text-xl font-extrabold">Main &amp; Ottawa is fully closed</h2><p className="mt-2 text-[13.5px] leading-relaxed text-white/70">The City says the intersection west of Gage Park closed August 17 for approximately four months. Driving delays are expected, and HSR Routes 1/1A, 10 and 41 are detoured. Add time and check the live City information before leaving.</p><a href="https://www.hamilton.ca/city-council/news-notices/news-releases/bus-news-fall-2026" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-[12px] font-extrabold text-gold-400 hover:text-gold-300">Read the official City update ↗</a></div></div>
          </section>

          <div className="mt-10"><GageParkArrivalPlanner /></div>

          <section className="render-later mt-16" aria-labelledby="travel-options-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Choose the tradeoff that fits</p>
            <h2 id="travel-options-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Five ways in. One clear destination.</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">Gage Park is at 1000 Main Street East. No travel mode is best for everyone; the useful choice is the one your group can execute calmly on the return trip too.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">{MODES.map((mode) => <article key={mode.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><span className="text-3xl" aria-hidden>{mode.emoji}</span><h3 className="mt-3 font-display text-2xl font-extrabold">{mode.title}</h3><p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.13em] text-emerald-200">{mode.label}</p><p className="mt-3 text-[13.5px] leading-relaxed text-white/65">{mode.text}</p>{mode.href.startsWith("/") ? <Link href={mode.href} className="mt-5 inline-flex text-[12px] font-extrabold text-gold-400">{mode.action} →</Link> : <a href={mode.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-[12px] font-extrabold text-gold-400">{mode.action} ↗</a>}</article>)}</div>
          </section>

          <section className="render-later mt-16 grid gap-4 md:grid-cols-3" aria-labelledby="before-leaving-heading">
            <div className="md:col-span-3"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200">The three-check departure rule</p><h2 id="before-leaving-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Check once, then go enjoy the day</h2></div>
            {[
              ["1", "Road or HSR conditions", "Construction and temporary stops are real-time details. Open the official City detour page shortly before leaving."],
              ["2", "Weather and what you packed", "Gage Park is outdoors. Check the app forecast, fill your bottle and bring the chair, shade or layer your visit needs."],
              ["3", "Meeting point and ride home", "Agree on a permanent park landmark and return-trip plan before signal is crowded or batteries are low."],
            ].map(([number, title, text]) => <article key={number} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-gold-500 font-display text-sm font-extrabold text-white">{number}</span><h3 className="mt-4 font-display text-xl font-extrabold">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-white/60">{text}</p></article>)}
          </section>

          <section className="arrival-faqs render-later mt-16" aria-labelledby="arrival-faq-heading"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Direct arrival answers</p><h2 id="arrival-faq-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Getting to Jesus Festival FAQs</h2><div className="mt-7 space-y-3">{FAQS.map((item) => <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/30"><summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold text-white">{item.question}</summary><p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p></details>)}</div></section>

          <section className="render-later mt-14 border-t border-white/10 pt-8" aria-labelledby="arrival-sources-heading"><h2 id="arrival-sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Current authoritative sources</h2><p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-white/45">Reviewed August 26, 2026. Construction, transit, fares and event-day traffic controls can change; live City information and on-site direction take priority.</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-relaxed text-gold-400 hover:border-gold/30">{source.name} ↗</a></li>)}</ul></section>

          <section className="render-later mt-16 rounded-[2rem] border border-gold/25 bg-gradient-to-br from-emerald-700/20 via-navy-900 to-purple-700/20 p-8 text-center sm:p-10"><p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Arrive with margin. Leave with stories.</p><h2 className="mt-3 font-display text-3xl font-extrabold">Your festival starts before the stage does.</h2><p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-white/65">Build the trip, save the reminder, then choose the moments you want to carry home.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><a href="#arrival-planner" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Build my arrival</a><Link href="/find-your-moments" className="rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-sm font-bold">Find my moments</Link></div></section>
        </div>
      </article>
    </main>
  );
}
