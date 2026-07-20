"use client";

import { motion } from "framer-motion";
import { SITE, LINKS, IMG } from "@/lib/content";
import Reveal from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import ParallaxImage from "@/components/ParallaxImage";
import { MapPin, MapIcon, ArrowRight, Sparkle } from "@/components/icons";

const ZONES = [
  { name: "Main Stage", note: "The Bandshell — worship & the Word", emoji: "🎤" },
  { name: "Kids Zone", note: "Bouncy castles, games & big smiles", emoji: "🎈" },
  { name: "Food Trucks", note: "Great food all weekend long", emoji: "🌮" },
  { name: "Vendor Village", note: "Christian businesses & ministries", emoji: "🛍️" },
  { name: "Prayer Tent", note: "A place to be prayed for", emoji: "🙏" },
  { name: "Baptism Area", note: "Celebrating new life", emoji: "💧" },
];

const GETTING_HERE = [
  { label: "Free parking on-site", note: "Arrive early — spots fill up fast" },
  { label: "Street parking & transit", note: "HSR routes stop nearby" },
  { label: "Uber, biking & walking", note: "Central Hamilton, easy to reach" },
];

export default function MapScreen() {
  return (
    <div className="pb-6">
      <div className="px-4">
        <ScreenHeader
          eyebrow="Gage Park, Hamilton"
          title="Festival Map"
          subtitle="An interactive festival map is on the way. Here's how to find us and what to look for."
          icon={<MapIcon width={22} height={22} />}
        />
      </div>

      {/* Map preview with coming-soon overlay */}
      <div className="px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <ParallaxImage
              src={IMG.vendorRow}
              alt="Gage Park festival grounds"
              className="h-56"
              strength={40}
              overlay="bg-gradient-to-b from-navy-950/50 to-navy-950/90"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-14 w-14 place-items-center rounded-full bg-gold text-navy-950 shadow-glow"
              >
                <MapPin width={26} height={26} />
              </motion.div>
              <div className="mt-3 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 backdrop-blur">
                Interactive map coming soon
              </div>
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
              </div>
            </div>
            <a
              href={LINKS.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-[0.98]"
            >
              Get Directions <ArrowRight width={16} height={16} />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Zones */}
      <section className="mt-8 px-4">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkle width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">What you&apos;ll find</h2>
          </div>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {ZONES.map((z, i) => (
            <Reveal key={z.name} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <div className="text-2xl">{z.emoji}</div>
                <h3 className="mt-2 font-display text-[15px] font-bold text-white">{z.name}</h3>
                <p className="mt-0.5 text-[12px] leading-snug text-white/55">{z.note}</p>
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
                <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
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
