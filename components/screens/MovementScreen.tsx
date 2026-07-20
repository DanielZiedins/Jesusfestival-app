"use client";

import { MOVEMENT, CITIES, IMPACT, LINKS, IMG } from "@/lib/content";
import Reveal, { Eyebrow } from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import ParallaxImage from "@/components/ParallaxImage";
import { FlameIcon, Globe, ArrowRight, CrossIcon, MapPin } from "@/components/icons";

export default function MovementScreen() {
  return (
    <div className="pb-6">
      <div className="px-4">
        <ScreenHeader
          eyebrow="More than a festival"
          title="A Movement"
          subtitle={MOVEMENT.line}
          icon={<FlameIcon width={22} height={22} />}
        />
      </div>

      {/* Vision statement */}
      <section className="px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/12 via-transparent to-ember/10 p-6 text-center">
            <h2 className="font-display text-2xl font-bold leading-snug text-white">
              &ldquo;Gather the Church.
              <br />
              Reach the city.
              <br />
              <span className="text-gradient-gold">Leave a movement.&rdquo;</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-white/70">{MOVEMENT.body}</p>
          </div>
        </Reveal>
      </section>

      {/* Pillars */}
      <section className="mt-6 px-4">
        <div className="mx-auto grid max-w-md grid-cols-1 gap-2.5">
          {MOVEMENT.pillars.map((p, i) => (
            <Reveal key={p} delay={i * 0.08}>
              <div className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-400">
                  <CrossIcon width={20} height={20} />
                </div>
                <span className="font-display text-base font-bold text-white">{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* From one city to the nations */}
      <section className="mt-10">
        <ParallaxImage
          src={IMG.worshipDusk}
          alt="Worship at dusk"
          className="min-h-[380px]"
          overlay="bg-gradient-to-b from-ink via-ink/75 to-ink"
        >
          <div className="flex h-full flex-col justify-center px-5 py-10">
            <Reveal className="mx-auto w-full max-w-md text-center">
              <Eyebrow>From one city to the nations</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">
                {MOVEMENT.path}
              </h2>
            </Reveal>
            <div className="mx-auto mt-6 w-full max-w-md space-y-3">
              {CITIES.map((c, i) => (
                <Reveal key={c.city} delay={i * 0.1}>
                  <div
                    className={`flex items-center gap-3.5 rounded-2xl border p-4 ${
                      c.active
                        ? "border-gold/30 bg-gold/10"
                        : "border-dashed border-white/20 bg-white/[0.03]"
                    }`}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                        c.active ? "bg-gold text-navy-950" : "bg-white/10 text-white/60"
                      }`}
                    >
                      {c.active ? <MapPin width={18} height={18} /> : <Globe width={18} height={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-white">{c.city}</h3>
                        <span className="text-[11px] text-white/45">{c.region}</span>
                      </div>
                      <p className="text-[13px] text-white/60">{c.note}</p>
                    </div>
                    {c.active && (
                      <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-400">
                        Live
                      </span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </ParallaxImage>
      </section>

      {/* Impact full list */}
      <section className="mt-12 px-4">
        <Reveal className="mb-4 text-center">
          <Eyebrow>Two years of fruit</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">The impact so far</h2>
        </Reveal>
        <div className="mx-auto max-w-md space-y-2.5">
          {IMPACT.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
              <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-gradient-to-r from-white/[0.05] to-transparent p-4">
                <div className="w-28 shrink-0 font-display text-xl font-extrabold text-gradient-gold">
                  {m.stat}
                </div>
                <div className="text-[13px] leading-snug text-white/65">{m.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scripture */}
      <section className="mt-12 px-6">
        <Reveal className="mx-auto max-w-md text-center">
          <CrossIcon width={28} height={28} className="mx-auto text-gold-400" />
          <p className="mt-3 font-display text-lg italic leading-relaxed text-white/85">
            &ldquo;{MOVEMENT.scripture.text}&rdquo;
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            — {MOVEMENT.scripture.ref}
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mt-10 px-4">
        <Reveal className="mx-auto max-w-md">
          <a
            href={MOVEMENT.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ember-500 to-gold-500 py-4 font-display text-base font-bold text-navy-950 shadow-glow-ember active:scale-[0.98]"
          >
            <FlameIcon width={19} height={19} /> {MOVEMENT.cta.label}
            <ArrowRight width={17} height={17} />
          </a>
          <p className="mt-2.5 text-center text-[12px] text-white/45">
            Feel the stir to start one in your city? The movement site shows you how.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
