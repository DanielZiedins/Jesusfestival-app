"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Portal from "@/components/Portal";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { useOverlay } from "@/lib/useOverlay";
import { haptic } from "@/lib/game";
import { DISCIPLESHIP } from "@/lib/content";
import {
  GOSPEL,
  PRAYER,
  QUESTIONS,
  STEPS,
  clearNewLife,
  daysSince,
  getNewLife,
  markDecision,
  prettyDate,
  shareTestimony,
  toggleStep,
  type NewLife,
  type Standing,
} from "@/lib/newlife";
import { ArrowRight, Check, CrossIcon, Heart, Share, Sparkle } from "@/components/icons";

/**
 * "I said yes to Jesus" — the reason the festival exists.
 *
 * Everything here works with no account and no signal (see lib/newlife.ts), and
 * it is intentionally kept away from the game: no points, no badges, no shared
 * counter. The one thing it does ask for is nothing at all.
 */
export default function NewLifeScreen({ go }: { go?: (view: string) => void }) {
  const [state, setState] = useState<NewLife | null>(null);
  const [mounted, setMounted] = useState(false);
  const [celebrate, setCelebrate] = useState<Standing | null>(null);
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setState(getNewLife());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function decide(standing: Standing) {
    haptic([30, 40, 60]);
    const next = markDecision(standing);
    setState(next);
    setCelebrate(standing);
    setOpenStep(STEPS[0].id);
  }

  async function share() {
    const r = await shareTestimony(state?.standing ?? "new");
    if (r) setToast(r === "shared" ? "Sent 💛" : "Copied — paste it wherever you like 💛");
  }

  function runAction(step: (typeof STEPS)[number]) {
    if (step.go === "share") {
      void share();
      return;
    }
    if (step.go === "prayer") go?.("prayer");
    else if (step.go === "map") go?.("map");
    else if (step.go === "discipleship") go?.("discipleship");
  }

  // Server render and first client render must match, so the two views only
  // diverge once we've read localStorage.
  const decided = mounted && state !== null;

  return (
    <div className="px-4 pb-8">
      {celebrate && <Rejoicing standing={celebrate} onClose={() => setCelebrate(null)} />}

      {decided ? (
        <Journey
          state={state!}
          openStep={openStep}
          setOpenStep={setOpenStep}
          onToggle={(id) => {
            haptic(18);
            const next = toggleStep(id);
            if (next) setState(next);
          }}
          onAction={runAction}
          onShare={share}
          onReset={() => {
            clearNewLife();
            setState(null);
            setToast("Cleared — this is your phone, your call. 💛");
          }}
          go={go}
        />
      ) : (
        <Invitation
          onDecide={decide}
          openQ={openQ}
          setOpenQ={setOpenQ}
          ready={mounted}
        />
      )}

      {toast && (
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-[85] flex justify-center px-4">
          <div className="max-w-[92%] rounded-full border border-gold/40 bg-navy-950/95 px-4 py-2 text-center text-[12.5px] font-bold text-gold-400 shadow-glow backdrop-blur">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ Before: the invitation ══════════════════════ */

function Invitation({
  onDecide,
  openQ,
  setOpenQ,
  ready,
}: {
  onDecide: (s: Standing) => void;
  openQ: number | null;
  setOpenQ: (n: number | null) => void;
  ready: boolean;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden px-6 pb-8 pt-10 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[90px]" />
          <div className="absolute left-1/4 top-10 h-48 w-48 rounded-full bg-purple-500/25 blur-[80px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="relative mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/20 to-purple-600/20 text-gold-400"
        >
          <CrossIcon width={38} height={38} />
        </motion.div>
        <div className="relative mt-5">
          <Eyebrow>The reason we do all of this</Eyebrow>
        </div>
        <h1 className="relative mt-3 font-display text-[34px] font-extrabold leading-[1.05] text-white">
          One <span className="text-gradient-gold">yes</span> changes
          <br />
          everything.
        </h1>
        <p className="relative mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
          The music is wonderful. The food trucks are excellent. But none of it is the point. The point
          is that Jesus is alive, He knows your name, and He has been waiting for you for a very long time.
        </p>
        <p className="relative mt-3 text-[13px] font-semibold text-gold-400">
          No sign-up. No email. Nobody will chase you. 💛
        </p>
      </section>

      {/* The good news, five cards */}
      <section className="mt-4">
        <div className="mx-auto max-w-md space-y-2.5">
          {GOSPEL.map((g, i) => (
            <Reveal key={g.title} delay={Math.min(i * 0.06, 0.3)}>
              <div className="flex gap-3.5 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.055] to-transparent p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-xl" aria-hidden="true">
                  {g.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[15.5px] font-bold leading-snug text-white">{g.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/65">{g.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The prayer */}
      <section className="mt-10">
        <Reveal className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-purple-900/30 via-navy-900/60 to-ink p-6">
            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative text-center">
              <Eyebrow>If you&apos;re ready</Eyebrow>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-white">Pray this with me</h2>
              <p className="mx-auto mt-2 max-w-xs text-[12.5px] leading-relaxed text-white/55">
                Out loud if you can. There are no magic words — God is listening for your heart, not your
                grammar.
              </p>
            </div>
            <div className="relative mt-5 space-y-3">
              {PRAYER.map((line, i) => (
                <p
                  key={i}
                  className="font-display text-[17px] font-semibold leading-snug text-white/90"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* The decision */}
      <section className="mt-6">
        <Reveal className="mx-auto max-w-md space-y-2.5">
          <button
            onClick={() => onDecide("new")}
            disabled={!ready}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-5 font-display text-[17px] font-extrabold text-navy-950 shadow-glow transition active:scale-[0.98] disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">🕊️ I said yes to Jesus</span>
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onDecide("returning")}
              disabled={!ready}
              className="rounded-2xl border border-purple-400/30 bg-purple-500/10 px-3 py-3.5 text-[13px] font-bold leading-snug text-purple-100 active:scale-95 disabled:opacity-50"
            >
              I&apos;m coming back to Him
            </button>
            <button
              onClick={() => onDecide("following")}
              disabled={!ready}
              className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3.5 text-[13px] font-bold leading-snug text-white/85 active:scale-95 disabled:opacity-50"
            >
              I already follow Jesus
            </button>
          </div>
          <p className="pt-1 text-center text-[11.5px] leading-relaxed text-white/40">
            Not ready? That is completely okay. Read on — and know that you are welcome here either way.
          </p>
        </Reveal>
      </section>

      {/* Honest questions */}
      <section className="mt-12">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkle width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">Honest questions</h2>
          </div>
          <p className="mt-1 text-[12.5px] text-white/50">
            The ones people actually ask, answered without the churchy words.
          </p>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2">
          {QUESTIONS.map((item, i) => {
            const on = openQ === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                <button
                  onClick={() => setOpenQ(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center gap-3 p-3.5 text-left"
                >
                  <span className="min-w-0 flex-1 text-[13.5px] font-semibold text-white">{item.q}</span>
                  <span className={`shrink-0 text-gold-400 transition-transform ${on ? "rotate-90" : ""}`}>
                    <ArrowRight width={15} height={15} />
                  </span>
                </button>
                {on && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-3.5 pb-4 text-[13px] leading-relaxed text-white/65"
                  >
                    {item.a}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <Reveal className="mx-auto max-w-md rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
          <p className="text-[13px] leading-relaxed text-white/60">
            Want to talk it through with a real person? Come to the <span className="font-bold text-gold-400">Prayer Tent</span> at
            the festival, or walk into any of the churches on our{" "}
            <span className="font-bold text-white/80">Discipleship &amp; Partners</span> page. Nobody will make it weird.
          </p>
        </Reveal>
      </section>
    </>
  );
}

/* ══════════════════════ After: the journey ══════════════════════ */

function Journey({
  state,
  openStep,
  setOpenStep,
  onToggle,
  onAction,
  onShare,
  onReset,
  go,
}: {
  state: NewLife;
  openStep: string | null;
  setOpenStep: (id: string | null) => void;
  onToggle: (id: string) => void;
  onAction: (s: (typeof STEPS)[number]) => void;
  onShare: () => void;
  onReset: () => void;
  go?: (view: string) => void;
}) {
  const day = useMemo(() => daysSince(state.date), [state.date]);
  const done = state.steps.length;
  const pct = Math.round((done / STEPS.length) * 100);
  const following = state.standing === "following";

  return (
    <>
      {/* Header */}
      <section className="relative -mx-4 overflow-hidden px-6 pb-6 pt-10 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/18 blur-[90px]" />
        </div>
        <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/25 to-purple-600/20 text-3xl">
          🕊️
        </div>
        <div className="relative mt-4">
          <Eyebrow>
            {following ? "All in with Jesus" : state.standing === "returning" ? "Welcome home" : "Your new life"}
          </Eyebrow>
        </div>
        <h1 className="relative mt-2 font-display text-[32px] font-extrabold leading-tight text-white">
          Day <span className="text-gradient-gold">{day}</span>
        </h1>
        <p className="relative mt-2 text-[13px] text-white/60">
          {following ? "You marked this on " : "It started on "}
          <span className="font-semibold text-white/80">{prettyDate(state.date)}</span>
          {!following && " — remember that date."}
        </p>

        {/* Progress */}
        <div className="relative mx-auto mt-6 max-w-xs">
          <div className="flex items-end justify-between text-[11px] font-bold uppercase tracking-wider text-white/45">
            <span>First steps</span>
            <span className="text-gold-400">
              {done} of {STEPS.length}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-ember"
            />
          </div>
          <p className="mt-2 text-[12px] leading-snug text-white/50">
            {done === 0
              ? "Take them in any order, at any speed. There's no deadline."
              : done === STEPS.length
                ? "All seven. Now keep walking — this was only the on-ramp. 💛"
                : "No rush. One step is a good week's work."}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mt-4">
        <div className="mx-auto max-w-md space-y-2.5">
          {STEPS.map((s, i) => {
            const complete = state.steps.includes(s.id);
            const on = openStep === s.id;
            return (
              <Reveal key={s.id} delay={Math.min(i * 0.05, 0.3)}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    complete
                      ? "border-gold/30 bg-gradient-to-br from-gold/[0.09] to-transparent"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3.5">
                    <button
                      onClick={() => onToggle(s.id)}
                      aria-pressed={complete}
                      aria-label={complete ? `Mark "${s.title}" as not done` : `Mark "${s.title}" as done`}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition active:scale-90 ${
                        complete ? "border-gold bg-gold text-navy-950" : "border-white/25 text-transparent"
                      }`}
                    >
                      <Check width={17} height={17} />
                    </button>
                    <button
                      onClick={() => setOpenStep(on ? null : s.id)}
                      aria-expanded={on}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    >
                      <span className="text-xl" aria-hidden="true">{s.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-white/35">
                          Step {i + 1}
                        </span>
                        <span
                          className={`block font-display text-[15.5px] font-bold leading-snug ${
                            complete ? "text-gold-400" : "text-white"
                          }`}
                        >
                          {s.title}
                        </span>
                      </span>
                      <span className={`shrink-0 text-white/35 transition-transform ${on ? "rotate-90" : ""}`}>
                        <ArrowRight width={15} height={15} />
                      </span>
                    </button>
                  </div>

                  {on && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-3.5 pb-4"
                    >
                      <p className="text-[13px] leading-relaxed text-white/70">{s.why}</p>
                      <figure className="mt-3 border-l-2 border-gold/40 pl-3">
                        <blockquote className="text-[12.5px] italic leading-relaxed text-white/75">
                          &ldquo;{s.verse}&rdquo;
                        </blockquote>
                        <figcaption className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gold-400">
                          {s.ref}
                        </figcaption>
                      </figure>
                      {s.href ? (
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3.5 flex items-center justify-center gap-1.5 rounded-xl border border-gold/35 bg-gold/10 py-2.5 text-[13px] font-bold text-gold-400 active:scale-95"
                        >
                          {s.action} <ArrowRight width={14} height={14} />
                        </a>
                      ) : (
                        <button
                          onClick={() => onAction(s)}
                          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/35 bg-gold/10 py-2.5 text-[13px] font-bold text-gold-400 active:scale-95"
                        >
                          {s.action} <ArrowRight width={14} height={14} />
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Get connected */}
      <section className="mt-10">
        <Reveal className="mx-auto mb-3 max-w-md">
          <div className="flex items-center gap-2 text-gold-400">
            <Heart width={17} height={17} />
            <h2 className="font-display text-lg font-bold text-white">Don&apos;t do this alone</h2>
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-white/50">
            These churches are part of the festival and they are genuinely glad you exist. Walk in, or send
            them a message first — whatever is less terrifying.
          </p>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2">
          {DISCIPLESHIP.churches.map((c) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3 active:scale-[0.99]"
            >
              <span className="text-lg" aria-hidden="true">⛪</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-white">{c.name}</span>
                {"badge" in c && c.badge && (
                  <span className="block text-[11px] font-medium text-gold-400">{c.badge}</span>
                )}
              </span>
              <ArrowRight width={15} height={15} className="shrink-0 text-white/25" />
            </a>
          ))}
          {go && (
            <button
              onClick={() => go("prayer")}
              className="flex w-full items-center gap-3 rounded-xl border border-purple-400/25 bg-purple-500/10 px-3.5 py-3 text-left active:scale-[0.99]"
            >
              <span className="text-lg" aria-hidden="true">🙏</span>
              <span className="min-w-0 flex-1 text-[13.5px] font-semibold text-white">
                Ask the whole city to pray for you
              </span>
              <ArrowRight width={15} height={15} className="shrink-0 text-purple-300" />
            </button>
          )}
        </div>
      </section>

      {/* Tell your story */}
      <section className="mt-8">
        <Reveal className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-ember/15 via-purple-900/25 to-ink p-5 text-center">
            <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
            <h3 className="relative font-display text-xl font-extrabold text-white">
              Somebody needs to hear this
            </h3>
            <p className="relative mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-white/70">
              You don&apos;t need the words sorted out. &ldquo;This happened to me&rdquo; has changed more lives
              than any sermon ever preached.
            </p>
            <button
              onClick={onShare}
              className="relative mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 text-[14px] font-extrabold text-navy-950 shadow-glow active:scale-95"
            >
              <Share width={15} height={15} /> Tell someone
            </button>
          </div>
        </Reveal>
      </section>

      <button
        onClick={onReset}
        className="mx-auto mt-8 block text-center text-[11px] font-medium text-white/25 underline-offset-2 hover:underline"
      >
        Tapped this by accident? Clear it
      </button>
    </>
  );
}

/* ══════════════════════ The moment ══════════════════════ */

const REJOICE: Record<Standing, { eyebrow: string; title: string; body: string }> = {
  new: {
    eyebrow: "Heaven is not being subtle about this",
    title: "Welcome to the family.",
    body: "You were dead and now you're alive. That is not a figure of speech and it is not reversible by a bad week. Whatever happens from here, this is settled.",
  },
  returning: {
    eyebrow: "He never took the light off the porch",
    title: "Welcome home.",
    body: "There was no lecture waiting for you. The father in the story didn't wait for the speech — he ran. That's what just happened.",
  },
  following: {
    eyebrow: "Marked and remembered",
    title: "All in.",
    body: "Renewing the yes matters as much as making it the first time. Now go and help somebody else find theirs.",
  },
};

function Rejoicing({ standing, onClose }: { standing: Standing; onClose: () => void }) {
  useOverlay(true, onClose);
  const copy = REJOICE[standing];
  // Rising sparks rather than falling confetti — this should feel like awe, not
  // a party popper.
  const sparks = Array.from({ length: 26 });

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden bg-ink/92 px-6 backdrop-blur"
      >
        {/* Light from above */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0.5 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] origin-top"
          style={{
            background:
              "conic-gradient(from 190deg at 50% 0%, transparent 0deg, rgba(245,166,35,0.20) 12deg, transparent 26deg, transparent 34deg, rgba(147,51,234,0.18) 46deg, transparent 58deg, transparent 122deg, rgba(245,166,35,0.14) 134deg, transparent 148deg)",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          {sparks.map((_, i) => (
            <motion.span
              key={i}
              initial={{ y: "100vh", x: `${(i * 37) % 100}%`, opacity: 0 }}
              animate={{ y: "-10vh", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.4 + (i % 5) * 0.5, delay: (i % 9) * 0.18, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 4 + (i % 3),
                height: 4 + (i % 3),
                borderRadius: 999,
                background: i % 3 === 0 ? "#9333EA" : "#F5A623",
                boxShadow: "0 0 10px currentColor",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.15 }}
          className="relative w-full max-w-sm text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 190, damping: 13, delay: 0.3 }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/25 to-purple-600/25 text-5xl shadow-glow"
          >
            🕊️
          </motion.div>
          <p className="mt-6 text-[10.5px] font-black uppercase tracking-[0.2em] text-gold-400">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-[34px] font-extrabold leading-tight text-white">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-white/75">{copy.body}</p>
          <figure className="mt-6">
            <blockquote className="text-[14px] italic leading-relaxed text-white/85">
              &ldquo;There is rejoicing in the presence of the angels of God over one sinner who
              repents.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              Luke 15:10
            </figcaption>
          </figure>
          <button
            onClick={onClose}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-4 font-display text-base font-extrabold text-navy-950 shadow-glow active:scale-[0.98]"
          >
            What happens now? →
          </button>
        </motion.div>
      </motion.div>
    </Portal>
  );
}
