"use client";

// An illustrated city that revives (gray → colorful, dark → glowing) as `pct` rises 0→100.
export default function CityScene({ pct }: { pct: number }) {
  // Smooth reveal of an element as pct passes its threshold.
  const at = (t: number, span = 14) => Math.max(0, Math.min(1, (pct - t) / span));

  const daylight = 0.25 + (pct / 100) * 0.75; // sky brightness
  const saturate = 0.15 + (pct / 100) * 1.15; // gray → colorful
  const lights = at(10);
  const parks = at(25);
  const river = at(40);
  const homes = at(55);
  const church = at(70);
  const stage = at(85);
  const birds = at(55);

  const streetlight = (x: number, y: number) => (
    <g>
      <rect x={x - 1} y={y} width="2" height="26" fill="#5b6472" />
      <circle cx={x} cy={y} r="4" fill="#3a4150" />
      <circle cx={x} cy={y} r="4" fill="#FFE9A8" opacity={lights} />
      <circle cx={x} cy={y} r="10" fill="#FFE9A8" opacity={lights * 0.35} />
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
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10"
      style={{ filter: `saturate(${saturate})` }}
    >
      <svg viewBox="0 0 400 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1e52" />
            <stop offset="1" stopColor="#f0a86a" stopOpacity={daylight} />
          </linearGradient>
          <linearGradient id="riverG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3aa0d8" />
            <stop offset="1" stopColor="#2e7fb8" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="220" fill="#20182f" />
        <rect width="400" height="150" fill="url(#sky)" />
        {/* Sun/moon */}
        <circle cx="330" cy="46" r="18" fill="#FFE9A8" opacity={0.3 + (pct / 100) * 0.7} />

        {/* Birds */}
        <g opacity={birds} fill="none" stroke="#2c2536" strokeWidth="1.6" strokeLinecap="round">
          <path d="M60 40 q5 -5 10 0 q5 -5 10 0" />
          <path d="M95 30 q4 -4 8 0 q4 -4 8 0" />
          <path d="M130 44 q4 -4 8 0 q4 -4 8 0" />
        </g>

        {/* Distant hills */}
        <path d="M0 150 Q100 118 200 150 T400 150 V220 H0 Z" fill="#2e5a3e" />

        {/* River */}
        <path d="M0 176 Q120 168 200 182 T400 176 V210 H0 Z" fill="#3a4150" />
        <path d="M0 176 Q120 168 200 182 T400 176 V210 H0 Z" fill="url(#riverG)" opacity={river} />

        {/* Ground */}
        <rect y="150" width="400" height="70" fill="#43663f" />

        {/* Buildings / homes */}
        {[
          { x: 20, w: 34, h: 60, c: "#c65b7c" },
          { x: 60, w: 26, h: 46, c: "#e0a13a" },
          { x: 300, w: 30, h: 54, c: "#5b8fd6" },
          { x: 336, w: 40, h: 66, c: "#7c5ad0" },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={150 - b.h} width={b.w} height={b.h} fill="#39404d" />
            <rect x={b.x} y={150 - b.h} width={b.w} height={b.h} fill={b.c} opacity={homes} />
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 6 + c * (b.w - 16)}
                  y={150 - b.h + 8 + r * 16}
                  width="7"
                  height="9"
                  fill="#FFE9A8"
                  opacity={homes * 0.9}
                />
              ))
            )}
          </g>
        ))}

        {/* Church (center) */}
        <g>
          <rect x="170" y="104" width="60" height="46" fill="#3a4150" />
          <rect x="170" y="104" width="60" height="46" fill="#ddd3c4" opacity={church} />
          <path d="M170 104 L200 78 L230 104 Z" fill="#4a4038" />
          <path d="M170 104 L200 78 L230 104 Z" fill="#b9a892" opacity={church} />
          {/* Steeple cross */}
          <rect x="198.5" y="64" width="3" height="16" fill="#8a7b63" />
          <rect x="195" y="68" width="10" height="3" fill="#8a7b63" />
          {/* Glow */}
          <circle cx="200" cy="126" r="40" fill="#FFE9A8" opacity={church * 0.25} />
          {/* Door + windows lit */}
          <rect x="195" y="128" width="10" height="22" fill="#7c5a34" opacity={0.5 + church * 0.5} />
          <rect x="178" y="116" width="8" height="12" fill="#FFE9A8" opacity={church} />
          <rect x="214" y="116" width="8" height="12" fill="#FFE9A8" opacity={church} />
        </g>

        {/* Festival stage (bandshell) */}
        <g>
          <path d="M250 150 A34 34 0 0 1 318 150 Z" fill="#3a4150" />
          <path d="M250 150 A34 34 0 0 1 318 150 Z" fill="#2fb6c4" opacity={stage} />
          <rect x="278" y="132" width="12" height="18" fill="#1f2733" />
          {/* stage lights */}
          <circle cx="268" cy="136" r="3" fill="#FFE9A8" opacity={stage} />
          <circle cx="300" cy="136" r="3" fill="#FFE9A8" opacity={stage} />
          <circle cx="284" cy="128" r="3" fill="#F5A623" opacity={stage} />
        </g>

        {/* Trees & park */}
        {tree(100, 138, 1)}
        {tree(122, 142, 0.8)}
        {tree(150, 140, 0.9)}
        {/* Flowers */}
        <g opacity={parks}>
          {[92, 112, 134, 156].map((x) => (
            <g key={x}>
              <circle cx={x} cy="158" r="2.5" fill="#ff6fae" />
              <circle cx={x + 6} cy="160" r="2.5" fill="#ffd23f" />
            </g>
          ))}
        </g>

        {/* Streetlights */}
        {streetlight(45, 124)}
        {streetlight(255, 124)}
        {streetlight(360, 118)}

        {/* Little people appear as it revives */}
        <g opacity={homes}>
          {[190, 205, 220].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="186" r="3" fill={["#ffd23f", "#5b8fd6", "#ff6fae"][i]} />
              <rect x={x - 2} y="189" width="4" height="8" rx="2" fill={["#c65b7c", "#7c5ad0", "#3fa564"][i]} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
