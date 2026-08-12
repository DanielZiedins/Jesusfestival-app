"use client";

import { Search } from "@/components/icons";

/**
 * The button that opens search.
 *
 * Deliberately its own module: Home and More import this on first paint, and if
 * it lived alongside SearchOverlay it would drag the whole search index — every
 * set time, every park pin, the full text of every blog post — into the initial
 * bundle and quietly undo the dynamic import.
 */
export default function SearchPill({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.05] px-3.5 py-3 text-left transition active:scale-[0.99]"
    >
      <Search width={16} height={16} className="shrink-0 text-gold-400" />
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-white/45">
        Search sets, artists, parking, prayer…
      </span>
      <span className="hidden shrink-0 rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white/40 sm:block">
        ⌘K
      </span>
    </button>
  );
}
