/**
 * The Jesus Festival blog.
 *
 * These are statically prerendered pages (unlike the in-app newsfeed, which is
 * client-rendered from Supabase and therefore invisible to crawlers). Each post
 * is real, useful writing that links out to the wider Kingdom Network where it
 * genuinely helps the reader — which is also exactly what earns SEO value.
 *
 * Inline links use a tiny [label](url) syntax rendered as real <a> elements —
 * never dangerouslySetInnerHTML.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "list"; items: string[] }
  | { t: "quote"; text: string; ref: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  emoji: string;
  date: string;
  readMins: number;
  body: Block[];
  /** Domains from KINGDOM_SITES to surface as cards at the end of the post. */
  related: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-a-free-festival",
    title: "Why We Give a Whole City a Free Festival",
    description:
      "No tickets, no barriers, no one turned away. The story behind why Jesus Festival Hamilton is completely free — and what that decision has cost and produced.",
    eyebrow: "The heart behind it",
    emoji: "🎪",
    date: "2026-08-02",
    readMins: 5,
    body: [
      { t: "p", text: "Every year someone asks the same question: *why free?* Running a two-day festival in a public park is not cheap. Stages, sound, security, insurance, kids zones — it all costs real money. Charging even ten dollars a head would cover a serious chunk of it." },
      { t: "p", text: "We don't, and we won't. Here's why." },
      { t: "h2", text: "Because the Gospel was free to us" },
      { t: "p", text: "The single most valuable thing any of us have ever received arrived with no invoice attached. Grace cost Jesus everything and cost us nothing. It would be strange to build an event around that message and then put a turnstile in front of it." },
      { t: "quote", text: "Freely you have received; freely give.", ref: "Matthew 10:8" },
      { t: "h2", text: "Because a ticket price sorts people" },
      { t: "p", text: "The moment there's a price, a sorting happens. The family stretching to the end of the month decides not to come. The teenager with no money doesn't ask. The person who's curious but not convinced isn't willing to gamble cash on it." },
      { t: "p", text: "Those are exactly the people we built this for. A free festival in a public park means the single mum, the skeptic, the guy walking his dog through Gage Park who had no idea this was on today — they can all just... walk in. That's the whole point." },
      { t: "h2", text: "Because it makes the Church visible in a good way" },
      { t: "p", text: "Cities have opinions about churches. Some of them are earned. A weekend where dozens of congregations pool their money and volunteers to give the city something beautiful — with nothing to sell — quietly rewrites some of those opinions." },
      { t: "p", text: "We've watched churches that had never spoken become friends over a shared tent. We've watched people who'd sworn off church sit on the grass through an entire worship set. That doesn't happen at a ticketed event." },
      { t: "h2", text: "How it actually gets paid for" },
      { t: "p", text: "By people. Partner churches, Kingdom businesses, and individuals who decide the city is worth it. If that stirs something in you, [giving toward the festival](https://www.jesusfestival.ca/donate) is the most direct way to keep a gate open for someone who couldn't otherwise walk through it." },
      { t: "p", text: "And if you're reading this from another city entirely, wondering whether something like this could happen where you live: it can. [JesusFestivalMovement.com](https://www.jesusfestivalmovement.com) exists for exactly that conversation." },
      { t: "p", text: "Come and see for yourself. September 4–5, Gage Park, Hamilton. Bring a friend. It won't cost either of you a thing." },
    ],
    related: ["JesusFestival.ca", "JesusFestivalMovement.com", "ThyKingdom.net"],
  },

  {
    slug: "you-already-know-your-mission-field",
    title: "You Already Know Your Mission Field",
    description:
      "Most of us are waiting for a calling to somewhere far away. Meanwhile God has already placed about a dozen people around you. Here's how to actually reach them.",
    eyebrow: "Everyday evangelism",
    emoji: "🧭",
    date: "2026-07-28",
    readMins: 6,
    body: [
      { t: "p", text: "There's a word the early Church used constantly that most of us have never heard: *oikos*. It's Greek for household — but not just the people under your roof. It meant your whole relational world: family, close friends, neighbours, the people you work with, the barista who knows your order." },
      { t: "p", text: "When the New Testament describes the Gospel spreading, it almost never spreads through strangers. It spreads through oikos. Cornelius gathers his household. The Philippian jailer's whole family believes. Andrew finds his brother first." },
      { t: "h2", text: "The problem with waiting for a calling" },
      { t: "p", text: "A lot of sincere Christians spend years waiting to be sent somewhere. Meanwhile there are roughly eight to fifteen people in their ordinary life who already trust them, already take their calls, and already notice how they handle a bad week." },
      { t: "p", text: "You will likely never have more spiritual credibility with anyone than you already have with those people. That's not a consolation prize. That's the assignment." },
      { t: "quote", text: "Go home to your own people and tell them how much the Lord has done for you.", ref: "Mark 5:19" },
      { t: "h2", text: "Three things that actually move the needle" },
      {
        t: "list",
        items: [
          "**Name them.** Vague intentions produce vague results. Write down the actual names. Most people are shocked how short and how obvious the list is.",
          "**Pray for them by name, consistently.** Not once in a burst of guilt — weekly, by name, for months. This is the part everyone skips and the part that changes everything.",
          "**Do one concrete kindness.** Not a sermon. A meal, a lift, an honest question, showing up when something hard happens. Love makes the message credible.",
        ],
      },
      { t: "h2", text: "A tool that makes it stick" },
      { t: "p", text: "We built [OikosMap.com](https://www.oikosmap.com) for exactly this, and it's completely free. You map the people already around you, see the whole picture on one page, and pray through it without needing to remember who you meant to pray for. It takes about five minutes to build and you'll use it for years." },
      { t: "p", text: "If you're the kind of person who ends up in a lot of real spiritual conversations and keeps losing the thread — who said what, who wanted a Bible, who you promised to follow up with — [KingdomBase.App](https://kingdombase.app) is built to hold that for you so nobody quietly falls through the cracks." },
      { t: "h2", text: "Then invite them to something easy" },
      { t: "p", text: "Here's why a free festival in a public park matters so much for this: it is one of the lowest-pressure invitations in existence. There's no service to sit through, no offering plate, no expectation. It's a park, some food trucks, and music." },
      { t: "p", text: "Your one person might never say yes to a church service. Most people will say yes to a free Saturday in the park with a friend. Start there." },
    ],
    related: ["OikosMap.com", "KingdomBase.App", "LoveonHamilton.com"],
  },

  {
    slug: "what-happens-after-you-say-yes",
    title: "What Happens After You Say Yes to Jesus",
    description:
      "Nobody hands you a manual the moment you believe. Here's an honest, gentle guide to the first weeks of following Jesus — what changes, what doesn't, and what to do next.",
    eyebrow: "New life",
    emoji: "🕊️",
    date: "2026-07-22",
    readMins: 6,
    body: [
      { t: "p", text: "Maybe it happened at a festival, in a car, in a hospital corridor, or lying awake at 3am. However it happened — you said yes to Jesus, and now you're wondering what you actually just signed up for." },
      { t: "p", text: "Nobody hands you a manual. So here's an honest one." },
      { t: "h2", text: "What actually changed" },
      { t: "p", text: "Something real and permanent happened, and it happened entirely on God's side of the ledger. You were forgiven. You were adopted. The Holy Spirit moved in. None of that is dependent on how spiritual you feel tomorrow morning." },
      { t: "quote", text: "Therefore, if anyone is in Christ, the new creation has come: the old has gone, the new is here!", ref: "2 Corinthians 5:17" },
      { t: "h2", text: "What probably didn't change (yet)" },
      { t: "p", text: "Your temper. Your anxiety. That habit. Your difficult family. Some people get a dramatic overnight rewiring — most don't, and that's not a sign anything went wrong." },
      { t: "p", text: "Sanctification is a slow, real, lifelong renovation, not a factory reset. The goal in week one is not to be impressive. It's to stay close." },
      { t: "h2", text: "Four things for the first month" },
      {
        t: "list",
        items: [
          "**Talk to God like a person, not a performance.** Out loud, in the car, in your own words. That's prayer. You don't need the vocabulary.",
          "**Read one Gospel.** Start with John. Ten minutes a day. Meet Jesus in his own words before anyone else explains him to you.",
          "**Tell one person.** Saying it out loud makes it real and gives someone the chance to walk with you.",
          "**Find actual people.** A church, a small group, one honest friend. Faith practised alone gets fragile fast.",
        ],
      },
      { t: "h2", text: "Where to go from here" },
      { t: "p", text: "[IAmReborn.net](https://www.iamreborn.net) was built for precisely this moment — the first days of new life, explained simply, without assuming you already know the language. If you're at the very start, begin there." },
      { t: "p", text: "When you're ready to go deeper into what it means to actually put the Kingdom first in ordinary life, [SeekFirst.World](https://www.seekfirst.world) picks up that thread." },
      { t: "p", text: "And if you're local, our [discipleship and partner churches](https://www.jesusfestival.ca/discipleship) are genuinely glad to meet you. You don't have to have it together to walk in. Nobody there does either." },
      { t: "p", text: "One last thing: you will have a bad week. It's coming. It is not evidence that this wasn't real. Keep showing up — He's not going anywhere." },
    ],
    related: ["IAmReborn.net", "SeekFirst.World", "KD-Ziedins.com"],
  },

  {
    slug: "how-to-love-your-city",
    title: "How to Actually Love a City",
    description:
      "Loving your city sounds noble and vague. Here's what it looks like in practice — small, repeatable, unglamorous things that genuinely change a neighbourhood.",
    eyebrow: "Loving your city",
    emoji: "🏙️",
    date: "2026-07-15",
    readMins: 5,
    body: [
      { t: "p", text: "\"Love your city\" is one of those phrases that sounds wonderful and means almost nothing until you make it specific. So let's make it specific." },
      { t: "h2", text: "Start by praying for one neighbourhood by name" },
      { t: "p", text: "Not \"the city\" — that's too big to feel. Pick a street, a school, a block you drive past. Pray for it by name for a month and watch how differently you start seeing it." },
      { t: "quote", text: "Seek the peace and prosperity of the city to which I have carried you… Pray to the Lord for it.", ref: "Jeremiah 29:7" },
      { t: "h2", text: "Then do the small, unglamorous things" },
      {
        t: "list",
        items: [
          "Learn the names of the people who work where you shop, and use them.",
          "Notice who's struggling on your street. Bring food before you're asked.",
          "Pick up litter in a park you didn't dirty.",
          "Show up to the neighbourhood thing you'd normally skip.",
          "Tip generously and be unreasonably kind to service staff.",
        ],
      },
      { t: "p", text: "None of this will trend. All of it is what a city actually feels when the Church is present." },
      { t: "h2", text: "Do it with other people" },
      { t: "p", text: "Loving a city alone burns you out in about six weeks. [LoveonHamilton.com](https://www.loveonhamilton.com) exists so that all this practical love happens together, all year — not just on festival weekend." },
      { t: "p", text: "If you're outside Hamilton, [LoveonTheWorld.com](https://www.loveontheworld.com) carries the same heart wherever you are, and [LoveonMission.world](https://www.loveonmission.world) maps where the Gospel is moving globally so you can pray with your eyes open." },
      { t: "h2", text: "And be ready for the hard days" },
      { t: "p", text: "Cities don't only need kindness — sometimes they need help fast. Floods, fires, storms. [KingdomResponse.com](https://www.kingdomresponse.com) mobilises churches to be first on the scene with real help and real hope when crisis hits. Loving a city means being there for its worst week, not just its best Saturday." },
      { t: "p", text: "Jesus Festival is two days a year. What we're actually after is a city that's different the other 363." },
    ],
    related: ["LoveonHamilton.com", "LoveonTheWorld.com", "LoveonMission.world", "KingdomResponse.com"],
  },

  {
    slug: "faith-at-work-kingdom-business",
    title: "Your Job Is Not a Distraction From Your Calling",
    description:
      "Most Christians spend more waking hours at work than anywhere else — and quietly assume it's spiritually neutral territory. It isn't.",
    eyebrow: "Faith at work",
    emoji: "🦁",
    date: "2026-07-08",
    readMins: 5,
    body: [
      { t: "p", text: "There's an unspoken hierarchy in a lot of churches. Pastors and missionaries do *ministry*. Everyone else has a *job* that pays for ministry. Work is the thing you get through so the real stuff can happen in the evenings." },
      { t: "p", text: "That idea is not in the Bible." },
      { t: "quote", text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", ref: "Colossians 3:23" },
      { t: "h2", text: "Where your life actually happens" },
      { t: "p", text: "You will spend something like 90,000 hours of your life at work. That's not the waiting room outside your calling — for most people it *is* the mission field, and it's full of people who will never attend a church service but who watch closely how you handle a deadline, a difficult client, or a mistake that was your fault." },
      { t: "h2", text: "What it looks like on a Tuesday" },
      {
        t: "list",
        items: [
          "**Excellence as worship.** Sloppy work with a fish on the invoice damages the name you're trying to honour.",
          "**Integrity when it costs.** The quiet decisions nobody would ever catch are the ones that build actual credibility.",
          "**Treating people like people.** Especially the ones who can do nothing for you.",
          "**Generosity with what it produces.** Profit is a tool. Kingdom business owners fund things that could never fund themselves.",
        ],
      },
      { t: "h2", text: "Don't do it alone" },
      { t: "p", text: "Running a business with Kingdom conviction is lonely if nobody around you shares it. [LionsDenAlliance.com](https://www.lionsdenalliance.com) is an alliance of Christian business owners who refuse to separate Sunday from Monday — and much of what funds a free festival comes from exactly these people." },
      { t: "p", text: "A few examples of what this looks like when it's built on purpose: [SIX33Outpost.com](https://www.six33outpost.com) makes apparel designed to start conversations before you say a word. [SIX33Legends.com](https://www.six33legends.com) builds cinematic storytelling that makes courage and faith feel as epic as they actually are. And [TaskSimply.com](https://www.tasksimply.com) is a quieter kind of Kingdom tool — tasks, teams and budgets in one calm place, because stewarding your days well is genuinely spiritual work." },
      { t: "p", text: "If you want the longer version of the thinking behind building Kingdom things in the everyday world, [DanielZiedins.com](https://www.danielziedins.com) is where that's written out." },
      { t: "p", text: "Your work is not a distraction from your calling. Handled well, it may be the largest part of it." },
    ],
    related: ["LionsDenAlliance.com", "SIX33Outpost.com", "SIX33Legends.com", "TaskSimply.com", "DanielZiedins.com"],
  },

  {
    slug: "one-invitation-changes-everything",
    title: "The Most Underrated Thing You Can Do This Year",
    description:
      "Not a program. Not a platform. Just one honest invitation to one person — and why it's still how almost everyone finds their way in.",
    eyebrow: "The invitation",
    emoji: "🤝",
    date: "2026-07-01",
    readMins: 4,
    body: [
      { t: "p", text: "Ask around a room of Christians how they first came to faith and you'll rarely hear \"an advert\" or \"an algorithm.\" You'll hear a name. A friend who invited them. A coworker who kept being kind. A grandmother who prayed for two decades." },
      { t: "p", text: "It's almost always a person. It's almost always an invitation." },
      { t: "h2", text: "Why we don't do it" },
      { t: "p", text: "Mostly fear — of being weird, of damaging a friendship, of not having answers. Which is understandable, and also mostly imaginary. You're not asking someone to sign a doctrinal statement. You're asking if they want to come to a thing." },
      { t: "quote", text: "Go out to the roads and country lanes and compel them to come in, so that my house will be full.", ref: "Luke 14:23" },
      { t: "h2", text: "Make it as easy as possible to say yes" },
      { t: "p", text: "This is exactly why a free, outdoor, no-strings festival is such a useful front door. There's no service to endure, no offering, no commitment. It's a park on a Saturday with food trucks and music." },
      { t: "p", text: "The app makes this almost effortless — open [the invite card](https://www.jesusfestival.app) and it generates a shareable image with the date and details already on it. One tap, one text, done." },
      { t: "h2", text: "Then just be normal" },
      { t: "p", text: "Go with them. Buy them a coffee. Don't over-explain, don't monitor their reaction during worship, don't debrief them in the car like an exit interview. Let God do God's part." },
      { t: "p", text: "You are not responsible for the outcome. You're responsible for the invitation." },
      { t: "p", text: "So — who's your one? You almost certainly thought of someone in the first ten seconds of reading this. That's not random. Text them today." },
    ],
    related: ["JesusFestival.ca", "OikosMap.com", "IAmReborn.net"],
  },
];

export const postBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);

/** Newest first — the order the blog index and sitemap use. */
export const sortedPosts = () => [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
