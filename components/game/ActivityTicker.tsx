"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const e = entries[i];

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-3 py-2">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={e.id}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="truncate text-[12px] font-medium text-white/75"
          >
            <span className="font-bold text-white">{e.name || "Someone"}</span> {e.action} 🙌
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
