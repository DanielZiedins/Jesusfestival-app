"use client";

import { motion } from "framer-motion";

// Captain Goodness — an original, friendly, heroic guide.
// Not a superhero with powers; a joyful helper who points people to Jesus.
export default function CaptainGoodness({
  size = 120,
  float = true,
}: {
  size?: number;
  float?: boolean;
}) {
  const inner = (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg-cape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC24D" />
          <stop offset="1" stopColor="#F5A623" />
        </linearGradient>
        <linearGradient id="cg-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
        <radialGradient id="cg-glow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#F5A623" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="60" cy="58" r="52" fill="url(#cg-glow)" />

      {/* Cape */}
      <path d="M38 52 Q60 44 82 52 L92 104 Q60 92 28 104 Z" fill="url(#cg-cape)" />
      <path d="M38 52 Q60 44 82 52 L78 70 Q60 62 42 70 Z" fill="#FFD173" opacity="0.5" />

      {/* Body / suit */}
      <path d="M42 56 Q60 50 78 56 L74 96 Q60 102 46 96 Z" fill="url(#cg-suit)" />
      {/* Chest emblem — sunburst star (goodness) */}
      <g transform="translate(60 74)">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x1 = Math.cos(a) * 5, y1 = Math.sin(a) * 5;
          const x2 = Math.cos(a) * 11, y2 = Math.sin(a) * 11;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFE9B0" strokeWidth="2" strokeLinecap="round" />;
        })}
        <circle r="5.5" fill="#FFE9B0" />
        <path d="M0 -3 V3 M-3 0 H3" stroke="#7e22ce" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* Arms */}
      <path d="M44 60 Q34 66 34 80" stroke="url(#cg-suit)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <motion.path
        d="M76 60 Q90 58 92 44"
        stroke="url(#cg-suit)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        animate={float ? { rotate: [0, -6, 0] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "76px 60px" }}
      />
      {/* Fist raised */}
      <circle cx="93" cy="42" r="6" fill="#f0b56a" />

      {/* Head */}
      <circle cx="60" cy="40" r="17" fill="#f5c98f" />
      {/* Domino mask */}
      <path d="M45 36 Q60 30 75 36 Q75 43 68 43 Q60 41 52 43 Q45 43 45 36 Z" fill="url(#cg-suit)" />
      <circle cx="53.5" cy="37.5" r="2.2" fill="#fff" />
      <circle cx="66.5" cy="37.5" r="2.2" fill="#fff" />
      {/* Smile */}
      <path d="M53 47 Q60 52 67 47" stroke="#b5764a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hair swoop */}
      <path d="M44 33 Q52 22 60 24 Q70 22 76 33 Q70 28 60 29 Q50 28 44 33 Z" fill="#5b3b1f" />
    </svg>
  );

  if (!float) return inner;
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block"
    >
      {inner}
    </motion.div>
  );
}
