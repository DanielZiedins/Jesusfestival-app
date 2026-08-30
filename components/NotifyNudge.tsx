"use client";

import { useEffect, useState } from "react";
import { pushSupported, pushEnabled, subscribeToPush } from "@/lib/push";
import { haptic } from "@/lib/game";
import { BellIcon, Check } from "@/components/icons";

const DISMISS_KEY = "jf-notify-nudge";

// A warm, dismissible invitation to turn on alerts — this is what actually
// activates milestone / artist-reveal / weekly pushes for the community.
export default function NotifyNudge() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!pushSupported() || pushEnabled()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "off") return;
      // Don't block Notification.permission === "denied" users with a dead button.
      if (typeof Notification !== "undefined" && Notification.permission === "denied") return;
    } catch {
      /* ignore */
    }
    // Let the hero land first, then invite them.
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "off");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  async function enable() {
    if (busy) return;
    setBusy(true);
    setErr(null);
    const res = await subscribeToPush();
    setBusy(false);
    if (res.ok) {
      haptic(20);
      setDone(true);
      setTimeout(() => setShow(false), 2200);
    } else {
      setErr(res.error || "Couldn't turn on alerts.");
    }
  }

  return (
    <>
      {show && (
        <div className="jf-pop relative overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-700/35 via-ink/70 to-gold/10 p-5">
          <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-purple-500/25 blur-3xl" />
          <div className="relative flex items-start gap-3.5">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold/25 to-purple-600/30 text-gold-400">
              {done ? <Check width={22} height={22} /> : <BellIcon width={22} height={22} />}
              {!done && (
                <span className="absolute inset-0 animate-ping-slow rounded-2xl ring-2 ring-gold/40" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              {done ? (
                <>
                  <h3 className="font-display text-lg font-extrabold text-white">You&apos;re all set! 🔔</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-white/70">
                    We&apos;ll let you know the moment something big happens.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-display text-lg font-extrabold text-white">Never miss a moment</h3>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-white/70">
                    Get a gentle ping for <span className="font-semibold text-white">artist reveals</span>, set times, and when the community hits a
                    milestone together. No spam — just the good stuff.
                  </p>
                  {err && <p className="mt-2 text-[12px] font-medium text-rose-300">{err}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={enable}
                      disabled={busy}
                      className="rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-2.5 text-[13px] font-extrabold text-navy-950 shadow-glow active:scale-95 disabled:opacity-60"
                    >
                      {busy ? "Turning on…" : "Turn on alerts"}
                    </button>
                    <button onClick={dismiss} className="rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/50 active:scale-95">
                      Not now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
