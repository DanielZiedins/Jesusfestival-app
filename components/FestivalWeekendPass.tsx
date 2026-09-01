"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

export const WEEKEND_PASS_STORAGE_KEY = "jf-weekend-pass-v1";
const EVENT_NAME = "jesus-festival-hamilton-2026";

function record(name: string) {
  try {
    track(name, { festival: EVENT_NAME });
  } catch {
    // Analytics must never interrupt a festival-day action.
  }
}

export default function FestivalWeekendPass({ compact = false }: { compact?: boolean }) {
  const [attending, setAttending] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      setAttending(localStorage.getItem(WEEKEND_PASS_STORAGE_KEY) === "saved");
    } catch {
      // The pass still works for this visit when storage is unavailable.
    }
    setReady(true);

    const sync = () => {
      try {
        setAttending(localStorage.getItem(WEEKEND_PASS_STORAGE_KEY) === "saved");
      } catch {
        // Ignore private-mode storage failures.
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener("jf-weekend-pass-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("jf-weekend-pass-change", sync);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const togglePass = () => {
    const next = !attending;
    setAttending(next);
    try {
      if (next) localStorage.setItem(WEEKEND_PASS_STORAGE_KEY, "saved");
      else localStorage.removeItem(WEEKEND_PASS_STORAGE_KEY);
      window.dispatchEvent(new Event("jf-weekend-pass-change"));
    } catch {
      // Keep the in-memory state useful even if persistence is blocked.
    }
    setNotice(next ? "Your weekend is saved — see you at Gage Park!" : "Removed from My Festival Weekend.");
    record(next ? "festival_weekend_saved" : "festival_weekend_removed");
  };

  const shareFestival = async () => {
    const url = `${window.location.origin}/jesus-festival-hamilton`;
    const data = {
      title: "Jesus Festival Hamilton 2026",
      text: "Come with me to Jesus Festival — a free, all-ages weekend at Gage Park, September 4–5!",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        setNotice("Invitation shared!");
        record("festival_shared");
        return;
      }
      await navigator.clipboard.writeText(`${data.text} ${url}`);
      setNotice("Festival invitation copied!");
      record("festival_share_copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Share the festival from jesusfestival.app");
    }
  };

  return (
    <section
      aria-labelledby="festival-weekend-title"
      className="relative isolate overflow-hidden rounded-[1.75rem] border border-gold/30 bg-navy-900 px-5 py-5 shadow-card"
    >
      <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-44 w-44 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 -z-10 h-44 w-44 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-400">My Festival Weekend</p>
          <h2 id="festival-weekend-title" className="mt-1 font-display text-2xl font-extrabold text-white">
            {attending ? "You’re coming! 🙌" : "Save the weekend"}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-white/60">
            September 4–5 · Gage Park · Free for everyone
          </p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl ${attending ? "border-emerald-300/40 bg-emerald-400/15" : "border-white/10 bg-white/[0.06]"}`} aria-hidden>
          {attending ? "✓" : "✦"}
        </div>
      </div>

      {!compact && (
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/8 bg-black/15 p-3 text-center">
          <div><span className="block text-[10px] uppercase tracking-wider text-white/55">Friday</span><strong className="mt-0.5 block text-[12px] text-white">6–9 PM</strong></div>
          <div className="border-x border-white/10"><span className="block text-[10px] uppercase tracking-wider text-white/55">Saturday</span><strong className="mt-0.5 block text-[12px] text-white">10 AM–7 PM</strong></div>
          <div><span className="block text-[10px] uppercase tracking-wider text-white/55">Admission</span><strong className="mt-0.5 block text-[12px] text-white">100% Free</strong></div>
        </div>
      )}

      <button
        type="button"
        onClick={togglePass}
        aria-pressed={attending}
        disabled={!ready}
        className={`mt-4 w-full rounded-2xl px-4 py-3.5 font-display text-sm font-extrabold transition active:scale-[0.98] disabled:opacity-70 ${attending ? "border border-emerald-300/30 bg-emerald-400/15 text-emerald-100" : "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-glow"}`}
      >
        {attending ? "✓ Weekend saved" : "I’m coming — save my weekend"}
      </button>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <Link href="/schedule" className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center text-[11px] font-bold text-white/75 hover:bg-white/[0.08]">
          Schedule
        </Link>
        <a
          href="/jesus-festival-2026.ics"
          onClick={() => record("festival_calendar_download")}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center text-[11px] font-bold text-white/75 hover:bg-white/[0.08]"
        >
          + Calendar
        </a>
        <button type="button" onClick={shareFestival} className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-[11px] font-bold text-white/75 hover:bg-white/[0.08]">
          Invite
        </button>
      </div>

      <p className="mt-3 text-center text-[10px] leading-relaxed text-white/50">No ticket or account needed. Saved only on this device.</p>
      <p aria-live="polite" className="min-h-4 pt-1 text-center text-[11px] font-semibold text-gold-300">{notice}</p>
    </section>
  );
}
