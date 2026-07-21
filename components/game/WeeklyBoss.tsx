"use client";

import { motion } from "framer-motion";
import { BOSS_HIT } from "@/lib/game";

export type StrikeTarget = "missions" | "games" | "verses";

// The weekly community challenge — never scary, always clear:
// every Kingdom act anyone completes is a "strike of light" that pushes it back.
export default function WeeklyBoss({
  boss,
  progress,
  goal,
  myStrikes,
  onStrike,
}: {
  boss: { name: string; emoji: string; defeatedBy: string; verse: { text: string; ref: string } };
  progress: number;
  goal: number;
  myStrikes: number;
  onStrike: (target: StrikeTarget) => void;
}) {
  const pct = Math.min(100, Math.round((progress / goal) * 100));
  const overcome = progress >= goal;
  const actsLeft = Math.max(1, Math.ceil((goal - progress) / BOSS_HIT));

  const WAYS: { target: StrikeTarget; emoji: string; label: string }[] = [
    { target: "missions", emoji: "🙌", label: "Do a mission" },
    { target: "games", emoji: "🎮", label: "Play a game" },
    { target: "verses", emoji: "📖", label: "Learn a verse" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-400/25 bg-gradient-to-br from-[#150a24] to-ink p-5">
      {/* the shadow literally shrinks as the community's light grows */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: overcome ? 0 : 0.55 - (pct / 100) * 0.45 }}
        style={{ background: "radial-gradient(circle at 70% 15%, rgba(0,0,0,0.85), transparent 60%)" }}
      />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative">
        {/* The challenge */}
        <div className="flex items-center gap-3">
          <motion.span
            className="text-5xl"
            animate={overcome ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { opacity: 0.45 + (1 - pct / 100) * 0.55, y: [0, -3, 0] }}
            transition={overcome ? { duration: 1.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {boss.emoji}
          </motion.span>
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-extrabold leading-tight text-white">
              {overcome ? `${boss.name} Overcome! 🎉` : boss.name}
            </h3>
            <p className="text-[13px] text-white/60">
              {overcome ? "The community pushed it back with light!" : <>Weakness: <span className="font-semibold text-gold-400">{boss.defeatedBy}</span></>}
            </p>
          </div>
        </div>

        {/* How it works — one plain sentence */}
        {!overcome && (
          <p className="mt-3 rounded-xl bg-white/5 px-3 py-2.5 text-[12.5px] leading-relaxed text-white/75">
            ⚔️ <span className="font-semibold text-white">How it works:</span> every mission, game, verse or quiz{" "}
            <span className="font-semibold text-white">anyone</span> completes strikes {boss.name.toLowerCase()} with light. When the bar
            fills, the whole city celebrates together!
          </p>
        )}

        {/* Light vs shadow bar */}
        <div className="mt-4 flex items-center gap-2 text-base">
          <span>🌑</span>
          <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500"
              style={{ boxShadow: "0 0 14px rgba(245,166,35,0.5)" }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 26 }}
            />
          </div>
          <span>☀️</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className="font-bold text-gold-400">{pct}% pushed back</span>
          {!overcome && <span className="text-white/50">≈ {actsLeft.toLocaleString()} Kingdom acts to victory</span>}
        </div>

        {/* Your part */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-purple-500/10 px-3 py-2">
          <span className="text-base">⚔️</span>
          <p className="text-[12px] leading-tight text-white/75">
            <span className="font-bold text-white">Your strikes this week: {myStrikes}</span>
            {myStrikes === 0 ? " — land your first one below!" : myStrikes < 5 ? " — keep them coming!" : " — you're a light-bringer! 🔥"}
          </p>
        </div>

        {/* Strike buttons → jump straight into the action */}
        {!overcome && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {WAYS.map((w) => (
              <button
                key={w.target}
                onClick={() => onStrike(w.target)}
                className="flex flex-col items-center gap-1 rounded-xl border border-gold/30 bg-gold/10 px-2 py-2.5 text-center transition active:scale-95"
              >
                <span className="text-xl">{w.emoji}</span>
                <span className="text-[10.5px] font-bold leading-tight text-gold-400">{w.label}</span>
              </button>
            ))}
          </div>
        )}

        <figure className="mt-4 text-center">
          <blockquote className="text-[12px] italic leading-snug text-white/75">&ldquo;{boss.verse.text}&rdquo;</blockquote>
          <figcaption className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gold-400">{boss.verse.ref}</figcaption>
        </figure>
      </div>
    </div>
  );
}
