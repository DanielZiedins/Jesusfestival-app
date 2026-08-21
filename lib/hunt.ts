/**
 * The Festival Light Hunt.
 *
 * Twelve QR codes are hidden around Gage Park. Each one you find lights a lamp
 * in the app, pours real Light Points into Revive the City, and hands you a
 * verse to carry. Find all twelve and you become a Light Bearer.
 *
 * Half the lights sit in Vendor Row on purpose: the hunt should walk people
 * past the makers and ministries who paid to be here, not just the main stage.
 *
 * Progress lives in localStorage on purpose: a park full of people means the
 * network will be unusable at exactly the moment someone scans a code. The hunt
 * has to work with no signal, then sync its points when the phone reconnects.
 */

export type Station = {
  /** Unguessable token in the printed QR URL. Non-sequential by design. */
  token: string;
  id: string;
  name: string;
  /** Where the code is physically taped up. Doubles as the on-board hint. */
  where: string;
  /** True for the six lights in Vendor Row. */
  vendor?: boolean;
  emoji: string;
  points: number;
  verse: { text: string; ref: string };
  /** One line of encouragement shown the moment it's claimed. */
  word: string;
  /** A playful nudge shown while the lamp is still unlit. */
  clue: string;
};

export const HUNT_POINTS_BONUS = 700;

export const STATIONS: Station[] = [
  {
    token: "xxwd39j",
    id: "light-of-the-world",
    name: "Light of the World",
    where: "Main Stage",
    emoji: "🔦",
    points: 150,
    verse: { text: "You are the light of the world. A town built on a hill cannot be hidden.", ref: "Matthew 5:14" },
    word: "You didn't come here to blend in. Something in you is meant to be seen.",
    clue: "Where the speakers stand and the crowd faces one direction.",
  },
  {
    token: "pcuhxg4",
    id: "one-body",
    name: "One Body",
    where: "The Big Lawn",
    emoji: "🕊️",
    points: 150,
    verse: { text: "How good and pleasant it is when God's people live together in unity!", ref: "Psalm 133:1" },
    word: "Look around this field. Dozens of churches, one name. This is what heaven is like.",
    clue: "The wide open grass where blankets and strangers end up side by side.",
  },
  {
    token: "87uxpgz",
    id: "little-children",
    name: "Faith Like a Child",
    where: "Kids Zone",
    emoji: "🎈",
    points: 150,
    verse: { text: "Let the little children come to me, and do not hinder them.", ref: "Matthew 19:14" },
    word: "The people running past you screaming with joy have it right. Jesus said so.",
    clue: "Follow the loudest laughing. It is never hard to find.",
  },
  {
    token: "2mnp339",
    id: "bread-of-life",
    name: "Bread of Life",
    where: "Food Trucks",
    emoji: "🍞",
    points: 150,
    verse: { text: "I am the bread of life. Whoever comes to me will never go hungry.", ref: "John 6:35" },
    word: "Some hungers a food truck can't fix. He knows the one you came with.",
    clue: "Follow your nose to the longest line in the park.",
  },
  {
    token: "hcf5ed8",
    id: "clothed-in-love",
    name: "Clothed in Love",
    where: "Vendor Row · Apparel",
    vendor: true,
    emoji: "👕",
    points: 150,
    verse: { text: "Clothe yourselves with compassion, kindness, humility, gentleness and patience.", ref: "Colossians 3:12" },
    word: "What you wear preaches before you say a word. So does how you treat the person selling it.",
    clue: "A rail of shirts with something worth reading on the front.",
  },
  {
    token: "3cr884v",
    id: "good-work",
    name: "Whole-Hearted Work",
    where: "Vendor Row · Makers",
    vendor: true,
    emoji: "🛠️",
    points: 150,
    verse: { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23" },
    word: "Every stall here is somebody's Monday offered to God. Yours counts too.",
    clue: "Find the booth where somebody built the thing they're selling.",
  },
  {
    token: "3jh44gp",
    id: "potters-hands",
    name: "The Potter's Hands",
    where: "Vendor Row · Handmade",
    vendor: true,
    emoji: "🏺",
    points: 150,
    verse: { text: "You are the potter; we are all the work of your hand.", ref: "Isaiah 64:8" },
    word: "Nothing here came out perfect the first time. Neither did you. He's still shaping.",
    clue: "Look for the table where no two things are quite the same.",
  },
  {
    token: "zvytwv5",
    id: "salt-of-the-earth",
    name: "Salt of the Earth",
    where: "Vendor Row · Coffee & Treats",
    vendor: true,
    emoji: "🧂",
    points: 150,
    verse: { text: "You are the salt of the earth.", ref: "Matthew 5:13" },
    word: "Salt is small and changes everything it touches. That's the job description.",
    clue: "Something warm in a cup, or sweet in a bag. Your call.",
  },
  {
    token: "zmkgbt7",
    id: "cheerful-giver",
    name: "The Cheerful Giver",
    where: "Vendor Row · Ministry Booths",
    vendor: true,
    emoji: "🎁",
    points: 150,
    verse: { text: "Each of you should give what you have decided in your heart to give, for God loves a cheerful giver.", ref: "2 Corinthians 9:7" },
    word: "Some booths here aren't selling anything. Go ask one of them what they do. You'll be glad you did.",
    clue: "The people handing things out instead of ringing things up.",
  },
  {
    token: "w3uz5ya",
    id: "treasure-in-the-field",
    name: "Treasure in the Field",
    where: "Vendor Row · Deep in the Market",
    vendor: true,
    emoji: "💎",
    points: 150,
    verse: { text: "The kingdom of heaven is like treasure hidden in a field.", ref: "Matthew 13:44" },
    word: "This one is hidden further in than the rest. So is most of what's worth having.",
    clue: "Keep walking. Past where most people turn back.",
  },
  {
    token: "pvzkfvz",
    id: "living-water",
    name: "Living Water",
    where: "Baptism Area",
    emoji: "💧",
    points: 150,
    verse: { text: "Rivers of living water will flow from within them.", ref: "John 7:38" },
    word: "People are being made new right here today. It is never too late to be one of them.",
    clue: "Where the towels are stacked and people come up laughing.",
  },
  {
    token: "d6x4jup",
    id: "the-way",
    name: "The Way",
    where: "Info Point",
    emoji: "🧭",
    points: 150,
    verse: { text: "I am the way and the truth and the life.", ref: "John 14:6" },
    word: "If today feels like you're lost — that's not a problem to hide. That's the whole invitation.",
    clue: "The place you'd go if you had a question about anything.",
  },
];

/**
 * Tokens that were printed for an earlier layout of the hunt. They no longer
 * light a lamp, but a stray sheet in a box next year shouldn't hand someone a
 * 404 in the middle of a festival — see app/hunt/[token].
 */
export const RETIRED_TOKENS = ["2k5qrna", "rtcv5m2"];

export const stationByToken = (token: string) => STATIONS.find((s) => s.token === token);

export const VENDOR_STATIONS = STATIONS.filter((s) => s.vendor);
export const PARK_STATIONS = STATIONS.filter((s) => !s.vendor);

export const TOTAL_POINTS = STATIONS.reduce((n, s) => n + s.points, 0) + HUNT_POINTS_BONUS;

// ───────────────────────────── progress ─────────────────────────────

const KEY = "jf-hunt";
/** Station ids whose points have already been sent to Revive the City. */
const SYNCED_KEY = "jf-hunt-synced";

export type HuntProgress = {
  found: string[];
  /** When each lamp was lit, so day-two and speed badges can be earned. */
  foundAt: Record<string, string>;
  /** ISO timestamp of the first light. */
  startedAt?: string;
  /** ISO timestamp of completion, set once all twelve are in. */
  completedAt?: string;
};

const EMPTY: HuntProgress = { found: [], foundAt: {} };

// ───────────────────────────── badges ─────────────────────────────

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  /** Shown once earned. */
  blurb: string;
  /** Shown while still locked — a goal, never a spoiler. */
  hint: string;
  /** Lights needed; special badges also carry an extra test. */
  needs: number;
  /** Optional extra condition evaluated against progress. */
  extra?: (p: HuntProgress) => boolean;
  /** Card accent, used by the shareable image. */
  accent: string;
};

const withinMinutes = (p: HuntProgress, mins: number) => {
  if (!p.startedAt || !p.completedAt) return false;
  const ms = new Date(p.completedAt).getTime() - new Date(p.startedAt).getTime();
  return ms >= 0 && ms <= mins * 60_000;
};

const hasAll = (p: HuntProgress, group: Station[]) => {
  const got = new Set(p.found);
  return group.every((s) => got.has(s.id));
};

/** Distinct calendar days (in the phone's own timezone) that lamps were lit on. */
export function distinctDays(p: HuntProgress): number {
  const days = new Set<string>();
  for (const iso of Object.values(p.foundAt ?? {})) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) days.add(d.toLocaleDateString("en-CA"));
  }
  return days.size;
}

export const BADGES: Badge[] = [
  {
    id: "first-light",
    name: "First Light",
    emoji: "🕯️",
    blurb: "You found your first light. It starts with one.",
    hint: "Find your first light",
    needs: 1,
    accent: "#F7C948",
  },
  {
    id: "three-flames",
    name: "Three Flames",
    emoji: "🔥",
    blurb: "Three lights burning. You're properly on the hunt now.",
    hint: "Find 3 lights",
    needs: 3,
    accent: "#F5A623",
  },
  {
    id: "halfway",
    name: "Halfway There",
    emoji: "⭐",
    blurb: "Six of twelve. More found than left to find.",
    hint: "Find 6 lights",
    needs: 6,
    accent: "#C4A6FF",
  },
  {
    id: "market-blessing",
    name: "Market Blessing",
    emoji: "🛍️",
    blurb: "You walked the whole market and met the makers. They felt that.",
    hint: "Find all 6 lights in Vendor Row",
    needs: 6,
    extra: (p) => hasAll(p, VENDOR_STATIONS),
    accent: "#4FD1C5",
  },
  {
    id: "park-explorer",
    name: "Park Explorer",
    emoji: "🗺️",
    blurb: "Stage, lawn, kids, food, water, info — you covered the whole park.",
    hint: "Find all 6 lights outside Vendor Row",
    needs: 6,
    extra: (p) => hasAll(p, PARK_STATIONS),
    accent: "#7BD389",
  },
  {
    id: "nine-lamps",
    name: "Nine Lamps",
    emoji: "🌟",
    blurb: "Nine lights lit. Three left and the whole park is glowing.",
    hint: "Find 9 lights",
    needs: 9,
    accent: "#9F7AEA",
  },
  {
    id: "two-day-light",
    name: "Two-Day Light",
    emoji: "🌅",
    blurb: "You came back for more. Faithfulness looks exactly like this.",
    hint: "Find lights on both festival days",
    needs: 2,
    extra: (p) => distinctDays(p) >= 2,
    accent: "#FF9E7A",
  },
  {
    id: "light-bearer",
    name: "Light Bearer",
    emoji: "🏆",
    blurb: "Every lamp lit. You carried light across this whole park.",
    hint: "Find all 12 lights",
    needs: 12,
    accent: "#F5A623",
  },
  {
    id: "swift-light",
    name: "Swift Light",
    emoji: "⚡",
    blurb: "All twelve inside 90 minutes. You did not stroll.",
    hint: "Find all 12 within 90 minutes",
    needs: 12,
    extra: (p) => withinMinutes(p, 90),
    accent: "#63B3ED",
  },
];

export function earnedBadges(p: HuntProgress = getProgress()): Badge[] {
  return BADGES.filter((b) => p.found.length >= b.needs && (!b.extra || b.extra(p)));
}

export const badgeById = (id: string) => BADGES.find((b) => b.id === id);

export function getProgress(): HuntProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<HuntProgress>;
    const valid = new Set(STATIONS.map((s) => s.id));
    // Retired stations are dropped here, so an old save can't report 13 of 12.
    const found = Array.isArray(parsed.found) ? parsed.found.filter((id) => valid.has(id)) : [];
    const foundAt: Record<string, string> = {};
    if (parsed.foundAt && typeof parsed.foundAt === "object") {
      for (const [id, at] of Object.entries(parsed.foundAt)) {
        if (valid.has(id) && typeof at === "string") foundAt[id] = at;
      }
    }
    return {
      found,
      foundAt,
      startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : undefined,
      completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : undefined,
    };
  } catch {
    return EMPTY;
  }
}

function write(p: HuntProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode — the hunt still works for this session */
  }
}

export type ClaimResult = {
  station: Station;
  /** False when this lamp was already lit — no double points. */
  isNew: boolean;
  found: number;
  total: number;
  justCompleted: boolean;
  /** Badges unlocked by this exact scan, so the moment can be celebrated. */
  newBadges: Badge[];
  /** A couple of still-unlit lamps to send them looking for next. */
  nextUp: Station[];
};

/** Light a lamp. Idempotent: re-scanning the same code never double-counts. */
export function claim(token: string): ClaimResult | null {
  const station = stationByToken(token);
  if (!station) return null;

  const progress = getProgress();
  const before = earnedBadges(progress).map((b) => b.id);
  const now = new Date().toISOString();

  const isNew = !progress.found.includes(station.id);
  if (isNew) {
    progress.found.push(station.id);
    progress.foundAt[station.id] = now;
  }
  if (!progress.startedAt) progress.startedAt = now;

  const justCompleted = progress.found.length === STATIONS.length && !progress.completedAt;
  if (justCompleted) progress.completedAt = now;

  write(progress);

  const newBadges = earnedBadges(progress).filter((b) => !before.includes(b.id));
  const lit = new Set(progress.found);

  return {
    station,
    isNew,
    found: progress.found.length,
    total: STATIONS.length,
    justCompleted,
    newBadges,
    // Prefer a vendor light next — that's where we want the footfall.
    nextUp: [...VENDOR_STATIONS, ...PARK_STATIONS].filter((s) => !lit.has(s.id)).slice(0, 2),
  };
}

export function resetProgress() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(SYNCED_KEY);
  } catch {
    /* ignore */
  }
}

// ─────────────────────── city points, sync-safe ───────────────────────

function syncedIds(): string[] {
  try {
    const raw = localStorage.getItem(SYNCED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Points earned but not yet delivered to Revive the City — the scans that
 * happened while the park network was down.
 */
export function pendingPoints(): { points: number; ids: string[] } {
  const found = getProgress().found;
  const already = new Set(syncedIds());
  const ids = found.filter((id) => !already.has(id));
  let points = ids.reduce((n, id) => n + (STATIONS.find((s) => s.id === id)?.points ?? 0), 0);

  // The completion bonus is its own ledger entry so it can't be paid twice.
  const done = found.length === STATIONS.length;
  if (done && !already.has("__bonus")) {
    points += HUNT_POINTS_BONUS;
    ids.push("__bonus");
  }
  return { points, ids };
}

/** Call only after the points have actually landed server-side. */
export function markSynced(ids: string[]) {
  try {
    const next = Array.from(new Set([...syncedIds(), ...ids]));
    localStorage.setItem(SYNCED_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
