import { sortedPosts } from "@/lib/blog";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const posts = sortedPosts().slice(0, 5);
  const text = `# Jesus Festival

> Jesus Festival Hamilton 2026 took place September 4–5 at Gage Park. The festival team has reported 70+ salvations and 50+ baptisms so far, more than 3,000 hot dogs and drinks shared with the community, and a record turnout. These are preliminary September 6 reports and may be updated as testimonies and follow-up continue. All glory belongs to God, and the mission continues through discipleship and local outreach.

## Post-event essentials

- [Jesus Festival Hamilton 2026 Recap](${SITE.url}/blog/jesus-festival-hamilton-2026-recap): The early harvest report, thanks to volunteers, artists, vendors, partners and attendees, official social links, Scripture and practical ways to stay involved.
- [Jesus Festival 2027](${SITE.url}/jesus-festival-2027): The next festival. Dates have not been announced yet; this page will carry the official announcement and lets people sign up to be told first. Held every year since 2024, free, at Gage Park in Hamilton.
- [I Said Yes to Jesus](${SITE.url}/i-said-yes): Private prayer, baptism, Scripture, church and seven practical first steps for new believers.
- [Prayer Wall](${SITE.url}/prayer): Share a prayer or praise and pray with the Jesus Festival community.
- [Keep Growing](${SITE.url}/discipleship): Practical discipleship resources for continuing with Jesus after the festival.
- [The Jesus Festival Movement](${SITE.url}/movement): Stay connected to the year-round mission and find ways to serve.
- [Festival Photos and Testimonies](${SITE.url}/photos): Browse and share moments from the weekend; official updates are also published on [Instagram](https://www.instagram.com/jesusfestival.ca) and [Facebook](https://www.facebook.com/JesusFestival.ca).
- [Love on Hamilton](https://loveonhamilton.com): Local outreach for people in the Hamilton area.
- [Love on The World](https://loveontheworld.com): Join or create an outreach group outside Hamilton.
- [Daniel & Katie Ziedins](https://kd-ziedins.com): Continued e3 Canada and I Am Second work, updates and partnership information.
- [Official Festival Shop](${SITE.url}/shop): Jesus Festival collection from ThyKingdom.Shop in Canadian dollars.
- Share a testimony, request prayer or ask for help with a next step: [hello@jesusfestival.ca](mailto:hello@jesusfestival.ca).

## Completed 2026 event archive

- [Archived Official 2026 Festival Guide](${SITE.url}/jesus-festival-hamilton): Dates, hours, admission, lineup, parking, transit, what to bring and family information from the completed event.
- [Archived 2026 Schedule](${SITE.url}/schedule): Friday Pure Worship Night and Saturday Family Festival Day stage times.
- [Gage Park Map](${SITE.url}/map): The 2026 festival layout and park information.
- [Accessibility and Comfort Guide](${SITE.url}/accessibility): The accessibility planning information prepared for the completed event.
- [Festival FAQ](${SITE.url}/faq): Direct answers to common visitor questions.

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
