"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Renders children at document.body so full-screen overlays escape any
// parent stacking context (e.g. the animated <main>) and cover the nav.
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
