"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Eyebrow } from "./Reveal";

export default function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-md pt-6 pb-5 text-center safe-top"
    >
      {icon && (
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-glow to-navy-700 text-white shadow-glow">
          {icon}
        </div>
      )}
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-white/60">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
