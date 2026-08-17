"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Gage Park with thousands of people means congested cell service. The schedule
 * and lineup are bundled with the app, so they keep working — this just says so,
 * instead of leaving someone staring at a screen they assume is broken.
 */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div role="status" className="fixed inset-x-0 top-0 z-[90] bg-gold text-navy-950 safe-top">
      <Link href="/offline" className="flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-center text-[12px] font-bold">
        <span className="h-1.5 w-1.5 rounded-full bg-navy-950/60" />
        You&apos;re offline — open saved festival essentials →
      </Link>
    </div>
  );
}
