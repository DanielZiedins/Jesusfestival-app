export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-white" role="status" aria-label="Loading Jesus Festival">
      <div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-gold/25 bg-gold/10 text-3xl shadow-glow" aria-hidden>✦</div>
        <p className="mt-5 font-display text-lg font-extrabold">Jesus Festival</p>
        <p className="mt-1 text-sm text-white/55">Getting your festival weekend ready…</p>
        <div className="mx-auto mt-5 h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-gold-400" />
        </div>
      </div>
    </main>
  );
}
