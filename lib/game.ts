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
  { id: "joy", name: "Joy", emoji: "😊", color: "text-gold-400", blurb: "Gladness that comes from God.", mission: "Tell someone one thing that gives you joy.", miniGame: "rhythm", verse: { text: "The joy of the Lord is your strength.", ref: "Nehemiah 8:10" } },
  { id: "peace", name: "Peace", emoji: "🕊️", color: "text-sky-300", blurb: "Calm and trust in God.", mission: "Take one quiet minute to pray.", miniGame: "river", verse: { text: "Peace I leave with you; my peace I give you.", ref: "John 14:27" } },
  { id: "patience", name: "Patience", emoji: "⏳", color: "text-amber-300", blurb: "Waiting with a good heart.", mission: "Let someone else go first.", miniGame: "plant", verse: { text: "Be patient with everyone.", ref: "1 Thessalonians 5:14" } },
  { id: "kindness", name: "Kindness", emoji: "🤝", color: "text-emerald-300", blurb: "Doing good to others.", mission: "Do one unexpected act of kindness.", miniGame: "encourage", verse: { text: "Be kind and compassionate to one another.", ref: "Ephesians 4:32" } },
  { id: "goodness", name: "Goodness", emoji: "🌟", color: "text-yellow-300", blurb: "Choosing what is right.", mission: "Choose to do the right thing today.", miniGame: "light", verse: { text: "Do not be overcome by evil, but overcome evil with good.", ref: "Romans 12:21" } },
  { id: "faithfulness", name: "Faithfulness", emoji: "🛡️", color: "text-purple-300", blurb: "Keeping your word.", mission: "Complete something you promised to do.", miniGame: "build", verse: { text: "Let love and faithfulness never leave you.", ref: "Proverbs 3:3" } },
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
  // Compute from UTC calendar dates so DST never shifts the day boundary
  // (a local-epoch diff is an hour short all summer — including festival week).
  return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);
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

// ---------- Bible quizzes ----------
export type QuizQuestion = { q: string; options: string[]; answer: number };
export type Quiz = { id: string; level: string; emoji: string; title: string; blurb: string; points: number; questions: QuizQuestion[] };

export const QUIZZES: Quiz[] = [
  {
    id: "quiz-easy",
    level: "Easy",
    emoji: "🌱",
    title: "Bible Beginnings",
    blurb: "Perfect for kids & first-timers!",
    points: 100,
    questions: [
      { q: "Who built the ark?", options: ["Moses", "Noah", "David"], answer: 1 },
      { q: "Where was Jesus born?", options: ["Nazareth", "Jerusalem", "Bethlehem"], answer: 2 },
      { q: "What did David use to face Goliath?", options: ["A sword", "A sling and a stone", "A spear"], answer: 1 },
      { q: "Who was swallowed by a great fish?", options: ["Jonah", "Peter", "Paul"], answer: 0 },
      { q: "How many days did God create the world in (before resting)?", options: ["Six", "Ten", "Three"], answer: 0 },
    ],
  },
  {
    id: "quiz-medium",
    level: "Medium",
    emoji: "🌿",
    title: "Growing Deeper",
    blurb: "For everyone who knows the stories!",
    points: 150,
    questions: [
      { q: "How many disciples did Jesus choose?", options: ["Ten", "Twelve", "Seven"], answer: 1 },
      { q: "What was Jesus' first miracle?", options: ["Walking on water", "Feeding 5,000", "Turning water into wine"], answer: 2 },
      { q: "Who denied Jesus three times?", options: ["Judas", "Peter", "Thomas"], answer: 1 },
      { q: "Which book comes first in the New Testament?", options: ["Mark", "Genesis", "Matthew"], answer: 2 },
      { q: "What did Jesus feed 5,000 people with?", options: ["5 loaves & 2 fish", "Manna from heaven", "Figs & honey"], answer: 0 },
    ],
  },
  {
    id: "quiz-challenge",
    level: "Challenge",
    emoji: "🌳",
    title: "Kingdom Champion",
    blurb: "The big one — can you get all 5?",
    points: 200,
    questions: [
      { q: "On which road did Saul meet Jesus?", options: ["Road to Emmaus", "Road to Damascus", "Road to Jericho"], answer: 1 },
      { q: "How many fruits of the Spirit are listed in Galatians 5?", options: ["Seven", "Nine", "Twelve"], answer: 1 },
      { q: "Who climbed a sycamore tree to see Jesus?", options: ["Zacchaeus", "Nicodemus", "Matthew"], answer: 0 },
      { q: "What is the shortest verse in the Bible?", options: ["“Jesus wept.”", "“Rejoice always.”", "“Pray continually.”"], answer: 0 },
      { q: "Which sea did Jesus calm with “Peace, be still”?", options: ["Sea of Galilee", "Red Sea", "Dead Sea"], answer: 0 },
    ],
  },
];

// ---------- Mini-games ----------
export type MiniGame = { id: string; name: string; blurb: string; emoji: string; points: number };

export const MINI_GAMES: MiniGame[] = [
  { id: "light", name: "Light the City", emoji: "💡", blurb: "Tap the dark windows to bring the whole skyline to life.", points: 80 },
  { id: "plant", name: "Plant Hope", emoji: "🌱", blurb: "Tap the soil to plant trees and flowers across the park.", points: 80 },
  { id: "fruit", name: "Catch the Fruit", emoji: "🍎", blurb: "Catch the fruit of the Spirit — dodge the distractions!", points: 90 },
  { id: "rhythm", name: "Worship Rhythm", emoji: "🎵", blurb: "Tap the notes as they reach the glow — feel the beat of worship!", points: 90 },
  { id: "river", name: "River of Life", emoji: "💧", blurb: "Clear the rocks so bright water can flow through the city.", points: 80 },
  { id: "build", name: "Build the Church", emoji: "🏗️", blurb: "Stack the pieces in the right order and raise the cross!", points: 90 },
  { id: "encourage", name: "Encourage the Crowd", emoji: "💛", blurb: "Tap someone who looks discouraged and send them hope.", points: 80 },
  { id: "neighbor", name: "Help Your Neighbor", emoji: "🤲", blurb: "Choose the kind, helpful response in each situation.", points: 70 },
];

// ---------- Milestones ----------
export type Milestone = { pct: number; label: string; emoji: string; tease: string; verse?: { text: string; ref: string } };

export const MILESTONES: Milestone[] = [
  { pct: 10, label: "The first streetlights turn on", emoji: "💡", tease: "Warm light returns to the streets" },
  { pct: 25, label: "The parks become colorful", emoji: "🌷", tease: "Trees & flowers bloom everywhere" },
  { pct: 40, label: "The river begins to flow", emoji: "💧", tease: "Crystal-blue water runs through the city" },
  { pct: 55, label: "Homes & neighborhoods light up", emoji: "🏘️", tease: "Families appear, windows glow gold" },
  { pct: 70, label: "The churches begin to glow", emoji: "⛪", tease: "A rainbow rises over the church" },
  { pct: 85, label: "The festival stage comes alive", emoji: "🎪", tease: "Stage lights + music fill the park" },
  { pct: 100, label: "The whole city is revived!", emoji: "🎆", tease: "Fireworks, celebration & the cross shining bright", verse: { text: "Your kingdom come, your will be done, on earth as it is in heaven.", ref: "Matthew 6:10" } },
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

// Returns null on failure so callers can tell "unknown" apart from a real 0
// (a false 0 baseline would fire bogus milestone celebrations on the next act).
export async function fetchCityProgress(): Promise<CityProgress | null> {
  try {
    const { data, error } = await supabase
      .from("revive_city_progress")
      .select("total_light_points, missions_completed")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    const total = Number(data.total_light_points ?? 0);
    const missions = Number(data.missions_completed ?? 0);
    return { total, missions, pct: Math.min(100, Math.round((total / CITY_TARGET) * 100)) };
  } catch {
    return null;
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

/* ================= Community: daily mission, fruit meters, weekly boss, spotlight ================= */

export const DAILY_GOAL = 5000;
export const BOSS_GOAL = 3000;
export const BOSS_HIT = 4; // how much each Kingdom act pushes back the weekly challenge

// One shared mission for everyone, per day.
export const DAILY_GLOBAL = [
  { id: "invite", emoji: "💌", text: "Invite one friend to Jesus Festival", reward: "Sunrise Over Hamilton", fruit: "love" },
  { id: "pray", emoji: "🙏", text: "Pray for someone by name", reward: "Glowing Church Bells", fruit: "peace" },
  { id: "scripture", emoji: "📖", text: "Read one chapter of Scripture", reward: "Streets of Light", fruit: "faithfulness" },
  { id: "encourage", emoji: "💛", text: "Encourage someone today", reward: "Gardens in Bloom", fruit: "love" },
  { id: "testimony", emoji: "🎤", text: "Share one thing God has done for you", reward: "Fireworks Over the Bay", fruit: "joy" },
  { id: "serve", emoji: "🤝", text: "Help someone in need", reward: "The River Runs Blue", fruit: "kindness" },
  { id: "kind", emoji: "✨", text: "Do a random act of kindness", reward: "Blossoming City Parks", fruit: "kindness" },
  { id: "city", emoji: "🏙️", text: "Pray for the city of Hamilton", reward: "Skyline Ablaze with Light", fruit: "peace" },
  { id: "worship", emoji: "🎶", text: "Spend a few minutes in worship", reward: "Worship Fills the Streets", fruit: "joy" },
  { id: "forgive", emoji: "🕊️", text: "Forgive someone and let it go", reward: "Gentle Morning Mist", fruit: "gentleness" },
];

export function dailyMission(d = new Date()) {
  return DAILY_GLOBAL[dayOfYear(d) % DAILY_GLOBAL.length];
}

// A weekly symbolic challenge the whole community overcomes (never scary imagery).
export const WEEKLY_BOSSES = [
  { id: "fear", name: "Fear", emoji: "🌫️", defeatedBy: "Prayer & courage", verse: { text: "God gave us a spirit not of fear, but of power, love and self-control.", ref: "2 Timothy 1:7" } },
  { id: "division", name: "Division", emoji: "🧩", defeatedBy: "Unity & love", verse: { text: "How good and pleasant it is when God's people live together in unity!", ref: "Psalm 133:1" } },
  { id: "loneliness", name: "Loneliness", emoji: "🚪", defeatedBy: "Welcoming & inviting", verse: { text: "God sets the lonely in families.", ref: "Psalm 68:6" } },
  { id: "hopelessness", name: "Hopelessness", emoji: "🌥️", defeatedBy: "Acts of love & hope", verse: { text: "Arise, shine, for your light has come.", ref: "Isaiah 60:1" } },
  { id: "pride", name: "Pride", emoji: "⛰️", defeatedBy: "Humility & service", verse: { text: "Act justly, love mercy, and walk humbly with your God.", ref: "Micah 6:8" } },
  { id: "bitterness", name: "Bitterness", emoji: "💧", defeatedBy: "Forgiveness", verse: { text: "Be kind and compassionate, forgiving each other.", ref: "Ephesians 4:32" } },
  { id: "apathy", name: "Apathy", emoji: "😴", defeatedBy: "Showing up & serving", verse: { text: "Let your light shine before others.", ref: "Matthew 5:16" } },
  { id: "discouragement", name: "Discouragement", emoji: "🌧️", defeatedBy: "Encouragement", verse: { text: "Be strong and courageous. Do not be afraid.", ref: "Joshua 1:9" } },
];

export function weeklyBoss(d = new Date()) {
  return WEEKLY_BOSSES[isoWeekNumber(d) % WEEKLY_BOSSES.length];
}

// ----- date/week keys (match Postgres current_date & IYYY-"W"IW) -----
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isoWeekParts(d = new Date()): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // Thursday of this week
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const ftDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - ftDayNum + 3);
  const week = 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return { year: date.getUTCFullYear(), week };
}
export function isoWeekNumber(d = new Date()): number {
  return isoWeekParts(d).week;
}
export function isoWeekKey(d = new Date()): string {
  const { year, week } = isoWeekParts(d);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

// Captain Goodness community level (levels up as the whole community completes missions).
export function captainLevel(missions: number): { level: number; pct: number; toNext: number } {
  const per = 25;
  const level = Math.floor(missions / per) + 1;
  const into = missions % per;
  return { level, pct: Math.round((into / per) * 100), toNext: per - into };
}

// Gentle haptic feedback (no-op where unsupported).
export function haptic(ms: number | number[] = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms as number);
  } catch {
    /* ignore */
  }
}

// Personal daily streak (encourages returning each day).
export function getStreak(): number {
  try {
    const s = Number(localStorage.getItem("jf-streak") || "0");
    const last = localStorage.getItem("jf-streak-date");
    if (!last) return 0;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (last === todayKey() || last === todayKey(y)) return s;
    return 0;
  } catch {
    return 0;
  }
}

export function recordStreak(): number {
  try {
    const today = todayKey();
    const last = localStorage.getItem("jf-streak-date");
    if (last === today) return Number(localStorage.getItem("jf-streak") || "1");
    const y = new Date();
    y.setDate(y.getDate() - 1);
    let streak = Number(localStorage.getItem("jf-streak") || "0");
    streak = last === todayKey(y) ? streak + 1 : 1;
    localStorage.setItem("jf-streak", String(streak));
    localStorage.setItem("jf-streak-date", today);
    return streak;
  } catch {
    return 1;
  }
}

export type FruitMeters = Record<string, number>;
export function fruitLevel(count: number): { level: number; pct: number } {
  const per = 500;
  return { level: Math.floor(count / per) + 1, pct: Math.round(((count % per) / per) * 100) };
}

// Which fruit a mission category feeds.
export const CATEGORY_FRUIT: Record<string, string> = {
  Prayer: "peace",
  Kindness: "kindness",
  Church: "love",
  Faith: "faithfulness",
};

export type Spotlight = { id: string; name: string | null; church: string | null; action: string; created_at: string };

export async function fetchDaily(): Promise<number> {
  try {
    const { data } = await supabase.from("revive_daily").select("count").eq("day", todayKey()).maybeSingle();
    return Number(data?.count ?? 0);
  } catch {
    return 0;
  }
}

export async function doDaily(): Promise<number | null> {
  try {
    const { data } = await supabase.rpc("revive_do_daily", { p_day: todayKey() });
    return data == null ? null : Number(data);
  } catch {
    return null;
  }
}

export async function fetchFruitMeters(): Promise<FruitMeters> {
  try {
    const { data } = await supabase.from("revive_fruit").select("fruit_id, count");
    const out: FruitMeters = {};
    (data ?? []).forEach((r: { fruit_id: string; count: number }) => (out[r.fruit_id] = Number(r.count)));
    return out;
  } catch {
    return {};
  }
}

export async function fetchBoss(): Promise<number> {
  try {
    const { data } = await supabase.from("revive_boss").select("progress").eq("week", isoWeekKey()).maybeSingle();
    return Number(data?.progress ?? 0);
  } catch {
    return 0;
  }
}

export async function fetchSpotlight(): Promise<Spotlight[]> {
  try {
    const { data } = await supabase.from("revive_spotlight").select("id, name, church, action, created_at").order("created_at", { ascending: false }).limit(40);
    return (data as Spotlight[]) ?? [];
  } catch {
    return [];
  }
}

export async function addSpotlight(name: string | null, church: string | null, action: string): Promise<void> {
  try {
    await supabase.rpc("revive_add_spotlight", { p_name: name, p_church: church, p_action: action });
  } catch {
    /* ignore */
  }
}

/* ---------- Church Crews: rally your congregation with a code ---------- */
export type Crew = { code: string; church: string; members: number; acts: number };

export function myCrew(): { code: string; church: string } | null {
  try {
    const code = localStorage.getItem("jf-crew-code");
    const church = localStorage.getItem("jf-crew-church");
    return code && church ? { code, church } : null;
  } catch {
    return null;
  }
}

function saveCrew(code: string, church: string) {
  try {
    localStorage.setItem("jf-crew-code", code);
    localStorage.setItem("jf-crew-church", church);
  } catch {
    /* ignore */
  }
}

export function leaveCrew() {
  try {
    localStorage.removeItem("jf-crew-code");
    localStorage.removeItem("jf-crew-church");
  } catch {
    /* ignore */
  }
}

export async function crewCreate(church: string): Promise<{ ok: boolean; crew?: Crew; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("crew_create", { p_church: church });
    if (error || !data?.ok) return { ok: false, error: data?.error || "Couldn't create the crew — try again." };
    saveCrew(data.code, data.church);
    return { ok: true, crew: { code: data.code, church: data.church, members: 1, acts: 0 } };
  } catch {
    return { ok: false, error: "Couldn't create the crew — check your connection." };
  }
}

export async function crewJoin(code: string): Promise<{ ok: boolean; crew?: Crew; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("crew_join", { p_code: code });
    if (error || !data?.ok) return { ok: false, error: data?.error || "Code not found." };
    saveCrew(data.code, data.church);
    return { ok: true, crew: { code: data.code, church: data.church, members: Number(data.members), acts: Number(data.acts) } };
  } catch {
    return { ok: false, error: "Couldn't join — check your connection." };
  }
}

export async function crewGet(code: string): Promise<Crew | null> {
  try {
    const { data } = await supabase.rpc("crew_get", { p_code: code });
    if (!data?.ok) return null;
    return { code: data.code, church: data.church, members: Number(data.members), acts: Number(data.acts) };
  } catch {
    return null;
  }
}

export async function crewsSample(): Promise<Crew[]> {
  try {
    const { data } = await supabase.rpc("crews_sample");
    return (data ?? []).map((r: { church: string; members: number; acts: number }) => ({ code: "", church: r.church, members: Number(r.members), acts: Number(r.acts) }));
  } catch {
    return [];
  }
}

// One call: adds to the city + a fruit + this week's boss (+ your crew). Returns new totals.
export async function contributeCommunity(
  points: number,
  missions: number,
  fruit: string | null
): Promise<{ city: CityProgress; boss: number } | null> {
  try {
    const { data } = await supabase.rpc("revive_contribute", {
      p_points: points,
      p_missions: missions,
      p_fruit: fruit,
      p_week: isoWeekKey(),
      p_boss: BOSS_HIT,
      p_crew: myCrew()?.code ?? null,
    });
    if (!data) return null;
    const total = Number(data.total ?? 0);
    return {
      city: { total, missions: Number(data.missions ?? 0), pct: Math.min(100, Math.round((total / CITY_TARGET) * 100)) },
      boss: Number(data.boss ?? 0),
    };
  } catch {
    return null;
  }
}
