"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import MovementScreen from "./MovementScreen";
import DiscipleshipScreen from "./DiscipleshipScreen";
import DonateScreen from "./DonateScreen";
import MapScreen from "./MapScreen";
import ConnectScreen from "./ConnectScreen";
import SettingsScreen from "./SettingsScreen";
import InstallScreen from "./InstallScreen";
import PrayerWallScreen from "./PrayerWallScreen";
import { FlameIcon, MapIcon, BellIcon, ArrowRight, ChevronLeft, Users, Heart, Download, Sparkle } from "@/components/icons";

import { LINKS } from "@/lib/content";

type View = "hub" | "prayer" | "movement" | "discipleship" | "give" | "map" | "connect" | "settings" | "install" | "volunteer";

// `href` marks a card that leaves this screen entirely (the volunteer app is a
// separate deployment proxied in under /volunteer) — those render as links
// rather than switching the local view.
const CARDS: { id: View; title: string; sub: string; Icon: React.ComponentType<{ width?: number; height?: number }>; emoji: string; href?: string }[] = [
  { id: "connect", title: "Connect", sub: "See where the movement is spreading & get involved", Icon: BellIcon, emoji: "🌍" },
  { id: "volunteer", title: "Volunteers", sub: "Serving with us? Enter your code & find your team", Icon: Users, emoji: "🙌", href: LINKS.volunteerApp },
  { id: "movement", title: "The Movement", sub: "More than a festival — a movement that remains", Icon: FlameIcon, emoji: "🔥" },
  { id: "discipleship", title: "Discipleship & Partners", sub: "Keep the fire burning · churches & ministries", Icon: Users, emoji: "🤝" },
  { id: "give", title: "Give / Donate", sub: "Sow into good ground · tax receipt provided", Icon: Heart, emoji: "❤️" },
  { id: "map", title: "Festival Map", sub: "Getting to Gage Park & finding your way", Icon: MapIcon, emoji: "🗺️" },
  { id: "install", title: "Add to Home Screen", sub: "Install the app & turn on notifications", Icon: Download, emoji: "📲" },
  { id: "settings", title: "Settings", sub: "Update your name, church & preferences", Icon: Sparkle, emoji: "⚙️" },
];

const CARD_CLASS =
  "group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition active:scale-[0.99]";

function CardBody({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-2xl">{card.emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-bold text-white">{card.title}</span>
        <span className="block text-xs text-white/55">{card.sub}</span>
      </span>
      <ArrowRight width={18} height={18} className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
    </>
  );
}

export default function MoreScreen({ resetSignal = 0, openView = null }: { resetSignal?: number; openView?: string | null }) {
  const [view, setView] = useState<View>("hub");

  // Tapping "More" returns to the hub — unless a screen deep-linked to a page.
  useEffect(() => {
    setView((openView as View) || "hub");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  return (
    <div>
      {view === "hub" ? (
          <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4">
            <ScreenHeader eyebrow="Explore more" title="More" subtitle="The movement, discipleship, the map & ways to connect." />

            {/* Featured: Prayer Wall */}
            <Reveal>
              <button
                onClick={() => {
                  setView("prayer");
                  window.scrollTo({ top: 0 });
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

            <div className="space-y-3 pb-4">
              {CARDS.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.05}>
                  {c.href ? (
                    <a href={c.href} className={CARD_CLASS}>
                      <CardBody card={c} />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setView(c.id);
                        window.scrollTo({ top: 0 });
                      }}
                      className={CARD_CLASS}
                    >
                      <CardBody card={c} />
                    </button>
                  )}
                </Reveal>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-0 z-30 bg-ink/80 px-4 pt-4 backdrop-blur safe-top">
              <button
                onClick={() => {
                  setView("hub");
                  window.scrollTo({ top: 0 });
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 py-1.5 pl-2 pr-3.5 text-sm font-semibold text-white/85 active:scale-95"
              >
                <ChevronLeft width={18} height={18} /> Back
              </button>
            </div>
            {view === "prayer" && <PrayerWallScreen />}
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
