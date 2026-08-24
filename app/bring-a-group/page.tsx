import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GroupTripPlanner from "@/components/GroupTripPlanner";
import { IMG, SITE } from "@/lib/content";
import { breadcrumbJsonLd, serializeJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/bring-a-group";

export const metadata: Metadata = {
  title: "Bring a Church, Youth Group or Family to Jesus Festival",
  description:
    "Build and share a private group trip plan for Jesus Festival Hamilton 2026: meeting point, travel, arrival, leader roles, readiness checklist and offline essentials.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Bring Your Crew to Jesus Festival Hamilton 2026",
    description: "One clear plan for your church, youth group, family or friends at Gage Park — free, private and shareable.",
    url: PATH,
    type: "article",
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival Hamilton 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Jesus Festival Group Plan",
    description: "Coordinate the day, travel, meeting point, roles and offline essentials in one shareable crew brief.",
    images: ["/brand/banner.png"],
  },
};

const FAQS = [
  {
    question: "Can I bring a church group or youth group to Jesus Festival Hamilton?",
    answer:
      "Yes. Jesus Festival Hamilton is free, all ages and open to everyone. No admission ticket is required. A church, youth group, family or group of friends can use this page to choose a day, travel plan, meeting point and leader roles before arriving.",
  },
  {
    question: "Does a group need tickets or a registration?",
    answer:
      "No admission ticket is required for Jesus Festival. If a very large organization needs event-specific coordination beyond normal public attendance, contact the festival team at hello@jesusfestival.ca before travelling rather than assuming a reserved area or group service.",
  },
  {
    question: "What is the best meeting point for a group at Gage Park?",
    answer:
      "Choose a permanent landmark that everyone can identify, such as the Gage Family Fountain or the G.R. Robinson Bandshell, then name one exact side and a regroup time. Final festival zones and pathways may change, so permanent park landmarks are safer than an unconfirmed temporary booth.",
  },
  {
    question: "How should a group travel to Jesus Festival?",
    answer:
      "Gage Park has limited parking, so carpooling, HSR, walking, cycling or rideshare can reduce the number of vehicles. Drivers should add arrival time. Transit riders should check the official HSR trip planner shortly before leaving because schedules and detours can change.",
  },
  {
    question: "What should a group bring to Jesus Festival?",
    answer:
      "Bring lawn chairs or blankets, filled refillable water bottles, sunscreen, hats, comfortable shoes, a power bank and a Friday evening layer. Assigning one person to check shared supplies helps prevent every person from assuming someone else packed them.",
  },
  {
    question: "How should youth leaders plan for festival day?",
    answer:
      "Use your church or organization's existing safeguarding policy, approved-adult requirements, permission process, emergency contacts and headcount routine. Keep names of minors, phone numbers, medical details and parent or guardian information in your own secure system, never in a shared group-plan link.",
  },
  {
    question: "How do I plan for accessibility or sensory needs in a group?",
    answer:
      "Ask privately before festival day, only collect details a responsible leader genuinely needs, and use the Jesus Festival Accessibility and Comfort Guide. When an accommodation is essential, confirm current event-day arrangements with the festival team before travelling.",
  },
  {
    question: "Does the shared group plan expose private information?",
    answer:
      "The checklist stays in local storage on the current device. A shared link contains only the visible group type, approximate size, day, travel choice, meeting point, optional nickname and optional note. Do not enter phone numbers, medical details, minor names or other sensitive information in the nickname or note.",
  },
  {
    question: "Will the group plan work if phone service is poor at Gage Park?",
    answer:
      "Yes, after the page has been opened online and saved by the app's offline tools. Group leaders should share or print the brief before leaving, open the schedule and map, and save the offline festival essentials while they still have reliable service.",
  },
] as const;

const SOURCES = [
  { name: "Jesus Festival — Official Hamilton 2026 Information", url: "https://www.jesusfestival.ca/" },
  { name: "City of Hamilton — Gage Park Features and Services", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
] as const;

const LEADER_STEPS = [
  ["01", "Name one point person", "Every crew needs one person who owns the final brief. That person does not have to make every decision; they make sure the decision reaches everyone."],
  ["02", "Choose the moment you are protecting", "Friday worship, Saturday opening, a specific artist or a shorter family window can all work. Star must-see sets, then build arrival time backwards."],
  ["03", "Reduce the travel variables", "Match riders to drivers, send the HSR planning link, or set a realistic arrival window for separate arrivals. Parking is limited, so margin matters."],
  ["04", "Make regrouping unmistakable", "Choose a permanent landmark, one exact side and a time. Share a backup instruction for anyone whose phone loses service."],
  ["05", "Ask about care privately", "Accessibility, medication, allergies, sensory needs and safeguarding information belong with the responsible person—not in a public group chat or shared link."],
  ["06", "Send one final brief", "Share the same plan the day before, print a copy if useful, and ask everyone to open the app online before arriving at Gage Park."],
] as const;

export default function BringAGroupPage() {
  const pageJsonLd = {
    ...webPageJsonLd({
      path: PATH,
      name: "Bring a Group to Jesus Festival Hamilton 2026",
      description: metadata.description as string,
      about: { "@id": `${SITE.url}/#festival-2026` },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", ".group-answer-summary", ".group-faqs"],
    },
    citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}${PATH}#faq`,
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE.url}${PATH}#group-plan-how-to`,
    name: "How to bring a group to Jesus Festival Hamilton",
    description: "A six-step plan for coordinating a church, youth group, family or friends for Jesus Festival at Gage Park.",
    inLanguage: "en-CA",
    totalTime: "PT15M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "CAD", value: "0" },
    step: LEADER_STEPS.map(([, name, text], index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name,
      text,
      url: `${SITE.url}${PATH}#leader-playbook`,
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Jesus Festival", path: "/" },
    { name: "Bring a Group", path: PATH },
  ]);

  return (
    <main className="min-h-screen bg-ink pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([pageJsonLd, faqJsonLd, howToJsonLd, breadcrumbs]) }} />
      <article>
        <header className="relative isolate overflow-hidden border-b border-white/10">
          <Image
            src={IMG.rainbow}
            alt="Churches, families and friends gathered at Jesus Festival in Gage Park"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/45 via-purple-950/75 to-ink" />
          <div className="mx-auto flex min-h-[590px] max-w-5xl flex-col justify-end px-5 pb-16 pt-24 text-center sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
              <Link href="/" className="hover:text-gold-400">Jesus Festival</Link>
              <span className="px-2">/</span>
              <span aria-current="page">Bring a Group</span>
            </nav>
            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">One crew · one clear plan · one unforgettable weekend</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.98] sm:text-6xl">
              Don&apos;t just come. <span className="text-gradient-gold">Bring your people.</span>
            </h1>
            <p className="group-answer-summary mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80 sm:text-xl">
              Build a private, shareable festival brief for your church, youth group, family or friends—day, arrival, travel, meeting point, roles and all.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="#group-planner" className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Build our crew plan</a>
              <Link href="/schedule" className="rounded-2xl border border-white/20 bg-ink/45 px-6 py-3.5 text-sm font-bold text-white backdrop-blur">Choose must-see moments</Link>
            </div>
            <p className="mt-5 text-[11px] text-white/55">Free admission · No account · Readiness stays on your device</p>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <section className="-mt-7 relative z-10 grid gap-3 sm:grid-cols-4" aria-label="Group planner benefits">
            {[
              ["15 min", "to build the plan"],
              ["1 link", "for the whole crew"],
              ["6 checks", "before you leave"],
              ["0 accounts", "or sign-ups needed"],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl border border-white/10 bg-navy-950/95 p-4 text-center shadow-card backdrop-blur">
                <p className="font-display text-2xl font-extrabold text-gold-300">{value}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/55">{label}</p>
              </div>
            ))}
          </section>

          <div className="mt-10">
            <GroupTripPlanner />
          </div>

          <section id="leader-playbook" className="render-later mt-16 scroll-mt-8" aria-labelledby="leader-playbook-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">The 15-minute leader playbook</p>
            <h2 id="leader-playbook-heading" className="mt-2 max-w-3xl font-display text-3xl font-extrabold sm:text-4xl">Six moves that remove most group-day stress</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">
              A good group plan is not complicated. It gives everyone the same answer to six questions before the car doors close and the park signal gets busy.
            </p>
            <ol className="mt-7 grid gap-3 md:grid-cols-2">
              {LEADER_STEPS.map(([number, title, text]) => (
                <li key={number} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <span className="font-display text-xl font-extrabold text-gold-400">{number}</span>
                  <h3 className="mt-2 font-display text-lg font-extrabold text-white">{title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="render-later mt-16" aria-labelledby="audience-guidance-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200">Plan for the people you actually have</p>
            <h2 id="audience-guidance-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Four groups. Four smart adjustments.</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                ["⛪", "Church crews", "Name one coordinator and one welcome buddy. Carpool when practical, choose a moment to gather for prayer, and leave room for neighbours or first-time guests who join the plan late."],
                ["⚡", "Youth groups", "Follow your organization's safeguarding process, approved-adult ratios and parent or guardian permissions. Use a visible headcount routine and keep sensitive records in your existing secure system."],
                ["🎈", "Families", "Build around meals, naps and attention spans. Take a current photo of children before entering a crowd, choose a permanent meeting landmark, and make a shorter successful visit a completely valid plan."],
                ["🫂", "Friends", "Decide who owns transport, who anchors the meeting point and which sets matter most. A shared brief keeps late arrivals connected without turning the group chat into forty conflicting messages."],
              ].map(([emoji, title, text]) => (
                <article key={title} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-transparent p-6">
                  <span className="text-3xl" aria-hidden>{emoji}</span>
                  <h3 className="mt-3 font-display text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="render-later mt-16 overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-500/[0.09] via-navy-900 to-transparent p-6 sm:p-8" aria-labelledby="care-heading">
            <div className="grid gap-7 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">Care is part of the plan</p>
                <h2 id="care-heading" className="mt-2 font-display text-3xl font-extrabold">Ask privately. Plan honestly. Share carefully.</h2>
                <p className="mt-4 text-[14px] leading-relaxed text-white/65">
                  Mobility, sensory comfort, hearing, vision, medication, allergies, a service animal, a support person or a young person&apos;s safety plan can change what a smooth day looks like. Ask early, collect only what a responsible leader needs, and confirm any essential event-day arrangement directly.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/accessibility" className="rounded-xl bg-emerald-200 px-5 py-3 text-sm font-extrabold text-navy-950">Open Accessibility & Comfort Guide</Link>
                  <a href={`mailto:${SITE.email}?subject=Jesus%20Festival%20group%20planning%20question`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white">Ask the festival team</a>
                </div>
              </div>
              <aside className="rounded-3xl border border-white/10 bg-black/15 p-5" aria-label="Do not share sensitive information">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-rose-200">Keep out of shared links</p>
                <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/65">
                  <li>• Names of minors</li>
                  <li>• Phone numbers or home addresses</li>
                  <li>• Medical or accessibility details</li>
                  <li>• Parent or guardian information</li>
                  <li>• Private safeguarding instructions</li>
                </ul>
              </aside>
            </div>
          </section>

          <section className="group-faqs render-later mt-16" aria-labelledby="group-faq-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Direct answers for group leaders</p>
            <h2 id="group-faq-heading" className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Bringing a group: frequently asked questions</h2>
            <div className="mt-7 space-y-3">
              {FAQS.map((item) => (
                <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/30">
                  <summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold text-white">{item.question}</summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="render-later mt-14 border-t border-white/10 pt-8" aria-labelledby="group-sources-heading">
            <h2 id="group-sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Current authoritative sources</h2>
            <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-white/45">Festival details and City park information were reviewed August 24, 2026. Final event-day signs and official updates take priority.</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {SOURCES.map((source) => (
                <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-relaxed text-gold-400 hover:border-gold/30">{source.name} ↗</a></li>
              ))}
            </ul>
          </section>

          <section className="render-later mt-16 rounded-[2rem] border border-gold/25 bg-gradient-to-br from-purple-700/25 via-navy-900 to-gold/10 p-8 text-center sm:p-10">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Your people belong here</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold">Build the plan. Send the invite. Come expectant.</h2>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-white/65">Jesus Festival Hamilton is free, all ages and open to everyone at Gage Park, September 4–5, 2026.</p>
            <a href="#group-planner" className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">Open our crew plan</a>
          </section>
        </div>
      </article>
    </main>
  );
}
