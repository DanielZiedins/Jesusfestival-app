"use client";

import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import Scripture from "@/components/Scripture";
import { Heart, ArrowRight, Check } from "@/components/icons";
import { DONATE } from "@/lib/content";

export default function DonateScreen() {
  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow={DONATE.eyebrow}
        title={DONATE.title}
        subtitle={DONATE.intro}
        icon={<Heart width={22} height={22} />}
      />

      {/* Impact */}
      <Reveal className="mb-5">
        <div className="grid grid-cols-2 gap-2.5">
          {DONATE.impact.map((i) => (
            <div key={i.text} className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <span className="text-xl">{i.emoji}</span>
              <span className="text-[12px] font-medium leading-tight text-white/75">{i.text}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mb-5">
        <Scripture text={DONATE.scripture.text} reference={DONATE.scripture.ref} />
      </Reveal>

      {/* Good ground callout */}
      <Reveal className="mb-5">
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-200">
            <Check width={18} height={18} />
          </span>
          <p className="text-[13px] leading-relaxed text-white/80">
            <span className="font-bold text-emerald-200">Sow into good ground.</span> {DONATE.receipt}
          </p>
        </div>
      </Reveal>

      {/* Give button */}
      <Reveal>
        <a
          href={DONATE.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-4 text-lg font-extrabold text-navy-950 shadow-glow transition active:scale-[0.98]"
        >
          <motion.span
            className="pointer-events-none absolute inset-0 -translate-x-full bg-white/30"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            style={{ width: "40%" }}
          />
          <Heart width={20} height={20} /> Give Now <ArrowRight width={18} height={18} />
        </a>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-white/45">
          You&apos;ll be taken to our secure giving page, powered by our charitable partner e3 Canada. Thank you for partnering with what God is doing in the city. 🙏
        </p>
      </Reveal>
    </div>
  );
}
