/**
 * New Life — the follow-up path for someone who says yes to Jesus.
 *
 * Deliberately local-first: no sign-up, no form, no network. Somebody standing
 * in Gage Park with their hands still shaking and one bar of signal should be
 * able to tap one button and immediately have somewhere to go next. Everything
 * lives in localStorage, so it works offline and nobody has to hand over an
 * email address at the most vulnerable moment of their life.
 *
 * Deliberately not gamified either — this never touches Light Points, badges or
 * the community meters. It isn't a mission.
 */

const KEY = "jf-newlife";

export type Standing = "new" | "returning" | "following";

export type NewLife = {
  /** ISO date (yyyy-mm-dd) they marked it — their spiritual birthday. */
  date: string;
  standing: Standing;
  /** Completed first-step ids. */
  steps: string[];
};

export const STEPS: {
  id: string;
  emoji: string;
  title: string;
  why: string;
  verse: string;
  ref: string;
  action: string;
  /** Either an external resource, or an in-app destination handled by the screen. */
  href?: string;
  go?: "prayer" | "share" | "map" | "discipleship";
}[] = [
  {
    id: "tell",
    emoji: "🗣️",
    title: "Tell one person",
    why: "Saying it out loud makes it real — and it takes the weight of secrecy off you. One person is enough. Start with whoever is easiest.",
    verse: "If you declare with your mouth, \"Jesus is Lord,\" and believe in your heart that God raised him from the dead, you will be saved.",
    ref: "Romans 10:9",
    action: "Send someone a message",
    go: "share",
  },
  {
    id: "read",
    emoji: "📖",
    title: "Meet Jesus in His own words",
    why: "Don't start at page one of the Bible. Start with the Gospel of John — it was written for exactly this moment. Ten minutes a day is plenty.",
    verse: "In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.",
    ref: "John 1:4–5",
    action: "Read John chapter 1",
    href: "https://www.bible.com/bible/111/JHN.1.NIV",
  },
  {
    id: "pray",
    emoji: "🙏",
    title: "Talk to God today",
    why: "Prayer isn't a performance and there are no special words. Tell Him what's actually going on. He already knows — He just wants to hear it from you.",
    verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    ref: "Philippians 4:6",
    action: "Post a prayer on the wall",
    go: "prayer",
  },
  {
    id: "baptism",
    emoji: "💧",
    title: "Get baptised",
    why: "Baptism is the public yes that follows the private one — going under the water with your old life and coming up with a new one. We celebrate baptisms right at the festival.",
    verse: "Repent and be baptised, every one of you, in the name of Jesus Christ for the forgiveness of your sins.",
    ref: "Acts 2:38",
    action: "Find the baptism area",
    go: "map",
  },
  {
    id: "church",
    emoji: "⛪",
    title: "Find your people",
    why: "Nobody grows alone. A church isn't a building you attend — it's a family who will notice when you're missing. Pick one and walk in this Sunday.",
    verse: "Let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.",
    ref: "Hebrews 10:24–25",
    action: "See churches near you",
    go: "discipleship",
  },
  {
    id: "reborn",
    emoji: "🕊️",
    title: "Understand what just changed",
    why: "You are not a slightly improved version of who you were this morning. Something actually died and something actually started. Here's what the Bible says happened.",
    verse: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    ref: "2 Corinthians 5:17",
    action: "Open IAmReborn.net",
    href: "https://www.iamreborn.net",
  },
  {
    id: "give",
    emoji: "💛",
    title: "Give it away",
    why: "The fastest way to keep what you've been given is to hand it to someone else. You don't need to know everything — you only need to tell what happened to you.",
    verse: "Go and make disciples of all nations… and surely I am with you always, to the very end of the age.",
    ref: "Matthew 28:19–20",
    action: "Map the people around you",
    href: "https://www.oikosmap.com",
  },
];

/** The prayer, in plain words. Nothing to sign up for, nothing to get right. */
export const PRAYER = [
  "Jesus, I believe you are who you said you are.",
  "I'm done trying to carry all of this on my own.",
  "Thank you for going to the cross for me, and for walking out of the grave.",
  "Forgive me. Take everything. I'm yours from here.",
  "Teach me how to follow you. Amen.",
];

export const GOSPEL = [
  {
    emoji: "💛",
    title: "God is not angry with you",
    text: "He made you on purpose and He has wanted you the whole time. Everything below only makes sense once that part is settled.",
  },
  {
    emoji: "🪨",
    title: "Something is broken",
    text: "Not just out there — in all of us. We've all gone our own way, and it costs us. That gap is real and we can't close it by trying harder.",
  },
  {
    emoji: "✝️",
    title: "Jesus closed it Himself",
    text: "He lived the life we couldn't, died the death we'd earned, and rose again three days later. The debt is settled. It was never yours to pay.",
  },
  {
    emoji: "🤲",
    title: "It's a gift, not a wage",
    text: "You don't clean yourself up first. You don't earn it. You receive it — and then He starts changing you from the inside.",
  },
  {
    emoji: "🕊️",
    title: "All that's left is yes",
    text: "Not a perfect prayer, not a big feeling. Just an honest yes. If you mean it, that's enough — and today can be the day.",
  },
];

export const QUESTIONS = [
  {
    q: "What if I'm not sure I believe it?",
    a: "Then you're in good company — several of the people closest to Jesus doubted right up to the end, and He never sent them away for it. Bring the doubt with you and start honestly: \"God, if you're real, show me.\" That's a prayer He answers.",
  },
  {
    q: "What about the things I've done?",
    a: "Every one of them was already on the cross before you got here. There is nothing in your history that Jesus hasn't already seen and already dealt with. Forgiveness isn't Him ignoring it — it's Him paying for it.",
  },
  {
    q: "Do I have to change first?",
    a: "No. You couldn't anyway — that's rather the point. You come as you are, and He does the changing. It happens from the inside out, usually slower than you'd like and deeper than you expected.",
  },
  {
    q: "What if I mess it up again?",
    a: "You will. So does everyone. Following Jesus isn't a clean record, it's a direction of travel — and when you fall over, you get up and keep walking with Him. He isn't shocked and He isn't leaving.",
  },
  {
    q: "Do I have to be religious now?",
    a: "This was never about religion. It's about knowing a person. Church, prayer and the Bible aren't hoops to jump through — they're how you spend time with the One who saved you.",
  },
];

// ───────────────────────── local state ─────────────────────────

export function getNewLife(): NewLife | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v?.date !== "string") return null;
    return {
      date: v.date,
      standing: v.standing === "following" || v.standing === "returning" ? v.standing : "new",
      steps: Array.isArray(v.steps) ? v.steps.filter((s: unknown) => typeof s === "string") : [],
    };
  } catch {
    return null;
  }
}

function save(v: NewLife): NewLife {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* private mode — the journey just won't survive a reload */
  }
  return v;
}

/** Local calendar date, not UTC — their spiritual birthday is where they stand. */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function markDecision(standing: Standing): NewLife {
  const existing = getNewLife();
  // Re-tapping never resets the date someone already treasures.
  if (existing) return save({ ...existing, standing });
  return save({ date: today(), standing, steps: [] });
}

export function toggleStep(id: string): NewLife | null {
  const cur = getNewLife();
  if (!cur) return null;
  const steps = cur.steps.includes(id) ? cur.steps.filter((s) => s !== id) : [...cur.steps, id];
  return save({ ...cur, steps });
}

export function clearNewLife() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Day 1 is the day itself. */
export function daysSince(date: string): number {
  const start = new Date(`${date}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 1;
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  return Math.max(1, Math.round((a - b) / 86_400_000) + 1);
}

export function prettyDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

/** Share their news — their words optional, no pressure to say anything clever. */
export async function shareTestimony(standing: Standing): Promise<"shared" | "copied" | null> {
  const text =
    standing === "following"
      ? "I'm all in with Jesus. If you've ever wondered what that's actually about, start here 💛 https://www.jesusfestival.app/i-said-yes"
      : "Something happened today — I said yes to Jesus. 🕊️ If you're curious what that means, this explains it better than I can. https://www.jesusfestival.app/i-said-yes";
  try {
    if (navigator.share) {
      await navigator.share({ text, title: "I said yes to Jesus" });
      return "shared";
    }
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return null;
  }
}
