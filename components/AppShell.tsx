"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav, { type TabId } from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import Splash from "./Splash";
import HomeScreen from "./screens/HomeScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import MapScreen from "./screens/MapScreen";
import MovementScreen from "./screens/MovementScreen";
import ConnectScreen from "./screens/ConnectScreen";

export default function AppShell() {
  const [tab, setTab] = useState<TabId>("home");
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1900);
    return () => clearTimeout(t);
  }, []);

  const go = (next: TabId) => {
    if (next === tab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTab(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="relative min-h-screen bg-ink">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-navy-700/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-ember/10 blur-[120px]" />
      </div>

      <AnimatePresence>{splash && <Splash key="splash" />}</AnimatePresence>

      <main className="relative z-10 mx-auto min-h-screen max-w-lg pb-28">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "home" && <HomeScreen go={go} />}
          {tab === "schedule" && <ScheduleScreen />}
          {tab === "map" && <MapScreen />}
          {tab === "movement" && <MovementScreen />}
          {tab === "connect" && <ConnectScreen />}
        </motion.div>
      </main>

      <InstallPrompt />
      <BottomNav active={tab} onChange={go} />
    </div>
  );
}
