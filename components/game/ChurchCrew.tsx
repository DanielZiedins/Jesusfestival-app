"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hasProfanity } from "@/lib/clean";
import { crewCreate, crewGet, crewJoin, crewsSample, leaveCrew, myCrew, haptic, type Crew } from "@/lib/game";
import { Check, Share, Users } from "@/components/icons";

// Church Crews — congregations rally their people into the mission with a code.
// Celebrated, never ranked.
export default function ChurchCrew() {
  const [crew, setCrew] = useState<Crew | null>(null);
  const [others, setOthers] = useState<Crew[]>([]);
  const [mode, setMode] = useState<"none" | "join" | "create">("none");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mine = myCrew();
    if (mine) {
      setCrew({ code: mine.code, church: mine.church, members: 1, acts: 0 });
      crewGet(mine.code).then((c) => c && setCrew(c));
    }
    crewsSample().then(setOthers);
  }, []);

  async function join() {
    if (busy) return;
    setErr(null);
    setBusy(true);
    const res = await crewJoin(input);
    setBusy(false);
    if (!res.ok || !res.crew) {
      setErr(res.error || "Code not found.");
      return;
    }
    haptic(18);
    setCrew(res.crew);
    setMode("none");
    setInput("");
  }

  async function create() {
    if (busy) return;
    setErr(null);
    if (hasProfanity(input)) {
      setErr("Let's keep it friendly for all ages. 💛");
      return;
    }
    setBusy(true);
    const res = await crewCreate(input);
    setBusy(false);
    if (!res.ok || !res.crew) {
      setErr(res.error || "Couldn't create the crew.");
      return;
    }
    haptic(18);
    setCrew(res.crew);
    setMode("none");
    setInput("");
  }

  async function shareCode() {
    if (!crew) return;
    const text = `Join ${crew.church} in the Revive the City mission! 🌇 Open the Jesus Festival app, go to the Game tab → Church Crew, and enter our code: ${crew.code} — https://www.jesusfestival.app`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Join our Church Crew!", text, url: "https://www.jesusfestival.app" });
        return;
      }
    } catch {
      /* fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }

  if (crew) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/12 via-purple-900/20 to-ink/50 p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">⛪ Your Church Crew</p>
            <h3 className="mt-1.5 font-display text-2xl font-extrabold leading-tight text-white">{crew.church}</h3>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 rounded-2xl bg-white/5 px-3 py-2.5 text-center">
                <div className="font-display text-xl font-extrabold text-gold-400">{crew.members.toLocaleString()}</div>
                <div className="text-[10px] text-white/55">in the mission</div>
              </div>
              <div className="flex-1 rounded-2xl bg-white/5 px-3 py-2.5 text-center">
                <div className="font-display text-xl font-extrabold text-gold-400">{crew.acts.toLocaleString()}</div>
                <div className="text-[10px] text-white/55">Kingdom acts together</div>
              </div>
              <div className="flex-1 rounded-2xl bg-purple-500/15 px-3 py-2.5 text-center ring-1 ring-purple-400/30">
                <div className="font-display text-xl font-extrabold tracking-widest text-purple-200">{crew.code}</div>
                <div className="text-[10px] text-white/55">crew code</div>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-white/70">
              Every mission, game & verse you complete counts for <span className="font-semibold text-white">{crew.church}</span> too. Rally your whole congregation! 🙌
            </p>
            <button
              onClick={shareCode}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-bold text-navy-950 shadow-glow active:scale-[0.98]"
            >
              {copied ? <Check width={17} height={17} /> : <Share width={17} height={17} />}
              {copied ? "Invite copied!" : `Invite your church — code ${crew.code}`}
            </button>
            <button
              onClick={() => {
                leaveCrew();
                setCrew(null);
              }}
              className="mt-2 w-full text-center text-[11px] text-white/40 underline-offset-2 hover:underline"
            >
              Leave crew
            </button>
          </div>
        </div>
        <OtherCrews others={others.filter((o) => o.church !== crew.church)} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/25 to-ink/40 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-2xl">⛪</span>
          <div>
            <h3 className="font-display text-lg font-bold text-white">Rally your church!</h3>
            <p className="text-[12px] leading-snug text-white/60">Join with a crew code — or start one and invite your whole congregation.</p>
          </div>
        </div>

        {mode === "none" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => { setMode("join"); setErr(null); }} className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 text-sm font-bold text-navy-950 active:scale-[0.98]">
              I have a code
            </button>
            <button onClick={() => { setMode("create"); setErr(null); }} className="rounded-2xl border border-gold/40 bg-gold/10 py-3 text-sm font-bold text-gold-400 active:scale-[0.98]">
              Start our crew
            </button>
          </div>
        )}

        {mode !== "none" && (
          <div className="mt-4 space-y-2.5">
            <input
              value={input}
              onChange={(e) => setInput(mode === "join" ? e.target.value.toUpperCase() : e.target.value)}
              placeholder={mode === "join" ? "Enter crew code (e.g. BETH42)" : "Your church name"}
              maxLength={mode === "join" ? 8 : 60}
              className="jf-input text-center font-bold tracking-widest"
            />
            {err && <p className="text-center text-xs font-medium text-rose-300">{err}</p>}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setMode("none"); setErr(null); }} className="rounded-2xl bg-white/10 py-3 text-sm font-bold text-white active:scale-[0.98]">
                Back
              </button>
              <button
                onClick={mode === "join" ? join : create}
                disabled={busy || input.trim().length < 3}
                className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 text-sm font-bold text-navy-950 active:scale-[0.98] disabled:opacity-40"
              >
                {busy ? "…" : mode === "join" ? "Join crew" : "Get our code"}
              </button>
            </div>
          </div>
        )}
      </div>
      <OtherCrews others={others} />
    </div>
  );
}

function OtherCrews({ others }: { others: Crew[] }) {
  if (!others.length) return null;
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        <Users width={13} height={13} /> Crews in the mission
      </p>
      <div className="grid grid-cols-2 gap-2">
        {others.slice(0, 4).map((c, i) => (
          <motion.div
            key={c.church + i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/8 bg-white/[0.04] p-3"
          >
            <p className="text-[13px] font-bold leading-tight text-white">{c.church}</p>
            <p className="mt-0.5 text-[11px] text-gold-400">{c.members} rallying · {c.acts.toLocaleString()} acts 💛</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
