"use client";

import { motion } from "framer-motion";
import { CrossIcon } from "./icons";

export default function Splash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-gradient-to-b from-navy-900 via-ink to-ink"
    >
      <div className="bg-radial-glow absolute inset-0" />
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="relative"
      >
        {/* pulsing rings */}
        <motion.span
          className="absolute inset-0 rounded-3xl bg-sky-glow/30"
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-sky-glow to-navy-700 text-white shadow-glow">
          <CrossIcon width={48} height={48} />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="relative mt-6 font-display text-3xl font-extrabold tracking-tight text-white"
      >
        <span className="text-gradient-gold">JESUS</span> FESTIVAL
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/50"
      >
        Hamilton · 2026
      </motion.p>
    </motion.div>
  );
}
