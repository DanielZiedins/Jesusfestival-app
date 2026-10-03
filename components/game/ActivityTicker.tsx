"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Spotlight } from "@/lib/game";

// A gentle live ticker of recent community acts — proof the city is moving.
export default function ActivityTicker({ entries }: { entries: Spotlight[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (entries.length < 2) return;
    const iv = setInterval(() => setI((v) => (v + 1) % entries.length), 3200);
    return () => clearInterval(iv);
  }, [entries.length]);

  if (!entries.length) return null;
  // Clamp — the parent list can shrink (optimistic entries replaced by a fetch)
  // and a stale index must never read past the end.
  const e = entries[i % entries.length];

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-3 py-2">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <p
            key={e.id}
            className="jf-rise truncate text-[12px] font-medium text-white/75"
          >
            <span className="font-bold text-white">{e.name || "Someone"}</span> {e.action} 🙌
          </p>
        </AnimatePresence>
      </div>
    </div>
  );
}
