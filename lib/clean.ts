// Client-side kid-safe content filter (mirrors the server-side jf_is_clean guard).
// Not exhaustive — the server trigger is the real gate — but gives instant feedback.
const WORDS = [
  "fuck", "fuk", "fucker", "motherfucker", "shit", "bullshit", "bitch", "cunt",
  "asshole", "assholes", "bastard", "pussy", "whore", "slut", "faggot", "fag",
  "nigger", "nigga", "retard", "kike", "spic", "chink", "wetback", "tranny",
  "porn", "rape", "rapist", "jerkoff", "wanker", "twat", "bollocks", "prick",
  "douchebag", "dickhead", "jackass",
];
const RE = new RegExp(`\\b(${WORDS.join("|")})\\b`, "i");

export function hasProfanity(text: string): boolean {
  return RE.test(text || "");
}

export function tidy(text: string, max = 40): string {
  return (text || "").replace(/\s+/g, " ").trim().slice(0, max);
}
