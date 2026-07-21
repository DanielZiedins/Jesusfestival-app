"use client";

import { useState } from "react";
import { LINKS, SITE } from "@/lib/content";
import Reveal, { Eyebrow } from "@/components/Reveal";
import ScreenHeader from "@/components/ScreenHeader";
import NotifyForm from "@/components/NotifyForm";
import Globe3D from "@/components/Globe";
import Scripture from "@/components/Scripture";
import { BellIcon, Users, Heart, Sparkle, Share, ArrowRight, Globe, Check } from "@/components/icons";

const INVOLVE = [
  { label: "Volunteer", note: "Serve the city with us", href: LINKS.volunteer, Icon: Users },
  { label: "Become a Sponsor", note: "Partner as a business", href: LINKS.sponsor, Icon: Sparkle },
  { label: "Donate", note: "Fuel the movement", href: LINKS.donate, Icon: Heart },
  { label: "Join the Community", note: "Connect year-round", href: LINKS.community, Icon: Globe },
];

const SOCIALS = [
  { label: "Facebook", href: LINKS.facebook },
  { label: "Instagram", href: LINKS.instagram },
  { label: "YouTube", href: LINKS.youtube },
];

export default function ConnectScreen() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = {
      title: "Jesus Festival — Hamilton 2026",
      text: "Come celebrate what God is doing in Hamilton! Sept 4–5 at Gage Park.",
      url: SITE.url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch {
      /* user cancelled — fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(SITE.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="Stay connected"
        title="Connect"
        subtitle="Be the first to know when artists, the schedule, and more are announced."
        icon={<BellIcon width={22} height={22} />}
      />

      <Reveal className="mx-auto max-w-md">
        <NotifyForm />
      </Reveal>

      {/* Where the movement is spreading */}
      <section className="mt-10">
        <Reveal className="mx-auto mb-3 max-w-md text-center">
          <Eyebrow>One family, many places</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">The movement is spreading</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
            Every dot is a life joining in — roughly where our community is signing up from.
          </p>
        </Reveal>
        <Reveal className="mx-auto max-w-md">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-navy-900/60 to-ink/40 p-4">
            <Globe3D />
          </div>
        </Reveal>
        <Reveal className="mx-auto mt-5 max-w-md">
          <Scripture
            text="That all of them may be one, Father, just as you are in me and I am in you… so that the world may believe."
            reference="John 17:21"
          />
        </Reveal>
        <Reveal className="mx-auto mt-4 max-w-md">
          <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-[13px] leading-relaxed text-white/70">
            There is something powerful when God&apos;s people move as <span className="font-semibold text-white">one</span>. When we lay down our differences, fix our eyes on <span className="font-semibold text-gold-400">Jesus</span>, and love our city together — heaven touches earth. You&apos;re not just a name on a list; you&apos;re part of what God is doing across this city and beyond. 🙌
          </p>
        </Reveal>
      </section>

      {/* Get involved */}
      <section className="mt-8">
        <Reveal className="mx-auto mb-3 max-w-md">
          <h2 className="font-display text-lg font-bold text-white">Get involved</h2>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {INVOLVE.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.06}>
              <a
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.04] p-4 active:scale-[0.98]"
              >
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold-400">
                  <it.Icon width={20} height={20} />
                </div>
                <h3 className="font-display text-[15px] font-bold text-white">{it.label}</h3>
                <p className="mt-0.5 text-[12px] leading-snug text-white/55">{it.note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Share the app */}
      <section className="mt-8">
        <Reveal className="mx-auto max-w-md">
          <button
            onClick={share}
            className="flex w-full items-center gap-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/12 to-transparent p-4 active:scale-[0.99]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold text-navy-950">
              {copied ? <Check width={22} height={22} /> : <Share width={22} height={22} />}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-display text-base font-bold text-white">
                {copied ? "Link copied!" : "Share the app"}
              </h3>
              <p className="text-[13px] text-white/60">Invite your family, friends & church.</p>
            </div>
            <ArrowRight width={18} height={18} className="text-white/40" />
          </button>
        </Reveal>
      </section>

      {/* Socials */}
      <section className="mt-8">
        <Reveal className="mx-auto mb-3 max-w-md">
          <h2 className="font-display text-lg font-bold text-white">Follow along</h2>
        </Reveal>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/8 bg-white/[0.04] py-4 text-center text-sm font-semibold text-white/80 active:scale-95"
              >
                {s.label}
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mt-8">
        <Reveal className="mx-auto max-w-md">
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-medium text-white/70 active:scale-[0.98]"
          >
            {SITE.email}
          </a>
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-md text-center">
          <p className="text-[12px] italic leading-relaxed text-white/40">
            It&apos;s all about Jesus. All glory belongs to Him.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
