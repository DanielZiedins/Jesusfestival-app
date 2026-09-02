import type { Metadata } from "next";
import Link from "next/link";
import FestivalDayMode from "@/components/FestivalDayMode";
import { SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/day-of";

export const metadata: Metadata = {
  title: "Jesus Festival Day-Of Mode | Live Now, Next, Map & Help",
  description: "The fastest Jesus Festival day-of view: what is on now, what comes next, Gage Park directions, map, help points, offline essentials and first steps.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Jesus Festival Day-Of Mode",
    description: "One fast screen for the live schedule, Gage Park map, help and offline essentials.",
    url: PATH,
    type: "website",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Jesus Festival Day-Of Mode", description: "Live now, next, map, help and offline essentials in one fast view.", images: ["/brand/banner.png"] },
};

const FAQS = [
  { question: "What is Jesus Festival Day-Of Mode?", answer: "Day-Of Mode is a fast, low-distraction screen that updates in Hamilton time and keeps the current and next stage moments, Gage Park map, help points, directions, offline essentials and first steps together." },
  { question: "Does Jesus Festival Day-Of Mode work offline?", answer: "Yes. Open it online before arriving and the app precaches Day-Of Mode with the schedule, map and offline essentials. Live community features reconnect when service returns." },
  { question: "Where do I go for first aid or a lost child?", answer: "Open Get Help in Day-Of Mode to see the approximate First Aid and Info and Lost Child points, then follow current on-site signs and volunteer direction. Call 911 first for a serious or life-threatening emergency." },
] as const;

export default function DayOfPage() {
  const pageJsonLd = {
    ...webPageJsonLd({ path: PATH, name: "Jesus Festival Day-Of Mode", description: metadata.description as string, about: { "@id": `${SITE.url}/#festival-2026` } }),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["article h1", ".day-of-summary", ".day-of-faq"] },
  };
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${SITE.url}${PATH}#faq`, mainEntity: FAQS.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  const breadcrumbs = breadcrumbJsonLd([{ name: "Jesus Festival", path: "/" }, { name: "Day-Of Mode", path: PATH }]);

  return (
    <main className="min-h-screen bg-ink px-4 pb-16 pt-8 text-white safe-top sm:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([pageJsonLd, faqJsonLd, breadcrumbs]) }} />
      <article className="mx-auto max-w-lg">
        <nav aria-label="Breadcrumb" className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45"><Link href="/" className="hover:text-gold-400">Jesus Festival</Link><span className="px-2">/</span><span aria-current="page">Day-Of Mode</span></nav>
        <header className="pb-6 pt-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-400">Fast · live · offline-ready</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl">Everything that matters <span className="text-gradient-gold">right now.</span></h1>
          <p className="day-of-summary mt-4 text-[14px] leading-relaxed text-white/65">One glance for the stage, the next moment, your meeting area, directions, help and no-signal essentials. No feed and no hunting through menus.</p>
        </header>
        <FestivalDayMode />

        <section className="day-of-faq mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-5" aria-labelledby="day-of-faq-heading">
          <h2 id="day-of-faq-heading" className="font-display text-2xl font-extrabold">Day-of answers</h2>
          <div className="mt-4 space-y-4">{FAQS.map((item) => <details key={item.question} className="group border-t border-white/10 pt-4 first:border-0 first:pt-0"><summary className="cursor-pointer list-none pr-6 text-sm font-bold text-white marker:hidden">{item.question}</summary><p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{item.answer}</p></details>)}</div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-2.5"><Link href="/festival-weekend" className="flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold">Full weekend hub</Link><Link href="/" className="flex min-h-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.08] px-4 py-3 text-center text-sm font-extrabold text-gold-300">Back to the app</Link></div>
      </article>
    </main>
  );
}
