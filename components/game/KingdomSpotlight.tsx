"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Spotlight } from "@/lib/game";
import { hasProfanity, tidy } from "@/lib/clean";

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
  const [myName, setMyName] = useState("");
  const [myChurch, setMyChurch] = useState("");
  const [editing, setEditing] = useState(false);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    try {
      setMyName(localStorage.getItem("jf-name") || "");
      setMyChurch(localStorage.getItem("jf-church") || "");
    } catch {
      /* ignore */
    }
  }, []);

  function saveProfile() {
    if (hasProfanity(myName) || hasProfanity(myChurch)) {
      setWarn(true);
      return;
    }
    setWarn(false);
    try {
      if (myName.trim()) localStorage.setItem("jf-name", tidy(myName).split(" ")[0]);
      if (myChurch.trim()) localStorage.setItem("jf-church", tidy(myChurch, 60));
    } catch {
      /* ignore */
    }
    setEditing(false);
  }

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

      {/* Opt-in + your Spotlight identity */}
      <div className={`rounded-2xl border p-3 transition ${optIn ? "border-gold/30 bg-gold/10" : "border-white/10 bg-white/5"}`}>
        <button onClick={onToggleOptIn} className="flex w-full items-center gap-3 text-left">
          <span className={`flex h-6 w-11 items-center rounded-full px-0.5 transition ${optIn ? "bg-gold" : "bg-white/15"}`}>
            <span className={`h-5 w-5 rounded-full bg-white transition ${optIn ? "translate-x-5" : "translate-x-0"}`} />
          </span>
          <span className="min-w-0 flex-1 text-[12px] leading-tight text-white/80">
            {optIn ? "You're in the Kingdom Spotlight" : "Add me to the Kingdom Spotlight"}
          </span>
        </button>

        {optIn && (
          <div className="mt-3 border-t border-white/10 pt-3">
            {myName && !editing ? (
              <p className="text-[12px] text-white/70">
                Celebrated as <span className="font-bold text-white">{myName}</span>
                {myChurch && <span className="text-white/50"> · {myChurch}</span>}.{" "}
                <button onClick={() => setEditing(true)} className="font-semibold text-gold-400 underline-offset-2 hover:underline">
                  edit
                </button>
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-white/55">Add your first name & church (optional) to be celebrated:</p>
                <input value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="First name" className="jf-input py-2.5 text-sm" />
                <input value={myChurch} onChange={(e) => setMyChurch(e.target.value)} placeholder="Church (optional)" className="jf-input py-2.5 text-sm" />
                {warn && <p className="text-[11px] font-medium text-rose-300">Let&apos;s keep it friendly for all ages. 💛</p>}
                <button onClick={saveProfile} className="w-full rounded-xl bg-gold py-2.5 text-sm font-bold text-navy-950 active:scale-[0.98]">
                  Save
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-[10px] text-white/35">No rankings, no competition — just celebrating what God is doing through His people. 🙌</p>
    </div>
  );
}
