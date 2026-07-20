"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

  const units = [
    { k: "Days", v: t.days },
    { k: "Hrs", v: t.hours },
    { k: "Min", v: t.minutes },
    { k: "Sec", v: t.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {units.map((u, i) => (
        <motion.div
          key={u.k}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
          className="glass rounded-2xl px-1 py-3 text-center shadow-card"
        >
          <div className="font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {mounted ? String(u.v).padStart(2, "0") : "--"}
          </div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400/80">
            {u.k}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
