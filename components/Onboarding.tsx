"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { joinFestival } from "@/lib/supabase";
import { ArrowRight, Check, Sparkle } from "./icons";

const PERKS = [
  { emoji: "📅", text: "Schedule & set times as they drop" },
  { emoji: "🎤", text: "Be first to hear artist announcements" },
  { emoji: "🎮", text: "Unlock the Revive the City game" },
  { emoji: "🔔", text: "Surprise reveals & festival updates" },
];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [church, setChurch] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length >= 2 && isEmail(email);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    const res = await joinFestival({ full_name: name, email, phone, church });
    if (!res.ok) {
      setError("We couldn't save that — check your connection and try again.");
      setBusy(false);
      return;
    }
    try {
      localStorage.setItem("jf-joined", "1");
      localStorage.setItem("jf-name", name.trim().split(" ")[0]);
      if (church.trim()) localStorage.setItem("jf-church", church.trim());
    } catch {
      /* ignore */
    }
    setDone(true);
    setTimeout(onDone, 1400);
  }

  function skip() {
    try {
      localStorage.setItem("jf-joined", "skip");
    } catch {
      /* ignore */
    }
    onDone();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-gradient-to-b from-navy-900 via-ink to-ink"
    >
      <div className="pointer-events-none fixed -left-16 top-10 h-72 w-72 rounded-full bg-purple-600/30 blur-[120px]" />
      <div className="pointer-events-none fixed -right-16 bottom-10 h-72 w-72 rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-10 safe-top safe-bottom">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-glow"
              >
                <Check width={40} height={40} />
              </motion.div>
              <h2 className="mt-6 font-display text-3xl font-bold text-white">You&apos;re in! 🙌</h2>
              <p className="mt-2 text-white/70">Welcome to the movement. Let&apos;s go…</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Logo */}
              <div className="mb-6 flex flex-col items-center text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-mark-white.png" alt="Jesus Festival" className="h-16 w-auto drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]" />
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
                  <Sparkle width={12} height={12} /> Hamilton 2026
                </div>
                <h1 className="mt-3 font-display text-[34px] font-extrabold leading-tight text-white">
                  Join the <span className="text-gradient-gold">movement</span>
                </h1>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                  Get inside the app and be part of what God is doing in the city. It takes 10 seconds.
                </p>
              </div>

              {/* Perks */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                {PERKS.map((p) => (
                  <div key={p.text} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-[11px] font-medium leading-tight text-white/75">{p.text}</span>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-3">
                <Field label="Full name" required>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="jf-input"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    inputMode="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="jf-input"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" optional>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      inputMode="tel"
                      placeholder="Optional"
                      autoComplete="tel"
                      className="jf-input"
                    />
                  </Field>
                  <Field label="Church" optional>
                    <input
                      value={church}
                      onChange={(e) => setChurch(e.target.value)}
                      placeholder="Optional"
                      className="jf-input"
                    />
                  </Field>
                </div>

                {error && <p className="text-center text-xs font-medium text-rose-300">{error}</p>}

                <button
                  type="submit"
                  disabled={!valid || busy}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-4 text-base font-bold text-navy-950 shadow-glow transition active:scale-[0.98] disabled:opacity-40"
                >
                  {busy ? "Joining…" : "Let's go"} <ArrowRight width={18} height={18} />
                </button>
              </form>

              <button onClick={skip} className="mt-4 w-full text-center text-xs font-medium text-white/45 underline-offset-2 hover:underline">
                Just exploring? Skip for now
              </button>
              <p className="mt-4 text-center text-[10px] leading-relaxed text-white/35">
                We&apos;ll only use your info to share Jesus Festival updates. No spam, ever.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/55">
        {label}
        {required && <span className="text-gold-400">*</span>}
        {optional && <span className="text-white/30">(optional)</span>}
      </span>
      {children}
    </label>
  );
}
