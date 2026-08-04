"use client";

import { useEffect, useState } from "react";

/**
 * Reading progress + a share button for an article. Client-only so the article
 * page itself stays a fully static server component.
 */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-gold-400 to-ember transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ShareArticle({ title, url }: { title: string; url: string }) {
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 2400);
    return () => clearTimeout(t);
  }, [note]);

  async function share() {
    const text = `${title} — from the Jesus Festival blog`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote("Link copied 💛");
    } catch {
      /* cancelled share sheet — stay quiet */
    }
  }

  return (
    <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
      <button
        onClick={share}
        className="rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-[13px] font-bold text-gold-400 active:scale-95"
      >
        Share this article
      </button>
      {note && (
        <span role="status" className="text-[12px] font-semibold text-gold-400">
          {note}
        </span>
      )}
    </div>
  );
}
