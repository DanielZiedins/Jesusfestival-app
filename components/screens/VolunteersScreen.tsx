"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Portal from "@/components/Portal";
import { ChevronLeft } from "@/components/icons";

// The official Jesus Festival Volunteer portal (built & hosted by the volunteer team),
// embedded full-screen so it feels native while staying their app.
const VOLUNTEER_URL = "https://zealous-desert-0f13fd40f.7.azurestaticapps.net/volunteer/";

export default function VolunteersScreen({ onClose }: { onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  // If it hasn't loaded in a few seconds, gently surface the open-in-browser fallback.
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex flex-col bg-[#0B0D12]"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-ink/70 px-3 pb-2.5 pt-3 backdrop-blur safe-top">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 py-1.5 pl-2 pr-3.5 text-sm font-semibold text-white/85 active:scale-95"
          >
            <ChevronLeft width={18} height={18} /> Back
          </button>
          <div className="min-w-0 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-300">Serve the festival</p>
            <h1 className="truncate font-display text-[15px] font-bold text-white">🙌 Volunteers</h1>
          </div>
          <a
            href={VOLUNTEER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-gold/15 px-3 py-1.5 text-[12px] font-bold text-gold-400 active:scale-95"
          >
            Open ↗
          </a>
        </div>

        {/* Embedded volunteer app */}
        <div className="relative flex-1 bg-[#0B0D12]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
              <p className="text-sm text-white/60">Opening the volunteer portal…</p>
              {slow && (
                <a href={VOLUNTEER_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white active:scale-95">
                  Taking a while? Open it in your browser ↗
                </a>
              )}
            </div>
          )}
          <iframe
            src={VOLUNTEER_URL}
            title="Jesus Festival Volunteers"
            onLoad={() => setLoaded(true)}
            allow="clipboard-write; web-share; geolocation"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0 bg-[#0B0D12]"
          />
        </div>
      </motion.div>
    </Portal>
  );
}
