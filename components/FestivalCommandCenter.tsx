"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { READINESS_ITEMS, READINESS_STORAGE_KEY } from "@/components/FestivalReadinessChecklist";
import { WEEKEND_PASS_STORAGE_KEY } from "@/components/FestivalWeekendPass";
import { ArrowRight, MapPin, Share } from "@/components/icons";
import { SCHEDULE, SITE } from "@/lib/content";
import { clientNow, festivalPhase, getLineup, nowNext, type Slot } from "@/lib/festival";
import { getSpot, nearestLandmark } from "@/lib/park";
import { fetchFestivalForecast, type FestivalForecastDay } from "@/lib/weather";

const FESTIVAL_START = new Date("2026-09-04T18:00:00-04:00");

type PersonalState = {
  attending: boolean;
  packed: number;
  lineup: number;
  spot: string | null;
};

const EMPTY_PERSONAL: PersonalState = { attending: false, packed: 0, lineup: 0, spot: null };

function getPersonalState(): PersonalState {
  try {
    const raw = JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY) ?? "[]") as unknown;
    const packed = Array.isArray(raw)
      ? raw.filter((id) => READINESS_ITEMS.some((item) => item.id === id)).length
      : 0;
    const spot = getSpot();
    return {
      attending: localStorage.getItem(WEEKEND_PASS_STORAGE_KEY) === "saved",
      packed,
      lineup: getLineup().length,
      spot: spot ? nearestLandmark(spot.x, spot.y).name : null,
    };
  } catch {
    return EMPTY_PERSONAL;
  }
}

function beforeLabel(now: Date): string {
  const remaining = Math.max(0, FESTIVAL_START.getTime() - now.getTime());
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  if (days > 0) return `${days} ${days === 1 ? "day" : "days"}, ${hours} hr to go`;
  if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} to go`;
  return "Festival weekend is here";
}

export default function FestivalCommandCenter() {
  const [now, setNow] = useState<Date | null>(null);
  const [personal, setPersonal] = useState<PersonalState>(EMPTY_PERSONAL);
  const [forecast, setForecast] = useState<FestivalForecastDay[] | null>(null);
  const [forecastReady, setForecastReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setPersonal(getPersonalState());
    const tick = () => setNow(clientNow());
    const network = () => setOnline(navigator.onLine);
    sync();
    tick();
    network();
    const timer = window.setInterval(tick, 60_000);
    window.addEventListener("storage", sync);
    window.addEventListener("jf-readiness-change", sync);
    window.addEventListener("jf-weekend-pass-change", sync);
    window.addEventListener("online", network);
    window.addEventListener("offline", network);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", sync);
      window.removeEventListener("jf-readiness-change", sync);
      window.removeEventListener("jf-weekend-pass-change", sync);
      window.removeEventListener("online", network);
      window.removeEventListener("offline", network);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchFestivalForecast(controller.signal).then((days) => {
      if (controller.signal.aborted) return;
      setForecast(days);
      setForecastReady(true);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const phase = now ? festivalPhase(now) : "before";
  const liveDay = phase === "fri" || phase === "sat" ? SCHEDULE.days.find((day) => day.id === phase) : null;
  const liveSlots = (liveDay?.items ?? []) as Slot[];
  const livePosition = now && liveDay ? nowNext(liveDay.id, liveSlots, now) : { nowIdx: -1, nextIdx: -1 };
  const current = livePosition.nowIdx >= 0 ? liveSlots[livePosition.nowIdx] : null;
  const next = livePosition.nextIdx >= 0 ? liveSlots[livePosition.nextIdx] : null;

  const completed = useMemo(
    () => [personal.attending, personal.packed >= 4, personal.lineup > 0].filter(Boolean).length,
    [personal],
  );
  const readiness = Math.round((completed / 3) * 100);

  const nextMove = !personal.attending
    ? { label: "Save my festival weekend", href: "#save-weekend", note: "Keep the dates and your prep progress together." }
    : personal.packed < 4
      ? { label: "Finish my packing list", href: "/map#packing", note: `${personal.packed} of ${READINESS_ITEMS.length} essentials ready.` }
      : personal.lineup === 0
        ? { label: "Build my personal lineup", href: "/schedule", note: "Star the moments you do not want to miss." }
        : { label: "Invite someone to come", href: "#share-weekend", note: "Your plan is strong. Bring someone with you." };

  const toggleWeekend = () => {
    const attending = !personal.attending;
    try {
      if (attending) localStorage.setItem(WEEKEND_PASS_STORAGE_KEY, "saved");
      else localStorage.removeItem(WEEKEND_PASS_STORAGE_KEY);
      window.dispatchEvent(new Event("jf-weekend-pass-change"));
    } catch {
      // Keep the visible plan useful for this visit if storage is unavailable.
    }
    setPersonal((currentState) => ({ ...currentState, attending }));
    setNotice(attending ? "Festival weekend saved on this device 🙌" : "Festival weekend removed.");
  };

  const shareWeekend = async () => {
    const data = {
      title: "Jesus Festival Hamilton 2026",
      text: "Come with me to Jesus Festival at Gage Park, September 4–5. It is free and all ages!",
      url: `${SITE.url}/festival-weekend`,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        setNotice("Invitation shared!");
      } else {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        setNotice("Invitation copied!");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Share JesusFestival.App/festival-weekend");
    }
  };

  const statusTitle = phase === "before"
    ? now ? beforeLabel(now) : "Festival weekend is getting close"
    : phase === "after"
      ? "The weekend continues as a movement"
      : current ? `${current.title} is on now` : `${liveDay?.label ?? "Festival"} is live`;

  return (
    <section aria-labelledby="command-center-heading" className="overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-purple-950/80 via-navy-900 to-ink shadow-card">
      <div className="relative overflow-hidden border-b border-white/10 p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/70">
              <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-300" : "bg-amber-300"}`} />
              {online ? "Live festival hub" : "Offline-ready mode"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-400">Hamilton time</span>
          </div>
          <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.22em] text-purple-200">
            {phase === "fri" || phase === "sat" ? `Live · ${liveDay?.label}` : phase === "after" ? "Keep the fire burning" : "Your next move"}
          </p>
          <h2 id="command-center-heading" className="mt-2 max-w-2xl font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">{statusTitle}</h2>
          {phase === "before" && (
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/65">One place for the forecast, your packing progress, saved lineup, map, arrival plan and the details worth checking before you leave.</p>
          )}
          {(phase === "fri" || phase === "sat") && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-ember/35 bg-ember/10 p-3.5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-ember">On stage</p>
                <p className="mt-1 font-display text-lg font-extrabold text-white">{current?.title ?? liveDay?.theme}</p>
              </div>
              <div className="rounded-2xl border border-gold/25 bg-gold/[0.07] p-3.5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-400">Up next</p>
                <p className="mt-1 font-display text-lg font-extrabold text-white">{next ? `${next.time} · ${next.title}` : "See the full schedule"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <section aria-labelledby="personal-ready-heading" className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
          <div className="flex items-start gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/[0.05]" style={{ background: `conic-gradient(rgb(251 191 36) ${readiness}%, rgba(255,255,255,.08) 0)` }}>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-950 font-display text-sm font-extrabold text-white">{readiness}%</div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-400">My festival readiness</p>
              <h3 id="personal-ready-heading" className="mt-1 font-display text-xl font-extrabold text-white">{completed === 3 ? "You are ready to go 🙌" : `${completed} of 3 core steps ready`}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-white/60">Private on this device. No account and no personal plan is sent to us.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <PrepStat ready={personal.attending} label="Weekend" value={personal.attending ? "Saved" : "Save it"} />
            <PrepStat ready={personal.packed >= 4} label="Packing" value={`${personal.packed}/${READINESS_ITEMS.length}`} />
            <PrepStat ready={personal.lineup > 0} label="My lineup" value={personal.lineup ? `${personal.lineup} starred` : "Start"} />
          </div>

          <div className="mt-4 rounded-2xl border border-purple-300/20 bg-purple-400/[0.07] p-4">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-purple-200">Recommended next</p>
            <p className="mt-1 font-display text-lg font-extrabold text-white">{nextMove.label}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-white/60">{nextMove.note}</p>
            {nextMove.href === "#save-weekend" ? (
              <button id="save-weekend" type="button" onClick={toggleWeekend} className="mt-3 min-h-11 w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950">Save my weekend</button>
            ) : nextMove.href === "#share-weekend" ? (
              <button id="share-weekend" type="button" onClick={shareWeekend} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950"><Share width={15} height={15} /> Invite someone</button>
            ) : (
              <Link href={nextMove.href} className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950">Open this step <ArrowRight width={15} height={15} /></Link>
            )}
          </div>

          {personal.attending && (
            <button type="button" onClick={toggleWeekend} className="mt-3 w-full text-center text-[11px] font-bold text-white/45 hover:text-white/70">Remove saved weekend</button>
          )}
        </section>

        {forecast ? (
          <section aria-labelledby="command-weather-heading">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-200">Gage Park forecast</p>
                <h3 id="command-weather-heading" className="mt-1 font-display text-2xl font-extrabold text-white">Pack for the real weekend</h3>
              </div>
              <span className="text-[10px] text-white/45">Updates daily</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {forecast.map((day) => (
                <article key={day.name} className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.055] p-4 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-200">{day.name}</p>
                  <span className="mt-2 block text-4xl" aria-hidden>{day.emoji}</span>
                  <p className="mt-1 text-[13px] font-bold text-white">{day.label}</p>
                  <p className="mt-1 font-display text-lg font-extrabold text-white">{day.hi}° <span className="text-sm text-white/50">/ {day.lo}°</span></p>
                  <p className="mt-1 text-[10px] text-white/55">{day.rain}% chance of rain</p>
                </article>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-white/45">Forecast provided by Open-Meteo. Check official festival updates before travelling if severe weather is possible.</p>
          </section>
        ) : forecastReady ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-[12px] leading-relaxed text-white/60">The two-day forecast is temporarily unavailable. Pack for an outdoor event and check the News tab before leaving.</p>
        ) : (
          <div className="h-32 animate-pulse rounded-2xl bg-white/[0.045]" aria-label="Loading festival forecast" role="status" />
        )}

        <section aria-labelledby="quick-actions-heading">
          <h3 id="quick-actions-heading" className="font-display text-2xl font-extrabold text-white">Get where you need to go</h3>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <QuickLink href="/schedule" emoji="🗓️" title="Schedule" note="Live now & next" />
            <QuickLink href="/map" emoji="🗺️" title="Festival map" note={personal.spot ? `Spot near ${personal.spot}` : "Drop a meeting spot"} />
            <QuickLink href="/bring-a-group" emoji="🫂" title="Group plan" note="Share one crew brief" />
            <QuickLink href="/map#help" emoji="⛑️" title="Help points" note="First aid & lost child" />
            <QuickLink href="/accessibility" emoji="♿" title="Accessibility" note="Comfort & arrival plan" />
            <QuickLink href="/hunt" emoji="🔦" title="Light Hunt" note="Find all 12 lights" />
            <QuickLink href="/offline" emoji="📵" title="Offline essentials" note="Works with no signal" />
          </div>
        </section>

        <div className="grid gap-2 sm:grid-cols-2">
          <a href="https://www.google.com/maps/dir/?api=1&destination=Gage%20Park%2C%201000%20Main%20St%20E%2C%20Hamilton%2C%20ON" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 font-display text-sm font-extrabold text-navy-950"><MapPin width={16} height={16} /> Directions to Gage Park</a>
          <button type="button" onClick={shareWeekend} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white"><Share width={16} height={16} /> Invite someone</button>
        </div>

        <p aria-live="polite" className="min-h-5 text-center text-[12px] font-bold text-gold-300">{notice}</p>
      </div>
    </section>
  );
}

function PrepStat({ ready, label, value }: { ready: boolean; label: string; value: string }) {
  return (
    <div className={`rounded-2xl border p-3 text-center ${ready ? "border-emerald-300/25 bg-emerald-400/[0.08]" : "border-white/10 bg-black/15"}`}>
      <span className="text-base" aria-hidden>{ready ? "✓" : "○"}</span>
      <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-white/45">{label}</span>
      <strong className={`mt-0.5 block text-[11px] ${ready ? "text-emerald-200" : "text-white/75"}`}>{value}</strong>
    </div>
  );
}

function QuickLink({ href, emoji, title, note }: { href: string; emoji: string; title: string; note: string }) {
  return (
    <Link href={href} className="group flex min-h-[82px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition hover:border-gold/30 hover:bg-white/[0.07] active:scale-[0.99]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-xl" aria-hidden>{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[13px] font-extrabold text-white">{title}</span>
        <span className="mt-0.5 block text-[10.5px] leading-snug text-white/55">{note}</span>
      </span>
      <ArrowRight width={14} height={14} className="shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
    </Link>
  );
}
