"use client";

import { useEffect, useState } from "react";
import { SCHEDULE } from "@/lib/content";
import { clientNow, getLineup, slotId, slotTime, type Slot } from "@/lib/festival";
import type { TabId } from "@/components/BottomNav";
import { ArrowRight } from "@/components/icons";

type Picked = { day: (typeof SCHEDULE.days)[number]; slot: Slot; start: Date | null };

/**
 * Everything the user starred, in chronological order, with whatever is still
 * ahead of them surfaced first. Renders nothing until they've starred something,
 * so it never nags an empty state onto the Home screen.
 */
export default function LineupCard({ go }: { go: (t: TabId, sub?: string) => void }) {
  const [picks, setPicks] = useState<Picked[] | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const read = () => {
      const ids = new Set(getLineup());
      const out: Picked[] = [];
      for (const day of SCHEDULE.days) {
        for (const s of day.items as Slot[]) {
          if (ids.has(slotId(day.id, s))) out.push({ day, slot: s, start: slotTime(day.id, s.time) });
        }
      }
      out.sort((a, b) => (a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0));
      setPicks(out);
      setNow(clientNow());
    };
    read();
    // Starring happens on the Schedule tab; re-read when we come back into view.
    document.addEventListener("visibilitychange", read);
    window.addEventListener("focus", read);
    return () => {
      document.removeEventListener("visibilitychange", read);
      window.removeEventListener("focus", read);
    };
  }, []);

  if (!picks?.length) return null;

  const t = now?.getTime() ?? 0;
  const upcoming = picks.filter((p) => (p.start?.getTime() ?? 0) >= t);
  const list = (upcoming.length ? upcoming : picks).slice(0, 4);
  const allDone = upcoming.length === 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/12 via-purple-900/20 to-ink p-5">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative flex items-center justify-between gap-2">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">⭐ My Lineup</p>
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-bold text-white/70">
          {picks.length} set{picks.length === 1 ? "" : "s"}
        </span>
      </div>

      <h3 className="relative mt-2 font-display text-2xl font-extrabold leading-tight text-white">
        {allDone ? "What a weekend 💛" : "The ones you won't miss"}
      </h3>

      <div className="relative mt-3.5 space-y-2">
        {list.map(({ day, slot }) => (
          <div
            key={`${day.id}-${slot.time}-${slot.title}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5"
          >
            <div className="w-[62px] shrink-0">
              <div className="font-display text-[13px] font-bold leading-tight text-gold-400">{slot.time}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">{day.label}</div>
            </div>
            <p className="min-w-0 flex-1 truncate font-display text-[14px] font-bold text-white">
              {slot.kind === "artist" && <span className="mr-1 text-gold-400">♪</span>}
              {slot.title}
            </p>
          </div>
        ))}
      </div>

      {picks.length > list.length && (
        <p className="relative mt-2.5 text-[12px] text-white/45">
          +{picks.length - list.length} more in your lineup
        </p>
      )}

      <button
        onClick={() => go("schedule")}
        className="relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 py-2.5 text-[13px] font-bold text-gold-400 active:scale-[0.98]"
      >
        Open my lineup <ArrowRight width={14} height={14} />
      </button>
    </div>
  );
}
