"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav, { type TabId } from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import Splash from "./Splash";
import Onboarding from "./Onboarding";
import HomeScreen from "./screens/HomeScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import GameScreen from "./screens/GameScreen";
import NewsScreen from "./screens/NewsScreen";
import MoreScreen from "./screens/MoreScreen";

export default function AppShell() {
  const [tab, setTab] = useState<TabId>("home");
  // Splash + onboarding are client-only (mounted gate) to avoid SSR/AnimatePresence hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [splash, setSplash] = useState(true);
  const [onboard, setOnboard] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setSplash(false), 1900);
    try {
      if (!localStorage.getItem("jf-joined")) setOnboard(true);
    } catch {
      /* ignore */
    }
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
        <div className="absolute -top-40 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/12 blur-[120px]" />
      </div>

      <AnimatePresence>{mounted && splash && <Splash key="splash" />}</AnimatePresence>
      <AnimatePresence>
        {mounted && !splash && onboard && <Onboarding key="onboard" onDone={() => setOnboard(false)} />}
      </AnimatePresence>

      <main className="relative z-10 mx-auto min-h-screen max-w-lg pb-28">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "home" && <HomeScreen go={go} />}
          {tab === "schedule" && <ScheduleScreen />}
          {tab === "game" && <GameScreen />}
          {tab === "news" && <NewsScreen />}
          {tab === "more" && <MoreScreen />}
        </motion.div>
      </main>

      <InstallPrompt />
      <BottomNav active={tab} onChange={go} />
    </div>
  );
}
