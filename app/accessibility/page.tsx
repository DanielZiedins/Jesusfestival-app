import type { Metadata } from "next";
import Link from "next/link";
import FestivalComfortPlan from "@/components/FestivalComfortPlan";
import { SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/accessibility";
const LAST_REVIEWED = "2026-08-17";

export const metadata: Metadata = {
  title: "Accessible Jesus Festival Hamilton 2026 Guide",
  description:
    "Plan an accessible Jesus Festival visit at Gage Park: mobility, HSR, washrooms, sensory comfort, service animals, support people and questions to confirm.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Accessible Jesus Festival Hamilton 2026 Guide",
    description: "A practical, transparent accessibility and sensory-comfort guide for Jesus Festival at Gage Park.",
    url: PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Jesus Festival Hamilton 2026 Guide",
    description: "Mobility, transit, washrooms, sensory planning, service animals and a private Comfort Plan.",
    images: ["/brand/banner.png"],
  },
};

const FAQS = [
  {
    question: "Is Gage Park wheelchair accessible?",
    answer:
      "Gage Park has an extensive walkway system, and the City is continuing work intended to improve accessibility and pedestrian safety. The festival’s main gathering area is open lawn, so surfaces and distance can still matter. Confirm the current accessible parking, drop-off and viewing plan with the festival team before travelling.",
  },
  {
    question: "Are HSR buses accessible for wheelchairs and scooters?",
    answer:
      "Yes. The City of Hamilton says all HSR buses have accessible low floors and ramps, with spaces for wheelchairs, scooters and walkers. HSR also provides audio and visual stop announcements. Confirm the specific stop and route shortly before travelling because temporary barriers and detours can change the best arrival plan.",
  },
  {
    question: "Will Jesus Festival have ASL interpretation or captioning?",
    answer:
      "ASL interpretation and captioning are not currently confirmed in the public event information used for this guide. Email hello@jesusfestival.ca before travelling if hearing access is essential to your visit.",
  },
  {
    question: "Will there be a quiet or sensory-friendly space?",
    answer:
      "A designated quiet or sensory-friendly space is not currently confirmed in the public event information used for this guide. Plan an edge-of-lawn location, ear protection and a clear break location, and contact the festival team for the latest event layout.",
  },
  {
    question: "Are there washrooms at Gage Park?",
    answer:
      "The City lists washrooms at three Gage Park locations: near the bandshell, spray pad and baseball diamonds. It lists summer hours of 7:30 AM to 8:00 PM for the bandshell and spray-pad buildings. Because event facilities and Friday evening access may differ, confirm the festival-day washroom plan when this is essential.",
  },
  {
    question: "Can I bring a service animal?",
    answer:
      "Ontario accessibility guidance says service animals are allowed in areas open to the public unless another law excludes them, and HSR permits service animals at all times. Bring water and plan breaks away from the loudest crowd areas for a long outdoor event.",
  },
  {
    question: "How do I ask Jesus Festival about an accommodation?",
    answer:
      "Email hello@jesusfestival.ca with the date you plan to attend, the barrier you want to avoid and the support you need confirmed. You do not need to share a diagnosis; a practical description of the access requirement is more useful.",
  },
] as const;

const SOURCES = [
  {
    name: "City of Hamilton — Gage Park Features and Event Services",
    url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations",
  },
  {
    name: "City of Hamilton — Gage Park Improvements",
    url: "https://www.hamilton.ca/things-do/parks-green-space/creating-improving-parks/park-projects/gage-park",
  },
  {
    name: "City of Hamilton — Event Accessibility",
    url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-accessibility",
  },
  {
    name: "City of Hamilton — Using HSR",
    url: "https://www.hamilton.ca/home-neighbourhood/hsr/riding-hsr/using-hsr",
  },
  {
    name: "City of Hamilton — Accessible Low Floor Buses",
    url: "https://www.hamilton.ca/home-neighbourhood/hsr/accessible-transit/accessible-low-floor-buses",
  },
  {
    name: "Ontario — Accessibility in Ontario",
    url: "https://www.ontario.ca/page/accessibility-ontario-what-you-need-to-know",
  },
] as const;

export default function AccessibilityPage() {
  const pageJsonLd = {
    ...webPageJsonLd({
      path: PATH,
      name: "Accessible Jesus Festival Hamilton 2026 Guide",
      description: metadata.description as string,
      about: { "@id": `${SITE.url}/#festival-2026` },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", ".accessibility-summary", ".accessibility-faqs"],
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
    "@id": `${SITE.url}${PATH}#how-to-plan`,
    name: "How to plan a more accessible Jesus Festival visit",
    description: "Five practical steps for confirming access needs and preparing for an outdoor festival at Gage Park.",
    inLanguage: "en-CA",
    totalTime: "PT15M",
    step: [
      "Identify the barriers or comfort needs that matter to your visit.",
      "Use the Comfort Plan to build a private checklist and questions.",
      "Confirm essential event-day accommodations with the festival team.",
      "Check current HSR, parking, weather and park information before leaving.",
      "Share your arrival, meeting point and exit plan with your support person.",
    ].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: "Accessibility Guide", path: PATH },
  ]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([pageJsonLd, faqJsonLd, howToJsonLd, breadcrumbs]) }} />

      <article>
        <header className="relative isolate overflow-hidden border-b border-white/10 bg-gradient-to-br from-emerald-950/65 via-purple-950/50 to-ink">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="mx-auto max-w-4xl px-5 pb-14 pt-10 text-center sm:px-8 sm:pt-16">
            <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              <Link href="/" className="hover:text-gold-400">Jesus Festival</Link>
              <span className="px-2">/</span>
              <span aria-current="page">Accessibility Guide</span>
            </nav>
            <div className="mx-auto mt-8 grid h-16 w-16 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-3xl shadow-[0_0_50px_rgba(52,211,153,0.12)]" aria-hidden>♿</div>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-300">Plan with confidence</p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">
              Accessible Jesus Festival <span className="text-gradient-gold">Hamilton 2026</span>
            </h1>
            <p className="accessibility-summary mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-xl">
              A practical guide to mobility, transit, washrooms, sensory comfort, service animals, support people—and the details worth confirming before Gage Park.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="#comfort-plan" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Build my Comfort Plan</a>
              <a href={`mailto:${SITE.email}?subject=Jesus%20Festival%20accessibility%20question`} className="rounded-2xl border border-white/20 bg-white/[0.05] px-6 py-3.5 text-sm font-bold text-white">Ask an access question</a>
            </div>
            <p className="mt-5 text-[11px] text-white/50">Reviewed August 17, 2026 · Official sources linked below</p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <section aria-labelledby="truth-heading" className="-mt-6 relative z-10 grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-300/25 bg-navy-900/95 p-5 shadow-card backdrop-blur">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">Confirmed from City sources</p>
              <h2 id="truth-heading" className="mt-2 font-display text-xl font-extrabold">Permanent park and transit facts</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/65">Gage Park’s location, walkways, parking count, washroom locations and water points—plus HSR vehicle accessibility.</p>
            </div>
            <div className="rounded-3xl border border-amber-300/20 bg-navy-900/95 p-5 shadow-card backdrop-blur">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-300">Confirm before travelling</p>
              <h2 className="mt-2 font-display text-xl font-extrabold">Event-day accommodations</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/65">Accessible viewing, reserved parking, portable washrooms, interpretation, quiet space, power and individual supports can depend on the final event plan.</p>
            </div>
          </section>

          <div className="mt-10">
            <FestivalComfortPlan />
          </div>

          <section className="render-later mt-16" aria-labelledby="park-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">What the City confirms</p>
            <h2 id="park-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Gage Park access facts</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["🛤️", "Walkways", "The City describes an extensive walkway system throughout the park. The main festival audience area is open lawn."],
                ["🚗", "Parking", "The City lists 150 park parking spaces. The exact festival-day accessible spaces, entrance and drop-off flow should be confirmed."],
                ["🚻", "Washrooms", "The City lists washrooms near the bandshell, spray pad and baseball diamonds, with summer hours published for two buildings."],
                ["💧", "Water", "Potable water is listed near the bandshell and spray-pad washroom buildings. Bring a filled bottle as a reliable starting point."],
                ["🌳", "Outdoor terrain", "The 71-acre park includes open green space, trails and mature trees. Weather can change grass firmness, heat and travel distance."],
                ["🪑", "Seating", "Festival viewing is primarily on open lawn. Bring the chair, positioning aid or rest support that makes the day workable for you."],
              ].map(([emoji, title, text]) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="text-2xl" aria-hidden>{emoji}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="render-later mt-16 grid gap-5 md:grid-cols-2" aria-labelledby="transit-heading">
            <div className="rounded-3xl border border-purple-300/20 bg-gradient-to-br from-purple-700/20 to-transparent p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">Accessible transit</p>
              <h2 id="transit-heading" className="mt-2 font-display text-3xl font-extrabold">Using HSR</h2>
              <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-white/70">
                <li>• All HSR buses have low floors and ramps.</li>
                <li>• Vehicles have spaces for wheelchairs, scooters and walkers.</li>
                <li>• Audio and visual systems announce approaching stops.</li>
                <li>• Service animals are permitted on HSR at all times.</li>
                <li>• Temporary stop barriers can change the safest boarding point.</li>
              </ul>
              <a href="https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/trip-planning-tools" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-navy-950">Open HSR trip planning ↗</a>
            </div>
            <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">A calmer outdoor plan</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold">Reduce the unknowns</h2>
              <ol className="mt-5 space-y-3 text-[14px] leading-relaxed text-white/70">
                <li><strong className="text-white">1. Arrive early.</strong> Parking, paths and the lawn are easier before the busiest window.</li>
                <li><strong className="text-white">2. Choose an edge.</strong> A spot near a clear route makes breaks and exits simpler.</li>
                <li><strong className="text-white">3. Protect your senses.</strong> Bring ear protection, sun protection, water and familiar support items.</li>
                <li><strong className="text-white">4. Share the plan.</strong> Agree on the meeting point, must-see moments and return trip.</li>
                <li><strong className="text-white">5. Confirm essentials.</strong> Ask before travelling when an accommodation is necessary.</li>
              </ol>
            </div>
          </section>

          <section className="render-later mt-16 rounded-[2rem] border border-amber-300/20 bg-amber-300/[0.055] p-6 sm:p-8" aria-labelledby="confirm-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">Transparent by design</p>
            <h2 id="confirm-heading" className="mt-2 font-display text-3xl font-extrabold">What is not yet publicly confirmed</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/70">
              The public information reviewed for this guide does not yet confirm the final accessible viewing zone, reserved accessible parking layout, event-provided accessible toilets, ASL or captioning, a quiet space, refrigeration, charging or individualized support. The City’s event guidance identifies these as important accessibility considerations, but guidance is not the same as a confirmed festival service.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-white/65">If one of these determines whether you can attend, email <a href={`mailto:${SITE.email}`} className="font-bold text-gold-400 underline underline-offset-2">{SITE.email}</a> before travelling. Describe the barrier and the practical support you need—you do not need to disclose a diagnosis.</p>
          </section>

          <section className="accessibility-faqs render-later mt-16" aria-labelledby="faq-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Direct answers</p>
            <h2 id="faq-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Accessibility questions</h2>
            <div className="mt-7 space-y-3">
              {FAQS.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-emerald-300/30">
                  <summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold text-white">{item.question}</summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="render-later mt-14 border-t border-white/10 pt-8" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">Authoritative sources</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {SOURCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-relaxed text-gold-400 hover:border-gold/30">{source.name} ↗</a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-white/50">Last reviewed {new Date(`${LAST_REVIEWED}T12:00:00Z`).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}. Event layouts, weather, construction and transit conditions can change.</p>
          </section>

          <section className="render-later mt-16 rounded-[2rem] border border-gold/25 bg-gradient-to-br from-gold/10 via-purple-900/20 to-transparent p-8 text-center sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Your whole weekend</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Turn comfort into a complete visit plan</h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">Choose your day, group and travel method, then save the schedule and essentials before you leave home.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/jesus-festival-hamilton#build-my-plan" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Build my festival plan</Link>
              <Link href="/offline" className="rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white">Save offline essentials</Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
