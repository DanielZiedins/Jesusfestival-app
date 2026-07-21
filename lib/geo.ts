// Countries offered at sign-up, with rough centroid coords for the globe.
export type Country = { name: string; flag: string; lat: number; lng: number };

export const COUNTRIES: Country[] = [
  { name: "Canada", flag: "🇨🇦", lat: 43.25, lng: -79.87 }, // Hamilton-area (most signups are local)
  { name: "United States", flag: "🇺🇸", lat: 39.8, lng: -98.6 },
  { name: "United Kingdom", flag: "🇬🇧", lat: 54.0, lng: -2.0 },
  { name: "Australia", flag: "🇦🇺", lat: -25.0, lng: 133.0 },
  { name: "New Zealand", flag: "🇳🇿", lat: -41.0, lng: 174.0 },
  { name: "Ireland", flag: "🇮🇪", lat: 53.4, lng: -8.0 },
  { name: "Nigeria", flag: "🇳🇬", lat: 9.0, lng: 8.0 },
  { name: "Ghana", flag: "🇬🇭", lat: 7.9, lng: -1.0 },
  { name: "Kenya", flag: "🇰🇪", lat: 0.5, lng: 38.0 },
  { name: "South Africa", flag: "🇿🇦", lat: -29.0, lng: 24.0 },
  { name: "India", flag: "🇮🇳", lat: 22.0, lng: 79.0 },
  { name: "Philippines", flag: "🇵🇭", lat: 13.0, lng: 122.0 },
  { name: "South Korea", flag: "🇰🇷", lat: 36.5, lng: 127.8 },
  { name: "Brazil", flag: "🇧🇷", lat: -10.0, lng: -55.0 },
  { name: "Mexico", flag: "🇲🇽", lat: 23.0, lng: -102.0 },
  { name: "Germany", flag: "🇩🇪", lat: 51.0, lng: 10.0 },
  { name: "Netherlands", flag: "🇳🇱", lat: 52.1, lng: 5.3 },
  { name: "France", flag: "🇫🇷", lat: 46.6, lng: 2.2 },
  { name: "Jamaica", flag: "🇯🇲", lat: 18.1, lng: -77.3 },
  { name: "Other", flag: "🌍", lat: 20.0, lng: 0.0 },
];

export function findCountry(name?: string | null): Country | undefined {
  if (!name) return undefined;
  return COUNTRIES.find((c) => c.name === name);
}
