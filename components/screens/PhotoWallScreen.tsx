"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import { fetchPhotos, photoUrl, submitPhoto, type Photo } from "@/lib/photos";
import { Camera, Sparkle } from "@/components/icons";

/**
 * The community Photo Wall. Anyone can submit a moment; nothing appears until
 * the team approves it in /admin, so the wall stays safe for every age.
 */
export default function PhotoWallScreen() {
  // undefined = loading · null = failed · [] = empty
  const [photos, setPhotos] = useState<Photo[] | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setPhotos(undefined);
    fetchPhotos().then(setPhotos);
  };
  useEffect(load, []);

  // Object URLs leak unless revoked when replaced or unmounted.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function pick(f: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setPickedFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setMsg(null);
  }

  async function send() {
    if (!pickedFile || busy) return;
    setBusy(true);
    setMsg(null);
    const res = await submitPhoto(pickedFile, caption);
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Something went wrong.");
      return;
    }
    pick(null);
    setCaption("");
    setMsg("Sent! 🎉 Your photo will appear here once the team approves it.");
  }

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="Real people, real moments"
        title="Photo Wall"
        subtitle="Share your festival moments with the whole community. Every photo is reviewed before it appears."
        icon={<Camera width={22} height={22} />}
      />

      {/* Submit card */}
      <Reveal className="mx-auto mb-6 max-w-md">
        <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-purple-900/15 to-transparent p-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
          {preview ? (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Your photo, ready to share" className="max-h-72 w-full rounded-2xl object-cover" />
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 90))}
                placeholder="Add a caption (optional)"
                className="jf-input"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => pick(null)}
                  className="rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white active:scale-[0.98]"
                >
                  Choose another
                </button>
                <button
                  onClick={send}
                  disabled={busy}
                  className="rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Share it 📸"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5 py-8 font-display text-base font-bold text-gold-400 active:scale-[0.99]"
            >
              <Camera width={22} height={22} /> Add your festival moment
            </button>
          )}
          {msg && (
            <p role="status" className="mt-3 text-center text-[13px] font-semibold text-gold-400">
              {msg}
            </p>
          )}
        </div>
      </Reveal>

      {/* Gallery */}
      {photos === undefined ? (
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : photos === null ? (
        <div className="py-8 text-center">
          <p className="text-sm text-white/60">Couldn&apos;t load the wall — check your connection.</p>
          <button onClick={load} className="mt-3 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white active:scale-95">
            Try again
          </button>
        </div>
      ) : photos.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <Sparkle width={26} height={26} className="mx-auto text-gold-400" />
          <p className="mt-3 font-display text-lg font-bold text-white">Be the first on the wall</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-white/60">
            Share a moment from a past festival — or your excitement for this one.
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              onClick={() => setLightbox(p)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(p.path)} alt={p.caption ?? "Festival moment"} loading="lazy" className="aspect-square w-full object-cover transition group-active:scale-105" />
              {(p.caption || p.name) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-2.5 pt-6">
                  {p.caption && <p className="line-clamp-2 text-[11.5px] font-semibold leading-snug text-white">{p.caption}</p>}
                  {p.name && <p className="mt-0.5 text-[10px] text-white/55">— {p.name.split(/\s+/)[0]}</p>}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox — plain conditional render, no exit animation to stall. */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption ?? "Festival photo"}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[85] flex flex-col items-center justify-center bg-ink/95 p-5 backdrop-blur"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(lightbox.path)} alt={lightbox.caption ?? "Festival moment"} className="max-h-[72vh] w-full rounded-2xl object-contain" />
          <div className="mt-4 text-center">
            {lightbox.caption && <p className="text-[15px] font-semibold text-white">{lightbox.caption}</p>}
            {lightbox.name && <p className="mt-1 text-[12px] text-white/55">— {lightbox.name.split(/\s+/)[0]}</p>}
            <p className="mt-4 text-[12px] font-bold uppercase tracking-wider text-white/40">Tap anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
