/**
 * The Festival Light Hunt.
 *
 * Nine QR codes are hidden around Gage Park. Each one you find lights a lamp in
 * the app, pours real Light Points into Revive the City, and hands you a verse
 * to carry. Find all nine and you become a Light Bearer.
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
  /** Where the code is physically taped up. */
  where: string;
  emoji: string;
  points: number;
  verse: { text: string; ref: string };
  /** One line of encouragement shown the moment it's claimed. */
  word: string;
};

export const HUNT_POINTS_BONUS = 500;

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
  },
  {
    token: "2k5qrna",
    id: "ask-and-receive",
    name: "Ask and Receive",
    where: "Prayer Tent",
    emoji: "🙏",
    points: 150,
    verse: { text: "Ask and it will be given to you; seek and you will find.", ref: "Matthew 7:7" },
    word: "You're standing beside people who would pray for you right now. You only have to ask.",
  },
  {
    token: "3cr884v",
    id: "good-work",
    name: "Whole-Hearted Work",
    where: "Vendor Village",
    emoji: "🛠️",
    points: 150,
    verse: { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23" },
    word: "Every stall here is somebody's Monday offered to God. Yours counts too.",
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
  },
  {
    token: "rtcv5m2",
    id: "serve-one-another",
    name: "Serve One Another",
    where: "Volunteer HQ",
    emoji: "🤝",
    points: 150,
    verse: { text: "Serve one another humbly in love.", ref: "Galatians 5:13" },
    word: "Everything you've enjoyed today exists because someone served without being seen.",
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
  },
];

export const stationByToken = (token: string) => STATIONS.find((s) => s.token === token);

export const TOTAL_POINTS = STATIONS.reduce((n, s) => n + s.points, 0) + HUNT_POINTS_BONUS;

// ───────────────────────────── progress ─────────────────────────────

const KEY = "jf-hunt";
/** Station ids whose points have already been sent to Revive the City. */
const SYNCED_KEY = "jf-hunt-synced";

export type HuntProgress = {
  found: string[];
  /** ISO timestamp of completion, set once all nine are in. */
  completedAt?: string;
};

const EMPTY: HuntProgress = { found: [] };

export function getProgress(): HuntProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<HuntProgress>;
    const valid = new Set(STATIONS.map((s) => s.id));
    return {
      found: Array.isArray(parsed.found) ? parsed.found.filter((id) => valid.has(id)) : [],
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
};

/** Light a lamp. Idempotent: re-scanning the same code never double-counts. */
export function claim(token: string): ClaimResult | null {
  const station = stationByToken(token);
  if (!station) return null;

  const progress = getProgress();
  const isNew = !progress.found.includes(station.id);
  if (isNew) progress.found.push(station.id);

  const justCompleted =
    progress.found.length === STATIONS.length && !progress.completedAt;
  if (justCompleted) progress.completedAt = new Date().toISOString();

  write(progress);
  return {
    station,
    isNew,
    found: progress.found.length,
    total: STATIONS.length,
    justCompleted,
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
