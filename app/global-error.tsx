"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0510] text-white">
        <main className="flex min-h-screen items-center justify-center px-6 text-center">
          <div className="max-w-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffc24d]">Jesus Festival</p>
            <h1 className="mt-3 text-3xl font-extrabold">The app needs a fresh start</h1>
            <p className="mt-3 text-white/60">Reconnect and try again. Your festival plans remain saved on your device.</p>
            <button type="button" onClick={reset} className="mt-6 rounded-2xl bg-[#ffc24d] px-6 py-3 font-bold text-[#0a0510]">Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
