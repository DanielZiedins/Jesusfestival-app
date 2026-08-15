"use client";

import { SITE, LINKS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import FestivalMap from "@/components/FestivalMap";
import { MapPin, MapIcon, ArrowRight, Sparkle } from "@/components/icons";

const BRING = [
  { emoji: "🪑", label: "Lawn chair or blanket", note: "The lawn fills from the front — claim your spot early" },
  { emoji: "🧴", label: "Sunscreen & a hat", note: "Saturday runs 10–6 in the open sun" },
  { emoji: "💧", label: "Water bottle", note: "There are drinking fountains in the park — refill all day" },
  { emoji: "💵", label: "A bit of cash", note: "Card machines and park signal don't always agree" },
  { emoji: "🔋", label: "A power bank", note: "A full festival day will finish your battery" },
  { emoji: "🧥", label: "A layer for Friday night", note: "It cools off fast once the sun sets" },
  { emoji: "👟", label: "Comfy shoes", note: "You'll wander food trucks & Vendor Village" },
  { emoji: "🤝", label: "A friend", note: "The one thing that matters most" },
];

const GETTING_HERE = [
  { emoji: "🅿️", label: "Free parking on-site", note: "Arrive 20 minutes earlier than you think you need to — it fills fast" },
  { emoji: "🚌", label: "HSR transit & street parking", note: "Several routes stop on Main St E right at the park" },
  { emoji: "🚲", label: "Carpool, Uber, bike or walk", note: "Easily the least stressful way in on Saturday" },
  { emoji: "♿", label: "Accessible entry", note: "The Main St E / Gage Ave entrance has the flattest paved route to the stage" },
];

const HELP = [
  {
    emoji: "🧒",
    title: "If you lose someone",
    text: "Go straight to the Info & Lost Child Point on the map — it's the meeting point the whole team works from, and the first place anyone will bring a lost child.",
  },
  {
    emoji: "⛑️",
    title: "If someone is hurt",
    text: "Call 911 first for anything serious, then send someone to First Aid beside the info tent. Don't wait to be sure — just come.",
  },
  {
    emoji: "🙏",
    title: "If today is heavy",
    text: "The Prayer Tent is open the whole time. You don't need the right words and nobody will make it awkward.",
  },
  {
    emoji: "📵",
    title: "If your signal dies",
    text: "It probably will — a few thousand phones in one park does that. Install this app before you come and the schedule, this map and your spot all keep working offline.",
  },
];

export default function MapScreen() {
  return (
    <div className="pb-6">
      <div className="px-4">
        <ScreenHeader
          eyebrow="Gage Park, Hamilton"
          title="Find Your Way"
          subtitle="The park, the stage, the food, the help — plus a pin you can drop and text to your people."
          icon={<MapIcon width={22} height={22} />}
        />
      </div>

      {/* ===== The park map ===== */}
      <div className="px-4">
        <FestivalMap />
      </div>

      {/* ===== Address + real-world directions ===== */}
      <section className="mt-6 px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-400">
                <MapPin width={22} height={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-bold text-white">Gage Park</h3>
                <p className="text-[13px] text-white/60">{SITE.address}</p>
                <p className="mt-1.5 text-[11px] leading-snug text-white/55">
                  Free entry, both days. No ticket, no gate, no cost.
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
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
                Satellite view <ArrowRight width={15} height={15} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== If you need help ===== */}
      <section className="mt-8 px-4">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkle width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">If you need help</h2>
          </div>
          <p className="mt-1 text-[12.5px] text-white/50">
            Worth reading once now so you don&apos;t have to read it in a panic later.
          </p>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2.5">
          {HELP.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <div className="flex gap-3.5 rounded-2xl border border-gold/15 bg-gradient-to-br from-gold/[0.06] to-transparent p-4">
                <span className="text-xl" aria-hidden="true">{h.emoji}</span>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold text-white">{h.title}</h3>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/60">{h.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== What to bring ===== */}
      <section className="mt-8 px-4">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkle width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">What to bring</h2>
          </div>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2.5">
          {BRING.map((b, i) => (
            <Reveal key={b.label} delay={Math.min(i * 0.045, 0.3)}>
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                <span className="text-xl" aria-hidden="true">{b.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{b.label}</p>
                  <p className="text-[12px] text-white/50">{b.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Getting here ===== */}
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
                <span className="text-lg" aria-hidden="true">{g.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{g.label}</p>
                  <p className="text-[12px] text-white/50">{g.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-3 max-w-md">
          <p className="rounded-xl bg-white/[0.03] p-3 text-center text-[12px] italic text-white/55">
            Free &amp; family-friendly. All are welcome — come as you are.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
