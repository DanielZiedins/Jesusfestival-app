import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts } from "@/lib/blog";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Jesus Festival Blog",
  description:
    "Encouragement, practical faith and the story behind Jesus Festival Hamilton — on loving your city, reaching the people closest to you, and what comes after you say yes to Jesus.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Jesus Festival Blog",
    description: "Encouragement, practical faith and the story behind Jesus Festival Hamilton.",
    url: "/blog",
    type: "website",
  },
};

const LIST_JSONLD = (posts: ReturnType<typeof sortedPosts>) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "The Jesus Festival Blog",
  url: `${SITE.url}/blog`,
  publisher: { "@type": "Organization", name: "Jesus Festival", url: SITE.url },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    url: `${SITE.url}/blog/${p.slug}`,
  })),
});

export default function BlogIndex() {
  const posts = sortedPosts();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-20 pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LIST_JSONLD(posts)) }} />

      <header className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold-400">
          ← Jesus Festival
        </Link>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
          The <span className="text-gradient-gold">Blog</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-white/65">
          Encouragement, practical faith, and the story behind what God is doing in Hamilton.
        </p>
      </header>

      <div className="mt-12 space-y-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 transition hover:border-gold/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl" aria-hidden>{p.emoji}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">{p.eyebrow}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-white group-hover:text-gold-400">
              {p.title}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/60">{p.description}</p>
            <div className="mt-4 flex items-center gap-3 text-[12px] text-white/55">
              <time dateTime={p.date}>
                {new Date(`${p.date}T12:00:00Z`).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span>·</span>
              <span>{p.readMins} min read</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-7 text-center">
        <h2 className="font-display text-2xl font-bold text-white">Come and see for yourself</h2>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-white/65">
          Jesus Festival is free, outdoors and open to everyone — September 4–5, 2026 at Gage Park, Hamilton.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-display text-[15px] font-extrabold text-navy-950 shadow-glow"
        >
          Open the festival app →
        </Link>
      </div>
    </main>
  );
}
