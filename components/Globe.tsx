"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchSignupLocations, type SignupLocation } from "@/lib/supabase";
import { CONTINENTS } from "@/lib/continents";

const R = 130;
const CX = 150;
const CY = 150;

function project(lat: number, lng: number, rot: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = ((lng + rot) * Math.PI) / 180;
  const x = Math.cos(phi) * Math.sin(lambda);
  const y = Math.sin(phi);
  const z = Math.cos(phi) * Math.cos(lambda);
  return { x: CX + R * x, y: CY - R * y, z };
}

// Build an SVG path for a lat/lng polygon; back-facing vertices are clamped to
// the horizon circle so continents slide smoothly around the limb of the Earth.
function polygonPath(points: [number, number][], rot: number): string | null {
  let maxZ = -1;
  const pts = points.map(([lat, lng]) => {
    const p = project(lat, lng, rot);
    if (p.z > maxZ) maxZ = p.z;
    if (p.z < 0) {
      const dx = p.x - CX;
      const dy = p.y - CY;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: CX + (dx / d) * R, y: CY + (dy / d) * R };
    }
    return { x: p.x, y: p.y };
  });
  if (maxZ < 0.02) return null; // fully behind the globe
  return `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L")}Z`;
}

export default function Globe() {
  const [locs, setLocs] = useState<SignupLocation[]>([]);
  const [rot, setRot] = useState(200); // start over the Americas (Hamilton!)
  const raf = useRef<number | null>(null);

  useEffect(() => {
    fetchSignupLocations().then(setLocs);
  }, []);

  useEffect(() => {
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      // ~25fps rotation updates — plenty smooth for a slow spin, easy on phones.
      if (acc >= 40) {
        setRot((r) => (r + acc * 0.012) % 360);
        acc = 0;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const land = useMemo(
    () => CONTINENTS.map((c) => ({ name: c.name, d: polygonPath(c.points, rot) })).filter((c) => c.d),
    [rot]
  );

  const total = locs.reduce((s, l) => s + l.n, 0);
  const places = locs.length;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-purple-500/20 blur-3xl" />
        <svg viewBox="0 0 300 300" className="w-full max-w-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ocean" cx="0.38" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#2f7fce" />
              <stop offset="0.6" stopColor="#1b4a86" />
              <stop offset="1" stopColor="#0c1f3f" />
            </radialGradient>
            <linearGradient id="landG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5fbf7a" />
              <stop offset="1" stopColor="#2e7d4f" />
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.82" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="1" stopColor="#a855f7" stopOpacity="0.5" />
            </radialGradient>
            <radialGradient id="shade" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0.55" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.45" />
            </radialGradient>
            <clipPath id="sphere">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
          </defs>

          {/* atmosphere */}
          <circle cx={CX} cy={CY} r={R + 6} fill="url(#glow)" />
          {/* ocean */}
          <circle cx={CX} cy={CY} r={R} fill="url(#ocean)" />

          {/* continents */}
          <g clipPath="url(#sphere)">
            {land.map((c) => (
              <path key={c.name} d={c.d!} fill="url(#landG)" stroke="#1d4d33" strokeWidth="0.6" opacity="0.95" />
            ))}
          </g>

          {/* soft sphere shading for depth */}
          <circle cx={CX} cy={CY} r={R} fill="url(#shade)" />

          {/* signup markers */}
          {locs.map((l) => {
            const p = project(l.lat, l.lng, rot);
            if (p.z < -0.05) return null;
            const size = 2.5 + Math.min(8, Math.sqrt(l.n) * 2);
            const op = 0.45 + 0.55 * Math.max(0, p.z);
            const showLabel = p.z > 0.55;
            return (
              <g key={l.label} opacity={op}>
                <motion.circle cx={p.x} cy={p.y} r={size + 4} fill="#F5A623" opacity={0.25} animate={{ r: [size + 3, size + 8, size + 3], opacity: [0.28, 0, 0.28] }} transition={{ duration: 2.2, repeat: Infinity }} />
                <circle cx={p.x} cy={p.y} r={size} fill="#FFD173" stroke="#fff" strokeWidth="1" />
                {showLabel && (
                  <text x={p.x} y={p.y - size - 5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" style={{ paintOrder: "stroke" }} stroke="#0a0510" strokeWidth="2.5">
                    {l.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* rim */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#ffffff" strokeOpacity={0.15} strokeWidth="1.5" />
        </svg>
      </div>

      <div className="mt-2 text-center">
        <p className="font-display text-lg font-bold text-white">
          {total > 0 ? `${total.toLocaleString()} joining` : "Be the first to join"}
          {places > 0 && <span className="text-white/50"> · {places} {places === 1 ? "place" : "places"}</span>}
        </p>
        <p className="text-[12px] text-white/55">…and the movement is spreading. Add your light! 🌍</p>
      </div>
    </div>
  );
}
