"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Share } from "@/components/icons";
import { SITE } from "@/lib/content";

const STORAGE_KEY = "jf-comfort-plan-v1";

type NeedId = "mobility" | "sensory" | "hearing" | "vision" | "medication" | "family" | "service-animal" | "support";

type Need = {
  id: NeedId;
  emoji: string;
  label: string;
  note: string;
  checklist: string[];
  question?: string;
};

const NEEDS: Need[] = [
  {
    id: "mobility",
    emoji: "♿",
    label: "Mobility or fatigue",
    note: "Routes, surfaces, seating and distance",
    checklist: [
      "Confirm the current accessible parking, drop-off and viewing plan with the festival team.",
      "Plan for paved park walkways plus an open-lawn gathering area.",
      "Bring the mobility aid, seat or fatigue support you normally rely on.",
    ],
    question: "What accessible parking, drop-off and viewing areas will be available on the day I attend?",
  },
  {
    id: "sensory",
    emoji: "🎧",
    label: "Sensory comfort",
    note: "Sound, crowds, breaks and a calmer edge",
    checklist: [
      "Pack ear protection and any familiar regulation or comfort items.",
      "Choose a lawn position near an edge so taking a break is simple.",
      "Arrive before the busiest window and agree on a low-stimulation fallback location.",
    ],
    question: "Will there be a designated quiet or lower-stimulation space, and where will it be?",
  },
  {
    id: "hearing",
    emoji: "🤟",
    label: "Hearing access",
    note: "Interpretation, sight lines and written details",
    checklist: [
      "Save the written schedule and map before arriving.",
      "Choose a clear sight line to the stage and speakers.",
      "Ask about interpretation or other communication supports before travelling.",
    ],
    question: "Will ASL interpretation, captioning or another hearing-access support be available?",
  },
  {
    id: "vision",
    emoji: "🦯",
    label: "Vision access",
    note: "Wayfinding, lighting and assistance",
    checklist: [
      "Share the park address, meeting point and return route with your support person.",
      "Arrive in daylight when possible and ask a volunteer for current event wayfinding.",
      "Save the schedule and organizer contact details for quick access.",
    ],
    question: "What wayfinding or on-site assistance will be available for visitors with low vision?",
  },
  {
    id: "medication",
    emoji: "🩹",
    label: "Medical or medication plan",
    note: "Medication, temperature, power and breaks",
    checklist: [
      "Carry required medication and emergency information with you—not in a parked vehicle.",
      "Plan food, water, shade and breaks around your normal needs.",
      "Confirm any refrigeration, electrical or medical-support requirement in advance.",
    ],
    question: "Who should I contact about a medication, refrigeration, power or medical-support requirement?",
  },
  {
    id: "family",
    emoji: "🛒",
    label: "Stroller or family needs",
    note: "Meeting points, supplies and shorter windows",
    checklist: [
      "Choose a clear family meeting point before anyone explores the park.",
      "Pack familiar food, water, sun protection and a change of clothes.",
      "Choose a shorter festival window around meals, rest and your family’s normal rhythm.",
    ],
  },
  {
    id: "service-animal",
    emoji: "🐕‍🦺",
    label: "Service animal",
    note: "Water, relief breaks, heat and crowd noise",
    checklist: [
      "Pack water, a bowl and anything your working animal needs for a long outdoor visit.",
      "Plan relief and rest breaks away from the loudest part of the crowd.",
      "Keep current documentation available if your animal’s role is not visually identifiable.",
    ],
  },
  {
    id: "support",
    emoji: "🤝",
    label: "Support person",
    note: "Shared plan, meeting point and check-ins",
    checklist: [
      "Share your arrival, meeting point, must-see moments and exit plan before leaving home.",
      "Decide who will carry essential supplies and who to contact if you become separated.",
      "Keep the return-trip plan available offline on both devices.",
    ],
  },
];

const isNeedId = (value: unknown): value is NeedId => typeof value === "string" && NEEDS.some((need) => need.id === value);

export default function FestivalComfortPlan() {
  const [selected, setSelected] = useState<Set<NeedId>>(new Set());
  const [ready, setReady] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied" | "error">("idle");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
      if (Array.isArray(stored)) setSelected(new Set(stored.filter(isNeedId)));
    } catch {
      // A stale or unavailable local store should never block access planning.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
    } catch {
      // Keep the current in-memory plan useful for this visit.
    }
  }, [ready, selected]);

  const chosen = NEEDS.filter((need) => selected.has(need.id));
  const checklist = [...new Set(chosen.flatMap((need) => need.checklist))];
  const questions = chosen.flatMap((need) => (need.question ? [need.question] : []));

  const toggle = (id: NeedId) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setShareState("idle");
  };

  const planText = [
    "My Jesus Festival Comfort Plan",
    chosen.length ? `Planning for: ${chosen.map((need) => need.label).join(", ")}` : "No comfort preferences selected yet.",
    ...checklist.map((item) => `• ${item}`),
    ...(questions.length ? ["Questions to confirm:", ...questions.map((question) => `• ${question}`)] : []),
    `${SITE.url}/accessibility#comfort-plan`,
  ].join("\n");

  const sharePlan = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Jesus Festival Comfort Plan", text: planText, url: `${SITE.url}/accessibility#comfort-plan` });
        setShareState("shared");
      } else {
        await navigator.clipboard.writeText(planText);
        setShareState("copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  return (
    <section id="comfort-plan" aria-labelledby="comfort-plan-heading" className="scroll-mt-8 overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-950/45 via-navy-900 to-purple-950/60 shadow-card">
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-6 sm:px-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">Private by design</span>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-400">Your needs, your plan</p>
          </div>
          <h2 id="comfort-plan-heading" className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Build my Comfort Plan</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/70">
            Select anything that would make the weekend easier. Nothing is sent to us or stored in an account—your choices stay on this device.
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <fieldset>
          <legend className="font-display text-lg font-extrabold text-white">What would help you plan with confidence?</legend>
          <p className="mt-1 text-[12px] leading-relaxed text-white/60">Choose as many as you need. These are planning preferences, not a request sent to the festival.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {NEEDS.map((need) => {
              const active = selected.has(need.id);
              return (
                <button
                  key={need.id}
                  type="button"
                  aria-pressed={active}
                  disabled={!ready}
                  onClick={() => toggle(need.id)}
                  className={`min-h-[82px] rounded-2xl border p-3.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:opacity-60 ${
                    active ? "border-emerald-300/55 bg-emerald-400/10 shadow-[0_0_24px_rgba(52,211,153,0.08)]" : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden>{need.emoji}</span>
                    <span className={`text-[13px] font-extrabold ${active ? "text-emerald-200" : "text-white"}`}>{need.label}</span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-white/65">{need.note}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div aria-live="polite" className="rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-white/[0.035] to-transparent p-5 sm:p-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">My private plan</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-white">
            {chosen.length ? `${chosen.length} comfort ${chosen.length === 1 ? "priority" : "priorities"}` : "Choose what would help"}
          </h3>

          {checklist.length ? (
            <div className="mt-5 space-y-5">
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">Personal checklist</h4>
                <ul className="mt-3 space-y-2">
                  {checklist.map((item) => (
                    <li key={item} className="flex gap-2.5 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-white/75">
                      <span className="mt-0.5 text-emerald-300" aria-hidden>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {questions.length ? (
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-purple-200">Questions to confirm before travelling</h4>
                  <ul className="mt-3 space-y-2">
                    {questions.map((question) => (
                      <li key={question} className="rounded-xl border border-purple-300/15 bg-purple-400/[0.06] px-3 py-2.5 text-[12.5px] leading-relaxed text-white/75">{question}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-[13px] leading-relaxed text-white/65">Your tailored checklist and the questions worth confirming will appear here.</p>
          )}

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={sharePlan} disabled={!chosen.length} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow disabled:opacity-45">
              <Share width={15} height={15} /> {shareState === "shared" ? "Plan shared!" : shareState === "copied" ? "Plan copied!" : shareState === "error" ? "Share unavailable" : "Share my Comfort Plan"}
            </button>
            <a href={`mailto:${SITE.email}?subject=Jesus%20Festival%20accessibility%20question`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-sm font-bold text-white">
              Ask the festival team <ArrowRight width={15} height={15} />
            </a>
            <button type="button" onClick={() => { setSelected(new Set()); setShareState("idle"); }} disabled={!chosen.length} className="min-h-11 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-white/65 disabled:opacity-35">
              Clear my plan
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-[12px] leading-relaxed text-amber-50/75">
          <strong className="text-amber-100">Important:</strong> this planner helps you prepare; it does not confirm that a particular accommodation or event-day service is available. Contact the team before travelling when a support is essential.
        </div>

        <p className="text-center text-[11px] leading-relaxed text-white/55">
          Want the general arrival planner too? <Link href="/jesus-festival-hamilton#build-my-plan" className="font-bold text-gold-400 underline underline-offset-2">Build your festival visit plan</Link>.
        </p>
      </div>
    </section>
  );
}
