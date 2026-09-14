"use client";

import { useEffect, useState } from "react";
import { festivalPhase, clientNow, type Phase } from "@/lib/festival";

/**
 * The hunt hub is prerendered with live-weekend copy, but the printed codes
 * come down when the festival ends. This sets the record straight for anyone
 * arriving after the weekend, so nobody walks to Gage Park hunting for lights
 * that have gone home for the year. Renders nothing before and during the
 * festival — the static copy is correct then.
 */
export default function HuntSeasonNotice() {
  const [phase, setPhase] = useState<Phase | null>(null);
  useEffect(() => setPhase(festivalPhase(clientNow())), []);

  if (phase !== "after") return null;

  return (
    <div className="jf-rise mt-6 rounded-3xl border border-gold/35 bg-gradient-to-br from-gold/12 via-purple-900/25 to-transparent p-5 text-center">
      <div className="text-3xl" aria-hidden>🕯️</div>
      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
        The 2026 hunt is complete
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-white/70">
        The twelve codes have come home for the year — so there&apos;s no need to go looking around
        the park. Every lamp you lit and every badge you earned stays right here on your phone,
        and they&apos;re still yours to share. The lights will hide again at the next festival.
      </p>
    </div>
  );
}
