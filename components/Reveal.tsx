"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-reveal for the whole app.
 *
 * There are 100+ of these on screen across the app (and many more at runtime,
 * since most sit inside `.map()` loops). Each one used to be a Framer Motion
 * `whileInView` element, which means a component instance, a motion value, a
 * rAF subscription and its own IntersectionObserver — every one of them.
 *
 * This is the same effect with none of that: a plain div, a CSS transition on
 * compositor-only properties, and exactly ONE IntersectionObserver shared by
 * every instance on the page. The props are unchanged so no call site had to
 * move.
 *
 * A side benefit that matters at a festival: a CSS transition doesn't need rAF,
 * so the reveal still completes on a throttled tab or a phone in battery saver.
 * A stalled Framer animation used to leave content stuck at opacity 0.
 */

type Callback = () => void;

let observer: IntersectionObserver | null = null;
const pending = new Map<Element, Callback>();

function reveal(el: Element) {
  const run = pending.get(el);
  // Reveal once, then stop watching — matches Framer's `once: true`.
  observer?.unobserve(el);
  pending.delete(el);
  run?.();
}

function shared(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    },
    // Threshold 0 with a bottom inset, rather than "25% of the element", so a
    // section taller than the viewport can still trigger. `amount: 0.25` could
    // never be satisfied by a very tall element.
    { threshold: 0, rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

/**
 * Safety net for a document that mounts while hidden.
 *
 * IntersectionObserver notifications are part of the rendering lifecycle, and a
 * hidden document doesn't run it — so a PWA cold-started into a background tab,
 * or restored from the iOS app switcher, can hydrate with nothing observed and
 * every reveal stuck at opacity 0. One shared rect-based sweep fixes whatever is
 * already on screen; the observer handles everything below the fold once the
 * document is actually being painted.
 */
let sweepQueued = false;

function sweep() {
  sweepQueued = false;
  if (!pending.size) return;
  const limit = (window.innerHeight || 0) * 0.9;
  for (const el of [...pending.keys()]) {
    const r = el.getBoundingClientRect();
    if (r.top < limit && r.bottom > 0) reveal(el);
  }
}

function queueSweep() {
  if (sweepQueued) return;
  sweepQueued = true;
  // Long enough that the observer gets first refusal in the normal case.
  setTimeout(sweep, 700);
}

let watchingVisibility = false;

function watchVisibility() {
  if (watchingVisibility) return;
  watchingVisibility = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") queueSweep();
  });
}

export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("is-in");

    // No observer support (or a very old browser): show it rather than hide it.
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const io = shared();
    pending.set(el, show);
    io.observe(el);
    watchVisibility();
    queueSweep();
    return () => {
      io.unobserve(el);
      pending.delete(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`jf-reveal ${className}`}
      style={
        // Custom properties rather than inline transition/transform, so the
        // stylesheet keeps ownership of the easing and the reduced-motion opt-out.
        {
          "--jf-reveal-y": `${y}px`,
          ...(delay ? { "--jf-reveal-delay": `${delay}s` } : null),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400/90">
      <span className="h-px w-6 bg-gold-400/50" />
      {children}
    </span>
  );
}
