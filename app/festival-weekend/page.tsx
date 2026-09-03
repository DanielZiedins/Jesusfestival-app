import type { Metadata } from "next";
import Link from "next/link";
import FestivalCommandCenter from "@/components/FestivalCommandCenter";
import { SCHEDULE, SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/festival-weekend";

export const metadata: Metadata = {
  title: "Jesus Festival Weekend Guide & Live Command Center",
  description:
    "Your Jesus Festival Hamilton 2026 day-of hub: live schedule, Gage Park forecast, directions, packing progress, help points, accessibility, Light Hunt and offline essentials.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Jesus Festival Weekend Command Center",
    description: "Everything you need before leaving home and while you are at Gage Park, September 4–5, 2026.",
    url: PATH,
    type: "website",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival Weekend Command Center",
    description: "Live schedule, weather readiness, directions, packing, help and offline essentials for Gage Park.",
    images: ["/brand/banner.png"],
  },
};

const FAQS = [
  {
    question: "What time does Jesus Festival Hamilton start?",
    answer: "Friday, September 4 opens at 6:00 PM, with Pure Worship Night from 6:30–9:00 PM. Saturday, September 5 has been extended to 10:00 AM–7:00 PM, with the stage program from 11:00 AM–7:00 PM.",
  },
  {
    question: "Do I need a ticket for Jesus Festival?",
    answer: "No. Jesus Festival Hamilton is free and all ages. No admission ticket or app account is required. Food truck, vendor and official shop purchases are optional.",
  },
  {
    question: "Where is Jesus Festival 2026?",
    answer: "Jesus Festival is at Gage Park, 1000 Main Street East, Hamilton, Ontario. Parking is limited, and the active Main and Ottawa closure affects driving and several HSR routes. Use the current Getting to Gage Park guide, allow extra time and consider HSR, rideshare, cycling, walking or carpooling.",
  },
  {
    question: "Are there construction or HSR detours near Jesus Festival?",
    answer: "Yes. The Main Street East and Ottawa Street North intersection is closed during the festival period. HSR Routes 1/1A King, 10 B-Line Express and 41 Mohawk are detoured. Check the City of Hamilton's current information and calculate a leave-by time in the app before travelling.",
  },
  {
    question: "What should I bring to Jesus Festival?",
    answer: "Bring a lawn chair or blanket, a filled refillable water bottle, sunscreen, a hat, comfortable shoes and a layer for Friday evening. The personalized What to Bring planner adapts the list for your festival days, family, comfort or accessibility needs and volunteer plans.",
  },
  {
    question: "What should I do if I lose someone or need first aid?",
    answer: "Use the Festival Map for the approximate Info and Lost Child Point and First Aid locations, then follow the final on-site signs and volunteer directions. Call 911 first for a serious or life-threatening emergency.",
  },
  {
    question: "Does the Jesus Festival app work without phone signal?",
    answer: "Yes. Open the app and save the festival essentials before leaving home. The core schedule, map, packing checklist and essential guides can then remain available when the park network is congested or unavailable.",
  },
  {
    question: "Where can I find Jesus Festival accessibility details?",
    answer: "The Accessibility and Comfort Guide separates confirmed Gage Park and HSR facts from event-day accommodations that visitors should confirm before travelling. It also includes a private on-device Comfort Plan.",
  },
  {
    question: "What is the Jesus Festival Light Hunt?",
    answer: "The Light Hunt is a free, on-site scavenger hunt inside the Jesus Festival app. Visitors find 12 lights around Gage Park, including six in Vendor Row, and collect shareable badges on their own device.",
  },
  {
    question: "How do I choose which Jesus Festival sets to see?",
    answer: "Use Find Your Festival Moments to choose your group type, preferred experience and available time. It creates a short recommendation from the confirmed schedule and can add every pick to your private My Lineup in one tap.",
  },
] as const;

const SOURCES = [
  { name: "Jesus Festival — Official Hamilton 2026 Information", url: "https://www.jesusfestival.ca/" },
  { name: "City of Hamilton — Gage Park Features and Services", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
  { name: "City of Hamilton — Current HSR Schedules and Detours", url: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/schedules-detours" },
] as const;

export default function FestivalWeekendPage() {
  const pageJsonLd = {
    ...webPageJsonLd({
      path: PATH,
      name: "Jesus Festival Weekend Guide and Live Command Center",
      description: metadata.description as string,
      about: { "@id": `${SITE.url}/#festival-2026` },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", ".weekend-answer-summary", ".weekend-faqs"],
    },
    citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}${PATH}#faq`,
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE.url}${PATH}#festival-ready`,
    name: "How to get ready for Jesus Festival Hamilton 2026",
    description: "A five-step festival-week checklist for a smooth visit to Jesus Festival at Gage Park.",
    inLanguage: "en-CA",
    totalTime: "PT20M",
    step: [
      "Save September 4–5 and choose which festival day or moments you plan to attend.",
      "Star your must-see sets in the Jesus Festival schedule.",
      "Pack a chair or blanket, water, sun protection, comfortable shoes and a Friday evening layer.",
      "Check the Gage Park forecast, transportation and any required accessibility details before leaving.",
      "Open the app online and save the festival essentials for offline use at the park.",
    ].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: "Festival Weekend", path: PATH },
  ]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([pageJsonLd, faqJsonLd, howToJsonLd, breadcrumbs]) }} />
      <article>
        <header className="relative isolate overflow-hidden border-b border-white/10 bg-gradient-to-br from-purple-950/70 via-navy-950 to-ink">
          <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 -z-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="mx-auto max-w-4xl px-5 pb-14 pt-10 text-center sm:px-8 sm:pt-16">
            <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
              <Link href="/" className="hover:text-gold-400">Jesus Festival</Link>
              <span className="px-2">/</span>
              <span aria-current="page">Festival Weekend</span>
            </nav>
            <div className="mx-auto mt-8 grid h-16 w-16 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-3xl shadow-glow" aria-hidden>⚡</div>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold-400">September 4–5 · Gage Park</p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">
              Your Festival Weekend <span className="text-gradient-gold">Command Center</span>
            </h1>
            <p className="weekend-answer-summary mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/70 sm:text-xl">
              What to do now, what is happening next, what to pack, where to go and how to keep the essentials working when the park signal does not.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/before-you-go" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Finish my Festival Go Bag</Link>
              <Link href="/day-of" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Open Day-Of Mode</Link>
              <a href="#my-weekend" className="rounded-2xl border border-gold/30 bg-gold/[0.08] px-6 py-3.5 font-display text-sm font-extrabold text-gold-300">Open my weekend hub</a>
              <Link href="/schedule" className="rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-bold text-white">See the full schedule</Link>
            </div>
            <p className="mt-5 text-[11px] text-white/45">Updated September 3, 2026 · Live information is shown in Hamilton time</p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Link
            href="/blog/jesus-festival-saturday-extended-updated-schedule-2026"
            className="relative z-20 mt-6 flex items-center gap-4 rounded-3xl border border-emerald-300/35 bg-gradient-to-r from-emerald-500/20 via-gold/[0.1] to-purple-600/10 p-5 transition hover:border-gold/50"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-300/15 text-3xl" aria-hidden>⏰</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">Important Saturday update</span>
              <span className="mt-1 block font-display text-xl font-extrabold text-white">Festival 10 AM–7 PM · Stage 11 AM–7 PM</span>
              <span className="mt-1 block text-sm leading-relaxed text-white/65">Saturday is now one hour longer, and every artist and speaker time has been updated. Read the full announcement →</span>
            </span>
          </Link>
          <div id="my-weekend" className="relative z-10 mt-6 scroll-mt-6">
            <FestivalCommandCenter />
          </div>

          <section className="render-later mt-16" aria-labelledby="run-sheet-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Both days at a glance</p>
            <h2 id="run-sheet-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Know the shape of the weekend</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {SCHEDULE.days.map((day) => (
                <article key={day.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-purple-200">{day.label} · {day.date}</p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold">{day.theme}</h3>
                  <p className="mt-1 text-sm font-extrabold text-gold-400">{day.window}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-white/65">{day.blurb}</p>
                  <div className="mt-4 rounded-2xl border border-white/8 bg-black/15 p-3 text-[12px] leading-relaxed text-white/60">
                    <strong className="text-white">First:</strong> {day.items[0].time} · {day.items[0].title}<br />
                    <strong className="text-white">Final:</strong> {day.items[day.items.length - 1].time} · {day.items[day.items.length - 1].title}
                  </div>
                </article>
              ))}
            </div>
            <Link href="/schedule" className="mt-4 flex min-h-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/[0.08] px-5 py-3 text-center font-display text-sm font-extrabold text-gold-300">Open every set time and build My Lineup →</Link>
          </section>

          <section className="render-later mt-16" aria-labelledby="arrival-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">Low-stress arrival plan</p>
            <h2 id="arrival-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Five moves before you leave</h2>
            <ol className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ["01", "Check the latest", "Open News and the forecast before leaving. Weather, transit and event-day layouts can change."],
                ["02", "Leave margin", "Parking is limited. Add time for HSR, walking from a side street, a drop-off or finding the right park entrance."],
                ["03", "Save the essentials", "Open the install screen and save the festival essentials while you still have reliable Wi-Fi or mobile data."],
                ["04", "Choose a meeting point", "Use the map to drop and share a spot. The Gage Family Fountain is an easy permanent landmark."],
                ["05", "Follow the signs", "Festival zones on the app map are approximate. Final signs and volunteer direction take priority on the day."],
              ].map(([number, title, text]) => (
                <li key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <span className="font-display text-xl font-extrabold text-emerald-300">{number}</span>
                  <h3 className="mt-2 font-display text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">{text}</p>
                </li>
              ))}
            </ol>
            <Link href="/getting-to-gage-park" className="mt-4 flex min-h-12 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/[0.08] px-5 py-3 text-center font-display text-sm font-extrabold text-amber-100">Check current road and HSR detours, then calculate when to leave →</Link>
            <Link href="/what-to-bring" className="mt-4 flex min-h-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/[0.08] px-5 py-3 text-center font-display text-sm font-extrabold text-emerald-100">Build a personalized, downloadable What to Bring checklist →</Link>
            <Link href="/bring-a-group" className="mt-4 flex min-h-12 items-center justify-center rounded-2xl border border-purple-300/30 bg-purple-400/[0.08] px-5 py-3 text-center font-display text-sm font-extrabold text-purple-100">Bringing a church, youth group, family or friends? Build one shareable crew plan →</Link>
          </section>

          <section id="help" className="render-later mt-16 rounded-[2rem] border border-rose-300/20 bg-gradient-to-br from-rose-500/[0.09] via-purple-900/20 to-transparent p-6 sm:p-8" aria-labelledby="help-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-200">Know this before you need it</p>
            <h2 id="help-heading" className="mt-2 font-display text-3xl font-extrabold">Help at Gage Park</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-black/15 p-4"><span className="text-2xl" aria-hidden>🧒</span><h3 className="mt-2 font-display font-extrabold">Lost person or child</h3><p className="mt-1 text-[12.5px] leading-relaxed text-white/65">Go to the Info and Lost Child Point shown approximately on the map, then follow on-site signage.</p></article>
              <article className="rounded-2xl border border-white/10 bg-black/15 p-4"><span className="text-2xl" aria-hidden>⛑️</span><h3 className="mt-2 font-display font-extrabold">First aid</h3><p className="mt-1 text-[12.5px] leading-relaxed text-white/65">Use the mapped First Aid point and ask a volunteer. Call 911 first for a serious or life-threatening emergency.</p></article>
              <article className="rounded-2xl border border-white/10 bg-black/15 p-4"><span className="text-2xl" aria-hidden>♿</span><h3 className="mt-2 font-display font-extrabold">Access support</h3><p className="mt-1 text-[12.5px] leading-relaxed text-white/65">Use the Accessibility Guide and confirm an essential accommodation before travelling.</p></article>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link href="/map#help" className="rounded-xl bg-white px-5 py-3 text-center text-sm font-extrabold text-navy-950">Open help points on the map</Link>
              <Link href="/accessibility" className="rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-bold">Open accessibility guide</Link>
            </div>
          </section>

          <section className="weekend-faqs render-later mt-16" aria-labelledby="faq-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Fast, direct answers</p>
            <h2 id="faq-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Festival weekend questions</h2>
            <div className="mt-7 space-y-3">
              {FAQS.map((item) => (
                <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/30">
                  <summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold">{item.question}</summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="render-later mt-14 border-t border-white/10 pt-8" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Current authoritative sources</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {SOURCES.map((source) => (
                <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-relaxed text-gold-400 hover:border-gold/30">{source.name} ↗</a></li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-white/45">Reviewed August 24, 2026. Follow official festival announcements, on-site signs and emergency instructions when they differ from planning information saved earlier.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
