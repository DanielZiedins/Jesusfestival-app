import type { Metadata } from "next";
import Link from "next/link";
import FestivalGoBag from "@/components/FestivalGoBag";
import { SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/before-you-go";

export const metadata: Metadata = {
  title: "Jesus Festival Before You Go Checklist | Gage Park Go Bag",
  description: "The final Jesus Festival Hamilton checklist: Friday and Saturday times, live Gage Park forecast, packing, Main and Ottawa detours, offline app, meeting point, directions and help.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Jesus Festival Before You Go — Your Final Go Bag",
    description: "Finish five things before Gage Park: save the app offline, pack, plan your route, choose a meeting spot and star your sets.",
    url: PATH,
    type: "website",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival Before You Go — Final Checklist",
    description: "Friday opens at 6 PM. Get the live forecast, packing, directions, offline save and final checklist.",
    images: ["/brand/banner.png"],
  },
};

const FAQS = [
  { question: "What time does Jesus Festival start on Friday?", answer: "Jesus Festival opens at 6:00 PM on Friday, September 4, 2026 at Gage Park. Pure Worship Night begins at 6:30 PM and concludes at 9:00 PM." },
  { question: "What time is Jesus Festival on Saturday?", answer: "Family Festival Day runs Saturday, September 5 from 10:00 AM–7:00 PM. The stage program runs 11:00 AM–7:00 PM, with the final prayer and encouragement beginning at 7:00 PM." },
  { question: "What should I bring to Jesus Festival?", answer: "Bring a lawn chair or blanket, a filled refillable water bottle, comfortable shoes, a charged phone or power bank, sun protection for Saturday and a layer for Friday evening. Recheck the live Gage Park forecast before leaving." },
  { question: "Can I use the Jesus Festival app without phone signal?", answer: "Yes. Open the Before You Go page on a reliable connection and tap Save Now. The app will save the schedule, map, help points and key festival guides for offline use." },
  { question: "Are there road or HSR detours near Gage Park?", answer: "Yes. The Main Street East and Ottawa Street North intersection is closed, and HSR Routes 1/1A King, 10 B-Line Express and 41 Mohawk are detoured. Check the current City of Hamilton information and leave extra time." },
] as const;

const SOURCES = [
  { name: "Jesus Festival — Official Hamilton 2026 Information", url: "https://www.jesusfestival.ca/" },
  { name: "City of Hamilton — Gage Park Features and Services", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
  { name: "City of Hamilton — Current HSR Schedules and Detours", url: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/schedules-detours" },
  { name: "Open-Meteo — Live Gage Park Forecast", url: "https://open-meteo.com/" },
] as const;

export default function BeforeYouGoPage() {
  const page = {
    ...webPageJsonLd({ path: PATH, name: "Jesus Festival Before You Go Checklist", description: metadata.description as string, about: { "@id": `${SITE.url}/#festival-2026` } }),
    dateModified: "2026-09-03",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["article h1", ".before-you-go-summary", ".before-you-go-faq"] },
    citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })),
  };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${SITE.url}${PATH}#faq`, mainEntity: FAQS.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  const howTo = {
    "@context": "https://schema.org", "@type": "HowTo", "@id": `${SITE.url}${PATH}#go-bag`, name: "How to get ready for Jesus Festival before leaving home", description: "A five-minute final checklist for Jesus Festival Hamilton at Gage Park.", totalTime: "PT5M", inLanguage: "en-CA",
    step: ["Save the festival schedule, map, help points and key guides for offline use.", "Pack a chair or blanket, water, sun protection, comfortable shoes and a Friday evening layer.", "Check the Main and Ottawa closure, HSR detours and your route to Gage Park.", "Choose and share a permanent meeting landmark before your group separates.", "Star the stage moments you do not want to miss in My Lineup."].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text })),
  };
  const breadcrumbs = breadcrumbJsonLd([{ name: "Jesus Festival", path: "/" }, { name: "Before You Go", path: PATH }]);

  return (
    <main className="min-h-screen bg-ink px-4 pb-16 pt-8 text-white safe-top sm:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([page, faq, howTo, breadcrumbs]) }} />
      <article className="mx-auto max-w-xl">
        <nav aria-label="Breadcrumb" className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45"><Link href="/" className="hover:text-gold-400">Jesus Festival</Link><span className="px-2">/</span><span aria-current="page">Before You Go</span></nav>
        <header className="pb-6 pt-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ember">Before you leave for Gage Park</p><h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">One final check. Then <span className="text-gradient-gold">come worship Jesus.</span></h1><p className="before-you-go-summary mt-4 text-[14px] leading-relaxed text-white/65 sm:text-base">Jesus Festival opens Friday at 6 PM. This is the shortest path through the current forecast, packing, arrival, offline app, meeting point and schedule.</p></header>
        <FestivalGoBag />

        <section className="before-you-go-faq mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-5" aria-labelledby="before-go-faq-heading"><h2 id="before-go-faq-heading" className="font-display text-2xl font-extrabold">Last-minute answers</h2><div className="mt-4 space-y-4">{FAQS.map((item) => <details key={item.question} className="group border-t border-white/10 pt-4 first:border-0 first:pt-0"><summary className="cursor-pointer list-none pr-6 text-sm font-bold text-white marker:hidden">{item.question}</summary><p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{item.answer}</p></details>)}</div></section>

        <section className="mt-8 border-t border-white/10 pt-6" aria-labelledby="before-go-sources"><h2 id="before-go-sources" className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">Current sources · reviewed September 3, 2026</h2><ul className="mt-3 grid gap-2">{SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11.5px] font-semibold text-gold-400">{source.name} ↗</a></li>)}</ul><p className="mt-3 text-[10.5px] leading-relaxed text-white/40">Final on-site signs, volunteer direction and emergency instructions take priority over saved planning information.</p></section>
        <div className="mt-8 grid grid-cols-2 gap-2.5"><Link href="/day-of" className="flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-3 py-3 text-center text-sm font-extrabold text-navy-950">Day-Of Mode</Link><Link href="/" className="flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-3 py-3 text-center text-sm font-bold">Back to app</Link></div>
      </article>
    </main>
  );
}
