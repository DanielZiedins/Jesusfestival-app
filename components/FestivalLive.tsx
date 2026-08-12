"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SCHEDULE } from "@/lib/content";
import { clientNow, festivalPhase, nowNext, slotTime, type Slot } from "@/lib/festival";
import type { TabId } from "@/components/BottomNav";
import { ArrowRight, MapPin } from "@/components/icons";

/**
 * On Sept 4–5 the Home screen leads with what's happening on stage right now
 * instead of a countdown to an event that has already started. Renders nothing
 * on every other day, so it costs nothing the rest of the year.
 */
export default function FestivalLive({ go }: { go: (t: TabId, sub?: string) => void }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(clientNow());
    const t = setInterval(() => setNow(clientNow()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;
  const phase = festivalPhase(now);
  if (phase !== "fri" && phase !== "sat") return null;

  const day = SCHEDULE.days.find((d) => d.id === phase);
  if (!day) return null;

  const items = day.items as Slot[];
  const { nowIdx, nextIdx } = nowNext(phase, items, now);
  const current = nowIdx >= 0 ? items[nowIdx] : null;
  const next = nextIdx >= 0 ? items[nextIdx] : null;

  // How far through the day's run of show we are — first slot to last slot.
  const first = slotTime(phase, items[0].time);
  const last = slotTime(phase, items[items.length - 1].time);
  const dayPct =
    first && last && last > first
      ? Math.max(0, Math.min(100, Math.round(((now.getTime() - first.getTime()) / (last.getTime() - first.getTime())) * 100)))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-4 overflow-hidden rounded-3xl border border-ember/40 bg-gradient-to-br from-ember/25 via-purple-900/30 to-ink p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-ember/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-ember" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
        </span>
        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-ember">
          Live now · {day.label}
        </span>
      </div>

      {current ? (
        <>
          <p className="relative mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">On stage</p>
          <h2 className="relative mt-1 font-display text-3xl font-extrabold leading-tight text-white">
            {current.title}
          </h2>
          <p className="relative mt-1 text-[13px] leading-snug text-white/65">{current.note}</p>
        </>
      ) : (
        <>
          <h2 className="relative mt-3 font-display text-3xl font-extrabold leading-tight text-white">
            {day.theme}
          </h2>
          <p className="relative mt-1 text-[13px] leading-snug text-white/65">{day.window} at Gage Park.</p>
        </>
      )}

      {next && (
        <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
          <span className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gold-400">
            Up next
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[14px] font-bold text-white">{next.title}</p>
            <p className="text-[12px] text-white/55">{next.time}</p>
          </div>
        </div>
      )}

      {dayPct > 0 && (
        <div className="relative mt-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
            <span>{items[0].time}</span>
            <span className="text-white/55">{dayPct}% through the day</span>
            <span>{items[items.length - 1].time}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-ember" style={{ width: `${dayPct}%` }} />
          </div>
        </div>
      )}

      <div className="relative mt-4 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => go("schedule")}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-95"
        >
          Full run of show <ArrowRight width={15} height={15} />
        </button>
        <button
          onClick={() => go("more", "map")}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-95"
        >
          <MapPin width={15} height={15} /> Park map
        </button>
      </div>

      {/* On the day itself, this is the moment it matters most. */}
      <button
        onClick={() => go("more", "yes")}
        className="relative mt-2.5 flex w-full items-center gap-2.5 rounded-xl border border-gold/35 bg-gold/[0.09] px-3.5 py-3 text-left active:scale-[0.99]"
      >
        <span className="text-lg" aria-hidden="true">🕊️</span>
        <span className="min-w-0 flex-1 text-[12.5px] font-semibold leading-snug text-white">
          Said yes to Jesus today?{" "}
          <span className="font-normal text-white/60">Here&apos;s what happens now.</span>
        </span>
        <ArrowRight width={15} height={15} className="shrink-0 text-gold-400" />
      </button>
    </motion.div>
  );
}
