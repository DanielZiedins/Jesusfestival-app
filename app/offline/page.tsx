import type { Metadata } from "next";
import Link from "next/link";
import FestivalReadinessChecklist from "@/components/FestivalReadinessChecklist";
import { SCHEDULE, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Offline Festival Essentials",
  description: "Offline Jesus Festival schedule, location, packing list and arrival essentials for Gage Park.",
  robots: { index: false, follow: true, noarchive: true },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-ink px-4 pb-16 pt-10 text-white safe-top">
      <div className="mx-auto max-w-lg">
        <header className="rounded-[2rem] border border-gold/25 bg-gradient-to-br from-purple-900/45 via-navy-900 to-gold/10 p-6 shadow-card">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400"><span className="h-2 w-2 rounded-full bg-gold" /> Offline essentials</div>
          <h1 className="mt-3 font-display text-3xl font-extrabold">You still have what matters.</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">The park network may be busy, but your core festival plan is saved here. Live features will reconnect automatically when service returns.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link href="/festival-weekend" className="rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 text-center font-display text-sm font-extrabold text-navy-950">Weekend hub</Link>
            <Link href="/schedule" className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-sm font-bold">Full schedule</Link>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3" aria-label="Festival essentials">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Where</p><h2 className="mt-1 font-display text-lg font-bold">Gage Park</h2><p className="mt-1 text-xs leading-relaxed text-white/65">{SITE.address}</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Admission</p><h2 className="mt-1 font-display text-lg font-bold">Completely free</h2><p className="mt-1 text-xs leading-relaxed text-white/65">No ticket required · all ages</p></article>
        </section>

        <section className="mt-8" aria-labelledby="offline-schedule">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-400">Both days at a glance</p>
          <h2 id="offline-schedule" className="mt-1 font-display text-2xl font-extrabold">Festival schedule</h2>
          <div className="mt-4 space-y-3">
            {SCHEDULE.days.map((day) => (
              <article key={day.id} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-300">{day.label} · {day.date}</p>
                <h3 className="mt-1 font-display text-xl font-extrabold">{day.theme}</h3>
                <p className="mt-1 text-sm font-bold text-gold-400">{day.window}</p>
                <ul className="mt-4 space-y-2 border-t border-white/8 pt-4">
                  {day.items.map((item) => <li key={`${day.id}-${item.time}-${item.title}`} className="flex gap-3 text-xs"><time className="w-20 shrink-0 font-bold text-white">{item.time}</time><span className="text-white/60">{item.title}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8"><FestivalReadinessChecklist compact /></div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link href="/jesus-festival-hamilton#build-my-plan" className="flex min-h-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-center text-sm font-extrabold text-gold-300">
            Open my festival plan →
          </Link>
          <Link href="/accessibility#comfort-plan" className="flex min-h-11 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-400/[0.07] px-4 py-3 text-center text-sm font-extrabold text-emerald-200">
            Open my Comfort Plan →
          </Link>
          <Link href="/bring-a-group#group-planner" className="flex min-h-11 items-center justify-center rounded-xl border border-purple-300/25 bg-purple-400/[0.07] px-4 py-3 text-center text-sm font-extrabold text-purple-100 sm:col-span-2">
            Open our group plan →
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5" aria-labelledby="offline-reminders">
          <h2 id="offline-reminders" className="font-display text-xl font-extrabold">Quick reminders</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/60">
            <li>• Friday gates open at 6 PM; worship begins at 6:30 PM.</li>
            <li>• Saturday runs from 10 AM to 6 PM.</li>
            <li>• Parking is limited—arrive early or consider HSR, carpooling, cycling, walking or rideshare.</li>
            <li>• Bring a chair or blanket, water and sun protection.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
