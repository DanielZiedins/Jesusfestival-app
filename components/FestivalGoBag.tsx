"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Download, MapPin, Share } from "@/components/icons";
import { READINESS_ITEMS, READINESS_STORAGE_KEY } from "@/components/FestivalReadinessChecklist";
import { SCHEDULE, SITE } from "@/lib/content";
import { clientNow, getLineup } from "@/lib/festival";
import { getSpot, nearestLandmark } from "@/lib/park";
import { fetchFestivalForecast, type FestivalForecastDay } from "@/lib/weather";

const OFFLINE_KEY = "jf-offline-ready-v19";
const ARRIVAL_KEY = "jf-arrival-reviewed-v1";
const FESTIVAL_OPEN = new Date("2026-09-04T18:00:00-04:00");
const HAMILTON_TIME = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
});

type OfflineState = "idle" | "saving" | "done" | "error";
type GoBagState = {
  offline: boolean;
  packed: number;
  arrival: boolean;
  lineup: number;
  spot: string | null;
};

const EMPTY_STATE: GoBagState = { offline: false, packed: 0, arrival: false, lineup: 0, spot: null };

function readGoBag(): GoBagState {
  try {
    const raw = JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY) ?? "[]") as unknown;
    const packed = Array.isArray(raw)
      ? raw.filter((id) => READINESS_ITEMS.some((item) => item.id === id)).length
      : 0;
    const spot = getSpot();
    return {
      offline: localStorage.getItem(OFFLINE_KEY) === "saved",
      packed,
      arrival: localStorage.getItem(ARRIVAL_KEY) === "checked",
      lineup: getLineup().length,
      spot: spot ? nearestLandmark(spot.x, spot.y).name : null,
    };
  } catch {
    return EMPTY_STATE;
  }
}

function timeUntilFestival(now: Date) {
  const minutes = Math.max(0, Math.ceil((FESTIVAL_OPEN.getTime() - now.getTime()) / 60_000));
  if (minutes <= 0) return "Festival weekend is here";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"}${remainder ? ` ${remainder} min` : ""} to go`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ${hours % 24} hr to go`;
}

function weatherNote(day: FestivalForecastDay) {
  const wet = /drizzle|rain|shower|thunder/i.test(day.label) || day.rain >= 30;
  if (wet) return "A light rain shell is the safest small add-on.";
  if (day.hi >= 25) return "Bring water, sunscreen and a hat.";
  return "Bring water and a layer; recheck before leaving.";
}

export default function FestivalGoBag() {
  const [now, setNow] = useState<Date | null>(null);
  const [state, setState] = useState<GoBagState>(EMPTY_STATE);
  const [forecast, setForecast] = useState<FestivalForecastDay[] | null>(null);
  const [online, setOnline] = useState(true);
  const [offlineState, setOfflineState] = useState<OfflineState>("idle");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const next = readGoBag();
      setState(next);
      setOfflineState(next.offline ? "done" : "idle");
      setOnline(navigator.onLine);
      setNow(clientNow());
    };
    sync();
    const timer = window.setInterval(() => setNow(clientNow()), 60_000);
    window.addEventListener("storage", sync);
    window.addEventListener("jf-readiness-change", sync);
    window.addEventListener("jf-lineup-change", sync);
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", sync);
      window.removeEventListener("jf-readiness-change", sync);
      window.removeEventListener("jf-lineup-change", sync);
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
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
    const timer = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const readyCount = useMemo(
    () => [state.offline, state.packed >= 4, state.arrival, state.lineup > 0, Boolean(state.spot)].filter(Boolean).length,
    [state],
  );
  const percent = readyCount * 20;

  const markArrival = () => {
    try {
      localStorage.setItem(ARRIVAL_KEY, "checked");
    } catch {
      // The link is still useful when local storage is unavailable.
    }
    setState((current) => ({ ...current, arrival: true }));
  };

  const cacheOffline = async () => {
    if (!("serviceWorker" in navigator) || !navigator.onLine) {
      setOfflineState("error");
      return;
    }
    setOfflineState("saving");
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      navigator.serviceWorker.removeEventListener("message", onMessage);
      window.clearTimeout(timeout);
      setOfflineState(ok ? "done" : "error");
      if (ok) {
        try {
          localStorage.setItem(OFFLINE_KEY, "saved");
        } catch {
          // Success still applies to this browser session.
        }
        setState((current) => ({ ...current, offline: true }));
        setNotice("Festival essentials saved for offline use 🙌");
      }
    };
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "jf-cache-go-bag-done") finish(event.data.ok !== false);
    };
    const timeout = window.setTimeout(() => finish(false), 25_000);
    navigator.serviceWorker.addEventListener("message", onMessage);
    try {
      const registration = await navigator.serviceWorker.ready;
      const worker = navigator.serviceWorker.controller ?? registration.active;
      if (!worker) return finish(false);
      worker.postMessage({ type: "jf-cache-go-bag" });
    } catch {
      finish(false);
    }
  };

  const shareGuide = async () => {
    const data = {
      title: "Jesus Festival — Before You Go",
      text: "Jesus Festival starts Friday at 6 PM at Gage Park! Here is the final schedule, forecast, packing, arrival and offline checklist.",
      url: `${SITE.url}/before-you-go`,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        setNotice("Final guide copied!");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Share JesusFestival.App/before-you-go");
    }
  };

  return (
    <section aria-labelledby="go-bag-heading" className="space-y-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-gold/35 bg-gradient-to-br from-purple-950 via-navy-950 to-ink p-5 shadow-card sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/75">
              <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-300" : "bg-amber-300"}`} />
              {online ? "Final festival prep" : "Offline mode"}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-400">{readyCount}/5 ready</span>
          </div>
          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.22em] text-ember">{now ? timeUntilFestival(now) : "Festival weekend is almost here"}</p>
          <h2 id="go-bag-heading" className="mt-2 font-display text-3xl font-extrabold leading-[1.04] text-white sm:text-5xl">Your five-minute <span className="text-gradient-gold">Festival Go Bag</span></h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/65 sm:text-base">Friday opens at 6 PM and worship begins at 6:30 PM. Finish these five things now, then arriving can simply be about showing up.</p>
          {now && <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Hamilton time · {HAMILTON_TIME.format(now)}</p>}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Festival Go Bag progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className="h-full rounded-full bg-gradient-to-r from-purple-400 via-gold-400 to-emerald-300 transition-[width] duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      {forecast && (
        <section aria-labelledby="go-bag-weather" className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.055] p-5">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-200">Live Gage Park forecast</p><h3 id="go-bag-weather" className="mt-1 font-display text-xl font-extrabold">Pack for the real weekend</h3></div><span className="text-[9px] text-white/40">Open-Meteo</span></div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {forecast.map((day) => (
              <article key={day.name} className="rounded-2xl border border-white/10 bg-black/15 p-3.5 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-200">{day.name}</p>
                <span className="mt-2 block text-3xl" aria-hidden>{day.emoji}</span>
                <p className="mt-1 text-[12px] font-bold">{day.label}</p>
                <p className="mt-1 font-display text-lg font-extrabold">{day.hi}° <span className="text-xs text-white/45">/ {day.lo}°</span></p>
                <p className="mt-1 text-[10px] text-white/55">{day.rain}% rain · {weatherNote(day)}</p>
              </article>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-white/45">Refreshed when this page opens. Recheck before leaving and follow official event announcements if conditions change.</p>
        </section>
      )}

      <section aria-labelledby="final-five-heading">
        <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-400">The final five</p><h3 id="final-five-heading" className="mt-1 font-display text-2xl font-extrabold">Tap each one before Gage Park</h3></div>{readyCount === 5 && <span className="rounded-full bg-emerald-300 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-navy-950">Ready 🙌</span>}</div>
        <div className="mt-4 space-y-2.5">
          <PrepAction ready={state.offline} emoji="📵" title="Save the essentials offline" note={state.offline ? "Schedule, map, help and key guides are saved." : "Do this on good Wi-Fi before the park gets busy."}>
            <button type="button" onClick={cacheOffline} disabled={offlineState === "saving" || offlineState === "done"} className="min-h-11 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-2.5 text-xs font-extrabold text-navy-950 disabled:opacity-60">
              {offlineState === "saving" ? "Saving…" : offlineState === "done" ? "Saved offline" : <span className="inline-flex items-center gap-1.5"><Download width={14} height={14} /> Save now</span>}
            </button>
          </PrepAction>
          {offlineState === "error" && <p role="status" className="-mt-1 rounded-xl border border-rose-300/20 bg-rose-400/[0.08] px-3 py-2 text-[11px] text-rose-200">Connect to the internet, reload once so the app can finish installing its offline worker, then try again.</p>}

          <PrepAction ready={state.packed >= 4} emoji="🎒" title="Pack the core essentials" note={`${state.packed} of ${READINESS_ITEMS.length} core items ready · chair, water, sun protection, layer, shoes and your invitation.`}>
            <Link href="/what-to-bring#packing-planner" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-bold">Open list <ArrowRight width={13} height={13} /></Link>
          </PrepAction>

          <PrepAction ready={state.arrival} emoji="🚧" title="Check your route and leave early" note="Main & Ottawa is closed; Routes 1/1A, 10 and 41 are detoured. Parking is limited.">
            <Link href="/getting-to-gage-park" onClick={markArrival} className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-bold">Plan arrival <ArrowRight width={13} height={13} /></Link>
          </PrepAction>

          <PrepAction ready={Boolean(state.spot)} emoji="📍" title="Choose your meeting landmark" note={state.spot ? `Saved near ${state.spot}. Progress stays on this device.` : "Drop a private pin before your group separates."}>
            <Link href="/map" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-bold">{state.spot ? "View spot" : "Drop my spot"} <MapPin width={13} height={13} /></Link>
          </PrepAction>

          <PrepAction ready={state.lineup > 0} emoji="⭐" title="Star what you do not want to miss" note={state.lineup ? `${state.lineup} festival moment${state.lineup === 1 ? "" : "s"} in My Lineup.` : "Your starred sets stay private and work offline."}>
            <Link href="/schedule" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-bold">Open schedule <ArrowRight width={13} height={13} /></Link>
          </PrepAction>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5" aria-labelledby="weekend-shape-heading">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-purple-200">Save this in your head</p>
        <h3 id="weekend-shape-heading" className="mt-1 font-display text-2xl font-extrabold">The whole weekend in two lines</h3>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {SCHEDULE.days.map((day) => <div key={day.id} className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400">{day.label} · {day.date}</p><p className="mt-1 font-display text-lg font-extrabold">{day.window}</p><p className="mt-1 text-[11.5px] leading-relaxed text-white/55">{day.theme}{day.id === "fri" ? " · Worship starts 6:30 PM" : " · Stage starts 11 AM"}</p></div>)}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-3 py-3 text-center font-display text-sm font-extrabold text-navy-950"><MapPin width={16} height={16} /> Directions</a>
        <button type="button" onClick={shareGuide} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-3 py-3 text-sm font-bold"><Share width={16} height={16} /> Share guide</button>
      </div>

      <Link href="/map#help" className="flex min-h-14 items-center gap-3 rounded-2xl border border-rose-300/25 bg-rose-400/[0.07] p-4"><span className="text-2xl" aria-hidden>⛑️</span><span className="min-w-0 flex-1"><span className="block font-display text-sm font-extrabold">Know where help is</span><span className="block text-[11px] text-white/55">First Aid and Info & Lost Child points · call 911 first for a serious emergency</span></span><ArrowRight width={15} height={15} className="shrink-0 text-rose-200" /></Link>

      {notice && <div role="status" className="fixed inset-x-4 bottom-5 z-50 mx-auto max-w-sm rounded-2xl border border-gold/35 bg-navy-950/95 px-4 py-3 text-center text-sm font-bold text-white shadow-card">{notice}</div>}
    </section>
  );
}

function PrepAction({ ready, emoji, title, note, children }: { ready: boolean; emoji: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <article className={`rounded-2xl border p-4 ${ready ? "border-emerald-300/25 bg-emerald-400/[0.07]" : "border-white/10 bg-white/[0.035]"}`}>
      <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-xl" aria-hidden>{emoji}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h4 className="font-display text-sm font-extrabold text-white">{title}</h4>{ready && <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-300 text-navy-950"><Check width={12} height={12} /></span>}</div><p className="mt-1 text-[11px] leading-relaxed text-white/55">{note}</p><div className="mt-3">{children}</div></div></div>
    </article>
  );
}
