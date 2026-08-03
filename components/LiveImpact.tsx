"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fetchCityProgress } from "@/lib/game";
import { fetchPrayerStats } from "@/lib/game";
import { fetchSignupLocations } from "@/lib/supabase";
import Reveal, { Eyebrow } from "@/components/Reveal";
import type { TabId } from "@/components/BottomNav";

type Stats = { pct: number; acts: number; prayers: number; family: number };

/** Count up from 0 when the number scrolls into view — numbers that move feel alive. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (to <= 0) {
      setN(0);
      return;
    }
    // Timer-driven (not rAF) so it completes even when rAF is throttled.
    const steps = 24;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(Math.round((to * i) / steps));
      if (i >= steps) clearInterval(t);
    }, 34);
    return () => clearInterval(t);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-CA")}
      {suffix}
    </span>
  );
}

/**
 * The movement, live: real numbers from the game, the Prayer Wall, and the
 * signup map. Renders nothing until at least one number exists, so a network
 * failure never leaves a strip of zeros on the Home screen.
 */
export default function LiveImpact({ go }: { go: (t: TabId, sub?: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([fetchCityProgress(), fetchPrayerStats(), fetchSignupLocations()]).then(([city, prayer, locs]) => {
      const family = locs.reduce((n, l) => n + l.n, 0);
      if (!city && !prayer && !family) return;
      setStats({
        pct: city?.pct ?? 0,
        acts: city?.missions ?? 0,
        prayers: prayer?.total_prayed ?? 0,
        family,
      });
    });
  }, []);

  if (!stats) return null;

  const chips = [
    { n: stats.pct, suffix: "%", label: "of the city revived", onClick: () => go("game") },
    { n: stats.prayers, suffix: "", label: "prayers lifted", onClick: () => go("more", "prayer") },
    { n: stats.family, suffix: "", label: "in the family", onClick: () => go("more", "connect") },
  ];

  return (
    <section className="mt-10 px-4">
      <Reveal className="mx-auto max-w-md">
        <div className="mb-3 text-center">
          <Eyebrow>The movement, right now</Eyebrow>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {chips.map((c) => (
            <motion.button
              key={c.label}
              whileTap={{ scale: 0.96 }}
              onClick={c.onClick}
              className="rounded-2xl border border-gold/20 bg-gradient-to-b from-gold/[0.08] to-transparent p-3.5 text-center"
            >
              <div className="font-display text-2xl font-extrabold text-gradient-gold">
                <CountUp to={c.n} suffix={c.suffix} />
              </div>
              <div className="mt-1 text-[11px] leading-tight text-white/55">{c.label}</div>
            </motion.button>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] italic text-white/35">
          Live from Revive the City &amp; the Prayer Wall — tap any number to jump in
        </p>
      </Reveal>
    </section>
  );
}
