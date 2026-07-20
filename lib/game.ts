// "Revive the City" — game data + logic for the Jesus Festival app.
// Personal progress is stored locally; shared community progress lives in Supabase.

import { supabase } from "./supabase";

export const BIBLE_TRANSLATION = "NIV";

// Total Light Points the whole community must reach to fully revive the city.
export const CITY_TARGET = 25000;

// ---------- Fruit of the Spirit (Galatians 5:22–23) ----------
export type Fruit = {
  id: string;
  name: string;
  emoji: string;
  color: string; // tailwind text color
  blurb: string;
  mission: string;
  miniGame: string; // mini-game id
  verse: { text: string; ref: string };
};

export const FRUITS: Fruit[] = [
  { id: "love", name: "Love", emoji: "❤️", color: "text-rose-300", blurb: "Choosing the good of others.", mission: "Show someone love through an encouraging word.", miniGame: "encourage", verse: { text: "Let all that you do be done in love.", ref: "1 Corinthians 16:14" } },
  { id: "joy", name: "Joy", emoji: "😊", color: "text-gold-400", blurb: "Gladness that comes from God.", mission: "Tell someone one thing that gives you joy.", miniGame: "fruit", verse: { text: "The joy of the Lord is your strength.", ref: "Nehemiah 8:10" } },
  { id: "peace", name: "Peace", emoji: "🕊️", color: "text-sky-300", blurb: "Calm and trust in God.", mission: "Take one quiet minute to pray.", miniGame: "plant", verse: { text: "Peace I leave with you; my peace I give you.", ref: "John 14:27" } },
  { id: "patience", name: "Patience", emoji: "⏳", color: "text-amber-300", blurb: "Waiting with a good heart.", mission: "Let someone else go first.", miniGame: "plant", verse: { text: "Be patient with everyone.", ref: "1 Thessalonians 5:14" } },
  { id: "kindness", name: "Kindness", emoji: "🤝", color: "text-emerald-300", blurb: "Doing good to others.", mission: "Do one unexpected act of kindness.", miniGame: "encourage", verse: { text: "Be kind and compassionate to one another.", ref: "Ephesians 4:32" } },
  { id: "goodness", name: "Goodness", emoji: "🌟", color: "text-yellow-300", blurb: "Choosing what is right.", mission: "Choose to do the right thing today.", miniGame: "light", verse: { text: "Do not be overcome by evil, but overcome evil with good.", ref: "Romans 12:21" } },
  { id: "faithfulness", name: "Faithfulness", emoji: "🛡️", color: "text-purple-300", blurb: "Keeping your word.", mission: "Complete something you promised to do.", miniGame: "light", verse: { text: "Let love and faithfulness never leave you.", ref: "Proverbs 3:3" } },
  { id: "gentleness", name: "Gentleness", emoji: "🌿", color: "text-teal-300", blurb: "Strength that is tender.", mission: "Speak gently to someone today.", miniGame: "encourage", verse: { text: "Let your gentleness be evident to all.", ref: "Philippians 4:5" } },
  { id: "selfcontrol", name: "Self-Control", emoji: "🧭", color: "text-indigo-300", blurb: "Pausing before reacting.", mission: "Pause before reacting when something frustrates you.", miniGame: "neighbor", verse: { text: "God gave us a spirit of power and love and self-control.", ref: "2 Timothy 1:7" } },
];

// ---------- Missions ----------
export type Mission = { id: string; category: "Prayer" | "Kindness" | "Church" | "Faith"; text: string; points: number };

export const MISSIONS: Mission[] = [
  // Prayer
  { id: "p1", category: "Prayer", text: "Pray for one friend", points: 60 },
  { id: "p2", category: "Prayer", text: "Pray for your family", points: 60 },
  { id: "p3", category: "Prayer", text: "Pray for your city", points: 70 },
  { id: "p4", category: "Prayer", text: "Pray for someone who is hurting", points: 70 },
  { id: "p5", category: "Prayer", text: "Thank God for three things", points: 50 },
  { id: "p6", category: "Prayer", text: "Pray for the churches in Hamilton", points: 70 },
  { id: "p7", category: "Prayer", text: "Pray for someone to know Jesus", points: 80 },
  // Kindness
  { id: "k1", category: "Kindness", text: "Encourage someone", points: 60 },
  { id: "k2", category: "Kindness", text: "Give someone a compliment", points: 50 },
  { id: "k3", category: "Kindness", text: "Help clean up", points: 60 },
  { id: "k4", category: "Kindness", text: "Thank a volunteer", points: 50 },
  { id: "k5", category: "Kindness", text: "Help your parent or a family member", points: 60 },
  { id: "k6", category: "Kindness", text: "Welcome someone who is alone", points: 80 },
  { id: "k7", category: "Kindness", text: "Do something kind without being asked", points: 70 },
  // Church
  { id: "c1", category: "Church", text: "Invite a friend to church", points: 90 },
  { id: "c2", category: "Church", text: "Learn the name of a local church", points: 50 },
  { id: "c3", category: "Church", text: "Meet someone new at Jesus Festival", points: 70 },
  { id: "c4", category: "Church", text: "Thank a pastor or church leader", points: 60 },
  { id: "c5", category: "Church", text: "Find out how you can volunteer", points: 60 },
  // Faith
  { id: "f1", category: "Faith", text: "Tell someone Jesus loves them", points: 90 },
  { id: "f2", category: "Faith", text: "Share your favorite Bible verse", points: 60 },
  { id: "f3", category: "Faith", text: "Invite someone to Jesus Festival", points: 90 },
  { id: "f4", category: "Faith", text: "Tell someone one thing God has done in your life", points: 80 },
  { id: "f5", category: "Faith", text: "Encourage someone to pray", points: 60 },
];

// Deterministic "3 missions for today" based on the day-of-year (no Math.random for SSR safety).
export function missionsForToday(seed = dayOfYear()): Mission[] {
  const out: Mission[] = [];
  const cats: Mission["category"][] = ["Prayer", "Kindness", "Church"];
  cats.forEach((cat, i) => {
    const pool = MISSIONS.filter((m) => m.category === cat);
    out.push(pool[(seed + i * 3) % pool.length]);
  });
  return out;
}

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

// ---------- Verse challenges ----------
export type VerseChallenge = {
  id: string;
  level: "Beginner" | "Intermediate";
  ref: string;
  points: number;
} & (
  | { type: "choice"; prompt: string; options: string[]; answer: string }
  | { type: "order"; words: string[] } // arrange in correct order
);

export const VERSE_CHALLENGES: VerseChallenge[] = [
  { id: "v1", level: "Beginner", type: "choice", ref: "John 8:12", points: 60, prompt: "Jesus said, “I am the ____ of the world.”", options: ["Light", "Road", "Mountain"], answer: "Light" },
  { id: "v2", level: "Beginner", type: "choice", ref: "Philippians 4:13", points: 60, prompt: "I can do all things through ____ who strengthens me.", options: ["Christ", "friends", "myself"], answer: "Christ" },
  { id: "v3", level: "Beginner", type: "choice", ref: "Joshua 1:9", points: 60, prompt: "Be strong and ____.", options: ["courageous", "quiet", "quick"], answer: "courageous" },
  { id: "v4", level: "Beginner", type: "choice", ref: "Matthew 5:14", points: 60, prompt: "You are the ____ of the world.", options: ["light", "salt", "hope"], answer: "light" },
  { id: "v5", level: "Intermediate", type: "order", ref: "Matthew 6:10", points: 90, words: ["Your", "kingdom", "come,", "your", "will", "be", "done"] },
  { id: "v6", level: "Intermediate", type: "order", ref: "Psalm 119:105", words: ["Your", "word", "is", "a", "lamp", "for", "my", "feet"], points: 90 },
  { id: "v7", level: "Intermediate", type: "order", ref: "Ephesians 4:32", words: ["Be", "kind", "and", "compassionate", "to", "one", "another"], points: 90 },
];

// ---------- Mini-games ----------
export type MiniGame = { id: string; name: string; blurb: string; emoji: string; points: number };

export const MINI_GAMES: MiniGame[] = [
  { id: "light", name: "Light the City", emoji: "💡", blurb: "Tap the dark windows to bring the whole skyline to life.", points: 80 },
  { id: "plant", name: "Plant Hope", emoji: "🌱", blurb: "Tap the soil to plant trees and flowers across the park.", points: 80 },
  { id: "fruit", name: "Catch the Fruit", emoji: "🍎", blurb: "Catch the fruit of the Spirit — dodge the distractions!", points: 90 },
  { id: "encourage", name: "Encourage the Crowd", emoji: "💛", blurb: "Tap someone who looks discouraged and send them hope.", points: 80 },
  { id: "neighbor", name: "Help Your Neighbor", emoji: "🤲", blurb: "Choose the kind, helpful response in each situation.", points: 70 },
];

// ---------- Milestones ----------
export type Milestone = { pct: number; label: string; verse?: { text: string; ref: string } };

export const MILESTONES: Milestone[] = [
  { pct: 10, label: "The first streetlights turn on" },
  { pct: 25, label: "The parks become colorful" },
  { pct: 40, label: "The river begins to flow" },
  { pct: 55, label: "Homes & neighborhoods light up" },
  { pct: 70, label: "The churches begin to glow" },
  { pct: 85, label: "The festival stage comes alive" },
  { pct: 100, label: "The whole city is revived!", verse: { text: "Your kingdom come, your will be done, on earth as it is in heaven.", ref: "Matthew 6:10" } },
];

// ---------- Personal state (localStorage) ----------
export type GameState = {
  points: number;
  missions: string[]; // completed mission ids
  badges: string[]; // fruit ids + verse/game badges
  fruit: string[]; // fruit ids whose mission/game completed
  verses: string[]; // verse challenge ids completed
  games: string[]; // mini-game ids played
};

const KEY = "revive-city-v1";
const EMPTY: GameState = { points: 0, missions: [], badges: [], fruit: [], verses: [], games: [] };

export function loadState(): GameState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveState(s: GameState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

// ---------- Shared community progress (Supabase) ----------
export type CityProgress = { total: number; missions: number; pct: number };

export async function fetchCityProgress(): Promise<CityProgress> {
  try {
    const { data } = await supabase
      .from("revive_city_progress")
      .select("total_light_points, missions_completed")
      .eq("id", 1)
      .single();
    const total = Number(data?.total_light_points ?? 0);
    const missions = Number(data?.missions_completed ?? 0);
    return { total, missions, pct: Math.min(100, Math.round((total / CITY_TARGET) * 100)) };
  } catch {
    return { total: 0, missions: 0, pct: 0 };
  }
}

// Adds to the shared community total. Returns the new progress (or null on failure).
export async function contributePoints(points: number, missions = 0): Promise<CityProgress | null> {
  try {
    const { data } = await supabase.rpc("add_light_points", { pts: points, missions });
    if (!data) return null;
    const row = Array.isArray(data) ? data[0] : data;
    const total = Number(row?.total_light_points ?? 0);
    const m = Number(row?.missions_completed ?? 0);
    return { total, missions: m, pct: Math.min(100, Math.round((total / CITY_TARGET) * 100)) };
  } catch {
    return null;
  }
}
