"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import SearchPill from "@/components/SearchPill";

/**
 * Every sub-screen is loaded on demand.
 *
 * Imported statically, the twelve of them compiled into a single 122 KB chunk
 * that had to be downloaded and parsed the moment anyone tapped "More" — even
 * to reach Settings. Split, the hub itself is nearly free and you only pay for
 * the page you actually opened.
 *
 * `ssr` is left on: /i-said-yes, /prayer and /map are real indexable routes, and
 * their prose has to be in the server-rendered HTML for crawlers and answer
 * engines. Dynamic import still splits the *client* chunk either way.
 */
const SubScreenLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
  </div>
);

const MovementScreen = dynamic(() => import("./MovementScreen"), { loading: SubScreenLoader });
const DiscipleshipScreen = dynamic(() => import("./DiscipleshipScreen"), { loading: SubScreenLoader });
const DonateScreen = dynamic(() => import("./DonateScreen"), { loading: SubScreenLoader });
const MapScreen = dynamic(() => import("./MapScreen"), { loading: SubScreenLoader });
const ConnectScreen = dynamic(() => import("./ConnectScreen"), { loading: SubScreenLoader });
const SettingsScreen = dynamic(() => import("./SettingsScreen"), { loading: SubScreenLoader });
const InstallScreen = dynamic(() => import("./InstallScreen"), { loading: SubScreenLoader });
const PrayerWallScreen = dynamic(() => import("./PrayerWallScreen"), { loading: SubScreenLoader });
const NewLifeScreen = dynamic(() => import("./NewLifeScreen"), { loading: SubScreenLoader });
const PhotoWallScreen = dynamic(() => import("./PhotoWallScreen"), { loading: SubScreenLoader });
const ShopScreen = dynamic(() => import("./ShopScreen"), { loading: SubScreenLoader });
const VolunteersScreen = dynamic(() => import("./VolunteersScreen"), { loading: SubScreenLoader });
import { FlameIcon, MapIcon, BellIcon, ArrowRight, ChevronLeft, Users, Heart, Download, Sparkle, Camera } from "@/components/icons";
import type { MoreView } from "@/lib/routes";
import type { ShopData } from "@/lib/shop";

type View = "hub" | MoreView;

const CARDS: { id: View; title: string; sub: string; Icon: React.ComponentType<{ width?: number; height?: number }>; emoji: string }[] = [
  { id: "photos", title: "Photo Wall", sub: "Real moments from the community — share yours", Icon: Camera, emoji: "📸" },
  { id: "shop", title: "Festival Shop", sub: "Official apparel — wear the message", Icon: Sparkle, emoji: "🛍️" },
  { id: "connect", title: "Connect", sub: "See where the movement is spreading & get involved", Icon: BellIcon, emoji: "🌍" },
  { id: "movement", title: "The Movement", sub: "More than a festival — a movement that remains", Icon: FlameIcon, emoji: "🔥" },
  { id: "discipleship", title: "Discipleship & Partners", sub: "Keep the fire burning · churches & ministries", Icon: Users, emoji: "🤝" },
  { id: "give", title: "Give / Donate", sub: "Sow into good ground · tax receipt provided", Icon: Heart, emoji: "❤️" },
  { id: "map", title: "Festival Map", sub: "Getting to Gage Park & finding your way", Icon: MapIcon, emoji: "🗺️" },
  { id: "install", title: "Add to Home Screen", sub: "Install the app & turn on notifications", Icon: Download, emoji: "📲" },
  { id: "settings", title: "Settings", sub: "Update your name, church & preferences", Icon: Sparkle, emoji: "⚙️" },
];

export default function MoreScreen({
  resetSignal = 0,
  openView = null,
  onViewChange,
  onSearch,
  initialShopData,
}: {
  resetSignal?: number;
  openView?: string | null;
  onViewChange?: (view: View) => void;
  onSearch?: () => void;
  initialShopData?: ShopData;
}) {
  const [view, setView] = useState<View>((openView as View) || "hub");

  const open = (next: View) => {
    setView(next);
    onViewChange?.(next);
    window.scrollTo({ top: 0 });
  };

  // Tapping "More" returns to the hub — unless a screen deep-linked to a page.
  useEffect(() => {
    setView((openView as View) || "hub");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  return (
    <div>
      {view === "hub" && (
          <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4">
            <ScreenHeader eyebrow="Explore more" title="More" subtitle="The movement, discipleship, the map & ways to connect." />

            {onSearch && (
              <div className="mb-4">
                <SearchPill onClick={onSearch} />
              </div>
            )}

            {/* Featured: the whole reason the festival exists — so it sits above everything else. */}
            <Reveal>
              <button
                onClick={() => {
                  open("yes");
                }}
                className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/[0.16] via-purple-800/30 to-ink/60 p-4 text-left transition active:scale-[0.99]"
              >
                <span className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-gold/25 blur-3xl" />
                <span className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-purple-500/25 blur-3xl" />
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-3xl text-navy-950">
                  🕊️
                </span>
                <span className="relative min-w-0 flex-1">
                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-gold-400">
                    Start here
                  </span>
                  <span className="block font-display text-xl font-extrabold text-white">I said yes to Jesus</span>
                  <span className="block text-xs leading-snug text-white/70">
                    What just happened, and the first steps — no sign-up, no email
                  </span>
                </span>
                <ArrowRight width={18} height={18} className="relative shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
              </button>
            </Reveal>

            {/* Featured: Prayer Wall */}
            <Reveal delay={0.04}>
              <button
                onClick={() => {
                  open("prayer");
                }}
                className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-purple-700/40 via-purple-900/30 to-ink/50 p-4 text-left transition active:scale-[0.99]"
              >
                <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold/25 to-purple-600/30 text-3xl">🙏</span>
                <span className="relative min-w-0 flex-1">
                  <span className="block font-display text-xl font-extrabold text-white">Prayer Wall</span>
                  <span className="block text-xs text-white/65">Lift a prayer, share a praise & pray for the whole city together</span>
                </span>
                <ArrowRight width={18} height={18} className="relative shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
              </button>
            </Reveal>

            {/* Featured: Volunteers */}
            <Reveal delay={0.05}>
              <button
                onClick={() => {
                  open("volunteers");
                }}
                className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-700/25 via-navy-800/40 to-ink/50 p-4 text-left transition active:scale-[0.99]"
              >
                <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-400/12 blur-3xl" />
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/25 to-gold/20 text-3xl">🙌</span>
                <span className="relative min-w-0 flex-1">
                  <span className="block font-display text-xl font-extrabold text-white">Volunteers</span>
                  <span className="block text-xs text-white/65">Serving at the festival? Enter your code, apply & find your team</span>
                </span>
                <ArrowRight width={18} height={18} className="relative shrink-0 text-emerald-300 transition group-hover:translate-x-0.5" />
              </button>
            </Reveal>

            <Reveal delay={0.06}>
              <Link
                href="/festival-weekend"
                className="group mb-3 flex min-h-20 items-center gap-4 rounded-2xl border border-purple-300/30 bg-gradient-to-br from-purple-700/25 via-gold/[0.07] to-ink/50 p-4 transition active:scale-[0.99]"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500/40 to-gold/25 text-3xl" aria-hidden>⚡</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-400">Festival week</span>
                  <span className="block font-display text-lg font-extrabold text-white">Weekend Command Center</span>
                  <span className="block text-xs leading-snug text-white/65">Live schedule, forecast, readiness, help and offline essentials</span>
                </span>
                <ArrowRight width={18} height={18} className="shrink-0 text-gold-400 transition group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={0.07}>
              <Link
                href="/accessibility"
                className="group mb-3 flex min-h-20 items-center gap-4 rounded-2xl border border-emerald-300/25 bg-gradient-to-br from-emerald-700/20 via-navy-800/35 to-ink/50 p-4 transition active:scale-[0.99]"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-3xl" aria-hidden>♿</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-extrabold text-white">Accessibility & Comfort</span>
                  <span className="block text-xs leading-snug text-white/65">Build a private plan for mobility, sensory and support needs</span>
                </span>
                <ArrowRight width={18} height={18} className="shrink-0 text-emerald-300 transition group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <div className="space-y-3 pb-4">
              {CARDS.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.05}>
                  <button
                    onClick={() => {
                      open(c.id);
                    }}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition active:scale-[0.99]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-2xl">{c.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold text-white">{c.title}</span>
                      <span className="block text-xs text-white/55">{c.sub}</span>
                    </span>
                    <ArrowRight width={18} height={18} className="text-white/55 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
                  </button>
                </Reveal>
              ))}
            </div>
          </motion.div>
        )}

      {view === "volunteers" && (
        <VolunteersScreen
          onClose={() => {
            open("hub");
          }}
        />
      )}

      {view !== "hub" && view !== "volunteers" && (
          <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-0 z-30 bg-ink/80 px-4 pt-4 backdrop-blur safe-top">
              <button
                onClick={() => {
                  open("hub");
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 py-1.5 pl-2 pr-3.5 text-sm font-semibold text-white/85 active:scale-95"
              >
                <ChevronLeft width={18} height={18} /> Back
              </button>
            </div>
            {view === "yes" && <NewLifeScreen go={(v) => open(v as View)} />}
            {view === "prayer" && <PrayerWallScreen />}
            {view === "photos" && <PhotoWallScreen />}
            {view === "shop" && <ShopScreen initialData={initialShopData} />}
            {view === "movement" && <MovementScreen />}
            {view === "discipleship" && <DiscipleshipScreen />}
            {view === "give" && <DonateScreen />}
            {view === "map" && <MapScreen />}
            {view === "connect" && <ConnectScreen />}
            {view === "settings" && <SettingsScreen />}
            {view === "install" && <InstallScreen />}
          </motion.div>
        )}
    </div>
  );
}
