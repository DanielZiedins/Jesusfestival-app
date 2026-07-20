"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Spotlight } from "@/lib/game";

export default function KingdomSpotlight({
  entries,
  optIn,
  onToggleOptIn,
}: {
  entries: Spotlight[];
  optIn: boolean;
  onToggleOptIn: () => void;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (entries.length < 2) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % entries.length), 4000);
    return () => clearInterval(iv);
  }, [entries.length]);

  const churches = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => {
      if (e.church) map.set(e.church, (map.get(e.church) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [entries]);

  const featured = entries[idx];

  return (
    <div className="space-y-3">
      {/* Featured rotating spotlight */}
      <div className="relative min-h-[92px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/25 to-ink/40 p-4">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/15 blur-2xl" />
        <AnimatePresence mode="wait">
          {featured && (
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative flex items-center gap-3"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-lg text-navy-950">🌟</span>
              <div>
                <p className="font-display text-base font-bold text-white">
                  {featured.name || "Someone"}
                  {featured.church && <span className="text-white/40"> · {featured.church}</span>}
                </p>
                <p className="text-[13px] leading-snug text-white/70">{featured.action}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Churches celebrated (not ranked) */}
      {churches.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {churches.map(([name, n]) => (
            <div key={name} className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
              <p className="text-[13px] font-bold leading-tight text-white">{name}</p>
              <p className="mt-0.5 text-[11px] text-gold-400">{n} in the spotlight 💛</p>
            </div>
          ))}
        </div>
      )}

      {/* Opt-in */}
      <button
        onClick={onToggleOptIn}
        className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${optIn ? "border-gold/30 bg-gold/10" : "border-white/10 bg-white/5"}`}
      >
        <span className={`grid h-6 w-10 place-items-center rounded-full ${optIn ? "bg-gold" : "bg-white/15"}`}>
          <motion.span layout className={`h-4 w-4 rounded-full bg-white`} style={{ marginLeft: optIn ? 8 : -8 }} />
        </span>
        <span className="min-w-0 flex-1 text-[12px] leading-tight text-white/75">
          {optIn ? "You're in the Spotlight — your first name & church may be celebrated." : "Add me to the Kingdom Spotlight (first name & church only)."}
        </span>
      </button>
      <p className="text-center text-[10px] text-white/35">No rankings, no competition — just celebrating what God is doing through His people. 🙌</p>
    </div>
  );
}
