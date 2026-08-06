"use client";

import { useState } from "react";

const FN = "https://vmpkiwfvnlzraabtjkig.supabase.co/functions/v1/festival-email";
// Same publishable key as the rest of the app; the function gates real sends on the passcode.
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uHfm0bHa-qmm0EJOr2F8tA_iid43Ru-";

/** Every flow the email engine can render, grouped the way you'd actually pick one. */
const FLOWS: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Announcements",
    items: [
      { id: "schedule", label: "🎪 Full schedule is here" },
      { id: "bethel", label: "🎶 Bethel — Friday headliner" },
      { id: "lineup", label: "🎤 Lineup update" },
      { id: "launch", label: "🎉 The app leveled up" },
      { id: "shop", label: "🛍️ The Kingdom Shop is open" },
    ],
  },
  {
    group: "Countdown",
    items: [
      { id: "countdown-60", label: "60 days out" },
      { id: "countdown-30", label: "30 days out" },
      { id: "countdown-14", label: "14 days out" },
      { id: "countdown-7", label: "7 days out" },
      { id: "countdown-3", label: "3 days out" },
      { id: "countdown-1", label: "Tomorrow" },
    ],
  },
  {
    group: "Festival days",
    items: [
      { id: "festival-fri", label: "🌟 Friday — it's tonight" },
      { id: "festival-sat", label: "🎉 Saturday — it's today" },
      { id: "postfest", label: "🔥 Thank you, Hamilton" },
    ],
  },
  {
    group: "Journey & weekly",
    items: [
      { id: "welcome", label: "Welcome (app member)" },
      { id: "welcome-site", label: "Welcome (website)" },
      { id: "story", label: "Day 2 — our story" },
      { id: "getinvolved", label: "Day 5 — get involved" },
      { id: "invite", label: "Day 9 — invite one" },
      { id: "weekly", label: "Weekly encouragement" },
    ],
  },
];

type Audience = {
  ok: boolean;
  error?: string;
  flow?: string;
  flowKey?: string;
  subscribed?: number;
  app?: number;
  site?: number;
  alreadySent?: number;
  wouldSend?: number;
  sample?: string[];
  daysToFestival?: number;
  stats?: { pct: number; missions: number; prayed: number; requests: number } | null;
};

export default function EmailPanel({ passcode }: { passcode: string }) {
  const [flow, setFlow] = useState("schedule");
  const [kind, setKind] = useState<"app" | "site">("app");
  const [testTo, setTestTo] = useState("");
  const [aud, setAud] = useState<Audience | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const previewUrl = `${FN}?preview=${encodeURIComponent(flow)}&kind=${kind}&name=Daniel`;

  async function call(body: Record<string, unknown>) {
    const res = await fetch(FN, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(body),
    });
    return (await res.json()) as Audience & { sent?: number };
  }

  async function checkAudience() {
    setBusy("audience");
    setMsg(null);
    try {
      const r = await call({ mode: "audience", passcode, flow });
      setAud(r);
      if (!r.ok) setMsg(r.error ?? "Failed.");
    } catch {
      setMsg("Could not reach the email engine.");
    }
    setBusy(null);
  }

  async function sendTest() {
    if (!testTo.trim()) {
      setMsg("Enter an address to test with.");
      return;
    }
    setBusy("test");
    setMsg(null);
    try {
      const r = await call({ mode: "test", passcode, flow, kind, email: testTo.trim(), name: "Daniel" });
      setMsg(r.ok ? `Test sent to ${testTo.trim()} ✉️` : (r.error ?? "Failed."));
    } catch {
      setMsg("Could not reach the email engine.");
    }
    setBusy(null);
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-1 font-display text-lg font-bold">Email flows</h2>
      <p className="mb-4 text-xs text-white/50">
        Preview any email, count exactly who it would reach, and send yourself a test — before anything goes to the real list.
      </p>

      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Flow</label>
      <select
        value={flow}
        onChange={(e) => {
          setFlow(e.target.value);
          setAud(null);
        }}
        className="jf-input mb-3"
      >
        {FLOWS.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.items.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="mb-4 flex gap-2">
        {(["app", "site"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition active:scale-[0.98] ${
              kind === k ? "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950" : "border border-white/15 bg-white/5 text-white/70"
            }`}
          >
            {k === "app" ? "App member view" : "Website view"}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-xs font-bold text-white active:scale-[0.98]"
        >
          👁️ Preview HTML
        </a>
        <a
          href={`${previewUrl}&format=text`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-xs font-bold text-white active:scale-[0.98]"
        >
          📄 Plain text
        </a>
      </div>

      <button
        onClick={checkAudience}
        disabled={busy !== null}
        className="mb-3 w-full rounded-xl border border-gold/40 bg-gold/10 py-3 text-sm font-bold text-gold-400 active:scale-[0.98] disabled:opacity-60"
      >
        {busy === "audience" ? "Checking…" : "🔍 Who would this reach?"}
      </button>

      {aud?.ok && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Would send" value={aud.wouldSend ?? 0} accent />
            <Stat label="Already sent" value={aud.alreadySent ?? 0} />
            <Stat label="On the list" value={aud.subscribed ?? 0} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-white/45">
            {aud.app ?? 0} app · {aud.site ?? 0} website · log key <code className="text-white/60">{aud.flowKey}</code>
            {typeof aud.daysToFestival === "number" && ` · ${aud.daysToFestival} days to Gage Park`}
          </p>
          {aud.stats && (
            <p className="mt-1 text-[11px] text-white/45">
              Live in emails: {aud.stats.pct}% revived · {aud.stats.missions} acts · {aud.stats.prayed} prayers
            </p>
          )}
          {!!aud.sample?.length && (
            <p className="mt-1 truncate text-[11px] text-white/35">e.g. {aud.sample.join(", ")}</p>
          )}
        </div>
      )}

      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Send a test</label>
      <div className="flex gap-2">
        <input
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="you@example.com"
          inputMode="email"
          className="jf-input flex-1"
        />
        <button
          onClick={sendTest}
          disabled={busy !== null}
          className="shrink-0 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 px-4 text-sm font-bold text-white active:scale-95 disabled:opacity-60"
        >
          {busy === "test" ? "…" : "Send"}
        </button>
      </div>

      {msg && <p className="mt-3 text-center text-xs font-semibold text-white/70">{msg}</p>}

      <p className="mt-4 rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/40">
        Broadcasts to the whole list stay on their scheduled cron jobs on purpose — this panel is for previewing and testing, so no
        real send ever happens by accident from a phone.
      </p>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <div className={`font-display text-xl font-extrabold ${accent ? "text-gold-400" : "text-white"}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">{label}</div>
    </div>
  );
}
