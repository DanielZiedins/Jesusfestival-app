"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  PARK_PINS,
  PIN_GROUPS,
  encodeSpot,
  getSpot,
  nearestLandmark,
  parkToLatLng,
  projectToPark,
  readSpotFromHash,
  saveSpot,
  type Pin,
  type Spot,
} from "@/lib/park";
import { haptic } from "@/lib/game";
import { ArrowRight, MapPin, Share } from "@/components/icons";

/**
 * The Gage Park orientation map.
 *
 * Park art is inline SVG (instant, offline, no tiles to download on a
 * congested park network); the pins on top are real HTML buttons so they get
 * proper focus rings, labels and 44px touch targets.
 */

const GROUP_COLOR: Record<Pin["group"], { ring: string; bg: string; text: string }> = {
  stage: { ring: "ring-ember/50", bg: "bg-ember/85", text: "text-ember" },
  care: { ring: "ring-gold/50", bg: "bg-gold/85", text: "text-gold-400" },
  food: { ring: "ring-purple-400/50", bg: "bg-purple-500/85", text: "text-purple-300" },
  family: { ring: "ring-emerald-400/50", bg: "bg-emerald-500/85", text: "text-emerald-300" },
  access: { ring: "ring-white/30", bg: "bg-white/25", text: "text-white/75" },
};

export default function FestivalMap() {
  const [selected, setSelected] = useState<Pin | null>(null);
  const [filter, setFilter] = useState<Pin["group"] | "all">("all");
  const [spot, setSpot] = useState<Spot | null>(null);
  const [dropping, setDropping] = useState(false);
  const [me, setMe] = useState<{ x: number; y: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sharedSpot, setSharedSpot] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // A spot arriving in the URL hash is someone else's — show it without
  // overwriting the pin this phone already dropped.
  //
  // hashchange matters as much as mount: the common case is a friend texting
  // "meet me here" to someone whose app is already open on this screen, and a
  // hash-only navigation never remounts anything.
  useEffect(() => {
    const apply = () => {
      const shared = readSpotFromHash(window.location.hash);
      if (shared) {
        setSpot(shared);
        setSharedSpot(true);
        setSelected(null);
        return;
      }
      const own = getSpot();
      if (own) {
        setSpot(own);
        setSharedSpot(false);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const pins = useMemo(
    () => (filter === "all" ? PARK_PINS : PARK_PINS.filter((p) => p.group === filter)),
    [filter],
  );

  function placeSpot(clientX: number, clientY: number) {
    const box = boardRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = Math.max(2, Math.min(98, ((clientX - box.left) / box.width) * 100));
    const y = Math.max(2, Math.min(98, ((clientY - box.top) / box.height) * 100));
    const next = { x, y };
    setSpot(next);
    setSharedSpot(false);
    saveSpot(next);
    setDropping(false);
    haptic(20);
    setToast(`Spot saved — closest to ${nearestLandmark(x, y).name} 📍`);
  }

  function locate() {
    if (!navigator.geolocation) {
      setToast("This phone won't share its location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const p = projectToPark(pos.coords.latitude, pos.coords.longitude);
        if (!p) {
          setToast("You're not at Gage Park yet — see you Sept 4! 💛");
          return;
        }
        setMe(p);
        haptic(15);
        setToast(`You're closest to ${nearestLandmark(p.x, p.y).name}`);
      },
      () => {
        setLocating(false);
        setToast("Couldn't get your location — check location permissions.");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  }

  async function shareSpot() {
    if (!spot) return;
    const near = nearestLandmark(spot.x, spot.y);
    const url = `https://www.jesusfestival.app/map#${encodeSpot(spot)}`;
    const text = `Here's where we're sitting at Jesus Festival — closest to ${near.name} ${near.emoji}\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ text, title: "Meet me here · Jesus Festival" });
        setToast("Sent 🎉");
        return;
      }
      await navigator.clipboard.writeText(text);
      setToast("Link copied — paste it to your people 💛");
    } catch {
      /* cancelled share sheet — stay quiet */
    }
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Filter rail */}
      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
        <FilterChip on={filter === "all"} onClick={() => setFilter("all")}>
          Everything
        </FilterChip>
        {PIN_GROUPS.map((g) => (
          <FilterChip key={g.id} on={filter === g.id} onClick={() => setFilter(g.id)}>
            {g.emoji} {g.label}
          </FilterChip>
        ))}
      </div>

      {/* ===== The map ===== */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-950 shadow-card">
        <div
          ref={boardRef}
          onClick={(e) => dropping && placeSpot(e.clientX, e.clientY)}
          className={`relative aspect-[4/5] w-full select-none ${dropping ? "cursor-crosshair" : ""}`}
        >
          <ParkArt />

          {/* Drop-a-pin scrim, so it's obvious the next tap places something */}
          {dropping && (
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-ink/45 backdrop-blur-[1px]">
              <p className="rounded-full border border-gold/50 bg-navy-950/90 px-4 py-2 text-[12px] font-bold text-gold-400">
                Tap where you&apos;re sitting
              </p>
            </div>
          )}

          {/* Pins */}
          {pins.map((p) => {
            const c = GROUP_COLOR[p.group];
            const on = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={(e) => {
                  if (dropping) return;
                  e.stopPropagation();
                  setSelected(on ? null : p);
                  haptic(10);
                }}
                aria-label={`${p.name} — ${p.note}`}
                aria-pressed={on}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition active:scale-90"
              >
                <span
                  className={`grid place-items-center rounded-full ring-2 backdrop-blur-sm transition-all ${c.ring} ${
                    on ? `h-9 w-9 text-[17px] ${c.bg} shadow-glow` : `h-7 w-7 text-[13px] bg-navy-950/85`
                  }`}
                >
                  <span aria-hidden="true">{p.emoji}</span>
                </span>
                {p.group === "stage" && !on && (
                  <span className="pointer-events-none absolute -bottom-0.5 whitespace-nowrap rounded-full bg-navy-950/80 px-1.5 text-[8px] font-black uppercase tracking-wider text-ember">
                    {p.id === "stage" ? "Stage" : "Lawn"}
                  </span>
                )}
              </button>
            );
          })}

          {/* Your dropped spot */}
          {spot && (
            <motion.div
              initial={{ scale: 0, y: -14 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="pointer-events-none absolute z-[15] -translate-x-1/2 -translate-y-full"
            >
              <div className="flex flex-col items-center">
                <span className="rounded-full border border-gold/60 bg-navy-950/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-gold-400">
                  {sharedSpot ? "Meet here" : "Your spot"}
                </span>
                <MapPin width={22} height={22} className="-mt-0.5 text-gold-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" />
              </div>
            </motion.div>
          )}

          {/* You are here */}
          {me && (
            <div
              style={{ left: `${me.x}%`, top: `${me.y}%` }}
              className="pointer-events-none absolute z-[14] h-4 w-4 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute inset-0 animate-ping-slow rounded-full bg-sky-400/60" />
              <span className="absolute inset-[3px] rounded-full bg-sky-300 ring-2 ring-white/80" />
            </div>
          )}

          {/* Compass */}
          <div className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-navy-950/70 text-[10px] font-black text-white/70 backdrop-blur">
            N↑
          </div>
        </div>

        <p className="border-t border-white/8 px-3 py-2 text-center text-[10px] font-medium leading-snug text-white/50">
          Orientation guide — not to scale. Festival zones are approximate and confirmed on-site.
        </p>

        {/* Map actions */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/8 p-2.5">
          <MapAction onClick={locate} busy={locating} emoji="📍">
            {locating ? "Finding…" : "Where am I"}
          </MapAction>
          <MapAction onClick={() => setDropping((d) => !d)} active={dropping} emoji="🪧">
            {dropping ? "Cancel" : spot ? "Move spot" : "Drop my spot"}
          </MapAction>
          <MapAction onClick={shareSpot} disabled={!spot} emoji="💬">
            Meet me here
          </MapAction>
        </div>
      </div>

      {spot && (
        <button
          onClick={() => {
            setSpot(null);
            setSharedSpot(false);
            saveSpot(null);
            setToast("Spot cleared");
          }}
          className="mt-2 w-full text-center text-[11px] font-semibold text-white/55 underline-offset-2 hover:underline"
        >
          Clear my spot
        </button>
      )}

      {/* ===== Selected place ===== */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-2xl border border-white/12 bg-white/[0.05] p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-2xl" aria-hidden="true">
              {selected.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold leading-tight text-white">{selected.name}</h3>
                {selected.festival && (
                  <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-gold-400">
                    Approx
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] leading-snug text-white/65">{selected.note}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={(() => {
                const { lat, lng } = parkToLatLng(selected.x, selected.y);
                return `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}&travelmode=walking`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-[13px] font-bold text-white active:scale-95"
            >
              <MapPin width={14} height={14} /> Walk me there
            </a>
            <button
              onClick={() => {
                const next = { x: selected.x, y: selected.y + 5 };
                setSpot(next);
                setSharedSpot(false);
                saveSpot(next);
                haptic(20);
                setToast(`Spot set — ${selected.name} 📍`);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-2.5 text-[13px] font-bold text-navy-950 active:scale-95"
            >
              <Share width={13} height={13} /> Meet me here
            </button>
          </div>
        </motion.div>
      )}

      {/* ===== Everything on the map, as a list ===== */}
      <div className="mt-4 space-y-1.5">
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
          Everything in the park
        </h3>
        {pins.map((p) => {
          const c = GROUP_COLOR[p.group];
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelected(p);
                boardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-left transition active:scale-[0.99]"
            >
              <span className="text-lg" aria-hidden="true">{p.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-white">{p.name}</span>
                <span className={`block text-[11px] font-medium ${c.text}`}>
                  {PIN_GROUPS.find((g) => g.id === p.group)?.label}
                  {p.festival ? " · approximate" : ""}
                </span>
              </span>
              <ArrowRight width={15} height={15} className="shrink-0 text-white/55" />
            </button>
          );
        })}
      </div>

      {toast && (
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-[85] flex justify-center px-4">
          <div className="max-w-[92%] rounded-full border border-gold/40 bg-navy-950/95 px-4 py-2 text-center text-[12.5px] font-bold text-gold-400 shadow-glow backdrop-blur">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-bold transition active:scale-95 ${
        on ? "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950" : "border border-white/15 bg-white/5 text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function MapAction({
  onClick,
  children,
  emoji,
  active,
  busy,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  emoji: string;
  active?: boolean;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || busy}
      className={`flex flex-col items-center gap-0.5 rounded-xl border py-2.5 text-[11px] font-bold transition active:scale-95 disabled:opacity-35 ${
        active ? "border-gold/50 bg-gold/15 text-gold-400" : "border-white/10 bg-white/[0.04] text-white/80"
      }`}
    >
      <span className="text-base leading-none" aria-hidden="true">{emoji}</span>
      {children}
    </button>
  );
}

/**
 * The park itself. One 400×500 viewBox so pin percentages line up exactly with
 * the art (x% → x*4, y% → y*5).
 */
function ParkArt() {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="jf-lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12351f" />
          <stop offset="55%" stopColor="#0d2a19" />
          <stop offset="100%" stopColor="#0a2014" />
        </linearGradient>
        <radialGradient id="jf-stageglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jf-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9b48a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c9b48a" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* Streets around the park */}
      <rect x="0" y="0" width="400" height="500" fill="#080a12" />
      <rect x="0" y="0" width="400" height="26" fill="#151824" />
      <rect x="0" y="474" width="400" height="26" fill="#171a28" />
      <rect x="0" y="0" width="26" height="500" fill="#151824" />
      <g fill="#ffffff" fillOpacity="0.5" fontSize="9.5" fontWeight="700" letterSpacing="1.4">
        <text x="200" y="17" textAnchor="middle">LAWRENCE ROAD</text>
        <text x="205" y="491" textAnchor="middle">MAIN STREET EAST</text>
        <text x="13" y="252" textAnchor="middle" transform="rotate(-90 13 252)">
          GAGE AVENUE
        </text>
      </g>
      {/* Lane markings */}
      <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="7 9">
        <line x1="0" y1="487" x2="400" y2="487" />
        <line x1="0" y1="13" x2="400" y2="13" />
      </g>

      {/* Park body */}
      <rect x="26" y="26" width="374" height="448" rx="10" fill="url(#jf-lawn)" />

      {/* Tree canopy along the edges */}
      <g fill="#0f2d1c" fillOpacity="0.95">
        {[
          [40, 44], [64, 38], [90, 46], [340, 40], [366, 52], [384, 84],
          [40, 120], [38, 200], [42, 300], [38, 380], [44, 448],
          [96, 462], [140, 456], [300, 462], [352, 452], [384, 400],
          [386, 300], [382, 210], [230, 40], [300, 44], [166, 34],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={13} fill="#123a23" />
            <circle cx={cx - 4} cy={cy - 4} r={8} fill="#17492c" fillOpacity="0.8" />
          </g>
        ))}
      </g>

      {/* Formal walk: Gage/Main entrance → fountain → bandshell */}
      <path
        d="M96 470 L112 404 L196 330 L200 178"
        stroke="url(#jf-path)"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cross paths */}
      <path
        d="M40 232 L200 232 L372 232"
        stroke="#c9b48a"
        strokeOpacity="0.16"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M220 40 L220 150"
        stroke="#c9b48a"
        strokeOpacity="0.16"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M120 300 Q200 268 300 300 T372 340"
        stroke="#c9b48a"
        strokeOpacity="0.13"
        strokeWidth="7"
        fill="none"
      />

      {/* Stage glow + the great lawn */}
      <circle cx="200" cy="170" r="120" fill="url(#jf-stageglow)" />
      <rect x="120" y="196" width="160" height="118" rx="12" fill="#F5A623" fillOpacity="0.05" stroke="#F5A623" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="6 5" />

      {/* Bandshell — shell facing the lawn */}
      <g>
        <path d="M170 176 A30 26 0 0 1 230 176 L230 186 L170 186 Z" fill="#241a33" stroke="#F5A623" strokeOpacity="0.55" strokeWidth="2" />
        <path d="M180 176 A20 17 0 0 1 220 176" fill="none" stroke="#F5A623" strokeOpacity="0.3" strokeWidth="1.5" />
        <rect x="166" y="186" width="68" height="6" rx="3" fill="#F5A623" fillOpacity="0.4" />
      </g>

      {/* Gage Family Fountain */}
      <g>
        <circle cx="200" cy="310" r="21" fill="#0b2a3a" stroke="#6fd3f5" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="200" cy="310" r="12" fill="#0e3a4f" stroke="#6fd3f5" strokeOpacity="0.28" strokeWidth="1" />
        <circle cx="200" cy="310" r="4" fill="#6fd3f5" fillOpacity="0.55" />
      </g>

      {/* Rose gardens + greenhouse block */}
      <g>
        <rect x="238" y="118" width="76" height="54" rx="8" fill="#1a3a26" stroke="#ffffff" strokeOpacity="0.1" />
        <g stroke="#e8739a" strokeOpacity="0.4" strokeWidth="2">
          <line x1="248" y1="132" x2="304" y2="132" />
          <line x1="248" y1="146" x2="304" y2="146" />
          <line x1="248" y1="160" x2="304" y2="160" />
        </g>
      </g>

      {/* Spray pad + playground */}
      <g>
        <circle cx="108" cy="225" r="20" fill="#0b2a3a" stroke="#6fd3f5" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
      </g>

      {/* Courts + diamonds */}
      <g stroke="#ffffff" strokeOpacity="0.12" fill="#12321f">
        <rect x="96" y="56" width="52" height="34" rx="4" />
        <rect x="288" y="52" width="70" height="52" rx="4" />
      </g>

      {/* Creek hint on the east */}
      <path d="M372 140 Q352 220 366 300 Q378 360 356 430" stroke="#6fd3f5" strokeOpacity="0.14" strokeWidth="5" fill="none" />

      {/* Entrance markers */}
      <g fill="#F5A623" fillOpacity="0.7">
        <rect x="90" y="466" width="14" height="8" rx="3" />
        <rect x="214" y="26" width="14" height="8" rx="3" />
      </g>
    </svg>
  );
}
