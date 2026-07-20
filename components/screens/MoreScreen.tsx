"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import MovementScreen from "./MovementScreen";
import DiscipleshipScreen from "./DiscipleshipScreen";
import MapScreen from "./MapScreen";
import ConnectScreen from "./ConnectScreen";
import { FlameIcon, MapIcon, BellIcon, ArrowRight, ChevronLeft, Users } from "@/components/icons";

type View = "hub" | "movement" | "discipleship" | "map" | "connect";

const CARDS: { id: View; title: string; sub: string; Icon: React.ComponentType<{ width?: number; height?: number }>; emoji: string }[] = [
  { id: "movement", title: "The Movement", sub: "More than a festival — a movement that remains", Icon: FlameIcon, emoji: "🔥" },
  { id: "discipleship", title: "Discipleship & Partners", sub: "Keep the fire burning · churches & ministries", Icon: Users, emoji: "🤝" },
  { id: "map", title: "Festival Map", sub: "Getting to Gage Park & finding your way", Icon: MapIcon, emoji: "🗺️" },
  { id: "connect", title: "Connect", sub: "Join the community, follow & get involved", Icon: BellIcon, emoji: "💬" },
];

export default function MoreScreen() {
  const [view, setView] = useState<View>("hub");

  return (
    <div>
      {view === "hub" ? (
          <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4">
            <ScreenHeader eyebrow="Explore more" title="More" subtitle="The movement, discipleship, the map & ways to connect." />
            <div className="space-y-3 pb-4">
              {CARDS.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.05}>
                  <button
                    onClick={() => {
                      setView(c.id);
                      window.scrollTo({ top: 0 });
                    }}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition active:scale-[0.99]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-2xl">{c.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold text-white">{c.title}</span>
                      <span className="block text-xs text-white/55">{c.sub}</span>
                    </span>
                    <ArrowRight width={18} height={18} className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
                  </button>
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
            {view === "movement" && <MovementScreen />}
            {view === "discipleship" && <DiscipleshipScreen />}
            {view === "map" && <MapScreen />}
            {view === "connect" && <ConnectScreen />}
          </motion.div>
        )}
    </div>
  );
}
