"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MiniGame as MiniGameDef } from "@/lib/game";
import CaptainGoodness from "./CaptainGoodness";
import Portal from "../Portal";

/* ============================ Juice ============================ */
type Juice =
  | { id: number; kind: "text"; x: number; y: number; text: string; color: string }
  | { id: number; kind: "dot"; x: number; y: number; dx: number; dy: number; color: string };

function useJuice() {
  const [items, setItems] = useState<Juice[]>([]);
  const idRef = useRef(0);

  const fire = useCallback(
    (x: number, y: number, opts: { text?: string; colors?: string[]; count?: number } = {}) => {
      const colors = opts.colors ?? ["#F5A623", "#FFC24D", "#a855f7", "#c084fc", "#4bb873"];
      const count = opts.count ?? 9;
      const add: Juice[] = [];
      if (opts.text) add.push({ id: idRef.current++, kind: "text", x, y, text: opts.text, color: "#FFD173" });
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
        const dist = 34 + Math.random() * 46;
        add.push({ id: idRef.current++, kind: "dot", x, y, dx: Math.cos(a) * dist, dy: Math.sin(a) * dist, color: colors[i % colors.length] });
      }
      setItems((p) => [...p, ...add]);
      const ids = new Set(add.map((a) => a.id));
      setTimeout(() => setItems((p) => p.filter((it) => !ids.has(it.id))), 1000);
    },
    []
  );

  const layer = (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) =>
        it.kind === "text" ? (
          <motion.div
            key={it.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -46, scale: 1.15 }}
            transition={{ duration: 0.95, ease: "easeOut" }}
            style={{ position: "absolute", left: `${it.x}%`, top: `${it.y}%`, color: it.color }}
            className="-translate-x-1/2 whitespace-nowrap font-display text-lg font-extrabold drop-shadow"
          >
            {it.text}
          </motion.div>
        ) : (
          <motion.span
            key={it.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: it.dx, y: it.dy, scale: 0.3 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{ position: "absolute", left: `${it.x}%`, top: `${it.y}%`, width: 9, height: 9, borderRadius: 9, background: it.color }}
          />
        )
      )}
    </div>
  );

  return { fire, layer };
}

/* ============================ Shared UI ============================ */
function HUD({ score, goal, combo, label }: { score: number; goal: number; combo: number; label: string }) {
  const pct = Math.min(100, Math.round((score / goal) * 100));
  return (
    <div className="px-4 pt-2">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold text-white">
          {score}/{goal} {label}
        </span>
        <AnimatePresence>
          {combo > 1 && (
            <motion.span
              key={combo}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-extrabold text-gold-400"
            >
              🔥 {combo}× combo
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-gold-400 to-gold-500" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 200, damping: 26 }} />
      </div>
    </div>
  );
}

const WIN_LINES = [
  "You helped revive another part of the city! 🌇",
  "That's what happens when we play our part!",
  "Light is spreading across the city because of you!",
  "You + the whole community are reviving Hamilton together!",
  "Small acts, big impact — keep the light going!",
];

function WinOverlay({ points, onClaim }: { points: number; onClaim: () => void }) {
  const [line] = useState(() => WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)]);
  const [claimed, setClaimed] = useState(false);
  const claim = () => {
    if (claimed) return; // a double-tap during the exit animation must not double-credit
    setClaimed(true);
    onClaim();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/80 p-6 text-center backdrop-blur"
    >
      <motion.div initial={{ scale: 0.5, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
        <CaptainGoodness size={104} />
      </motion.div>
      <h4 className="mt-2 font-display text-3xl font-extrabold text-white">You did it! 🎉</h4>
      <p className="mt-1 max-w-xs text-sm text-white/75">{line}</p>
      <button onClick={claim} disabled={claimed} className="mt-6 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 text-base font-extrabold text-navy-950 shadow-glow active:scale-95 disabled:opacity-60">
        {claimed ? "Added! ✨" : `Add +${points} to the city ✨`}
      </button>
    </motion.div>
  );
}

/* ============================ Dispatcher ============================ */
export default function MiniGame({ game, onWin, onClose }: { game: MiniGameDef; onWin: (points: number) => void; onClose: () => void }) {
  return (
    <Portal>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="fixed inset-0 z-[90] flex flex-col bg-gradient-to-b from-navy-900 via-ink to-ink"
    >
      <div className="flex items-center justify-between px-4 pt-4 safe-top">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-purple-300">Mini-Game</p>
          <h3 className="font-display text-xl font-bold text-white">
            {game.emoji} {game.name}
          </h3>
        </div>
        <button onClick={onClose} className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white/80 active:scale-95">
          Close
        </button>
      </div>

      {game.id === "light" && <LightCity def={game} onWin={onWin} />}
      {game.id === "plant" && <PlantHope def={game} onWin={onWin} />}
      {game.id === "fruit" && <CatchFruit def={game} onWin={onWin} />}
      {game.id === "rhythm" && <WorshipRhythm def={game} onWin={onWin} />}
      {game.id === "river" && <RiverOfLife def={game} onWin={onWin} />}
      {game.id === "build" && <BuildChurch def={game} onWin={onWin} />}
      {game.id === "neighbor" && <HelpNeighbor def={game} onWin={onWin} />}
      {!["light", "plant", "fruit", "rhythm", "river", "build", "neighbor"].includes(game.id) && <EncourageCrowd def={game} onWin={onWin} />}
    </motion.div>
    </Portal>
  );
}

/* ============================ 1. Light the City ============================ */
function LightCity({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const GOAL = 18;
  const COLS = 5, ROWS = 4;
  const [lit, setLit] = useState<boolean[]>(() => Array(COLS * ROWS).fill(false));
  const [cloud, setCloud] = useState<number | null>(null); // index cluster under cloud
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fire, layer } = useJuice();

  // Storm cloud drifts in and darkens a couple of windows
  useEffect(() => {
    if (won) return;
    const iv = setInterval(() => {
      setCloud(() => Math.floor(Math.random() * (COLS * ROWS)));
      setLit((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        if (!prev[idx]) return prev;
        const next = [...prev];
        next[idx] = false;
        return next;
      });
      setTimeout(() => setCloud(null), 1400);
    }, 2600);
    return () => clearInterval(iv);
  }, [won]);

  function bump() {
    const n = scoreRef.current + 1;
    scoreRef.current = n;
    setScore(n);
    setCombo((c) => c + 1);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 1400);
    if (n >= GOAL) setWon(true);
  }

  function tapWindow(i: number, e: React.MouseEvent) {
    if (won || lit[i]) return;
    setLit((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    const col = i % COLS, row = Math.floor(i / COLS);
    fire(12 + col * 19, 22 + row * 20, { text: "+1", count: 7, colors: ["#FFE9A8", "#F5A623"] });
    bump();
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={score} goal={GOAL} combo={combo} label="windows lit" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">Tap the dark windows to bring the city to life ✨</p>
      <div className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1230] to-[#0b0616]">
        {/* buildings */}
        <div className="absolute inset-x-3 bottom-0 top-6 grid grid-cols-5 gap-2">
          {Array.from({ length: COLS * ROWS }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => tapWindow(i, e)}
              className="rounded-md transition-colors duration-300"
              style={{
                background: lit[i]
                  ? "radial-gradient(circle at 50% 40%, #FFE9A8, #F5A623)"
                  : "rgba(255,255,255,0.06)",
                boxShadow: lit[i] ? "0 0 16px rgba(245,166,35,0.7)" : "none",
              }}
            />
          ))}
        </div>
        {/* storm cloud */}
        <AnimatePresence>
          {cloud !== null && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              onClick={() => {
                fire(50, 30, { text: "+3", count: 12, colors: ["#c084fc", "#a855f7"] });
                scoreRef.current = Math.min(GOAL, scoreRef.current + 2);
                setScore(scoreRef.current);
                bump();
                setCloud(null);
              }}
              style={{ left: `${8 + (cloud % COLS) * 19}%`, top: `${14 + Math.floor(cloud / COLS) * 20}%` }}
              className="absolute cursor-pointer text-4xl"
            >
              🌧️
            </motion.div>
          )}
        </AnimatePresence>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ============================ 2. Plant Hope ============================ */
const PLANTS = ["🌱", "🌷", "🌻", "🌳", "🌸", "🌼"];
function PlantHope({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const GOAL = 15;
  const [plots, setPlots] = useState<(string | null)[]>(() => Array(GOAL).fill(null));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fire, layer } = useJuice();

  function plant(i: number) {
    if (won || plots[i]) return;
    const emoji = PLANTS[Math.floor(Math.random() * PLANTS.length)];
    setPlots((prev) => {
      const next = [...prev];
      next[i] = emoji;
      return next;
    });
    const col = i % 5, row = Math.floor(i / 5);
    fire(14 + col * 18, 24 + row * 26, { text: "🌿", count: 8, colors: ["#4bb873", "#ff6fae", "#ffd23f"] });
    const n = scoreRef.current + 1;
    scoreRef.current = n;
    setScore(n);
    setCombo((c) => c + 1);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 1400);
    if (n >= GOAL) setWon(true);
  }

  const green = Math.min(1, score / GOAL);
  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={score} goal={GOAL} combo={combo} label="planted" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">Tap the soil to plant hope across the park 🌱</p>
      <div
        className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10"
        style={{ background: `linear-gradient(to bottom, rgba(80,120,60,${0.15 + green * 0.5}), rgba(40,70,40,${0.3 + green * 0.5}))` }}
      >
        <div className="absolute inset-4 grid grid-cols-5 content-center gap-3">
          {plots.map((p, i) => (
            <button key={i} onClick={() => plant(i)} className="grid aspect-square place-items-center rounded-full" style={{ background: p ? "transparent" : "rgba(60,40,25,0.5)", border: p ? "none" : "2px dashed rgba(255,255,255,0.15)" }}>
              {p && (
                <motion.span initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="text-2xl">
                  {p}
                </motion.span>
              )}
            </button>
          ))}
        </div>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ============================ 3. Catch the Fruit ============================ */
type Faller = { id: number; x: number; emoji: string; good: boolean; fallPx: number };
const GOOD_FRUIT = ["❤️", "😊", "🕊️", "🌿", "🌟", "🍎", "🍇"];
const BAD_FRUIT = ["📱", "😠", "💤"];
function CatchFruit({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const GOAL = 12;
  const [fallers, setFallers] = useState<Faller[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const idRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const { fire, layer } = useJuice();

  useEffect(() => {
    if (won) return;
    const iv = setInterval(() => {
      setFallers((prev) => {
        if (prev.length >= 6) return prev;
        const good = Math.random() > 0.3;
        const fallPx = (areaRef.current?.clientHeight ?? 620) + 70;
        return [...prev, { id: idRef.current++, x: 8 + Math.random() * 80, emoji: (good ? GOOD_FRUIT : BAD_FRUIT)[Math.floor(Math.random() * (good ? GOOD_FRUIT : BAD_FRUIT).length)], good, fallPx }];
      });
    }, 620);
    return () => clearInterval(iv);
  }, [won]);

  function catchIt(f: Faller) {
    setFallers((prev) => prev.filter((x) => x.id !== f.id));
    if (f.good) {
      const n = scoreRef.current + 1;
      scoreRef.current = n;
      setScore(n);
      setCombo((c) => c + 1);
      if (comboTimer.current) clearTimeout(comboTimer.current);
      comboTimer.current = setTimeout(() => setCombo(0), 1300);
      fire(f.x, 82, { text: "+1", count: 7, colors: ["#ff6fae", "#ffd23f", "#4bb873"] });
      if (n >= GOAL) setWon(true);
    } else {
      setCombo(0);
      fire(f.x, 82, { count: 5, colors: ["#888"] });
    }
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={score} goal={GOAL} combo={combo} label="fruit caught" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">Catch the fruit of the Spirit — skip the {BAD_FRUIT.join(" ")} distractions!</p>
      <div ref={areaRef} className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-sky-500/10 to-navy-900/40">
        <AnimatePresence>
          {!won &&
            fallers.map((f) => (
              <motion.button
                key={f.id}
                initial={{ y: -60, opacity: 1 }}
                animate={{ y: f.fallPx }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 2.9, ease: "linear" }}
                onAnimationComplete={() => setFallers((prev) => prev.filter((x) => x.id !== f.id))}
                onClick={() => catchIt(f)}
                style={{ left: `${f.x}%`, top: 0, position: "absolute" }}
                className="text-4xl active:scale-90"
              >
                <span className={f.good ? "drop-shadow-[0_0_10px_rgba(245,166,35,0.5)]" : "opacity-75"}>{f.emoji}</span>
              </motion.button>
            ))}
        </AnimatePresence>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ============================ 4. Encourage the Crowd ============================ */
type Person = { id: number; x: number; y: number; happy: boolean };
function EncourageCrowd({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const GOAL = 12;
  const [people, setPeople] = useState<Person[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const idRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fire, layer } = useJuice();

  useEffect(() => {
    if (won) return;
    const seed = () => setPeople((prev) => (prev.length >= 5 ? prev : [...prev, { id: idRef.current++, x: 10 + Math.random() * 78, y: 12 + Math.random() * 70, happy: false }]));
    seed();
    const iv = setInterval(seed, 800);
    return () => clearInterval(iv);
  }, [won]);

  function encourage(p: Person) {
    if (p.happy) return;
    setPeople((prev) => prev.map((x) => (x.id === p.id ? { ...x, happy: true } : x)));
    fire(p.x, p.y, { text: "❤️", count: 8, colors: ["#ff6fae", "#ffd23f", "#a855f7"] });
    const n = scoreRef.current + 1;
    scoreRef.current = n;
    setScore(n);
    setCombo((c) => c + 1);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 1400);
    setTimeout(() => setPeople((prev) => prev.filter((x) => x.id !== p.id)), 500);
    if (n >= GOAL) setWon(true);
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={score} goal={GOAL} combo={combo} label="encouraged" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">Tap someone who looks discouraged to send them hope 💛</p>
      <div className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-purple-900/20 to-navy-900/40">
        <AnimatePresence>
          {!won &&
            people.map((p) => (
              <motion.button
                key={p.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => encourage(p)}
                style={{ left: `${p.x}%`, top: `${p.y}%`, position: "absolute" }}
                className="-translate-x-1/2 -translate-y-1/2 text-4xl active:scale-90"
              >
                {p.happy ? "😄" : "😔"}
              </motion.button>
            ))}
        </AnimatePresence>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ============================ 5. Help Your Neighbor ============================ */
const SCENARIOS = [
  { q: "Someone dropped their groceries.", options: ["Walk away", "Help pick them up", "Laugh"], answer: 1 },
  { q: "A new kid is standing alone at the festival.", options: ["Ignore them", "Point and stare", "Say hi & invite them over"], answer: 2 },
  { q: "Your friend is feeling discouraged.", options: ["Encourage them", "Change the subject", "Tell them to toughen up"], answer: 0 },
  { q: "A volunteer looks tired serving all day.", options: ["Complain to them", "Say thank you", "Ignore them"], answer: 1 },
  { q: "You see litter on the festival grounds.", options: ["Step over it", "Pick it up", "Blame someone"], answer: 1 },
];

function HelpNeighbor({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const s = SCENARIOS[round];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => {
      if (i === s.answer) {
        if (round + 1 >= SCENARIOS.length) setWon(true);
        else {
          setRound((r) => r + 1);
          setPicked(null);
        }
      } else {
        setPicked(null);
      }
    }, 750);
  }

  return (
    <div className="relative flex flex-1 flex-col px-5 pb-8 pt-4">
      {/* progress dots */}
      <div className="mb-6 flex justify-center gap-2">
        {SCENARIOS.map((_, i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i < round || won ? "bg-gold" : i === round ? "bg-gold/50" : "bg-white/15"}`} />
        ))}
      </div>
      <div className="my-auto">
          <motion.div key={round} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
            <p className="mb-6 text-center font-display text-2xl font-bold leading-snug text-white">{s.q}</p>
            <div className="space-y-3">
              {s.options.map((opt, i) => {
                const isPick = picked === i;
                const right = i === s.answer;
                return (
                  <button
                    key={opt}
                    onClick={() => pick(i)}
                    className={`w-full rounded-2xl border p-4 text-left text-[15px] font-semibold transition active:scale-[0.99] ${
                      isPick ? (right ? "border-emerald-400 bg-emerald-500/20 text-white" : "border-rose-400 bg-rose-500/15 text-white") : "border-white/12 bg-white/5 text-white/85"
                    }`}
                  >
                    {opt}
                    {isPick && right && " ✅"}
                    {isPick && !right && " — try kindness 💛"}
                  </button>
                );
              })}
            </div>
          </motion.div>
      </div>
      <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
    </div>
  );
}

/* ============================ 6. Worship Rhythm ============================ */
type Note = { id: number; x: number; emoji: string; spawnAt: number; fallPx: number };
const NOTE_FALL_MS = 2600;
const NOTE_EMOJI = ["🎵", "🎶", "🎼"];
function WorshipRhythm({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const GOAL = 10;
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const idRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fire, layer } = useJuice();

  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (won) return;
    const iv = setInterval(() => {
      setNotes((prev) => {
        if (prev.length >= 4) return prev;
        const fallPx = (areaRef.current?.clientHeight ?? 620) + 70;
        return [...prev, { id: idRef.current++, x: 14 + Math.random() * 72, emoji: NOTE_EMOJI[Math.floor(Math.random() * NOTE_EMOJI.length)], spawnAt: Date.now(), fallPx }];
      });
    }, 850);
    return () => clearInterval(iv);
  }, [won]);

  function tapNote(n: Note) {
    const frac = (Date.now() - n.spawnAt) / NOTE_FALL_MS;
    setNotes((prev) => prev.filter((x) => x.id !== n.id));
    if (frac >= 0.55 && frac <= 1.0) {
      // In the glow — perfect timing gets an extra sparkle
      const perfect = frac >= 0.72 && frac <= 0.92;
      const nScore = scoreRef.current + 1;
      scoreRef.current = nScore;
      setScore(nScore);
      setCombo((c) => c + 1);
      if (comboTimer.current) clearTimeout(comboTimer.current);
      comboTimer.current = setTimeout(() => setCombo(0), 1500);
      fire(n.x, 78, { text: perfect ? "Perfect!" : "+1", count: perfect ? 12 : 7, colors: ["#FFD173", "#c084fc", "#ff6fae"] });
      if (nScore >= GOAL) setWon(true);
    } else {
      setCombo(0);
      fire(n.x, Math.min(90, frac * 100), { count: 4, colors: ["#888"] });
    }
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={score} goal={GOAL} combo={combo} label="notes on beat" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">Tap each note when it reaches the golden glow at the bottom! 🎶</p>
      <div ref={areaRef} className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-purple-900/25 to-navy-900/40">
        {/* glow zone */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] rounded-b-2xl border-t-2 border-gold/50 bg-gradient-to-t from-gold/20 to-transparent" />
        <AnimatePresence>
          {!won &&
            notes.map((n) => (
              <motion.button
                key={n.id}
                initial={{ y: -60, opacity: 1 }}
                animate={{ y: n.fallPx }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: NOTE_FALL_MS / 1000, ease: "linear" }}
                onAnimationComplete={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
                onClick={() => tapNote(n)}
                style={{ left: `${n.x}%`, top: 0, position: "absolute" }}
                className="text-4xl active:scale-90"
              >
                <span className="drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]">{n.emoji}</span>
              </motion.button>
            ))}
        </AnimatePresence>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ============================ 7. River of Life ============================ */
function RiverOfLife({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const ROCKS = 12;
  // Boulders (every 4th) take two taps — a little challenge for bigger kids.
  const [hits, setHits] = useState<number[]>(() => Array.from({ length: ROCKS }, (_, i) => (i % 4 === 0 ? 2 : 1)));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fire, layer } = useJuice();

  function smash(i: number) {
    if (won || hits[i] <= 0) return;
    const col = i % 4, row = Math.floor(i / 4);
    const x = 16 + col * 23, y = 20 + row * 26;
    setHits((prev) => {
      const next = [...prev];
      next[i] = next[i] - 1;
      if (next[i] > 0) {
        fire(x, y, { count: 5, colors: ["#9aa5b1"] });
        return next;
      }
      fire(x, y, { text: "💦", count: 9, colors: ["#3aa0d8", "#7cc7f0", "#fff"] });
      const nScore = scoreRef.current + 1;
      scoreRef.current = nScore;
      setScore(nScore);
      setCombo((c) => c + 1);
      if (comboTimer.current) clearTimeout(comboTimer.current);
      comboTimer.current = setTimeout(() => setCombo(0), 1400);
      if (nScore >= ROCKS) setWon(true);
      return next;
    });
  }

  const flow = Math.min(1, score / ROCKS);
  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={score} goal={ROCKS} combo={combo} label="rocks cleared" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">Tap the rocks to clear the river — big boulders take two taps! 💧</p>
      <div className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#243447] to-[#16222e]">
        {/* rising water */}
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2e7fb8] to-[#3aa0d8]/80"
          animate={{ height: `${8 + flow * 88}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          <motion.div className="absolute inset-x-0 top-0 h-2 bg-white/30 blur-[2px]" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />
        </motion.div>
        {/* rocks */}
        <div className="absolute inset-5 grid grid-cols-4 content-start gap-4">
          {hits.map((h, i) => (
            <button key={i} onClick={() => smash(i)} className="grid aspect-square place-items-center active:scale-90" disabled={h <= 0}>
              {h > 0 && (
                <motion.span initial={{ scale: 1 }} animate={h === 1 && i % 4 === 0 ? { rotate: [-3, 3, -3] } : {}} transition={{ duration: 0.5, repeat: Infinity }} className={i % 4 === 0 ? "text-4xl" : "text-3xl"}>
                  🪨
                </motion.span>
              )}
            </button>
          ))}
        </div>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ============================ 8. Build the Church ============================ */
const BUILD_STEPS = [
  { id: 0, label: "Foundation", emoji: "🧱" },
  { id: 1, label: "Walls", emoji: "🏛️" },
  { id: 2, label: "Door", emoji: "🚪" },
  { id: 3, label: "Windows", emoji: "🪟" },
  { id: 4, label: "Roof", emoji: "🔺" },
  { id: 5, label: "The Cross", emoji: "✝️" },
];
function BuildChurch({ def, onWin }: { def: MiniGameDef; onWin: (p: number) => void }) {
  const [placed, setPlaced] = useState(0);
  const [shuffled] = useState(() => [...BUILD_STEPS].sort(() => Math.random() - 0.5));
  const [wrong, setWrong] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const { fire, layer } = useJuice();

  function pick(step: (typeof BUILD_STEPS)[number]) {
    if (won) return;
    if (step.id === placed) {
      fire(50, 46, { text: step.emoji, count: 9, colors: ["#FFD173", "#c084fc"] });
      const next = placed + 1;
      setPlaced(next);
      if (next >= BUILD_STEPS.length) setTimeout(() => setWon(true), 700);
    } else {
      setWrong(step.id);
      setTimeout(() => setWrong(null), 500);
    }
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      <HUD score={placed} goal={BUILD_STEPS.length} combo={0} label="pieces placed" />
      <p className="px-4 pt-1 text-center text-xs text-white/50">What comes first? Tap the pieces in the right building order! 🏗️</p>

      {/* The church assembles as you build */}
      <div className="relative mx-4 mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1230] to-[#0b0616]">
        <div className="relative flex flex-1 items-end justify-center pb-4">
          <svg viewBox="0 0 200 170" className="h-full max-h-[240px] w-auto">
            {/* cross */}
            <motion.g animate={{ opacity: placed >= 6 ? 1 : 0.08 }}>
              <rect x="97" y="8" width="6" height="26" rx="2" fill="#FFD173" />
              <rect x="88" y="15" width="24" height="6" rx="2" fill="#FFD173" />
              {placed >= 6 && <circle cx="100" cy="20" r="20" fill="#FFD173" opacity="0.18" />}
            </motion.g>
            {/* roof */}
            <motion.path d="M52 92 L100 38 L148 92 Z" fill="#b9a892" animate={{ opacity: placed >= 5 ? 1 : 0.08 }} />
            {/* walls */}
            <motion.rect x="58" y="92" width="84" height="60" fill="#ddd3c4" animate={{ opacity: placed >= 2 ? 1 : 0.08 }} />
            {/* windows */}
            <motion.g animate={{ opacity: placed >= 4 ? 1 : 0.08 }}>
              <rect x="68" y="104" width="14" height="20" rx="6" fill="#F5A623" />
              <rect x="118" y="104" width="14" height="20" rx="6" fill="#F5A623" />
            </motion.g>
            {/* door */}
            <motion.rect x="90" y="116" width="20" height="36" rx="8" fill="#7c5a34" animate={{ opacity: placed >= 3 ? 1 : 0.08 }} />
            {/* foundation */}
            <motion.rect x="48" y="152" width="104" height="12" rx="3" fill="#8a7b63" animate={{ opacity: placed >= 1 ? 1 : 0.08 }} />
          </svg>
        </div>

        {/* piece buttons */}
        <div className="grid grid-cols-3 gap-2 p-3">
          {shuffled.map((s) => {
            const done = s.id < placed;
            return (
              <motion.button
                key={s.id}
                onClick={() => pick(s)}
                animate={wrong === s.id ? { x: [-6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                disabled={done}
                className={`flex flex-col items-center gap-0.5 rounded-xl border p-2.5 ${done ? "border-emerald-400/30 bg-emerald-500/10 opacity-50" : "border-white/12 bg-white/5 active:scale-95"}`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-[10px] font-semibold text-white/70">{s.label}</span>
              </motion.button>
            );
          })}
        </div>
        {layer}
        <AnimatePresence>{won && <WinOverlay points={def.points} onClaim={() => onWin(def.points)} />}</AnimatePresence>
      </div>
    </div>
  );
}
