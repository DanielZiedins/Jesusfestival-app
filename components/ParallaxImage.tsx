"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImage({
  src,
  alt = "",
  className = "",
  strength = 60,
  overlay = "bg-gradient-to-b from-ink/30 via-ink/40 to-ink",
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  strength?: number;
  overlay?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.08, 1.15]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0 -top-[10%] h-[120%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className={`absolute inset-0 ${overlay}`} />
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
