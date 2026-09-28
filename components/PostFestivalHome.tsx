import Image from "next/image";
import Link from "next/link";
import { IMG, LINKS, POST_EVENT, SITE } from "@/lib/content";
import type { TabId } from "@/components/BottomNav";
import Reveal, { Eyebrow } from "@/components/Reveal";
import Scripture from "@/components/Scripture";
import SearchPill from "@/components/SearchPill";
import {
  ArrowRight,
  Camera,
  CrossIcon,
  FlameIcon,
  Globe,
  Heart,
  Share,
  Sparkle,
  Users,
} from "@/components/icons";

type Props = {
  go: (tab: TabId, sub?: string) => void;
  onSearch?: () => void;
};

const THANK_YOUS = [
  {
    emoji: "🫶",
    title: "To every volunteer",
    text: "You carried, cooked, welcomed, prayed, cleaned, served, stayed late and gave so much of yourselves. This weekend could not have happened without you. We love you guys.",
  },
  {
    emoji: "🎤",
    title: "To every artist & ministry",
    text: "Thank you for bringing your gifts, your stories and your wholehearted worship. You helped lift the name of Jesus over Hamilton.",
  },
  {
    emoji: "🤝",
    title: "To every vendor & partner",
    text: "Thank you for showing up, serving families and helping build a joyful place for the city. Please keep supporting the amazing people and work you discovered.",
  },
  {
    emoji: "🙌",
    title: "To everyone who came",
    text: "Thank you for worshipping, inviting, sharing, bringing a friend and helping spread the word. Every person who showed up became part of the story.",
  },
] as const;

const NEXT_STEPS = [
  {
    eyebrow: "Hamilton area",
    title: "Keep reaching Hamilton",
    text: "Join the local outreach family and keep putting love into action across the city.",
    href: "https://loveonhamilton.com",
    label: "Love on Hamilton",
    icon: Users,
    accent: "border-emerald-300/30 bg-emerald-400/[0.08] text-emerald-200",
  },
  {
    eyebrow: "Anywhere in the world",
    title: "Join or start an outreach",
    text: "Find a group—or begin one in your own city—through Love on The World.",
    href: "https://loveontheworld.com",
    label: "Love on The World",
    icon: Globe,
    accent: "border-purple-300/30 bg-purple-400/[0.08] text-purple-200",
  },
  {
    eyebrow: "Daniel & Katie Ziedins",
    title: "Partner with the mission",
    text: "Follow their continued work through e3 Canada and I Am Second, receive updates or learn how to partner.",
    href: "https://kd-ziedins.com",
    label: "KD-Ziedins.com",
    icon: Heart,
    accent: "border-gold/30 bg-gold/[0.08] text-gold-300",
  },
] as const;

export default function PostFestivalHome({ go, onSearch }: Props) {
  return (
    <div className="pb-6">
      <section className="relative flex min-h-[780px] h-[100svh] max-h-[960px] w-full overflow-hidden">
        <Image
          src={IMG.heroCrowd}
          alt="A crowd worshipping together at Jesus Festival in Hamilton"
          fill
          preload
          sizes="(max-width: 512px) 100vw, 512px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-purple-950/55 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(245,190,72,0.26),transparent_34%),radial-gradient(circle_at_15%_58%,rgba(139,92,246,0.25),transparent_30%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[20%] h-72 w-72 -translate-x-1/2 rounded-full border border-gold/20 shadow-[0_0_100px_rgba(245,190,72,0.18)]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[12%] top-[29%] h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_18px_5px_rgba(245,190,72,0.65)]" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[14%] top-[36%] h-1 w-1 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.65)]" aria-hidden="true" />

        <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 pb-8 pt-16 text-center safe-top">
          <Image
            src="/brand/logo-mark-white.png"
            alt="Jesus Festival"
            width={132}
            height={66}
            loading="eager"
            style={{ width: "auto" }}
            className="jf-pop h-16 w-auto drop-shadow-[0_0_28px_rgba(245,190,72,0.48)]"
          />

          <p className="jf-rise mt-5 rounded-full border border-gold/35 bg-ink/45 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-gold-300 backdrop-blur-xl">
            Jesus Festival 2026 · Thank you, Hamilton
          </p>
          <h1 className="jf-rise mt-5 font-display text-[3.65rem] font-black leading-[0.88] tracking-[-0.055em] text-white sm:text-7xl">
            ALL GLORY{" "}
            <br />
            <span className="text-gradient-gold animate-shimmer">TO GOD.</span>
          </h1>
          <p className="jf-rise mx-auto mt-5 max-w-sm text-[16px] font-medium leading-relaxed text-white/85">
            Jesus Festival 2026 has ended—and it was absolutely amazing. Thank you to every person who prayed, served, shared and showed up.
          </p>

          <div className="jf-rise mt-6 grid w-full max-w-sm grid-cols-3 gap-2" aria-label="Early Jesus Festival 2026 impact report">
            {POST_EVENT.impact.slice(0, 3).map((item) => (
              <div key={item.stat} className="rounded-2xl border border-white/15 bg-ink/50 px-2 py-3.5 backdrop-blur-xl">
                <p className="font-display text-2xl font-black text-gold-300">{item.stat}</p>
                <p className="mt-1 text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-white/70">{item.shortLabel}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-semibold text-white/55">Early reports shared by the festival team · testimonies are still coming in</p>

          <div className="jf-fade mt-6 grid w-full max-w-sm grid-cols-2 gap-2.5">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-amber-400 px-4 text-sm font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] active:scale-[0.98]"
            >
              <Camera width={17} height={17} /> See Instagram
            </a>
            <a
              href={LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-blue-300/35 bg-blue-500/20 px-4 text-sm font-black text-white backdrop-blur active:scale-[0.98]"
            >
              <Share width={16} height={16} /> See Facebook
            </a>
          </div>

          <a href="#harvest" className="mt-7 flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.24em] text-white/50">
            The story continues
            <span className="text-xl text-gold-300" aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
      </section>

      {/* The post-festival home dropped the search pill the festival home
          had, leaving the whole search index reachable only from More. */}
      {onSearch && (
        <div className="mx-auto mt-6 max-w-md px-4">
          <SearchPill onClick={onSearch} />
        </div>
      )}

      <section id="harvest" className="scroll-mt-6 px-4 pt-10">
        <Reveal className="mx-auto max-w-md">
          <div className="text-center">
            <Eyebrow>The first 2026 harvest report</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-black leading-[0.95] text-white">
              Look what the
              <br />
              <span className="text-gradient-gold">Lord has done.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-white/70">
              Testimonies are continuing to arrive. These are the early numbers reported by the Jesus Festival team so far—never a scoreboard, always people loved by God.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {POST_EVENT.impact.map((item, index) => (
              <div
                key={item.label}
                className={`relative overflow-hidden rounded-3xl border p-4 ${index === POST_EVENT.impact.length - 1 ? "col-span-2 border-purple-300/25 bg-gradient-to-r from-purple-600/15 to-gold/[0.08]" : "border-gold/20 bg-gradient-to-br from-gold/[0.11] to-white/[0.025]"}`}
              >
                <span className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-gold/10 blur-2xl" />
                <p className="relative font-display text-3xl font-black text-gradient-gold">{item.stat}</p>
                <p className="relative mt-1 text-[12px] font-bold leading-snug text-white">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-[11.5px] leading-relaxed text-white/55">
            <strong className="text-white/75">About these numbers:</strong> these are preliminary reports shared by the festival team on September 6, 2026. Reports may be updated as follow-up and testimonies continue. Every number represents a person, and all glory belongs to God.
          </div>

          <a
            href="mailto:hello@jesusfestival.ca?subject=My%20Jesus%20Festival%202026%20Testimony"
            className="group mt-4 flex items-center gap-3 rounded-2xl border border-fuchsia-300/25 bg-gradient-to-r from-fuchsia-500/[0.12] to-gold/[0.08] p-4 transition hover:border-gold/40"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-fuchsia-400/15 text-xl" aria-hidden="true">💬</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-200">Your story matters</span>
              <span className="mt-1 block text-sm font-bold text-white">Share what God did in your life</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-white/55">Send the team your Jesus Festival testimony.</span>
            </span>
            <ArrowRight width={18} height={18} className="shrink-0 text-gold-300 transition-transform group-hover:translate-x-1" />
          </a>

          <div className="mt-5">
            <Scripture
              text="Not unto us, O Lord, not unto us, but unto thy name give glory."
              reference="Psalm 115:1 (KJV)"
            />
          </div>
        </Reveal>
      </section>

      <section className="render-later mt-16 px-4">
        <Reveal className="mx-auto max-w-md text-center">
          <Eyebrow>This happened because you said yes</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-black text-white">From the bottom of our hearts—thank you.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/65">
            So many people poured in prayer, work, generosity and love long before the first person walked into Gage Park.
          </p>
        </Reveal>
        <div className="mx-auto mt-6 grid max-w-md gap-3">
          {THANK_YOUS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.065] to-transparent p-5">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold/20 bg-gold/10 text-2xl" aria-hidden="true">{item.emoji}</span>
                  <div>
                    <h3 className="font-display text-lg font-black text-white">{item.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{item.text}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="render-later mt-16 px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-[2rem] border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-600/20 via-purple-800/25 to-gold/[0.08] p-6 text-center">
            <span className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <span className="relative inline-grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-2xl" aria-hidden="true">📸</span>
            <p className="relative mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200">Photos · videos · testimonies</p>
            <h2 className="relative mt-2 font-display text-3xl font-black text-white">See what happened.</h2>
            <p className="relative mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-white/70">
              Follow Jesus Festival as moments and testimonies from the weekend are shared—and keep supporting the artists, ministries and vendors featured there.
            </p>
            <div className="relative mt-5 grid grid-cols-2 gap-2.5">
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-amber-400 px-3 py-3 text-sm font-black text-white active:scale-[0.98]">
                Instagram ↗
              </a>
              <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-blue-300/30 bg-blue-500/20 px-3 py-3 text-sm font-black text-white active:scale-[0.98]">
                Facebook ↗
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="render-later mt-16 px-4">
        <Reveal className="mx-auto max-w-md text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-ember/30 bg-ember/10 text-ember">
            <FlameIcon width={28} height={28} />
          </span>
          <div className="mt-4"><Eyebrow>The festival ended · the mission continues</Eyebrow></div>
          <h2 className="mt-3 font-display text-4xl font-black leading-[0.95] text-white">
            Keep the fire
            <br />
            <span className="text-gradient-gold">burning.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Make yourself available to the Lord&apos;s leading every day. Pray. Notice the one. Share Jesus. Serve your city. Let Gage Park become a beginning, not a memory.
          </p>
        </Reveal>

        <div className="mx-auto mt-7 max-w-md space-y-3">
          <Reveal>
            <button
              onClick={() => go("more", "yes")}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-gold/[0.16] via-purple-700/20 to-transparent p-5 text-left active:scale-[0.99]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-navy-950 shadow-glow">
                <CrossIcon width={24} height={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-gold-300">Your first next step</span>
                <span className="mt-1 block font-display text-lg font-black text-white">I said yes to Jesus</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-white/60">Prayer, baptism, Scripture, church and seven practical first steps.</span>
              </span>
              <ArrowRight width={18} height={18} className="shrink-0 text-gold-300 transition group-hover:translate-x-0.5" />
            </button>
          </Reveal>

          {NEXT_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.href} delay={index * 0.05}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 rounded-3xl border p-5 active:scale-[0.99] ${item.accent}`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
                    <Icon width={23} height={23} />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] opacity-80">{item.eyebrow}</span>
                    <span className="mt-1 block font-display text-lg font-black text-white">{item.title}</span>
                    <span className="mt-1 block text-[12px] leading-snug text-white/60">{item.text}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-black">{item.label} <ArrowRight width={13} height={13} /></span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-6 max-w-md">
          <Scripture
            text="The fire shall ever be burning upon the altar; it shall never go out."
            reference="Leviticus 6:13 (KJV)"
          />
        </Reveal>
      </section>

      {/* The question every returning visitor has once the weekend is over. */}
      <section className="render-later mt-16 px-4">
        <Reveal className="mx-auto max-w-md">
          <Link
            href="/jesus-festival-2027"
            className="group relative block overflow-hidden rounded-[2rem] border border-purple-300/30 bg-gradient-to-br from-purple-700/30 via-ink to-gold/[0.10] p-6 active:scale-[0.99]"
          >
            <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-purple-500/25 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-dashed border-gold/70 font-display text-xl font-black text-gold-300">
                27
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-gold-300">The next chapter</span>
                <span className="mt-1 block font-display text-2xl font-black leading-tight text-white">Jesus Festival 2027</span>
                <span className="mt-1 block text-[13px] leading-snug text-white/65">
                  Dates aren&apos;t announced yet. Be the first to know when they are.
                </span>
              </span>
              <ArrowRight width={18} height={18} className="shrink-0 text-gold-300 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="render-later mt-16 px-4">
        <Reveal className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/[0.13] via-purple-900/20 to-ink p-6 text-center">
            <span className="pointer-events-none absolute left-1/2 top-0 h-36 w-64 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
            <Sparkle width={26} height={26} className="relative mx-auto text-gold-300" />
            <p className="relative mt-4 font-display text-2xl font-black text-white">We love you guys.</p>
            <p className="relative mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-white/65">
              Let&apos;s continue to advance God&apos;s Kingdom together. If you need prayer, have a testimony or want help finding your next step, reach out anytime.
            </p>
            <a
              href={`mailto:${SITE.email}?subject=Jesus%20Festival%202026%20Follow-Up`}
              className="relative mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 font-display text-sm font-black text-navy-950 shadow-glow active:scale-[0.98]"
            >
              {SITE.email} <ArrowRight width={15} height={15} />
            </a>
            <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Love God · Love people · Change the world</p>
          </div>
        </Reveal>
      </section>

      <section className="mt-12 px-4 text-center">
        <Reveal className="mx-auto max-w-md">
          <Link href="/blog/jesus-festival-hamilton-2026-recap" className="inline-flex items-center gap-2 text-[12px] font-black text-gold-300 hover:text-gold-200">
            Read and share the full 2026 thank-you recap <ArrowRight width={14} height={14} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
