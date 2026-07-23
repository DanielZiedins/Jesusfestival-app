"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hasProfanity } from "@/lib/clean";
import { fetchPrayers, prayerAdd, prayerPray, prayedIds, markPrayed, haptic, type Prayer } from "@/lib/game";

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 90) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// A shared wall where the community lifts up prayers & praises, and prays for each other.
export default function PrayerWall({ onPosted }: { onPosted?: () => void }) {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [kind, setKind] = useState<"prayer" | "praise">("prayer");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [prayed, setPrayed] = useState<Set<string>>(new Set());
  const [me, setMe] = useState<{ name: string | null; church: string | null }>({ name: null, church: null });

  useEffect(() => {
    fetchPrayers().then(setPrayers);
    setPrayed(prayedIds());
    try {
      setMe({ name: localStorage.getItem("jf-name"), church: localStorage.getItem("jf-church") });
    } catch {
      /* ignore */
    }
  }, []);

  const totalPrayed = useMemo(() => prayers.reduce((n, p) => n + p.prayed, 0), [prayers]);

  async function post() {
    if (busy) return;
    setErr(null);
    const body = text.trim();
    if (body.length < 3) {
      setErr("Please share a few words. 💛");
      return;
    }
    if (hasProfanity(body)) {
      setErr("Let's keep it friendly for all ages. 💛");
      return;
    }
    setBusy(true);
    const res = await prayerAdd(me.name, me.church, body, kind);
    setBusy(false);
    if (!res.ok || !res.prayer) {
      setErr(res.error || "Couldn't post — try again.");
      return;
    }
    haptic(16);
    setPrayers((prev) => [res.prayer!, ...prev]);
    setText("");
    onPosted?.();
  }

  async function pray(p: Prayer) {
    if (prayed.has(p.id)) return;
    haptic(12);
    setPrayed((prev) => new Set(prev).add(p.id));
    markPrayed(p.id);
    setPrayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, prayed: x.prayed + 1 } : x)));
    const n = await prayerPray(p.id);
    if (n != null) setPrayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, prayed: n } : x)));
  }

  return (
    <div className="space-y-4">
      {/* Compose */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/25 to-ink/40 p-4">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setKind("prayer")}
            className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-[0.98] ${kind === "prayer" ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white" : "bg-white/5 text-white/60"}`}
          >
            🙏 Prayer request
          </button>
          <button
            onClick={() => setKind("praise")}
            className={`rounded-xl py-2.5 text-sm font-bold transition active:scale-[0.98] ${kind === "praise" ? "bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950" : "bg-white/5 text-white/60"}`}
          >
            🎉 Praise report
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={180}
          rows={2}
          placeholder={kind === "prayer" ? "Share what you'd like prayer for…" : "Share what God has done! 🙌"}
          className="w-full resize-none rounded-2xl border border-white/12 bg-white/5 p-3 text-[15px] text-white placeholder:text-white/35 focus:border-gold/50 focus:outline-none"
        />
        {err && <p className="mt-1.5 text-center text-xs font-medium text-rose-300">{err}</p>}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-white/40">
            Posting as {me.name || "Someone"}
            {me.church ? ` · ${me.church}` : ""}
          </span>
          <button
            onClick={post}
            disabled={busy || text.trim().length < 3}
            className="rounded-xl bg-gold px-4 py-2 text-xs font-extrabold text-navy-950 transition active:scale-95 disabled:opacity-40"
          >
            {busy ? "Posting…" : "Post to the wall"}
          </button>
        </div>
      </div>

      <p className="text-center text-[12px] text-white/50">
        💛 {totalPrayed.toLocaleString()} prayers lifted up together — <span className="italic">&ldquo;Pray for one another.&rdquo;</span> James 5:16
      </p>

      {/* Wall */}
      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {prayers.map((p) => {
            const didPray = prayed.has(p.id);
            const isPraise = p.kind === "praise";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-2xl border p-3.5 ${isPraise ? "border-gold/25 bg-gold/[0.06]" : "border-white/10 bg-white/[0.04]"}`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${isPraise ? "bg-gold/20 text-gold-400" : "bg-purple-500/20 text-purple-200"}`}>
                    {isPraise ? "🎉 Praise" : "🙏 Prayer"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-white/80">
                    {p.name || "Someone"}
                    {p.church ? <span className="font-normal text-white/45"> · {p.church}</span> : null}
                  </span>
                  <span className="shrink-0 text-[10px] text-white/35">{timeAgo(p.created_at)}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-white/90">{p.body}</p>
                <button
                  onClick={() => pray(p)}
                  disabled={didPray}
                  className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition active:scale-95 ${
                    didPray ? "bg-emerald-500/15 text-emerald-200" : "bg-white/8 text-white/80 hover:bg-white/12"
                  }`}
                >
                  🙏 {didPray ? "You're praying" : "I'm praying"} · {p.prayed.toLocaleString()}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
