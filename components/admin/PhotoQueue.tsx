"use client";

import { useEffect, useState } from "react";
import { adminPendingPhotos, adminReviewPhoto, photoUrl, type Photo } from "@/lib/photos";

/** Moderation queue: nothing reaches the public Photo Wall until approved here. */
export default function PhotoQueue({ passcode }: { passcode: string }) {
  const [pending, setPending] = useState<Photo[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => adminPendingPhotos(passcode).then(setPending);
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function review(id: string, approve: boolean) {
    setBusyId(id);
    const ok = await adminReviewPhoto(passcode, id, approve);
    setBusyId(null);
    if (ok) setPending((p) => (p ? p.filter((x) => x.id !== id) : p));
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-1 font-display text-lg font-bold">Photo Wall queue {pending?.length ? `(${pending.length})` : ""}</h2>
      <p className="mb-4 text-xs text-white/50">
        Every submitted photo waits here. Approve it to publish on the wall, or reject to keep it hidden forever.
      </p>

      {pending === null ? (
        <div className="h-24 animate-pulse rounded-xl bg-white/5" />
      ) : pending.length === 0 ? (
        <p className="py-4 text-center text-sm text-white/50">Queue is clear — nothing waiting. ✅</p>
      ) : (
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(p.path)} alt={p.caption ?? "Pending photo"} className="max-h-64 w-full object-contain bg-black/40" />
              <div className="p-3">
                <p className="text-sm text-white/80">{p.caption || <span className="italic text-white/40">no caption</span>}</p>
                {p.name && <p className="mt-0.5 text-xs text-white/50">from {p.name}</p>}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => review(p.id, false)}
                    disabled={busyId === p.id}
                    className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => review(p.id, true)}
                    disabled={busyId === p.id}
                    className="rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-2.5 text-sm font-bold text-navy-950 active:scale-[0.98] disabled:opacity-60"
                  >
                    Approve ✓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={load} className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white/70 active:scale-[0.98]">
        Refresh queue
      </button>
    </section>
  );
}
