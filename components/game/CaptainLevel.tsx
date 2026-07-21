"use client";

import { motion } from "framer-motion";
import CaptainGoodness, { type Reaction } from "./CaptainGoodness";

// Captain Goodness levels up as the WHOLE community completes missions.
export default function CaptainLevel({
  level,
  pct,
  toNext,
  line,
  reaction = "idle",
}: {
  level: number;
  pct: number;
  toNext: number;
  line: string;
  reaction?: Reaction;
}) {
  const glow = Math.min(0.7, 0.25 + level * 0.05);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-ink/50 p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* aura grows with level */}
          <motion.div
            className="absolute inset-0 -z-0 rounded-full"
            style={{ background: `radial-gradient(circle, rgba(245,166,35,${glow}), transparent 70%)` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative">
            <CaptainGoodness size={92} reaction={reaction} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">Captain Goodness</span>
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-extrabold text-gold-400">LV {level}</span>
          </div>
          <p className="mt-1 text-[13px] font-medium leading-snug text-white/85">{line}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
          </div>
          <p className="mt-1 text-[10px] text-white/45">{toNext} more community acts until Captain Goodness levels up!</p>
        </div>
      </div>
    </div>
  );
}
