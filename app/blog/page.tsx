import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_SECTIONS, postSection, sortedPosts, type BlogPost } from "@/lib/blog";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Jesus Festival Blog",
  description:
    "Encouragement, practical faith and the story behind Jesus Festival Hamilton — loving your city, reaching the people closest to you, and life after yes.",
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

const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" });

function PostCard({ p }: { p: BlogPost }) {
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="group block rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 transition hover:border-gold/40"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl" aria-hidden>{p.emoji}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">{p.eyebrow}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-white group-hover:text-gold-400">{p.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-white/60">{p.description}</p>
      <div className="mt-4 flex items-center gap-3 text-[12px] text-white/55">
        <time dateTime={p.date}>{fmtDate(p.date)}</time>
        <span>·</span>
        <span>{p.readMins} min read</span>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = sortedPosts();
  const [featured, ...rest] = posts;
  const sections = BLOG_SECTIONS.map((sec) => ({ ...sec, posts: rest.filter((p) => postSection(p.slug) === sec.id) })).filter(
    (sec) => sec.posts.length > 0,
  );

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
        <p className="mt-2 text-[12px] font-semibold text-white/55">
          {posts.length} articles ·{" "}
          <a href="/feed.xml" className="text-gold-400 underline decoration-gold-400/35 underline-offset-2">
            RSS feed
          </a>
        </p>
      </header>

      {/* Jump links: plain anchors, so they work before (and without) JavaScript. */}
      <nav aria-label="Blog sections" className="mt-8 flex flex-wrap justify-center gap-2">
        {sections.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-[12px] font-bold text-white/80 transition hover:border-gold/40 hover:text-gold-400"
          >
            {sec.title} <span className="text-white/55">· {sec.posts.length}</span>
          </a>
        ))}
      </nav>

      {featured && (
        <section aria-labelledby="featured-heading" className="mt-10">
          <h2 id="featured-heading" className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-400">
            Latest
          </h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative mt-3 block overflow-hidden rounded-3xl border border-gold/35 bg-gradient-to-br from-gold/15 via-purple-900/35 to-navy-950 p-7 shadow-glow transition hover:border-gold/60"
          >
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden>{featured.emoji}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">{featured.eyebrow}</span>
            </div>
            <h3 className="relative mt-4 font-display text-[28px] font-extrabold leading-[1.12] text-white sm:text-[32px]">
              {featured.title}
            </h3>
            <p className="relative mt-3 text-[15.5px] leading-relaxed text-white/70">{featured.description}</p>
            <div className="relative mt-5 flex flex-wrap items-center gap-3 text-[12px] text-white/60">
              <time dateTime={featured.date}>{fmtDate(featured.date)}</time>
              <span>·</span>
              <span>{featured.readMins} min read</span>
              <span className="ml-auto font-display text-[14px] font-extrabold text-gold-400">Read it →</span>
            </div>
          </Link>
        </section>
      )}

      {sections.map((sec) => (
        <section key={sec.id} id={sec.id} aria-labelledby={`${sec.id}-heading`} className="mt-14 scroll-mt-6">
          <h2 id={`${sec.id}-heading`} className="font-display text-[22px] font-extrabold text-white">
            {sec.title}
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-white/60">{sec.blurb}</p>
          <div className="mt-5 space-y-4">
            {sec.posts.map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
          {sec.id === "mission" && (
            <a
              href="https://www.kd-ziedins.com"
              target="_blank"
              rel="noopener"
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/[0.07] px-5 py-4 transition hover:border-gold/60"
            >
              <span>
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-gold-400">Partner in the harvest</span>
                <span className="mt-0.5 block text-[14px] font-semibold text-white">Pray, go or give with Daniel &amp; Katie · KD-Ziedins.com</span>
              </span>
              <span aria-hidden className="text-gold-400">→</span>
            </a>
          )}
        </section>
      ))}

      <div className="mt-14 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-7 text-center">
        <h2 className="font-display text-2xl font-bold text-white">The story continues</h2>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-white/65">
          Read the 2026 harvest report, celebrate every person who made it possible and find a practical next step after Gage Park.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-display text-[15px] font-extrabold text-navy-950 shadow-glow"
        >
          See the 2026 recap and next steps →
        </Link>
      </div>
    </main>
  );
}
