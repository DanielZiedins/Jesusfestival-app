"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MiniGame as MiniGameDef } from "@/lib/game";
import CaptainGoodness from "./CaptainGoodness";

type Cfg = { goal: number; good: string[]; bad: string[]; goodLabel: string };

const TAP_CFG: Record<string, Cfg> = {
  light: { goal: 8, good: ["💡"], bad: ["☁️", "🌧️"], goodLabel: "streetlights lit" },
  plant: { goal: 8, good: ["🌱", "🌷", "🌻"], bad: ["🪨"], goodLabel: "planted" },
  fruit: { goal: 10, good: ["❤️", "😊", "🕊️", "🌿", "🌟"], bad: ["📱", "😠"], goodLabel: "fruit caught" },
  clean: { goal: 9, good: ["🍬", "🥤", "📄", "🗑️"], bad: ["🌸"], goodLabel: "cleaned up" },
};

type Target = { id: number; x: number; y: number; emoji: string; good: boolean };

const NEIGHBOR = [
  {
    q: "Someone dropped their groceries.",
    options: ["Walk away", "Help pick them up", "Laugh"],
    answer: 1,
  },
  {
    q: "A new kid is standing alone at the festival.",
    options: ["Ignore them", "Point and stare", "Say hi and invite them over"],
    answer: 2,
  },
  {
    q: "Your friend is feeling discouraged.",
    options: ["Encourage them", "Change the subject", "Tell them to toughen up"],
    answer: 0,
  },
];

export default function MiniGame({
  game,
  onWin,
  onClose,
}: {
  game: MiniGameDef;
  onWin: (points: number) => void;
  onClose: () => void;
}) {
  const isChoice = game.id === "neighbor";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[75] flex flex-col bg-gradient-to-b from-navy-900 via-ink to-ink"
    >
      <div className="flex items-center justify-between px-4 pt-4 safe-top">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-purple-300">Mini-Game</p>
          <h3 className="font-display text-xl font-bold text-white">
            {game.emoji} {game.name}
          </h3>
        </div>
        <button onClick={onClose} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80">
          Close
        </button>
      </div>

      {isChoice ? (
        <ChoiceGame game={game} onWin={onWin} />
      ) : (
        <TapGame game={game} cfg={TAP_CFG[game.id] ?? TAP_CFG.light} onWin={onWin} />
      )}
    </motion.div>
  );
}

// ---------- Tap game ----------
function TapGame({ game, cfg, onWin }: { game: MiniGameDef; cfg: Cfg; onWin: (p: number) => void }) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(22);
  const [status, setStatus] = useState<"play" | "win" | "timeup">("play");
  const idRef = useRef(0);
  const scoreRef = useRef(0);

  const finishWin = useCallback(() => {
    if (scoreRef.current >= 0) {
      setStatus("win");
    }
  }, []);

  // Spawner
  useEffect(() => {
    if (status !== "play") return;
    const spawn = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 5) return prev;
        const good = Math.random() > 0.32;
        const pool = good ? cfg.good : cfg.bad;
        const t: Target = {
          id: idRef.current++,
          x: 8 + Math.random() * 78,
          y: 10 + Math.random() * 74,
          emoji: pool[Math.floor(Math.random() * pool.length)],
          good,
        };
        // auto-despawn
        setTimeout(() => setTargets((cur) => cur.filter((x) => x.id !== t.id)), 1700);
        return [...prev, t];
      });
    }, 650);
    return () => clearInterval(spawn);
  }, [status, cfg]);

  // Timer
  useEffect(() => {
    if (status !== "play") return;
    const iv = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(iv);
          setStatus((s) => (s === "play" ? "timeup" : s));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [status]);

  function tap(t: Target) {
    setTargets((prev) => prev.filter((x) => x.id !== t.id));
    if (!t.good) return;
    const next = scoreRef.current + 1;
    scoreRef.current = next;
    setScore(next);
    if (next >= cfg.goal) {
      finishWin();
    }
  }

  function replay() {
    scoreRef.current = 0;
    setScore(0);
    setTime(22);
    setTargets([]);
    setStatus("play");
  }

  const pct = Math.min(100, Math.round((score / cfg.goal) * 100));

  return (
    <div className="flex flex-1 flex-col px-4 pb-6">
      {/* HUD */}
      <div className="mb-2 mt-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-white">
          {score}/{cfg.goal} {cfg.goodLabel}
        </span>
        <span className={`font-bold ${time <= 5 ? "text-rose-300" : "text-white/70"}`}>⏱ {time}s</span>
      </div>
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600" animate={{ width: `${pct}%` }} />
      </div>

      {/* Play area */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-purple-900/20 to-navy-900/40">
        <AnimatePresence>
          {status === "play" &&
            targets.map((t) => (
              <motion.button
                key={t.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => tap(t)}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-3xl active:scale-90"
              >
                <span className={t.good ? "drop-shadow-[0_0_10px_rgba(245,166,35,0.6)]" : "opacity-80"}>{t.emoji}</span>
              </motion.button>
            ))}
        </AnimatePresence>

        {status === "play" && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-white/50">
            Tap the {cfg.good.join(" ")} — avoid the {cfg.bad.join(" ")}
          </p>
        )}

        <AnimatePresence>
          {status !== "play" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-ink/70 p-6 text-center backdrop-blur"
            >
              <CaptainGoodness size={96} />
              {status === "win" ? (
                <>
                  <h4 className="mt-2 font-display text-2xl font-bold text-white">Amazing! 🎉</h4>
                  <p className="mt-1 text-sm text-white/70">You helped revive another part of the city!</p>
                  <button
                    onClick={() => onWin(game.points)}
                    className="mt-5 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-bold text-navy-950 shadow-glow active:scale-95"
                  >
                    Claim +{game.points} Light Points
                  </button>
                </>
              ) : (
                <>
                  <h4 className="mt-2 font-display text-xl font-bold text-white">So close! 💛</h4>
                  <p className="mt-1 text-sm text-white/70">No mission is too small — give it another go!</p>
                  <button onClick={replay} className="mt-5 rounded-2xl bg-white/10 px-6 py-3 font-bold text-white active:scale-95">
                    Try again
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------- Choice game ----------
function ChoiceGame({ game, onWin }: { game: MiniGameDef; onWin: (p: number) => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const scenario = NEIGHBOR[round];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => {
      if (i === scenario.answer) {
        if (round + 1 >= NEIGHBOR.length) setDone(true);
        else {
          setRound((r) => r + 1);
          setPicked(null);
        }
      } else {
        setPicked(null); // gentle retry, no penalty
      }
    }, 700);
  }

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <CaptainGoodness size={110} />
        <h4 className="mt-2 font-display text-2xl font-bold text-white">Kindness wins! 🤲</h4>
        <p className="mt-1 text-sm text-white/70">You chose to help your neighbor every time.</p>
        <button
          onClick={() => onWin(game.points)}
          className="mt-5 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-bold text-navy-950 shadow-glow active:scale-95"
        >
          Claim +{game.points} Light Points
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-4">
      <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-purple-300">
        Round {round + 1} of {NEIGHBOR.length}
      </p>
      <div className="my-auto">
        <p className="mb-6 text-center font-display text-2xl font-bold leading-snug text-white">{scenario.q}</p>
        <div className="space-y-3">
          {scenario.options.map((opt, i) => {
            const isPick = picked === i;
            const right = i === scenario.answer;
            return (
              <button
                key={opt}
                onClick={() => pick(i)}
                className={`w-full rounded-2xl border p-4 text-left text-[15px] font-semibold transition active:scale-[0.99] ${
                  isPick
                    ? right
                      ? "border-emerald-400 bg-emerald-500/20 text-white"
                      : "border-rose-400 bg-rose-500/15 text-white"
                    : "border-white/12 bg-white/5 text-white/85"
                }`}
              >
                {opt}
                {isPick && right && " ✅"}
                {isPick && !right && " — try kindness 💛"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
