"use client";

import { motion } from "framer-motion";
import { IMG, SITE } from "@/lib/content";

export default function Splash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-navy-900 via-ink to-ink"
    >
      <div className="bg-radial-glow absolute inset-0" />
      {/* purple + gold ambient orbs */}
      <div className="pointer-events-none absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-purple-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-gold/20 blur-[110px]" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        className="relative w-[86%] max-w-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMG.banner}
          alt="Jesus Festival"
          className="w-full rounded-2xl shadow-card ring-1 ring-white/10"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55"
      >
        Hamilton · Sept 4–5, 2026
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative mt-3 flex items-center gap-2"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: "0.2s" }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" style={{ animationDelay: "0.4s" }} />
      </motion.div>
    </motion.div>
  );
}
