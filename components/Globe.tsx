"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchSignupLocations, type SignupLocation } from "@/lib/supabase";

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

export default function Globe() {
  const [locs, setLocs] = useState<SignupLocation[]>([]);
  const [rot, setRot] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    fetchSignupLocations().then(setLocs);
  }, []);

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      setRot((r) => (r + dt * 0.012) % 360); // slow, steady spin
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const total = locs.reduce((s, l) => s + l.n, 0);
  const countries = locs.length;

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
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.82" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="1" stopColor="#a855f7" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* atmosphere */}
          <circle cx={CX} cy={CY} r={R + 6} fill="url(#glow)" />
          {/* ocean sphere */}
          <circle cx={CX} cy={CY} r={R} fill="url(#ocean)" />

          {/* latitude lines (static — circles of latitude are rotation-invariant) */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const phi = (lat * Math.PI) / 180;
            const ry = R * Math.cos(phi) * 0.28;
            const cy = CY - R * Math.sin(phi);
            const rx = R * Math.cos(phi);
            return <ellipse key={lat} cx={CX} cy={cy} rx={rx} ry={ry} fill="none" stroke="#ffffff" strokeOpacity={0.1} strokeWidth="1" />;
          })}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="#ffffff" strokeOpacity={0.08} strokeWidth="1" />

          {/* markers */}
          {locs.map((l) => {
            const p = project(l.lat, l.lng, rot);
            const front = p.z > -0.1;
            if (!front) return null;
            const size = 2.5 + Math.min(9, Math.sqrt(l.n) * 2.2);
            const op = 0.45 + 0.55 * Math.max(0, p.z);
            return (
              <g key={l.country} opacity={op}>
                <motion.circle cx={p.x} cy={p.y} r={size + 4} fill="#F5A623" opacity={0.25} animate={{ r: [size + 3, size + 8, size + 3], opacity: [0.28, 0, 0.28] }} transition={{ duration: 2.2, repeat: Infinity }} />
                <circle cx={p.x} cy={p.y} r={size} fill="#FFD173" stroke="#fff" strokeWidth="1" />
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
          {countries > 0 && <span className="text-white/50"> · {countries} {countries === 1 ? "country" : "countries"}</span>}
        </p>
        <p className="text-[12px] text-white/55">…and the movement is spreading. Add your light! 🌍</p>
      </div>
    </div>
  );
}
