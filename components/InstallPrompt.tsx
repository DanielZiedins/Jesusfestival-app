"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Share } from "./icons";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "jf-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS never fires beforeinstallprompt — show manual hint after a beat.
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIOS()) {
      setIos(true);
      t = setTimeout(() => setShow(true), 2600);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="pointer-events-auto fixed inset-x-3 bottom-[88px] z-50 mx-auto max-w-md"
        >
          <div className="glass-strong flex items-center gap-3 rounded-2xl p-3 shadow-card">
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-ink ring-1 ring-purple-500/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark-white.png" alt="" className="h-7 w-auto" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Add to Home Screen</p>
              <p className="truncate text-xs text-white/60">
                {ios ? "Tap Share → “Add to Home Screen”" : "Install the Jesus Festival app"}
              </p>
            </div>
            {ios ? (
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-gold-400">
                <Share width={18} height={18} />
              </div>
            ) : (
              <button
                onClick={install}
                className="flex items-center gap-1.5 rounded-xl bg-gold px-3.5 py-2 text-sm font-bold text-navy-950 active:scale-95"
              >
                <Download width={16} height={16} />
                Install
              </button>
            )}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/40 hover:text-white/80"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
