"use client";

import { useEffect, useId, useState } from "react";
import { track } from "@vercel/analytics";

export const READINESS_STORAGE_KEY = "jf-readiness-v1";

export const READINESS_ITEMS = [
  { id: "chair", emoji: "🪑", label: "Lawn chair or blanket", note: "The lawn fills quickly—claim a comfortable spot." },
  { id: "water", emoji: "💧", label: "Refillable water bottle", note: "Stay hydrated throughout Saturday." },
  { id: "sun", emoji: "🧴", label: "Sunscreen and a hat", note: "Saturday runs 10–6 in the open air." },
  { id: "layer", emoji: "🧥", label: "A layer for Friday night", note: "It can cool down after sunset." },
  { id: "shoes", emoji: "👟", label: "Comfortable shoes", note: "You’ll explore food trucks and the whole park." },
  { id: "friend", emoji: "🤝", label: "Invite someone with you", note: "Bring your family, church or a neighbour." },
] as const;

type ItemId = (typeof READINESS_ITEMS)[number]["id"];

function record(name: string, value: number) {
  try {
    track(name, { festival: "jesus-festival-hamilton-2026", value });
  } catch {
    // Planning must keep working when analytics is blocked.
  }
}

export default function FestivalReadinessChecklist({ compact = false }: { compact?: boolean }) {
  const headingId = useId();
  const [checked, setChecked] = useState<Set<ItemId>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY) ?? "[]") as string[];
      const valid = stored.filter((id): id is ItemId => READINESS_ITEMS.some((item) => item.id === id));
      setChecked(new Set(valid));
    } catch {
      // Start with a clean checklist when local storage is unavailable or stale.
    }
    setReady(true);
  }, []);

  const save = (next: Set<ItemId>) => {
    setChecked(next);
    try {
      localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event("jf-readiness-change"));
    } catch {
      // In-memory state remains useful for the current visit.
    }
  };

  const toggle = (id: ItemId) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    save(next);
    record(next.size === READINESS_ITEMS.length ? "festival_readiness_completed" : "festival_readiness_updated", next.size);
  };

  const complete = () => {
    const next = new Set<ItemId>(READINESS_ITEMS.map((item) => item.id));
    save(next);
    record("festival_readiness_completed", next.size);
  };

  const reset = () => {
    save(new Set());
    record("festival_readiness_reset", 0);
  };

  const percent = Math.round((checked.size / READINESS_ITEMS.length) * 100);

  return (
    <section aria-labelledby={headingId} className="overflow-hidden rounded-3xl border border-purple-300/20 bg-gradient-to-br from-purple-900/35 via-navy-900 to-gold/10 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-purple-300">Festival Ready</p>
          <h2 id={headingId} className="mt-1 font-display text-xl font-extrabold text-white">
            {percent === 100 ? "You’re ready to go! 🙌" : "Pack with confidence"}
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-white/65">Saved privately on this device and available offline.</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] font-display text-sm font-extrabold text-gold-400" aria-hidden>
          {percent}%
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Festival readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 via-gold-400 to-emerald-300 transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-4 space-y-2">
        {READINESS_ITEMS.map((item) => {
          const on = checked.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={on}
              disabled={!ready}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] disabled:opacity-70 ${on ? "border-emerald-300/25 bg-emerald-400/10" : "border-white/8 bg-black/10 hover:bg-white/[0.05]"}`}
            >
              <span className="text-xl" aria-hidden>{item.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[13px] font-bold ${on ? "text-emerald-100" : "text-white"}`}>{item.label}</span>
                {!compact && <span className="mt-0.5 block text-[11px] leading-snug text-white/65">{item.note}</span>}
              </span>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-extrabold ${on ? "border-emerald-300/50 bg-emerald-300 text-navy-950" : "border-white/20 text-transparent"}`} aria-hidden>✓</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" onClick={complete} disabled={percent === 100 || !ready} className="min-h-11 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-xs font-extrabold text-navy-950 disabled:opacity-45">
          Mark everything ready
        </button>
        <button type="button" onClick={reset} disabled={percent === 0 || !ready} className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white/75 disabled:opacity-35">
          Reset
        </button>
      </div>
    </section>
  );
}
