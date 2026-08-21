"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BADGES,
  earnedBadges,
  HUNT_POINTS_BONUS,
  getProgress,
  markSynced,
  pendingPoints,
  PARK_STATIONS,
  STATIONS,
  TOTAL_POINTS,
  VENDOR_STATIONS,
  type Badge,
  type Station,
} from "@/lib/hunt";
import { contributePoints, haptic } from "@/lib/game";
import { shareLightBearerCard } from "@/components/hunt/LightBearerCard";
import { shareBadge } from "@/components/hunt/BadgeCard";
import { ArrowRight, Check, Share, Sparkle } from "@/components/icons";

/**
 * The twelve lamps, split into Around the Park and Vendor Row. Lit ones show
 * their verse; unlit ones show only a location and a clue,
 * so the hunt still has something to find.
 */
export default function HuntBoard({ highlight }: { highlight?: string }) {
  const [found, setFound] = useState<string[] | null>(null);
  const [open, setOpen] = useState<Station | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const [badges, setBadges] = useState<Badge[]>([]);

  const refresh = useCallback(() => {
    const p = getProgress();
    setFound(p.found);
    setBadges(earnedBadges(p));
  }, []);

  useEffect(() => {
    refresh();
    // Coming back from a scan in another tab should update the board.
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [refresh]);

  // Deliver any points earned while the park network was down.
  useEffect(() => {
    if (!found?.length || syncing) return;
    const { points, ids } = pendingPoints();
    if (points <= 0) return;
    setSyncing(true);
    contributePoints(points, ids.filter((id) => id !== "__bonus").length)
      .then((res) => {
        if (res) markSynced(ids);
      })
      .finally(() => setSyncing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found]);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 2600);
    return () => clearTimeout(t);
  }, [note]);

  if (!found) {
    return (
      <div className="grid grid-cols-3 gap-2.5" role="status" aria-label="Loading your hunt progress">
        {STATIONS.map((s) => (
          <div key={s.id} className="aspect-square animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  const lit = new Set(found);
  const count = found.length;
  const complete = count === STATIONS.length;
  const pct = Math.round((count / STATIONS.length) * 100);
  const earned =
    STATIONS.filter((s) => lit.has(s.id)).reduce((n, s) => n + s.points, 0) + (complete ? HUNT_POINTS_BONUS : 0);

  return (
    <div>
      {/* Progress */}
      <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-purple-900/20 to-transparent p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Lights found</p>
            <p className="mt-1 font-display text-4xl font-extrabold leading-none text-white">
              {count}
              <span className="text-2xl text-white/40"> / {STATIONS.length}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Light Points</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-gradient-gold">
              {earned.toLocaleString("en-CA")}
            </p>
          </div>
        </div>

        {/* Width is applied directly, with a CSS transition for the sweep. A
            JS-driven width animation stalls at its start value when rAF is
            throttled (backgrounded tab, low-power mode) — which would show an
            empty bar to someone who has actually found every light. */}
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-400 to-ember transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-white/65">
          {complete
            ? "Every lamp is lit. You carried light across this whole park today. 🎉"
            : count === 0
              ? `Twelve QR codes are hidden around Gage Park — six of them through Vendor Row. Find them all to become a Light Bearer and pour ${TOTAL_POINTS.toLocaleString("en-CA")} Light Points into Revive the City.`
              : `${STATIONS.length - count} to go. Keep your eyes open — they're near the places people gather.`}
        </p>
      </div>

      {/* Completion reward */}
      {complete && (
        <div className="jf-rise mt-4 overflow-hidden rounded-3xl border border-gold/50 bg-gradient-to-br from-gold/20 via-ember/10 to-transparent p-6 text-center">
          <div className="text-5xl" aria-hidden>🏆</div>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.24em] text-gold-400">Light Bearer</p>
          <h2 className="mt-1.5 font-display text-2xl font-extrabold text-white">You found all twelve ✨</h2>
          <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-white/70">
            &ldquo;Let your light shine before others, that they may see your good deeds and glorify your
            Father in heaven.&rdquo; — Matthew 5:16
          </p>
          <button
            onClick={async () => {
              haptic(18);
              const r = await shareLightBearerCard();
              if (r === "shared") setNote("Shared 🎉");
              if (r === "downloaded") setNote("Saved to your photos 💛");
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-display text-[15px] font-extrabold text-navy-950 shadow-glow active:scale-95"
          >
            <Share width={16} height={16} /> Share your badge
          </button>
          <p className="mt-3 text-[12px] leading-relaxed text-white/50">
            All nine badges are yours to keep and post anywhere. Show this screen to a volunteer —
            they&apos;ll want to celebrate with you.
          </p>
        </div>
      )}

      {/* Badge shelf — every badge is a real image you can post */}
      <section className="mt-5" aria-labelledby="hunt-badges-heading">
        <div className="mb-2.5 flex items-baseline justify-between gap-2">
          <h2 id="hunt-badges-heading" className="text-[11px] font-black uppercase tracking-[0.2em] text-gold-400">
            Your badges
          </h2>
          <span className="text-[11px] font-bold text-white/45">
            {badges.length} of {BADGES.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {BADGES.map((b) => {
            const got = badges.some((x) => x.id === b.id);
            return (
              <button
                key={b.id}
                onClick={async () => {
                  if (!got) {
                    setNote(`🔒 ${b.hint}`);
                    return;
                  }
                  haptic(16);
                  const r = await shareBadge(b, count);
                  if (r === "shared") setNote(`${b.emoji} Shared!`);
                  if (r === "downloaded") setNote(`${b.emoji} Saved to your photos 💛`);
                }}
                aria-label={got ? `Share your ${b.name} badge` : `${b.name} — locked. ${b.hint}`}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition active:scale-95 ${
                  got
                    ? "border-gold/40 bg-gradient-to-br from-gold/15 to-transparent"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <span className={`text-[26px] ${got ? "" : "opacity-30 grayscale"}`} aria-hidden>
                  {got ? b.emoji : "🔒"}
                </span>
                <span className={`text-[10.5px] font-bold leading-tight ${got ? "text-white" : "text-white/40"}`}>
                  {b.name}
                </span>
                {got && <span className="text-[9px] font-black uppercase tracking-wider text-gold-400">Tap to share</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* The twelve lamps, in their two groups. Splitting them makes it obvious
          that half the hunt lives in Vendor Row — which is the point. */}
      {[
        { key: "park", label: "Around the Park", group: PARK_STATIONS, note: "Stage, lawn, kids, food, water, info." },
        {
          key: "vendor",
          label: "Vendor Row",
          group: VENDOR_STATIONS,
          note: "Six lights among the makers and ministries. Say hello while you're there.",
        },
      ].map((section) => {
        const done = section.group.filter((s) => lit.has(s.id)).length;
        return (
          <section key={section.key} className="mt-6" aria-labelledby={`lamps-${section.key}`}>
            <div className="mb-2.5 flex items-baseline justify-between gap-2">
              <h2
                id={`lamps-${section.key}`}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-gold-400"
              >
                {section.label}
              </h2>
              <span className="text-[11px] font-bold text-white/45">
                {done} of {section.group.length}
              </span>
            </div>
            <p className="mb-2.5 text-[12px] leading-relaxed text-white/45">{section.note}</p>
            <div className="grid grid-cols-3 gap-2.5">
              {section.group.map((s) => {
                const on = lit.has(s.id);
                const isNew = highlight === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      haptic(8);
                      setOpen(s);
                    }}
                    aria-label={on ? `${s.name} — found` : `Not found yet — look near ${s.where}`}
                    className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center transition ${
                      on
                        ? "border-gold/50 bg-gradient-to-br from-gold/20 to-transparent shadow-glow"
                        : "border-dashed border-white/15 bg-white/[0.03]"
                    } ${isNew ? "ring-2 ring-gold" : ""}`}
                  >
                    <span className={`text-2xl ${on ? "" : "opacity-25 grayscale"}`} aria-hidden>
                      {on ? s.emoji : "❓"}
                    </span>
                    <span className={`text-[10px] font-bold leading-tight ${on ? "text-white" : "text-white/40"}`}>
                      {on ? s.name : s.where.replace("Vendor Row · ", "")}
                    </span>
                    {on && (
                      <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-navy-950">
                        <Check width={10} height={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {note && (
        <p role="status" className="mt-3 text-center text-[13px] font-bold text-gold-400">
          {note}
        </p>
      )}

      <Link
        href="/map"
        className="mt-5 flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-[0.98]"
      >
        Open the park map <ArrowRight width={15} height={15} />
      </Link>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">
        Works with no signal — your lamps are saved on this phone and your points reach the city
        the moment you reconnect.
      </p>

      {/* Detail sheet */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.name}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/90 p-4 backdrop-blur sm:items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/15 bg-navy-950 p-6 text-center"
          >
            <div className="text-4xl" aria-hidden>{lit.has(open.id) ? open.emoji : "❓"}</div>
            <h3 className="mt-2 font-display text-xl font-extrabold text-white">
              {lit.has(open.id) ? open.name : "Not found yet"}
            </h3>
            <p className="mt-1 text-[12px] font-bold uppercase tracking-wider text-gold-400">{open.where}</p>

            {lit.has(open.id) ? (
              <>
                <p className="mt-4 font-display text-[16px] italic leading-relaxed text-white/85">
                  &ldquo;{open.verse.text}&rdquo;
                </p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">
                  {open.verse.ref}
                </p>
                <p className="mt-4 text-[13.5px] leading-relaxed text-white/65">{open.word}</p>
              </>
            ) : (
              <>
                <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/[0.06] p-4">
                  <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-gold-400">Your clue</p>
                  <p className="mt-1.5 font-display text-[15.5px] italic leading-relaxed text-white/85">
                    {open.clue}
                  </p>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-white/60">
                  Look for a Jesus Festival QR code near the{" "}
                  <strong className="text-white">{open.where}</strong>. Scan it with your camera and
                  this lamp lights up.
                </p>
              </>
            )}

            <button
              onClick={() => setOpen(null)}
              className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function HuntTeaser() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => setCount(getProgress().found.length), []);

  return (
    <Link
      href="/hunt"
      className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-purple-900/30 via-gold/[0.08] to-transparent p-4 text-left active:scale-[0.99]"
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-2xl" aria-hidden>
        🔦
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-base font-bold text-white">The Light Hunt</span>
          {count !== null && count > 0 && (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-black text-gold-400">
              {count}/{STATIONS.length}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-white/60">
          Find twelve hidden QR codes around Gage Park and light up the city.
        </span>
      </span>
      <Sparkle width={18} height={18} className="shrink-0 text-gold-400" />
    </Link>
  );
}
