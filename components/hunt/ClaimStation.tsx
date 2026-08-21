"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { claim, STATIONS, TOTAL_POINTS, type ClaimResult } from "@/lib/hunt";
import { shareBadge } from "@/components/hunt/BadgeCard";
import { haptic } from "@/lib/game";
import { ArrowRight } from "@/components/icons";

/**
 * What someone sees the instant they scan a code in the park. The claim runs on
 * mount so the reward is immediate — no button between finding a light and
 * being told what it means.
 */
export default function ClaimStation({ token }: { token: string }) {
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 2600);
    return () => clearTimeout(t);
  }, [note]);

  useEffect(() => {
    const r = claim(token);
    setResult(r);
    if (r?.isNew) haptic(r.justCompleted ? [24, 60, 24, 60, 40] : [16, 40, 16]);
  }, [token]);

  if (!result) {
    return (
      <main className="grid min-h-screen place-items-center px-6" role="status" aria-label="Lighting your lamp">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
      </main>
    );
  }

  const { station, isNew, found, total, justCompleted, nextUp } = result;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-14 text-center">
      <div className="jf-pop">
        <div className="relative mx-auto grid h-28 w-28 place-items-center">
          <div className="absolute inset-0 rounded-full bg-gold/25 blur-2xl" />
          <span className="relative text-6xl" aria-hidden>{station.emoji}</span>
        </div>
      </div>

      <div className="jf-rise">
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.24em] text-gold-400">
          {justCompleted ? "All twelve found" : isNew ? "Light found" : "Already lit"}
        </p>
        <h1 className="mt-2 font-display text-[34px] font-extrabold leading-tight text-white">
          {station.name}
        </h1>

        {isNew ? (
          <p className="mt-3 text-[15px] font-bold text-gold-400">
            +{station.points} Light Points for the city
          </p>
        ) : (
          <p className="mt-3 text-[14px] text-white/55">
            You&apos;ve already found this one — no double points, but the verse is worth reading twice.
          </p>
        )}

        <blockquote className="mt-7 border-l-[3px] border-gold pl-5 text-left">
          <p className="font-display text-[18px] italic leading-relaxed text-white/90">
            &ldquo;{station.verse.text}&rdquo;
          </p>
          <cite className="mt-2 block text-[11px] font-bold uppercase not-italic tracking-[0.18em] text-gold-400">
            {station.verse.ref}
          </cite>
        </blockquote>

        <p className="mt-5 text-[14.5px] leading-relaxed text-white/70">{station.word}</p>

        {/* Six of the twelve lights sit in Vendor Row. Say the quiet part out
            loud — the whole point is that people actually stop and talk. */}
        {station.vendor && (
          <p className="mt-4 rounded-2xl border border-teal-300/25 bg-teal-300/[0.06] p-3.5 text-[13px] leading-relaxed text-white/70">
            <span className="font-bold text-white">Say hello while you&apos;re here.</span> This booth
            is somebody&apos;s livelihood and somebody&apos;s offering. Ask them what they make. It
            costs you nothing and it might be the best part of their day.
          </p>
        )}
      </div>

      {/* A cold scanner has never seen the app — tell them what they just joined. */}
      {found === 1 && isNew && (
        <div className="jf-rise mt-7 rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-left">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold-400">
            You just started the Light Hunt
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">
            There are <strong className="text-white">twelve</strong> of these hidden around Gage
            Park — six of them tucked through Vendor Row. Find them all to unlock nine shareable
            badges and pour {TOTAL_POINTS.toLocaleString("en-CA")} Light Points into Revive the City.
            It&apos;s free, there&apos;s nothing to sign up for, and it works even with no signal.
          </p>
        </div>
      )}

      {/* Badge unlocked — shareable right here, no need to go anywhere */}
      {result.newBadges.length > 0 && (
        <div className="jf-pop mt-7 rounded-3xl border border-gold/45 bg-gradient-to-br from-gold/18 to-transparent p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
            {result.newBadges.length > 1 ? "Badges unlocked" : "Badge unlocked"}
          </p>
          {result.newBadges.map((b) => (
            <div key={b.id} className="mt-3">
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-3xl" aria-hidden>{b.emoji}</span>
                <span className="font-display text-xl font-extrabold text-white">{b.name}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{b.blurb}</p>
              <button
                onClick={async () => {
                  haptic(16);
                  const r = await shareBadge(b, found);
                  if (r === "shared") setNote(`${b.emoji} Shared!`);
                  if (r === "downloaded") setNote(`${b.emoji} Saved to your photos 💛`);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-extrabold text-navy-950 active:scale-95"
              >
                Share this badge
              </button>
            </div>
          ))}
          {note && (
            <p role="status" className="mt-3 text-[12.5px] font-bold text-gold-400">
              {note}
            </p>
          )}
        </div>
      )}

      {/* Progress dots */}
      <div className="mt-8 flex justify-center gap-1.5" aria-label={`${found} of ${total} lights found`}>
        {STATIONS.map((s, i) => (
          <span
            key={s.id}
            className={`h-2 w-2 rounded-full ${i < found ? "bg-gold" : "bg-white/15"}`}
          />
        ))}
      </div>
      <p className="mt-2.5 text-[13px] font-bold text-white/70">
        {found} of {total} lights found
      </p>

      {/* Where to walk next. Vendor lights come first in nextUp on purpose. */}
      {nextUp.length > 0 && (
        <div className="jf-rise mt-6 rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-left">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold-400">
            Go hunt this one next
          </p>
          <ul className="mt-3 space-y-3">
            {nextUp.map((s) => (
              <li key={s.id} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-dashed border-white/20 bg-white/[0.04] text-[15px]" aria-hidden>
                  ❓
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-white">{s.where}</span>
                  <span className="block text-[12.5px] leading-snug text-white/55">{s.clue}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {justCompleted && (
        <div className="jf-pop mt-6 rounded-3xl border border-gold/50 bg-gradient-to-br from-gold/20 to-transparent p-5">
          <div className="text-4xl" aria-hidden>🏆</div>
          <p className="mt-1.5 font-display text-xl font-extrabold text-white">
            You&apos;re a Light Bearer!
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/70">
            Every lamp is lit. Open your badge shelf to share what you earned.
          </p>
        </div>
      )}

      <Link
        href="/hunt"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-[15px] font-extrabold text-navy-950 shadow-glow active:scale-95"
      >
        {justCompleted ? "Open your badge" : "See your lights"} <ArrowRight width={16} height={16} />
      </Link>

      <Link href="/" className="mt-4 text-[13px] font-semibold text-white/50 underline underline-offset-4">
        Back to the festival app
      </Link>
    </main>
  );
}
