"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-white">
      <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-card">
        <span className="text-4xl" aria-hidden>🙌</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Let’s try that again</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">Something briefly interrupted this screen. Your saved festival plans are still on this device.</p>
        <button type="button" onClick={reset} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-3.5 font-display text-sm font-extrabold text-navy-950 shadow-glow">
          Reload this screen
        </button>
        <Link href="/" className="mt-3 inline-flex text-sm font-bold text-white/65 hover:text-white">Return home</Link>
      </div>
    </main>
  );
}
