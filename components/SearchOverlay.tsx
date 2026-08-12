"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Portal from "@/components/Portal";
import { useOverlay } from "@/lib/useOverlay";
import { QUICK_QUERIES, runSearch, type Hit } from "@/lib/search";
import { haptic } from "@/lib/game";
import type { TabId } from "@/components/BottomNav";
import { ArrowRight, Search } from "@/components/icons";

const KIND_TINT: Record<Hit["kind"], string> = {
  Schedule: "text-gold-400",
  Artist: "text-gold-400",
  Screen: "text-purple-300",
  Park: "text-emerald-300",
  "First step": "text-white/85",
  Church: "text-white/60",
  Article: "text-purple-300",
  Network: "text-white/50",
};

/**
 * Find anything in the app — a set time, an artist, the first aid tent, a
 * screen — from one field. Entirely local, so it answers instantly and still
 * works standing in Gage Park with no signal.
 */
export default function SearchOverlay({
  onClose,
  go,
}: {
  onClose: () => void;
  go: (tab: TabId, sub?: string) => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useOverlay(true, onClose);

  useEffect(() => {
    // A tick's delay lets the overlay finish mounting before iOS decides
    // whether to raise the keyboard.
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const hits = useMemo(() => runSearch(q), [q]);

  useEffect(() => setActive(0), [q]);

  function open(hit: Hit) {
    haptic(12);
    if (hit.href) {
      const external = /^https?:/.test(hit.href);
      window.open(hit.href, external ? "_blank" : "_self", external ? "noopener,noreferrer" : "");
      onClose();
      return;
    }
    if (hit.tab) go(hit.tab, hit.moreView);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!hits.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = e.key === "ArrowDown" ? Math.min(active + 1, hits.length - 1) : Math.max(active - 1, 0);
      setActive(next);
      listRef.current?.querySelectorAll("[data-hit]")[next]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      open(hits[active]);
    }
  }

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-label="Search the festival"
        className="fixed inset-0 z-[92] flex flex-col bg-ink/95 backdrop-blur-xl"
      >
        {/* Search bar */}
        <div className="shrink-0 border-b border-white/10 px-4 pb-3 pt-4 safe-top">
          <div className="mx-auto flex max-w-lg items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] px-3.5 py-3 focus-within:border-gold/50">
              <Search width={17} height={17} className="shrink-0 text-gold-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Sets, artists, parking, prayer…"
                aria-label="Search the festival"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white placeholder:text-white/35 focus:outline-none"
              />
              {q && (
                <button
                  onClick={() => {
                    setQ("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/60"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3 text-[13px] font-bold text-white/80 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3 safe-bottom">
          <div className="mx-auto max-w-lg">
            {!q.trim() ? (
              <>
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Try one of these
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUERIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQ(s)}
                      className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/75 active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-center text-[12px] leading-relaxed text-white/35">
                  Search every set time, artist, place in the park and page in the app.
                  <br />
                  It all works offline.
                </p>
              </>
            ) : hits.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <div className="text-3xl">🔍</div>
                <p className="mt-2 text-sm text-white/65">
                  Nothing for &ldquo;{q}&rdquo;. Try a shorter word — or check the{" "}
                  <button
                    onClick={() => {
                      go("news");
                      onClose();
                    }}
                    className="font-bold text-gold-400 underline-offset-2 hover:underline"
                  >
                    News
                  </button>{" "}
                  tab for the latest.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {hits.map((hit, i) => (
                  <button
                    key={hit.id}
                    data-hit
                    onClick={() => open(hit)}
                    onMouseEnter={() => setActive(i)}
                    aria-current={i === active ? true : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition active:scale-[0.99] ${
                      i === active ? "border-gold/40 bg-gold/[0.09]" : "border-white/8 bg-white/[0.03]"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-lg" aria-hidden="true">
                      {hit.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-bold text-white">{hit.title}</span>
                        <span className={`shrink-0 text-[9.5px] font-black uppercase tracking-wider ${KIND_TINT[hit.kind]}`}>
                          {hit.kind}
                        </span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[12px] leading-snug text-white/55">
                        {hit.sub}
                      </span>
                    </span>
                    <ArrowRight width={15} height={15} className="shrink-0 text-white/25" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Portal>
  );
}
