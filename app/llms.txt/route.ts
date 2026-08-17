import { sortedPosts } from "@/lib/blog";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const posts = sortedPosts().slice(0, 5);
  const text = `# Jesus Festival

> Jesus Festival Hamilton is a free, all-ages outdoor Christian festival at Gage Park in Hamilton, Ontario. The 2026 festival is September 4–5 and includes worship, the Gospel, testimonies, baptisms, food trucks, family activities and a Kids Zone.

## Essential information

- [Official 2026 Festival Guide](${SITE.url}/jesus-festival-hamilton): Dates, hours, admission, lineup, parking, transit, what to bring and family information.
- [Build My Festival Plan](${SITE.url}/jesus-festival-hamilton#build-my-plan): A private personalized arrival plan based on days, group needs and travel method.
- [Complete Schedule](${SITE.url}/schedule): Friday Pure Worship Night and Saturday Family Festival Day set times.
- [Festival FAQ](${SITE.url}/faq): Direct answers to common visitor questions.
- [Gage Park Map and Directions](${SITE.url}/map): Park map, zones, parking, transit, first aid and lost-child point.
- [I Said Yes to Jesus](${SITE.url}/i-said-yes): What it means to follow Jesus, a prayer, seven first steps, honest answers to common doubts, and churches in Hamilton to connect with.
- [Official Festival Shop](${SITE.url}/shop): Jesus Festival collection from ThyKingdom.Shop in Canadian dollars.
- [Install the App](${SITE.url}/install): Personal lineup, notifications, offline essentials and live updates.

## Latest stories

${posts.map((post) => `- [${post.title}](${SITE.url}/blog/${post.slug}): ${post.description}`).join("\n")}

## Official identity

- Website: ${SITE.url}
- Main festival website: https://www.jesusfestival.ca
- Organizer contact: ${SITE.email}
- Location: ${SITE.address}
- Dates: ${SITE.dates}
- Admission: Free; no ticket required
- Language: English (Canada)

## Full reference

- [Expanded machine-readable festival reference](${SITE.url}/llms-full.txt)
- [XML sitemap](${SITE.url}/sitemap.xml)
- [RSS feed](${SITE.url}/feed.xml)
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
