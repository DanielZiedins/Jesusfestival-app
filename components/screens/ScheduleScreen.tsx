"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCHEDULE, SITE, LINKS } from "@/lib/content";
import Reveal, { Eyebrow } from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import { CalendarIcon, MapPin, ArrowRight } from "@/components/icons";

export default function ScheduleScreen() {
  const [day, setDay] = useState(SCHEDULE.days[0].id);
  const active = SCHEDULE.days.find((d) => d.id === day) ?? SCHEDULE.days[0];

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="September 4–5, 2026"
        title="The Schedule"
        subtitle="Two unforgettable days at Gage Park. Here's the shape of the weekend."
        icon={<CalendarIcon width={22} height={22} />}
      />

      {/* Coming soon banner */}
      <Reveal className="mx-auto mb-5 max-w-md">
        <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/12 to-transparent p-3.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-gold-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
          </span>
          <p className="text-[13px] font-medium text-white/80">
            <span className="font-bold text-gold-400">{SCHEDULE.status}.</span>{" "}
            Turn on notifications so you don&apos;t miss set times.
          </p>
        </div>
      </Reveal>

      {/* Day toggle */}
      <div className="mx-auto mb-4 max-w-md">
        <div className="glass grid grid-cols-2 gap-1 rounded-2xl p-1">
          {SCHEDULE.days.map((d) => {
            const on = d.id === day;
            return (
              <button
                key={d.id}
                onClick={() => setDay(d.id)}
                className="relative rounded-xl py-2.5 text-center"
              >
                {on && (
                  <motion.span
                    layoutId="day-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold-400 to-gold-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative block font-display text-sm font-bold ${on ? "text-navy-950" : "text-white"}`}>
                  {d.label}
                </span>
                <span className={`relative block text-[11px] ${on ? "text-navy-950/70" : "text-white/50"}`}>
                  {d.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28 }}
          className="mx-auto max-w-md"
        >
          <div
            className={`mb-4 rounded-2xl border p-4 ${
              active.accent === "ember"
                ? "border-ember/30 bg-gradient-to-br from-ember/12 to-transparent"
                : "border-gold/30 bg-gradient-to-br from-gold/12 to-transparent"
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              {active.label} · {active.date}
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">{active.theme}</h2>
            <div className="mt-1 text-sm font-semibold text-gold-400">{active.window}</div>
            <p className="mt-2 text-[13px] leading-snug text-white/65">{active.blurb}</p>
          </div>

          {active.comingSoon ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="text-4xl">🗓️</div>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">Schedule Coming Soon</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/65">
                The full {active.label} lineup is being finalized — running <span className="font-semibold text-gold-400">{active.window}</span>. Turn on updates to be the first to know!
              </p>
            </div>
          ) : (
            <>
              <div className="relative space-y-2.5 pl-1">
                {active.items.map((item, i) => {
                  const surprise = (item as { surprise?: boolean }).surprise === true;
                  return (
                    <Reveal key={item.title} delay={i * 0.05} y={14}>
                      <div className="flex gap-3.5">
                        <div className="flex w-16 shrink-0 flex-col items-end pt-0.5">
                          <span className={`font-display text-sm font-bold ${surprise ? "text-purple-300" : "text-white"}`}>{item.time}</span>
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span className={`mt-1.5 h-3 w-3 rounded-full ring-4 ${surprise ? "bg-purple-400 ring-purple-400/20" : "bg-gold ring-gold/15"}`} />
                          {i < active.items.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-white/12" />}
                        </div>
                        <div className={`flex-1 pb-3 ${surprise ? "rounded-xl border border-purple-400/25 bg-purple-500/10 px-3 py-2" : ""}`}>
                          <h3 className="font-display text-[15px] font-bold text-white">{item.title}</h3>
                          <p className="mt-0.5 text-[13px] leading-snug text-white/55">{item.note}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <p className="mt-2 rounded-xl bg-white/[0.03] p-3 text-center text-[12px] italic text-white/45">
                Set times are a preview and subject to change. Final schedule coming soon.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Reveal className="mx-auto mt-5 max-w-md space-y-2.5">
        <a
          href={LINKS.eventDetails}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-[0.98]"
        >
          Full Event Details <ArrowRight width={16} height={16} />
        </a>
        <a
          href={LINKS.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-[0.98]"
        >
          <MapPin width={16} height={16} /> {SITE.location}
        </a>
      </Reveal>
    </div>
  );
}
