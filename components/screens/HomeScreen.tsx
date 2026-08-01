"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  HERO,
  SITE,
  IMG,
  EXPECT,
  ARTISTS,
  ARTISTS_NOTE,
  SCHEDULE,
  TIMELINE,
  IMPACT,
  LINKS,
  MOMENTS,
  SCRIPTURES,
  COMING_SOON,
  DONATE,
} from "@/lib/content";
import Countdown from "@/components/Countdown";
import FestivalLive from "@/components/FestivalLive";
import LineupCard from "@/components/LineupCard";
import InviteCard from "@/components/InviteCard";
import NotifyNudge from "@/components/NotifyNudge";
import { isLivePhase, useFestivalPhase } from "@/lib/useFestivalPhase";
import { getStreak } from "@/lib/game";
import Reveal, { Eyebrow } from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import Scripture from "@/components/Scripture";
import type { TabId } from "@/components/BottomNav";
import {
  ArrowRight,
  MapPin,
  Sparkle,
  Music,
  CrossIcon,
  Users,
  Heart,
  Play,
  FlameIcon,
  GameIcon,
} from "@/components/icons";

const EXPECT_ICON: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
  worship: Music,
  gospel: CrossIcon,
  baptism: Heart,
  kids: Sparkle,
  food: Users,
  community: Users,
};

export default function HomeScreen({ go }: { go: (t: TabId, sub?: string) => void }) {
  // On Sept 4–5 the live card replaces the countdown — showing both is contradictory.
  const live = isLivePhase(useFestivalPhase());
  // Verse of the day — set after mount so SSR/client never disagree on the date.
  const [verseOfDay, setVerseOfDay] = useState(SCRIPTURES[0]);
  // Personal touch: greet returning members by name, with their streak.
  const [firstName, setFirstName] = useState<string | null>(null);
  const [streak, setStreakN] = useState(0);
  useEffect(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const doy = Math.floor((Date.now() - start.getTime()) / 86400000);
    setVerseOfDay(SCRIPTURES[doy % SCRIPTURES.length]);
    try {
      const n = localStorage.getItem("jf-name");
      if (n && n.trim()) setFirstName(n.trim().split(/\s+/)[0]);
    } catch {
      /* ignore */
    }
    setStreakN(getStreak());
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.28]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="pb-4">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.heroCrowd} alt="Jesus Festival worship" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink" />
        <div className="absolute inset-0 bg-radial-glow" />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center safe-top"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 16 }}
            className="relative mb-4"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-purple-500/30 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-mark-white.png"
              alt="Jesus Festival"
              className="h-20 w-auto drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-3 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur"
          >
            {HERO.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-white sm:text-6xl"
          >
            <span className="text-gradient-gold animate-shimmer">JESUS</span>
            <br />
            FESTIVAL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/80"
          >
            {HERO.subtitle} {HERO.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-3 flex items-center gap-1.5 text-sm text-gold-400"
          >
            <MapPin width={15} height={15} />
            <span className="font-medium">{SITE.location}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            <span className="text-purple-300">Love God.</span>{" "}
            <span className="text-white/90">Love People.</span>{" "}
            <span className="text-gold-400">Change the World.</span>
          </motion.p>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      </section>

      {/* ===== COUNTDOWN (becomes a live tracker on festival days) ===== */}
      <section className="relative -mt-10 px-4">
        {/* Renders null outside Sept 4–5, so this wrapper collapses to nothing. */}
        <div className="mx-auto max-w-md">
          <FestivalLive go={go} />
        </div>
        <Reveal className={`mx-auto max-w-md ${live ? "hidden" : ""}`}>
          <div className="mb-3 text-center">
            <Eyebrow>The countdown is on</Eyebrow>
          </div>
          <Countdown targetISO={SITE.eventDatesISO} />
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => go("schedule")}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-95"
            >
              Plan Your Weekend <ArrowRight width={16} height={16} />
            </button>
            <a
              href={LINKS.facebookEvent}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-95"
            >
              Invite Everyone
            </a>
          </div>
        </Reveal>
      </section>

      {/* ===== WELCOME BACK + QUICK ACTIONS ===== */}
      <section className="mt-10 px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-extrabold text-white">
                {firstName ? `Welcome back, ${firstName}! 👋` : "Jump right in 👇"}
              </h2>
              <p className="mt-0.5 text-[13px] text-white/55">The city&apos;s coming alive — here&apos;s your next step.</p>
            </div>
            {streak > 0 && (
              <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[12px] font-bold text-gold-400">
                🔥 {streak}-day
              </span>
            )}
          </div>
          <div className="mb-3">
            <NotifyNudge />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickAction emoji="🎮" title="Revive the City" sub="Missions, games & quizzes" onClick={() => go("game")} accent="gold" />
            <QuickAction emoji="🙏" title="Prayer Wall" sub="Pray for one another" onClick={() => go("more", "prayer")} accent="purple" />
            <QuickAction emoji="🙌" title="Volunteers" sub="Serve at the festival" onClick={() => go("more", "volunteers")} accent="emerald" />
            <QuickAction emoji="❤️" title="Give" sub="Sow into good ground" onClick={() => go("more", "give")} accent="ember" />
          </div>
          {/* Renders null until they've starred a set, so it never nags. */}
          <div className="mt-3">
            <LineupCard go={go} />
          </div>
        </Reveal>
      </section>

      {/* ===== WHAT TO EXPECT ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mb-5 text-center">
          <Eyebrow>Two powerful days</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">What to Expect</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
            Bring your family, bring your church, bring a neighbour.
          </p>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {EXPECT.map((e, i) => {
            const Icon = EXPECT_ICON[e.icon] ?? Sparkle;
            return (
              <Reveal key={e.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.06] to-transparent p-4">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold-400">
                    <Icon width={20} height={20} />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">{e.title}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-white/60">{e.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===== MOMENTS (real photos) ===== */}
      <section className="mt-14">
        <Reveal className="mb-4 px-4 text-center">
          <Eyebrow>Real moments</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Scenes from Gage Park</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
            Real photos from past Jesus Festivals in Hamilton.
          </p>
        </Reveal>
        <Reveal>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
            {MOMENTS.map((m, i) => (
              <div
                key={m.src}
                className="relative aspect-[4/5] w-56 shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={m.caption}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[12px] font-semibold leading-snug text-white">{m.caption}</p>
                </div>
                <div className="absolute right-2.5 top-2.5 rounded-full bg-purple-600/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== VERSE OF THE DAY ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="mb-3 text-center">
            <Eyebrow>Verse of the day</Eyebrow>
          </div>
          <Scripture text={verseOfDay.text} reference={verseOfDay.ref} />
        </Reveal>
      </section>

      {/* ===== ARTISTS ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mb-4 text-center">
          <Eyebrow>Artists confirmed</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">The 2026 Lineup</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
            {ARTISTS_NOTE}
          </p>
        </Reveal>
        <div className="mx-auto max-w-md space-y-3">
          {ARTISTS.map((a, i) => {
            const inner = (
              <>
                <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-700/40 to-navy-900">
                  {a.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.img} alt={a.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : a.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.logo} alt={a.name} loading="lazy" className="max-h-[62%] w-[84%] object-contain" />
                  ) : (
                    <span className="text-3xl text-gold-400/80">♪</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-400">
                    <Music width={13} height={13} /> {a.role}
                  </div>
                  <h3 className="mt-0.5 font-display text-lg font-bold leading-tight text-white">{a.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-white/60">{a.blurb}</p>
                </div>
                {a.href && <ArrowRight width={18} height={18} className="shrink-0 text-white/40" />}
              </>
            );
            const cls = "group flex items-center gap-4 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] p-3";
            return (
              <Reveal key={a.name} delay={Math.min(i * 0.07, 0.35)}>
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className={`${cls} active:scale-[0.99]`}>
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}

          <Reveal delay={0.16}>
            <button
              onClick={() => go("schedule")}
              className="group relative block w-full overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-ember/20 via-purple-900/30 to-ink/60 p-6 text-center active:scale-[0.99]"
            >
              <span className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
              <span className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-ember/15 blur-3xl" />
              <p className="relative text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">🗓️ Full schedule is live</p>
              <h3 className="relative mt-3 font-display text-2xl font-extrabold leading-tight text-white">
                Every set time,
                <br />
                both days
              </h3>
              <p className="relative mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-white/70">
                Friday worship with Bethel Gospel Tabernacle, then a full Saturday of worship sets, testimonies & the Gospel — hosted by {SCHEDULE.hosts}.
              </p>
              <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-extrabold text-navy-950 shadow-glow transition group-active:scale-95">
                See the schedule <ArrowRight width={14} height={14} />
              </span>
            </button>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-6 max-w-md">
          <Scripture text={SCRIPTURES[6].text} reference={SCRIPTURES[6].ref} />
        </Reveal>
      </section>

      {/* ===== INVITE CARD ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <InviteCard />
        </Reveal>
      </section>

      {/* ===== REVIVE THE CITY teaser ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <button
            onClick={() => go("game")}
            className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-700/40 via-navy-800 to-ink p-5 text-left active:scale-[0.99]"
          >
            <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
              <GameIcon width={15} height={15} /> New · Play together
            </div>
            <h3 className="relative mt-2 font-display text-3xl font-extrabold leading-tight text-white">
              Revive the City 🌇
            </h3>
            <p className="relative mt-1.5 max-w-xs text-sm leading-relaxed text-white/70">
              Every prayer, kind act, and encouragement brings light to the city. Play with Captain Goodness and help the whole community revive Hamilton together.
            </p>
            <span className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy-950">
              <Play width={15} height={15} /> Start playing
            </span>
          </button>
        </Reveal>
      </section>

      {/* ===== PRAYER WALL CTA ===== */}
      <section className="mt-6 px-4">
        <Reveal className="mx-auto max-w-md">
          <button
            onClick={() => go("more", "prayer")}
            className="group relative w-full overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-navy-900 via-purple-900/25 to-ink p-5 text-left active:scale-[0.99]"
          >
            <div className="pointer-events-none absolute -left-8 -top-10 h-40 w-40 rounded-full bg-purple-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
              🙏 Pray together
            </div>
            <h3 className="relative mt-2 font-display text-3xl font-extrabold leading-tight text-white">The Prayer Wall</h3>
            <p className="relative mt-1.5 max-w-xs text-sm leading-relaxed text-white/70">
              Lift up a prayer, share a praise, and stand with the whole city in prayer. Where two or three gather in His name, He is there.
            </p>
            <span className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-bold text-gold-400">
              Open the Prayer Wall <ArrowRight width={15} height={15} />
            </span>
          </button>
        </Reveal>
      </section>

      {/* ===== TIMELINE (parallax) ===== */}
      <section className="relative mt-16">
        <ParallaxImage
          src={IMG.rainbow}
          alt="Worship with a rainbow over Hamilton"
          className="h-[420px]"
          overlay="bg-gradient-to-b from-ink via-ink/70 to-ink"
        >
          <div className="flex h-full flex-col justify-center px-5">
            <Reveal className="mx-auto w-full max-w-md">
              <div className="text-center">
                <Eyebrow>2024 · 2025 · and now 2026</Eyebrow>
                <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-white">
                  Two years of fruit.
                  <br />
                  <span className="text-gradient-gold">One faithful God.</span>
                </h2>
              </div>
              <div className="mt-6 space-y-3">
                {TIMELINE.map((t, i) => (
                  <Reveal key={t.year} delay={i * 0.1}>
                    <div className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-navy-950">
                          {t.year.slice(2)}
                        </div>
                        {i < TIMELINE.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-white/15" />}
                      </div>
                      <div className="pb-2">
                        <h3 className="font-display text-base font-bold text-white">{t.title}</h3>
                        <p className="mt-0.5 text-[13px] leading-snug text-white/65">{t.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </ParallaxImage>
      </section>

      {/* ===== IMPACT STRIP ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mb-4 text-center">
          <Eyebrow>The impact</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">
            More than a festival
          </h2>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {IMPACT.slice(0, 4).map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06}>
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-gold/10 to-transparent p-4 text-center">
                <div className="font-display text-2xl font-extrabold text-gradient-gold">{m.stat}</div>
                <div className="mt-1 text-[12px] leading-snug text-white/60">{m.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <button
            onClick={() => go("more")}
            className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 py-3 font-display text-sm font-bold text-gold-400 active:scale-[0.98] w-full"
          >
            <FlameIcon width={17} height={17} /> See the Movement <ArrowRight width={16} height={16} />
          </button>
        </Reveal>
      </section>

      {/* ===== GIVE ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <a
            href={DONATE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/12 to-transparent p-4 active:scale-[0.99]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950">
              <Heart width={22} height={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold text-white">Sow into good ground</h3>
              <p className="mt-0.5 text-[13px] leading-snug text-white/60">
                Help take the Gospel to the city. Give a gift & receive a tax receipt.
              </p>
            </div>
            <ArrowRight width={18} height={18} className="shrink-0 text-gold-400" />
          </a>
        </Reveal>
      </section>

      {/* ===== COMING SOON ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mb-4 text-center">
          <Eyebrow>This is just the beginning</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">More is coming 🚀</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
            We&apos;re building something special. Here&apos;s a peek at what&apos;s on the way — stay tuned!
          </p>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {COMING_SOON.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <span className="absolute right-2 top-2 rounded-full bg-purple-500/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-200">
                  Soon
                </span>
                <div className="text-2xl">{f.emoji}</div>
                <h3 className="mt-2 font-display text-[15px] font-bold text-white">{f.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-white/55">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== RECAP CTA ===== */}
      <section className="mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <a
            href={LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 active:scale-[0.99]"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ember text-white shadow-glow-ember">
              <Play width={26} height={26} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base font-bold text-white">Watch the Recaps</h3>
              <p className="text-[13px] text-white/60">See what God has been doing in Hamilton.</p>
            </div>
            <ArrowRight width={18} height={18} className="text-white/40" />
          </a>
        </Reveal>
      </section>

      {/* ===== VERSE ===== */}
      <section className="mt-14 px-6">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="font-display text-lg italic leading-relaxed text-white/85">
            &ldquo;Oh give thanks to the Lord, for He is good, for His steadfast love endures forever.&rdquo;
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            — Psalm 107:1
          </p>
        </Reveal>
      </section>
    </div>
  );
}

// A bold, tappable shortcut tile — gets people where the life is in one tap.
const QA_ACCENT: Record<string, string> = {
  gold: "border-gold/30 from-gold/[0.14]",
  purple: "border-purple-400/30 from-purple-500/[0.16]",
  emerald: "border-emerald-400/25 from-emerald-500/[0.12]",
  ember: "border-ember/30 from-ember/[0.14]",
};

function QuickAction({ emoji, title, sub, onClick, accent }: { emoji: string; title: string; sub: string; onClick: () => void; accent: keyof typeof QA_ACCENT }) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start gap-1 rounded-2xl border bg-gradient-to-br to-transparent p-4 text-left transition active:scale-[0.97] ${QA_ACCENT[accent]}`}
    >
      <span className="text-[26px] leading-none drop-shadow">{emoji}</span>
      <span className="mt-1.5 font-display text-[15px] font-bold leading-tight text-white">{title}</span>
      <span className="text-[11px] leading-snug text-white/55">{sub}</span>
      <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 transition group-hover:gap-1.5">
        Open <ArrowRight width={11} height={11} />
      </span>
    </button>
  );
}
