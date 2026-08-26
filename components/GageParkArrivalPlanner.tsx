"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowRight, CalendarIcon, MapPin, Share } from "@/components/icons";
import { SITE } from "@/lib/content";

const STORAGE_KEY = "jf-arrival-plan-v1";
const SHARE_VERSION = "1";

type Mode = "drive" | "transit" | "rideshare" | "bike" | "walk";
type Arrival = "fri-open" | "fri-worship" | "sat-open" | "sat-afternoon";
type Pace = "simple" | "family" | "low-stress";
type Plan = { mode: Mode; arrival: Arrival; duration: number; pace: Pace };
type Option<T extends string> = { id: T; emoji: string; label: string; note: string };

const DEFAULT_PLAN: Plan = { mode: "drive", arrival: "fri-open", duration: 30, pace: "simple" };

const MODES: Option<Mode>[] = [
  { id: "drive", emoji: "🚗", label: "Drive / carpool", note: "Add time to park and walk in" },
  { id: "transit", emoji: "🚌", label: "HSR transit", note: "Plan around active detours" },
  { id: "rideshare", emoji: "📍", label: "Rideshare", note: "Choose a clear pickup point" },
  { id: "bike", emoji: "🚲", label: "Bike", note: "Bring a reliable lock" },
  { id: "walk", emoji: "🚶", label: "Walk", note: "Keep the route simple" },
];

const ARRIVALS: Array<Option<Arrival> & { date: "20260904" | "20260905"; hour: number; minute: number }> = [
  { id: "fri-open", emoji: "🌙", label: "Friday gates", note: "Arrive for 6:00 PM", date: "20260904", hour: 18, minute: 0 },
  { id: "fri-worship", emoji: "🙌", label: "Friday worship", note: "Begins at 6:30 PM", date: "20260904", hour: 18, minute: 30 },
  { id: "sat-open", emoji: "☀️", label: "Saturday opening", note: "Festival begins 10:00 AM", date: "20260905", hour: 10, minute: 0 },
  { id: "sat-afternoon", emoji: "🎤", label: "Saturday afternoon", note: "Build around 1:00 PM", date: "20260905", hour: 13, minute: 0 },
];

const PACES: Option<Pace>[] = [
  { id: "simple", emoji: "✨", label: "Simple arrival", note: "A practical everyday buffer" },
  { id: "family", emoji: "🎈", label: "Family pace", note: "Extra time for kids and gear" },
  { id: "low-stress", emoji: "🌿", label: "Lower-stress", note: "More time for access and breaks" },
];

const DURATIONS = [10, 20, 30, 45, 60, 75, 90, 120] as const;
const MODE_BUFFER: Record<Mode, number> = { drive: 20, transit: 15, rideshare: 10, bike: 10, walk: 5 };
const PACE_BUFFER: Record<Pace, number> = { simple: 10, family: 25, "low-stress": 35 };
const MODE_LABEL: Record<Mode, string> = { drive: "driving or carpooling", transit: "taking HSR", rideshare: "using rideshare", bike: "cycling", walk: "walking" };

function hasOption<T extends string>(value: unknown, options: Option<T>[]): value is T {
  return typeof value === "string" && options.some((option) => option.id === value);
}

function isPlan(value: unknown): value is Plan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<Plan>;
  return hasOption(plan.mode, MODES) && hasOption(plan.arrival, ARRIVALS) && hasOption(plan.pace, PACES) && DURATIONS.includes(plan.duration as (typeof DURATIONS)[number]);
}

function sharedPlan(search: string): Plan | null {
  const params = new URLSearchParams(search);
  const candidate = {
    mode: params.get("mode"),
    arrival: params.get("arrive"),
    pace: params.get("pace"),
    duration: Number(params.get("trip")),
  };
  if (params.get("plan") !== SHARE_VERSION || !isPlan(candidate)) return null;
  return candidate;
}

function minutesLabel(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes} min`;
  if (!minutes) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

function timeLabel(hour: number, minute: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function recordArrival(name: string, properties: Record<string, string | number> = {}) {
  try {
    track(name, { festival: "jesus-festival-hamilton-2026", ...properties });
  } catch {
    // The planner remains fully functional without analytics.
  }
}

export default function GageParkArrivalPlanner() {
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  const [ready, setReady] = useState(false);
  const [shared, setShared] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let next = DEFAULT_PLAN;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as unknown;
      if (isPlan(stored)) next = stored;
    } catch {
      // A stale or unavailable local store should never block the planner.
    }
    const fromLink = sharedPlan(window.location.search);
    if (fromLink) {
      next = fromLink;
      setShared(true);
    }
    setPlan(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      window.dispatchEvent(new CustomEvent("jf-arrival-plan-change", { detail: plan }));
    } catch {
      // Keep the current visit useful when storage is unavailable.
    }
  }, [plan, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const target = ARRIVALS.find((option) => option.id === plan.arrival) ?? ARRIVALS[0];
  const buffer = MODE_BUFFER[plan.mode] + PACE_BUFFER[plan.pace];
  const leaveMinutes = target.hour * 60 + target.minute - plan.duration - buffer;
  const leaveHour = Math.floor(leaveMinutes / 60);
  const leaveMinute = leaveMinutes % 60;
  const leaveAt = timeLabel(leaveHour, leaveMinute);
  const arriveAt = timeLabel(target.hour, target.minute);
  const total = plan.duration + buffer;

  const planUrl = useMemo(() => {
    const params = new URLSearchParams({ plan: SHARE_VERSION, mode: plan.mode, arrive: plan.arrival, trip: String(plan.duration), pace: plan.pace });
    return `${SITE.url}/getting-to-gage-park?${params.toString()}`;
  }, [plan]);

  const directionsUrl = useMemo(() => {
    const travelmode = plan.mode === "bike" ? "bicycling" : plan.mode === "walk" ? "walking" : plan.mode === "transit" ? "transit" : "driving";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}&travelmode=${travelmode}`;
  }, [plan.mode]);

  const update = <K extends keyof Plan>(key: K, value: Plan[K]) => {
    setPlan((current) => ({ ...current, [key]: value }));
    setNotice(null);
    recordArrival("gage_park_arrival_updated", { choice: key, value });
  };

  const share = async () => {
    const text = `Our Jesus Festival arrival plan: leave by ${leaveAt} to reach Gage Park around ${arriveAt}, allowing ${minutesLabel(total)} for ${MODE_LABEL[plan.mode]} and arrival.`;
    const canShare = Boolean(navigator.share);
    try {
      if (canShare) await navigator.share({ title: "Our Jesus Festival arrival plan", text, url: planUrl });
      else await navigator.clipboard.writeText(`${text}\n\n${planUrl}`);
      setNotice(canShare ? "Arrival plan ready to share ✨" : "Arrival plan copied—send it to your people 💛");
      recordArrival("gage_park_arrival_shared", { mode: plan.mode, pace: plan.pace });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Sharing is unavailable right now. Your plan is still saved here.");
    }
  };

  const addReminder = () => {
    const hour = String(leaveHour).padStart(2, "0");
    const minute = String(leaveMinute).padStart(2, "0");
    const endMinutes = leaveMinutes + 15;
    const endHour = String(Math.floor(endMinutes / 60)).padStart(2, "0");
    const endMinute = String(endMinutes % 60).padStart(2, "0");
    const description = `Leave for Jesus Festival. Plan: ${MODE_LABEL[plan.mode]}, ${plan.duration}-minute trip, ${buffer}-minute arrival buffer. Check live road and HSR conditions before leaving. ${planUrl}`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Jesus Festival//Arrival Planner//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      `UID:arrival-${plan.arrival}-${plan.mode}@jesusfestival.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTSTART;TZID=America/Toronto:${target.date}T${hour}${minute}00`,
      `DTEND;TZID=America/Toronto:${target.date}T${endHour}${endMinute}00`,
      "SUMMARY:Leave for Jesus Festival at Gage Park",
      `DESCRIPTION:${escapeIcs(description)}`,
      `LOCATION:${escapeIcs(SITE.address)}`,
      "BEGIN:VALARM", "TRIGGER:-PT10M", "ACTION:DISPLAY", "DESCRIPTION:Time to leave for Jesus Festival", "END:VALARM", "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "jesus-festival-arrival-reminder.ics";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Departure reminder downloaded 📅");
    recordArrival("gage_park_arrival_calendar", { mode: plan.mode, arrival: plan.arrival });
  };

  return (
    <section id="arrival-planner" aria-labelledby="arrival-planner-heading" className="scroll-mt-6 overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-br from-purple-950/80 via-navy-900 to-emerald-950/30 shadow-card">
      <div className="relative overflow-hidden border-b border-white/10 p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap gap-2"><span className="rounded-full border border-gold/35 bg-gold/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-300">Private trip planner</span><span className="rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">Works offline</span></div>
          <h2 id="arrival-planner-heading" className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">Know when to leave—not just where to go</h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/70">Choose your trip, your festival moment and the pace your people need. We will build in parking, detour, walking and settling-in time.</p>
          {shared ? <p role="status" className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-[12.5px] font-bold text-emerald-100">✓ A shared arrival plan is open. Adjust it for your trip or save the departure reminder.</p> : null}
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-8">
        <PlannerOptions legend="1. How are you getting there?" options={MODES} value={plan.mode} disabled={!ready} onChange={(value) => update("mode", value)} />
        <PlannerOptions legend="2. What are you arriving for?" options={ARRIVALS} value={plan.arrival} disabled={!ready} onChange={(value) => update("arrival", value)} />

        <fieldset>
          <legend className="font-display text-lg font-extrabold text-white">3. How long is the trip itself?</legend>
          <p className="mt-1 text-[11px] text-white/50">Use your normal travel estimate; the planner adds the arrival buffer.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DURATIONS.map((duration) => <button key={duration} type="button" aria-pressed={plan.duration === duration} disabled={!ready} onClick={() => update("duration", duration)} className={`min-h-11 rounded-xl border px-4 py-2 text-[12px] font-extrabold transition disabled:opacity-60 ${plan.duration === duration ? "border-gold/55 bg-gold/12 text-gold-300" : "border-white/10 bg-white/[0.035] text-white/70 hover:border-white/20"}`}>{minutesLabel(duration)}</button>)}
          </div>
        </fieldset>

        <PlannerOptions legend="4. What pace does your group need?" options={PACES} value={plan.pace} disabled={!ready} onChange={(value) => update("pace", value)} />

        <div className="overflow-hidden rounded-3xl border border-gold/35 bg-gradient-to-br from-gold/15 via-purple-500/[0.08] to-black/15">
          <div className="border-b border-white/10 p-5 text-center sm:p-7">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Your leave-by time</p>
            <p className="mt-2 font-display text-5xl font-extrabold text-white sm:text-6xl">{leaveAt}</p>
            <p className="mt-2 text-[13px] font-bold text-purple-100">for an arrival around {arriveAt}</p>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            <PlanStat label="Travel estimate" value={minutesLabel(plan.duration)} />
            <PlanStat label="Arrival buffer" value={minutesLabel(buffer)} />
            <PlanStat label="Total planned" value={minutesLabel(total)} />
          </div>
          <div className="p-5 sm:p-7">
            <p className="text-[13px] leading-relaxed text-white/65"><strong className="text-white">Why the buffer?</strong> It covers the active Main &amp; Ottawa construction area, parking or stop changes, the walk into the park and the pace you selected. Check official live conditions before leaving.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow"><MapPin width={16} height={16} /> Open live directions</a>
              <button type="button" onClick={addReminder} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-purple-300/30 bg-purple-400/10 px-4 py-3 text-sm font-bold text-purple-100"><CalendarIcon width={16} height={16} /> Add leave reminder</button>
              <button type="button" onClick={share} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white"><Share width={16} height={16} /> Share this plan</button>
              <Link href="/find-your-moments" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white">Plan what to see <ArrowRight width={15} height={15} /></Link>
            </div>
            <p role="status" className="mt-3 min-h-5 text-center text-[12px] font-bold text-gold-300">{notice}</p>
            <p className="mt-1 text-center text-[10.5px] leading-relaxed text-white/45">Your choices stay on this device. Times are planning estimates—not live traffic or transit predictions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlannerOptions<T extends string>({ legend, options, value, disabled, onChange }: { legend: string; options: Option<T>[]; value: T; disabled: boolean; onChange: (value: T) => void }) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-extrabold text-white">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const active = option.id === value;
          return <button key={option.id} type="button" aria-pressed={active} disabled={disabled} onClick={() => onChange(option.id)} className={`min-h-[78px] rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:opacity-60 ${active ? "border-gold/55 bg-gold/12 shadow-[0_0_24px_rgba(212,175,55,0.08)]" : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"}`}><span className="flex items-center gap-2"><span className="text-lg" aria-hidden>{option.emoji}</span><span className={`text-[12.5px] font-extrabold ${active ? "text-gold-300" : "text-white"}`}>{option.label}</span></span><span className="mt-1 block text-[10.5px] leading-snug text-white/60">{option.note}</span></button>;
        })}
      </div>
    </fieldset>
  );
}

function PlanStat({ label, value }: { label: string; value: string }) {
  return <div className="bg-navy-950/80 p-4 text-center"><p className="font-display text-lg font-extrabold text-white">{value}</p><p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">{label}</p></div>;
}
