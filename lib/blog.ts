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
    slug: "never-been-to-anything-like-this",
    title: "If You've Never Been to Anything Like This Before",
    description:
      "Someone invited you to Jesus Festival and you said yes before you thought it through. Here's honestly what happens, what nobody will ask of you, and why you're more welcome than you think.",
    eyebrow: "For the first-timer",
    emoji: "🫂",
    date: "2026-08-13",
    readMins: 6,
    body: [
      { t: "p", text: "Someone you trust invited you to a Christian festival at Gage Park. You said yes — maybe because you love them, maybe because it's free, maybe because some quiet part of you was curious. And now it's a few weeks out and you're wondering what exactly you agreed to." },
      { t: "p", text: "This is written for you specifically. Not for the person who invited you. You." },
      { t: "h2", text: "What is actually going to happen" },
      { t: "p", text: "It's an outdoor festival in a public park. There's a stage with bands on it. There are food trucks. There are bouncy castles and lawn games and a spray pad, and a lot of kids running around with their faces painted. People bring lawn chairs and blankets and sit on the grass. Some of them will be worshipping with their hands in the air. Some will be eating tacos. Both of those are normal here." },
      { t: "p", text: "Between the music, people get up and talk — usually for ten or fifteen minutes. Some of them will explain what Christians believe about Jesus. Some will tell you what happened in their own life. On Saturday there are baptisms, which mostly looks like people getting joyfully soaked while a crowd cheers." },
      { t: "p", text: "You can look at the whole [run of show](https://www.jesusfestival.app/schedule) if it helps to know. Some people find the unknown much worse than the plan." },
      { t: "h2", text: "What nobody is going to ask you to do" },
      { t: "list", items: [
        "**Nobody will ask you for money.** It's free. There's no ticket, no gate, no collection, no envelope. If someone tells you what it cost to put on, it's because they're grateful, not because they're hinting.",
        "**Nobody will single you out.** No spotlight, no stand-up-if-you're-new, no raise-your-hand-if-you're-visiting. You can arrive, sit down, and leave without speaking to anyone.",
        "**Nobody needs you to perform.** You don't have to sing. You don't have to close your eyes or lift your hands or say amen. Sitting quietly through a worship set is a completely normal thing to do and nobody is watching you.",
        "**Nobody is going to corner you.** If someone offers to pray for you and you'd rather they didn't, \"no thanks\" is a full sentence and it will be respected the first time.",
        "**You can leave whenever you want.** It's a public park. There's no exit interview.",
      ] },
      { t: "h2", text: "The awkward part, named out loud" },
      { t: "p", text: "Here's the thing that's probably actually bothering you: you don't want to be the person who doesn't know the words. You don't want to be handled. You don't want somebody's project." },
      { t: "p", text: "That's fair. Churches have earned some of that suspicion, and pretending otherwise would be insulting. So let me just say plainly: you are not a project. Your friend didn't invite you to close a deal. They invited you because something happened to them that they can't stop being glad about, and you're one of the people they'd most want to be there." },
      { t: "p", text: "That's it. That's the whole motive." },
      { t: "h2", text: "What Jesus was actually like with outsiders" },
      { t: "p", text: "If your picture of Christianity is mostly rules and disapproval, it's worth knowing that the religious people of Jesus' own day complained about the exact opposite. Their objection was that he was too welcoming — that he kept eating dinner with the wrong people." },
      { t: "quote", text: "Now the tax collectors and sinners were all gathering around to hear Jesus. But the Pharisees and the teachers of the law muttered, \"This man welcomes sinners and eats with them.\"", ref: "Luke 15:1–2" },
      { t: "p", text: "That was the accusation. He welcomes the wrong people and shares meals with them. He never denied it — he told three stories in a row about how much God enjoys finding someone who was lost." },
      { t: "p", text: "So if you turn up at Gage Park half-sceptical, with questions you think are too rude to ask, eating a taco through the sermon — you are, historically speaking, exactly the demographic he went out of his way for." },
      { t: "h2", text: "Practical things that will make the day better" },
      { t: "list", items: [
        "**Bring a chair or a blanket.** The lawn fills from the front. This is the single most common regret.",
        "**Come with your person.** Arrive together, sit together. Having one familiar face changes everything about a new room — or a new field.",
        "**Saturday is the easy way in.** 10am to 6pm, families everywhere, food, games, noise. It's much less intense than Friday's worship night if intensity is what you're worried about.",
        "**Eat something.** Genuinely. Most \"I feel weird here\" is 30% social and 70% low blood sugar in the sun.",
        "**Set your expectations at zero.** You don't owe the day a decision, a feeling, or a conclusion. You're allowed to just be there.",
      ] },
      { t: "p", text: "The [park map](https://www.jesusfestival.app/map) shows where the food, the washrooms, the shade and the exits are, and the [FAQ](https://www.jesusfestival.app/faq) answers the practical stuff. There's also a prayer tent, and the only thing you need to know about it is that you never have to go near it." },
      { t: "h2", text: "And if something does happen" },
      { t: "p", text: "Sometimes people come to a thing like this fully intending to stay on the edge, and something lands anyway. A line in a song. A stranger's story that sounds too much like their own. A sense — hard to describe later — of being known." },
      { t: "p", text: "If that happens to you, you don't have to announce it or do anything about it in the moment. You can drive home and think about it for a month. But there's a page in this app that just quietly explains what it would mean and what you might do next, with no sign-up and no email and nobody following up: [I said yes to Jesus](https://www.jesusfestival.app/i-said-yes)." },
      { t: "p", text: "And if nothing happens? You had a free day in a park with someone who loves you, and you ate well. That's not a wasted Saturday." },
      { t: "quote", text: "Taste and see that the Lord is good.", ref: "Psalm 34:8" },
      { t: "p", text: "That's an invitation to try, not a demand to conclude. Come and see for yourself. September 4–5, Gage Park, Hamilton. Bring a chair." },
    ],
    related: ["JesusFestival.ca", "IAmReborn.net", "LoveonHamilton.com"],
  },
  {
    slug: "how-to-pray-for-your-city",
    title: "How to Pray for a City (When It Feels Too Big)",
    description:
      "Praying for a whole city sounds enormous and vague. Scripture makes it surprisingly concrete — five biblical patterns for praying over the streets you actually live on.",
    eyebrow: "Prayer",
    emoji: "🏙️",
    date: "2026-08-11",
    readMins: 7,
    body: [
      { t: "p", text: "\"Pray for our city\" is one of those phrases everyone nods along to and almost nobody knows how to actually do. You bow your head, you think *God, bless Hamilton*, and then there's a long pause where you realise you have no idea what comes next." },
      { t: "p", text: "The problem isn't your faith. It's scale. A city is 570,000 people and you have one mouth and about four minutes. So the mind reaches for something enormous and generic, and generic prayer is hard to keep doing." },
      { t: "p", text: "Scripture is far more concrete than we are. Here are five patterns straight out of the text — and none of them require you to pray for half a million people at once." },
      { t: "h2", text: "1. Pray for its peace, not its conversion statistics" },
      { t: "p", text: "God's instruction to exiles living in a city they didn't choose and didn't like is startlingly practical:" },
      { t: "quote", text: "Seek the peace and prosperity of the city to which I have carried you. Pray to the Lord for it, because if it prospers, you too will prosper.", ref: "Jeremiah 29:7" },
      { t: "p", text: "That's Babylon. Not Jerusalem. God tells his people to pray for the flourishing of a pagan city — its economy, its safety, its wellbeing — and ties their own future to it. The Hebrew word there is *shalom*: not merely the absence of conflict but wholeness, things working as they should." },
      { t: "p", text: "So pray for the hospital. The school board. The housing crisis. The bus routes. The people making decisions at City Hall this week. That's not a warm-up to real prayer; Jeremiah says that *is* the assignment." },
      { t: "h2", text: "2. Walk it, and let what you see set the agenda" },
      { t: "p", text: "When Nehemiah wanted to pray for Jerusalem, he didn't start with a strategy. He went out at night and looked at the walls." },
      { t: "quote", text: "By night I went out through the Valley Gate… examining the walls of Jerusalem, which had been broken down.", ref: "Nehemiah 2:13" },
      { t: "p", text: "He inspected the damage before he asked for anything. Then he wept, then he prayed, then he built." },
      { t: "p", text: "Try the same order. Walk one street of your own neighbourhood slowly with your phone in your pocket. Notice the boarded-up unit, the overflowing bin, the man asleep in the doorway, the young family who just moved in. Pray for what your eyes actually land on. A prayer walk beats a prayer list because the city writes the list for you." },
      { t: "h2", text: "3. Name individuals, not categories" },
      { t: "p", text: "Jesus prayed for cities and he wept over them — but when he taught prayer, he pushed relentlessly towards the specific: this neighbour, this debt, this daily bread. Paul does the same, filling his letters with names." },
      { t: "p", text: "\"Bless the lonely people of Hamilton\" is hard to pray twice. \"Be with Ray on the corner, who lost his wife in March\" is a prayer you'll still be praying next year." },
      { t: "p", text: "If you don't know who to name, that's the real thing to fix first — and it's a mapping problem more than a prayer problem. [Oikos Map](https://www.oikosmap.com) is a free tool for writing down the eight or ten people God has already placed around you, so that praying for your city becomes praying for people whose names you know." },
      { t: "h2", text: "4. Pray with other people, out loud" },
      { t: "p", text: "Almost every city-shaped prayer in the Bible is corporate. The early church prayed together and the room shook. Something happens when prayer stops being private that doesn't happen when it stays private." },
      { t: "quote", text: "For where two or three gather in my name, there am I with them.", ref: "Matthew 18:20" },
      { t: "p", text: "This is the simplest and most-avoided step, because praying aloud in front of another human being is mildly terrifying. Do it badly. Nobody is grading it. Pray with your spouse, or one friend on a phone call, or on the [Prayer Wall](https://www.jesusfestival.app/prayer), where you can post one line and find other people already holding up the same thing." },
      { t: "h2", text: "5. Pray with your hands as well as your mouth" },
      { t: "p", text: "James is blunt about the version of prayer that stays entirely verbal — the *be warmed and filled* prayer offered to someone who needs a coat. He calls that faith dead." },
      { t: "quote", text: "Suppose a brother or a sister is without clothes and daily food. If one of you says to them, \"Go in peace; keep warm and well fed,\" but does nothing about their physical needs, what good is it?", ref: "James 2:15–16" },
      { t: "p", text: "The test of whether you're really praying for your city is whether your prayers keep costing you things — a Saturday, a meal, a difficult conversation, a cheque. When you ask God to move in a neighbourhood, be ready for the answer to be *you, on Tuesday*." },
      { t: "p", text: "That's most of what [Love on Hamilton](https://www.loveonhamilton.com) is: prayer that got up off the sofa. And it's why Jesus Festival exists at all — a weekend of the whole church praying for one city with its hands." },
      { t: "h2", text: "The promise underneath all of it" },
      { t: "p", text: "There's a reason to keep going when nothing visibly changes for a long time. The promise is not that God will notice a big enough crowd. It's that he is already listening for the smallest voice." },
      { t: "quote", text: "If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land.", ref: "2 Chronicles 7:14" },
      { t: "p", text: "Notice the order. Humble, pray, seek, turn — then heal. Three of those four happen inside you before anything happens outside you. Revival in a city has almost always started as repentance in a few unremarkable people." },
      { t: "p", text: "So don't try to pray for 570,000 people tonight. Pray for one street, one name, one decision at City Hall, out loud, with somebody. Then do it again tomorrow. Cities have been turned by less." },
      { t: "p", text: "If you want to do it with a few thousand others: September 4–5, Gage Park. That's the plan. [Come and pray with us](https://www.jesusfestival.app/schedule)." },
    ],
    related: ["LoveonHamilton.com", "OikosMap.com", "SeekFirst.World", "ThyKingdom.net"],
  },
  {
    slug: "wear-the-message",
    title: "What You Wear Can Start the Conversation",
    description:
      "Most Gospel conversations don't start with a sermon — they start with a question. On faith-worn-out-loud, the new Kingdom Shop, and the official Jesus Festival collection.",
    eyebrow: "Wear the message",
    emoji: "🛍️",
    date: "2026-08-05",
    readMins: 4,
    body: [
      { t: "p", text: "Here's a small evangelism secret nobody puts on conference slides: an enormous number of Gospel conversations don't start with an invitation or an argument. They start with a question. *\"What's your shirt about?\"*" },
      { t: "p", text: "A question is the easiest opening in the world, because the other person started it. No awkward pivot, no working up the nerve. They asked. You just answer honestly." },
      { t: "h2", text: "Faith was never meant to be invisible" },
      { t: "p", text: "There's a healthy caution in Christians who don't want faith to be a costume — Jesus had strong words for religion worn as performance. But there's a difference between performing and being unashamed. One is about looking impressive; the other is about being findable." },
      { t: "quote", text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.", ref: "Romans 1:16" },
      { t: "p", text: "A shirt won't save anyone. But it marks you as safe to ask — and in a lonely, quietly curious city, being safe to ask is no small ministry." },
      { t: "h2", text: "So we opened a shop" },
      { t: "p", text: "[The Kingdom Shop](https://thykingdom.shop) is the new home for apparel across the whole network — bold, well-made designs built to open conversations, from Seek First pieces to Love on Hamilton gear. And because you're reading this here: it carries the [official Jesus Festival collection](https://thykingdom.shop/collections/jesus-festival), including this year's festival tee." },
      { t: "p", text: "You can browse it right inside the app — open the [Festival Shop](https://www.jesusfestival.app/shop) — and checkout happens securely on the store." },
      { t: "h2", text: "Where the money goes" },
      { t: "p", text: "This is the part we care most about: the shop exists to fund the mission, not the other way around. Orders sow back into the Kingdom work behind this festival — the same heart as [SIX33 Outpost](https://www.six33outpost.com), and the same conviction the [Lions Den Alliance](https://www.lionsdenalliance.com) businesses carry: commerce, done right, is a Kingdom engine." },
      { t: "list", items: [
        "**Wear it to the festival.** Spot each other across Gage Park — one family, visibly.",
        "**Wear it after.** September 6 is when the shirt starts its real job.",
        "**Give one away.** A hoodie handed to a friend says more than most sermons.",
      ] },
      { t: "p", text: "And when someone does ask about your shirt — don't panic, don't preach. Just tell them what Jesus has actually done for you. That's the whole conversation. The shirt just opened the door." },
    ],
    related: ["ThyKingdom.Shop", "SIX33Outpost.com", "LionsDenAlliance.com"],
  },
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
