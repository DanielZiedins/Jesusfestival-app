import Link from "next/link";

const LINKS = [
  { href: "/blog/jesus-festival-hamilton-2026-recap", label: "2026 Recap" },
  { href: "/jesus-festival-2027", label: "Jesus Festival 2027" },
  { href: "/i-said-yes", label: "First Steps With Jesus" },
  { href: "/blog/plunder-hell-populate-heaven-partner-with-daniel-and-katie", label: "Partner in the Harvest" },
  { href: "/prayer", label: "Prayer Wall" },
  { href: "/discipleship", label: "Keep Growing" },
  { href: "/movement", label: "The Movement" },
  { href: "/revive-the-city", label: "Revive the City" },
  { href: "/photos", label: "Festival Moments" },
  { href: "/blog", label: "Stories & Updates" },
  { href: "/faq", label: "Festival FAQ" },
  { href: "/shop", label: "Official Shop" },
  // These three were in the sitemap with no inbound link anywhere in the
  // server HTML, so crawlers that don't run JS could never reach them.
  { href: "/volunteer", label: "Volunteer" },
  { href: "/give", label: "Give" },
  { href: "/connect", label: "Connect" },
  { href: "/schedule", label: "2026 Schedule Archive" },
  { href: "/jesus-festival-hamilton", label: "2026 Festival Archive" },
];

export default function DiscoveryFooter() {
  return (
    <footer className="mx-4 mb-3 mt-12 rounded-3xl border border-white/10 bg-white/[0.035] px-5 py-6 text-center">
      <p className="font-display text-base font-bold text-white">Jesus Festival 2026 · the story continues</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">
        Recap · first steps · prayer · outreach · stories · the movement
      </p>
      <nav aria-label="Festival information" className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-[12px] font-bold text-gold-400 hover:text-gold-300">
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Quiet on purpose — /partner is unlisted everywhere else, and this small
          line is its only doorway. People who read this far are the right ones. */}
      <p className="mt-5 border-t border-white/[0.07] pt-4 text-[11px] text-white/55">
        Carried by prayer, and by a few quiet partners.{" "}
        <Link href="/partner" className="font-semibold text-white/70 underline underline-offset-2 hover:text-gold-400">
          Partner with Daniel &amp; Katie
        </Link>
      </p>
    </footer>
  );
}
