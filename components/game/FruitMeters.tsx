"use client";

import { motion } from "framer-motion";
import { FRUITS, fruitLevel, type FruitMeters as Meters } from "@/lib/game";

export default function FruitMeters({ meters }: { meters: Meters }) {
  return (
    <div className="space-y-2.5">
      {FRUITS.map((f, i) => {
        const count = meters[f.id] ?? 0;
        const { level, pct } = fruitLevel(count);
        return (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-xl">{f.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${f.color}`}>{f.name}</span>
                <span className="text-[11px] font-semibold text-white/45">Lv {level} · {count.toLocaleString()}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-gold-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: Math.min(i * 0.04, 0.3) }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
