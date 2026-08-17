import Link from "next/link";

const LINKS = [
  { href: "/jesus-festival-hamilton", label: "2026 Festival Guide" },
  { href: "/jesus-festival-hamilton#build-my-plan", label: "Build My Plan" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/faq", label: "Festival FAQ" },
  { href: "/blog", label: "Stories & Updates" },
  { href: "/shop", label: "Official Shop" },
  { href: "/offline", label: "Offline Essentials" },
];

export default function DiscoveryFooter() {
  return (
    <footer className="mx-4 mb-3 mt-12 rounded-3xl border border-white/10 bg-white/[0.035] px-5 py-6 text-center">
      <p className="font-display text-base font-bold text-white">Everything you need for Jesus Festival Hamilton</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">
        September 4–5, 2026 · Gage Park · Free admission · All ages
      </p>
      <nav aria-label="Festival information" className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-[12px] font-bold text-gold-400 hover:text-gold-300">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
