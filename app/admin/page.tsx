"use client";

import { useEffect, useState } from "react";
import { adminCreateNews, adminResetCity, fetchNews, type NewsPost } from "@/lib/supabase";
import { fetchCityProgress, CITY_TARGET, type CityProgress } from "@/lib/game";
import { adminSendPush } from "@/lib/push";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-lg bg-ink px-5 py-8 text-white">
      <div className="mb-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-mark-white.png" alt="" className="h-9 w-auto" />
        <div>
          <h1 className="font-display text-2xl font-bold">Festival Admin</h1>
          <p className="text-xs text-white/50">Revive the City & the Feed</p>
        </div>
      </div>

      {!unlocked ? (
        <Unlock passcode={passcode} setPasscode={setPasscode} onUnlock={() => setUnlocked(true)} />
      ) : (
        <Dashboard passcode={passcode} />
      )}
    </main>
  );
}

function Unlock({ passcode, setPasscode, onUnlock }: { passcode: string; setPasscode: (v: string) => void; onUnlock: () => void }) {
  const [error, setError] = useState<string | null>(null);

  function check() {
    if (passcode.trim().length < 4) {
      setError("Enter your admin passcode.");
      return;
    }
    onUnlock();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <label className="mb-2 block text-sm font-semibold text-white/70">Admin passcode</label>
      <input
        type="password"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        placeholder="••••••••"
        className="jf-input"
      />
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      <button
        onClick={check}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-bold text-navy-950 active:scale-[0.98]"
      >
        Unlock
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        The passcode is verified on the server for every action. If it&apos;s wrong, saving will fail.
      </p>
    </div>
  );
}

function Dashboard({ passcode }: { passcode: string }) {
  const [city, setCity] = useState<CityProgress | null>(null);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("update");
  const [pinned, setPinned] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pTitle, setPTitle] = useState("");
  const [pBody, setPBody] = useState("");
  const [pMsg, setPMsg] = useState<string | null>(null);
  const [pBusy, setPBusy] = useState(false);

  async function sendPush() {
    if (!pTitle.trim() || !pBody.trim()) {
      setPMsg("Title and message are required.");
      return;
    }
    setPBusy(true);
    setPMsg(null);
    const res = await adminSendPush(passcode, pTitle, pBody);
    setPBusy(false);
    if (!res.ok) {
      setPMsg(res.error ?? "Failed.");
      return;
    }
    setPTitle("");
    setPBody("");
    setPMsg(`Sent to ${res.sent ?? 0} device${res.sent === 1 ? "" : "s"}. 🔔`);
  }

  async function refresh() {
    setCity(await fetchCityProgress());
    setPosts((await fetchNews()) ?? []);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function post() {
    if (!title.trim() || !body.trim()) {
      setMsg("Title and body are required.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await adminCreateNews(passcode, { title, body, category, pinned });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Failed.");
      return;
    }
    setTitle("");
    setBody("");
    setPinned(false);
    setMsg("Posted! ✅");
    refresh();
  }

  async function reset() {
    if (!confirm("Reset the whole city to 0 for a future event? This cannot be undone.")) return;
    setBusy(true);
    const res = await adminResetCity(passcode);
    setBusy(false);
    setMsg(res.ok ? "City reset." : res.error ?? "Failed.");
    refresh();
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Revive the City</h2>
        {city ? (
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Progress" value={`${city.pct}%`} />
            <Metric label="Light Points" value={city.total.toLocaleString()} />
            <Metric label="Missions" value={city.missions.toLocaleString()} />
          </div>
        ) : (
          <p className="text-sm text-white/50">Loading…</p>
        )}
        <p className="mt-3 text-[11px] text-white/40">Target: {CITY_TARGET.toLocaleString()} Light Points = 100%.</p>
        <button onClick={reset} disabled={busy} className="mt-3 w-full rounded-xl border border-rose-400/40 bg-rose-500/10 py-2.5 text-sm font-bold text-rose-200 active:scale-[0.98]">
          Reset city (new event)
        </button>
      </section>

      {/* New post */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Post an update</h2>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="jf-input" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the update…" rows={4} className="jf-input resize-none" />
          <div className="flex items-center gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="jf-input flex-1">
              <option value="update">Update</option>
              <option value="lineup">Lineup</option>
              <option value="schedule">Schedule</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> Pin
            </label>
          </div>
          <button onClick={post} disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-bold text-navy-950 active:scale-[0.98]">
            {busy ? "Posting…" : "Publish"}
          </button>
          {msg && <p className="text-center text-xs font-semibold text-white/70">{msg}</p>}
        </div>
      </section>

      {/* Push notification */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-1 font-display text-lg font-bold">Send a push notification</h2>
        <p className="mb-3 text-xs text-white/50">Goes to everyone who turned on alerts. Great for artist reveals & big moments.</p>
        <div className="space-y-3">
          <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Title (e.g. 🎤 Friday band revealed!)" className="jf-input" />
          <textarea value={pBody} onChange={(e) => setPBody(e.target.value)} placeholder="Message…" rows={3} className="jf-input resize-none" />
          <button onClick={sendPush} disabled={pBusy} className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 py-3 font-bold text-white active:scale-[0.98]">
            {pBusy ? "Sending…" : "Send to all devices"}
          </button>
          {pMsg && <p className="text-center text-xs font-semibold text-white/70">{pMsg}</p>}
        </div>
      </section>

      {/* Recent posts */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Recent posts ({posts.length})</h2>
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/8 bg-white/5 p-3">
              <p className="text-sm font-semibold text-white">{p.pinned ? "📌 " : ""}{p.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-white/55">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="font-display text-xl font-bold text-gold-400">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/50">{label}</div>
    </div>
  );
}
