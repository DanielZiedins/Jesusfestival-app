"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowRight, CalendarIcon, Share } from "@/components/icons";
import { SCHEDULE, SITE } from "@/lib/content";
import { addToLineup, getLineup, slotId, type Slot } from "@/lib/festival";

const STORAGE_KEY = "jf-moment-match-v1";
const SHARE_VERSION = "1";

type Audience = "first" | "family" | "youth" | "church";
type Focus = "worship" | "music" | "stories" | "variety";
type Availability = "both" | "friday" | "saturday" | "afternoon";
type Match = { audience: Audience; focus: Focus; availability: Availability };
type Option<T extends string> = { id: T; emoji: string; label: string; note: string };
type Day = (typeof SCHEDULE.days)[number];
type Moment = { day: Day; slot: Slot; id: string; minutes: number; score: number };

const DEFAULT_MATCH: Match = { audience: "first", focus: "variety", availability: "both" };

const AUDIENCES: Option<Audience>[] = [
  { id: "first", emoji: "👋", label: "First time", note: "A welcoming sampler" },
  { id: "family", emoji: "🎈", label: "With family", note: "Joyful, earlier moments" },
  { id: "youth", emoji: "⚡", label: "Youth crew", note: "Music, purpose and energy" },
  { id: "church", emoji: "⛪", label: "Church crew", note: "Worship and citywide unity" },
];

const FOCUSES: Option<Focus>[] = [
  { id: "worship", emoji: "🙌", label: "Worship", note: "Extended worship sets" },
  { id: "music", emoji: "🎤", label: "Live music", note: "Worship and Christian hip-hop" },
  { id: "stories", emoji: "💬", label: "Stories & faith", note: "Testimonies and speakers" },
  { id: "variety", emoji: "✨", label: "Best variety", note: "A little of everything" },
];

const AVAILABILITY: Option<Availability>[] = [
  { id: "both", emoji: "🌟", label: "Both days", note: "The full weekend" },
  { id: "friday", emoji: "🌙", label: "Friday night", note: "6:00–9:00 PM" },
  { id: "saturday", emoji: "☀️", label: "Saturday", note: "10:00 AM–6:00 PM" },
  { id: "afternoon", emoji: "🔥", label: "Saturday afternoon", note: "1:00–6:00 PM" },
];

const AUDIENCE_LABEL: Record<Audience, string> = {
  first: "first-time visit",
  family: "family day",
  youth: "youth crew",
  church: "church crew",
};

const FOCUS_LABEL: Record<Focus, string> = {
  worship: "worship",
  music: "live music",
  stories: "stories and faith",
  variety: "best variety",
};

const TIME_LABEL: Record<Availability, string> = {
  both: "both festival days",
  friday: "Friday night",
  saturday: "Saturday",
  afternoon: "Saturday afternoon",
};

function parseMinutes(time: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

function optionHas<T extends string>(value: unknown, options: Option<T>[]): value is T {
  return typeof value === "string" && options.some((option) => option.id === value);
}

function isMatch(value: unknown): value is Match {
  if (!value || typeof value !== "object") return false;
  const match = value as Partial<Match>;
  return optionHas(match.audience, AUDIENCES) && optionHas(match.focus, FOCUSES) && optionHas(match.availability, AVAILABILITY);
}

function parseSharedMatch(search: string): Match | null {
  const params = new URLSearchParams(search);
  const audience = params.get("with");
  const focus = params.get("focus");
  const availability = params.get("time");
  if (
    params.get("match") !== SHARE_VERSION ||
    !optionHas(audience, AUDIENCES) ||
    !optionHas(focus, FOCUSES) ||
    !optionHas(availability, AVAILABILITY)
  ) return null;
  return { audience, focus, availability };
}

function scoreSlot(day: Day, slot: Slot, audience: Audience, focus: Focus) {
  const text = `${slot.title} ${slot.note}`.toLowerCase();
  const artist = slot.kind === "artist";
  const speaker = slot.kind === "speaker";
  const worship = /worship|bethel|open heaven|acts kingdom|friday night prayer/.test(text);
  const testimony = /testimony|i am second|speaker|pastor|daughters|sons/.test(text);
  const antLee = /ant lee/.test(text);
  let score = 1;

  if (focus === "worship") score += worship ? 15 : artist ? 4 : 0;
  if (focus === "music") score += artist ? 12 : 0;
  if (focus === "music" && antLee) score += 5;
  if (focus === "stories") score += speaker ? 14 : testimony ? 8 : 0;
  if (focus === "variety") score += artist ? 7 : speaker ? 6 : 3;

  if (audience === "family") {
    if (day.id === "sat") score += 5;
    if (/opening|open heaven|ant lee|closing/.test(text)) score += 4;
    if (parseMinutes(slot.time) >= 17 * 60) score -= 2;
  }
  if (audience === "youth") {
    if (antLee) score += 10;
    if (testimony) score += 4;
    if (artist) score += 2;
  }
  if (audience === "church") {
    if (worship) score += 6;
    if (/pastor|unity|shofar/.test(text)) score += 9;
  }
  if (audience === "first") {
    if (/opening|bethel|open heaven|i am second|ant lee|closing/.test(text)) score += 5;
    if (artist) score += 2;
  }

  if (/come early|event concludes/.test(text)) score -= 7;
  return score;
}

function performerKey(slot: Slot) {
  return slot.title
    .toLowerCase()
    .replace(/—.*$/, "")
    .replace(/\bset\s*\d+\b/g, "")
    .replace(/\btestimony\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function recommend(match: Match): Moment[] {
  const candidates: Moment[] = [];
  for (const day of SCHEDULE.days) {
    for (const slot of day.items as Slot[]) {
      const minutes = parseMinutes(slot.time);
      const allowed =
        match.availability === "both" ||
        (match.availability === "friday" && day.id === "fri") ||
        (match.availability === "saturday" && day.id === "sat") ||
        (match.availability === "afternoon" && day.id === "sat" && minutes >= 13 * 60);
      if (!allowed) continue;
      candidates.push({ day, slot, id: slotId(day.id, slot), minutes, score: scoreSlot(day, slot, match.audience, match.focus) });
    }
  }

  candidates.sort((a, b) => b.score - a.score || a.minutes - b.minutes);
  const target = match.availability === "friday" ? 2 : 4;
  const selected: Moment[] = [];
  const acts = new Set<string>();
  for (const moment of candidates) {
    const key = performerKey(moment.slot);
    if (acts.has(key) && candidates.length > target) continue;
    selected.push(moment);
    acts.add(key);
    if (selected.length === target) break;
  }
  for (const moment of candidates) {
    if (selected.length === target) break;
    if (!selected.some((item) => item.id === moment.id)) selected.push(moment);
  }
  return selected.sort((a, b) => {
    if (a.day.id !== b.day.id) return a.day.id === "fri" ? -1 : 1;
    return a.minutes - b.minutes;
  });
}

function reasonFor(moment: Moment, focus: Focus) {
  const text = `${moment.slot.title} ${moment.slot.note}`.toLowerCase();
  if (/come early/.test(text)) return "The practical arrival window: choose your lawn spot and settle in before Friday worship begins.";
  if (/event concludes/.test(text)) return "The published finish time, useful for planning rides, transit and the trip home.";
  if (/bethel/.test(text)) return "The centerpiece of Friday's focused worship night under the open sky.";
  if (/open heaven/.test(text)) return "A returning Canadian worship ministry and a strong early Saturday anchor.";
  if (/acts kingdom/.test(text)) return "Hamilton-rooted prophetic worship in the heart of the afternoon.";
  if (/ant lee/.test(text) && /testimony/.test(text)) return "A personal story placed between two energetic Christian hip-hop sets.";
  if (/ant lee/.test(text)) return "Christian hip-hop, purpose and high-energy live performance for every generation.";
  if (/friday night prayer/.test(text)) return "Late-afternoon worship and prayer as Saturday moves toward its close.";
  if (/pastors|shofar|unity/.test(text)) return "A visible citywide-unity moment with pastors gathered on stage.";
  if (/i am second/.test(text)) return "A concise story-centered moment about faith, identity and the Gospel.";
  if (/testimony|speaker|pastor|daughters|sons/.test(text)) return "A spoken moment that adds story, meaning and breathing room between sets.";
  if (/opening/.test(text)) return "The clearest way to begin the day with the welcome, prayer and full context.";
  if (/closing/.test(text)) return "A shared final prayer and send-off before the festival concludes.";
  return focus === "stories" ? "A strong spoken-word match for the kind of festival experience you chose." : "A strong match for the festival experience you chose.";
}

function recordFinder(name: string, properties: Record<string, string | number> = {}) {
  try {
    track(name, { festival: "jesus-festival-hamilton-2026", ...properties });
  } catch {
    // Recommendations remain fully functional without analytics.
  }
}

export default function FestivalMomentFinder() {
  const [match, setMatch] = useState<Match>(DEFAULT_MATCH);
  const [ready, setReady] = useState(false);
  const [shared, setShared] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let next = DEFAULT_MATCH;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as unknown;
      if (isMatch(stored)) next = stored;
    } catch {
      // A stale or unavailable local store should never block the match.
    }
    const fromLink = parseSharedMatch(window.location.search);
    if (fromLink) {
      next = fromLink;
      setShared(true);
    }
    setMatch(next);
    setSavedIds(getLineup());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    } catch {
      // The match still works for this visit.
    }
  }, [match, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const moments = useMemo(() => recommend(match), [match]);
  const matchUrl = useMemo(() => {
    const params = new URLSearchParams({
      match: SHARE_VERSION,
      with: match.audience,
      focus: match.focus,
      time: match.availability,
    });
    return `${SITE.url}/find-your-moments?${params.toString()}`;
  }, [match]);
  const matchTitle = `${FOCUS_LABEL[match.focus]} for your ${AUDIENCE_LABEL[match.audience]}`;
  const allSaved = moments.every((moment) => savedIds.includes(moment.id));

  const update = <K extends keyof Match>(key: K, value: Match[K]) => {
    setMatch((current) => ({ ...current, [key]: value }));
    setNotice(null);
    recordFinder("festival_moment_match_updated", { choice: key, value });
  };

  const saveMoments = () => {
    const before = new Set(getLineup());
    const next = addToLineup(moments.map((moment) => moment.id));
    const added = moments.filter((moment) => !before.has(moment.id)).length;
    setSavedIds(next);
    setNotice(added ? `${added} moment${added === 1 ? "" : "s"} added to My Lineup ⭐` : "These moments are already in My Lineup ⭐");
    recordFinder("festival_moment_match_saved", { added, audience: match.audience, focus: match.focus });
  };

  const shareMatch = async () => {
    const text = [
      `My Jesus Festival match: ${matchTitle}`,
      ...moments.map((moment) => `${moment.day.label} ${moment.slot.time} — ${moment.slot.title}`),
    ].join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Jesus Festival moments", text, url: matchUrl });
        setNotice("Your festival match is ready to share ✨");
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${matchUrl}`);
        setNotice("Match copied—paste it to your crew 💛");
      }
      recordFinder("festival_moment_match_shared", { audience: match.audience, focus: match.focus });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Sharing is unavailable right now. Your match is still saved here.");
    }
  };

  return (
    <section id="moment-finder" aria-labelledby="moment-finder-heading" className="scroll-mt-6 overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-br from-purple-950/80 via-navy-900 to-gold/10 shadow-card">
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-7 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-gold/35 bg-gold/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-300">30-second match</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-purple-200">Confirmed 2026 schedule</span>
          </div>
          <h2 id="moment-finder-heading" className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Find the moments made for you</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/70">Three quick choices turn the full run of show into a personal festival shortlist. No account, no guessing and no data sent away.</p>
          {shared && <p role="status" className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-[12.5px] font-bold text-emerald-100">✓ A shared festival match is open. Make it yours or save every moment in one tap.</p>}
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-8">
        <FinderOptions legend="1. Who are you coming with?" options={AUDIENCES} value={match.audience} disabled={!ready} onChange={(value) => update("audience", value)} />
        <FinderOptions legend="2. What do you want more of?" options={FOCUSES} value={match.focus} disabled={!ready} onChange={(value) => update("focus", value)} />
        <FinderOptions legend="3. When can you be there?" options={AVAILABILITY} value={match.availability} disabled={!ready} onChange={(value) => update("availability", value)} />

        <div className="rounded-3xl border border-gold/35 bg-gradient-to-br from-gold/12 via-white/[0.04] to-purple-500/[0.08] p-5 sm:p-7" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Your festival match</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold capitalize text-white sm:text-3xl">{matchTitle}</h3>
              <p className="mt-1 text-[12px] font-semibold text-purple-200">Best-fit moments across {TIME_LABEL[match.availability]}</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[10px] font-extrabold text-white/70">{moments.length} picks</span>
          </div>

          <ol className="mt-6 space-y-3">
            {moments.map((moment, index) => {
              const saved = savedIds.includes(moment.id);
              return (
                <li key={moment.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
                  <div className="flex gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 font-display text-xs font-extrabold text-navy-950">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-400">{moment.day.label} · {moment.slot.time}</p>
                        {saved && <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-extrabold text-emerald-200">★ Saved</span>}
                      </div>
                      <h4 className="mt-1 font-display text-lg font-extrabold text-white">{moment.slot.title}</h4>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">{reasonFor(moment, match.focus)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={saveMoments} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow">
              <span aria-hidden>{allSaved ? "✓" : "★"}</span> {allSaved ? "Saved in My Lineup" : "Add all to My Lineup"}
            </button>
            <button type="button" onClick={shareMatch} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-purple-300/30 bg-purple-400/10 px-4 py-3 text-sm font-bold text-purple-100"><Share width={16} height={16} /> Share this match</button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Link href="/schedule" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-sm font-bold text-white"><CalendarIcon width={15} height={15} /> Open My Lineup</Link>
            <Link href="/festival-weekend" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-sm font-bold text-white">Open weekend hub <ArrowRight width={15} height={15} /></Link>
          </div>
          <p className="mt-4 text-center text-[10.5px] leading-relaxed text-white/45">Recommendations and starred moments stay on this device. Stage times are approximate and may shift slightly during the day.</p>
          <p role="status" className="mt-2 min-h-5 text-center text-[12px] font-bold text-gold-300">{notice}</p>
        </div>
      </div>
    </section>
  );
}

function FinderOptions<T extends string>({ legend, options, value, disabled, onChange }: { legend: string; options: Option<T>[]; value: T; disabled: boolean; onChange: (value: T) => void }) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-extrabold text-white">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button key={option.id} type="button" aria-pressed={active} disabled={disabled} onClick={() => onChange(option.id)} className={`min-h-[78px] rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:opacity-60 ${active ? "border-gold/55 bg-gold/12 shadow-[0_0_24px_rgba(212,175,55,0.08)]" : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"}`}>
              <span className="flex items-center gap-2"><span className="text-lg" aria-hidden>{option.emoji}</span><span className={`text-[12.5px] font-extrabold ${active ? "text-gold-300" : "text-white"}`}>{option.label}</span></span>
              <span className="mt-1 block text-[10.5px] leading-snug text-white/60">{option.note}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
