"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { Eyebrow } from "@/components/Reveal";
import CaptainGoodness, { type Reaction } from "@/components/game/CaptainGoodness";
import CityScene from "@/components/game/CityScene";
import MiniGame from "@/components/game/MiniGame";
import Portal from "@/components/Portal";
import AmbientFX from "@/components/game/AmbientFX";
import DailyMission from "@/components/game/DailyMission";
import WeeklyBoss, { type StrikeTarget } from "@/components/game/WeeklyBoss";
import FruitMeters from "@/components/game/FruitMeters";
import CaptainLevel from "@/components/game/CaptainLevel";
import KingdomSpotlight from "@/components/game/KingdomSpotlight";
import GameIntro from "@/components/game/GameIntro";
import ActivityTicker from "@/components/game/ActivityTicker";
import MilestoneJourney from "@/components/game/MilestoneJourney";
import { QuizList, QuizModal } from "@/components/game/BibleQuiz";
import ChurchCrew from "@/components/game/ChurchCrew";
import PrayerWall from "@/components/game/PrayerWall";
import { usePresence } from "@/lib/useLive";
import { notifyMilestone, notifyBossVictory, subscribeToPush, pushEnabled } from "@/lib/push";
import { Check, Play, Trophy, Sparkle, BellIcon } from "@/components/icons";
import {
  BIBLE_TRANSLATION,
  BOSS_GOAL,
  DAILY_GOAL,
  CATEGORY_FRUIT,
  FRUITS,
  MILESTONES,
  MINI_GAMES,
  VERSE_CHALLENGES,
  captainLevel,
  getStreak,
  recordStreak,
  haptic,
  contributeCommunity,
  dailyMission,
  doDaily,
  fetchBoss,
  fetchCityProgress,
  fetchDaily,
  fetchFruitMeters,
  fetchSpotlight,
  addSpotlight,
  getGameBests,
  setGameBest,
  isoWeekKey,
  loadState,
  missionsForToday,
  saveState,
  todayKey,
  weeklyBoss,
  type CityProgress,
  type Fruit,
  type FruitMeters as FruitMetersT,
  type GameState,
  type MiniGame as MiniGameDef,
  type Mission,
  type Spotlight,
  type VerseChallenge as VC,
  type Quiz,
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
// Daily missions are scoped to the date so a fresh set is completable each day.
const missionKey = (id: string) => `${todayKey()}#${id}`;

export default function GameScreen() {
  const [state, setState] = useState<GameState>(() => loadState());
  const [city, setCity] = useState<CityProgress | null>(null);
  const cityRef = useRef<CityProgress | null>(null);
  const [boss, setBoss] = useState(0);
  const bossRef = useRef(0);
  const [fruits, setFruits] = useState<FruitMetersT>({});
  const [daily, setDaily] = useState(0);
  const [dailyDone, setDailyDone] = useState(false);
  const [spotlight, setSpotlight] = useState<Spotlight[]>([]);
  const [optIn, setOptIn] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [streak, setStreak] = useState(0);
  const [myStrikes, setMyStrikes] = useState(0);
  const [bests, setBests] = useState<Record<string, number>>({});
  const [pushOn, setPushOn] = useState(false);
  const [line, setLine] = useState(CAPTAIN_LINES[0]);
  const [reaction, setReaction] = useState<Reaction>("idle");
  const reactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dailyBusy = useRef(false);
  const players = usePresence();

  function react(r: Reaction) {
    setReaction(r);
    if (reactTimer.current) clearTimeout(reactTimer.current);
    reactTimer.current = setTimeout(() => setReaction("idle"), 3200);
  }

  const [gameCtx, setGameCtx] = useState<{ game: MiniGameDef; fruitId?: string } | null>(null);
  const [fruitOpen, setFruitOpen] = useState<Fruit | null>(null);
  const [verseOpen, setVerseOpen] = useState<VC | null>(null);
  const [quizOpen, setQuizOpen] = useState<Quiz | null>(null);
  const [celebrate, setCelebrate] = useState<{ label: string; subtitle?: string; verse?: { text: string; ref: string } } | null>(null);

  const missions = useMemo(() => missionsForToday(), []);
  const dm = useMemo(() => dailyMission(), []);
  const bossMeta = useMemo(() => weeklyBoss(), []);

  useEffect(() => {
    fetchCityProgress().then((c) => { setCity(c); cityRef.current = c; });
    fetchBoss().then((b) => { setBoss(b); bossRef.current = b; });
    fetchFruitMeters().then(setFruits);
    fetchDaily().then(setDaily);
    fetchSpotlight().then(setSpotlight);
    try {
      setDailyDone(localStorage.getItem(`jf-daily-${todayKey()}`) === "1");
      setOptIn(localStorage.getItem("jf-spotlight") !== "0");
      if (localStorage.getItem("jf-game-intro") !== "done") setShowIntro(true);
      setStreak(getStreak());
      setMyStrikes(Number(localStorage.getItem(`jf-strikes-${isoWeekKey()}`) || "0"));
      setBests(getGameBests());
      setPushOn(pushEnabled());
    } catch {
      /* ignore */
    }
  }, []);

  // Jump straight into the action from the Weekly Challenge strike buttons.
  function strike(target: StrikeTarget) {
    haptic(10);
    const el = document.getElementById(`section-${target}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function enablePush() {
    const res = await subscribeToPush();
    if (res.ok) {
      setPushOn(true);
      haptic(20);
    } else {
      alert(res.error || "Couldn't enable alerts.");
    }
  }

  function closeIntro() {
    setShowIntro(false);
    try {
      localStorage.setItem("jf-game-intro", "done");
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const iv = setInterval(() => setLine(CAPTAIN_LINES[Math.floor(Math.random() * CAPTAIN_LINES.length)]), 6000);
    return () => clearInterval(iv);
  }, []);

  function persist(next: GameState) {
    setState(next);
    saveState(next);
  }
  function say(msg: string) {
    setLine(msg);
  }

  function spotlightPost(action: string) {
    let name: string | null = null;
    let church: string | null = null;
    try {
      name = localStorage.getItem("jf-name");
      church = localStorage.getItem("jf-church");
    } catch {
      /* ignore */
    }
    if (!optIn || !name) return;
    addSpotlight(name, church, action);
    setSpotlight((prev) => [{ id: `local-${prev.length}-${action}`, name, church, action, created_at: new Date().toISOString() }, ...prev].slice(0, 40));
  }

  // Every Kingdom act feeds the shared city + a fruit + this week's challenge.
  async function community(points: number, missionsInc: number, fruit: string | null) {
    // Only celebrate crossings when we actually know the starting point —
    // a failed initial fetch must not fire every milestone at once.
    const baselineKnown = cityRef.current !== null;
    const prevPct = cityRef.current?.pct ?? 0;
    const prevBoss = bossRef.current;
    const prevLevel = captainLevel(cityRef.current?.missions ?? 0).level;
    if (fruit) setFruits((f) => ({ ...f, [fruit]: (f[fruit] ?? 0) + 1 }));
    const res = await contributeCommunity(points, missionsInc, fruit);
    if (!res) return;
    setCity(res.city);
    cityRef.current = res.city;
    setBoss(res.boss);
    bossRef.current = res.boss;
    // Every confirmed act is a personal "strike" on this week's challenge.
    setMyStrikes((s) => {
      const next = s + 1;
      try {
        localStorage.setItem(`jf-strikes-${isoWeekKey()}`, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    if (!baselineKnown) return;
    const crossed = MILESTONES.filter((m) => prevPct < m.pct && res.city.pct >= m.pct);
    const newLevel = captainLevel(res.city.missions).level;
    if (prevBoss > 0 && prevBoss < BOSS_GOAL && res.boss >= BOSS_GOAL) {
      haptic([80, 40, 80, 40, 140]);
      notifyBossVictory(); // server verifies the goal + dedupes, then pushes the victory to everyone
      setCelebrate({ label: `${bossMeta.name} Overcome! 🎉`, subtitle: `The community pushed back ${bossMeta.name.toLowerCase()} through ${bossMeta.defeatedBy.toLowerCase()}.`, verse: bossMeta.verse });
    } else if (crossed.length) {
      const top = crossed[crossed.length - 1];
      haptic([80, 40, 80, 40, 140]);
      notifyMilestone(top.pct); // server verifies + dedupes, then pushes to everyone
      setCelebrate({ label: top.label, verse: top.verse });
    } else if (newLevel > prevLevel) {
      haptic([60, 40, 60]);
      setCelebrate({ label: `Captain Goodness reached Level ${newLevel}! 🦸`, subtitle: "The whole community leveled him up — his light shines brighter!" });
    }
  }

  function completeMission(m: Mission) {
    if (state.missions.includes(missionKey(m.id))) return;
    haptic(14);
    persist({ ...state, points: state.points + m.points, missions: addArr(state.missions, missionKey(m.id)) });
    react("cheer");
    say("You helped revive the city! 🌇");
    community(m.points, 1, CATEGORY_FRUIT[m.category] ?? "goodness");
    spotlightPost(m.text.toLowerCase());
  }

  function winGame(game: MiniGameDef, fruitId: string | undefined, stars: number) {
    haptic(14);
    const bonus = (stars - 1) * 25; // reward skill: 2★ = +25, 3★ = +50
    const total = game.points + bonus;
    const next: GameState = {
      ...state,
      points: state.points + total,
      games: addArr(state.games, game.id),
      fruit: fruitId ? addArr(state.fruit, fruitId) : state.fruit,
      badges: fruitId ? addArr(state.badges, `fruit:${fruitId}`) : state.badges,
    };
    persist(next);
    setBests(setGameBest(game.id, stars));
    react("celebrate");
    say(stars === 3 ? "Three stars — flawless! ⭐ The city shines brighter!" : fruitId ? "The fruit of the Spirit grows in you! 🌿" : "You brought more light to the city! ✨");
    community(total, 0, fruitId ?? "goodness");
    setGameCtx(null);
  }

  function completeVerse(v: VC) {
    if (state.verses.includes(v.id)) return;
    haptic(14);
    persist({ ...state, points: state.points + v.points, verses: addArr(state.verses, v.id), badges: addArr(state.badges, `verse:${v.id}`) });
    react("cheer");
    say("God's Word is getting stronger in your heart! 📖");
    community(v.points, 0, "faithfulness");
    setVerseOpen(null);
  }

  function completeQuiz(q: Quiz) {
    const badge = `quiz:${q.id}`;
    if (state.badges.includes(badge)) return;
    haptic(16);
    persist({ ...state, points: state.points + q.points, badges: addArr(state.badges, badge) });
    react("celebrate");
    say("You know your Bible — amazing! 📖🎉");
    community(q.points, 0, "faithfulness");
    setQuizOpen(null);
  }

  async function doDailyMission() {
    if (dailyDone || dailyBusy.current) return;
    dailyBusy.current = true;
    const prevDaily = daily;
    // Confirm the shared counter FIRST — never mark done if the network failed,
    // so the user can retry instead of silently losing their contribution.
    const newCount = await doDaily();
    dailyBusy.current = false;
    if (newCount == null) {
      say("Hmm — I couldn't reach the city. Check your connection and try again! 📶");
      return;
    }
    haptic(18);
    setDailyDone(true);
    setStreak(recordStreak());
    try {
      localStorage.setItem(`jf-daily-${todayKey()}`, "1");
    } catch {
      /* ignore */
    }
    setDaily(newCount);
    react("celebrate");
    say("Thank you for doing today's mission — the whole city moves forward! 🌇");
    community(120, 1, dm.fruit);
    spotlightPost(dm.text.toLowerCase());
    if (prevDaily < DAILY_GOAL && newCount >= DAILY_GOAL) {
      setCelebrate({ label: "Today's Global Mission Complete! 🎉", subtitle: `The community unlocked "${dm.reward}"!`, verse: { text: "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", ref: "Matthew 5:16" } });
    }
  }

  function toggleOptIn() {
    setOptIn((v) => {
      const next = !v;
      try {
        localStorage.setItem("jf-spotlight", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const pct = city?.pct ?? 0;
  const nextMilestone = MILESTONES.find((m) => m.pct > pct);
  const badgeCount = state.badges.length;
  const cap = captainLevel(city?.missions ?? 0);

  return (
    <div className="px-4 pb-4">
      {/* ===== HERO: Revive Hamilton ===== */}
      <div className="relative -mx-4 overflow-hidden px-4 pb-1">
        <AmbientFX pct={pct} />
        <div className="relative pt-6 text-center safe-top">
          <Eyebrow>The whole city, together</Eyebrow>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white">Revive the City</h1>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-white/60">
            Hamilton has lost its color. As we complete real Kingdom missions together, God is bringing it back to life.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setShowIntro(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/70 active:scale-95"
            >
              ✨ How it works
            </button>
            {!pushOn ? (
              <button
                onClick={enablePush}
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/15 px-3.5 py-1.5 text-[11px] font-semibold text-purple-200 active:scale-95"
              >
                <BellIcon width={12} height={12} /> Milestone alerts
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[11px] font-semibold text-gold-400">
                <BellIcon width={12} height={12} /> Alerts on
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {players >= 2 ? `${players} reviving Hamilton now` : "You're reviving Hamilton now"}
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold-400">
                🔥 {streak}-day streak
              </span>
            )}
          </div>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-purple-900/40 to-ink/60 p-5 text-center">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gold/15 blur-3xl" />
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-purple-200">Revive Hamilton</p>
          <motion.p key={pct} initial={{ scale: 0.85, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="text-gradient-gold font-display text-6xl font-black leading-none">
            {pct}%
          </motion.p>

          {/* Upgraded bar: glow, milestone ticks & a shine sweep */}
          <div className="relative mx-auto mt-4 h-5 w-full max-w-xs">
            <div className="absolute inset-0 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-purple-500 via-gold-400 to-gold-500"
                style={{ boxShadow: "0 0 18px rgba(245,166,35,0.55)" }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(pct, 3)}%` }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                <motion.span
                  className="absolute inset-y-0 w-8 bg-white/40 blur-sm"
                  animate={{ left: ["-15%", "110%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
            {/* milestone ticks */}
            {MILESTONES.map((m) => (
              <span
                key={m.pct}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px]"
                style={{ left: `${m.pct}%`, opacity: pct >= m.pct ? 1 : 0.4, filter: pct >= m.pct ? "none" : "grayscale(1)" }}
              >
                {m.emoji}
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs text-white/60">
            {nextMilestone ? <>Next unlock: <span className="text-white/85">{nextMilestone.label}</span> at {nextMilestone.pct}%</> : <>The whole city is revived! 🎉</>}
          </p>
          {city && <p className="mt-1 text-[11px] text-gold-400">🙌 {city.missions.toLocaleString()} Kingdom acts by the community — you have a part to play!</p>}
        </div>

        {/* What we unlock together */}
        <div className="relative mt-3">
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">The journey ahead — unlocked together</p>
          <MilestoneJourney pct={pct} />
        </div>

        <div className="relative mt-4">
          <CityScene pct={pct} />
          <p className="mt-2 px-2 text-center text-[12px] leading-relaxed text-white/55">
            This is <span className="font-semibold text-white/80">Hamilton</span>. Every act of love turns the lights on, grows the gardens, and lifts the cross higher — until the whole city shines. 🌆
          </p>
        </div>

        {/* Community heartbeat — live proof we're moving together */}
        <div className="relative mt-3 grid grid-cols-3 gap-2">
          <HeartbeatChip emoji="🌟" value={daily.toLocaleString()} label="did today's mission" />
          <HeartbeatChip emoji="⚔️" value={`${Math.min(100, Math.round((boss / BOSS_GOAL) * 100))}%`} label={`${bossMeta.name.toLowerCase()} pushed back`} />
          <HeartbeatChip emoji="🙌" value={(city?.missions ?? 0).toLocaleString()} label="Kingdom acts so far" />
        </div>
      </div>

      {/* Captain Goodness — community level */}
      <Reveal className="mt-8">
        <SectionIntro emoji="🦸" title="Meet Captain Goodness" text="Your cheerful guide! The whole community levels him up — every good deed makes his light shine brighter." />
        <CaptainLevel level={cap.level} pct={cap.pct} toNext={cap.toNext} line={line} reaction={reaction} />
      </Reveal>

      {/* Live activity ticker */}
      {spotlight.length > 0 && (
        <Reveal className="mt-4">
          <ActivityTicker entries={spotlight} />
        </Reveal>
      )}

      {/* Daily global mission */}
      <Reveal className="mt-12">
        <SectionIntro emoji="🌟" title="Today's Global Mission" text="One simple mission for everyone, every day. Do it in real life, then tap the button — and watch the whole community's progress grow!" />
        <DailyMission mission={dm} count={daily} goal={DAILY_GOAL} done={dailyDone} onDo={doDailyMission} />
      </Reveal>

      <Motivate text="💛 Your one act today joins thousands of others. Together, we light up the city!" />

      {/* Weekly Kingdom challenge */}
      <Reveal className="mt-12">
        <SectionIntro emoji="⚔️" title="This Week's Challenge" text="Each week we face one challenge together — like Fear or Discouragement. Every mission, game, and prayer pushes it back until light wins!" />
        <WeeklyBoss boss={bossMeta} progress={boss} goal={BOSS_GOAL} myStrikes={myStrikes} onStrike={strike} />
      </Reveal>

      {/* Your stats */}
      <Reveal className="mt-12">
        <SectionIntro emoji="✨" title="Your Journey" text="Your personal Light Points and badges. Every point you earn is also added to the whole city!" />
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Sparkle width={18} height={18} />} label="Your Light Points" value={state.points.toLocaleString()} />
          <Stat icon={<Trophy width={18} height={18} />} label="Badges earned" value={String(badgeCount)} />
        </div>
      </Reveal>

      {/* Daily missions */}
      <Section id="section-missions" emoji="🙌" title="Your Missions Today" text="Three simple, real-life missions — pray, encourage, invite. Do one out in the real world, then come back and tap “I did it!”">
        <div className="space-y-2.5">
          {missions.map((m) => {
            const done = state.missions.includes(missionKey(m.id));
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

      <Motivate text="🔥 Every mission matters. No act of love is ever too small — keep going, hero!" />

      {/* Mini-games */}
      <Section id="section-games" emoji="🎮" title="Play a Mini-Game" text="Nine quick, colorful games for all ages. Earn up to ⭐⭐⭐ for a flawless run — replay to beat your best and add extra light to the city!">
        <div className="grid grid-cols-2 gap-3">
          {MINI_GAMES.map((g) => {
            const best = bests[g.id] ?? 0;
            const isNew = g.id === "ark";
            return (
              <button
                key={g.id}
                onClick={() => setGameCtx({ game: g })}
                className="relative flex flex-col items-start gap-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left transition active:scale-[0.98]"
              >
                {isNew && <span className="absolute right-2 top-2 rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-navy-950">New</span>}
                <span className="text-3xl">{g.emoji}</span>
                <span className="text-sm font-bold text-white">{g.name}</span>
                <span className="text-[11px] leading-tight text-white/55">{g.blurb}</span>
                <div className="mt-1 flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400">
                    <Play width={12} height={12} /> +{g.points}
                  </span>
                  <span className="text-[11px] tracking-tight" title={best ? "Your best" : "Not played yet"}>
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={i <= best ? "" : "opacity-20 grayscale"}>⭐</span>
                    ))}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Fruit journey */}
      <Section emoji="🍇" title="Fruit of the Spirit Journey" text="Nine beautiful qualities from Galatians 5:22–23 — like Love, Joy & Kindness. Tap one to get a mission, a verse, and a game — and earn its badge!">
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

      {/* Community fruit meters */}
      <Section emoji="🌳" title="The City's Fruit" text="Watch the fruit of the Spirit grow across the whole city — every prayer grows Peace, every kind act grows Kindness. We grow it together!">
        <FruitMeters meters={fruits} />
      </Section>

      <Motivate text="🌆 “Let your light shine before others…” — Matthew 5:16. Hamilton gets brighter with every act!" />

      {/* Verse challenges */}
      <Section id="section-verses" emoji="📖" title="Bible Verse Challenges" text={`Fun little puzzles that plant God's Word in your heart (${BIBLE_TRANSLATION}). Solve them to earn points and badges!`}>
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

      {/* Bible quizzes */}
      <Section emoji="🧠" title="Bible Quiz" text="Three levels of fun Bible trivia — start easy, work up to Kingdom Champion! Get all 5 right to earn big Light Points. No losing, just learning!">
        <QuizList done={state.badges.filter((b) => b.startsWith("quiz:")).map((b) => b.slice(5))} onOpen={(q) => setQuizOpen(q)} />
      </Section>

      {/* Spread the word */}
      <Section emoji="📣" title="Spread the Word" text="The easiest mission of all — share the app or the festival with your friends on social media. Every share brings more people into the light!">
        <ShareMissions
          done={state.badges.filter((b) => b.startsWith("share-"))}
          onShared={(id, points) => {
            if (state.badges.includes(id)) return;
            haptic(16);
            persist({ ...state, points: state.points + points, badges: addArr(state.badges, id) });
            react("celebrate");
            say("You're spreading the light — thank you! 📣✨");
            community(points, 0, "love");
          }}
        />
      </Section>

      {/* Church Crew */}
      <Section emoji="⛪" title="Church Crew" text="Rally your congregation! Join your church's crew with a code — or start one and share it. Every Kingdom act you do counts for your church family too. Celebrated together, never ranked!">
        <ChurchCrew />
      </Section>

      {/* Prayer Wall */}
      <Section emoji="🙏" title="Prayer Wall" text="Share a prayer request or a praise report — and tap 'I'm praying' to stand with others. We carry each other's burdens as one family.">
        <PrayerWall
          onPosted={() => {
            if (state.badges.includes("prayer-posted")) return;
            haptic(16);
            persist({ ...state, points: state.points + 80, badges: addArr(state.badges, "prayer-posted") });
            react("pray");
            say("Thank you for lifting that up — we're praying with you. 🙏");
            community(80, 0, "peace");
          }}
        />
      </Section>

      <Section emoji="🌟" title="Kingdom Spotlight" text="A rotating celebration of real people doing real good — never a competition, just encouragement. Add your first name & church to join in!">
        <KingdomSpotlight entries={spotlight} optIn={optIn} onToggleOptIn={toggleOptIn} />
      </Section>

      <Motivate text="🙏 We're not building an app — we're building unity. Fix your eyes on Jesus, and let's revive this city together. All for His glory!" />

      <p className="mt-8 text-center text-[11px] leading-relaxed text-white/40">
        The city transformation is symbolic — a picture of hope. Real goodness comes from following Jesus. 💛
      </p>

      {/* ===== Modals ===== */}
      <AnimatePresence>
        {gameCtx && (
          <MiniGame
            key="mg"
            game={gameCtx.game}
            onWin={(pts, stars) => winGame({ ...gameCtx.game, points: pts }, gameCtx.fruitId, stars)}
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

      <AnimatePresence>
        {quizOpen && (
          <QuizModal
            quiz={quizOpen}
            done={state.badges.includes(`quiz:${quizOpen.id}`)}
            onComplete={() => completeQuiz(quizOpen)}
            onClose={() => setQuizOpen(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{showIntro && <GameIntro onDone={closeIntro} />}</AnimatePresence>
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

// A friendly, spacious section header anyone can understand at a glance.
function HeartbeatChip({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-2 py-2.5 text-center">
      <div className="text-base leading-none">{emoji}</div>
      <div className="mt-1 font-display text-lg font-extrabold leading-none text-gold-400">{value}</div>
      <div className="mt-1 text-[9.5px] leading-tight text-white/55">{label}</div>
    </div>
  );
}

function SectionIntro({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-lg">{emoji}</span>
        <h2 className="font-display text-xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-[13px] leading-relaxed text-white/60">{text}</p>
    </div>
  );
}

function Section({ emoji, title, text, id, children }: { emoji: string; title: string; text: string; id?: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-12">
      <section id={id} className="scroll-mt-4">
        <SectionIntro emoji={emoji} title={title} text={text} />
        {children}
      </section>
    </Reveal>
  );
}

// A short spark of motivation between sections.
function Motivate({ text }: { text: string }) {
  return (
    <Reveal className="mt-8">
      <p className="rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/10 to-transparent px-4 py-3 text-center text-[13px] font-medium leading-relaxed text-white/80">
        {text}
      </p>
    </Reveal>
  );
}

// Spread-the-word missions: share the app / JesusFestival.ca on social media.
function ShareMissions({ done, onShared }: { done: string[]; onShared: (id: string, points: number) => void }) {
  const items = [
    { id: "share-app", emoji: "📲", title: "Share the app with a friend", text: "Send JesusFestival.App to someone who'd love this.", url: "https://www.jesusfestival.app", msg: "Join me on the Jesus Festival app — we're reviving Hamilton together! 🌆", points: 100 },
    { id: "share-site", emoji: "🌐", title: "Share JesusFestival.ca", text: "Post the festival site so your friends can discover it.", url: "https://www.jesusfestival.ca", msg: "Jesus Festival is coming to Hamilton Sept 4–5 — free festival at Gage Park! 🙌", points: 100 },
  ];

  async function share(it: (typeof items)[number]) {
    let shared = false;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Jesus Festival", text: it.msg, url: it.url });
        shared = true;
      } else {
        await navigator.clipboard.writeText(`${it.msg} ${it.url}`);
        shared = true;
        alert("Link copied — paste it anywhere! 📋");
      }
    } catch {
      /* user cancelled the share sheet */
    }
    if (shared && !done.includes(it.id)) onShared(it.id, it.points);
  }

  return (
    <div className="space-y-2.5">
      {items.map((it) => {
        const isDone = done.includes(it.id);
        return (
          <div key={it.id} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${isDone ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-xl">{it.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">{it.title}</p>
              <p className="text-[12px] leading-snug text-white/55">{it.text}</p>
            </div>
            <button onClick={() => share(it)} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition active:scale-95 ${isDone ? "bg-emerald-500/20 text-emerald-200" : "bg-gold text-navy-950"}`}>
              {isDone ? <Check width={16} height={16} /> : `Share +${it.points}`}
            </button>
          </div>
        );
      })}
    </div>
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
  const [claimed, setClaimed] = useState(false);
  const claim = () => {
    if (claimed) return; // block double-tap during the exit animation
    setClaimed(true);
    onComplete();
  };

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
            <button onClick={claim} disabled={claimed} className="mt-5 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-bold text-navy-950 shadow-glow active:scale-95 disabled:opacity-60">
              {claimed ? "Claimed! ✨" : `Claim +${v.points} Light Points`}
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
    <Portal>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/70 backdrop-blur-sm" onClick={onClose}>
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
    </Portal>
  );
}

// ---------- Milestone celebration ----------
function Celebration({ data, onClose }: { data: { label: string; subtitle?: string; verse?: { text: string; ref: string } }; onClose: () => void }) {
  const pieces = Array.from({ length: 28 });
  const colors = ["#F5A623", "#9333EA", "#a855f7", "#FFC24D", "#4bb873", "#ff6fae"];
  return (
    <Portal>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/80 backdrop-blur" onClick={onClose}>
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
        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-purple-300">Community celebration</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold text-gold-400">{data.label}</h3>
        {data.subtitle && <p className="mt-1.5 text-sm text-white/75">{data.subtitle}</p>}
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
    </Portal>
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
