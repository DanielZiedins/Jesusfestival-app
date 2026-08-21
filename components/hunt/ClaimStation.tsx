"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { claim, STATIONS, type ClaimResult } from "@/lib/hunt";
import { haptic } from "@/lib/game";
import { ArrowRight } from "@/components/icons";

/**
 * What someone sees the instant they scan a code in the park. The claim runs on
 * mount so the reward is immediate — no button between finding a light and
 * being told what it means.
 */
export default function ClaimStation({ token }: { token: string }) {
  const [result, setResult] = useState<ClaimResult | null>(null);

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

  const { station, isNew, found, total, justCompleted } = result;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-14 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        <div className="relative mx-auto grid h-28 w-28 place-items-center">
          <div className="absolute inset-0 rounded-full bg-gold/25 blur-2xl" />
          <span className="relative text-6xl" aria-hidden>{station.emoji}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.24em] text-gold-400">
          {justCompleted ? "All nine found" : isNew ? "Light found" : "Already lit"}
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
      </motion.div>

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

      {justCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-3xl border border-gold/50 bg-gradient-to-br from-gold/20 to-transparent p-5"
        >
          <div className="text-4xl" aria-hidden>🏆</div>
          <p className="mt-1.5 font-display text-xl font-extrabold text-white">
            You&apos;re a Light Bearer!
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/70">
            Every lamp is lit. Open your badge to share it and claim your prize.
          </p>
        </motion.div>
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
