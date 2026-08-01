"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import BottomNav, { type TabId } from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import OfflineBanner from "./OfflineBanner";
import Splash from "./Splash";
import Onboarding from "./Onboarding";
import HomeScreen from "./screens/HomeScreen";

// Code-split secondary screens so the first load (Home) stays fast.
const ScreenLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
  </div>
);
const ScheduleScreen = dynamic(() => import("./screens/ScheduleScreen"), { loading: ScreenLoader });
const GameScreen = dynamic(() => import("./screens/GameScreen"), { loading: ScreenLoader });
const NewsScreen = dynamic(() => import("./screens/NewsScreen"), { loading: ScreenLoader });
const MoreScreen = dynamic(() => import("./screens/MoreScreen"), { loading: ScreenLoader });

// Sub-views of "More" that a ?go= link is allowed to open (see MoreScreen).
const MORE_VIEWS = ["prayer", "volunteers", "connect", "movement", "discipleship", "give", "map", "install", "settings"];
const TAB_IDS: TabId[] = ["home", "schedule", "game", "news", "more"];

export default function AppShell() {
  const [tab, setTab] = useState<TabId>("home");
  // Splash + onboarding are client-only (mounted gate) to avoid SSR/AnimatePresence hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [splash, setSplash] = useState(true);
  const [onboard, setOnboard] = useState(false);

  // Fade the splash out with CSS, then unmount it unconditionally. Timers keep
  // running when rAF is throttled, so the splash can never get stuck on screen.
  const [splashLeaving, setSplashLeaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fade = setTimeout(() => setSplashLeaving(true), 1900);
    const gone = setTimeout(() => setSplash(false), 2400);
    try {
      if (!localStorage.getItem("jf-joined")) setOnboard(true);
    } catch {
      /* ignore */
    }
    return () => {
      clearTimeout(fade);
      clearTimeout(gone);
    };
  }, []);

  // Bumping this whenever "More" is tapped tells MoreScreen to return to its hub.
  const [moreSignal, setMoreSignal] = useState(0);
  // Optional target sub-view so other screens can deep-link into a More page.
  const [moreView, setMoreView] = useState<string | null>(null);

  // Email and push CTAs deep-link straight to a screen: /?go=schedule, /?go=prayer, /?go=game …
  useEffect(() => {
    let target: string | null = null;
    try {
      target = new URLSearchParams(window.location.search).get("go");
    } catch {
      /* ignore */
    }
    if (!target) return;
    if ((TAB_IDS as string[]).includes(target)) {
      setTab(target as TabId);
    } else if (MORE_VIEWS.includes(target)) {
      setMoreView(target);
      setMoreSignal((s) => s + 1);
      setTab("more");
    }
    // Drop only `go` so a refresh doesn't keep re-navigating — any other params
    // (e.g. the ?now= festival-day rehearsal clock) must survive.
    try {
      const u = new URL(window.location.href);
      u.searchParams.delete("go");
      window.history.replaceState({}, "", u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : ""));
    } catch {
      /* ignore */
    }
  }, []);

  const go = (next: TabId, sub?: string) => {
    if (next === "more") {
      setMoreView(sub ?? null);
      setMoreSignal((s) => s + 1);
    }
    if (next === tab && !sub) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTab(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen bg-ink">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/12 blur-[120px]" />
      </div>

      {mounted && splash && <Splash leaving={splashLeaving} />}
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
          {tab === "more" && <MoreScreen resetSignal={moreSignal} openView={moreView} />}
        </motion.div>
      </main>

      <OfflineBanner />
      <InstallPrompt />
      <BottomNav active={tab} onChange={go} />
    </div>
    </MotionConfig>
  );
}
