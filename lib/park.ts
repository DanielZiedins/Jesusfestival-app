/**
 * Gage Park — the orientation map behind the Festival Map screen.
 *
 * Coordinates are percentages of the drawn park (0–100, x → east, y → south),
 * not survey data. The permanent landmarks are placed the way the park is
 * actually laid out — Main Street East along the south edge, Lawrence Road along
 * the north, Gage Avenue along the west, the Gage Family Fountain on the formal
 * axis rising north from the Main Street entrance, the George R. Robinson
 * Bandshell at the head of that axis, the rose gardens and Tropical Greenhouse
 * through the middle, the lawn bowling and tennis clubs off Lawrence Road, and
 * the Children's Museum in the Gage Family Home on Main Street East.
 *
 * Festival zones are anchored to those landmarks and flagged `festival: true`
 * so the UI can say plainly that final placement is confirmed on the day. The
 * whole thing is inline SVG on purpose: it renders instantly and it still works
 * standing in the middle of the park with no signal at all.
 */

export type Pin = {
  id: string;
  name: string;
  note: string;
  emoji: string;
  x: number;
  y: number;
  /** A festival zone (approximate) rather than a permanent park landmark. */
  festival?: boolean;
  /** Grouping for the legend + filter rail. */
  group: "stage" | "family" | "food" | "care" | "access";
};

export const PARK_PINS: Pin[] = [
  // ── The festival footprint ──
  {
    id: "stage",
    name: "Main Stage",
    note: "The George R. Robinson Bandshell — worship, testimonies and the Gospel. Everything on the schedule happens here.",
    emoji: "🎤",
    x: 50,
    y: 33,
    group: "stage",
  },
  {
    id: "lawn",
    name: "The Great Lawn",
    note: "The open grass in front of the bandshell. This is where you set your chair or blanket down — it fills from the front, so come early.",
    emoji: "🪑",
    x: 50,
    y: 47,
    festival: true,
    group: "stage",
  },
  {
    id: "prayer",
    name: "Prayer Tent",
    note: "Someone is here to pray with you all day — for healing, for family, for whatever you're carrying. No appointment, no cost, no judgement.",
    emoji: "🙏",
    x: 33,
    y: 36,
    festival: true,
    group: "care",
  },
  {
    id: "baptism",
    name: "Baptisms",
    note: "New life celebrated publicly. Said yes to Jesus today? Come here — the team will walk you through it.",
    emoji: "💧",
    x: 68,
    y: 43,
    festival: true,
    group: "care",
  },
  {
    id: "food",
    name: "Food Trucks",
    note: "Meals, snacks, coffee and cold drinks along the main path. Bring cash as a backup — card machines and park signal don't always agree.",
    emoji: "🌮",
    x: 37,
    y: 66,
    festival: true,
    group: "food",
  },
  {
    id: "vendors",
    name: "Vendor Village",
    note: "Christian businesses, churches and ministries. Say hello — many of them are the reason this weekend is free.",
    emoji: "🛍️",
    x: 62,
    y: 60,
    festival: true,
    group: "food",
  },
  {
    id: "kids",
    name: "Kids Zone",
    note: "Bouncy castles, games and lawn activities beside the play structure. Wristband your little ones at the info tent first.",
    emoji: "🎈",
    x: 21,
    y: 57,
    festival: true,
    group: "family",
  },
  {
    id: "info",
    name: "Info & Lost Child Point",
    note: "Start here. Lost person, lost phone, lost child, questions, volunteers — this is the meeting point the whole team works from.",
    emoji: "ℹ️",
    x: 47,
    y: 74,
    festival: true,
    group: "care",
  },
  {
    id: "firstaid",
    name: "First Aid",
    note: "Trained first aid beside the info tent. In a real emergency call 911 first, then send someone here.",
    emoji: "⛑️",
    x: 55,
    y: 74,
    festival: true,
    group: "care",
  },

  // ── Permanent park landmarks — the things you navigate by ──
  {
    id: "fountain",
    name: "Gage Family Fountain",
    note: "The big fountain on the formal walk up from Main Street East. The easiest landmark in the park to say \"meet me at\".",
    emoji: "⛲",
    x: 50,
    y: 62,
    group: "access",
  },
  {
    id: "gardens",
    name: "Rose Gardens & Greenhouse",
    note: "The Memorial Rose Gardens and Tropical Greenhouse in the heart of the park — worth the walk, and shady.",
    emoji: "🌹",
    x: 66,
    y: 30,
    group: "access",
  },
  {
    id: "splash",
    name: "Spray Pad & Playground",
    note: "The city spray pad and play structure. Free, and a very good idea on a hot Saturday — bring a towel.",
    emoji: "💦",
    x: 27,
    y: 45,
    group: "family",
  },
  {
    id: "museum",
    name: "Children's Museum",
    note: "The Gage Family Home at 1072 Main St E, on the south edge of the park.",
    emoji: "🏛️",
    x: 70,
    y: 87,
    group: "family",
  },
  {
    id: "washrooms",
    name: "Washrooms",
    note: "The City lists washrooms near the bandshell, spray pad and baseball diamonds. Follow the final event-day signs; Friday evening access can differ from summer daytime hours.",
    emoji: "🚻",
    x: 39,
    y: 30,
    group: "access",
  },
  {
    id: "courts",
    name: "Tennis & Lawn Bowling",
    note: "Rosedale Tennis Club and Roselawn Lawn Bowling off Lawrence Road — club grounds, not festival space.",
    emoji: "🎾",
    x: 30,
    y: 15,
    group: "access",
  },
  {
    id: "fields",
    name: "Ball Diamonds",
    note: "The softball fields on the east side of the park.",
    emoji: "⚾",
    x: 79,
    y: 17,
    group: "access",
  },

  // ── Getting in ──
  {
    id: "entrance-main",
    name: "Main Entrance",
    note: "Gage Avenue at Main Street East — the formal entrance, with a paved fountain walk into the park. Confirm any essential event-day accessible drop-off or viewing detail before travelling.",
    emoji: "🚶",
    x: 25,
    y: 88,
    group: "access",
  },
  {
    id: "entrance-north",
    name: "Lawrence Road Entrance",
    note: "The quieter way in from the north side, closest to the bandshell.",
    emoji: "🚶",
    x: 55,
    y: 7,
    group: "access",
  },
  {
    id: "parking",
    name: "Parking",
    note: "The City lists 150 park spaces, and parking around Gage Park is limited. Main & Ottawa construction can add delays, so leave extra time or use HSR, rideshare, cycling, walking or carpooling.",
    emoji: "🅿️",
    x: 10,
    y: 68,
    group: "access",
  },
];

export const PIN_GROUPS: { id: Pin["group"]; label: string; emoji: string }[] = [
  { id: "stage", label: "Stage", emoji: "🎤" },
  { id: "care", label: "Help & prayer", emoji: "🙏" },
  { id: "food", label: "Food & vendors", emoji: "🌮" },
  { id: "family", label: "Family", emoji: "🎈" },
  { id: "access", label: "Getting around", emoji: "🧭" },
];

/** Real-world corners of the drawn park, used to place "you are here". */
export const PARK_BOUNDS = { north: 43.2452, south: 43.2381, west: -79.8177, east: -79.8079 };

/** lat/lng → map percentages. Returns null when the reading is outside the park. */
export function projectToPark(lat: number, lng: number): { x: number; y: number } | null {
  const x = ((lng - PARK_BOUNDS.west) / (PARK_BOUNDS.east - PARK_BOUNDS.west)) * 100;
  const y = ((PARK_BOUNDS.north - lat) / (PARK_BOUNDS.north - PARK_BOUNDS.south)) * 100;
  if (x < -6 || x > 106 || y < -6 || y > 106) return null;
  return { x: Math.max(1, Math.min(99, x)), y: Math.max(1, Math.min(99, y)) };
}

/** Map percentages → lat/lng, so a dropped pin can open in a real maps app. */
export function parkToLatLng(x: number, y: number): { lat: number; lng: number } {
  return {
    lat: PARK_BOUNDS.north - (y / 100) * (PARK_BOUNDS.north - PARK_BOUNDS.south),
    lng: PARK_BOUNDS.west + (x / 100) * (PARK_BOUNDS.east - PARK_BOUNDS.west),
  };
}

// ───────────────────────── "Meet me here" spot ─────────────────────────

const SPOT_KEY = "jf-spot";
export type Spot = { x: number; y: number; label?: string };

export function getSpot(): Spot | null {
  try {
    const raw = localStorage.getItem(SPOT_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (typeof s?.x === "number" && typeof s?.y === "number") return s;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveSpot(spot: Spot | null) {
  try {
    if (spot) localStorage.setItem(SPOT_KEY, JSON.stringify(spot));
    else localStorage.removeItem(SPOT_KEY);
  } catch {
    /* private mode — the pin just won't survive a reload */
  }
}

/** `#spot=48.2,51.9` — how a shared spot travels between two phones. */
export function encodeSpot(spot: Spot): string {
  return `spot=${spot.x.toFixed(1)},${spot.y.toFixed(1)}`;
}

export function readSpotFromHash(hash: string): Spot | null {
  const m = /spot=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(hash);
  if (!m) return null;
  const x = Number(m[1]);
  const y = Number(m[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) return null;
  return { x, y };
}

/** The nearest landmark to a point, so a shared pin reads as a place not a number. */
export function nearestLandmark(x: number, y: number): Pin {
  let best = PARK_PINS[0];
  let bestD = Infinity;
  for (const p of PARK_PINS) {
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}
