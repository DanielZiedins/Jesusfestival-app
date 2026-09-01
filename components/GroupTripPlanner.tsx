"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowRight, CalendarIcon, MapPin, Share } from "@/components/icons";
import { SITE } from "@/lib/content";

const STORAGE_KEY = "jf-group-plan-v1";
const PLAN_VERSION = "1";

type GroupKind = "church" | "youth" | "family" | "friends";
type GroupSize = "2-5" | "6-12" | "13-25" | "26+";
type FestivalDay = "both" | "friday" | "saturday";
type TravelMode = "carpool" | "transit" | "separate";
type MeetingPoint = "fountain" | "bandshell" | "custom";
type CheckId = "headcount" | "travel" | "meeting" | "care" | "lineup" | "offline";

type GroupPlan = {
  kind: GroupKind;
  size: GroupSize;
  day: FestivalDay;
  travel: TravelMode;
  meeting: MeetingPoint;
  name: string;
  note: string;
  checks: Record<CheckId, boolean>;
};

type Option<T extends string> = { id: T; emoji: string; label: string; note: string };

const EMPTY_CHECKS: Record<CheckId, boolean> = {
  headcount: false,
  travel: false,
  meeting: false,
  care: false,
  lineup: false,
  offline: false,
};

const DEFAULT_PLAN: GroupPlan = {
  kind: "church",
  size: "6-12",
  day: "both",
  travel: "carpool",
  meeting: "fountain",
  name: "",
  note: "",
  checks: EMPTY_CHECKS,
};

const KINDS: Option<GroupKind>[] = [
  { id: "church", emoji: "⛪", label: "Church crew", note: "Bring your community" },
  { id: "youth", emoji: "⚡", label: "Youth group", note: "Lead with a clear plan" },
  { id: "family", emoji: "🎈", label: "Family", note: "Keep the day simple" },
  { id: "friends", emoji: "🫂", label: "Friends", note: "Meet, worship and explore" },
];

const SIZES: Option<GroupSize>[] = [
  { id: "2-5", emoji: "👋", label: "2–5 people", note: "One small crew" },
  { id: "6-12", emoji: "🙌", label: "6–12 people", note: "A few vehicles" },
  { id: "13-25", emoji: "✨", label: "13–25 people", note: "Assign clear roles" },
  { id: "26+", emoji: "🔥", label: "26+ people", note: "Confirm logistics early" },
];

const DAYS: Option<FestivalDay>[] = [
  { id: "both", emoji: "✨", label: "Both days", note: "Friday + Saturday" },
  { id: "friday", emoji: "🌙", label: "Friday", note: "6:00–9:00 PM" },
  { id: "saturday", emoji: "☀️", label: "Saturday", note: "10:00 AM–7:00 PM" },
];

const TRAVEL: Option<TravelMode>[] = [
  { id: "carpool", emoji: "🚗", label: "Carpool", note: "Fewer cars, one plan" },
  { id: "transit", emoji: "🚌", label: "HSR transit", note: "Check live trip times" },
  { id: "separate", emoji: "📍", label: "Arrive separately", note: "Meeting point is essential" },
];

const MEETING_POINTS: Option<MeetingPoint>[] = [
  { id: "fountain", emoji: "⛲", label: "Gage Family Fountain", note: "A permanent landmark" },
  { id: "bandshell", emoji: "🎵", label: "G.R. Robinson Bandshell", note: "Confirm one exact side" },
  { id: "custom", emoji: "📌", label: "Our own spot", note: "Describe it in the note" },
];

const CHECKS: Array<{ id: CheckId; title: string; note: string }> = [
  { id: "headcount", title: "Final headcount confirmed", note: "Know who is coming and who is the point person." },
  { id: "travel", title: "Travel plan sent", note: "Drivers, HSR riders and separate arrivals know the plan." },
  { id: "meeting", title: "Meeting point shared", note: "Choose an exact landmark and a regroup time." },
  { id: "care", title: "Care needs checked privately", note: "Accessibility, medication, allergies and safeguarding stay with the right leader." },
  { id: "lineup", title: "Must-see moments starred", note: "Protect the sets your group came to experience." },
  { id: "offline", title: "Offline essentials saved", note: "Open the app online before the park network gets busy." },
];

const DAY_DETAILS: Record<FestivalDay, { label: string; time: string; arrival: string }> = {
  both: {
    label: "Friday + Saturday",
    time: "Friday 6:00–9:00 PM · Saturday 10:00 AM–7:00 PM",
    arrival: "Meet by 6:00 PM Friday and 9:30 AM Saturday, or set a later time that every person can identify.",
  },
  friday: {
    label: "Friday, September 4",
    time: "Gates open 6:00 PM · worship 6:30–9:00 PM",
    arrival: "Meet by 6:00 PM so the group can settle before worship begins at 6:30 PM.",
  },
  saturday: {
    label: "Saturday, September 5",
    time: "Family Festival Day · 10:00 AM–7:00 PM · stage from 11:00 AM",
    arrival: "Meet around 9:30 AM for the opening, or 20–30 minutes before your first must-see moment.",
  },
};

const TRAVEL_DETAILS: Record<TravelMode, { label: string; brief: string }> = {
  carpool: {
    label: "Carpool",
    brief: "Confirm drivers and riders before leaving. Gage Park parking is limited, so add time and keep the meeting point usable if vehicles split up.",
  },
  transit: {
    label: "HSR transit",
    brief: "Use the official HSR trip planner shortly before leaving because schedules and event-day detours can change. Travel in pairs where appropriate.",
  },
  separate: {
    label: "Separate arrivals",
    brief: "Send the exact meeting landmark, an arrival window and the point person's preferred contact method before anyone leaves home.",
  },
};

const MEETING_DETAILS: Record<MeetingPoint, string> = {
  fountain: "Gage Family Fountain — choose one exact side when you arrive.",
  bandshell: "G.R. Robinson Bandshell — choose one exact side, away from a busy pathway.",
  custom: "Your chosen park spot — describe a permanent nearby landmark in the group note.",
};

const ROLE_DETAILS: Record<GroupKind, string[]> = {
  church: ["Group coordinator", "Travel lead", "Welcome and prayer buddy", "Water and supplies lead"],
  youth: ["Lead adult", "Second approved adult", "Headcount buddy", "Parent-contact holder"],
  family: ["Meeting-point lead", "Kids and comfort kit", "Chairs and blanket", "Photo and regroup check"],
  friends: ["Ride lead", "Meeting-point anchor", "Water and blanket", "Lineup navigator"],
};

const KIND_LABELS: Record<GroupKind, string> = {
  church: "Church crew",
  youth: "Youth group",
  family: "Family",
  friends: "Friends",
};

const isOneOf = <T extends string>(value: string | null, options: Option<T>[]): value is T =>
  options.some((option) => option.id === value);

function cleanText(value: string | null, max: number) {
  return (value ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanInput(value: string, max: number) {
  // Preserve a trailing space while someone is typing. Final shared and stored
  // values are normalized by cleanText instead.
  return value.replace(/[\r\n\t]+/g, " ").slice(0, max);
}

function parseSharedPlan(search: string): Partial<GroupPlan> | null {
  const params = new URLSearchParams(search);
  if (params.get("plan") !== PLAN_VERSION) return null;
  const next: Partial<GroupPlan> = {};
  const kind = params.get("type");
  const size = params.get("size");
  const day = params.get("day");
  const travel = params.get("travel");
  const meeting = params.get("meet");
  if (isOneOf(kind, KINDS)) next.kind = kind;
  if (isOneOf(size, SIZES)) next.size = size;
  if (isOneOf(day, DAYS)) next.day = day;
  if (isOneOf(travel, TRAVEL)) next.travel = travel;
  if (isOneOf(meeting, MEETING_POINTS)) next.meeting = meeting;
  next.name = cleanText(params.get("name"), 36);
  next.note = cleanText(params.get("note"), 90);
  return next;
}

function isStoredPlan(value: unknown): value is GroupPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<GroupPlan>;
  return (
    isOneOf(plan.kind ?? null, KINDS) &&
    isOneOf(plan.size ?? null, SIZES) &&
    isOneOf(plan.day ?? null, DAYS) &&
    isOneOf(plan.travel ?? null, TRAVEL) &&
    isOneOf(plan.meeting ?? null, MEETING_POINTS) &&
    typeof plan.name === "string" &&
    typeof plan.note === "string" &&
    Boolean(plan.checks && typeof plan.checks === "object")
  );
}

function planIdentity(plan: Pick<GroupPlan, "kind" | "size" | "day" | "travel" | "meeting" | "name" | "note">) {
  return [plan.kind, plan.size, plan.day, plan.travel, plan.meeting, cleanText(plan.name, 36), cleanText(plan.note, 90)].join("|");
}

function recordPlanner(name: string, properties: Record<string, string | number> = {}) {
  try {
    track(name, { festival: "jesus-festival-hamilton-2026", ...properties });
  } catch {
    // The planner remains fully functional if analytics is unavailable.
  }
}

export default function GroupTripPlanner() {
  const [plan, setPlan] = useState<GroupPlan>(DEFAULT_PLAN);
  const [ready, setReady] = useState(false);
  const [loadedSharedPlan, setLoadedSharedPlan] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied" | "error">("idle");

  useEffect(() => {
    let next = DEFAULT_PLAN;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as unknown;
      if (isStoredPlan(stored)) {
        next = {
          ...stored,
          name: cleanText(stored.name, 36),
          note: cleanText(stored.note, 90),
          checks: { ...EMPTY_CHECKS, ...stored.checks },
        };
      }
    } catch {
      // Private mode or stale local data should never block planning.
    }
    const shared = parseSharedPlan(window.location.search);
    if (shared) {
      const merged = { ...next, ...shared };
      // Do not carry an unrelated crew's private completion state into a newly
      // opened shared plan. Reloading the same shared plan keeps progress.
      next = {
        ...merged,
        checks: planIdentity(next) === planIdentity(merged) ? next.checks : { ...EMPTY_CHECKS },
      };
      setLoadedSharedPlan(true);
    }
    setPlan(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // The current in-memory plan is still useful for this session.
    }
  }, [plan, ready]);

  const update = <K extends keyof GroupPlan>(key: K, value: GroupPlan[K]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setShareState("idle");
    recordPlanner("group_trip_plan_updated", { choice: key });
  };

  const completeCount = CHECKS.filter((item) => plan.checks[item.id]).length;
  const readiness = Math.round((completeCount / CHECKS.length) * 100);
  const day = DAY_DETAILS[plan.day];
  const travel = TRAVEL_DETAILS[plan.travel];
  const roles = ROLE_DETAILS[plan.kind];
  const visibleName = cleanText(plan.name, 36);
  const visibleNote = cleanText(plan.note, 90);
  const planTitle = visibleName || `Our Jesus Festival ${KIND_LABELS[plan.kind].toLowerCase()}`;

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      plan: PLAN_VERSION,
      type: plan.kind,
      size: plan.size,
      day: plan.day,
      travel: plan.travel,
      meet: plan.meeting,
    });
    if (plan.name.trim()) params.set("name", cleanText(plan.name, 36));
    if (plan.note.trim()) params.set("note", cleanText(plan.note, 90));
    return `${SITE.url}/bring-a-group?${params.toString()}`;
  }, [plan]);

  const briefText = useMemo(
    () =>
      [
        planTitle,
        `Jesus Festival Hamilton · ${day.label}`,
        day.time,
        `Group: ${KIND_LABELS[plan.kind]} · ${plan.size} people`,
        `Arrival: ${day.arrival}`,
        `Travel: ${travel.label}. ${travel.brief}`,
        `Meet: ${MEETING_DETAILS[plan.meeting]}`,
        visibleNote ? `Group note: ${visibleNote}` : "",
        `Suggested roles: ${roles.join(" · ")}`,
        `Open the shared plan: ${shareUrl}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    [day, plan, planTitle, roles, shareUrl, travel, visibleNote],
  );

  const sharePlan = async () => {
    try {
      if (navigator.share) {
        const nativeShareText = briefText.split("\n\nOpen the shared plan:")[0];
        await navigator.share({ title: planTitle, text: nativeShareText, url: shareUrl });
        setShareState("shared");
      } else {
        await navigator.clipboard.writeText(briefText);
        setShareState("copied");
      }
      recordPlanner("group_trip_plan_shared", { group_type: plan.kind, group_size: plan.size });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setShareState("copied");
      recordPlanner("group_trip_brief_copied", { group_type: plan.kind });
    } catch {
      setShareState("error");
    }
  };

  return (
    <section
      id="group-planner"
      aria-labelledby="group-planner-heading"
      className="scroll-mt-6 overflow-hidden rounded-[2rem] border border-purple-300/25 bg-gradient-to-br from-purple-950/80 via-navy-900 to-gold/10 shadow-card"
    >
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-7 sm:px-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">Private by design</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">No account required</span>
          </div>
          <h2 id="group-planner-heading" className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Build your crew plan</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/70">
            Turn six decisions into one clear brief everyone can open. Your checklist stays on this device; only the choices in a link you deliberately share leave it.
          </p>
          {loadedSharedPlan && (
            <p role="status" className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-[12.5px] font-bold text-emerald-100">
              ✓ Shared group plan loaded. You can adapt it and save your own readiness progress here.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="font-display text-sm font-extrabold text-white">Group nickname <span className="font-sans font-normal text-white/45">(optional)</span></span>
            <input
              value={plan.name}
              disabled={!ready}
              maxLength={36}
              onChange={(event) => update("name", cleanInput(event.target.value, 36))}
              placeholder="e.g. Downtown Church Crew"
              className="mt-2 min-h-12 w-full rounded-xl border border-white/12 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/60 disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="font-display text-sm font-extrabold text-white">One group note <span className="font-sans font-normal text-white/45">(optional)</span></span>
            <input
              value={plan.note}
              disabled={!ready}
              maxLength={90}
              onChange={(event) => update("note", cleanInput(event.target.value, 90))}
              placeholder="e.g. Meet on the east side at 9:30"
              className="mt-2 min-h-12 w-full rounded-xl border border-white/12 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/60 disabled:opacity-60"
            />
          </label>
        </div>

        <OptionGroup legend="1. Who are you bringing?" options={KINDS} value={plan.kind} disabled={!ready} onChange={(value) => update("kind", value)} />
        <OptionGroup legend="2. How many people?" options={SIZES} value={plan.size} disabled={!ready} onChange={(value) => update("size", value)} />
        <OptionGroup legend="3. Which festival day?" options={DAYS} value={plan.day} disabled={!ready} onChange={(value) => update("day", value)} />
        <OptionGroup legend="4. How will you arrive?" options={TRAVEL} value={plan.travel} disabled={!ready} onChange={(value) => update("travel", value)} />
        <OptionGroup legend="5. Where will you regroup?" options={MEETING_POINTS} value={plan.meeting} disabled={!ready} onChange={(value) => update("meeting", value)} />

        <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/[0.06] p-5 sm:p-6" aria-labelledby="group-readiness-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-200">6. Group readiness</p>
              <h3 id="group-readiness-heading" className="mt-1 font-display text-2xl font-extrabold text-white">Ready together</h3>
            </div>
            <p className="font-display text-3xl font-extrabold text-emerald-200">{readiness}%</p>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 transition-[width] duration-500" style={{ width: `${readiness}%` }} />
          </div>
          <p className="sr-only" aria-live="polite">{completeCount} of {CHECKS.length} group readiness steps complete.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {CHECKS.map((item) => {
              const checked = plan.checks[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => update("checks", { ...plan.checks, [item.id]: !checked })}
                  className={`flex min-h-[76px] items-start gap-3 rounded-2xl border p-3.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${checked ? "border-emerald-300/45 bg-emerald-400/10" : "border-white/10 bg-black/10 hover:border-white/20"}`}
                >
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-xs font-black ${checked ? "border-emerald-300 bg-emerald-300 text-navy-950" : "border-white/25 text-transparent"}`} aria-hidden>✓</span>
                  <span>
                    <span className="block text-[12.5px] font-extrabold text-white">{item.title}</span>
                    <span className="mt-0.5 block text-[10.5px] leading-snug text-white/55">{item.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="crew-brief-print rounded-3xl border border-gold/35 bg-gradient-to-br from-gold/12 via-white/[0.04] to-purple-500/[0.08] p-5 sm:p-7" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Your shareable crew brief</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-white">{planTitle}</h3>
              <p className="mt-1 text-[12px] font-bold text-purple-200">{KIND_LABELS[plan.kind]} · {plan.size} people</p>
            </div>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[10px] font-extrabold text-gold-300">{readiness}% ready</span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <BriefCard emoji="🗓️" title={day.label} text={day.time} />
            <BriefCard emoji="⏰" title="Arrival" text={day.arrival} />
            <BriefCard emoji="🚗" title={travel.label} text={travel.brief} />
            <BriefCard emoji="📍" title="Meeting point" text={MEETING_DETAILS[plan.meeting]} />
          </div>

          {visibleNote && (
            <div className="mt-3 rounded-2xl border border-purple-300/20 bg-purple-400/[0.07] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-purple-200">Group note</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/75">{visibleNote}</p>
            </div>
          )}

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">Suggested roles to assign</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {roles.map((role) => (
                <li key={role} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5 text-[12px] font-semibold text-white/75">
                  <span className="text-emerald-300" aria-hidden>○</span> {role}: __________
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-[10.5px] leading-relaxed text-white/45">
            Festival zones and event-day conditions can change. Follow current signs and volunteer direction. Keep phone numbers, medical details, minor names and other sensitive information out of shared links.
          </p>
        </div>

        <div className="print:hidden">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={sharePlan} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow">
              <Share width={16} height={16} /> {shareState === "shared" ? "Plan shared!" : "Share crew plan"}
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(briefText)}`} target="_blank" rel="noopener noreferrer" onClick={() => recordPlanner("group_trip_plan_whatsapp", { group_type: plan.kind })} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-3 text-center text-sm font-extrabold text-emerald-100">
              <span aria-hidden>💬</span> Send on WhatsApp
            </a>
            <button type="button" onClick={copyBrief} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white">
              {shareState === "copied" ? "✓ Brief copied" : shareState === "error" ? "Copy unavailable" : "Copy full brief"}
            </button>
            <button type="button" onClick={() => window.print()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white">
              <span aria-hidden>🖨️</span> Print / save PDF
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Link href="/find-your-moments" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gold/25 bg-gold/[0.07] px-4 py-3 text-center text-sm font-bold text-gold-300"><CalendarIcon width={15} height={15} /> Match group moments</Link>
            <Link href="/map" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-300/25 bg-purple-400/[0.07] px-4 py-3 text-center text-sm font-bold text-purple-100"><MapPin width={15} height={15} /> Open park map</Link>
            <Link href="/offline" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold text-white">Save offline <ArrowRight width={15} height={15} /></Link>
          </div>
          <p className="mt-4 text-center text-[10.5px] leading-relaxed text-white/45">
            Sharing creates a link containing the visible group choices, nickname and note. Readiness checks remain private on this device and are never added to the link.
          </p>
        </div>
      </div>
    </section>
  );
}

function OptionGroup<T extends string>({
  legend,
  options,
  value,
  disabled,
  onChange,
}: {
  legend: string;
  options: Option<T>[];
  value: T;
  disabled: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-extrabold text-white">{legend}</legend>
      <div className={`mt-3 grid gap-2 ${options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`min-h-[78px] rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:opacity-60 ${active ? "border-gold/55 bg-gold/12 shadow-[0_0_24px_rgba(212,175,55,0.08)]" : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>{option.emoji}</span>
                <span className={`text-[12.5px] font-extrabold ${active ? "text-gold-300" : "text-white"}`}>{option.label}</span>
              </span>
              <span className="mt-1 block text-[10.5px] leading-snug text-white/60">{option.note}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function BriefCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <div className="flex items-center gap-2">
        <span aria-hidden>{emoji}</span>
        <h4 className="text-[12.5px] font-extrabold text-white">{title}</h4>
      </div>
      <p className="mt-2 text-[11.5px] leading-relaxed text-white/65">{text}</p>
    </div>
  );
}
