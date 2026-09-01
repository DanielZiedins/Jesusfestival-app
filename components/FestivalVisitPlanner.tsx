"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { LINKS, SITE } from "@/lib/content";
import { ArrowRight, CalendarIcon, MapPin, Share } from "@/components/icons";

const STORAGE_KEY = "jf-visit-plan-v1";
const HSR_TRIP_PLANNER = "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/trip-planning-tools";

type VisitPlan = {
  days: "both" | "friday" | "saturday";
  group: "first" | "family" | "worship" | "low-stress";
  travel: "drive" | "transit" | "rideshare";
};

type ChoiceOption = {
  id: string;
  emoji: string;
  label: string;
  note: string;
};

const DEFAULT_PLAN: VisitPlan = { days: "both", group: "first", travel: "drive" };

const DAY_OPTIONS: ChoiceOption[] = [
  { id: "both", emoji: "✨", label: "Both days", note: "The complete weekend" },
  { id: "friday", emoji: "🌙", label: "Friday", note: "Pure Worship Night" },
  { id: "saturday", emoji: "☀️", label: "Saturday", note: "Family Festival Day" },
];

const GROUP_OPTIONS: ChoiceOption[] = [
  { id: "first", emoji: "🫂", label: "First time", note: "A calm, no-pressure plan" },
  { id: "family", emoji: "🎈", label: "With family", note: "Kids, breaks and a meeting point" },
  { id: "worship", emoji: "🙌", label: "Here for worship", note: "Protect the sets that matter" },
  { id: "low-stress", emoji: "💛", label: "Low-stress visit", note: "More time, fewer unknowns" },
];

const TRAVEL_OPTIONS: ChoiceOption[] = [
  { id: "drive", emoji: "🚗", label: "Driving", note: "Parking fills early" },
  { id: "transit", emoji: "🚌", label: "HSR transit", note: "Check the live trip planner" },
  { id: "rideshare", emoji: "🚲", label: "Other", note: "Walk, cycle, carpool or rideshare" },
];

const GROUP_GUIDANCE: Record<VisitPlan["group"], { title: string; text: string; pack: string[] }> = {
  first: {
    title: "Give yourself permission to simply be there",
    text: "Choose a spot near the edge of the lawn, arrive with someone you know, and treat the schedule as an invitation—not an obligation. Nobody needs you to perform or have the right words.",
    pack: ["Chair or blanket", "Water", "One familiar person"],
  },
  family: {
    title: "Build the day around your family’s rhythm",
    text: "Pick a clear family meeting point when you arrive, take a current photo of the kids, and choose a shorter festival window around meals and naps. A happy shorter visit beats a difficult all-day one.",
    pack: ["Large blanket", "Familiar snacks", "Sun protection", "Change of clothes"],
  },
  worship: {
    title: "Protect the moments you came for",
    text: "Star your must-see sets before leaving home, arrive early enough to settle in, and leave margin between the schedule and your travel time. Your personal lineup stays on this device.",
    pack: ["Chair or blanket", "Water", "Power bank", "Your starred lineup"],
  },
  "low-stress": {
    title: "Reduce the unknowns before you leave",
    text: "Review the park map, choose one entrance and meeting point, and arrive before the busiest part of the day. Gage Park has paved paths, while the main gathering area is open lawn; contact the festival team for current accommodation questions.",
    pack: ["Needed medication", "Comfort item", "Water", "A support person"],
  },
};

const DAY_GUIDANCE: Record<VisitPlan["days"], { label: string; arrival: string; schedule: string }> = {
  both: {
    label: "Friday + Saturday",
    arrival: "Friday: aim for 6:00 PM. Saturday: aim for 9:30–9:40 AM if you want the opening and the easiest arrival.",
    schedule: "Friday is 6:00–9:00 PM; Saturday is 10:00 AM–7:00 PM, with the stage from 11:00 AM–7:00 PM.",
  },
  friday: {
    label: "Friday night",
    arrival: "Aim for 6:00 PM so you can arrive, choose a lawn spot and settle in before worship begins at 6:30 PM.",
    schedule: "Pure Worship Night runs 6:00–9:00 PM.",
  },
  saturday: {
    label: "Saturday",
    arrival: "Aim for 9:30–9:40 AM for the opening, or arrive 20–30 minutes before the first set you do not want to miss.",
    schedule: "Family Festival Day runs 10:00 AM–7:00 PM; the stage runs 11:00 AM–7:00 PM.",
  },
};

const TRAVEL_GUIDANCE: Record<VisitPlan["travel"], { label: string; text: string; href: string; cta: string }> = {
  drive: {
    label: "Driving",
    text: "Build at least 20 extra minutes into the plan. Parking is limited, and event-day signs or volunteer directions should take priority over an old screenshot.",
    href: LINKS.directions,
    cta: "Open driving directions",
  },
  transit: {
    label: "HSR transit",
    text: "Plan your trip to 1000 Main Street East shortly before leaving. Routes, schedules and event-day detours can change, so use the official HSR planner for the final answer.",
    href: HSR_TRIP_PLANNER,
    cta: "Open the HSR planner",
  },
  rideshare: {
    label: "Walk, cycle, carpool or rideshare",
    text: "Choose a safe, legal arrival point away from the busiest entrance and expect a short walk. Pick the exact meeting point before your group separates.",
    href: LINKS.directions,
    cta: "Open the park location",
  },
};

function recordPlanner(name: string, properties: Record<string, string> = {}) {
  try {
    track(name, { festival: "jesus-festival-hamilton-2026", ...properties });
  } catch {
    // Planning remains fully functional when analytics is unavailable.
  }
}

function isVisitPlan(value: unknown): value is VisitPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<VisitPlan>;
  return (
    DAY_OPTIONS.some((item) => item.id === plan.days) &&
    GROUP_OPTIONS.some((item) => item.id === plan.group) &&
    TRAVEL_OPTIONS.some((item) => item.id === plan.travel)
  );
}

export default function FestivalVisitPlanner() {
  const [plan, setPlan] = useState<VisitPlan>(DEFAULT_PLAN);
  const [ready, setReady] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied" | "error">("idle");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as unknown;
      if (isVisitPlan(stored)) setPlan(stored);
    } catch {
      // A stale or unavailable local store should never block the planner.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // The current in-memory plan remains useful for this visit.
    }
  }, [plan, ready]);

  const updatePlan = <K extends keyof VisitPlan>(key: K, value: VisitPlan[K]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setShareState("idle");
    recordPlanner("festival_visit_plan_updated", { choice: key, value });
  };

  const group = GROUP_GUIDANCE[plan.group];
  const day = DAY_GUIDANCE[plan.days];
  const travel = TRAVEL_GUIDANCE[plan.travel];

  const planText = useMemo(
    () =>
      [
        "My Jesus Festival Hamilton plan",
        `${day.label}: ${day.schedule}`,
        `Arrival: ${day.arrival}`,
        `${travel.label}: ${travel.text}`,
        `Focus: ${group.title}.`,
        `${SITE.url}/jesus-festival-hamilton#build-my-plan`,
      ].join("\n\n"),
    [day, group.title, travel],
  );

  const sharePlan = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Jesus Festival plan", text: planText, url: `${SITE.url}/jesus-festival-hamilton#build-my-plan` });
        setShareState("shared");
      } else {
        await navigator.clipboard.writeText(planText);
        setShareState("copied");
      }
      recordPlanner("festival_visit_plan_shared", { days: plan.days, group: plan.group, travel: plan.travel });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  return (
    <section
      id="build-my-plan"
      aria-labelledby="visit-planner-heading"
      className="scroll-mt-8 overflow-hidden rounded-[2rem] border border-purple-300/20 bg-gradient-to-br from-purple-950/70 via-navy-900 to-gold/10 shadow-card"
    >
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-6 sm:px-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">New</span>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-400">Your weekend, simplified</p>
          </div>
          <h2 id="visit-planner-heading" className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Build my festival plan</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/70">
            Choose what your weekend looks like. Your private plan stays on this device, works offline after the guide is saved, and can be changed anytime.
          </p>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-7">
        <ChoiceGroup
          legend="1. Which day are you coming?"
          options={DAY_OPTIONS}
          value={plan.days}
          disabled={!ready}
          onChange={(value) => updatePlan("days", value as VisitPlan["days"])}
        />
        <ChoiceGroup
          legend="2. What kind of visit fits you?"
          options={GROUP_OPTIONS}
          value={plan.group}
          disabled={!ready}
          onChange={(value) => updatePlan("group", value as VisitPlan["group"])}
        />
        <ChoiceGroup
          legend="3. How are you getting there?"
          options={TRAVEL_OPTIONS}
          value={plan.travel}
          disabled={!ready}
          onChange={(value) => updatePlan("travel", value as VisitPlan["travel"])}
        />

        <div aria-live="polite" className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-white/[0.04] to-transparent p-5 sm:p-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Your festival plan</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-white">{day.label} · {travel.label}</h3>

          <div className="mt-5 space-y-4">
            <PlanStep number="01" title="When to arrive" text={day.arrival} />
            <PlanStep number="02" title={travel.label} text={travel.text} />
            <PlanStep number="03" title={group.title} text={group.text} />
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-purple-200">Pack for this plan</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.pack.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5 text-[12px] font-semibold text-white/75">
                  <span className="text-emerald-300" aria-hidden>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Link href="/find-your-moments" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow">
              <CalendarIcon width={16} height={16} /> Find my best moments
            </Link>
            <a href={travel.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-sm font-bold text-white">
              <MapPin width={16} height={16} /> {travel.cta}
            </a>
            <Link href="/offline" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-sm font-bold text-white">
              Save offline essentials <ArrowRight width={15} height={15} />
            </Link>
            <button type="button" onClick={sharePlan} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-300/30 bg-purple-400/10 px-4 py-3 text-sm font-bold text-purple-100">
              <Share width={15} height={15} /> {shareState === "shared" ? "Plan shared!" : shareState === "copied" ? "Plan copied!" : shareState === "error" ? "Share unavailable" : "Share my plan"}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] leading-relaxed text-white/60">
          Event layouts, transit and traffic can change. Recheck official updates and on-site signs before travelling. Need mobility, sensory or support planning? <Link className="font-bold text-emerald-300 underline underline-offset-2" href="/accessibility">Open the accessibility guide</Link> or email <a className="font-bold text-gold-400 underline underline-offset-2" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </section>
  );
}

function ChoiceGroup({
  legend,
  options,
  value,
  disabled,
  onChange,
}: {
  legend: string;
  options: ChoiceOption[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-extrabold text-white">{legend}</legend>
      <div className={`mt-3 grid gap-2 ${options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`min-h-[76px] rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:opacity-60 ${
                active ? "border-gold/55 bg-gold/12 shadow-[0_0_24px_rgba(212,175,55,0.08)]" : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>{option.emoji}</span>
                <span className={`text-[13px] font-extrabold ${active ? "text-gold-300" : "text-white"}`}>{option.label}</span>
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-white/65">{option.note}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PlanStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-[11px] font-extrabold text-gold-400">{number}</span>
      <div>
        <h4 className="text-[14px] font-extrabold text-white">{title}</h4>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/70">{text}</p>
      </div>
    </div>
  );
}
