"use client";

import { motion } from "framer-motion";

export default function WeeklyBoss({
  boss,
  progress,
  goal,
}: {
  boss: { name: string; emoji: string; defeatedBy: string; verse: { text: string; ref: string } };
  progress: number;
  goal: number;
}) {
  const pct = Math.min(100, Math.round((progress / goal) * 100));
  const overcome = progress >= goal;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#150a24] to-ink p-5">
      {/* the shadow shrinks as light wins */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: overcome ? 0 : 0.55 - (pct / 100) * 0.45 }}
        style={{ background: "radial-gradient(circle at 70% 20%, rgba(0,0,0,0.8), transparent 60%)" }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">This Week&apos;s Challenge</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/60">Together</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <motion.span
            className="text-4xl"
            animate={overcome ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { opacity: 0.5 + (1 - pct / 100) * 0.5 }}
            transition={{ duration: overcome ? 1.2 : 0.4 }}
          >
            {boss.emoji}
          </motion.span>
          <div>
            <h3 className="font-display text-2xl font-extrabold text-white">
              {overcome ? "Overcome! 🎉" : `Overcoming ${boss.name}`}
            </h3>
            <p className="text-[13px] text-white/60">
              {overcome ? `${boss.name} has been pushed back by the light.` : `Defeated by: ${boss.defeatedBy}`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span>🌑</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 160, damping: 26 }} />
          </div>
          <span>☀️</span>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-white/50">
          {overcome ? "The whole community overcame it together!" : `${pct}% pushed back — every Kingdom act helps!`}
        </p>

        <figure className="mt-3 rounded-xl bg-white/5 px-3 py-2.5 text-center">
          <blockquote className="text-[12px] italic leading-snug text-white/80">&ldquo;{boss.verse.text}&rdquo;</blockquote>
          <figcaption className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gold-400">{boss.verse.ref}</figcaption>
        </figure>
      </div>
    </div>
  );
}
