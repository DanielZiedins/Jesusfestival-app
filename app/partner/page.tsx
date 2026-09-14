import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Users, Globe } from "@/components/icons";

/**
 * A quiet page, on purpose. It isn't in the nav, the search index, the sitemap
 * or the service worker — the only way in is the small line at the bottom of
 * the footer, or a link shared by hand. Partnership in ministry is something
 * people should arrive at prayerfully, not be funnelled into.
 *
 * Nothing here takes money. Financial partnership happens on Daniel & Katie's
 * official staff page at e3 Canada, where giving is handled securely.
 */

const PATH = "/partner";
const E3_PARTNER_URL = "https://e3ministry.ca/staff/katie-daniel-ziedins";
const KD_SITE_URL = "https://www.kd-ziedins.com/";

export const metadata: Metadata = {
  title: "Partner with Daniel & Katie Ziedins",
  description:
    "A quiet invitation to prayerfully partner with Daniel & Katie Ziedins — serving with e3 Canada and I Am Second — in the work of reaching cities with the love of Jesus.",
  alternates: { canonical: PATH },
  // Deliberately unlisted: reachable, shareable, but never competing in search.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Partner with Daniel & Katie Ziedins",
    description: "Pray with us. Walk with us. And if the Lord leads, partner with us.",
    url: PATH,
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton" }],
  },
};

const WAYS = [
  {
    icon: Heart,
    title: "Pray first",
    body:
      "Truly first. Before anything else on this page, would you ask the Lord how He wants you to be part of what He is doing in Hamilton and beyond? Prayer is not the consolation prize of partnership — it is the engine of it. Some of the most important partners in this work have never given a dollar.",
  },
  {
    icon: Users,
    title: "Walk with us",
    body:
      "Ministry is long obedience, and it is not meant to be walked alone. Follow the journey, celebrate the testimonies, show up to an outreach, tell a friend what God is doing. Their site shares real stories from the streets about once a month — the kind that remind you the Book of Acts never really ended.",
  },
  {
    icon: Globe,
    title: "Give, if He leads",
    body:
      "Daniel & Katie serve with e3 Canada in collaboration with I Am Second, and financial partnership is handled securely through their official e3 Canada staff page. Monthly partners are the quiet backbone of full-time ministry — they turn a calling into a sustainable sending.",
  },
];

const FRUIT = [
  { stat: "A decade+", label: "of saying yes — one simple yes that became a life of ministry" },
  { stat: "20+", label: "weekly outreach teams grown from one small beginning" },
  { stat: "Every place", label: "streets, malls, hospitals, campuses, festivals — no place off the map" },
  { stat: "One goal", label: "100 multiplying outreach groups, anywhere and everywhere" },
];

export default function PartnerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-20 pt-10">
      <nav aria-label="Breadcrumb" className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">
        <Link href="/" className="hover:text-gold-400">Festival</Link>
        <span className="px-2">/</span>
        <span className="text-white/80">Partner</span>
      </nav>

      {/* ── Hero ── */}
      <header className="jf-rise mt-8 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-gold-400">
          A quiet page, for those who felt a nudge
        </p>
        <h1 className="mt-3 font-display text-[36px] font-extrabold leading-[1.06] text-white">
          Partner with
          <br />
          <span className="text-gradient-gold">Daniel &amp; Katie</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
          You found a page we don&apos;t advertise. Jesus Festival, the weekly outreaches, the
          training, the quiet hospital hallways — all of it flows from one family&apos;s decision to
          keep saying yes to Jesus. This page exists for one reason: to give you a way to
          prayerfully say yes alongside them.
        </p>
      </header>

      {/* ── Scripture ── */}
      <figure className="jf-rise mt-8 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.08] via-purple-900/25 to-transparent p-5 text-center">
        <blockquote className="font-display text-[17px] italic leading-relaxed text-white/90">
          &ldquo;I thank my God every time I remember you&hellip; because of your partnership in the
          gospel from the first day until now.&rdquo;
        </blockquote>
        <figcaption className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
          Philippians 1:3–5
        </figcaption>
      </figure>

      {/* ── The story ── */}
      <section className="mt-10" aria-labelledby="partner-story">
        <h2 id="partner-story" className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
          The story you&apos;re stepping into
        </h2>
        <div className="mt-3 space-y-4 text-[14.5px] leading-relaxed text-white/70">
          <p>
            More than a decade ago, Daniel &amp; Katie Ziedins said a simple yes to Jesus. That yes
            became <strong className="text-white">Love Overflow</strong> — and one small outreach
            grew into <strong className="text-white">more than twenty weekly outreach teams</strong>{" "}
            carrying the Gospel through streets, malls, hospitals and campuses. It became training
            that turns ordinary believers into confident, everyday witnesses. And once a year, it
            becomes the festival this app was built for — thousands in Gage Park hearing that Jesus
            is alive and that He loves this city.
          </p>
          <p>
            None of it runs on hype. It runs on prayer, obedience, and a handful of people who
            decided this work shouldn&apos;t have to fight for survival — people the Bible simply
            calls <em className="text-white/90">partners</em>.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {FRUIT.map((f) => (
            <div key={f.stat} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-display text-[19px] font-extrabold leading-tight text-gradient-gold">{f.stat}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-white/60">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Three ways ── */}
      <section className="mt-10" aria-labelledby="partner-ways">
        <h2 id="partner-ways" className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
          Three ways to say yes
        </h2>
        <div className="mt-3 space-y-3">
          {WAYS.map((w, i) => {
            const Icon = w.icon;
            return (
              <div key={w.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400/25 to-purple-500/25 text-gold-400">
                    <Icon width={18} height={18} />
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-white">
                    <span className="mr-1.5 text-gold-400/70">{i + 1}.</span>
                    {w.title}
                  </h3>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/65">{w.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── The ask, plainly ── */}
      <section className="mt-10 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/15 via-purple-900/30 to-ink p-6 text-center">
        <div className="text-4xl" aria-hidden>🤝</div>
        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white">
          We are in this together.
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-white/70">
          If the Lord is nudging you toward financial partnership, it happens securely through
          Daniel &amp; Katie&apos;s official page with e3 Canada — monthly or one-time, any amount,
          all of it sending the Gospel out.
        </p>
        <a
          href={E3_PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-[15px] font-extrabold text-navy-950 shadow-glow active:scale-95"
        >
          Become a Partner · e3 Canada <ArrowRight width={16} height={16} />
        </a>
        <a
          href={KD_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-[14px] font-bold text-white active:scale-95"
        >
          Meet Daniel &amp; Katie · KD-Ziedins.com
        </a>
        <p className="mt-4 text-[12px] leading-relaxed text-white/50">
          No pressure lives on this page. If all you ever do is pray for this work, you are a true
          partner in it — and we mean that.
        </p>
      </section>

      {/* ── Send-off ── */}
      <p className="mt-10 text-center font-display text-[15px] italic leading-relaxed text-white/75">
        &ldquo;Freely ye have received, freely give.&rdquo;
        <span className="mt-1 block text-[11px] font-bold uppercase not-italic tracking-[0.2em] text-gold-400">
          Matthew 10:8
        </span>
      </p>

      <div className="mt-8 text-center">
        <Link href="/" className="text-[13px] font-semibold text-white/50 underline underline-offset-4">
          Back to the festival app
        </Link>
      </div>
    </main>
  );
}
