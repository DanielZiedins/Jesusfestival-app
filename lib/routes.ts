import type { TabId } from "@/components/BottomNav";

export type MoreView =
  | "prayer"
  | "volunteers"
  | "movement"
  | "discipleship"
  | "give"
  | "map"
  | "connect"
  | "settings"
  | "install"
  | "photos";

export type AppDestination = {
  tab: TabId;
  moreView?: MoreView;
};

export const APP_ROUTES: Record<string, AppDestination> = {
  "/": { tab: "home" },
  "/schedule": { tab: "schedule" },
  "/revive-the-city": { tab: "game" },
  "/news": { tab: "news" },
  "/more": { tab: "more" },
  "/prayer": { tab: "more", moreView: "prayer" },
  "/volunteer": { tab: "more", moreView: "volunteers" },
  "/movement": { tab: "more", moreView: "movement" },
  "/discipleship": { tab: "more", moreView: "discipleship" },
  "/give": { tab: "more", moreView: "give" },
  "/map": { tab: "more", moreView: "map" },
  "/connect": { tab: "more", moreView: "connect" },
  "/settings": { tab: "more", moreView: "settings" },
  "/install": { tab: "more", moreView: "install" },
  "/photos": { tab: "more", moreView: "photos" },
};

export const APP_ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Jesus Festival App | Hamilton 2026 · Sept 4–5 · Gage Park",
    description: "The official Jesus Festival app. Hamilton 2026 — September 4–5 at Gage Park. Celebration. Worship. Unity.",
  },
  "/schedule": {
    title: "Jesus Festival 2026 Schedule",
    description: "Plan both days at Gage Park, star your must-see sets, share artists, and follow the live Jesus Festival run of show.",
  },
  "/revive-the-city": {
    title: "Revive the City",
    description: "Complete daily Kingdom missions, play together, and help bring light to Hamilton in the official Jesus Festival app.",
  },
  "/news": {
    title: "Jesus Festival News",
    description: "Artist reveals, schedule updates, festival announcements, and important news from the Jesus Festival team.",
  },
  "/prayer": {
    title: "Jesus Festival Prayer Wall",
    description: "Share a prayer, celebrate a praise report, and pray with the Jesus Festival community across Hamilton and beyond.",
  },
  "/volunteer": {
    title: "Volunteer at Jesus Festival",
    description: "Apply to serve, access your volunteer team, and help welcome Hamilton to Jesus Festival 2026.",
  },
  "/movement": {
    title: "The Jesus Festival Movement",
    description: "Discover the vision: gather the Church, reach the city, and leave a movement that remains.",
  },
  "/discipleship": {
    title: "Discipleship and Partners",
    description: "Keep the fire burning after the festival and connect with trusted churches and ministries.",
  },
  "/give": {
    title: "Give to Jesus Festival",
    description: "Help keep Jesus Festival free and fuel worship, outreach, baptisms, and year-round discipleship.",
  },
  "/photos": {
    title: "Jesus Festival Photo Wall",
    description: "Real moments from the Jesus Festival community — and a place to share yours. Every photo is reviewed before it appears.",
  },
  "/map": {
    title: "Jesus Festival Map and Directions",
    description: "Plan your arrival at Gage Park, open directions, and explore the Jesus Festival zones.",
  },
  "/connect": {
    title: "Connect with Jesus Festival",
    description: "Join the movement, get festival updates, share the app, and find ways to serve and partner.",
  },
  "/install": {
    title: "Install the Jesus Festival App",
    description: "Add Jesus Festival to your home screen for fast, full-screen access, notifications, and offline festival essentials.",
  },
  "/more": {
    title: "Explore Jesus Festival",
    description: "Prayer, volunteering, discipleship, giving, the festival map, settings, and more.",
  },
  "/settings": {
    title: "App Settings",
    description: "Update your Jesus Festival app profile and notification preferences.",
  },
};

export function syncDocumentMeta(path: string) {
  if (typeof document === "undefined") return;
  const meta = APP_ROUTE_META[path] ?? APP_ROUTE_META["/"];
  document.title = path === "/" ? meta.title : `${meta.title} | Jesus Festival`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", meta.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", meta.description);
  const canonical = `https://www.jesusfestival.app${path === "/" ? "" : path}`;
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
}

const TAB_PATHS: Record<TabId, string> = {
  home: "/",
  schedule: "/schedule",
  game: "/revive-the-city",
  news: "/news",
  more: "/more",
};

const MORE_PATHS: Record<MoreView, string> = {
  prayer: "/prayer",
  volunteers: "/volunteer",
  movement: "/movement",
  discipleship: "/discipleship",
  give: "/give",
  map: "/map",
  connect: "/connect",
  photos: "/photos",
  settings: "/settings",
  install: "/install",
};

export function pathFor(tab: TabId, moreView?: string | null): string {
  if (tab === "more" && moreView && moreView in MORE_PATHS) {
    return MORE_PATHS[moreView as MoreView];
  }
  return TAB_PATHS[tab];
}

export function destinationFor(pathname: string): AppDestination {
  return APP_ROUTES[pathname] ?? APP_ROUTES["/"];
}

export const INDEXABLE_ROUTES = [
  "/",
  "/schedule",
  "/revive-the-city",
  "/news",
  "/prayer",
  "/volunteer",
  "/movement",
  "/discipleship",
  "/give",
  "/photos",
  "/map",
  "/connect",
  "/install",
] as const;
