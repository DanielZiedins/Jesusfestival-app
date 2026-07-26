"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Branded one-click unsubscribe (reached from the email footer / List-Unsubscribe).
export default function UnsubscribePage() {
  const [state, setState] = useState<"loading" | "done" | "resubscribed" | "error">("loading");
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") || "";
    setToken(t);
    if (!t) {
      setState("error");
      return;
    }
    supabase.rpc("email_unsubscribe", { p_token: t }).then(
      ({ data }) => {
        if (data?.ok) {
          setName(data.name ?? null);
          setState("done");
        } else {
          setState("error");
        }
      },
      () => setState("error")
    );
  }, []);

  async function resubscribe() {
    if (busy || !token) return;
    setBusy(true);
    const { data } = await supabase.rpc("email_resubscribe", { p_token: token });
    setBusy(false);
    if (data?.ok) setState("resubscribed");
  }

  const first = name ? name.trim().split(/\s+/)[0] : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-16">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-navy-900/80 to-ink/80 p-8 text-center backdrop-blur">
        <img src="/brand/logo-mark-white.png" alt="Jesus Festival" className="mx-auto mb-5 h-14 w-14" />

        {state === "loading" && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
            <p className="mt-4 text-sm text-white/60">One moment…</p>
          </>
        )}

        {state === "done" && (
          <>
            <h1 className="font-display text-2xl font-extrabold text-white">
              {first ? `You're unsubscribed, ${first}.` : "You're unsubscribed."}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              We&apos;ve stopped the encouragement emails — no hard feelings. 💛 You&apos;re still fully part of the app, and you can rejoin the emails anytime.
            </p>
            <figure className="mt-5 rounded-2xl border border-white/10 bg-purple-900/20 p-4">
              <blockquote className="text-sm italic text-white/85">&ldquo;The Lord bless you and keep you; the Lord make his face shine on you.&rdquo;</blockquote>
              <figcaption className="mt-2 text-[11px] font-bold uppercase tracking-widest text-gold-400">Numbers 6:24–25</figcaption>
            </figure>
            <button
              onClick={resubscribe}
              disabled={busy}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 font-bold text-navy-950 shadow-glow active:scale-95 disabled:opacity-60"
            >
              {busy ? "…" : "Actually, keep me subscribed 💛"}
            </button>
            <a href="https://www.jesusfestival.app" className="mt-3 inline-block text-sm font-semibold text-white/60 underline-offset-2 hover:underline">
              Open the app →
            </a>
          </>
        )}

        {state === "resubscribed" && (
          <>
            <h1 className="font-display text-2xl font-extrabold text-white">You&apos;re back in! 🎉</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              So glad to keep encouraging you. We&apos;ll see you in your inbox — and at Gage Park, Sept 4–5. 💛
            </p>
            <a
              href="https://www.jesusfestival.app"
              className="mt-6 inline-block w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 font-bold text-navy-950 shadow-glow active:scale-95"
            >
              Open the app →
            </a>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="font-display text-2xl font-extrabold text-white">Link expired</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              This unsubscribe link looks invalid. If you&apos;d like to update your email preferences, just reply to any of our emails and we&apos;ll take care of it.
            </p>
            <a
              href="https://www.jesusfestival.app"
              className="mt-6 inline-block w-full rounded-2xl bg-white/10 py-3.5 font-bold text-white active:scale-95"
            >
              Open the app →
            </a>
          </>
        )}
      </div>
    </main>
  );
}
