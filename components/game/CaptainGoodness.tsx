"use client";

import { motion } from "framer-motion";

export type Reaction = "idle" | "cheer" | "celebrate" | "pray";

// Captain Goodness — an original, friendly, heroic guide with animated reactions.
export default function CaptainGoodness({
  size = 120,
  float = true,
  reaction = "idle",
}: {
  size?: number;
  float?: boolean;
  reaction?: Reaction;
}) {
  const excited = reaction === "cheer" || reaction === "celebrate";

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

      {/* Left arm */}
      {reaction === "pray" ? (
        <path d="M44 60 Q50 70 58 74" stroke="url(#cg-suit)" strokeWidth="9" strokeLinecap="round" fill="none" />
      ) : excited ? (
        <path d="M44 60 Q30 58 28 44" stroke="url(#cg-suit)" strokeWidth="9" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M44 60 Q34 66 34 80" stroke="url(#cg-suit)" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}
      {reaction !== "pray" && excited && <circle cx="27" cy="42" r="6" fill="#f0b56a" />}

      {/* Right arm */}
      {reaction === "pray" ? (
        <path d="M76 60 Q70 70 62 74" stroke="url(#cg-suit)" strokeWidth="9" strokeLinecap="round" fill="none" />
      ) : (
        <motion.path
          d="M76 60 Q90 58 92 44"
          stroke="url(#cg-suit)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          animate={float ? { rotate: excited ? [0, -12, 0] : [0, -6, 0] } : undefined}
          transition={{ duration: excited ? 0.5 : 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "76px 60px" }}
        />
      )}
      {reaction !== "pray" && <circle cx="93" cy="42" r="6" fill="#f0b56a" />}
      {/* praying hands */}
      {reaction === "pray" && <circle cx="60" cy="75" r="5" fill="#f0b56a" />}

      {/* Head */}
      <circle cx="60" cy="40" r="17" fill="#f5c98f" />
      {/* Domino mask */}
      <path d="M45 36 Q60 30 75 36 Q75 43 68 43 Q60 41 52 43 Q45 43 45 36 Z" fill="url(#cg-suit)" />
      <circle cx="53.5" cy="37.5" r="2.2" fill="#fff" />
      <circle cx="66.5" cy="37.5" r="2.2" fill="#fff" />
      {/* Smile — bigger when excited */}
      {excited ? (
        <path d="M52 46 Q60 55 68 46 Q60 50 52 46 Z" fill="#8a4b2a" />
      ) : (
        <path d="M53 47 Q60 52 67 47" stroke="#b5764a" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      {/* Hair swoop */}
      <path d="M44 33 Q52 22 60 24 Q70 22 76 33 Q70 28 60 29 Q50 28 44 33 Z" fill="#5b3b1f" />

      {/* Celebrate sparkles */}
      {reaction === "celebrate" &&
        [[20, 24], [100, 26], [16, 66], [104, 62], [60, 8]].map(([x, y], i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}>
            <path d={`M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z`} fill={i % 2 ? "#FFD173" : "#c084fc"} />
          </motion.g>
        ))}
    </svg>
  );

  if (!float) return inner;

  const anim =
    reaction === "celebrate"
      ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] }
      : reaction === "cheer"
      ? { y: [0, -8, 0] }
      : { y: [0, -6, 0] };
  const dur = reaction === "celebrate" ? 0.7 : reaction === "cheer" ? 0.9 : 3;

  return (
    <motion.div animate={anim} transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }} className="inline-block">
      {inner}
    </motion.div>
  );
}
