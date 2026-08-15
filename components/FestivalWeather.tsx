"use client";

import { useEffect, useState } from "react";
import Reveal, { Eyebrow } from "@/components/Reveal";

/**
 * Weekend forecast for Gage Park via Open-Meteo (free, keyless). Forecasts only
 * exist ~16 days out, so this renders nothing until late August and then lights
 * up on its own as the festival approaches — no flag to flip.
 *
 * The window has to be checked before asking: Open-Meteo rejects an
 * out-of-range `start_date` with a 400 rather than an empty result, so firing
 * the request early means a failed request and a console error on every single
 * page load for months.
 */
const API =
  "https://api.open-meteo.com/v1/forecast?latitude=43.243&longitude=-79.828" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
  "&timezone=America%2FToronto&start_date=2026-09-04&end_date=2026-09-05";

// Friday of the festival, and how far ahead Open-Meteo will actually forecast.
const FESTIVAL_START = Date.parse("2026-09-04T00:00:00-04:00");
const FESTIVAL_END = Date.parse("2026-09-06T00:00:00-04:00");
const FORECAST_HORIZON_DAYS = 15;

function forecastAvailable(now = Date.now()): boolean {
  if (now >= FESTIVAL_END) return false; // afterwards there's nothing to forecast
  return FESTIVAL_START - now <= FORECAST_HORIZON_DAYS * 86_400_000;
}

// WMO weather codes, grouped just finely enough to be honest.
function describe(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: "☀️", label: "Sunny" };
  if (code <= 2) return { emoji: "🌤️", label: "Mostly sunny" };
  if (code === 3) return { emoji: "☁️", label: "Cloudy" };
  if (code <= 49) return { emoji: "🌫️", label: "Foggy" };
  if (code <= 59) return { emoji: "🌦️", label: "Drizzle" };
  if (code <= 69) return { emoji: "🌧️", label: "Rain" };
  if (code <= 79) return { emoji: "🌨️", label: "Snow" };
  if (code <= 84) return { emoji: "🌦️", label: "Showers" };
  return { emoji: "⛈️", label: "Thunderstorms" };
}

type Day = { name: string; theme: string; emoji: string; label: string; hi: number; lo: number; rain: number };

export default function FestivalWeather() {
  const [days, setDays] = useState<Day[] | null>(null);

  useEffect(() => {
    if (!forecastAvailable()) return; // too early (or all over) — don't ask
    let cancelled = false;
    fetch(API)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled || !j || j.error) return;
        const d = j?.daily;
        if (!d?.time?.length || d.time.length < 2) return; // out of range → stay hidden
        const names = [
          { name: "Friday", theme: "Pure Worship Night" },
          { name: "Saturday", theme: "Family Festival Day" },
        ];
        setDays(
          names.map((n, i) => ({
            ...n,
            ...describe(Number(d.weather_code[i])),
            hi: Math.round(Number(d.temperature_2m_max[i])),
            lo: Math.round(Number(d.temperature_2m_min[i])),
            rain: Math.round(Number(d.precipitation_probability_max[i] ?? 0)),
          })),
        );
      })
      .catch(() => {
        /* no forecast, no card */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!days) return null;

  return (
    <section className="mt-10 px-4">
      <Reveal className="mx-auto max-w-md">
        <div className="mb-3 text-center">
          <Eyebrow>Festival weekend forecast</Eyebrow>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {days.map((d) => (
            <div key={d.name} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 text-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">{d.name}</div>
              <div className="mt-0.5 text-[10px] text-white/55">{d.theme}</div>
              <div className="mt-2 text-4xl" aria-hidden>{d.emoji}</div>
              <div className="mt-1 text-[13px] font-semibold text-white">{d.label}</div>
              <div className="mt-1.5 font-display text-lg font-extrabold text-white">
                {d.hi}° <span className="text-sm font-bold text-white/55">/ {d.lo}°</span>
              </div>
              <div className="mt-1 text-[11px] text-white/50">💧 {d.rain}% chance of rain</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] italic text-white/50">
          Gage Park, Hamilton · updates daily · rain or shine, we worship
        </p>
      </Reveal>
    </section>
  );
}
