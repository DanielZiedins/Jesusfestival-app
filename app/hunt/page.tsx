import type { Metadata } from "next";
import Link from "next/link";
import HuntBoard from "@/components/hunt/HuntBoard";
import { STATIONS, TOTAL_POINTS } from "@/lib/hunt";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Festival Light Hunt",
  description:
    "Twelve QR codes are hidden around Gage Park at Jesus Festival — six of them through Vendor Row. Find them all to collect Scripture, unlock nine shareable badges, pour Light Points into Revive the City, and become a Light Bearer.",
  alternates: { canonical: "/hunt" },
  openGraph: {
    title: "The Festival Light Hunt | Jesus Festival",
    description: "Find twelve hidden lights around Gage Park and light up the city.",
    url: "/hunt",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to play the Jesus Festival Light Hunt",
  description:
    "A free scavenger hunt at Jesus Festival Hamilton. Twelve QR codes are hidden around Gage Park — six of them among the vendor booths; scanning each one lights a lamp in the festival app and adds Light Points to Revive the City.",
  totalTime: "PT60M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "CAD", value: "0" },
  step: [
    {
      "@type": "HowToStep",
      name: "Open the festival app",
      text: "Open jesusfestival.app on your phone. The hunt works with no signal once the app has loaded.",
      url: `${SITE.url}/hunt`,
    },
    {
      "@type": "HowToStep",
      name: "Find the twelve QR codes",
      text: "Twelve Jesus Festival QR codes are posted around Gage Park near the places people gather — the main stage, the big lawn, the kids zone, the food trucks, the baptism area, the info point, and six more tucked through Vendor Row.",
    },
    {
      "@type": "HowToStep",
      name: "Scan each code with your camera",
      text: "Point your phone camera at a code and tap the link. The lamp lights up in the app and you receive a verse to carry.",
    },
    {
      "@type": "HowToStep",
      name: "Become a Light Bearer",
      text: "Find all twelve to unlock all nine badges, including Market Blessing and Light Bearer, and share the badge images anywhere you like.",
    },
  ],
};

export default function HuntPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-20 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <nav aria-label="Breadcrumb" className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">
        <Link href="/" className="hover:text-gold-400">Festival</Link>
        <span className="px-2">/</span>
        <span className="text-white/80">Light Hunt</span>
      </nav>

      <header className="mt-7 text-center">
        <div className="text-5xl" aria-hidden>🔦</div>
        <p className="mt-3 text-[11px] font-black uppercase tracking-[0.24em] text-gold-400">
          Gage Park · Free to play
        </p>
        <h1 className="mt-2 font-display text-[38px] font-extrabold leading-[1.05] text-white">
          The Light Hunt
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/65">
          Twelve lights are hidden around the park — six of them through Vendor Row. Find them all,
          collect the Scripture each one carries, unlock nine shareable badges, and pour{" "}
          {TOTAL_POINTS.toLocaleString("en-CA")} Light Points into Revive the City.
        </p>
      </header>

      <div className="mt-8">
        <HuntBoard />
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="font-display text-lg font-bold text-white">How it works</h2>
        <ol className="mt-3 space-y-3">
          {[
            "Walk the park and look for Jesus Festival QR codes near the places people gather.",
            "Point your camera at one and tap the link — a lamp lights up right here.",
            `Each light gives you a verse and ${STATIONS[0].points} Light Points for the city.`,
            "Six of the twelve are hidden through Vendor Row, so take your time in the market.",
            "Find all twelve to unlock all nine badges — including Light Bearer — and share them anywhere.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-white/70">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-[12px] font-black text-navy-950">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-xl bg-white/[0.04] p-3 text-[12.5px] leading-relaxed text-white/55">
          No signal at the park? No problem. Your lamps save on this phone and your points reach the
          city the moment you get a bar back.
        </p>
      </section>
    </main>
  );
}
