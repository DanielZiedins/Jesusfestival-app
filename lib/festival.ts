import { SCHEDULE } from "@/lib/content";

/**
 * Festival-time helpers.
 *
 * Everything at Gage Park runs on Hamilton local time (EDT, UTC-4 in early
 * September), so slot times are anchored to a fixed offset rather than the
 * viewer's timezone. Someone opening the app from Vancouver should still see
 * "4:10 PM — Ant Lee Jr." exactly as it is printed on the run sheet.
 */

const DAY_ISO: Record<string, string> = { fri: "2026-09-04", sat: "2026-09-05" };
const OFFSET = "-04:00";

/** "4:10 PM" + "sat" → Date. Returns null for anything unparseable. */
export function slotTime(dayId: string, time: string): Date | null {
  const iso = DAY_ISO[dayId];
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!iso || !m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  const d = new Date(`${iso}T${String(h).padStart(2, "0")}:${m[2]}:00${OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * The clock the live views run on. `?now=2026-09-05T13:00:00-04:00` overrides it
 * so the team can rehearse festival-day mode before the day arrives. Purely a
 * display concern — nothing is written or sent based on it.
 */
export function clientNow(): Date {
  try {
    const raw = new URLSearchParams(window.location.search).get("now");
    if (raw) {
      const d = new Date(raw);
      if (!Number.isNaN(d.getTime())) return d;
    }
  } catch {
    /* ignore */
  }
  return new Date();
}

export type Phase = "before" | "fri" | "sat" | "after";

const FRI_START = new Date(`2026-09-04T17:00:00${OFFSET}`); // doors-open mood starts an hour early
const FRI_END = new Date(`2026-09-04T21:30:00${OFFSET}`);
const SAT_START = new Date(`2026-09-05T08:30:00${OFFSET}`);
const SAT_END = new Date(`2026-09-05T19:30:00${OFFSET}`);

export function festivalPhase(now: Date = new Date()): Phase {
  const t = now.getTime();
  if (t >= FRI_START.getTime() && t <= FRI_END.getTime()) return "fri";
  if (t >= SAT_START.getTime() && t <= SAT_END.getTime()) return "sat";
  if (t > SAT_END.getTime()) return "after";
  return "before";
}

export type Slot = { time: string; title: string; note: string; kind?: string; featured?: boolean; href?: string };

/**
 * Which slot is on stage and which is up next. A slot runs until the next one
 * starts. The final closing slot remains current until the live festival phase
 * ends, so visitors arriving at 7 PM still see the final prayer correctly.
 */
export function nowNext(dayId: string, items: Slot[], now: Date = new Date()): { nowIdx: number; nextIdx: number } {
  const t = now.getTime();
  let nowIdx = -1;
  let nextIdx = -1;
  for (let i = 0; i < items.length; i++) {
    const start = slotTime(dayId, items[i].time);
    if (!start) continue;
    if (start.getTime() <= t) {
      const after = i + 1 < items.length ? slotTime(dayId, items[i + 1].time) : null;
      if (!after || after.getTime() > t) nowIdx = i;
    } else if (nextIdx === -1) {
      nextIdx = i;
    }
  }
  return { nowIdx, nextIdx };
}

/** The day the app should open to: the live day during the festival, else Friday. */
export function defaultDayId(now: Date = new Date()): string {
  const p = festivalPhase(now);
  if (p === "fri" || p === "sat") return p;
  return SCHEDULE.days[0].id;
}

// ───────────────────────── My Lineup (local favourites) ─────────────────────────

const KEY = "jf-lineup";

// The September 1 run-of-show update moved every Saturday stage moment. Keep
// already-starred plans useful instead of silently losing a visitor's lineup.
const LINEUP_MIGRATIONS: Record<string, string> = {
  "sat|10:00 AM|Opening Session": "sat|11:00 AM|Stage Welcome & Prayer",
  "sat|10:00 AM|Terry Posthumus": "sat|11:15 AM|Terry Posthumus",
  "sat|11:35 AM|I Am Second / e3 Canada": "sat|12:30 PM|I Am Second — Tanya",
  "sat|11:50 AM|Open Heaven — Set 1": "sat|12:50 PM|Open Heaven — Set 1",
  "sat|12:20 PM|Joanna Adams": "sat|1:20 PM|Pastor Joanna Adams",
  "sat|12:40 PM|Shofar Blowing & Pastors on Stage": "sat|1:40 PM|Shofars & Pastors on Stage",
  "sat|1:00 PM|Open Heaven — Set 2": "sat|2:00 PM|Open Heaven — Set 2",
  "sat|1:20 PM|Testimony": "sat|2:20 PM|Rachel Shares",
  "sat|1:40 PM|ACTS Kingdom Sound Worship — Set 1": "sat|2:40 PM|ACTS Kingdom Sound Worship — Set 1",
  "sat|2:10 PM|Rachel's Testimony": "sat|3:10 PM|Rachel Shares",
  "sat|2:30 PM|ACTS Kingdom Sound Worship — Set 2": "sat|3:30 PM|ACTS Kingdom Sound Worship — Set 2",
  "sat|2:50 PM|Pastor Charles": "sat|3:50 PM|Pastor Charles",
  "sat|3:10 PM|Ant Lee Jr. — Set 1": "sat|4:10 PM|Ant Lee Jr. — Set 1",
  "sat|3:40 PM|Ant Lee Jr. — Testimony": "sat|4:40 PM|Ant Lee Jr. — Testimony",
  "sat|4:00 PM|Ant Lee Jr. — Set 2": "sat|5:00 PM|Ant Lee Jr. — Set 2",
  "sat|4:20 PM|Daughters of Scripture": "sat|5:20 PM|Daughters of Scripture",
  "sat|4:40 PM|Friday Night Prayer — Set 1": "sat|5:40 PM|Friday Night Prayer — Set 1",
  "sat|5:10 PM|Sons of Scripture": "sat|6:10 PM|Sons of Scripture",
  "sat|5:30 PM|Friday Night Prayer — Set 2": "sat|6:30 PM|Friday Night Prayer — Set 2",
  "sat|5:50 PM|Closing — Daniel & Katie": "sat|7:00 PM|Final Prayer — Daniel & Katie",
  "sat|6:00 PM|Event Concludes": "sat|7:00 PM|Final Prayer — Daniel & Katie",
};

/** Stable id for a slot — time + title survives reordering and re-renders. */
export const slotId = (dayId: string, s: Slot) => `${dayId}|${s.time}|${s.title}`;

export function getLineup(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    const previous = arr.filter((x): x is string => typeof x === "string");
    const migrated = [...new Set(previous.map((id) => LINEUP_MIGRATIONS[id] ?? id))];
    if (migrated.some((id, index) => id !== previous[index]) || migrated.length !== previous.length) {
      localStorage.setItem(KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return [];
  }
}

/**
 * Share one set. Native share sheet where it exists, clipboard everywhere else;
 * returns what happened so the caller can confirm it to the user.
 */
export async function shareSlot(dayLabel: string, dayDate: string, s: Slot): Promise<"shared" | "copied" | null> {
  const music = s.kind === "artist" ? "♪ " : "";
  const text = `${music}${s.title} — ${s.time}, ${dayLabel} ${dayDate} at Jesus Festival, Gage Park. Come with me! https://www.jesusfestival.app/?go=schedule`;
  try {
    if (navigator.share) {
      await navigator.share({ text, title: `${s.title} · Jesus Festival` });
      return "shared";
    }
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    // A cancelled share sheet lands here too — stay quiet rather than cry error.
    return null;
  }
}

/**
 * Export the starred sets as an .ics file — one VEVENT per set, each with a
 * 15-minute-before alarm. A set runs until the next slot on its day starts
 * (30 min for the final slot). Returns how many events were written.
 */
export function exportLineupIcs(days: { id: string; label: string; items: Slot[] }[]): number {
  const ids = new Set(getLineup());
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const events: string[] = [];

  for (const day of days) {
    day.items.forEach((s, i) => {
      if (!ids.has(slotId(day.id, s))) return;
      const start = slotTime(day.id, s.time);
      if (!start) return;
      // Skip past anything sharing this start time — two slots can legitimately
      // begin together, and taking the
      // very next item would end the event the instant it began.
      let nextStart: Date | null = null;
      for (let j = i + 1; j < day.items.length; j++) {
        const t = slotTime(day.id, day.items[j].time);
        if (t && t.getTime() > start.getTime()) {
          nextStart = t;
          break;
        }
      }
      const end = nextStart ?? new Date(start.getTime() + 30 * 60000);
      // The title belongs in the UID. Keyed on time alone, two slots at the
      // same minute produce the same UID and a calendar treats the second as an
      // edit of the first — one of them just disappears.
      const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
      const uid = `jf2026-${day.id}-${s.time.replace(/[^0-9]/g, "")}-${slug}@jesusfestival.app`;
      const title = s.title.replace(/[,;\\]/g, " ");
      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          "DTSTAMP:20260801T120000Z",
          `DTSTART:${fmt(start)}`,
          `DTEND:${fmt(end)}`,
          `SUMMARY:${s.kind === "artist" ? "♪ " : ""}${title} — Jesus Festival`,
          "LOCATION:Gage Park\\, 1000 Main St E\\, Hamilton\\, ON",
          `DESCRIPTION:${s.note.replace(/[,;\\]/g, " ")} · https://www.jesusfestival.app`,
          "BEGIN:VALARM",
          "ACTION:DISPLAY",
          `DESCRIPTION:${title} starts in 15 minutes at Gage Park`,
          "TRIGGER:-PT15M",
          "END:VALARM",
          "END:VEVENT",
        ].join("\r\n"),
      );
    });
  }
  if (!events.length) return 0;

  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Jesus Festival//My Lineup 2026//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
  try {
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-jesus-festival-lineup.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch {
    return 0;
  }
  return events.length;
}

export function toggleLineup(id: string): string[] {
  const cur = getLineup();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  return saveLineup(next);
}

function saveLineup(next: string[]): string[] {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("jf-lineup-change", { detail: next }));
  } catch {
    /* private mode — favourites just won't persist */
  }
  return next;
}

/** Add several recommendations without removing anything already starred. */
export function addToLineup(ids: string[]): string[] {
  const next = [...new Set([...getLineup(), ...ids])];
  return saveLineup(next);
}
