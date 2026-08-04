import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/schedule", emoji: "🗓️", label: "The schedule", sub: "Both days, every set" },
  { href: "/photos", emoji: "📸", label: "Photo Wall", sub: "Moments from the community" },
  { href: "/blog", emoji: "✍️", label: "The blog", sub: "Encouragement & practical faith" },
  { href: "/prayer", emoji: "🙏", label: "Prayer Wall", sub: "Pray with the city" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16 text-center">
      <div className="text-6xl" aria-hidden>
        🧭
      </div>
      <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white">
        This page wandered off
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-[16px] leading-relaxed text-white/60">
        We couldn&apos;t find what you were looking for — but you&apos;re still very welcome here.
      </p>

      <div className="mt-8 space-y-2.5 text-left">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40"
          >
            <span className="text-2xl" aria-hidden>
              {l.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[15px] font-bold text-white">{l.label}</span>
              <span className="block text-[12.5px] text-white/55">{l.sub}</span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-[15px] font-extrabold text-navy-950 shadow-glow"
      >
        Back to the festival →
      </Link>

      <p className="mt-8 font-display text-[15px] italic leading-relaxed text-white/45">
        &ldquo;He restores my soul. He leads me in paths of righteousness for his name&apos;s sake.&rdquo;
      </p>
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Psalm 23:3</p>
    </main>
  );
}
