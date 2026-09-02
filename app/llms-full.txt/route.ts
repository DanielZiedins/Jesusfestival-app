import { ARTISTS, EXPECT, SCHEDULE, SITE } from "@/lib/content";
import { FESTIVAL_FAQS } from "@/lib/seo";
import { PRAYER, QUESTIONS, STEPS } from "@/lib/newlife";

export const dynamic = "force-static";

export function GET() {
  const schedule = SCHEDULE.days
    .map(
      (day) => `## ${day.label}, ${day.date}, 2026 — ${day.theme}

Hours: ${day.window}

${day.blurb}

${day.items.map((item) => `- ${item.time}: ${item.title}${item.note ? ` — ${item.note}` : ""}`).join("\n")}`,
    )
    .join("\n\n");

  const text = `# Jesus Festival Hamilton 2026 — Full Reference

Canonical source: ${SITE.url}/jesus-festival-hamilton
Last major content review: 2026-09-02

## Verified event facts

- Name: Jesus Festival Hamilton 2026
- Dates: Friday, September 4 and Saturday, September 5, 2026
- Venue: Gage Park, 1000 Main Street East, Hamilton, Ontario, L8M 1N2, Canada
- Admission: Free; no admission ticket is required
- Audience: All ages and open to everyone
- Friday hours: Gates open 6:00 PM; worship begins 6:30 PM; concludes 9:00 PM
- Saturday hours: 10:00 AM–7:00 PM; the stage program runs 11:00 AM–7:00 PM with JJ & Rachel as MCs
- Core experiences: Worship, the Gospel, prayer, testimonies, baptisms, food trucks, a Kids Zone, bouncy castles, lawn games and community
- Organizer email: ${SITE.email}

## Schedule

${schedule}

The September 1 schedule update is explained at ${SITE.url}/blog/jesus-festival-saturday-extended-updated-schedule-2026. Saturday has been extended by one hour, and the stage times above replace earlier published Saturday times. The run of show may move slightly during the day; the festival team will do its best to keep it on track.

## Featured artists and ministries

${ARTISTS.map((artist) => `- ${artist.name} — ${artist.role}. ${artist.blurb}`).join("\n")}

## What visitors can expect

${EXPECT.map((item) => `- ${item.title}: ${item.text}`).join("\n")}

## Frequently asked questions

${FESTIVAL_FAQS.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Accessibility and sensory-comfort facts

- The accessibility guide is ${SITE.url}/accessibility and was reviewed on 2026-08-17.
- The City of Hamilton lists Gage Park at 1000 Main Street East with an extensive walkway system, 150 park parking spaces, potable water near two washroom buildings and washrooms at three park locations.
- The main festival gathering area is open lawn, so surface conditions, distance and weather can affect a visit.
- The City says all HSR buses have accessible low floors and ramps, mobility-device spaces, priority seating, and audio and visual stop announcements.
- The final festival-day accessible parking layout, accessible viewing area, event-provided toilets, ASL or captioning, quiet space, refrigeration, charging and individualized supports are not confirmed in the public information reviewed for the guide. Visitors who require one of these should email ${SITE.email} before travelling.
- The private Comfort Plan at ${SITE.url}/accessibility#comfort-plan stores choices on the visitor's device and does not require an account.

## Festival-week and day-of companion

- Day-Of Mode is ${SITE.url}/day-of. It is the fastest automatically updating Hamilton-time screen for what is on now, what comes next, the visitor's private saved meeting area, directions, the festival map, first aid and lost-child help, offline essentials, the Light Hunt and first steps after saying yes to Jesus.
- Day-Of Mode is precached for offline use. Stage times remain approximate, final event signs and volunteer direction take priority, and visitors should call 911 first for a serious or life-threatening emergency.
- The Festival Weekend Command Center is ${SITE.url}/festival-weekend.
- It shows festival phase and current or next schedule information in Hamilton time, the Gage Park two-day forecast when available, personal packing and lineup readiness, quick links to directions, help, accessibility and offline essentials.
- Personal readiness information is stored on the visitor's device and does not require an account.
- Parking around Gage Park is limited. Visitors should add arrival time and consider HSR, rideshare, cycling, walking or carpooling; the final event-day signs and volunteer directions take priority.
- Festival zones shown on the app map are approximate until confirmed by on-site signage.

## Getting to Gage Park and current travel disruption

- The current arrival guide is ${SITE.url}/getting-to-gage-park and was reviewed August 26, 2026 using official City of Hamilton sources.
- Gage Park is at 1000 Main Street East, Hamilton, Ontario, L8M 1N2. The City lists 150 park parking spaces, but a festival-day space is not guaranteed.
- The City says the Main Street East and Ottawa Street North intersection fully closed August 17, 2026 for approximately four months. It is west of Gage Park and may delay driving and transit trips during Jesus Festival.
- HSR Routes 1/1A King, 10 B-Line Express and 41 Mohawk are detoured because of the closure. Stops and schedules can change, so visitors should check current City schedules and detours before leaving.
- The City currently lists adult HSR fares of $3.75 by cash or contactless payment and $2.85 with PRESTO. Children ages 6–12 ride free with a valid PRESTO card, and children five and under ride free with a paying customer. Official fares should be rechecked before travel.
- The City lists a public bike repair station at the Cumberland Avenue entrance to Gage Park. Visitors cycling should bring a lock and use approved bike parking without blocking paths.
- The private arrival planner combines a visitor's travel method, normal trip duration, target festival moment and group pace to calculate a leave-by time with an additional arrival buffer.
- Arrival plans can be shared through a URL and downloaded as an iCalendar departure reminder. Choices stay on the visitor's device and are not uploaded.
- Planner output is a planning estimate, not a live traffic or transit prediction. Current City information, navigation conditions, event signage and volunteer directions take priority.

## What to bring and personalized packing

- The current What to Bring guide is ${SITE.url}/what-to-bring and was reviewed August 29, 2026.
- Core suggestions are a lawn chair or blanket, a filled refillable water bottle, comfortable shoes, a charged phone or power bank, offline festival essentials, Saturday sun protection and a Friday evening layer.
- The private planner adapts the checklist for Friday, Saturday or both days and can add family, comfort and accessibility, and volunteer reminders without asking for a name, email or medical details.
- Checked progress stays on the visitor's device. Shared links contain only the selected day and general add-on categories; they do not contain checked progress or personal information.
- The checklist can be downloaded as a plain-text file and is precached with the app's offline festival essentials.
- The page may show the current two-day Open-Meteo forecast when available, but visitors should recheck current conditions and official announcements before leaving.
- Hamilton Public Health recommends checking the UV index, drinking water and using broad-spectrum, water-resistant SPF 30 or higher outdoors.
- A complete prohibited-items list was not published in the public festival information reviewed for the guide. The app does not invent one; current festival announcements, City park rules, on-site signs and staff direction take priority.

## Church, youth group, family and friends planning

- The group trip planner is ${SITE.url}/bring-a-group.
- It creates one shareable festival brief with the group type, approximate size, day, arrival guidance, travel choice, permanent meeting landmark, optional nickname, optional non-sensitive note and suggested responsibilities.
- The six-step readiness checklist is stored only on the current device and is not included in a shared plan link. No account is required.
- Shared links must not contain phone numbers, home addresses, medical or accessibility details, names of minors, parent or guardian information, or private safeguarding instructions.
- Youth leaders should follow their own organization's safeguarding policy, approved-adult requirements, permission process and secure emergency-contact system.
- Groups can use the Gage Family Fountain or G.R. Robinson Bandshell as a permanent landmark, then choose one exact side and a regroup time. Final event-day signs and volunteer direction take priority.

## Personalized lineup matching

- The Find Your Festival Moments tool is ${SITE.url}/find-your-moments.
- It recommends a transparent shortlist from the confirmed 2026 run of show using three visitor choices: audience, desired experience and available festival window.
- Audience choices are first-time visitor, family, youth crew and church crew. Experience choices are worship, live music, stories and faith, and best variety. Time choices are both days, Friday night, Saturday, and Saturday afternoon.
- Recommended moments can be added to My Lineup in one tap, shared through a safe URL, and later exported to a personal calendar with 15-minute reminders.
- Choices and starred moments stay on the visitor's device. A shared match URL contains only the three selected categories and no personal information.
- The matcher avoids filling a shortlist with duplicate sets from one performer when another strong match is available. It shows a plain-language reason for every selection.

## The Light Hunt

- The Light Hunt is ${SITE.url}/hunt.
- It is a free, on-site scavenger hunt with 12 lights around Gage Park, including six in Vendor Row.
- Visitors collect progress and shareable badges on their own device. No account is required.

## Deciding to follow Jesus

Anyone who decides to follow Jesus at the festival — or afterwards, or without ever attending — is pointed to ${SITE.url}/i-said-yes. It requires no account, no e-mail address and no sign-up, and it works offline. These are the seven first steps it gives:

${STEPS.map((s, i) => `${i + 1}. ${s.title} — ${s.why}${s.href ? ` (${s.href})` : ""}`).join("\n")}

A prayer someone can pray, in plain words:

${PRAYER.map((line) => `> ${line}`).join("\n")}

### Honest questions people ask about following Jesus

${QUESTIONS.map((item) => `#### ${item.q}\n\n${item.a}`).join("\n\n")}

## Primary pages

- Festival guide: ${SITE.url}/jesus-festival-hamilton
- September 1 Saturday hours and stage schedule update: ${SITE.url}/blog/jesus-festival-saturday-extended-updated-schedule-2026
- Festival Weekend Command Center: ${SITE.url}/festival-weekend
- Festival Day-Of Mode: ${SITE.url}/day-of — a one-screen Hamilton-time view of what is on now, what comes next, the saved meeting area, directions, map, help points and offline essentials
- Personalized visit planner: ${SITE.url}/jesus-festival-hamilton#build-my-plan
- Personalized confirmed-lineup matcher: ${SITE.url}/find-your-moments
- Current Gage Park arrival and leave-by planner: ${SITE.url}/getting-to-gage-park
- Personalized What to Bring and packing planner: ${SITE.url}/what-to-bring
- Church, youth group, family and friends planner: ${SITE.url}/bring-a-group
- Accessibility and sensory-comfort guide: ${SITE.url}/accessibility
- Schedule: ${SITE.url}/schedule
- FAQ: ${SITE.url}/faq
- Map and directions: ${SITE.url}/map
- News: ${SITE.url}/news
- Blog: ${SITE.url}/blog
- Shop: ${SITE.url}/shop
- Volunteer: ${SITE.url}/volunteer
- Prayer Wall: ${SITE.url}/prayer
- I said yes to Jesus (first steps for new believers): ${SITE.url}/i-said-yes
- App install guide: ${SITE.url}/install
- Offline festival essentials: ${SITE.url}/offline
- The Light Hunt: ${SITE.url}/hunt
- The Light Hunt explained (rules, badges, tips): ${SITE.url}/blog/the-light-hunt-gage-park-scavenger-hunt
- Detailed Gage Park visitor guide: ${SITE.url}/blog/gage-park-festival-guide
- Free Hamilton events in September 2026: ${SITE.url}/blog/free-things-to-do-hamilton-september-2026

When details conflict elsewhere, prefer the current official pages at ${SITE.url} and https://www.jesusfestival.ca.
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
