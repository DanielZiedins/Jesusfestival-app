"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { Eyebrow } from "@/components/Reveal";
import CaptainGoodness from "@/components/game/CaptainGoodness";
import CityScene from "@/components/game/CityScene";
import MiniGame from "@/components/game/MiniGame";
import { Check, Play, Trophy, Sparkle } from "@/components/icons";
import {
  BIBLE_TRANSLATION,
  CITY_TARGET,
  FRUITS,
  MILESTONES,
  MINI_GAMES,
  VERSE_CHALLENGES,
  contributePoints,
  fetchCityProgress,
  loadState,
  missionsForToday,
  saveState,
  type CityProgress,
  type Fruit,
  type GameState,
  type MiniGame as MiniGameDef,
  type Mission,
  type VerseChallenge as VC,
} from "@/lib/game";

const CAPTAIN_LINES = [
  "Every act of kindness brings more light! ✨",
  "Let's pray and watch hope grow!",
  "Who could you encourage today?",
  "The fruit of the Spirit grows when we walk with Jesus.",
  "No mission is too small when it's done with love.",
  "Invite someone to church and help them find a family that cares.",
  "Great job! God's Word is getting stronger in your heart!",
  "Remember — real goodness comes from following Jesus. 🙌",
];

const addArr = (arr: string[], v: string) => (arr.includes(v) ? arr : [...arr, v]);

export default function GameScreen() {
  const [state, setState] = useState<GameState>(() => loadState());
  const [city, setCity] = useState<CityProgress | null>(null);
  const cityRef = useRef<CityProgress | null>(null);
  const [line, setLine] = useState(CAPTAIN_LINES[0]);

  const [gameCtx, setGameCtx] = useState<{ game: MiniGameDef; fruitId?: string } | null>(null);
  const [fruitOpen, setFruitOpen] = useState<Fruit | null>(null);
  const [verseOpen, setVerseOpen] = useState<VC | null>(null);
  const [celebrate, setCelebrate] = useState<{ label: string; verse?: { text: string; ref: string } } | null>(null);

  const missions = useMemo(() => missionsForToday(), []);

  useEffect(() => {
    fetchCityProgress().then((c) => {
      setCity(c);
      cityRef.current = c;
    });
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setLine(CAPTAIN_LINES[Math.floor(Math.random() * CAPTAIN_LINES.length)]);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  function persist(next: GameState) {
    setState(next);
    saveState(next);
  }

  async function contribute(points: number, missionsInc = 0) {
    const prevPct = cityRef.current?.pct ?? 0;
    const res = await contributePoints(points, missionsInc);
    if (res) {
      setCity(res);
      cityRef.current = res;
      const crossed = MILESTONES.filter((m) => prevPct < m.pct && res.pct >= m.pct);
      if (crossed.length) {
        const top = crossed[crossed.length - 1];
        setCelebrate({ label: top.label, verse: top.verse });
      }
    }
  }

  function say(msg: string) {
    setLine(msg);
  }

  function completeMission(m: Mission) {
    if (state.missions.includes(m.id)) return;
    persist({ ...state, points: state.points + m.points, missions: addArr(state.missions, m.id) });
    say("You helped revive another part of the city! 🌇");
    contribute(m.points, 1);
  }

  function winGame(game: MiniGameDef, fruitId?: string) {
    const next: GameState = {
      ...state,
      points: state.points + game.points,
      games: addArr(state.games, game.id),
      fruit: fruitId ? addArr(state.fruit, fruitId) : state.fruit,
      badges: fruitId ? addArr(state.badges, `fruit:${fruitId}`) : state.badges,
    };
    persist(next);
    say(fruitId ? "The fruit of the Spirit grows in you! 🌿" : "You brought more light to the city! ✨");
    contribute(game.points, 0);
    setGameCtx(null);
  }

  function completeVerse(v: VC) {
    if (state.verses.includes(v.id)) return;
    persist({ ...state, points: state.points + v.points, verses: addArr(state.verses, v.id), badges: addArr(state.badges, `verse:${v.id}`) });
    say("God's Word is getting stronger in your heart! 📖");
    contribute(v.points, 0);
    setVerseOpen(null);
  }

  const pct = city?.pct ?? 0;
  const nextMilestone = MILESTONES.find((m) => m.pct > pct);
  const badgeCount = state.badges.length;

  return (
    <div className="px-4 pb-4">
      {/* Hero */}
      <div className="pt-6 text-center safe-top">
        <Eyebrow>Play together</Eyebrow>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white">Revive the City</h1>
      </div>

      {/* Captain + speech */}
      <div className="mt-4 flex items-end gap-2">
        <CaptainGoodness size={96} />
        <motion.div
          key={line}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative mb-3 flex-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 p-3 text-sm font-medium text-white/90"
        >
          <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-gold-400">Captain Goodness</span>
          {line}
        </motion.div>
      </div>

      {/* Community progress */}
      <Reveal className="mt-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-ink/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-200">Community light</span>
            <span className="font-display text-2xl font-extrabold text-gold-400">{pct}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-gold-400 to-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">
            {nextMilestone ? (
              <>Next: <span className="text-white/80">{nextMilestone.label}</span> at {nextMilestone.pct}%</>
            ) : (
              <>The whole city is revived — keep the light going! 🎉</>
            )}
          </p>
        </div>
      </Reveal>

      {/* City scene */}
      <Reveal className="mt-4">
        <CityScene pct={pct} />
      </Reveal>

      {/* Your stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat icon={<Sparkle width={18} height={18} />} label="Your Light Points" value={state.points.toLocaleString()} />
        <Stat icon={<Trophy width={18} height={18} />} label="Badges earned" value={String(badgeCount)} />
      </div>

      {/* Daily missions */}
      <Section title="Today's Missions" hint="Tap “I did it!” after you complete one.">
        <div className="space-y-2.5">
          {missions.map((m) => {
            const done = state.missions.includes(m.id);
            return (
              <div key={m.id} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${done ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-purple-200">{m.category}</span>
                <span className={`min-w-0 flex-1 text-sm font-medium ${done ? "text-white/60 line-through" : "text-white"}`}>{m.text}</span>
                <button
                  disabled={done}
                  onClick={() => completeMission(m)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition active:scale-95 ${done ? "bg-emerald-500/20 text-emerald-200" : "bg-gold text-navy-950"}`}
                >
                  {done ? <Check width={16} height={16} /> : "I did it!"}
                </button>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Mini-games */}
      <Section title="Play a Mini-Game" hint="Quick, fun, and every win adds light to the city.">
        <div className="grid grid-cols-2 gap-3">
          {MINI_GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGameCtx({ game: g })}
              className="flex flex-col items-start gap-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left transition active:scale-[0.98]"
            >
              <span className="text-3xl">{g.emoji}</span>
              <span className="text-sm font-bold text-white">{g.name}</span>
              <span className="text-[11px] leading-tight text-white/55">{g.blurb}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-gold-400">
                <Play width={12} height={12} /> +{g.points} pts
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Fruit journey */}
      <Section title="Fruit of the Spirit Journey" hint="Galatians 5:22–23 — one badge for each.">
        <div className="grid grid-cols-3 gap-2.5">
          {FRUITS.map((f) => {
            const earned = state.fruit.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => setFruitOpen(f)}
                className={`relative flex flex-col items-center gap-1 rounded-2xl border p-3 transition active:scale-[0.97] ${earned ? "border-gold/40 bg-gold/10" : "border-white/10 bg-white/5"}`}
              >
                <span className="text-2xl">{f.emoji}</span>
                <span className={`text-[11px] font-bold ${f.color}`}>{f.name}</span>
                {earned && <span className="absolute right-1.5 top-1.5 text-gold-400">★</span>}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Verse challenges */}
      <Section title="Bible Verse Challenges" hint={`Grow God's Word in your heart · ${BIBLE_TRANSLATION}`}>
        <div className="space-y-2.5">
          {VERSE_CHALLENGES.map((v) => {
            const done = state.verses.includes(v.id);
            return (
              <button
                key={v.id}
                onClick={() => setVerseOpen(v)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99] ${done ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}
              >
                <span className="rounded-lg bg-purple-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-200">{v.level}</span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-white">{v.ref}</span>
                {done ? <span className="text-emerald-300">★ +{v.points}</span> : <span className="text-xs font-bold text-gold-400">+{v.points}</span>}
              </button>
            );
          })}
        </div>
      </Section>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-white/40">
        The city transformation is symbolic — a picture of hope. Real goodness comes from following Jesus. 💛
      </p>

      {/* ===== Modals ===== */}
      <AnimatePresence>
        {gameCtx && (
          <MiniGame
            key="mg"
            game={gameCtx.game}
            onWin={(pts) => winGame({ ...gameCtx.game, points: pts }, gameCtx.fruitId)}
            onClose={() => setGameCtx(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fruitOpen && (
          <FruitDetail
            fruit={fruitOpen}
            done={state.fruit.includes(fruitOpen.id)}
            onPlay={() => {
              const g = MINI_GAMES.find((x) => x.id === fruitOpen.miniGame) ?? MINI_GAMES[0];
              setGameCtx({ game: g, fruitId: fruitOpen.id });
              setFruitOpen(null);
            }}
            onClose={() => setFruitOpen(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verseOpen && (
          <VerseChallengeModal
            v={verseOpen}
            done={state.verses.includes(verseOpen.id)}
            onComplete={() => completeVerse(verseOpen)}
            onClose={() => setVerseOpen(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebrate && <Celebration data={celebrate} onClose={() => setCelebrate(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-gold-400">{icon}</span>
      <div>
        <p className="font-display text-xl font-bold text-white">{value}</p>
        <p className="text-[11px] text-white/55">{label}</p>
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-7">
      <h2 className="font-display text-xl font-bold text-white">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-xs text-white/55">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </Reveal>
  );
}

// ---------- Fruit detail modal ----------
function FruitDetail({ fruit, done, onPlay, onClose }: { fruit: Fruit; done: boolean; onPlay: () => void; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-4xl">{fruit.emoji}</div>
        <h3 className={`mt-3 font-display text-3xl font-extrabold ${fruit.color}`}>{fruit.name}</h3>
        <p className="mt-1 text-sm text-white/70">{fruit.blurb}</p>
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold-400">Your mission</p>
        <p className="mt-1 text-[15px] font-medium text-white">{fruit.mission}</p>
      </div>
      <figure className="mt-3 rounded-2xl border border-white/10 bg-purple-900/20 p-4 text-center">
        <blockquote className="text-sm italic text-white/90">&ldquo;{fruit.verse.text}&rdquo;</blockquote>
        <figcaption className="mt-2 text-xs font-bold uppercase tracking-widest text-gold-400">{fruit.verse.ref}</figcaption>
      </figure>
      <button
        onClick={onPlay}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-4 font-bold text-navy-950 shadow-glow active:scale-[0.98]"
      >
        <Play width={18} height={18} /> {done ? "Play again" : `Play & earn the ${fruit.name} badge`}
      </button>
      {done && <p className="mt-3 text-center text-xs font-semibold text-emerald-300">★ Badge earned!</p>}
    </ModalShell>
  );
}

// ---------- Verse challenge modal ----------
function VerseChallengeModal({ v, done, onComplete, onClose }: { v: VC; done: boolean; onComplete: () => void; onClose: () => void }) {
  const [order, setOrder] = useState<string[]>(v.type === "order" ? shuffle(v.words) : []);
  const [built, setBuilt] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState(done);
  const [wrong, setWrong] = useState(false);

  function choose(opt: string) {
    if (v.type !== "choice") return;
    setPicked(opt);
    if (opt === v.answer) {
      setSolved(true);
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setPicked(null);
      }, 900);
    }
  }

  function tapWord(w: string, i: number) {
    if (v.type !== "order") return;
    const nextBuilt = [...built, w];
    setBuilt(nextBuilt);
    setOrder(order.filter((_, idx) => idx !== i));
    if (nextBuilt.length === v.words.length) {
      if (nextBuilt.join(" ") === v.words.join(" ")) setSolved(true);
      else {
        setWrong(true);
        setTimeout(() => {
          setWrong(false);
          setBuilt([]);
          setOrder(shuffle(v.words));
        }, 1000);
      }
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="text-center">
        <span className="rounded-lg bg-purple-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-200">{v.level}</span>
        <h3 className="mt-3 font-display text-2xl font-bold text-white">{v.ref}</h3>
        <p className="text-[11px] text-white/45">{BIBLE_TRANSLATION}</p>
      </div>

      {!solved ? (
        <div className="mt-5">
          {v.type === "choice" ? (
            <>
              <p className="mb-4 text-center text-lg font-medium leading-relaxed text-white">{v.prompt}</p>
              <div className="space-y-2.5">
                {v.options.map((o) => (
                  <button
                    key={o}
                    onClick={() => choose(o)}
                    className={`w-full rounded-2xl border p-3.5 text-[15px] font-semibold transition active:scale-[0.99] ${
                      picked === o ? (o === v.answer ? "border-emerald-400 bg-emerald-500/20 text-white" : "border-rose-400 bg-rose-500/15 text-white") : "border-white/12 bg-white/5 text-white/85"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-center text-xs text-white/55">Tap the words in the right order:</p>
              <div className={`mb-4 min-h-[52px] rounded-2xl border p-3 text-center text-[15px] font-semibold text-white ${wrong ? "border-rose-400/50" : "border-white/12"} bg-white/5`}>
                {built.join(" ") || <span className="text-white/30">…</span>}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {order.map((w, i) => (
                  <button key={`${w}-${i}`} onClick={() => tapWord(w, i)} className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm font-semibold text-white active:scale-95">
                    {w}
                  </button>
                ))}
              </div>
            </>
          )}
          {wrong && <p className="mt-3 text-center text-xs font-semibold text-gold-400">Not quite — give it another try! 💛</p>}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center text-center">
          <CaptainGoodness size={90} />
          <h4 className="mt-2 font-display text-xl font-bold text-white">You got it! 📖</h4>
          <p className="mt-1 text-sm text-white/70">God&apos;s Word is a lamp for your feet.</p>
          {!done ? (
            <button onClick={onComplete} className="mt-5 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-bold text-navy-950 shadow-glow active:scale-95">
              Claim +{v.points} Light Points
            </button>
          ) : (
            <button onClick={onClose} className="mt-5 rounded-2xl bg-white/10 px-6 py-3 font-bold text-white active:scale-95">
              Done
            </button>
          )}
        </div>
      )}
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] flex items-end justify-center bg-ink/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-white/10 bg-gradient-to-b from-navy-900 to-ink p-5 pb-8 safe-bottom"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
        {children}
      </motion.div>
    </motion.div>
  );
}

// ---------- Milestone celebration ----------
function Celebration({ data, onClose }: { data: { label: string; verse?: { text: string; ref: string } }; onClose: () => void }) {
  const pieces = Array.from({ length: 28 });
  const colors = ["#F5A623", "#9333EA", "#a855f7", "#FFC24D", "#4bb873", "#ff6fae"];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/80 backdrop-blur" onClick={onClose}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: -40, x: `${(i / pieces.length) * 100}%`, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", rotate: 360 }}
            transition={{ duration: 2.2 + (i % 5) * 0.3, delay: (i % 7) * 0.08, ease: "easeIn" }}
            style={{ position: "absolute", width: 10, height: 14, background: colors[i % colors.length], borderRadius: 2 }}
          />
        ))}
      </div>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mx-6 max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-navy-900 to-ink p-7 text-center">
        <CaptainGoodness size={110} />
        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-purple-300">Milestone unlocked</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold text-gold-400">{data.label}</h3>
        {data.verse && (
          <figure className="mt-4">
            <blockquote className="text-sm italic text-white/85">&ldquo;{data.verse.text}&rdquo;</blockquote>
            <figcaption className="mt-2 text-xs font-bold uppercase tracking-widest text-gold-400">{data.verse.ref}</figcaption>
          </figure>
        )}
        <button onClick={onClose} className="mt-6 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-8 py-3 font-bold text-navy-950 shadow-glow active:scale-95">
          Keep going! 🎉
        </button>
      </motion.div>
    </motion.div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
