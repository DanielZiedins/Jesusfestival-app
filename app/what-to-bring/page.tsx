import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FestivalPackingPlanner from "@/components/FestivalPackingPlanner";
import { IMG, SITE } from "@/lib/content";
import { breadcrumbJsonLd, FESTIVAL_EVENT_JSONLD, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/what-to-bring";
const LAST_REVIEWED = "2026-08-29";

export const metadata: Metadata = {
  title: "What to Bring to Jesus Festival Hamilton 2026",
  description: "Build a personalized Jesus Festival packing checklist for Gage Park—with weather, family, accessibility, volunteer and offline-ready festival essentials.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "What to Bring to Jesus Festival at Gage Park",
    description: "A personalized, private and downloadable packing plan for September 4–5, 2026.",
    url: PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026 at Gage Park" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What to Bring to Jesus Festival Hamilton 2026",
    description: "Build a personalized packing checklist for Gage Park in under a minute.",
    images: ["/brand/banner.png"],
  },
};

const FAQS = [
  { question: "What should I bring to Jesus Festival Hamilton 2026?", answer: "Bring a lawn chair or blanket, a filled refillable water bottle, comfortable shoes, a charged phone, sun protection for Saturday and a warm layer for Friday evening. Save the app's offline essentials before leaving and check the latest forecast and festival updates." },
  { question: "Do I need to bring a chair to Jesus Festival at Gage Park?", answer: "Yes, bringing a lawn chair or blanket is recommended because the main festival gathering area is open lawn. Choose seating you can comfortably carry and position it without blocking an accessible path." },
  { question: "What sun protection should I bring for Saturday?", answer: "Hamilton Public Health recommends broad-spectrum, water-resistant SPF 30 or higher, protective clothing, a wide-brimmed hat, sunglasses, shade and plenty of water. Check the current UV index and follow the product label for reapplication." },
  { question: "What should families with children pack?", answer: "In addition to the core list, bring familiar snacks, extra water, a compact weather layer and any small comfort item your child already uses. Choose the exact side of a permanent park landmark as your family meeting point and teach children what to do if separated." },
  { question: "What should I pack for accessibility or sensory comfort?", answer: "Bring your usual medication, mobility support, hearing protection, sunglasses, communication aid or comfort tool. Review the Accessibility and Comfort Guide and confirm any essential event-day accommodation with the festival before travelling." },
  { question: "What should Jesus Festival volunteers bring?", answer: "Save your team, shift and check-in instructions offline; bring role-appropriate footwear, a charged phone, water and any clothing your team lead requests. Follow the final volunteer instructions if they differ from this general visitor guide." },
  { question: "Can I download or share my Jesus Festival packing list?", answer: "Yes. The planner can download a plain-text checklist and share a link containing only the selected festival day and general visitor add-ons. Checked progress stays privately on the current device." },
  { question: "Does the packing checklist work offline?", answer: "Yes. The What to Bring page is included in the app's offline festival essentials. Open it online before leaving so the route and your locally saved progress remain useful if the park network is congested." },
  { question: "What should I leave at home?", answer: "Jesus Festival has not published a complete prohibited-items list in the public information reviewed for this guide. Do not guess from another event's policy. Follow current official festival announcements, City park rules, on-site signs and staff direction." },
] as const;

const SOURCES = [
  { name: "Jesus Festival — Official Hamilton 2026 Information", url: "https://www.jesusfestival.ca/" },
  { name: "City of Hamilton — Sun Safety", url: "https://www.hamilton.ca/people-programs/public-health/environmental-health-hazards/sun-safety" },
  { name: "City of Hamilton — Heat Warnings and Heat-Related Illness", url: "https://www.hamilton.ca/people-programs/public-health/environmental-health-hazards/heat-warnings-heat-related-illness" },
  { name: "City of Hamilton — Gage Park Event Location", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
] as const;

export default function WhatToBringPage() {
  const pageJsonLd = {
    ...webPageJsonLd({ path: PATH, name: "What to Bring to Jesus Festival Hamilton 2026", description: metadata.description as string, about: { "@id": `${SITE.url}/#festival-2026` } }),
    dateModified: LAST_REVIEWED,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["article h1", ".packing-answer-summary", ".packing-faqs"] },
    citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage", "@id": `${SITE.url}${PATH}#faq`,
    mainEntity: FAQS.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  const howToJsonLd = {
    "@context": "https://schema.org", "@type": "HowTo", "@id": `${SITE.url}${PATH}#packing-plan`,
    name: "How to pack for Jesus Festival Hamilton 2026", description: "Create a personalized and offline-ready packing plan for Jesus Festival at Gage Park.", inLanguage: "en-CA", totalTime: "PT3M",
    step: [
      "Choose Friday night, Saturday or both festival days.",
      "Add family, comfort and accessibility, or volunteer considerations that fit your visit.",
      "Check the current Gage Park forecast and official festival updates.",
      "Pack and mark each personalized checklist item.",
      "Download the list and save the app's festival essentials for offline use.",
    ].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text, url: `${SITE.url}${PATH}#packing-planner` })),
  };
  const breadcrumbs = breadcrumbJsonLd([{ name: "Jesus Festival", path: "/" }, { name: "What to Bring", path: PATH }]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([FESTIVAL_EVENT_JSONLD, pageJsonLd, faqJsonLd, howToJsonLd, breadcrumbs]) }} />
      <article>
        <header className="relative isolate overflow-hidden border-b border-white/10">
          <Image src={IMG.heroCrowd} alt="People gathering outdoors for Jesus Festival at Gage Park" fill preload sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/35 via-purple-950/80 to-ink" />
          <div className="mx-auto flex min-h-[570px] max-w-5xl flex-col justify-end px-5 pb-16 pt-24 text-center sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70"><Link href="/" className="hover:text-gold-400">Jesus Festival</Link><span className="px-2">/</span><span aria-current="page">What to Bring</span></nav>
            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-emerald-200">September 4–5 · Gage Park</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.98] sm:text-6xl">Pack less guesswork. <span className="text-gradient-gold">Bring what matters.</span></h1>
            <p className="packing-answer-summary mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80 sm:text-xl">The direct answer: bring seating, water, comfortable shoes, a charged phone, Saturday sun protection and a Friday evening layer—then personalize the rest for your actual visit.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3"><a href="#packing-planner" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Build my packing list</a><Link href="/festival-weekend" className="rounded-2xl border border-white/20 bg-ink/45 px-6 py-3.5 text-sm font-bold text-white backdrop-blur">Open weekend hub</Link></div>
            <p className="mt-5 text-[11px] text-white/55">Reviewed August 29, 2026 · Practical guidance and current public-health sources</p>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <section className="relative z-10 -mt-7 grid gap-3 rounded-3xl border border-emerald-300/25 bg-gradient-to-br from-emerald-400/10 via-navy-950 to-purple-950 p-5 shadow-card sm:grid-cols-3 sm:p-6" aria-label="Fast packing answer">
            {[["🪑", "Sit", "Lawn chair or blanket"], ["💧", "Hydrate", "A filled refillable bottle"], ["📲", "Stay connected", "Charged phone + offline app"]].map(([emoji, title, text]) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-3"><span className="text-2xl" aria-hidden>{emoji}</span><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">{title}</p><p className="mt-0.5 text-[12.5px] font-bold text-white">{text}</p></div></div>)}
          </section>

          <div className="mt-10"><FestivalPackingPlanner /></div>

          <section className="render-later mt-16" aria-labelledby="why-these-items-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Why these items make the cut</p>
            <h2 id="why-these-items-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Comfort creates room to be present</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">The best packing list is not the longest. It removes the predictable distractions—sun, thirst, dead batteries, uncomfortable seating and unclear meeting plans—so you can worship, listen, welcome people and enjoy the park.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                ["☀️", "Protect the Saturday hours", "Hamilton Public Health recommends checking the UV index, seeking shade, drinking water and using broad-spectrum, water-resistant SPF 30+ outdoors."],
                ["🌙", "Plan the Friday transition", "Pure Worship Night continues after sunset. A layer and a settled ride home remove two common end-of-night stresses."],
                ["🤍", "Prepare your heart too", "Pray before you arrive. Look for the person standing alone, welcome someone new and leave room to listen without turning every interaction into a task."],
              ].map(([emoji, title, text]) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><span className="text-3xl" aria-hidden>{emoji}</span><h3 className="mt-3 font-display text-xl font-extrabold">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-white/60">{text}</p></article>)}
            </div>
          </section>

          <section className="render-later mt-16 rounded-[2rem] border border-amber-300/20 bg-amber-300/[0.055] p-6 sm:p-8" aria-labelledby="rules-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">Honest policy boundary</p>
            <h2 id="rules-heading" className="mt-2 font-display text-3xl font-extrabold">Do not borrow another festival&apos;s prohibited-items list</h2>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-white/65">A complete Jesus Festival 2026 prohibited-items policy was not published in the public information reviewed for this page. That means this guide will not invent one. Check the News screen and official festival channels before leaving, then follow City park rules, event signs and staff direction on site.</p>
            <Link href="/news" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-navy-950">Check festival updates →</Link>
          </section>

          <section className="packing-faqs render-later mt-16" aria-labelledby="packing-faq-heading"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Direct packing answers</p><h2 id="packing-faq-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">What to bring FAQs</h2><div className="mt-7 space-y-3">{FAQS.map((item) => <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/30"><summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold text-white">{item.question}</summary><p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p></details>)}</div></section>

          <section className="render-later mt-14 border-t border-white/10 pt-8" aria-labelledby="packing-sources-heading"><h2 id="packing-sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Current sources</h2><p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-white/45">Reviewed August 29, 2026. Forecasts, event details and park conditions can change; current official announcements and on-site direction take priority.</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-relaxed text-gold-400 hover:border-gold/30">{source.name} ↗</a></li>)}</ul></section>
        </div>
      </article>
    </main>
  );
}
