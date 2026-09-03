"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  DONATE,
} from "@/lib/content";
import Countdown from "@/components/Countdown";
import FestivalLive from "@/components/FestivalLive";
import FestivalWeather from "@/components/FestivalWeather";
import LiveImpact from "@/components/LiveImpact";
import LineupCard from "@/components/LineupCard";
import InviteCard from "@/components/InviteCard";
import NotifyNudge from "@/components/NotifyNudge";
import SearchPill from "@/components/SearchPill";
import FestivalWeekendPass from "@/components/FestivalWeekendPass";
import { isLivePhase, useFestivalPhase } from "@/lib/useFestivalPhase";
import { getStreak } from "@/lib/game";
import Reveal, { Eyebrow } from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import Scripture from "@/components/Scripture";
import type { TabId } from "@/components/BottomNav";
import {
  ArrowRight,
  MapPin,
  Share,
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

export default function HomeScreen({
  go,
  onSearch,
}: {
  go: (t: TabId, sub?: string) => void;
  onSearch?: () => void;
}) {
  // On Sept 4–5 the live card replaces the countdown — showing both is
  // contradictory — and once the weekend is over the countdown block gives way
  // to the harvest card. A finished countdown otherwise reads "It's festival
  // weekend!" forever.
  const phase = useFestivalPhase();
  const live = isLivePhase(phase);
  const over = phase === "after";
  // Verse of the day — set after mount so SSR/client never disagree on the date.
  const [verseOfDay, setVerseOfDay] = useState(SCRIPTURES[0]);
  // Personal touch: greet returning members by name, with their streak.
  const [firstName, setFirstName] = useState<string | null>(null);
  const [streak, setStreakN] = useState(0);
  const [verseNote, setVerseNote] = useState<string | null>(null);
  useEffect(() => {
    if (!verseNote) return;
    const t = setTimeout(() => setVerseNote(null), 2600);
    return () => clearTimeout(t);
  }, [verseNote]);
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

  // Hero parallax as a passive scroll listener writing transforms directly.
  // This was framer's useScroll, which was the last thing on this screen that
  // needed a live animation-frame loop before hydration could settle — and a
  // scroll listener degrades to "no parallax", never to "no home screen".
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const apply = () => {
      const h = heroEl.offsetHeight || 1;
      const t = Math.min(1, Math.max(0, window.scrollY / h));
      const bg = heroBgRef.current;
      const content = heroContentRef.current;
      if (bg) bg.style.transform = `translateY(${t * 40}%) scale(${1.1 + t * 0.18})`;
      if (content) {
        content.style.transform = `translateY(${t * 120}px)`;
        content.style.opacity = String(Math.max(0, 1 - t / 0.7));
      }
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <div className="pb-4">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        <div ref={heroBgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.1)" }}>
          <Image src={IMG.heroCrowd} alt="A crowd worshipping together at Jesus Festival" fill preload sizes="(max-width: 512px) 100vw, 512px" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink" />
        <div className="absolute inset-0 bg-radial-glow" />

        <div
          ref={heroContentRef}
          className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center safe-top will-change-transform"
        >
          {/* CSS entrances below: a framer opacity:0 start never finishes when
              rAF is throttled (Low Power Mode, backgrounded PWA), which blanked
              the entire hero. The parallax above is safe — its resting state at
              scroll 0 is fully visible. */}
          <div className="jf-pop relative mb-4">
            <div className="absolute inset-0 -z-10 rounded-full bg-purple-500/30 blur-2xl" />
            <Image
              src="/brand/logo-mark-white.png"
              alt="Jesus Festival"
              width={160}
              height={80}
              style={{ width: "auto" }}
              className="h-20 w-auto drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]"
            />
          </div>

          <div className="jf-rise mb-3 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur">
            {HERO.eyebrow}
          </div>

          <h1 className="jf-rise font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-white sm:text-6xl">
            <span className="text-gradient-gold animate-shimmer">JESUS</span>
            <br />
            FESTIVAL
          </h1>

          <p className="jf-rise mt-3 max-w-xs text-[15px] leading-relaxed text-white/80">
            {HERO.subtitle} {HERO.body}
          </p>

          <div className="jf-fade mt-3 flex items-center gap-1.5 text-sm text-gold-400">
            <MapPin width={15} height={15} />
            <span className="font-medium">{SITE.location}</span>
          </div>

          <p className="jf-rise mt-4 text-[11px] font-bold uppercase tracking-[0.18em]">
            <span className="text-purple-300">Love God.</span>{" "}
            <span className="text-white/90">Love People.</span>{" "}
            <span className="text-gold-400">Change the World.</span>
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      </section>

      {/* ===== COUNTDOWN (becomes a live tracker on festival days) ===== */}
      <section className="relative -mt-10 px-4">
        {/* Renders null outside Sept 4–5, so this wrapper collapses to nothing. */}
        <div className="mx-auto max-w-md">
          <FestivalLive go={go} />
        </div>
        <Reveal className={`mx-auto max-w-md ${live || over ? "hidden" : ""}`}>
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
        {/* After the weekend the festival's job changes: harvest, not hype.
            This is what someone opening the app on September 6 should meet. */}
        {over && (
          <div className="jf-rise mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/12 via-purple-900/25 to-ink p-6 text-center">
              <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
              <div className="text-4xl" aria-hidden>💛</div>
              <p className="mt-2 text-[11px] font-black uppercase tracking-[0.24em] text-gold-400">
                Thank you, Hamilton
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-extrabold leading-tight text-white">
                What a weekend. Now it begins.
              </h2>
              <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-white/70">
                The festival is over — the movement isn&apos;t. If something happened in you at
                Gage Park, don&apos;t let it stay at Gage Park.
              </p>
              <div className="mt-5 grid gap-2.5">
                <button
                  onClick={() => go("more", "yes")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-95"
                >
                  🕊️ I said yes — what now?
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => go("more", "photos")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-95"
                  >
                    📸 Relive it
                  </button>
                  <button
                    onClick={() => go("more", "connect")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-95"
                  >
                    ⛪ Get connected
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== MY FESTIVAL WEEKEND ===== */}
      <section className="mt-6 px-4">
        <Reveal className="mx-auto max-w-md">
          {!live && !over && (
            <Link
              href="/before-you-go"
              className="group relative mb-3 flex min-h-24 items-center gap-3 overflow-hidden rounded-2xl border border-gold/45 bg-gradient-to-r from-gold/[0.18] via-ember/15 to-purple-700/20 p-4 transition hover:border-gold/70 active:scale-[0.99]"
            >
              <span className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-gold/20 blur-3xl" />
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-ember text-2xl text-navy-950 shadow-glow" aria-hidden>🎒</span>
              <span className="relative min-w-0 flex-1">
                <span className="flex items-center gap-2"><span className="font-display text-[15px] font-extrabold text-white">Your Festival Go Bag</span><span className="rounded-full bg-gold/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-gold-300">Final prep</span></span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-white/70">Five-minute final check: forecast, packing, route, meeting spot, lineup and offline save.</span>
              </span>
              <ArrowRight width={17} height={17} className="relative shrink-0 text-gold-300 transition group-hover:translate-x-0.5" />
            </Link>
          )}
          <Link
            href="/day-of"
            className="group relative mb-3 flex min-h-24 items-center gap-3 overflow-hidden rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/20 via-purple-700/20 to-gold/[0.08] p-4 transition hover:border-gold/50 active:scale-[0.99]"
          >
            <span className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-ember/20 blur-3xl" />
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ember to-gold-500 text-2xl shadow-glow" aria-hidden>⚡</span>
            <span className="relative min-w-0 flex-1">
              <span className="flex items-center gap-2"><span className="font-display text-[15px] font-extrabold text-white">Festival Day-Of Mode</span><span className="rounded-full bg-ember/15 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-ember">New</span></span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/65">One fast screen for live now, next, map, help and offline essentials.</span>
            </span>
            <ArrowRight width={17} height={17} className="relative shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/blog/jesus-festival-saturday-extended-updated-schedule-2026"
            className="group relative mb-3 flex min-h-20 items-center gap-3 overflow-hidden rounded-2xl border border-emerald-300/35 bg-gradient-to-r from-emerald-500/20 via-gold/[0.1] to-transparent p-4 transition hover:border-gold/50 active:scale-[0.99]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-300/15 text-2xl" aria-hidden>⏰</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">Saturday schedule update</span>
              <span className="block font-display text-[15px] font-extrabold text-white">Now 10 AM–7 PM · Stage from 11 AM</span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/65">One more hour together. See every updated artist and speaker time.</span>
            </span>
            <ArrowRight width={17} height={17} className="shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
          </Link>
          <FestivalWeekendPass />
          <Link
            href="/festival-weekend"
            className="group relative mt-3 flex min-h-20 items-center gap-3 overflow-hidden rounded-2xl border border-purple-300/30 bg-gradient-to-r from-purple-700/25 via-gold/[0.08] to-transparent p-4 transition hover:border-gold/45 active:scale-[0.99]"
          >
            <span className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-purple-400/20 blur-3xl" />
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-gold-500 text-2xl shadow-glow" aria-hidden>⚡</span>
            <span className="relative min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-[14px] font-extrabold text-white">Festival Week Command Center</span>
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-gold-300">Live</span>
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/65">Forecast, readiness score, day-of help, map, Light Hunt and offline essentials.</span>
            </span>
            <ArrowRight width={17} height={17} className="relative shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
          </Link>
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
          {onSearch && (
            <div className="mb-3">
              <SearchPill onClick={onSearch} />
            </div>
          )}
          <div className="mb-3">
            <NotifyNudge />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickAction emoji="🎮" title="Revive the City" sub="Missions, games & quizzes" onClick={() => go("game")} accent="gold" />
            <QuickAction emoji="🙏" title="Prayer Wall" sub="Pray for one another" onClick={() => go("more", "prayer")} accent="purple" />
            <QuickAction emoji="🗺️" title="Plan Your Visit" sub="Live map & directions" onClick={() => go("more", "map")} accent="emerald" />
            <QuickAction emoji="🙌" title="Volunteers" sub="Serve at the festival" onClick={() => go("more", "volunteers")} accent="ember" />
          </div>
          <Link
            href="/getting-to-gage-park"
            className="mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-amber-300/30 bg-gradient-to-r from-amber-300/[0.1] via-purple-500/[0.07] to-transparent p-3.5 transition hover:border-amber-300/50 active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-300/15 text-xl" aria-hidden>🚧</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2"><span className="font-display text-[14px] font-extrabold text-white">Getting to Gage Park</span><span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-200">Road alert</span></span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/65">Main &amp; Ottawa closure, HSR detours and your personal leave-by time.</span>
            </span>
            <ArrowRight width={17} height={17} className="shrink-0 text-amber-200" />
          </Link>
          <Link
            href="/what-to-bring"
            className="mt-2.5 flex min-h-14 items-center gap-3 rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.07] p-3.5 transition hover:border-emerald-300/45 active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-xl" aria-hidden>🎒</span>
            <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="font-display text-[13.5px] font-extrabold text-white">What to Bring</span><span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald-200">New</span></span><span className="mt-0.5 block text-[11px] leading-snug text-white/60">Personalize, save and download your festival packing list.</span></span>
            <ArrowRight width={16} height={16} className="shrink-0 text-emerald-300" />
          </Link>
          <Link
            href="/jesus-festival-hamilton#build-my-plan"
            className="mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-gold/35 bg-gradient-to-r from-gold/12 via-purple-500/[0.08] to-transparent p-3.5 transition hover:border-gold/55 active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-xl shadow-glow" aria-hidden>🧭</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-[14px] font-extrabold text-white">Build My Festival Plan</span>
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald-200">New</span>
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/65">A private arrival plan for your group, day and travel style.</span>
            </span>
            <ArrowRight width={17} height={17} className="shrink-0 text-gold-400" />
          </Link>
          <Link
            href="/bring-a-group"
            className="mt-2.5 flex min-h-14 items-center gap-3 rounded-2xl border border-purple-300/25 bg-purple-400/[0.07] p-3.5 transition hover:border-purple-300/45 active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-400/15 text-xl" aria-hidden>🫂</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-[13.5px] font-extrabold text-white">Bring Your Church, Crew or Family</span>
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-gold-300">New</span>
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-white/60">Build one private plan and share it with everyone.</span>
            </span>
            <ArrowRight width={16} height={16} className="shrink-0 text-purple-200" />
          </Link>
          <Link
            href="/find-your-moments"
            className="mt-2.5 flex min-h-14 items-center gap-3 rounded-2xl border border-gold/30 bg-gold/[0.07] p-3.5 transition hover:border-gold/50 active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-xl" aria-hidden>✨</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[13.5px] font-extrabold text-white">Find Your Festival Moments</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-white/60">A 30-second match for your people, vibe and available time.</span>
            </span>
            <ArrowRight width={16} height={16} className="shrink-0 text-gold-400" />
          </Link>
          <Link
            href="/accessibility"
            className="mt-2.5 flex min-h-14 items-center gap-3 rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.07] p-3.5 transition hover:border-emerald-300/45 active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-xl" aria-hidden>♿</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[13.5px] font-extrabold text-white">Accessibility & Comfort Guide</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-white/60">Mobility, sensory planning, transit and questions to confirm.</span>
            </span>
            <ArrowRight width={16} height={16} className="shrink-0 text-emerald-300" />
          </Link>
          {/* Renders null until they've starred a set, so it never nags. */}
          <div className="mt-3">
            <LineupCard go={go} />
          </div>
        </Reveal>
      </section>

      {/* ===== LIVE COMMUNITY NUMBERS (renders null until data arrives) ===== */}
      <LiveImpact go={go} />

      {/* ===== WEEKEND FORECAST (hidden until ~16 days out) ===== */}
      <FestivalWeather />

      {/* ===== WHAT TO EXPECT ===== */}
      <section className="render-later mt-14 px-4">
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
                <Image
                  src={m.src}
                  alt={m.caption}
                  fill
                  loading="lazy"
                  sizes="224px"
                  className="object-cover"
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
      <section className="render-later mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="mb-3 text-center">
            <Eyebrow>Verse of the day</Eyebrow>
          </div>
          <Scripture text={verseOfDay.text} reference={verseOfDay.ref} />
          <div className="mt-3 text-center">
            <button
              onClick={async () => {
                const text = `"${verseOfDay.text}" — ${verseOfDay.ref}\n\nShared from the Jesus Festival app 💛 https://www.jesusfestival.app`;
                try {
                  if (navigator.share) {
                    await navigator.share({ text, title: verseOfDay.ref });
                    setVerseNote("Shared 🎉");
                  } else {
                    await navigator.clipboard.writeText(text);
                    setVerseNote("Copied — send it to someone 💛");
                  }
                } catch {
                  /* cancelled share sheet — stay quiet */
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-bold text-white/80 active:scale-95"
            >
              <Share width={13} height={13} /> Send this verse to someone
            </button>
            {verseNote && (
              <p role="status" className="mt-2 text-[12px] font-semibold text-gold-400">{verseNote}</p>
            )}
          </div>
        </Reveal>
      </section>

      {/* ===== ARTISTS ===== */}
      <section className="render-later mt-14 px-4">
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
                {a.href && <ArrowRight width={18} height={18} className="shrink-0 text-white/55" />}
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
      <section className="render-later mt-14 px-4">
        <Reveal className="mx-auto max-w-md">
          <InviteCard />
        </Reveal>
      </section>

      {/* ===== FESTIVAL SHOP ===== */}
      <section className="render-later mt-6 px-4">
        <Reveal className="mx-auto max-w-md">
          <button
            onClick={() => go("more", "shop")}
            className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-purple-900/25 via-gold/[0.08] to-transparent p-4 text-left active:scale-[0.99]"
          >
            <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-2xl">
              🛍️
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-bold text-white">The Festival Shop is open!</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-white/60">
                Official Jesus Festival tees &amp; Kingdom apparel — wear the message.
              </span>
            </span>
            <ArrowRight width={18} height={18} className="shrink-0 text-gold-400" />
          </button>
        </Reveal>
      </section>

      {/* ===== REVIVE THE CITY teaser ===== */}
      <section className="render-later mt-14 px-4">
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

      {/* ===== THE ONE THAT MATTERS MOST ===== */}
      <section className="mt-6 px-4">
        <Reveal className="mx-auto max-w-md">
          <button
            onClick={() => go("more", "yes")}
            className="group relative w-full overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/[0.14] via-purple-800/30 to-ink p-5 text-left active:scale-[0.99]"
          >
            <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-gold/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gold-400">
              🕊️ The reason for all of it
            </div>
            <h3 className="relative mt-2 font-display text-3xl font-extrabold leading-tight text-white">
              Said yes to Jesus?
            </h3>
            <p className="relative mt-1.5 max-w-xs text-sm leading-relaxed text-white/75">
              Or thinking about it? Here&apos;s what actually happened, the prayer, and seven first steps —
              with no sign-up, no email, and nobody chasing you.
            </p>
            <span className="relative mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-extrabold text-navy-950 shadow-glow group-active:scale-95">
              Start here <ArrowRight width={14} height={14} />
            </span>
          </button>
        </Reveal>
      </section>

      {/* ===== PRAYER WALL CTA ===== */}
      <section className="render-later mt-6 px-4">
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
      <section className="render-later relative mt-16">
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
      <section className="render-later mt-14 px-4">
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
      <section className="render-later mt-14 px-4">
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

      {/* ===== TOMORROW, MADE SIMPLE ===== */}
      <section className="render-later mt-14 px-4">
        <Reveal className="mb-4 text-center">
          <Eyebrow>Tomorrow, made simple</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Three screens worth saving</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
            Before you leave, while you are in the park, and when the signal disappears.
          </p>
        </Reveal>
        <div className="mx-auto grid max-w-md gap-3">
          {[
            { href: "/before-you-go", emoji: "🎒", eyebrow: "Before you leave", title: "Festival Go Bag", text: "Live forecast, packing, route, meeting point, lineup and one-tap offline save." },
            { href: "/day-of", emoji: "⚡", eyebrow: "At Gage Park", title: "Day-Of Mode", text: "The current stage moment, what comes next, directions, map and help in one glance." },
            { href: "/offline", emoji: "📵", eyebrow: "When signal disappears", title: "Offline Essentials", text: "The weekend times, schedule, location, help guidance and core packing list without a live connection." },
          ].map((item, i) => (
            <Reveal key={item.href} delay={i * 0.05}>
              <Link href={item.href} className="group flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/35 active:scale-[0.99]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500/25 to-gold/20 text-2xl" aria-hidden>{item.emoji}</span>
                <span className="min-w-0 flex-1"><span className="block text-[9px] font-extrabold uppercase tracking-[0.17em] text-gold-400">{item.eyebrow}</span><span className="mt-0.5 block font-display text-[16px] font-extrabold text-white">{item.title}</span><span className="mt-0.5 block text-[11.5px] leading-snug text-white/55">{item.text}</span></span>
                <ArrowRight width={16} height={16} className="shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== RECAP CTA ===== */}
      <section className="render-later mt-14 px-4">
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
            <ArrowRight width={18} height={18} className="text-white/55" />
          </a>
        </Reveal>
      </section>

      {/* ===== VERSE ===== */}
      <section className="render-later mt-14 px-6">
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
