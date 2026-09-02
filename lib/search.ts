/**
 * Universal search.
 *
 * The index is built once from static content — the run of show, the lineup,
 * every screen, the park map, the blog — so search works instantly, offline,
 * and with zero network calls. Scoring is deliberately simple: prefix and
 * word-start matches beat mid-word ones, and title matches beat body matches.
 */

import { ARTISTS, DISCIPLESHIP, KINGDOM_SITES, SCHEDULE } from "@/lib/content";
import { PARK_PINS } from "@/lib/park";
import { STEPS } from "@/lib/newlife";
import { BLOG_POSTS } from "@/lib/blog";
import type { TabId } from "@/components/BottomNav";

export type Hit = {
  id: string;
  title: string;
  sub: string;
  emoji: string;
  kind: "Schedule" | "Artist" | "Screen" | "Park" | "First step" | "Church" | "Article" | "Network";
  /** Where a tap goes: an in-app destination, or an external link. */
  tab?: TabId;
  moreView?: string;
  href?: string;
  /** Extra words that should match but don't need showing. */
  extra?: string;
};

let cache: Hit[] | null = null;

const SCREENS: Hit[] = [
  { id: "s-home", title: "Home", sub: "Countdown, lineup, verse of the day", emoji: "🏠", kind: "Screen", tab: "home" },
  { id: "s-schedule", title: "Schedule", sub: "Every set time, both days", emoji: "🗓️", kind: "Screen", tab: "schedule", extra: "run of show set times lineup times when" },
  { id: "s-game", title: "Revive the City", sub: "Missions, mini-games, quizzes & the light meter", emoji: "🎮", kind: "Screen", tab: "game", extra: "game play points captain goodness missions" },
  { id: "s-news", title: "News", sub: "Announcements & festival updates", emoji: "📰", kind: "Screen", tab: "news", extra: "updates announcements feed" },
  { id: "s-yes", title: "I said yes to Jesus", sub: "The prayer, seven first steps & honest answers", emoji: "🕊️", kind: "Screen", tab: "more", moreView: "yes", extra: "salvation saved gospel become a christian born again decision follow jesus new life" },
  { id: "s-prayer", title: "Prayer Wall", sub: "Post a prayer or praise, pray for the city", emoji: "🙏", kind: "Screen", tab: "more", moreView: "prayer", extra: "prayer request praise answered candle" },
  { id: "s-map", title: "Festival Map", sub: "The park, your spot, help & what to bring", emoji: "🗺️", kind: "Screen", tab: "more", moreView: "map", extra: "gage park directions parking washrooms first aid lost child what to bring accessible" },
  { id: "s-volunteers", title: "Volunteers", sub: "Apply to serve & find your team", emoji: "🙌", kind: "Screen", tab: "more", moreView: "volunteers", extra: "serve serving volunteer team sign up" },
  { id: "s-photos", title: "Photo Wall", sub: "Community photos — share yours", emoji: "📸", kind: "Screen", tab: "more", moreView: "photos", extra: "pictures gallery upload photo" },
  { id: "s-shop", title: "Festival Shop", sub: "Official apparel & Kingdom gear", emoji: "🛍️", kind: "Screen", tab: "more", moreView: "shop", extra: "merch tshirt tee hoodie buy store apparel" },
  { id: "s-give", title: "Give / Donate", sub: "Sow into the movement · tax receipt", emoji: "❤️", kind: "Screen", tab: "more", moreView: "give", extra: "donate giving offering tithe support money" },
  { id: "s-discipleship", title: "Discipleship & Partners", sub: "Churches & ministries walking this out", emoji: "🤝", kind: "Screen", tab: "more", moreView: "discipleship", extra: "church churches ministry partners keep the fire" },
  { id: "s-movement", title: "The Movement", sub: "More than a festival", emoji: "🔥", kind: "Screen", tab: "more", moreView: "movement", extra: "vision mission why" },
  { id: "s-connect", title: "Connect", sub: "Where the movement is spreading", emoji: "🌍", kind: "Screen", tab: "more", moreView: "connect", extra: "globe world community join" },
  { id: "s-install", title: "Add to Home Screen", sub: "Install the app & turn on notifications", emoji: "📲", kind: "Screen", tab: "more", moreView: "install", extra: "install pwa notifications alerts push offline" },
  { id: "s-offline", title: "Offline Festival Essentials", sub: "Saved schedule, location & packing checklist", emoji: "📵", kind: "Screen", href: "/offline", extra: "no signal festival ready packing plan download" },
  { id: "s-weekend", title: "Festival Weekend Command Center", sub: "Live schedule, forecast, readiness, help, map and offline essentials", emoji: "⚡", kind: "Screen", href: "/festival-weekend", extra: "today day of weather countdown arrival emergency lost child first aid packing prepare" },
  { id: "s-day-of", title: "Festival Day-Of Mode", sub: "One fast live screen for now, next, map, help and offline essentials", emoji: "⚡", kind: "Screen", href: "/day-of", extra: "today live now next stage urgent first aid lost child no signal directions quick focus mode" },
  { id: "s-plan", title: "Build My Festival Plan", sub: "A personalized arrival plan for your days, group and travel", emoji: "🧭", kind: "Screen", href: "/jesus-festival-hamilton#build-my-plan", extra: "visit planner driving transit family first time accessible low stress" },
  { id: "s-group", title: "Bring a Group", sub: "Build and share a crew plan for your church, youth group, family or friends", emoji: "🫂", kind: "Screen", href: "/bring-a-group", extra: "church trip youth leader carpool meeting point responsibilities whatsapp group planner invite crew team" },
  { id: "s-moments", title: "Find Your Festival Moments", sub: "Get a personalized shortlist from the confirmed 2026 lineup", emoji: "✨", kind: "Screen", href: "/find-your-moments", extra: "lineup matcher recommendation quiz what should i see best sets worship music hip hop ant lee open heaven acts friday night prayer bethel" },
  { id: "s-arrival", title: "Getting to Gage Park", sub: "Current road and HSR detours, parking facts and a personal leave-by time", emoji: "🚧", kind: "Screen", href: "/getting-to-gage-park", extra: "directions driving traffic construction main ottawa closure parking hsr transit bus fare presto rideshare taxi uber cycling bike walking arrival departure when should i leave" },
  { id: "s-packing", title: "What to Bring", sub: "Build a personal, downloadable festival packing checklist", emoji: "🎒", kind: "Screen", href: "/what-to-bring", extra: "packing pack list checklist chair blanket water sunscreen hat children family medication sensory volunteer weather gage park" },
  { id: "s-access", title: "Accessibility & Comfort Guide", sub: "Mobility, sensory comfort, HSR, service animals and support planning", emoji: "♿", kind: "Screen", href: "/accessibility", extra: "wheelchair accessible quiet ASL hearing vision medication caregiver stroller washroom parking" },
  { id: "s-hunt", title: "The Light Hunt", sub: "Find 12 lights around Gage Park and unlock shareable badges", emoji: "🔦", kind: "Screen", href: "/hunt", extra: "scavenger qr vendor row game badge family activity" },
  { id: "s-settings", title: "Settings", sub: "Your name, church & preferences", emoji: "⚙️", kind: "Screen", tab: "more", moreView: "settings", extra: "profile preferences name" },
];

export function searchIndex(): Hit[] {
  if (cache) return cache;
  const out: Hit[] = [...SCREENS];

  for (const day of SCHEDULE.days) {
    for (const s of day.items) {
      out.push({
        id: `sl-${day.id}-${s.time}-${s.title}`,
        title: s.title,
        sub: `${day.label} ${day.date} · ${s.time} — ${s.note}`,
        emoji: s.kind === "artist" ? "🎵" : s.kind === "speaker" ? "🎙️" : "✨",
        kind: "Schedule",
        tab: "schedule",
        extra: `${day.label} ${s.time} ${s.kind ?? ""}`,
      });
    }
  }

  for (const a of ARTISTS) {
    out.push({
      id: `ar-${a.name}`,
      title: a.name,
      sub: `${a.role} — ${a.blurb}`,
      emoji: "🎤",
      kind: "Artist",
      tab: "schedule",
    });
  }

  for (const p of PARK_PINS) {
    out.push({
      id: `pk-${p.id}`,
      title: p.name,
      sub: p.note,
      emoji: p.emoji,
      kind: "Park",
      tab: "more",
      moreView: "map",
    });
  }

  for (const s of STEPS) {
    out.push({
      id: `st-${s.id}`,
      title: s.title,
      sub: s.why,
      emoji: s.emoji,
      kind: "First step",
      tab: "more",
      moreView: "yes",
      extra: s.ref,
    });
  }

  for (const c of [...DISCIPLESHIP.churches, ...DISCIPLESHIP.ministries]) {
    out.push({
      id: `ch-${c.name}`,
      title: c.name,
      sub: "Festival partner — open their site",
      emoji: "⛪",
      kind: "Church",
      href: c.href,
    });
  }

  for (const post of BLOG_POSTS) {
    out.push({
      id: `bl-${post.slug}`,
      title: post.title,
      sub: post.description,
      emoji: post.emoji,
      kind: "Article",
      href: `/blog/${post.slug}`,
      extra: post.eyebrow,
    });
  }

  for (const site of KINGDOM_SITES) {
    out.push({
      id: `kn-${site.domain}`,
      title: site.name,
      sub: `${site.tag} — ${site.blurb}`,
      emoji: site.emoji,
      kind: "Network",
      href: site.url,
      extra: site.domain,
    });
  }

  cache = out;
  return out;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Word-start matches only. Matching mid-word turns "first aid" into a hit on
 * "I *said* yes" and "ant" into a hit on "w*ant*" — people type prefixes, not
 * fragments, so anchoring to word starts is both tighter and more predictable.
 */
function scoreOne(haystack: string, term: string): number {
  let i = haystack.indexOf(term);
  while (i !== -1) {
    if (i === 0) return 3;
    if (haystack[i - 1] === " ") return 2;
    i = haystack.indexOf(term, i + 1);
  }
  return 0;
}

export function runSearch(query: string, limit = 24): Hit[] {
  const terms = norm(query).split(" ").filter((t) => t.length > 1);
  if (!terms.length) return [];

  const scored: { hit: Hit; score: number }[] = [];
  for (const hit of searchIndex()) {
    const title = norm(hit.title);
    const body = norm(`${hit.sub} ${hit.extra ?? ""} ${hit.kind}`);
    let total = 0;
    let matchedAll = true;
    for (const t of terms) {
      const s = scoreOne(title, t) * 6 + scoreOne(body, t);
      if (s === 0) {
        matchedAll = false;
        break;
      }
      total += s;
    }
    // Every term has to land somewhere — "ant lee friday" shouldn't match
    // everything that merely mentions Friday.
    if (!matchedAll) continue;
    // Screens are the answer to most short queries, so nudge them up.
    if (hit.kind === "Screen") total += 2;
    scored.push({ hit, score: total });
  }

  scored.sort((a, b) => b.score - a.score || a.hit.title.length - b.hit.title.length);
  return scored.slice(0, limit).map((s) => s.hit);
}

export const QUICK_QUERIES = ["Day-of", "Today", "Arrival", "Packing", "My moments", "Group plan", "Light Hunt", "Offline"];
