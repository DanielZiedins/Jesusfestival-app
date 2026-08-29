"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d % 86400000) / 3600000),
    minutes: Math.floor((d % 3600000) / 60000),
    seconds: Math.floor((d % 60000) / 1000),
    over: d === 0,
  };
}

// A single glowing digit card. Entrances and the digit cross-fade are CSS
// (keyed remount replays jf-rise), so a throttled frame loop can never leave a
// card invisible or a digit frozen mid-fade — timers still tick regardless.
function Unit({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className="jf-rise relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] px-1 py-3.5 text-center shadow-card backdrop-blur">
      {/* soft inner glow that breathes on the seconds card */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-8 left-1/2 h-16 w-24 -translate-x-1/2 rounded-full bg-gold/20 blur-2xl ${
          hot ? "animate-pulse" : "opacity-35"
        }`}
      />
      <div className="relative h-8 sm:h-9">
        <div
          key={value}
          className="jf-rise text-gradient-gold absolute inset-x-0 font-display text-[26px] font-black leading-8 tabular-nums sm:text-3xl sm:leading-9"
        >
          {value}
        </div>
      </div>
      <div className="relative mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/50">
        {label}
      </div>
    </div>
  );
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // Festival weekend! Swap the timer for a celebration banner.
  if (mounted && t.over) {
    return (
      <div className="jf-pop relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/20 via-ember/15 to-purple-600/20 px-4 py-5 text-center">
        <span aria-hidden className="jf-sheen pointer-events-none absolute inset-y-0 w-16 bg-white/20 blur-md" />
        <p className="font-display text-2xl font-extrabold text-white">It&apos;s festival weekend! 🎉</p>
        <p className="mt-1 text-sm font-semibold text-gold-400">See you at Gage Park — bring a friend!</p>
      </div>
    );
  }

  const units = [
    { k: "Days", v: t.days },
    { k: "Hours", v: t.hours },
    { k: "Min", v: t.minutes },
    { k: "Sec", v: t.seconds, hot: true },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {units.map((u) => (
        <Unit key={u.k} label={u.k} value={mounted ? String(u.v).padStart(2, "0") : "--"} hot={u.hot} />
      ))}
    </div>
  );
}
