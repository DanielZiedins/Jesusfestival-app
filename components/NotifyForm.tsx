"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, supabaseReady } from "@/lib/supabase";
import { INTERESTS } from "@/lib/content";
import { Check, BellIcon } from "./icons";

type Status = "idle" | "loading" | "done" | "error";

export default function NotifyForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>(["updates"]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const toggle = (id: string) =>
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = firstName.trim();
    const mail = email.trim().toLowerCase();
    if (!name) return setError("Please add your first name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      return setError("Please enter a valid email.");
    if (!supabaseReady) return setError("Sign-ups are temporarily unavailable.");

    setStatus("loading");
    const { error: err } = await supabase.from("jesus_festival_subscribers").insert({
      first_name: name,
      email: mail,
      interests: interests.length ? interests : ["updates"],
      source: "jesusfestival.app",
      signup_page: "app",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    if (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
      return;
    }
    setStatus("done");
  };

  return (
    <div className="glass-strong rounded-3xl p-5 shadow-card">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gold text-navy-950 shadow-glow">
              <Check width={30} height={30} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-white">You&apos;re in!</h3>
            <p className="mt-1.5 max-w-xs text-sm text-white/65">
              We&apos;ll keep you posted on artists, schedule, and everything for
              Hamilton 2026. See you at Gage Park.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={submit}
            className="space-y-3.5"
          >
            <div className="flex items-center gap-2 text-gold-400">
              <BellIcon width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Be the first to know
              </span>
            </div>

            <input
              type="text"
              inputMode="text"
              autoComplete="given-name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-gold/60"
            />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-gold/60"
            />

            <div className="flex flex-wrap gap-2 pt-0.5">
              {INTERESTS.map((it) => {
                const on = interests.includes(it.id);
                return (
                  <button
                    type="button"
                    key={it.id}
                    onClick={() => toggle(it.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      on
                        ? "border-gold bg-gold text-navy-950"
                        : "border-white/15 bg-white/5 text-white/70"
                    }`}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>

            {error && <p className="text-sm text-ember-400">{error}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-gradient-to-r from-gold-400 to-ember-500 py-3.5 font-display text-base font-bold text-navy-950 shadow-glow transition active:scale-[0.98] disabled:opacity-60"
            >
              {status === "loading" ? "Signing you up…" : "Notify Me"}
            </button>
            <p className="text-center text-[11px] text-white/40">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
