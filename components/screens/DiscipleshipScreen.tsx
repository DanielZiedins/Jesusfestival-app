"use client";

import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal, { Eyebrow } from "@/components/Reveal";
import Scripture from "@/components/Scripture";
import { FlameIcon, Users, CrossIcon, ArrowRight } from "@/components/icons";
import { DISCIPLESHIP } from "@/lib/content";

const ICON: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
  flame: FlameIcon,
  community: Users,
  gospel: CrossIcon,
};

function PartnerList({ title, items }: { title: string; items: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-purple-400 to-gold" />
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-lg">
              ✝
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold text-white">{p.name}</span>
            <ArrowRight width={17} height={17} className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function DiscipleshipScreen() {
  return (
    <div className="px-4">
      <ScreenHeader
        eyebrow={DISCIPLESHIP.eyebrow}
        title={DISCIPLESHIP.title}
        subtitle={DISCIPLESHIP.intro}
        icon={<FlameIcon width={22} height={22} />}
      />

      {/* Points */}
      <div className="space-y-3">
        {DISCIPLESHIP.points.map((pt, i) => {
          const Icon = ICON[pt.icon] ?? FlameIcon;
          return (
            <Reveal key={pt.title} delay={i * 0.06}>
              <div className="flex gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400/90 to-gold-600 text-navy-950">
                  <Icon width={22} height={22} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{pt.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{pt.text}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="my-6">
        <Scripture text={DISCIPLESHIP.scripture.text} reference={DISCIPLESHIP.scripture.ref} />
      </div>

      {/* Partners */}
      <Reveal className="mb-4 text-center">
        <Eyebrow>Better together</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-bold text-white">Our Partners in the City</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
          Churches & ministries graciously walking this out with us — plug in and stay connected.
        </p>
      </Reveal>

      <div className="space-y-6 pb-4">
        <PartnerList title="Churches" items={DISCIPLESHIP.churches} />
        <PartnerList title="Ministries" items={DISCIPLESHIP.ministries} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="pb-2 pt-2 text-center text-xs italic text-white/40"
      >
        &ldquo;Let us consider how we may spur one another on toward love and good deeds.&rdquo;
      </motion.p>
    </div>
  );
}
