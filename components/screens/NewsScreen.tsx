"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import { NewsIcon, BellIcon, Check } from "@/components/icons";
import { fetchNews, type NewsPost } from "@/lib/supabase";
import { subscribeToPush, pushEnabled } from "@/lib/push";

const CATEGORY_STYLE: Record<string, string> = {
  update: "bg-purple-500/20 text-purple-200",
  lineup: "bg-gold/20 text-gold-400",
  schedule: "bg-emerald-500/20 text-emerald-200",
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NewsScreen() {
  const [posts, setPosts] = useState<NewsPost[] | null>(null);
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    fetchNews().then(setPosts);
    setNotify(pushEnabled());
  }, []);

  async function toggleNotify() {
    if (notify) return; // already on
    const res = await subscribeToPush();
    if (res.ok) setNotify(true);
    else alert(res.error || "Couldn't turn on updates.");
  }

  return (
    <div className="px-4">
      <ScreenHeader
        eyebrow="Latest updates"
        title="The Feed"
        subtitle="News, announcements & surprises — straight from the Jesus Festival team."
        icon={<NewsIcon width={22} height={22} />}
      />

      {/* Notify card */}
      <Reveal>
        <button
          onClick={toggleNotify}
          className={`mb-5 flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
            notify
              ? "border-gold/40 bg-gold/10"
              : "border-white/10 bg-white/5 active:scale-[0.99]"
          }`}
        >
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${notify ? "bg-gold text-navy-950" : "bg-purple-600/30 text-purple-200"}`}>
            {notify ? <Check width={20} height={20} /> : <BellIcon width={20} height={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {notify ? "Updates are on" : "Turn on updates"}
            </p>
            <p className="text-xs text-white/60">
              {notify ? "You'll be notified when big news drops." : "Get notified for artist reveals & schedule drops."}
            </p>
          </div>
        </button>
      </Reveal>

      {/* Feed */}
      {posts === null ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/50">No updates yet — check back soon!</p>
      ) : (
        <div className="space-y-3 pb-4">
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className={`relative overflow-hidden rounded-2xl border p-4 ${
                p.pinned ? "border-gold/30 bg-gradient-to-br from-gold/10 to-white/5" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_STYLE[p.category] ?? CATEGORY_STYLE.update}`}>
                  {p.category}
                </span>
                {p.pinned && <span className="text-[10px] font-bold uppercase tracking-wide text-gold-400">📌 Pinned</span>}
                <span className="ml-auto text-[11px] text-white/40">{timeAgo(p.created_at)}</span>
              </div>
              <h3 className="font-display text-lg font-bold leading-snug text-white">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{p.body}</p>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
