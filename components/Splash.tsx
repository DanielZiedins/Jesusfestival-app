"use client";

import { IMG } from "@/lib/content";

/**
 * `leaving` drives a plain CSS fade instead of a framer `exit`. An exit
 * animation only completes if rAF is running, so on a throttled tab or a
 * low-power device the splash could sit on top of the whole app forever.
 * A CSS transition costs nothing and the parent unmounts us regardless.
 */
export default function Splash({ leaving = false }: { leaving?: boolean }) {
  return (
    <div
      role="status"
      aria-label="Loading Jesus Festival"
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-navy-900 via-ink to-ink transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="bg-radial-glow absolute inset-0" />
      {/* purple + gold ambient orbs */}
      <div className="pointer-events-none absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-purple-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-gold/20 blur-[110px]" />

      {/* CSS entrances throughout: the splash is the first thing a throttled
          tab paints, and a framer opacity:0 start would leave it blank. */}
      <div className="jf-pop relative w-[86%] max-w-sm">
        {/* Plain <img>, not next/image: the splash is the very first paint, so a
            trip through the image optimizer would be the slowest possible route
            to the one asset the user is already staring at. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMG.bannerSplash}
          alt="Jesus Festival"
          width={800}
          height={400}
          fetchPriority="high"
          decoding="async"
          className="h-auto w-full rounded-2xl shadow-card ring-1 ring-white/10"
        />
      </div>

      <p className="jf-rise relative mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
        Hamilton · Sept 4–5, 2026
      </p>

      <div className="jf-fade relative mt-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: "0.2s" }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
