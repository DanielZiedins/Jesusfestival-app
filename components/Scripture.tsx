"use client";

import { motion } from "framer-motion";

// An encouraging scripture accent used throughout the app.
export default function Scripture({
  text,
  reference,
  className = "",
}: {
  text: string;
  reference: string;
  className?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-ink/40 px-5 py-5 text-center backdrop-blur ${className}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[110px] leading-none text-purple-500/15">
        &ldquo;
      </div>
      <blockquote className="relative text-[15px] font-medium leading-relaxed text-white/90">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="relative mt-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
        {reference}
      </figcaption>
    </motion.figure>
  );
}
