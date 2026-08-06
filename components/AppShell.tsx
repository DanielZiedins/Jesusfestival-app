"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import BottomNav, { type TabId } from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import OfflineBanner from "./OfflineBanner";
import { resubscribeIfPermitted } from "@/lib/push";
import Splash from "./Splash";
import Onboarding from "./Onboarding";
import HomeScreen from "./screens/HomeScreen";
import { destinationFor, pathFor, syncDocumentMeta, type AppDestination } from "@/lib/routes";
import type { ShopData } from "@/lib/shop";

// Code-split secondary screens so the first load (Home) stays fast.
const ScreenLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading screen">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
  </div>
);
const ScheduleScreen = dynamic(() => import("./screens/ScheduleScreen"), { loading: ScreenLoader });
const GameScreen = dynamic(() => import("./screens/GameScreen"), { loading: ScreenLoader });
const NewsScreen = dynamic(() => import("./screens/NewsScreen"), { loading: ScreenLoader });
const MoreScreen = dynamic(() => import("./screens/MoreScreen"), { loading: ScreenLoader });

// Sub-views of "More" that an email/push ?go= link is allowed to open.
const MORE_VIEWS = ["prayer", "volunteers", "connect", "movement", "discipleship", "give", "map", "install", "settings", "photos", "shop"];
const TAB_IDS: TabId[] = ["home", "schedule", "game", "news", "more"];

export default function AppShell({
  initialDestination = { tab: "home" },
  initialShopData,
}: {
  initialDestination?: AppDestination;
  initialShopData?: ShopData;
}) {
  const [tab, setTab] = useState<TabId>(initialDestination.tab);
  // Splash + onboarding are client-only (mounted gate) to avoid SSR/AnimatePresence hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [splash, setSplash] = useState(true);
  const [onboard, setOnboard] = useState(false);

  // Fade the splash out with CSS, then unmount it unconditionally. Timers keep
  // running when rAF is throttled, so the splash can never get stuck on screen.
  const [splashLeaving, setSplashLeaving] = useState(false);

  // Bumping this whenever "More" is tapped tells MoreScreen to return to its hub.
  const [moreSignal, setMoreSignal] = useState(0);
  // Optional target sub-view so other screens can deep-link into a More page.
  const [moreView, setMoreView] = useState<string | null>(initialDestination.moreView ?? null);

  const setPath = (next: TabId, sub?: string | null, replace = false) => {
    const path = pathFor(next, sub);
    if (window.location.pathname === path && !window.location.search) {
      syncDocumentMeta(path);
      return;
    }
    window.history[replace ? "replaceState" : "pushState"]({}, "", path);
    syncDocumentMeta(path);
  };

  useEffect(() => {
    setMounted(true);
    // Repair any push subscription that never stored server-side (silent — the
    // browser permission is already granted, so nobody is re-prompted).
    void resubscribeIfPermitted();
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

  // Clean URLs make every important destination refreshable and shareable.
  // Browser back/forward follows the same navigation stack as the bottom tabs.
  useEffect(() => {
    const onPopState = () => {
      const next = destinationFor(window.location.pathname);
      setTab(next.tab);
      setMoreView(next.moreView ?? null);
      if (next.tab === "more") setMoreSignal((s) => s + 1);
      syncDocumentMeta(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Legacy email and push CTAs still deep-link straight to a screen.
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
      setPath(target as TabId, null, true);
    } else if (MORE_VIEWS.includes(target)) {
      setMoreView(target);
      setMoreSignal((s) => s + 1);
      setTab("more");
      setPath("more", target, true);
    }
  }, []);

  const go = (next: TabId, sub?: string) => {
    if (next === "more") {
      setMoreView(sub ?? null);
      setMoreSignal((s) => s + 1);
    }
    if (next === tab && !sub) {
      // Tapping More while a More sub-screen is open returns to the More hub.
      if (next === "more" && moreView) setPath("more", null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTab(next);
    setPath(next, sub);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openMoreView = (view: string) => {
    const next = view === "hub" ? null : view;
    setMoreView(next);
    setPath("more", next);
  };

  const blockedByOverlay = mounted && (splash || onboard);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-ink">
        <a href="#app-content" className="skip-link">Skip to app content</a>

        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <div className="absolute -top-40 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/30 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/12 blur-[120px]" />
        </div>

        {mounted && splash && <Splash leaving={splashLeaving} />}
        <AnimatePresence>
          {mounted && !splash && onboard && <Onboarding key="onboard" onDone={() => setOnboard(false)} />}
        </AnimatePresence>

        <main
          id="app-content"
          aria-hidden={blockedByOverlay ? true : undefined}
          className={`relative z-10 mx-auto min-h-screen max-w-lg pb-28 ${blockedByOverlay ? "pointer-events-none" : ""}`}
        >
          <motion.div
            key={`${tab}-${moreView ?? "hub"}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "home" && <HomeScreen go={go} />}
            {tab === "schedule" && <ScheduleScreen />}
            {tab === "game" && <GameScreen />}
            {tab === "news" && <NewsScreen />}
            {tab === "more" && (
              <MoreScreen
                resetSignal={moreSignal}
                openView={moreView}
                onViewChange={openMoreView}
                initialShopData={initialShopData}
              />
            )}
          </motion.div>
        </main>

        <OfflineBanner />
        <InstallPrompt />
        <div aria-hidden={blockedByOverlay ? true : undefined} className={blockedByOverlay ? "pointer-events-none" : ""}>
          <BottomNav active={tab} onChange={go} />
        </div>
      </div>
    </MotionConfig>
  );
}
