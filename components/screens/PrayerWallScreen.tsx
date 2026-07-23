"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "@/components/Portal";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { hasProfanity } from "@/lib/clean";
import { usePresence } from "@/lib/useLive";
import { pushEnabled, subscribeToPush } from "@/lib/push";
import {
  fetchPrayers,
  fetchPrayerStats,
  prayerAdd,
  prayerPray,
  prayerAnswer,
  prayedIds,
  markPrayed,
  myPrayerIds,
  getStreak,
  recordStreak,
  haptic,
  type Prayer,
  type PrayerStats,
} from "@/lib/game";
import { ArrowRight, Check, Share, BellIcon } from "@/components/icons";

const UNITY_VERSES = [
  { text: "For where two or three gather in my name, there am I with them.", ref: "Matthew 18:20" },
  { text: "Pray for one another… the prayer of a righteous person has great power.", ref: "James 5:16" },
  { text: "How good and pleasant it is when God's people live together in unity!", ref: "Psalm 133:1" },
  { text: "You are the light of the world. A city on a hill cannot be hidden.", ref: "Matthew 5:14" },
  { text: "Arise, shine, for your light has come, and the glory of the Lord rises upon you.", ref: "Isaiah 60:1" },
];

const CITY_PROMPTS = [
  "the churches of Hamilton to move as one",
  "the youth of our city to encounter Jesus",
  "families to be restored and filled with hope",
  "everyone coming to Jesus Festival to feel welcomed",
  "the lonely to be set in loving families",
  "our leaders to walk humbly with God",
  "healing for those who are hurting",
];

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 90) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

type Filter = "all" | "prayer" | "praise" | "answered";

export default function PrayerWallScreen() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [stats, setStats] = useState<PrayerStats | null>(null);
  const [prayed, setPrayed] = useState<Set<string>>(new Set());
  const [mine, setMine] = useState<Set<string>>(new Set());
  const [me, setMe] = useState<{ name: string | null; church: string | null }>({ name: null, church: null });
  const [kind, setKind] = useState<"prayer" | "praise">("prayer");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [verseIdx, setVerseIdx] = useState(0);
  const [prompt, setPrompt] = useState(CITY_PROMPTS[0]);
  const [streak, setStreak] = useState(0);
  const [pushOn, setPushOn] = useState(false);
  const [stillness, setStillness] = useState(false);
  const [journey, setJourney] = useState(false);
  const [journeyKey, setJourneyKey] = useState(0);
  const [answering, setAnswering] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const players = usePresence("prayer-wall-presence");

  function loadPrayers() {
    setLoadError(false);
    fetchPrayers().then((r) => {
      if (r === null) setLoadError(true);
      else setPrayers(r);
      setLoaded(true);
    });
  }

  useEffect(() => {
    loadPrayers();
    fetchPrayerStats().then(setStats);
    setPrayed(prayedIds());
    setMine(myPrayerIds());
    try {
      setMe({ name: localStorage.getItem("jf-name"), church: localStorage.getItem("jf-church") });
      setStreak(getStreak());
      setPushOn(pushEnabled());
    } catch {
      /* ignore */
    }
    const start = new Date(new Date().getFullYear(), 0, 0);
    const doy = Math.floor((Date.now() - start.getTime()) / 86400000);
    setPrompt(CITY_PROMPTS[doy % CITY_PROMPTS.length]);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setVerseIdx((i) => (i + 1) % UNITY_VERSES.length), 8000);
    return () => clearInterval(iv);
  }, []);

  function noteStreak() {
    try {
      setStreak(recordStreak());
    } catch {
      /* ignore */
    }
  }

  const counts = useMemo(
    () => ({
      all: prayers.length,
      prayer: prayers.filter((p) => p.kind === "prayer" && !p.answered).length,
      praise: prayers.filter((p) => p.kind === "praise").length,
      answered: prayers.filter((p) => p.answered).length,
    }),
    [prayers]
  );

  const visible = useMemo(() => {
    if (filter === "all") return prayers;
    if (filter === "answered") return prayers.filter((p) => p.answered);
    if (filter === "praise") return prayers.filter((p) => p.kind === "praise");
    return prayers.filter((p) => p.kind === "prayer" && !p.answered);
  }, [prayers, filter]);

  const totalLifted = stats?.total_prayed ?? prayers.reduce((n, p) => n + p.prayed, 0);

  async function post() {
    if (busy) return;
    setErr(null);
    const body = text.trim();
    if (body.length < 3) return setErr("Please share a few words. 💛");
    if (hasProfanity(body)) return setErr("Let's keep it friendly for all ages. 💛");
    setBusy(true);
    const res = await prayerAdd(me.name, me.church, body, kind);
    setBusy(false);
    if (!res.ok || !res.prayer) return setErr(res.error || "Couldn't post — try again.");
    haptic(16);
    setPrayers((prev) => [res.prayer!, ...prev]);
    setMine((prev) => new Set(prev).add(res.prayer!.id));
    setStats((s) => (s ? { ...s, [kind === "praise" ? "praises" : "requests"]: (kind === "praise" ? s.praises : s.requests) + 1 } : s));
    setText("");
    noteStreak();
  }

  async function pray(p: Prayer) {
    if (prayed.has(p.id)) return;
    haptic(12);
    setPrayed((prev) => new Set(prev).add(p.id));
    markPrayed(p.id);
    setPrayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, prayed: x.prayed + 1 } : x)));
    setStats((s) => (s ? { ...s, total_prayed: s.total_prayed + 1 } : s));
    noteStreak();
    const n = await prayerPray(p.id);
    if (n != null) setPrayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, prayed: n } : x)));
  }

  async function answer(p: Prayer) {
    setAnswering(p.id);
    const ok = await prayerAnswer(p.id);
    setAnswering(null);
    if (!ok) return;
    haptic([40, 30, 60]);
    setPrayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, answered: true } : x)));
    setStats((s) => (s ? { ...s, answered: s.answered + 1 } : s));
  }

  async function share(p: Prayer) {
    const verb = p.answered ? "See how God answered a prayer" : "Pray with us";
    const msg = `${verb}: “${p.body}” — join the Jesus Festival Prayer Wall 🙏`;
    try {
      if (navigator.share) return void (await navigator.share({ title: "Jesus Festival Prayer Wall", text: msg, url: "https://www.jesusfestival.app" }));
      await navigator.clipboard.writeText(`${msg} https://www.jesusfestival.app`);
    } catch {
      /* ignore */
    }
  }

  async function enablePush() {
    const res = await subscribeToPush();
    if (res.ok) {
      setPushOn(true);
      haptic(20);
    } else if (res.error) {
      alert(res.error);
    }
  }

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "prayer", label: "🙏 Prayers" },
    { id: "praise", label: "🎉 Praises" },
    { id: "answered", label: "✨ Answered" },
  ];

  return (
    <div className="px-4 pb-24">
      {/* ===== Sanctuary hero ===== */}
      <div className="relative -mx-4 overflow-hidden px-4 pb-2 pt-6 text-center safe-top">
        {/* altar glow + embers */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(147,51,234,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold-400/50 blur-[2px]"
              style={{ left: `${12 + i * 18}%`, bottom: 0, width: 5, height: 5 }}
              animate={{ y: [0, -150], opacity: [0, 0.7, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="relative">
          <Eyebrow>The Prayer Wall</Eyebrow>
          <h1 className="text-gradient-gold animate-shimmer mt-2 font-display text-4xl font-extrabold leading-[0.95] tracking-tight">
            The City Prays
            <br />as One
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-[13px] italic leading-relaxed text-white/60">Where Hamilton lifts its heart together.</p>

          {/* presence */}
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-medium text-white/75">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            🕯️ {players >= 2 ? `${players} praying right now` : "You're here in prayer"}
          </div>

          {/* incense counter */}
          <div className="relative mx-auto mt-4 max-w-xs overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-purple-900/40 to-ink/60 p-5">
            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-200">Prayers lifted like incense</p>
            <motion.p
              key={totalLifted}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-gradient-gold font-display text-5xl font-black leading-none"
            >
              {totalLifted.toLocaleString()}
            </motion.p>
            <p className="mt-2 text-[11px] italic text-white/55">&ldquo;The prayer of a righteous person has great power.&rdquo; — James 5:16</p>
          </div>

          <button
            onClick={() => {
              setJourneyKey((k) => k + 1); // force a fresh snapshot even if a prior instance is still exiting
              setJourney(true);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-[15px] font-extrabold text-navy-950 shadow-glow active:scale-95"
          >
            🙏 Pray around the wall <ArrowRight width={16} height={16} />
          </button>
        </div>
      </div>

      {/* ===== Rotating scripture ribbon ===== */}
      <div className="relative mt-6 min-h-[64px] overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/10 to-transparent px-4 py-3 text-center">
        <AnimatePresence>
          <motion.p key={verseIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] italic leading-snug text-white/80">
            &ldquo;{UNITY_VERSES[verseIdx].text}&rdquo;
            <span className="mt-1 block text-[10px] font-bold uppercase not-italic tracking-widest text-gold-400">{UNITY_VERSES[verseIdx].ref}</span>
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ===== Today's shared prayer + Moment of Stillness ===== */}
      <Reveal className="mt-4">
        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-purple-200">Today the whole city is praying for</p>
          <p className="mt-1 font-display text-lg font-bold text-white">{prompt}</p>
          <button onClick={() => setStillness(true)} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-semibold text-white/80 active:scale-95">
            🕊️ Enter a moment of stillness
          </button>
        </div>
      </Reveal>

      {/* ===== Compose ===== */}
      <Reveal className="mt-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900 to-ink p-4">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button onClick={() => setKind("prayer")} className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-[0.98] ${kind === "prayer" ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white" : "bg-white/5 text-white/60"}`}>
              🙏 Prayer request
            </button>
            <button onClick={() => setKind("praise")} className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-[0.98] ${kind === "praise" ? "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950" : "bg-white/5 text-white/60"}`}>
              🎉 Praise report
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={180}
            rows={3}
            placeholder={kind === "prayer" ? "Lay your prayer at the altar…" : "Share what God has done! 🙌"}
            className="w-full resize-none rounded-2xl border border-white/12 bg-white/5 p-3 text-[15px] text-white placeholder:text-white/35 focus:border-gold/50 focus:outline-none"
          />
          {err && <p className="mt-1.5 text-center text-xs font-medium text-rose-300">{err}</p>}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[11px] text-white/40">
              Posting as {me.name || "Someone"}
              {me.church ? ` · ${me.church}` : ""}
            </span>
            <button onClick={post} disabled={busy || text.trim().length < 3} className="shrink-0 rounded-xl bg-gold px-4 py-2 text-xs font-extrabold text-navy-950 transition active:scale-95 disabled:opacity-40">
              {busy ? "…" : kind === "prayer" ? "Lay it at the altar" : "Share the praise"}
            </button>
          </div>
        </div>
      </Reveal>

      {/* ===== Filter rail ===== */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} className="relative shrink-0 rounded-full px-4 py-2 text-[12px] font-bold transition active:scale-95">
              {on && <motion.span layoutId="prayer-filter-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className={`relative ${on ? "text-navy-950" : "text-white/65"}`}>
                {f.label} <span className={on ? "text-navy-950/70" : "text-white/35"}>{counts[f.id]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ===== Wall of candles ===== */}
      <div className="mt-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {visible.map((p) => (
            <CandleCard
              key={p.id}
              p={p}
              didPray={prayed.has(p.id)}
              isMine={mine.has(p.id)}
              answering={answering === p.id}
              onPray={() => pray(p)}
              onAnswer={() => answer(p)}
              onShare={() => share(p)}
            />
          ))}
        </AnimatePresence>
        {visible.length === 0 && loadError && (
          <div className="py-10 text-center">
            <p className="text-sm text-white/60">Couldn&apos;t reach the wall right now.</p>
            <button onClick={loadPrayers} className="mt-3 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white active:scale-95">Try again</button>
          </div>
        )}
        {visible.length === 0 && loaded && !loadError && <p className="py-10 text-center text-sm text-white/45">Nothing here yet — be the first to lift one up. 💛</p>}
      </div>

      {/* ===== Amen footer ===== */}
      <Reveal className="mt-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
          <p className="font-display text-lg italic leading-relaxed text-white/85">&ldquo;For where two or three gather in my name, there am I with them.&rdquo;</p>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Matthew 18:20</p>
          {streak > 0 && <p className="mt-3 text-[12px] font-semibold text-gold-400">🔥 You&apos;ve prayed {streak} {streak === 1 ? "day" : "days"} in a row</p>}
          {!pushOn && (
            <button onClick={enablePush} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/15 px-4 py-2 text-[12px] font-semibold text-purple-200 active:scale-95">
              <BellIcon width={13} height={13} /> Gentle prayer nudges
            </button>
          )}
        </div>
      </Reveal>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-white/40">Every prayer is heard. All for His glory. 🙏</p>

      {/* ===== Overlays ===== */}
      <AnimatePresence>{stillness && <StillnessOverlay onClose={() => setStillness(false)} />}</AnimatePresence>
      <AnimatePresence>
        {journey && (
          <PrayerJourney
            key={journeyKey}
            prayers={prayers}
            prayed={prayed}
            onPray={pray}
            onClose={() => setJourney(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Candle card ---------- */
function CandleCard({
  p,
  didPray,
  isMine,
  answering,
  onPray,
  onAnswer,
  onShare,
}: {
  p: Prayer;
  didPray: boolean;
  isMine: boolean;
  answering: boolean;
  onPray: () => void;
  onAnswer: () => void;
  onShare: () => void;
}) {
  const glow = Math.min(p.prayed / 25, 1);
  const isPraise = p.kind === "praise";
  const gold = isPraise || p.answered;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`relative overflow-hidden rounded-2xl border p-3.5 ${gold ? "border-gold/30 bg-gold/[0.07]" : "border-white/10 bg-white/[0.04]"}`}
      style={{ boxShadow: gold ? `0 0 ${8 + glow * 22}px rgba(245,166,35,${0.12 + glow * 0.28})` : `0 0 ${glow * 16}px rgba(245,166,35,${glow * 0.16})` }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${p.answered ? "bg-gold/25 text-gold-400" : isPraise ? "bg-gold/20 text-gold-400" : "bg-purple-500/20 text-purple-200"}`}>
          {p.answered ? "✨ Answered" : isPraise ? "🎉 Praise" : "🙏 Prayer"}
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-white/80">
          {p.name || "Someone"}
          {p.church ? <span className="font-normal text-white/45"> · {p.church}</span> : null}
        </span>
        <span className="shrink-0 text-[10px] text-white/35">{timeAgo(p.created_at)}</span>
      </div>
      <p className="text-[14px] leading-relaxed text-white/90">{p.body}</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          onClick={onPray}
          disabled={didPray}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition active:scale-95 ${didPray ? "bg-emerald-500/15 text-emerald-200" : "bg-white/8 text-white/80 hover:bg-white/12"}`}
        >
          🕯️ {didPray ? `You + ${Math.max(0, p.prayed - 1).toLocaleString()} holding this up` : `Light a candle · ${p.prayed.toLocaleString()} lit`}
        </button>
        <button onClick={onShare} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-white/60 active:scale-95">
          <Share width={12} height={12} />
        </button>
        {isMine && !p.answered && p.kind === "prayer" && (
          <button onClick={onAnswer} disabled={answering} className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold-400 active:scale-95 disabled:opacity-50">
            {answering ? "…" : "God answered this 🙌"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ---------- Moment of Stillness overlay ---------- */
function StillnessOverlay({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI((v) => (v + 1) % UNITY_VERSES.length), 6000);
    return () => clearInterval(iv);
  }, []);
  return (
    <Portal>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-[#0a0510]/90 px-8 text-center backdrop-blur-md">
        <motion.div
          className="relative grid h-44 w-44 place-items-center rounded-full"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.35),transparent_70%)] blur-lg" />
          <motion.div className="absolute inset-0 rounded-full border border-gold/40" animate={{ scale: [1, 1.4], opacity: [0.6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }} />
          <span className="relative text-5xl">🕊️</span>
        </motion.div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400">Be still</p>
        <AnimatePresence>
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 max-w-sm font-display text-xl italic leading-relaxed text-white/90">
            &ldquo;{UNITY_VERSES[i].text}&rdquo;
          </motion.p>
        </AnimatePresence>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-white/45">{UNITY_VERSES[i].ref}</p>
        <button onClick={onClose} className="mt-10 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/80 active:scale-95">
          Amen 🙏
        </button>
      </motion.div>
    </Portal>
  );
}

/* ---------- Prayer Journey (flagship focus mode) ---------- */
function PrayerJourney({
  prayers,
  prayed,
  onPray,
  onClose,
}: {
  prayers: Prayer[];
  prayed: Set<string>;
  onPray: (p: Prayer) => void;
  onClose: () => void;
}) {
  // Least-prayed-for first, so no request is left behind. Snapshot on open.
  const [queue] = useState<Prayer[]>(() =>
    [...prayers].filter((p) => !p.answered).sort((a, b) => a.prayed - b.prayed).slice(0, 12)
  );
  const [idx, setIdx] = useState(0);
  const [lifted, setLifted] = useState(0);
  const done = idx >= queue.length;
  const p = queue[idx];

  function amen() {
    if (p && !prayed.has(p.id)) onPray(p);
    setLifted((n) => n + 1);
    setIdx((i) => i + 1);
  }

  return (
    <Portal>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex flex-col bg-gradient-to-b from-[#150a24] via-ink to-ink px-6 safe-top">
        <div className="flex items-center justify-between pt-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-purple-300">Prayer Journey</span>
          <button onClick={onClose} className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white/80 active:scale-95">Close</button>
        </div>

        {!done && queue.length > 0 ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-gold-500" animate={{ width: `${(idx / queue.length) * 100}%` }} transition={{ type: "spring", stiffness: 160, damping: 26 }} />
              </div>
              <span className="text-[11px] font-bold text-white/50">{idx}/{queue.length}</span>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto text-center">
              <AnimatePresence>
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-auto w-full">
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${p.kind === "praise" ? "bg-gold/20 text-gold-400" : "bg-purple-500/20 text-purple-200"}`}>
                    {p.kind === "praise" ? "🎉 Praise with them" : "🙏 Pray for"}
                  </span>
                  <p className="mx-auto mt-4 max-w-md font-display text-2xl font-bold leading-snug text-white">{p.body}</p>
                  <p className="mt-3 text-[13px] text-white/50">
                    — {p.name || "Someone"}
                    {p.church ? ` · ${p.church}` : ""}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button onClick={amen} className="mb-10 w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-4 font-display text-lg font-extrabold text-navy-950 shadow-glow active:scale-95">
              I prayed 🙏 Amen
            </button>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="text-6xl">
              🕊️
            </motion.div>
            <h3 className="mt-4 font-display text-3xl font-extrabold text-white">
              {queue.length === 0 ? "Every prayer is lifted 💛" : `You lifted up ${lifted} ${lifted === 1 ? "person" : "people"}!`}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-white/70">Heaven heard every one. Thank you for standing with your city in prayer.</p>
            <p className="mt-4 max-w-xs text-[13px] italic text-white/60">&ldquo;How good and pleasant it is when God&apos;s people live together in unity!&rdquo; — Psalm 133:1</p>
            <button onClick={onClose} className="mt-8 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-8 py-3.5 font-extrabold text-navy-950 shadow-glow active:scale-95">
              Amen 🙏
            </button>
          </div>
        )}
      </motion.div>
    </Portal>
  );
}
