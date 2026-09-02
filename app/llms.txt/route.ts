import { sortedPosts } from "@/lib/blog";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const posts = sortedPosts().slice(0, 5);
  const text = `# Jesus Festival

> Jesus Festival Hamilton is a free, all-ages outdoor Christian festival at Gage Park in Hamilton, Ontario. The 2026 festival is September 4–5 and includes worship, the Gospel, testimonies, baptisms, food trucks, family activities and a Kids Zone.

## Essential information

- [Official 2026 Festival Guide](${SITE.url}/jesus-festival-hamilton): Dates, hours, admission, lineup, parking, transit, what to bring and family information.
- [Festival Day-Of Mode](${SITE.url}/day-of): A low-distraction, automatically updating Hamilton-time view of what is on now, what comes next, directions, map, help points and offline essentials.
- [Festival Weekend Command Center](${SITE.url}/festival-weekend): Live Hamilton-time status, Gage Park forecast, personal readiness, day-of help, map links and offline essentials.
- [Build My Festival Plan](${SITE.url}/jesus-festival-hamilton#build-my-plan): A private personalized arrival plan based on days, group needs and travel method.
- [Find Your Festival Moments](${SITE.url}/find-your-moments): A private lineup matcher that recommends and saves confirmed 2026 sets based on audience, interests and available time.
- [Getting to Gage Park](${SITE.url}/getting-to-gage-park): Current Main and Ottawa construction and HSR detour guidance, parking and fare facts, live directions, and a private personalized leave-by planner.
- [What to Bring](${SITE.url}/what-to-bring): A private personalized packing planner for festival days, families, comfort and accessibility needs, and volunteers, with current forecast context, offline progress, sharing and a downloadable checklist.
- [Bring a Group](${SITE.url}/bring-a-group): A private, shareable crew planner for churches, youth groups, families and friends with travel, meeting point, role and readiness guidance.
- [Accessibility and Comfort Guide](${SITE.url}/accessibility): Confirmed Gage Park and HSR facts, transparent event-day unknowns, direct accessibility answers and a private Comfort Plan.
- [Complete Schedule](${SITE.url}/schedule): Friday Pure Worship Night and Saturday Family Festival Day set times.
- [Festival FAQ](${SITE.url}/faq): Direct answers to common visitor questions.
- [Gage Park Map and Directions](${SITE.url}/map): Park map, zones, parking, transit, first aid and lost-child point.
- [I Said Yes to Jesus](${SITE.url}/i-said-yes): What it means to follow Jesus, a prayer, seven first steps, honest answers to common doubts, and churches in Hamilton to connect with.
- [Official Festival Shop](${SITE.url}/shop): Jesus Festival collection from ThyKingdom.Shop in Canadian dollars.
- [Install the App](${SITE.url}/install): Personal lineup, notifications, offline essentials and live updates.
- [The Light Hunt](${SITE.url}/hunt): A free on-site 12-light scavenger hunt with six Vendor Row stops and shareable badges stored on the visitor's device.

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
