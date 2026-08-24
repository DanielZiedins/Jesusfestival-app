"use client";

import { useEffect, useState } from "react";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { fetchFestivalForecast, type FestivalForecastDay } from "@/lib/weather";

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
export default function FestivalWeather() {
  const [days, setDays] = useState<FestivalForecastDay[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetchFestivalForecast(controller.signal).then((forecast) => {
      if (!controller.signal.aborted && forecast) setDays(forecast);
    });
    return () => controller.abort();
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
