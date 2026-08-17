import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, postBySlug, sortedPosts } from "@/lib/blog";
import { KINGDOM_SITES, SITE } from "@/lib/content";
import Rich from "@/components/blog/Rich";
import { ReadingProgress, ShareArticle } from "@/components/blog/ArticleChrome";

// Every valid slug is enumerated at build time. Without this, Next 16 serves
// a prerendered fallback shell (HTTP 200) for unknown params before notFound()
// can run — a soft-404 that lets search engines index junk URLs.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = postBySlug(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogArticle(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = postBySlug(params.slug);
  if (!post) notFound();

  const related = post.related
    .map((d) => KINGDOM_SITES.find((s) => s.domain === d))
    .filter((s): s is (typeof KINGDOM_SITES)[number] => Boolean(s));

  const more = sortedPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  const sourceCitations = post.sources?.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url })) ?? [];
  const articleAbout = ["gage-park-festival-guide", "free-things-to-do-hamilton-september-2026"].includes(post.slug)
    ? [{ "@id": `${SITE.url}/#festival-2026` }, { "@id": `${SITE.url}/#gage-park` }]
    : [{ "@id": `${SITE.url}/#festival-2026` }];
  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: "Jesus Festival", url: SITE.url },
      publisher: {
        "@type": "Organization",
        name: "Jesus Festival",
        url: SITE.url,
        logo: { "@type": "ImageObject", url: `${SITE.url}/icons/icon-512.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
      image: [`${SITE.url}/brand/banner.png`],
      articleSection: post.eyebrow,
      inLanguage: "en-CA",
      about: articleAbout,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["article h1", "article header > p", ".article-faqs"],
      },
      // The outbound network links this article genuinely cites.
      citation: [
        ...related.map((s) => ({ "@type": "CreativeWork", name: s.name, url: s.url })),
        ...sourceCitations,
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Jesus Festival", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${SITE.url}/blog/${post.slug}` },
      ],
    },
  ];

  if (post.faqs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-20 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ReadingProgress />

      <nav aria-label="Breadcrumb" className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">
        <Link href="/" className="hover:text-gold-400">Festival</Link>
        <span className="px-2">/</span>
        <Link href="/blog" className="hover:text-gold-400">Blog</Link>
      </nav>

      <article className="mt-8">
        <header>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden>{post.emoji}</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">{post.eyebrow}</span>
          </div>
          <h1 className="mt-4 font-display text-[34px] font-extrabold leading-[1.08] text-white sm:text-[42px]">
            {post.title}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-white/60">{post.description}</p>
          <div className="mt-5 flex items-center gap-3 border-b border-white/10 pb-6 text-[12px] text-white/55">
            <time dateTime={post.date}>
              {new Date(`${post.date}T12:00:00Z`).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
            </time>
            <span>·</span>
            <span>{post.readMins} min read</span>
          </div>
        </header>

        <div className="mt-2">
          <Rich blocks={post.body} />
        </div>

        {post.faqs?.length ? (
          <section className="article-faqs mt-12" aria-labelledby="article-faqs-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Quick answers</p>
            <h2 id="article-faqs-heading" className="mt-2 font-display text-3xl font-extrabold text-white">Frequently asked questions</h2>
            <div className="mt-5 space-y-3">
              {post.faqs.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/35">
                  <summary className="cursor-pointer list-none pr-5 font-display text-[16px] font-bold text-white">{item.question}</summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <ShareArticle title={post.title} url={`${SITE.url}/blog/${post.slug}`} />
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Mentioned in this article</h2>
          <div className="mt-4 space-y-2.5">
            {related.map((s) => (
              <a
                key={s.domain}
                href={s.url}
                target="_blank"
                rel="noopener"
                className="group flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-xl" aria-hidden>
                  {s.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-[15px] font-bold text-white">{s.name}</span>
                    <span className="text-[11px] font-semibold text-gold-400">{s.domain}</span>
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-white/60">{s.blurb}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {post.sources?.length ? (
        <section className="mt-10 border-t border-white/10 pt-7" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">Authoritative local sources</h2>
          <ul className="mt-3 space-y-2">
            {post.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener" className="text-[13px] font-semibold leading-relaxed text-gold-400 underline decoration-gold-400/35 underline-offset-2 hover:decoration-gold-400">
                  {source.name} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-white/60">Park and transit conditions can change. Check official sources and event-day signage before travelling.</p>
        </section>
      ) : null}

      <section className="mt-14 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-7 text-center">
        <h2 className="font-display text-2xl font-bold text-white">You&apos;re invited</h2>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-white/65">
          Jesus Festival is completely free — September 4–5, 2026 at Gage Park, Hamilton. Bring someone with you.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-display text-[15px] font-extrabold text-navy-950 shadow-glow"
        >
          Open the festival app →
        </Link>
      </section>

      {more.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Keep reading</h2>
          <div className="mt-4 space-y-2.5">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-400">{p.eyebrow}</span>
                <span className="mt-1.5 block font-display text-[17px] font-bold leading-snug text-white group-hover:text-gold-400">
                  {p.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
