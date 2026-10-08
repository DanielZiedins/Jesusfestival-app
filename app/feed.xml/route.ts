import { BLOG_SECTIONS, postHtml, postSection, sortedPosts } from "@/lib/blog";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * RSS for the blog. Lets the other Kingdom Network sites syndicate these posts
 * automatically, and gives readers/aggregators a proper subscribe target.
 * Items carry the full article (content:encoded), a section category and the
 * share image.
 */
export function GET() {
  const posts = sortedPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(BLOG_SECTIONS.find((s) => s.id === postSection(p.slug))?.title ?? p.eyebrow)}</category>
      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
      <enclosure url="${SITE.url}/blog/${p.slug}/opengraph-image" type="image/png" length="0" />
      <content:encoded><![CDATA[${postHtml(p)}]]></content:encoded>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>The Jesus Festival Blog</title>
    <link>${SITE.url}/blog</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Encouragement, practical faith and the story behind Jesus Festival Hamilton.</description>
    <language>en-CA</language>
    <lastBuildDate>${new Date(`${posts[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
