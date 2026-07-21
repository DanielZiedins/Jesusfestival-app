"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "../Portal";
import CaptainGoodness from "./CaptainGoodness";
import CityScene from "./CityScene";
import AmbientFX from "./AmbientFX";
import { ArrowRight } from "@/components/icons";

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  visual: "captain" | "city" | "acts" | "together" | "glory";
};

const STEPS: Step[] = [
  {
    eyebrow: "Welcome",
    title: "Revive the City",
    body: "Hamilton has lost its color — the streets are gray and the lights are out. But that's about to change, and you're part of it. 🌇",
    visual: "captain",
  },
  {
    eyebrow: "The purpose",
    title: "One city. All of us. Together.",
    body: "This isn't a game you play alone. The whole community is bringing Hamilton back to life — one shared city, revived together for God's glory.",
    visual: "city",
  },
  {
    eyebrow: "How it works",
    title: "Real acts bring real light",
    body: "Pray. Encourage someone. Invite a friend. Serve. Read Scripture. Every real-world act you do adds LIGHT to the city and grows the fruit of the Spirit.",
    visual: "acts",
  },
  {
    eyebrow: "Better together",
    title: "You have a part to play",
    body: "There's one daily mission for everyone, a weekly challenge to overcome as a community, and a whole city to revive. Watch Hamilton transform as thousands join in!",
    visual: "together",
  },
  {
    eyebrow: "Let's begin",
    title: "For His glory 🙌",
    body: "We're starting this journey together — right at the beginning. Let's advance God's Kingdom in our city, one act of love at a time.",
    visual: "glory",
  },
];

export default function GameIntro({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[92] flex flex-col overflow-hidden bg-gradient-to-b from-navy-900 via-ink to-ink"
      >
        <AmbientFX pct={i * 22} />

        <div className="relative flex items-center justify-between px-5 pt-5 safe-top">
          <div className="flex gap-1.5">
            {STEPS.map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-gold" : idx < i ? "w-1.5 bg-gold/60" : "w-1.5 bg-white/20"}`} />
            ))}
          </div>
          <button onClick={onDone} className="text-xs font-semibold text-white/50">Skip</button>
        </div>

        <div className="relative flex flex-1 flex-col justify-center px-6 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center text-center"
            >
              <IntroVisual visual={step.visual} />

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">{step.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-white">{step.title}</h2>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/75">{step.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative px-6 pb-8 safe-bottom">
          <button
            onClick={() => (last ? onDone() : setI((v) => v + 1))}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-4 text-base font-extrabold text-navy-950 shadow-glow active:scale-[0.98]"
          >
            {last ? "Start the journey 🙌" : "Next"} <ArrowRight width={18} height={18} />
          </button>
        </div>
      </motion.div>
    </Portal>
  );
}

function IntroVisual({ visual }: { visual: Step["visual"] }) {
  if (visual === "city") {
    return (
      <div className="w-full max-w-xs">
        <CityScene pct={8} />
        <p className="mt-2 text-center text-[11px] text-white/45">Today, Hamilton looks like this…</p>
      </div>
    );
  }
  if (visual === "acts") {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[
          { e: "🙏", t: "Pray" },
          { e: "💛", t: "Encourage" },
          { e: "💌", t: "Invite" },
          { e: "🤝", t: "Serve" },
          { e: "📖", t: "Scripture" },
          { e: "✨", t: "Kindness" },
        ].map((a) => (
          <motion.div
            key={a.t}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + Math.random() * 0.4, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-3"
          >
            <span className="text-2xl">{a.e}</span>
            <span className="text-[10px] font-semibold text-white/70">{a.t}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  if (visual === "together") {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gold/20 blur-2xl" />
        <div className="flex -space-x-3">
          {["🧑🏽", "👩🏻", "🧑🏿", "👵🏼", "🧒🏻", "👨🏾"].map((p, idx) => (
            <motion.span
              key={idx}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.08 }}
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-gradient-to-br from-purple-600/50 to-navy-800 text-lg"
            >
              {p}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }
  // captain / glory
  return <CaptainGoodness size={140} />;
}
