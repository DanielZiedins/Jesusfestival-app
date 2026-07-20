"use client";

import { motion } from "framer-motion";
import { Check } from "@/components/icons";

export default function DailyMission({
  mission,
  count,
  goal,
  done,
  onDo,
}: {
  mission: { emoji: string; text: string; reward: string };
  count: number;
  goal: number;
  done: boolean;
  onDo: () => void;
}) {
  const pct = Math.min(100, Math.round((count / goal) * 100));
  const reached = count >= goal;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/12 via-purple-900/20 to-ink/50 p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          Today&apos;s Global Mission
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">{mission.emoji}</span>
          <h3 className="font-display text-2xl font-extrabold leading-tight text-white">{mission.text}</h3>
        </div>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/50">Community progress</p>
        <div className="mt-1.5 flex items-end justify-between">
          <span className="font-display text-2xl font-extrabold text-gold-400">{count.toLocaleString()}</span>
          <span className="text-sm text-white/50">/ {goal.toLocaleString()}</span>
        </div>
        <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-gold-400 to-gold-500" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 160, damping: 26 }} />
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <span className="text-base">🎁</span>
          <p className="text-[12px] leading-tight text-white/70">
            {reached ? "Unlocked: " : "Unlock together: "}
            <span className="font-bold text-white">{mission.reward}</span>
          </p>
        </div>

        <button
          onClick={onDo}
          disabled={done}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-extrabold transition active:scale-[0.98] ${
            done ? "bg-emerald-500/20 text-emerald-200" : "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-glow"
          }`}
        >
          {done ? (
            <>
              <Check width={18} height={18} /> You did your part today!
            </>
          ) : (
            "I did today's mission 🙌"
          )}
        </button>
        {done && <p className="mt-2 text-center text-[11px] text-white/50">Come back tomorrow for a new city-wide mission.</p>}
      </div>
    </div>
  );
}
