"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import BottomNav, { type TabId } from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import OfflineBanner from "./OfflineBanner";
import { resubscribeIfPermitted } from "@/lib/push";
import Splash from "./Splash";
import Onboarding from "./Onboarding";
import HomeScreen from "./screens/HomeScreen";
import DiscoveryFooter from "./DiscoveryFooter";
import { destinationFor, pathFor, syncDocumentMeta, type AppDestination } from "@/lib/routes";
import type { ShopData } from "@/lib/shop";

// Code-split secondary screens so the first load (Home) stays fast.
const ScreenLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading screen">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
  </div>
);
const ScheduleScreen = dynamic(() => import("./screens/ScheduleScreen"), { loading: ScreenLoader });
// Search is a pure overlay — never part of the first paint.
const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });
const GameScreen = dynamic(() => import("./screens/GameScreen"), { loading: ScreenLoader });
const NewsScreen = dynamic(() => import("./screens/NewsScreen"), { loading: ScreenLoader });
const MoreScreen = dynamic(() => import("./screens/MoreScreen"), { loading: ScreenLoader });

// Sub-views of "More" that an email/push ?go= link is allowed to open.
const MORE_VIEWS = ["yes", "prayer", "volunteers", "connect", "movement", "discipleship", "give", "map", "install", "settings", "photos", "shop"];
const TAB_IDS: TabId[] = ["home", "schedule", "game", "news", "more"];

export default function AppShell({
  initialDestination = { tab: "home" },
  initialShopData,
}: {
  initialDestination?: AppDestination;
  initialShopData?: ShopData;
}) {
  const [tab, setTab] = useState<TabId>(initialDestination.tab);
  // Splash + onboarding are client-only (mounted gate) so the server render never disagrees.
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
  const [search, setSearch] = useState(false);

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
    // Give first-time visitors the branded welcome, but never make returning
    // visitors sit through it again in the same browsing session.
    let seenSplash = false;
    try {
      seenSplash = sessionStorage.getItem("jf-splash-seen") === "yes";
      sessionStorage.setItem("jf-splash-seen", "yes");
    } catch {
      /* ignore */
    }
    if (seenSplash) {
      setSplashLeaving(true);
      setSplash(false);
    }
    const fade = seenSplash ? undefined : setTimeout(() => setSplashLeaving(true), 1050);
    const gone = seenSplash ? undefined : setTimeout(() => setSplash(false), 1400);
    try {
      if (!localStorage.getItem("jf-joined")) setOnboard(true);
    } catch {
      /* ignore */
    }
    return () => {
      if (fade) clearTimeout(fade);
      if (gone) clearTimeout(gone);
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

  // ⌘K / Ctrl-K opens search anywhere; "/" does too, unless you're typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const typing = /^(input|textarea|select)$/i.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setSearch(true);
      } else if (k === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

        {/* Ambient background. Gradients rather than blurred circles: these are
            fixed, so they are composited on every frame of every scroll, and a
            120px blur filter is by far the most expensive way to draw a soft
            glow on a mid-range phone. */}
        <div className="bg-app-ambient pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

        {mounted && splash && <Splash leaving={splashLeaving} />}
        {mounted && !splash && onboard && <Onboarding onDone={() => setOnboard(false)} />}

        <main
          id="app-content"
          aria-hidden={blockedByOverlay ? true : undefined}
          className={`relative z-10 mx-auto min-h-screen max-w-lg pb-28 ${blockedByOverlay ? "pointer-events-none" : ""}`}
        >
          {/* A keyed CSS entrance, not a framer fade. The screen switcher is
              the one wrapper every view sits inside, and a JS opacity:0→1
              animation stalls at 0 whenever rAF is throttled — backgrounded
              PWA, iPhone Low Power Mode — leaving the whole app invisible
              except the nav. The key remounts the div per tab, replaying the
              animation; its resting state is fully visible, so a stalled
              frame loop costs the sweep, never the screen. */}
          <div key={`${tab}-${moreView ?? "hub"}`} className="jf-rise">
            {tab === "home" && <HomeScreen go={go} onSearch={() => setSearch(true)} />}
            {tab === "schedule" && <ScheduleScreen />}
            {tab === "game" && <GameScreen />}
            {tab === "news" && <NewsScreen />}
            {tab === "more" && (
              <MoreScreen
                resetSignal={moreSignal}
                openView={moreView}
                onViewChange={openMoreView}
                onSearch={() => setSearch(true)}
                initialShopData={initialShopData}
              />
            )}
          </div>
          <DiscoveryFooter />
        </main>

        {search && <SearchOverlay onClose={() => setSearch(false)} go={go} />}

        <OfflineBanner />
        <InstallPrompt />
        <div aria-hidden={blockedByOverlay ? true : undefined} className={blockedByOverlay ? "pointer-events-none" : ""}>
          <BottomNav active={tab} onChange={go} />
        </div>
      </div>
    </MotionConfig>
  );
}
