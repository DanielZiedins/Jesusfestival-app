/**
 * Festival-weekend forecast shared by the Home screen and Command Center.
 * Open-Meteo is keyless and the request is deliberately limited to Gage Park
 * and the two festival dates.
 */

const API =
  "https://api.open-meteo.com/v1/forecast?latitude=43.243&longitude=-79.828" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
  "&timezone=America%2FToronto&start_date=2026-09-04&end_date=2026-09-05";

const FESTIVAL_START = Date.parse("2026-09-04T00:00:00-04:00");
const FESTIVAL_END = Date.parse("2026-09-06T00:00:00-04:00");
const FORECAST_HORIZON_DAYS = 15;

export type FestivalForecastDay = {
  name: string;
  theme: string;
  emoji: string;
  label: string;
  hi: number;
  lo: number;
  rain: number;
};

export function festivalForecastAvailable(now = Date.now()): boolean {
  if (now >= FESTIVAL_END) return false;
  return FESTIVAL_START - now <= FORECAST_HORIZON_DAYS * 86_400_000;
}

function describeWeather(code: number): { emoji: string; label: string } {
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

export async function fetchFestivalForecast(signal?: AbortSignal): Promise<FestivalForecastDay[] | null> {
  if (!festivalForecastAvailable()) return null;
  try {
    const response = await fetch(API, { signal });
    if (!response.ok) return null;
    const json = await response.json();
    const daily = json?.daily;
    if (json?.error || !daily?.time?.length || daily.time.length < 2) return null;
    const days = [
      { name: "Friday", theme: "Pure Worship Night" },
      { name: "Saturday", theme: "Family Festival Day" },
    ];
    return days.map((day, index) => ({
      ...day,
      ...describeWeather(Number(daily.weather_code[index])),
      hi: Math.round(Number(daily.temperature_2m_max[index])),
      lo: Math.round(Number(daily.temperature_2m_min[index])),
      rain: Math.round(Number(daily.precipitation_probability_max[index] ?? 0)),
    }));
  } catch {
    return null;
  }
}
