"use client";

import { useEffect, useState } from "react";
import { clientNow, festivalPhase, type Phase } from "@/lib/festival";

/**
 * The current festival phase, or null until mounted — so the server render and
 * the first client render always agree. Callers treat null as "not live yet".
 */
export function useFestivalPhase(): Phase | null {
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    const tick = () => setPhase(festivalPhase(clientNow()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  return phase;
}

export const isLivePhase = (p: Phase | null) => p === "fri" || p === "sat";
