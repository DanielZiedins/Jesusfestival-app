"use client";

import { motion } from "framer-motion";
import { HomeIcon, CalendarIcon, GameIcon, NewsIcon, MoreIcon } from "./icons";
import type { ComponentType, SVGProps } from "react";

export type TabId = "home" | "schedule" | "game" | "news" | "more";

const TABS: { id: TabId; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "schedule", label: "Schedule", Icon: CalendarIcon },
  { id: "game", label: "Game", Icon: GameIcon },
  { id: "news", label: "News", Icon: NewsIcon },
  { id: "more", label: "More", Icon: MoreIcon },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 safe-bottom">
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-1.5 py-1.5 shadow-card">
          {TABS.map(({ id, label, Icon }) => {
            const on = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 outline-none"
                aria-label={label}
                aria-current={on ? "page" : undefined}
              >
                {on && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold/25 to-gold/5 ring-1 ring-gold/40"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative transition-colors ${
                    on ? "text-gold-400" : "text-white/55"
                  }`}
                >
                  <Icon width={22} height={22} />
                </span>
                <span
                  className={`relative text-[10px] font-semibold tracking-wide transition-colors ${
                    on ? "text-gold-400" : "text-white/55"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
