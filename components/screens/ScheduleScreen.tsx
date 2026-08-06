"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SCHEDULE, SITE, LINKS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import { CalendarIcon, MapPin, ArrowRight, Share } from "@/components/icons";
import { clientNow, defaultDayId, festivalPhase, getLineup, nowNext, shareSlot, slotId, toggleLineup, type Slot } from "@/lib/festival";

// Build a universal .ics (Fri worship + Sat festival day) and hand it to the OS calendar.
function addFestivalToCalendar() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jesus Festival//Hamilton 2026//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:jf2026-friday@jesusfestival.app",
    "DTSTAMP:20260801T120000Z",
    "DTSTART:20260904T223000Z", // Fri Sept 4, 6:30 PM EDT
    "DTEND:20260905T010000Z", // 9:00 PM EDT
    "SUMMARY:Jesus Festival — Pure Worship Night",
    "LOCATION:Gage Park, 1000 Main St E, Hamilton, ON",
    "DESCRIPTION:Worship led by Bethel Gospel Tabernacle. Gates 6:00 PM, worship 6:30 PM. https://www.jesusfestival.app",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "UID:jf2026-saturday@jesusfestival.app",
    "DTSTAMP:20260801T120000Z",
    "DTSTART:20260905T140000Z", // Sat Sept 5, 10:00 AM EDT
    "DTEND:20260905T220000Z", // 6:00 PM EDT
    "SUMMARY:Jesus Festival — Family Festival Day",
    "LOCATION:Gage Park, 1000 Main St E, Hamilton, ON",
    "DESCRIPTION:Free family festival — food trucks, kids zone, live music, worship & more. https://www.jesusfestival.app",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  try {
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jesus-festival-2026.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch {
    /* ignore */
  }
}

export default function ScheduleScreen() {
  const [day, setDay] = useState(SCHEDULE.days[0].id);
  const active = SCHEDULE.days.find((d) => d.id === day) ?? SCHEDULE.days[0];

  // Personal lineup + the live clock are client-only, so they're set after mount
  // to keep the server and first client render identical.
  const [lineup, setLineup] = useState<string[]>([]);
  const [onlyMine, setOnlyMine] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Self-clearing confirmation for share actions.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setLineup(getLineup());
    setDay(defaultDayId(clientNow()));
    setNow(clientNow());
    // A minute is plenty of resolution for a run sheet, and it keeps the
    // "NOW" marker honest without pinning a timer to every second.
    const t = setInterval(() => setNow(clientNow()), 60_000);
    return () => clearInterval(t);
  }, []);

  const phase = now ? festivalPhase(now) : "before";
  const isLiveDay = phase === active.id;
  const { nowIdx, nextIdx } = useMemo(
    () => (now && isLiveDay ? nowNext(active.id, active.items as Slot[], now) : { nowIdx: -1, nextIdx: -1 }),
    [now, isLiveDay, active],
  );

  const mineOnThisDay = active.items.filter((s) => lineup.includes(slotId(active.id, s as Slot))).length;
  const shown = onlyMine
    ? active.items.filter((s) => lineup.includes(slotId(active.id, s as Slot)))
    : active.items;

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
            <span className="font-bold text-gold-400">{SCHEDULE.status}! 🎉</span>{" "}
            Hosted by {SCHEDULE.hosts}. Turn on alerts for any last-minute changes.
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
                aria-pressed={on}
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
      {/* Keyed remount, no AnimatePresence: a stalled exit (throttled rAF / battery
          saver) must never leave the wrong day on screen at the festival. */}
      <div>
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
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
              {/* Live-day banner: on Sept 4–5 this screen becomes a run-of-show tracker. */}
              {isLiveDay && nowIdx >= 0 && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/20 to-transparent p-3.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-ember" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
                  </span>
                  <p className="min-w-0 flex-1 text-[13px] text-white/80">
                    <span className="font-bold text-white">On stage now:</span>{" "}
                    <span className="text-gold-400">{active.items[nowIdx].title}</span>
                  </p>
                  <button
                    onClick={() => document.getElementById("jf-now")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="shrink-0 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white active:scale-95"
                  >
                    Jump
                  </button>
                </div>
              )}

              {/* My Lineup filter — only worth showing once something is starred. */}
              {mineOnThisDay > 0 && (
                <div className="mb-3.5 flex gap-2">
                  <button
                    onClick={() => setOnlyMine(false)}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition active:scale-95 ${
                      onlyMine ? "border border-white/15 bg-white/5 text-white/70" : "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950"
                    }`}
                  >
                    Full day
                  </button>
                  <button
                    onClick={() => setOnlyMine(true)}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition active:scale-95 ${
                      onlyMine ? "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950" : "border border-white/15 bg-white/5 text-white/70"
                    }`}
                  >
                    ⭐ My Lineup · {mineOnThisDay}
                  </button>
                </div>
              )}

              <div className="relative space-y-2.5 pl-1">
                {shown.map((item, i) => {
                  const it = item as Slot;
                  const featured = it.featured === true;
                  const kind = it.kind ?? "moment";
                  const isArtist = kind === "artist";
                  const isSpeaker = kind === "speaker";
                  // Color-codes the day at a glance: gold = music, purple = spoken, white = moment.
                  const timeColor = isArtist ? "text-gold-400" : isSpeaker ? "text-purple-300" : "text-white/80";
                  const dotColor = isArtist ? "bg-gold ring-gold/25" : isSpeaker ? "bg-purple-400 ring-purple-400/20" : "bg-white/70 ring-white/15";
                  // Indices are relative to the full day, so live markers survive filtering.
                  const realIdx = active.items.indexOf(item);
                  const isNow = realIdx === nowIdx;
                  const isNext = realIdx === nextIdx;
                  const done = isLiveDay && nowIdx >= 0 && realIdx < nowIdx;
                  const id = slotId(active.id, it);
                  const starred = lineup.includes(id);
                  return (
                    <Reveal key={`${it.time}-${it.title}`} delay={Math.min(i * 0.035, 0.45)} y={14}>
                      <div
                        id={isNow ? "jf-now" : undefined}
                        className={`flex scroll-mt-24 gap-3.5 transition-opacity ${done ? "opacity-45" : ""}`}
                      >
                        <div className="flex w-[68px] shrink-0 flex-col items-end pt-0.5">
                          <span className={`font-display text-[13px] font-bold leading-tight ${isNow ? "text-ember" : timeColor}`}>{it.time}</span>
                          {isNow && <span className="mt-1 rounded-full bg-ember px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">Now</span>}
                          {isNext && <span className="mt-1 rounded-full border border-gold/40 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-gold-400">Next</span>}
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span
                            className={`mt-1.5 h-3 w-3 rounded-full ring-4 ${isNow ? "bg-ember ring-ember/30" : dotColor}`}
                          />
                          {i < shown.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-white/12" />}
                        </div>
                        <div
                          className={`flex-1 pb-3.5 ${
                            isNow
                              ? "rounded-xl border border-ember/50 bg-gradient-to-br from-ember/15 to-transparent px-3.5 py-3"
                              : featured
                                ? "rounded-xl border border-gold/40 bg-gradient-to-br from-gold/12 to-transparent px-3.5 py-3"
                                : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <h3 className="min-w-0 flex-1 font-display text-[15px] font-bold leading-snug text-white">
                              {isArtist && <span className="mr-1.5 text-gold-400">♪</span>}
                              {it.title}
                            </h3>
                            <button
                              onClick={async () => {
                                const r = await shareSlot(active.label, active.date, it);
                                if (r) setToast(r === "shared" ? "Shared 🎉" : "Copied — paste it to a friend 💛");
                              }}
                              aria-label={`Share ${it.title}`}
                              className="-mt-0.5 shrink-0 rounded-full p-1.5 text-white/25 transition hover:text-white/50 active:scale-90"
                            >
                              <Share width={15} height={15} />
                            </button>
                            <button
                              onClick={() => setLineup(toggleLineup(id))}
                              aria-pressed={starred}
                              aria-label={starred ? `Remove ${it.title} from My Lineup` : `Add ${it.title} to My Lineup`}
                              className={`-mt-0.5 shrink-0 rounded-full p-1.5 text-[15px] leading-none transition active:scale-90 ${
                                starred ? "text-gold-400" : "text-white/25 hover:text-white/50"
                              }`}
                            >
                              {starred ? "★" : "☆"}
                            </button>
                          </div>
                          <p className="mt-0.5 text-[12.5px] leading-snug text-white/55">{it.note}</p>
                          {featured && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src="/brand/bethel-logo-white.png" alt="Bethel Gospel Tabernacle" className="mt-2.5 h-7 w-auto max-w-[72%] object-contain opacity-95" />
                          )}
                          {it.href && (
                            <a href={it.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-gold-400 active:scale-95">
                              bethelhamilton.com <ArrowRight width={12} height={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {onlyMine && shown.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <div className="text-3xl">⭐</div>
                  <p className="mt-2 text-sm text-white/65">Nothing starred for {active.label} yet — tap ☆ on any set to build your lineup.</p>
                </div>
              )}

              <p className="mt-2 rounded-xl bg-white/[0.03] p-3 text-center text-[12px] italic leading-relaxed text-white/45">
                {SCHEDULE.approximate}
              </p>
            </>
          )}
        </motion.div>
      </div>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-24 z-[85] flex justify-center px-4"
        >
          <div className="rounded-full border border-gold/40 bg-navy-950/95 px-4 py-2 text-[13px] font-bold text-gold-400 shadow-glow backdrop-blur">
            {toast}
          </div>
        </div>
      )}

      <Reveal className="mx-auto mt-5 max-w-md space-y-2.5">
        <button
          onClick={addFestivalToCalendar}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-[0.98]"
        >
          <CalendarIcon width={16} height={16} /> Add to Calendar
        </button>
        <a
          href={LINKS.eventDetails}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-[0.98]"
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
