"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowRight, Download, Share } from "@/components/icons";
import { READINESS_ITEMS, READINESS_STORAGE_KEY } from "@/components/FestivalReadinessChecklist";
import { SITE } from "@/lib/content";
import { fetchFestivalForecast, type FestivalForecastDay } from "@/lib/weather";

const STORAGE_KEY = "jf-packing-plan-v1";
const DAY_VALUES = ["fri", "sat", "both"] as const;
type Day = (typeof DAY_VALUES)[number];
type AddOn = "family" | "comfort" | "volunteer";
type Category = "Festival essentials" | "Weather ready" | "Family plan" | "Comfort & access" | "Serving well" | "Heart ready";

type PackingItem = {
  id: string;
  emoji: string;
  label: string;
  note: string;
  category: Category;
};

const DAY_OPTIONS: { id: Day; emoji: string; label: string; note: string }[] = [
  { id: "fri", emoji: "🌙", label: "Friday night", note: "6–9 PM · Pure Worship Night" },
  { id: "sat", emoji: "☀️", label: "Saturday", note: "10 AM–7 PM · stage from 11 AM" },
  { id: "both", emoji: "✨", label: "Both days", note: "The complete festival weekend" },
];

const ADD_ONS: { id: AddOn; emoji: string; label: string; note: string }[] = [
  { id: "family", emoji: "👨‍👩‍👧‍👦", label: "Coming with children", note: "Adds snacks, child meeting plan and family comfort" },
  { id: "comfort", emoji: "♿", label: "Comfort or access needs", note: "Adds medication, sensory and mobility reminders" },
  { id: "volunteer", emoji: "🙌", label: "Serving or volunteering", note: "Adds team, footwear and shift-readiness reminders" },
];

const BASE_ITEMS: PackingItem[] = [
  { id: "chair", emoji: "🪑", label: "Lawn chair or blanket", note: "The main gathering area is open lawn; bring the seating that works for you.", category: "Festival essentials" },
  { id: "water", emoji: "💧", label: "Filled refillable water bottle", note: "Start hydrated and keep drinking through the outdoor gathering.", category: "Festival essentials" },
  { id: "shoes", emoji: "👟", label: "Comfortable footwear", note: "Expect grass, paths and time on your feet across Gage Park.", category: "Festival essentials" },
  { id: "phone", emoji: "🔋", label: "Charged phone or power bank", note: "Save enough battery for your ride home, meeting point and festival plan.", category: "Festival essentials" },
  { id: "offline", emoji: "📲", label: "Festival essentials saved offline", note: "Open the install screen on reliable internet before the park gets busy.", category: "Festival essentials" },
  { id: "friend", emoji: "🤝", label: "Invite or check in with someone", note: "Share the weekend, your arrival plan or simply tell someone where you will be.", category: "Heart ready" },
  { id: "prayer", emoji: "🙏", label: "Pray for one person before you arrive", note: "Ask Jesus who you can encourage, welcome or listen to during the weekend.", category: "Heart ready" },
];

const FRIDAY_ITEMS: PackingItem[] = [
  { id: "layer", emoji: "🧥", label: "Warm layer for Friday evening", note: "The outdoor worship night continues after sunset.", category: "Weather ready" },
  { id: "return", emoji: "🌙", label: "A clear return-trip plan", note: "Confirm your pickup, transit or walk before batteries are low and crowds leave.", category: "Festival essentials" },
];

const SATURDAY_ITEMS: PackingItem[] = [
  { id: "sun", emoji: "🧴", label: "Broad-spectrum SPF 30+ sunscreen", note: "Hamilton Public Health recommends SPF 30+ and regular reapplication outdoors.", category: "Weather ready" },
  { id: "hat", emoji: "🧢", label: "Hat, sunglasses or personal shade", note: "Saturday spans the strongest part of the day; choose protection that will not block another visitor's view.", category: "Weather ready" },
  { id: "snack", emoji: "🍎", label: "A simple snack or food plan", note: "Food trucks are optional; pack for your own timing and dietary needs.", category: "Festival essentials" },
];

const FAMILY_ITEMS: PackingItem[] = [
  { id: "family-snacks", emoji: "🍌", label: "Child-friendly snacks and extra water", note: "Pack familiar options so your family is not dependent on a food-truck line.", category: "Family plan" },
  { id: "family-meet", emoji: "📍", label: "A permanent family meeting landmark", note: "Choose the exact side of a permanent landmark and teach children what to do if separated.", category: "Family plan" },
  { id: "family-comfort", emoji: "🧸", label: "One familiar comfort item", note: "A small quiet activity, hearing protection or favourite item can make breaks easier.", category: "Family plan" },
  { id: "family-change", emoji: "🎒", label: "Weather layer or change of clothes", note: "Pack only what your family can comfortably carry around the park.", category: "Family plan" },
];

const COMFORT_ITEMS: PackingItem[] = [
  { id: "medication", emoji: "💊", label: "Medication and your usual instructions", note: "Keep essential medication with you; do not rely on event refrigeration or storage unless confirmed directly.", category: "Comfort & access" },
  { id: "sensory", emoji: "🎧", label: "Personal sensory or hearing supports", note: "Bring the ear protection, sunglasses, communication aid or comfort tool you already trust.", category: "Comfort & access" },
  { id: "mobility", emoji: "🧭", label: "Mobility, rest and washroom plan", note: "Review distances, surfaces and the Comfort Guide before travelling.", category: "Comfort & access" },
  { id: "confirm", emoji: "✉️", label: "Confirm any essential accommodation", note: `If a specific event-day service is essential, contact ${SITE.email} before leaving.`, category: "Comfort & access" },
];

const VOLUNTEER_ITEMS: PackingItem[] = [
  { id: "team", emoji: "📋", label: "Team, shift and check-in details", note: "Save your role, arrival time and leader instructions somewhere available offline.", category: "Serving well" },
  { id: "closed-shoes", emoji: "🥾", label: "Role-appropriate closed-toe footwear", note: "Follow your team lead's final clothing and safety instructions.", category: "Serving well" },
  { id: "serve-water", emoji: "💦", label: "Extra water and a break plan", note: "Serving well includes pacing yourself and asking for support early.", category: "Serving well" },
];

const CATEGORIES: Category[] = ["Festival essentials", "Weather ready", "Family plan", "Comfort & access", "Serving well", "Heart ready"];
const CORE_IDS = new Set(READINESS_ITEMS.map((item) => item.id));

type StoredPlan = { day: Day; addOns: AddOn[]; checked: string[] };

function isDay(value: string | null): value is Day {
  return Boolean(value && DAY_VALUES.includes(value as Day));
}

function validAddOns(value: unknown): AddOn[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is AddOn => ADD_ONS.some((option) => option.id === item));
}

function record(name: string, value: number) {
  try {
    track(name, { festival: "jesus-festival-hamilton-2026", value });
  } catch {
    // The packing plan remains useful if analytics is unavailable.
  }
}

export default function FestivalPackingPlanner() {
  const [day, setDay] = useState<Day>("both");
  const [addOns, setAddOns] = useState<Set<AddOn>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [forecast, setForecast] = useState<FestivalForecastDay[] | null>(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let stored: StoredPlan | null = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as StoredPlan | null;
    } catch {
      stored = null;
    }

    const params = new URLSearchParams(window.location.search);
    const sharedDay = params.get("day");
    const sharedAddOns = params.get("for")?.split(",") ?? [];
    const hasSharedPlan = isDay(sharedDay) || sharedAddOns.length > 0;

    setDay(isDay(sharedDay) ? sharedDay : isDay(stored?.day ?? null) ? stored!.day : "both");
    setAddOns(new Set(hasSharedPlan ? validAddOns(sharedAddOns) : validAddOns(stored?.addOns)));
    setChecked(new Set(Array.isArray(stored?.checked) ? stored.checked.filter((id): id is string => typeof id === "string") : []));
    if (hasSharedPlan) setNotice("Shared packing profile loaded — your private progress stays on this device.");
    setReady(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchFestivalForecast(controller.signal).then((days) => {
      if (!controller.signal.aborted) setForecast(days);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const items = useMemo(() => {
    const selected = [...BASE_ITEMS];
    if (day === "fri" || day === "both") selected.push(...FRIDAY_ITEMS);
    if (day === "sat" || day === "both") selected.push(...SATURDAY_ITEMS);
    if (addOns.has("family")) selected.push(...FAMILY_ITEMS);
    if (addOns.has("comfort")) selected.push(...COMFORT_ITEMS);
    if (addOns.has("volunteer")) selected.push(...VOLUNTEER_ITEMS);
    return selected;
  }, [addOns, day]);

  const visibleChecked = useMemo(() => items.filter((item) => checked.has(item.id)).length, [checked, items]);
  const percent = Math.round((visibleChecked / items.length) * 100);

  const persist = (nextDay: Day, nextAddOns: Set<AddOn>, nextChecked: Set<string>) => {
    try {
      const value: StoredPlan = { day: nextDay, addOns: [...nextAddOns], checked: [...nextChecked] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      const legacy = [...nextChecked].filter((id) => CORE_IDS.has(id as (typeof READINESS_ITEMS)[number]["id"]));
      localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(legacy));
      window.dispatchEvent(new Event("jf-readiness-change"));
    } catch {
      // Keep the current in-memory checklist useful when storage is blocked.
    }
  };

  const chooseDay = (nextDay: Day) => {
    setDay(nextDay);
    persist(nextDay, addOns, checked);
    record("festival_packing_profile_updated", items.length);
  };

  const toggleAddOn = (id: AddOn) => {
    const next = new Set(addOns);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setAddOns(next);
    persist(day, next, checked);
    record("festival_packing_profile_updated", next.size);
  };

  const toggleItem = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
    persist(day, addOns, next);
    record(next.size === items.length ? "festival_packing_completed" : "festival_packing_updated", next.size);
  };

  const markVisible = () => {
    const next = new Set(checked);
    items.forEach((item) => next.add(item.id));
    setChecked(next);
    persist(day, addOns, next);
    record("festival_packing_completed", items.length);
  };

  const reset = () => {
    const next = new Set<string>();
    setChecked(next);
    persist(day, addOns, next);
    record("festival_packing_reset", 0);
  };

  const share = async () => {
    const params = new URLSearchParams({ day });
    if (addOns.size) params.set("for", [...addOns].sort().join(","));
    const url = `${SITE.url}/what-to-bring?${params.toString()}`;
    const data = { title: "My Jesus Festival packing plan", text: "Here is a practical What to Bring plan for Jesus Festival at Gage Park.", url };
    try {
      const usedNativeShare = Boolean(navigator.share);
      if (usedNativeShare) await navigator.share(data);
      else await navigator.clipboard.writeText(`${data.text} ${url}`);
      setNotice(usedNativeShare ? "Packing profile shared!" : "Packing profile link copied!");
      record("festival_packing_shared", items.length);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Share JesusFestival.App/what-to-bring");
    }
  };

  const download = () => {
    const lines = [
      "JESUS FESTIVAL HAMILTON 2026 — WHAT TO BRING",
      "September 4–5 · Gage Park · Free · All ages",
      "",
      `Plan: ${DAY_OPTIONS.find((option) => option.id === day)?.label}`,
      addOns.size ? `Profile: ${[...addOns].map((id) => ADD_ONS.find((option) => option.id === id)?.label).join(", ")}` : "Profile: Festival essentials",
      "",
      ...CATEGORIES.flatMap((category) => {
        const categoryItems = items.filter((item) => item.category === category);
        return categoryItems.length ? [category.toUpperCase(), ...categoryItems.map((item) => `${checked.has(item.id) ? "[x]" : "[ ]"} ${item.label} — ${item.note}`), ""] : [];
      }),
      "Before leaving: check the forecast, current travel conditions and official festival updates.",
      `${SITE.url}/festival-weekend`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "jesus-festival-what-to-bring.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Packing checklist downloaded ✓");
    record("festival_packing_downloaded", items.length);
  };

  return (
    <section id="packing-planner" aria-labelledby="packing-planner-heading" className="scroll-mt-6 overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-purple-950/80 via-navy-900 to-ink shadow-card">
      <div className="border-b border-white/10 p-5 sm:p-7">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Private · personalized · offline-ready</p>
        <h2 id="packing-planner-heading" className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">Build my festival packing plan</h2>
        <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-white/65">Choose your visit and the support that fits. The checklist adapts instantly, saves on this device and never asks for a name, email or medical details.</p>
      </div>

      <div className="space-y-8 p-5 sm:p-7">
        <fieldset disabled={!ready}>
          <legend className="font-display text-xl font-extrabold text-white">1. When are you coming?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {DAY_OPTIONS.map((option) => {
              const active = option.id === day;
              return <button key={option.id} type="button" aria-pressed={active} onClick={() => chooseDay(option.id)} className={`min-h-24 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${active ? "border-gold/55 bg-gold/12" : "border-white/10 bg-white/[0.035] hover:border-white/20"}`}><span className="text-2xl" aria-hidden>{option.emoji}</span><span className={`mt-2 block text-sm font-extrabold ${active ? "text-gold-300" : "text-white"}`}>{option.label}</span><span className="mt-1 block text-[10.5px] leading-snug text-white/55">{option.note}</span></button>;
            })}
          </div>
        </fieldset>

        <fieldset disabled={!ready}>
          <legend className="font-display text-xl font-extrabold text-white">2. Add what fits your visit</legend>
          <p className="mt-1 text-[12px] text-white/50">Optional. Choose any combination; do not enter personal or health information.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {ADD_ONS.map((option) => {
              const active = addOns.has(option.id);
              return <button key={option.id} type="button" aria-pressed={active} onClick={() => toggleAddOn(option.id)} className={`min-h-28 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${active ? "border-emerald-300/45 bg-emerald-400/10" : "border-white/10 bg-white/[0.035] hover:border-white/20"}`}><span className="text-2xl" aria-hidden>{option.emoji}</span><span className={`mt-2 block text-[13px] font-extrabold ${active ? "text-emerald-200" : "text-white"}`}>{option.label}</span><span className="mt-1 block text-[10.5px] leading-snug text-white/55">{option.note}</span></button>;
            })}
          </div>
        </fieldset>

        {forecast && (
          <section aria-labelledby="packing-forecast-heading" className="rounded-3xl border border-sky-300/20 bg-sky-400/[0.055] p-5">
            <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-200">Current Gage Park forecast</p><h3 id="packing-forecast-heading" className="mt-1 font-display text-xl font-extrabold text-white">Pack for the actual weekend</h3></div><span className="text-[10px] text-white/45">Open-Meteo · check again before leaving</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2">{forecast.map((item) => <article key={item.name} className="rounded-2xl border border-white/10 bg-black/15 p-3 text-center"><span className="text-2xl" aria-hidden>{item.emoji}</span><p className="mt-1 text-[11px] font-extrabold text-white">{item.name} · {item.hi}° / {item.lo}°</p><p className="text-[10px] text-white/55">{item.label} · {item.rain}% rain</p></article>)}</div>
          </section>
        )}

        <section aria-labelledby="personal-list-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-purple-200">3. Your {items.length}-item plan</p><h3 id="personal-list-heading" className="mt-1 font-display text-2xl font-extrabold text-white">{percent === 100 ? "Ready to go 🙌" : `${visibleChecked} packed · ${items.length - visibleChecked} to go`}</h3></div>
            <div className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 font-display text-sm font-extrabold text-gold-300">{percent}% ready</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Personal packing progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="h-full rounded-full bg-gradient-to-r from-purple-400 via-gold-400 to-emerald-300 transition-[width] duration-500" style={{ width: `${percent}%` }} /></div>
          <p className="sr-only" aria-live="polite">{visibleChecked} of {items.length} visible packing items complete.</p>

          <div className="mt-6 space-y-6">
            {CATEGORIES.map((category) => {
              const categoryItems = items.filter((item) => item.category === category);
              if (!categoryItems.length) return null;
              return <section key={category} aria-labelledby={`packing-${category.replaceAll(" ", "-").toLowerCase()}`}><h4 id={`packing-${category.replaceAll(" ", "-").toLowerCase()}`} className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">{category}</h4><div className="mt-2 space-y-2">{categoryItems.map((item) => { const active = checked.has(item.id); return <button key={item.id} type="button" aria-pressed={active} disabled={!ready} onClick={() => toggleItem(item.id)} className={`flex min-h-20 w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${active ? "border-emerald-300/30 bg-emerald-400/[0.09]" : "border-white/10 bg-white/[0.035] hover:border-white/20"}`}><span className="text-2xl" aria-hidden>{item.emoji}</span><span className="min-w-0 flex-1"><span className={`block text-[13px] font-extrabold ${active ? "text-emerald-100" : "text-white"}`}>{item.label}</span><span className="mt-0.5 block text-[10.5px] leading-snug text-white/55">{item.note}</span></span><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-extrabold ${active ? "border-emerald-300 bg-emerald-300 text-navy-950" : "border-white/20 text-transparent"}`} aria-hidden>✓</span></button>; })}</div></section>;
            })}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={markVisible} disabled={!ready || percent === 100} className="min-h-12 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 disabled:opacity-45">Mark this list packed</button>
            <button type="button" onClick={reset} disabled={!ready || visibleChecked === 0} className="min-h-12 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white disabled:opacity-35">Reset my progress</button>
            <button type="button" onClick={download} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-purple-300/25 bg-purple-400/[0.08] px-4 py-3 text-sm font-bold text-purple-100"><Download width={17} height={17} /> Download checklist</button>
            <button type="button" onClick={share} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white"><Share width={17} height={17} /> Share packing profile</button>
          </div>
          <p role="status" className="mt-3 min-h-5 text-center text-[12px] font-bold text-gold-300">{notice}</p>
          <p className="mt-1 text-center text-[10.5px] leading-relaxed text-white/45">Progress stays on this device. Shared links contain only your selected day and general add-ons—not checked items or personal details.</p>
        </section>

        <div className="grid gap-2 sm:grid-cols-2">
          <Link href="/getting-to-gage-park" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-300/25 bg-amber-300/[0.07] px-4 py-3 text-center text-sm font-extrabold text-amber-100">Calculate when to leave <ArrowRight width={15} height={15} /></Link>
          <Link href="/festival-weekend" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-purple-300/25 bg-purple-400/[0.07] px-4 py-3 text-center text-sm font-extrabold text-purple-100">Open weekend command center <ArrowRight width={15} height={15} /></Link>
        </div>
      </div>
    </section>
  );
}
