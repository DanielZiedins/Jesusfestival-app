"use client";

import { useEffect, useRef } from "react";
import { memo } from "react";
import { motion } from "framer-motion";
import { MILESTONES } from "@/lib/game";

// What we unlock TOGETHER as the city revives — gives everyone something to look forward to.
function MilestoneJourney({ pct }: { pct: number }) {
  const scroller = useRef<HTMLDivElement>(null);
  const nextIdx = MILESTONES.findIndex((m) => m.pct > pct);

  // Auto-scroll the "next" milestone into view once.
  useEffect(() => {
    const el = scroller.current;
    if (!el || nextIdx < 1) return;
    const card = el.children[nextIdx] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: Math.max(0, card.offsetLeft - 24), behavior: "smooth" });
  }, [nextIdx]);

  return (
    <div ref={scroller} className="no-scrollbar -mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-1">
      {MILESTONES.map((m, i) => {
        const unlocked = pct >= m.pct;
        const isNext = i === nextIdx;
        return (
          <div
            key={m.pct}
            className={`relative w-[124px] shrink-0 snap-start rounded-2xl border p-3 text-center transition ${
              unlocked
                ? "border-gold/50 bg-gradient-to-b from-gold/20 to-gold/5"
                : isNext
                ? "border-purple-400/60 bg-purple-500/15"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            {isNext && (
              <motion.span
                className="absolute inset-0 rounded-2xl ring-2 ring-purple-400/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            )}
            <div className={`text-2xl ${unlocked ? "" : isNext ? "" : "opacity-40 grayscale"}`}>{unlocked ? m.emoji : isNext ? m.emoji : "🔒"}</div>
            <p className={`mt-1 font-display text-sm font-extrabold ${unlocked ? "text-gold-400" : isNext ? "text-purple-200" : "text-white/40"}`}>{m.pct}%</p>
            <p className={`mt-0.5 text-[10px] leading-tight ${unlocked ? "text-white/80" : isNext ? "text-white/75" : "text-white/35"}`}>{m.tease}</p>
            {unlocked && <span className="mt-1.5 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-400">Unlocked!</span>}
            {isNext && <span className="mt-1.5 inline-block rounded-full bg-purple-500/30 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-200">Up next</span>}
          </div>
        );
      })}
    </div>
  );
}

export default memo(MilestoneJourney);
