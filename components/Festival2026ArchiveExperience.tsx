"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeScreen from "@/components/screens/HomeScreen";
import { pathFor } from "@/lib/routes";
import type { TabId } from "@/components/BottomNav";

const ARCHIVE_NAV = [
  { href: "/history/2026", label: "Home", emoji: "🏠" },
  { href: "/schedule", label: "Schedule", emoji: "🗓️" },
  { href: "/revive-the-city", label: "Revive", emoji: "🎮" },
  { href: "/news", label: "News", emoji: "📰" },
  { href: "/more", label: "More", emoji: "•••" },
] as const;

export default function Festival2026ArchiveExperience() {
  const router = useRouter();

  const go = (tab: TabId, sub?: string) => {
    router.push(pathFor(tab, sub));
  };

  return (
    <div className="relative mx-auto max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-ink shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-gold/20 bg-ink/95 px-4 py-3 backdrop-blur-xl">
        <span className="min-w-0">
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gold-300">Historical snapshot</span>
          <span className="block truncate text-[11px] font-semibold text-white/60">Final pre-event homepage · September 2026</span>
        </span>
        <Link href="/" className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-black text-white hover:border-gold/40">
          Current site →
        </Link>
      </div>

      <HomeScreen go={go} archiveMode />

      <nav aria-label="Preserved 2026 app navigation" className="m-4 grid grid-cols-5 gap-1 rounded-2xl border border-white/10 bg-navy-950/90 p-2">
        {ARCHIVE_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-center text-[9px] font-bold text-white/55 transition hover:bg-white/[0.06] hover:text-gold-300">
            <span className="text-base" aria-hidden="true">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
