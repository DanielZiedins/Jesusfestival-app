"use client";

import { useEffect } from "react";

/**
 * Shared behaviour every full-screen overlay needs and is easy to forget:
 * the page behind must not scroll, and Escape must get you out.
 *
 * `onEscape` is optional because not every overlay should be dismissible that
 * way — the sign-up gate has its own explicit "explore without signing up"
 * choice, and letting Escape skip it silently would be a different decision.
 */
export function useOverlay(open: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!open) return;

    // Restore whatever was there before rather than assuming "" — another
    // overlay may already have locked scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let onKey: ((e: KeyboardEvent) => void) | undefined;
    if (onEscape) {
      onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onEscape();
      };
      window.addEventListener("keydown", onKey);
    }

    return () => {
      document.body.style.overflow = previous;
      if (onKey) window.removeEventListener("keydown", onKey);
    };
  }, [open, onEscape]);
}
