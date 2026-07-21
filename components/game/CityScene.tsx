"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// An illustrated Hamilton that revives (gray & dark → colorful & glowing) as `pct` rises 0→100.
// The cross on the hill shines brighter as the city comes alive — the light of the city is Jesus.
function CityScene({ pct }: { pct: number }) {
  const at = (t: number, span = 14) => Math.max(0, Math.min(1, (pct - t) / span));

  const daylight = 0.2 + (pct / 100) * 0.8;
  const saturate = 0.12 + (pct / 100) * 1.2;
  const night = 1 - Math.min(1, pct / 60); // stars fade out by ~60%
  const lights = at(10);
  const parks = at(25);
  const river = at(40);
  const homes = at(55);
  const church = at(70);
  const rainbow = at(70, 12);
  const stage = at(85);
  const fireworks = at(88, 8);
  const birds = at(55);
  const crossGlow = 0.15 + (pct / 100) * 0.85;

  const streetlight = (x: number, y: number) => (
    <g>
      <rect x={x - 1} y={y} width="2" height="26" fill="#5b6472" />
      <circle cx={x} cy={y} r="4" fill="#3a4150" />
      <circle cx={x} cy={y} r="4" fill="#FFE9A8" opacity={lights} />
      <circle cx={x} cy={y} r="11" fill="#FFE9A8" opacity={lights * 0.35} />
    </g>
  );
  const tree = (x: number, y: number, s = 1) => (
    <g opacity={parks} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="0" width="4" height="12" fill="#7c5a34" />
      <circle cx="0" cy="-4" r="10" fill="#3fa564" />
      <circle cx="-6" cy="0" r="7" fill="#4bb873" />
      <circle cx="6" cy="0" r="7" fill="#4bb873" />
    </g>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10" style={{ filter: `saturate(${saturate})` }}>
      <svg viewBox="0 0 400 240" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1e52" />
            <stop offset="0.6" stopColor="#5b3b7a" stopOpacity={daylight} />
            <stop offset="1" stopColor="#f0a86a" stopOpacity={daylight} />
          </linearGradient>
          <linearGradient id="riverG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3aa0d8" />
            <stop offset="1" stopColor="#2e7fb8" />
          </linearGradient>
          <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF4D6" />
            <stop offset="1" stopColor="#FFC24D" />
          </radialGradient>
          <radialGradient id="crossHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="240" fill="#1a1330" />
        <rect width="400" height="170" fill="url(#sky)" />

        {/* Stars (fade as day breaks) — unmounted entirely once invisible */}
        {night > 0.02 && (
        <g opacity={night}>
          {[[30, 26], [70, 40], [110, 20], [150, 46], [250, 24], [300, 44], [340, 22], [380, 40], [200, 16], [90, 60], [320, 62], [180, 58]].map(([x, y], k) => (
            <motion.circle key={k} cx={x} cy={y} r={k % 3 === 0 ? 1.6 : 1} fill="#fff" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2 + (k % 4), repeat: Infinity, delay: (k % 5) * 0.4 }} />
          ))}
        </g>
        )}

        {/* Sun/moon — rises as the city revives */}
        <circle cx={320} cy={70 - (pct / 100) * 34} r="16" fill="url(#sun)" opacity={0.35 + (pct / 100) * 0.65} />

        {/* Rainbow */}
        <g opacity={rainbow} fill="none" strokeWidth="3">
          {["#ff6fae", "#ffd23f", "#4bb873", "#3aa0d8"].map((c, k) => (
            <path key={c} d={`M60 150 A ${120 - k * 6} ${120 - k * 6} 0 0 1 ${300} 150`} stroke={c} opacity="0.55" transform={`translate(0 ${k * 7})`} />
          ))}
        </g>

        {/* Fireworks at high revival — only animate when actually visible */}
        {fireworks > 0.01 && (
        <g opacity={fireworks}>
          {[[110, 55, "#ffd23f"], [300, 45, "#ff6fae"], [210, 35, "#a855f7"]].map(([x, y, c], k) => (
            <g key={k}>
              {Array.from({ length: 10 }).map((_, r) => {
                const a = (r / 10) * Math.PI * 2;
                return (
                  <motion.line
                    key={r}
                    x1={x as number}
                    y1={y as number}
                    x2={(x as number) + Math.cos(a) * 14}
                    y2={(y as number) + Math.sin(a) * 14}
                    stroke={c as string}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.5 + (r % 3) * 0.1 }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                );
              })}
            </g>
          ))}
        </g>
        )}

        {/* Distant hills */}
        <path d="M0 150 Q100 120 200 150 T400 150 V240 H0 Z" fill="#2e5a3e" />

        {/* Hill with the cross — the light of the city */}
        <path d="M250 150 Q320 108 400 140 V170 H250 Z" fill="#254a34" />
        <g transform="translate(348 118)">
          <circle cx="0" cy="0" r="26" fill="url(#crossHalo)" opacity={crossGlow} />
          <rect x="-2.2" y="-20" width="4.4" height="34" rx="1.5" fill="#efe3c6" opacity={0.5 + crossGlow * 0.5} />
          <rect x="-9" y="-11" width="18" height="4.2" rx="1.5" fill="#efe3c6" opacity={0.5 + crossGlow * 0.5} />
        </g>

        {/* River */}
        <path d="M0 178 Q120 170 200 184 T400 178 V214 H0 Z" fill="#3a4150" />
        <path d="M0 178 Q120 170 200 184 T400 178 V214 H0 Z" fill="url(#riverG)" opacity={river} />

        {/* Ground */}
        <rect y="150" width="400" height="90" fill="#43663f" />

        {/* Buildings */}
        {[
          { x: 16, w: 30, h: 58, c: "#c65b7c" },
          { x: 52, w: 24, h: 44, c: "#e0a13a" },
          { x: 82, w: 20, h: 66, c: "#5b8fd6" },
          { x: 300, w: 26, h: 50, c: "#5b8fd6" },
          { x: 332, w: 34, h: 62, c: "#7c5ad0" },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={150 - b.h} width={b.w} height={b.h} fill="#39404d" />
            <rect x={b.x} y={150 - b.h} width={b.w} height={b.h} fill={b.c} opacity={homes} />
            {[0, 1, 2, 3].map((r) =>
              [0, 1].map((c) => (
                <rect key={`${r}-${c}`} x={b.x + 5 + c * (b.w - 13)} y={150 - b.h + 7 + r * 14} width="6" height="8" fill="#FFE9A8" opacity={lights * 0.9} />
              ))
            )}
          </g>
        ))}

        {/* Church */}
        <g>
          <rect x="150" y="104" width="56" height="46" fill="#3a4150" />
          <rect x="150" y="104" width="56" height="46" fill="#ddd3c4" opacity={church} />
          <path d="M150 104 L178 80 L206 104 Z" fill="#4a4038" />
          <path d="M150 104 L178 80 L206 104 Z" fill="#b9a892" opacity={church} />
          <rect x="176.5" y="66" width="3" height="16" fill="#8a7b63" />
          <rect x="173" y="70" width="10" height="3" fill="#8a7b63" />
          <circle cx="178" cy="126" r="38" fill="#FFE9A8" opacity={church * 0.22} />
          <rect x="173" y="128" width="10" height="22" fill="#7c5a34" opacity={0.5 + church * 0.5} />
          <rect x="158" y="116" width="8" height="12" fill="#FFE9A8" opacity={church} />
          <rect x="190" y="116" width="8" height="12" fill="#FFE9A8" opacity={church} />
        </g>

        {/* Festival stage */}
        <g>
          <path d="M226 150 A30 30 0 0 1 286 150 Z" fill="#3a4150" />
          <path d="M226 150 A30 30 0 0 1 286 150 Z" fill="#2fb6c4" opacity={stage} />
          <rect x="250" y="134" width="12" height="16" fill="#1f2733" />
          <circle cx="240" cy="138" r="3" fill="#FFE9A8" opacity={stage} />
          <circle cx="272" cy="138" r="3" fill="#FFE9A8" opacity={stage} />
          <circle cx="256" cy="130" r="3" fill="#F5A623" opacity={stage} />
        </g>

        {/* Trees & flowers */}
        {tree(104, 140, 1)}
        {tree(124, 144, 0.8)}
        {tree(300, 150, 0.9)}
        <g opacity={parks}>
          {[96, 116, 136, 292, 312].map((x) => (
            <g key={x}>
              <circle cx={x} cy="160" r="2.5" fill="#ff6fae" />
              <circle cx={x + 6} cy="162" r="2.5" fill="#ffd23f" />
            </g>
          ))}
        </g>

        {/* Streetlights */}
        {streetlight(42, 124)}
        {streetlight(220, 126)}
        {streetlight(360, 120)}

        {/* People */}
        <g opacity={homes}>
          {[168, 184, 200, 216].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="188" r="3" fill={["#ffd23f", "#5b8fd6", "#ff6fae", "#4bb873"][i]} />
              <rect x={x - 2} y="191" width="4" height="8" rx="2" fill={["#c65b7c", "#7c5ad0", "#3fa564", "#e0a13a"][i]} />
            </g>
          ))}
        </g>

        {/* Birds */}
        <g opacity={birds} fill="none" stroke="#2c2536" strokeWidth="1.6" strokeLinecap="round">
          <path d="M60 44 q5 -5 10 0 q5 -5 10 0" />
          <path d="M96 34 q4 -4 8 0 q4 -4 8 0" />
          <path d="M132 48 q4 -4 8 0 q4 -4 8 0" />
        </g>
      </svg>
    </div>
  );
}

// Re-render only when the community % actually changes.
export default memo(CityScene);
