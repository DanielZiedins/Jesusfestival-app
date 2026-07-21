"use client";

import { useEffect, useState } from "react";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import { COUNTRIES } from "@/lib/geo";
import { hasProfanity, tidy } from "@/lib/clean";
import { subscribeToPush, pushEnabled } from "@/lib/push";
import { Check, BellIcon, Sparkle } from "@/components/icons";

function get(key: string, fallback = ""): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export default function SettingsScreen() {
  const [name, setName] = useState("");
  const [church, setChurch] = useState("");
  const [country, setCountry] = useState("Canada");
  const [city, setCity] = useState("");
  const [spotlight, setSpotlight] = useState(true);
  const [pushOn, setPushOn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setName(get("jf-name"));
    setChurch(get("jf-church"));
    setCountry(get("jf-country", "Canada"));
    setCity(get("jf-city"));
    setSpotlight(get("jf-spotlight") !== "0");
    setPushOn(pushEnabled());
  }, []);

  function save() {
    if (hasProfanity(name) || hasProfanity(church) || hasProfanity(city)) {
      setErr("Let's keep it friendly for all ages — please adjust your details.");
      return;
    }
    setErr(null);
    try {
      if (name.trim()) localStorage.setItem("jf-name", tidy(name).split(" ")[0]);
      else localStorage.removeItem("jf-name");
      if (church.trim()) localStorage.setItem("jf-church", tidy(church, 60));
      else localStorage.removeItem("jf-church");
      localStorage.setItem("jf-country", country);
      if (city.trim()) localStorage.setItem("jf-city", tidy(city));
      else localStorage.removeItem("jf-city");
      localStorage.setItem("jf-spotlight", spotlight ? "1" : "0");
    } catch {
      /* ignore */
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function enablePush() {
    const res = await subscribeToPush();
    if (res.ok) setPushOn(true);
    else setErr(res.error || "Couldn't enable notifications.");
  }

  function replayIntro() {
    try {
      localStorage.removeItem("jf-game-intro");
    } catch {
      /* ignore */
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="Your profile"
        title="Settings"
        subtitle="Update your details and how you show up in the community."
        icon={<Sparkle width={22} height={22} />}
      />

      <Reveal className="space-y-4">
        {/* Profile */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 font-display text-base font-bold text-white">Your details</h2>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/55">First name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="jf-input mb-3" />
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/55">Church <span className="text-white/30">(optional)</span></label>
          <input value={church} onChange={(e) => setChurch(e.target.value)} placeholder="Your church" className="jf-input mb-3" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/55">Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="jf-input">
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/55">City <span className="text-white/30">(optional)</span></label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Hamilton" className="jf-input" />
            </div>
          </div>
          {err && <p className="mt-2 text-xs font-medium text-rose-300">{err}</p>}
          <button onClick={save} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-bold text-navy-950 active:scale-[0.98]">
            {saved ? (
              <>
                <Check width={16} height={16} /> Saved!
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>

        {/* Community preferences */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 font-display text-base font-bold text-white">Community & privacy</h2>
          <Toggle
            on={spotlight}
            onChange={() => setSpotlight((v) => !v)}
            title="Kingdom Spotlight"
            desc="Let your first name & church be celebrated (never ranked)."
          />
          <div className="my-3 h-px bg-white/8" />
          <button onClick={enablePush} disabled={pushOn} className="flex w-full items-center gap-3 text-left">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${pushOn ? "bg-gold text-navy-950" : "bg-purple-600/30 text-purple-200"}`}>
              {pushOn ? <Check width={18} height={18} /> : <BellIcon width={18} height={18} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-white">{pushOn ? "Notifications on" : "Turn on notifications"}</span>
              <span className="block text-xs text-white/55">Milestone moments, artist reveals & surprises.</span>
            </span>
          </button>
        </div>

        {/* Game */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-2 font-display text-base font-bold text-white">Revive the City</h2>
          <button onClick={replayIntro} className="w-full rounded-xl border border-white/12 bg-white/5 py-3 text-sm font-semibold text-white active:scale-[0.98]">
            ✨ Replay the game walkthrough
          </button>
        </div>

        <p className="px-2 text-center text-[11px] leading-relaxed text-white/40">
          Your details are used only to personalize your experience and share Jesus Festival updates. This is a safe space for the whole family. 💛
        </p>
      </Reveal>
    </div>
  );
}

function Toggle({ on, onChange, title, desc }: { on: boolean; onChange: () => void; title: string; desc: string }) {
  return (
    <button onClick={onChange} className="flex w-full items-center gap-3 text-left">
      <span className={`flex h-6 w-11 items-center rounded-full px-0.5 transition ${on ? "bg-gold" : "bg-white/15"}`}>
        <span className={`h-5 w-5 rounded-full bg-white transition ${on ? "translate-x-5" : "translate-x-0"}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-white/55">{desc}</span>
      </span>
    </button>
  );
}
