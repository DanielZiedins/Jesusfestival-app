"use client";

import { SITE, LINKS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import { MapPin, MapIcon, ArrowRight, Sparkle } from "@/components/icons";

const ZONES = [
  { name: "Main Stage", note: "The Bandshell — worship, testimonies & the Gospel", emoji: "🎤" },
  { name: "Kids Zone", note: "Bouncy castles, games & family activities", emoji: "🎈" },
  { name: "Food Trucks", note: "Meals, snacks & space to gather", emoji: "🌮" },
  { name: "Vendor Village", note: "Christian businesses, churches & ministries", emoji: "🛍️" },
  { name: "Prayer", note: "A welcoming place to receive prayer", emoji: "🙏" },
  { name: "Baptisms", note: "Celebrating new life in Jesus", emoji: "💧" },
];

const BRING = [
  { emoji: "🪑", label: "Lawn chair or blanket", note: "The lawn fills up fast — claim your spot" },
  { emoji: "🧴", label: "Sunscreen & a hat", note: "Saturday runs 10–6 in the open sun" },
  { emoji: "💧", label: "Water bottle", note: "Stay hydrated all day" },
  { emoji: "🧥", label: "A layer for Friday night", note: "It cools off once the sun sets" },
  { emoji: "👟", label: "Comfy shoes", note: "You'll wander food trucks & Vendor Village" },
  { emoji: "🤝", label: "A friend", note: "The one thing that matters most" },
];

const GETTING_HERE = [
  { label: "Free parking on-site", note: "Arrive early — festival parking fills quickly" },
  { label: "Street parking & HSR transit", note: "Transit stops and street parking are nearby" },
  { label: "Carpool, Uber, bike or walk", note: "Simple options for a busy festival weekend" },
];

export default function MapScreen() {
  return (
    <div className="pb-6">
      <div className="px-4">
        <ScreenHeader
          eyebrow="Gage Park, Hamilton"
          title="Plan Your Visit"
          subtitle="Open the live map, choose how you're getting here, and know what to look for when you arrive."
          icon={<MapIcon width={22} height={22} />}
        />
      </div>

      {/* Real location map: useful now, while the final on-site zone plan is still being finalized. */}
      <div className="px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-card">
            <div className="relative h-64 bg-navy-900">
              <iframe
                title="Gage Park map — Jesus Festival location"
                src="https://www.google.com/maps?q=Gage%20Park%2C%201000%20Main%20St%20E%2C%20Hamilton%2C%20ON&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.18] contrast-[1.05]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950/90 to-transparent" />
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/15 bg-navy-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 backdrop-blur">
                1000 Main St E · Hamilton
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-3">
              <a
                href={LINKS.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-[0.98]"
              >
                <MapPin width={16} height={16} /> Directions
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-[0.98]"
              >
                Open full map <ArrowRight width={15} height={15} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Location card */}
      <div className="px-4">
        <Reveal className="mx-auto mt-4 max-w-md">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-400">
                <MapPin width={22} height={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-white">Gage Park</h3>
                <p className="text-[13px] text-white/60">{SITE.address}</p>
                <p className="mt-1.5 text-[11px] leading-snug text-white/40">
                  The final on-site zone placement will appear here closer to festival weekend.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Zones */}
      <section className="mt-8 px-4">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkle width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">Festival zone finder</h2>
          </div>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {ZONES.map((z, i) => (
            <Reveal key={z.name} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <div className="text-2xl" aria-hidden="true">{z.emoji}</div>
                <h3 className="mt-2 font-display text-[15px] font-bold text-white">{z.name}</h3>
                <p className="mt-0.5 text-[12px] leading-snug text-white/55">{z.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What to bring */}
      <section className="mt-8 px-4">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkle width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">What to bring</h2>
          </div>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2.5">
          {BRING.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.05}>
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                <span className="text-xl">{b.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{b.label}</p>
                  <p className="text-[12px] text-white/50">{b.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Getting here */}
      <section className="mt-8 px-4">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <MapIcon width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">Getting here</h2>
          </div>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2.5">
          {GETTING_HERE.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.06}>
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">{g.label}</p>
                  <p className="text-[12px] text-white/50">{g.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-3 max-w-md">
          <p className="rounded-xl bg-white/[0.03] p-3 text-center text-[12px] italic text-white/45">
            Free &amp; family-friendly. All are welcome — come as you are.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
