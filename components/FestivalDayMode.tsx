"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Share } from "@/components/icons";
import { SCHEDULE, SITE } from "@/lib/content";
import { clientNow, festivalPhase, nowNext, slotTime, type Slot } from "@/lib/festival";
import { getSpot, nearestLandmark } from "@/lib/park";

const FRIDAY_OPEN = new Date("2026-09-04T18:00:00-04:00");
const SATURDAY_OPEN = new Date("2026-09-05T10:00:00-04:00");
const HAMILTON_TIME = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit" });

function timeUntil(target: Date, now: Date) {
  const minutes = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours < 24) return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ${hours % 24} hr`;
}

function directionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}`;
}

export default function FestivalDayMode() {
  const [now, setNow] = useState<Date | null>(null);
  const [online, setOnline] = useState(true);
  const [meetingSpot, setMeetingSpot] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setNow(clientNow());
      setOnline(navigator.onLine);
      const spot = getSpot();
      setMeetingSpot(spot ? nearestLandmark(spot.x, spot.y).name : null);
    };
    sync();
    const timer = window.setInterval(sync, 30_000);
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const phase = now ? festivalPhase(now) : "before";
  const day = phase === "fri" || phase === "sat" ? SCHEDULE.days.find((item) => item.id === phase) : null;
  const slots = (day?.items ?? []) as Slot[];
  const position = now && day ? nowNext(day.id, slots, now) : { nowIdx: -1, nextIdx: -1 };
  const current = position.nowIdx >= 0 ? slots[position.nowIdx] : null;
  const next = position.nextIdx >= 0 ? slots[position.nextIdx] : null;
  const afterNext = position.nextIdx >= 0 ? slots[position.nextIdx + 1] ?? null : null;
  const nextStart = next && day ? slotTime(day.id, next.time) : null;

  const shareDay = async () => {
    const text = phase === "fri" || phase === "sat"
      ? `${current ? `${current.title} is on now. ` : ""}${next ? `${next.title} is next at ${next.time}. ` : ""}Jesus Festival is free at Gage Park.`
      : "Jesus Festival is September 4–5 at Gage Park. It is free and all ages.";
    const data = { title: "Jesus Festival Day-Of Mode", text, url: `${SITE.url}/day-of` };
    try {
      if (navigator.share) {
        await navigator.share(data);
        setNotice("Day-of link shared!");
      } else {
        await navigator.clipboard.writeText(`${text} ${data.url}`);
        setNotice("Day-of link copied!");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Share JesusFestival.App/day-of");
    }
  };

  const betweenDays = Boolean(now && now >= FRIDAY_OPEN && now < SATURDAY_OPEN);
  const countdownTarget = betweenDays ? SATURDAY_OPEN : FRIDAY_OPEN;
  const status = phase === "before"
    ? { eyebrow: betweenDays ? "See you Saturday" : "Festival countdown", title: now ? `${timeUntil(countdownTarget, now)} until ${betweenDays ? "Saturday opens" : "Gage Park opens"}` : "Festival weekend is almost here", note: betweenDays ? "Saturday activities open at 10 AM, the stage begins at 11 AM, and the final prayer begins at 7 PM." : "Friday gates open at 6 PM. Saturday activities open at 10 AM and the stage begins at 11 AM." }
    : phase === "after"
      ? { eyebrow: "The movement continues", title: "Thank you, Hamilton", note: "Take your next step, share what Jesus did, and stay connected to a local church." }
      : { eyebrow: `Live · ${day?.label ?? "Festival"}`, title: current?.title ?? day?.theme ?? "Jesus Festival is live", note: current?.note ?? `${day?.window} at Gage Park.` };

  return (
    <section aria-labelledby="day-mode-heading" className="space-y-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-ember/40 bg-gradient-to-br from-ember/25 via-purple-950/85 to-ink p-5 shadow-card sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/75">
              <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-300" : "bg-amber-300"}`} />
              {online ? "Live connection" : "Offline essentials"}
            </span>
            <time className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-400">
              {now ? HAMILTON_TIME.format(now) : "Hamilton time"}
            </time>
          </div>

          <div aria-live="polite" className="mt-7">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-ember">
              {(phase === "fri" || phase === "sat") && <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-ember" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" /></span>}
              {status.eyebrow}
            </p>
            <h2 id="day-mode-heading" className="mt-2 font-display text-3xl font-extrabold leading-[1.06] text-white sm:text-5xl">{status.title}</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/65 sm:text-base">{status.note}</p>
          </div>

          {(phase === "fri" || phase === "sat") && (
            <div className="mt-5 grid gap-2.5">
              {next ? (
                <div className="rounded-2xl border border-gold/30 bg-gold/[0.08] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gold-400">Up next</p>
                    {nextStart && now && <span className="text-[10px] font-bold text-white/45">in {timeUntil(nextStart, now)}</span>}
                  </div>
                  <p className="mt-1 font-display text-lg font-extrabold text-white">{next.time} · {next.title}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-white/55">{next.note}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-gold/30 bg-gold/[0.08] p-4 text-sm font-bold text-white/75">This is the final scheduled moment of the day.</div>
              )}
              {afterNext && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3.5">
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.16em] text-white/40">Then</span>
                  <p className="min-w-0 font-display text-sm font-bold text-white/80">{afterNext.time} · {afterNext.title}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {meetingSpot ? (
        <Link href="/map" className="flex min-h-16 items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/[0.08] p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-300/15 text-xl" aria-hidden>📍</span>
          <span className="min-w-0 flex-1"><span className="block text-[9px] font-extrabold uppercase tracking-[0.17em] text-emerald-200">My saved meeting area</span><span className="mt-0.5 block font-display text-base font-extrabold text-white">Near {meetingSpot}</span></span>
          <ArrowRight width={16} height={16} className="shrink-0 text-emerald-200" />
        </Link>
      ) : (
        <Link href="/map" className="flex min-h-16 items-center gap-3 rounded-2xl border border-purple-300/25 bg-purple-400/[0.07] p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-purple-300/15 text-xl" aria-hidden>📍</span>
          <span className="min-w-0 flex-1"><span className="block font-display text-base font-extrabold text-white">Save a meeting spot</span><span className="mt-0.5 block text-[11.5px] text-white/55">Drop a private pin on the festival map before your group separates.</span></span>
          <ArrowRight width={16} height={16} className="shrink-0 text-purple-200" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-2.5" aria-label="Day-of essentials">
        <DayLink href="/schedule" emoji="🗓️" title="Schedule" note="Full run of show" />
        <DayLink href="/map" emoji="🗺️" title="Festival map" note="Zones & meeting spot" />
        <DayLink href="/map#help" emoji="⛑️" title="Get help" note="First aid & lost child" />
        <DayLink href="/offline" emoji="📵" title="Offline" note="No-signal essentials" />
        <DayLink href="/hunt" emoji="🔦" title="Light Hunt" note="Find all 12 lights" />
        <DayLink href="/i-said-yes" emoji="🕊️" title="I said yes" note="Your first steps" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <a href={directionsUrl()} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950 shadow-glow"><MapPin width={16} height={16} /> Directions</a>
        <button type="button" onClick={shareDay} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white"><Share width={16} height={16} /> Share live view</button>
      </div>

      <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-[11px] leading-relaxed text-white/50">Stage times are the best current plan and may move slightly during the live day. Follow announcements, event signs and volunteer direction. Call 911 first for a serious or life-threatening emergency.</p>

      {notice && <div role="status" className="fixed inset-x-4 bottom-5 z-50 mx-auto max-w-sm rounded-2xl border border-gold/35 bg-navy-950/95 px-4 py-3 text-center text-sm font-bold text-white shadow-card">{notice}</div>}
    </section>
  );
}

function DayLink({ href, emoji, title, note }: { href: string; emoji: string; title: string; note: string }) {
  return (
    <Link href={href} className="group min-h-28 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/35 active:scale-[0.99]">
      <span className="text-2xl" aria-hidden>{emoji}</span>
      <span className="mt-2 block font-display text-sm font-extrabold text-white">{title}</span>
      <span className="mt-0.5 block text-[10.5px] leading-snug text-white/50">{note}</span>
    </Link>
  );
}
