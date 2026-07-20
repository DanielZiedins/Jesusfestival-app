"use client";

import { motion } from "framer-motion";

// Soft floating light motes + drifting glow — brighter as the city revives (pct 0..100).
export default function AmbientFX({ pct = 0 }: { pct?: number }) {
  const motes = 14;
  const brightness = 0.25 + (pct / 100) * 0.75;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* sun rays / top glow that strengthens as the city revives */}
      <div
        className="absolute -top-24 left-1/2 h-72 w-[140%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(ellipse at center, rgba(245,166,35,${0.12 * brightness}), transparent 70%)` }}
      />
      <div
        className="absolute -left-20 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, rgba(147,51,234,${0.18 * brightness}), transparent 70%)` }}
      />
      {/* floating light motes */}
      {Array.from({ length: motes }).map((_, i) => {
        const left = (i * 37) % 100;
        const dur = 7 + (i % 5) * 2;
        const delay = (i % 7) * 0.9;
        const size = 3 + (i % 3) * 2;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.7 * brightness, 0], y: [-10, -120] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              bottom: "8%",
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#FFD173" : i % 3 === 1 ? "#c084fc" : "#ffffff",
              boxShadow: "0 0 8px currentColor",
            }}
          />
        );
      })}
    </div>
  );
}
