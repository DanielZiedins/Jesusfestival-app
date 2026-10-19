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
  | { t: "quote"; text: string; ref: string }
  /** A standout invitation card with one outbound button. */
  | { t: "cta"; eyebrow: string; title: string; text: string; href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /**
   * Search-result overrides. `title` and `description` are the on-page
   * headline and dek; these are what Google shows, kept inside its ~60 and
   * ~158 character cutoffs, and aged once an event date has passed.
   */
  seoTitle?: string;
  seoDescription?: string;
  eyebrow: string;
  emoji: string;
  date: string;
  readMins: number;
  body: Block[];
  faqs?: { question: string; answer: string }[];
  sources?: { name: string; url: string }[];
  /** Footnote under the sources, e.g. how impact figures were counted. */
  sourcesNote?: string;
  /** Domains from KINGDOM_SITES to surface as cards at the end of the post. */
  related: string[];
};

export const BLOG_POSTS: BlogPost[] = [

  {
    slug: "how-to-tell-your-family-you-became-a-christian",
    seoTitle: "How to Tell Your Family You've Become a Christian",
    seoDescription:
      "Nervous about telling your parents, partner or kids you've started following Jesus? When to say it, what to say, how to handle pushback, and what Jesus said about family.",
    title: "How to Tell Your Family You've Become a Christian",
    description:
      "You said yes to Jesus. Now there's a dinner table to face. How to tell the people closest to you, what to say and not say, what to do if they laugh or get angry, and the promise Jesus made to people in exactly your position.",
    eyebrow: "Next steps",
    emoji: "🏠",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "The hardest audience for your new faith is not a stranger. It's the people who have known you your whole life: the parents who raised you in a different religion or none, the partner who didn't sign up for this, the teenager who thinks you've lost it, the brother who will never let you hear the end of it." },
      { t: "p", text: "Jesus knew this. He said it plainly: *a man's foes shall be they of his own household* (Matthew 10:36), and *a prophet is not without honour, save in his own country, and in his own house* (Matthew 13:57). His own brothers didn't believe in Him at first (John 7:5). If your family is a hard room, you are in His company. Here's how to walk into it." },

      { t: "h2", text: "Tell them, and tell them soon" },
      { t: "p", text: "Don't hide it. Secrecy makes a good thing look shameful, and it gets heavier every week. Jesus said *whosoever shall confess me before men, him will I confess also before my Father* (Matthew 10:32). You don't need a speech. You need a sentence, said early, before they hear it from somebody else: *I've started following Jesus. It's real for me, and I wanted you to hear it from me.*" },

      { t: "h2", text: "How to say it" },
      {
        t: "list",
        items: [
          "**Pick a calm moment, one person at a time.** Not the family group chat. Not Christmas dinner. A walk, a drive, a coffee.",
          "**Tell your story, not a sermon.** What was going on in your life, what happened, what's different now. Nobody can argue with what happened to you. Keep it under two minutes.",
          "**Make clear what hasn't changed.** \"I'm still me. I still love you. I'm not going to preach at you.\" Then keep that promise.",
          "**Don't apologise for it, and don't oversell it.** You're not asking permission, and you're not recruiting. You're sharing news.",
          "**Expect questions, and be fine with \"I don't know.\"** You're two weeks in. \"I don't know yet, but I'm finding out\" is an honest and disarming answer.",
        ],
      },

      { t: "h2", text: "If they laugh, worry or get angry" },
      { t: "p", text: "Some families shrug. Some mock. Some grieve, especially if your faith feels to them like a rejection of theirs. Some get genuinely angry. Decide now that none of those reactions will change how you treat them." },
      { t: "quote", text: "Bless them which persecute you: bless, and curse not.", ref: "Romans 12:14 (KJV)" },
      { t: "p", text: "Don't argue. Arguments are won and people are lost. Answer softly (*a soft answer turneth away wrath*, Proverbs 15:1), let them have the last word, and let time and your life do the talking. Peter's advice to believers with unbelieving spouses applies to the whole household: that they *may without the word be won by the conversation* (1 Peter 3:1), meaning your conduct. Your changed life will make a better case over a year than your best argument will make in an evening." },

      { t: "h2", text: "Then be the best version of their family member" },
      {
        t: "list",
        items: [
          "**Honour your parents** (Ephesians 6:2), even the ones who don't understand. Especially them.",
          "**Serve without being asked.** Do the dishes. Call your mother. Show up. Let the change be visible before it's audible.",
          "**Keep your word about not preaching.** If they want to talk about it, they'll ask. When they do, answer honestly and briefly, then stop.",
          "**Keep loving them exactly the same.** Never make your love conditional on their response, or the door closes.",
          "**Pray for them by name, every day.** Most people who come to faith as adults had someone praying for them for years before anything visible happened.",
        ],
      },

      { t: "h2", text: "If it costs you" },
      { t: "p", text: "For some people, following Jesus costs a relationship, a place in the family, or worse. Jesus didn't hide that, and He made a promise to go with it: *There is no man that hath left house, or brethren, or sisters, or father, or mother… for my sake, and the gospel's, But he shall receive an hundredfold now in this time… and in the world to come eternal life* (Mark 10:29–30). The hundredfold now is the church: a family that will take you in. Find one; [here's how](https://www.jesusfestival.app/blog/how-to-find-a-church-in-hamilton). If you're in Hamilton and need people around you this week, [LoveonHamilton.com](https://www.loveonhamilton.com) is a door that's open." },

      { t: "h2", text: "The long game" },
      { t: "p", text: "The jailer in Philippi believed, *and all his house* (Acts 16:34). Lydia's whole household was baptised. Timothy's faith came through his grandmother and mother (2 Timothy 1:5). God loves saving families, and He very often starts with one person. Right now, that person is you." },
      { t: "p", text: "Tell them. Love them. Pray for them. Then be patient, because the story isn't finished. If you need help knowing what to say when you pray for them, [start here](https://www.jesusfestival.app/blog/how-to-pray-when-you-dont-know-what-to-say)." },
    ],
    faqs: [
      {
        question: "How do I tell my parents I became a Christian?",
        answer:
          "Tell them soon, calmly and one at a time, in your own words: what was going on, what happened, and what's different now. Make clear you still love them and won't preach at them, expect questions, and be comfortable saying \"I don't know yet.\" Then honour them and let your changed life speak over time.",
      },
      {
        question: "What if my family is against my new faith?",
        answer:
          "Don't argue; answer softly (Proverbs 15:1), keep loving and serving them unconditionally, keep your promise not to preach, and pray for them by name daily. Jesus said families would sometimes be divided over Him (Matthew 10:36) and promised His followers a new family in the church (Mark 10:29–30).",
      },
      {
        question: "What does the Bible say about family members who don't believe?",
        answer:
          "Jesus' own brothers did not believe in Him at first (John 7:5). Peter taught that unbelieving family members can be won by a believer's conduct rather than words (1 Peter 3:1), and the Bible records whole households coming to faith after one person believed (Acts 16:31–34).",
      },
      {
        question: "Should I keep my faith private to keep the peace?",
        answer:
          "No. Jesus asked His followers to acknowledge Him openly (Matthew 10:32), and secrecy makes faith look shameful and grows heavier over time. Share it early and kindly, then live it consistently without pressuring anyone.",
      },
    ],
    related: ["LoveonHamilton.com", "IAmReborn.net", "OikosMap.com"],
  },

  {
    slug: "how-to-forgive-someone-who-hurt-you",
    seoTitle: "How to Forgive Someone Who Hurt You (Even If They Never Say Sorry)",
    seoDescription:
      "Forgiveness isn't forgetting, excusing or reconciling. What Jesus taught, why it's for your sake too, and a practical way to forgive someone who hasn't apologised.",
    title: "How to Forgive Someone Who Hurt You (Even If They Never Say Sorry)",
    description:
      "It's the hardest thing Jesus asked of us, and the thing He talked about most often. What forgiveness is and isn't, why it's for you too, and a practical way to do it when the other person will never apologise.",
    eyebrow: "Keep going",
    emoji: "🕊️",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "Somebody hurt you. Maybe years ago, maybe last week. A parent, a partner, a friend, a boss, a stranger. You carry it around, and the carrying is exhausting. And now you've started following Jesus, and He keeps bringing it up." },
      { t: "p", text: "He really does. Right in the middle of the prayer He taught: *forgive us our debts, as we forgive our debtors* (Matthew 6:12). Peter asked Him how many times he had to forgive, hoping the answer was seven. Jesus said *seventy times seven* (Matthew 18:22), meaning stop counting. This is not a side issue to Him. Here's how to actually do it." },

      { t: "h2", text: "What forgiveness is not" },
      {
        t: "list",
        items: [
          "**It's not saying it didn't matter.** Forgiveness only exists because something real was done. Minimising it is the opposite of forgiving it.",
          "**It's not forgetting.** You may remember it for the rest of your life. Forgiveness is about what you do with the memory, not whether you have it.",
          "**It's not trusting them again.** Trust is rebuilt by the other person's actions over time. Forgiveness is given; trust is earned.",
          "**It's not reconciliation.** Reconciliation takes two people. Forgiveness takes one. You can fully forgive someone you never speak to again, and in cases of abuse, keeping distance is often the wise and right thing.",
          "**It's not a feeling.** It's a decision you make, and then keep making, until the feelings slowly follow.",
        ],
      },

      { t: "h2", text: "What it is" },
      { t: "p", text: "Forgiveness is releasing your right to make someone pay. It's handing the debt to God and saying: *You deal with this. I'm putting it down.* That's exactly what Paul meant: *Dearly beloved, avenge not yourselves, but rather give place unto wrath: for it is written, Vengeance is mine; I will repay, saith the Lord* (Romans 12:19). Forgiving doesn't mean nobody will deal with it. It means you won't have to." },
      { t: "quote", text: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.", ref: "Ephesians 4:32 (KJV)" },

      { t: "h2", text: "Why Jesus insists on it" },
      { t: "p", text: "Two reasons. The first is that you've been forgiven more. Jesus told a story about a servant forgiven a debt of millions who then choked a coworker over pocket change (Matthew 18:23–35). Next to what God has forgiven you, every debt owed to you is small. Not nothing. Small." },
      { t: "p", text: "The second is that unforgiveness is a poison you drink yourself. Bitterness, the Bible says, is a root that *springing up trouble you, and thereby many be defiled* (Hebrews 12:15). It spreads: into your marriage, your kids, your sleep, your body. Forgiveness is how you stop the person who hurt you from hurting you every single day after." },

      { t: "h2", text: "A practical way to do it" },
      {
        t: "list",
        items: [
          "**Name it honestly.** Write down what they did and what it cost you. Don't soften it. You can't forgive what you won't look at.",
          "**Tell God the truth about how you feel.** Anger, included. The Psalms are full of it. He can handle it.",
          "**Decide, out loud.** \"God, I choose to forgive ___ for ___. I release my right to make them pay. I hand this to You.\" Say it even if you don't feel it. Especially then.",
          "**Pray for them.** Jesus said to (Matthew 5:44). You cannot keep hating someone you keep sincerely praying for. It's almost mechanical.",
          "**Repeat when it resurfaces.** It will. That's not failure; that's seventy times seven. Each time, decide again.",
          "**Get help if it's deep.** Serious trauma deserves a counsellor and a church family walking with you. Forgiving isn't something God expects you to do alone.",
        ],
      },

      { t: "h2", text: "When they never say sorry" },
      { t: "p", text: "Most people who hurt us never apologise. If forgiveness waited for that, most of us would carry our wounds to the grave. Jesus didn't wait: on the cross, with no apology from anyone, He prayed *Father, forgive them; for they know not what they do* (Luke 23:34). Forgiveness that depends on their repentance isn't really in your hands. The kind Jesus taught is." },
      { t: "p", text: "Put it down today. Not because they deserve it. Because you've been forgiven, and because you're tired of carrying it. If you're not sure where you stand with God yourself, start with [what happens after you say yes](https://www.jesusfestival.app/blog/what-happens-after-you-say-yes), and if the words won't come, [here's how to pray when you don't know what to say](https://www.jesusfestival.app/blog/how-to-pray-when-you-dont-know-what-to-say)." },
    ],
    faqs: [
      {
        question: "Does forgiving someone mean I have to trust them again?",
        answer:
          "No. Forgiveness is releasing your right to make someone pay and is given by you alone; trust is rebuilt by the other person's actions over time. You can fully forgive someone and still keep healthy distance, especially where there has been abuse.",
      },
      {
        question: "How do I forgive someone who never apologized?",
        answer:
          "Name honestly what they did, tell God how you feel, decide out loud to release the debt to Him (Romans 12:19), pray for the person (Matthew 5:44), and repeat the decision whenever the hurt resurfaces. Jesus forgave from the cross without any apology (Luke 23:34), so forgiveness does not depend on the other person.",
      },
      {
        question: "What does the Bible say about forgiving others?",
        answer:
          "Jesus taught His followers to forgive as they have been forgiven (Matthew 6:12), without keeping count (Matthew 18:22), and told the parable of the unforgiving servant to show how small others' debts are next to what God has forgiven us (Matthew 18:23–35). Ephesians 4:32 says to forgive one another as God in Christ forgave you.",
      },
      {
        question: "Is forgiveness a feeling or a decision?",
        answer:
          "A decision. You choose to release the debt even while the feelings are still raw, and you keep choosing it each time the hurt comes back. The feelings usually follow the decision over time, not the other way around.",
      },
    ],
    related: ["IAmReborn.net", "SeekFirst.World", "LoveonHamilton.com"],
  },

  {
    slug: "doubt-doesnt-disqualify-you",
    seoTitle: "Can a Christian Have Doubts? Honest Faith When You're Not Sure",
    seoDescription:
      "Doubt isn't the opposite of faith; unbelief is. What the Bible says about doubters Jesus welcomed, why questions are normal for new believers, and what to do with them.",
    title: "Doubt Doesn't Disqualify You: Honest Faith When You're Not Sure",
    description:
      "You said yes to Jesus, and now a voice says: what if none of it is true? Here's why doubt is normal, the doubters Jesus kept close, and what to actually do with your questions.",
    eyebrow: "Keep going",
    emoji: "🤔",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "A week or two after saying yes to Jesus, a lot of people hit the same wall. The feeling fades, somebody at work makes a comment, you read something online, and a quiet voice asks: *what if you just got caught up in the moment?*" },
      { t: "p", text: "If that's where you are, here is the first thing to know: doubt is not the opposite of faith. Unbelief is. Doubt is faith asking questions, and the Bible is full of people who did exactly that and were welcomed." },

      { t: "h2", text: "The doubters Jesus kept close" },
      { t: "p", text: "Thomas gets a bad name, but look at what actually happened. He said he wouldn't believe unless he saw the wounds. Jesus showed up, showed him the wounds, and said *be not faithless, but believing* (John 20:27). He didn't kick Thomas out. He came to him." },
      { t: "p", text: "A desperate father once told Jesus, *Lord, I believe; help thou mine unbelief* (Mark 9:24). Faith and doubt in the same sentence, and Jesus healed his son. John the Baptist, in prison, sent messengers to ask Jesus *Art thou he that should come, or do we look for another?* (Matthew 11:3). The man who baptised Jesus had questions. Jesus answered him with kindness and then called him the greatest man ever born." },
      { t: "p", text: "And on the mountain, as the risen Jesus gave the Great Commission, Matthew records quietly: *they worshipped him: but some doubted* (Matthew 28:17). Jesus sent them anyway." },

      { t: "h2", text: "Why doubt shows up now" },
      {
        t: "list",
        items: [
          "**The feelings settled.** You met Jesus in a loud, bright, crowded park. Ordinary Tuesday is quieter. Faith was never meant to run on adrenaline; that's why [this guide to feeling far from God](https://www.jesusfestival.app/blog/what-to-do-when-you-feel-far-from-god) exists.",
          "**You're taking it seriously.** People don't doubt things they don't care about. The questions mean it matters to you.",
          "**Somebody pushed back.** A friend, a family member, a video. Pushback isn't evidence; it's just pushback. Most of it has good answers you simply haven't heard yet.",
          "**You expected certainty.** Faith isn't the absence of questions; it's trusting Someone while you still have them. *Now we see through a glass, darkly* (1 Corinthians 13:12). That's the normal Christian condition this side of heaven.",
        ],
      },

      { t: "h2", text: "What to do with your questions" },
      {
        t: "list",
        items: [
          "**Say them out loud, to God first.** *Help thou mine unbelief* is a prayer He has answered before. He isn't threatened by your questions.",
          "**Write them down, specifically.** \"Is any of this real?\" is a fog. \"Did Jesus actually rise from the dead?\" is a question with evidence either way, and the evidence is strong. Specific doubts can be investigated; vague ones just hang around.",
          "**Keep reading the Gospels while you doubt.** Don't wait to feel sure before opening the Bible. Meet Jesus on the page and let Him make His own case. [Start here](https://www.jesusfestival.app/blog/how-to-start-reading-the-bible).",
          "**Ask a believer who's been through it.** Every mature Christian you know has doubted. Ask them. Their honesty will help more than any argument.",
          "**Keep doing what you know.** Pray, go to church, be kind, tell the truth. Obedience often clears fog that argument can't. Jesus said *If any man will do his will, he shall know of the doctrine* (John 7:17).",
          "**Don't decide anything in the dark.** Doubt at 2am is not the moment to walk away from faith, any more than 2am is the moment to walk away from a marriage. Wait for daylight and people.",
        ],
      },
      { t: "quote", text: "And of some have compassion, making a difference.", ref: "Jude 1:22 (KJV)" },
      { t: "p", text: "Have compassion on yourself, too. God does. The grip that holds you isn't the strength of your faith; it's the strength of His hand: *neither shall any man pluck them out of my hand* (John 10:28). Your doubt can't undo His promise." },

      { t: "h2", text: "The question under the questions" },
      { t: "p", text: "Most doubt eventually comes down to one thing: did Jesus rise from the dead? If He did, everything else holds, including the parts you don't understand yet. If He didn't, as Paul said, *your faith is vain* (1 Corinthians 15:17). So take that one question seriously. Read the accounts. Weigh the empty tomb, the witnesses who died rather than retract, the sudden transformation of terrified disciples. Then decide. Two thousand years of honest doubters have walked that road and come out worshipping." },
      { t: "p", text: "You can keep following Jesus with questions in your pocket. He never asked you to leave them at the door." },
    ],
    faqs: [
      {
        question: "Is it a sin for a Christian to doubt?",
        answer:
          "No. Doubt is faith asking questions; unbelief is refusing to trust. Jesus welcomed doubters such as Thomas (John 20:27), the father who prayed \"help my unbelief\" (Mark 9:24) and John the Baptist (Matthew 11:3), and He commissioned disciples even though \"some doubted\" (Matthew 28:17).",
      },
      {
        question: "Why do I have doubts after becoming a Christian?",
        answer:
          "Doubt commonly appears when the emotion of a conversion experience settles, when someone pushes back on your faith, or when you expected certainty rather than trust. It usually means you are taking your faith seriously, not that it was never real.",
      },
      {
        question: "What should I do when I doubt my faith?",
        answer:
          "Tell God honestly, write your questions down specifically, keep reading the Gospels, talk with a mature believer who has doubted, keep obeying what you already know, and avoid making decisions about faith in moments of exhaustion. Focus on the central question of whether Jesus rose from the dead.",
      },
      {
        question: "Can doubt make me lose my salvation?",
        answer:
          "Jesus said no one can snatch His sheep out of His hand (John 10:28). Salvation rests on Christ's promise and finished work, not on the strength of your feelings on a given day. Honest doubt does not undo what God has done.",
      },
    ],
    related: ["IAmReborn.net", "SeekFirst.World", "LoveonHamilton.com"],
  },

  {
    slug: "how-to-find-a-church-in-hamilton",
    seoTitle: "How to Find a Church in Hamilton, Ontario",
    seoDescription:
      "New to faith or new to the city? What to look for in a church, questions to ask on your first visit, what to expect on Sunday, and churches that stood with Jesus Festival.",
    title: "How to Find a Church in Hamilton (and What to Look For)",
    description:
      "A church isn't a building you attend; it's a family who notices when you're missing. Here's how to find one in Hamilton, what matters and what doesn't, what your first Sunday will be like, and the churches that stood with Jesus Festival 2026.",
    eyebrow: "Next steps",
    emoji: "⛪",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "At Jesus Festival, dozens of congregations stood on one stage and prayed for one city together. That's the beautiful part. The practical part comes the following Sunday: *so, which one do I go to?*" },
      { t: "p", text: "If you said yes to Jesus in Gage Park, or you've just moved to Hamilton, or you've been away from church for years, this is the honest guide." },

      { t: "h2", text: "Why you need one at all" },
      { t: "p", text: "Because the Christian life was never designed to be lived alone. The New Testament doesn't know a Christian without a church. *Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another* (Hebrews 10:25). You need people who will pray for you, teach you, correct you kindly, and notice when you don't show up. You also have something they need. A church is where your new life gets a family." },

      { t: "h2", text: "What actually matters" },
      {
        t: "list",
        items: [
          "**They preach the Bible, plainly.** Open Bibles, real passages, Jesus at the centre. If a church isn't sure what it believes about Jesus, keep looking.",
          "**The gospel is clear.** You should be able to hear, within a visit or two, that salvation is by grace through faith in Jesus (Ephesians 2:8–9), not by being good enough.",
          "**They love each other, visibly.** Jesus said this is how the world would recognise His disciples (John 13:35). Watch how people treat each other in the lobby, not just on stage.",
          "**They'll baptise you and disciple you.** Ask directly: *If I want to be baptised, how does that work here? Is there someone who could meet with me?* ([Here's what baptism involves](https://www.jesusfestival.app/blog/how-to-get-baptized).)",
          "**They send people out.** A healthy church is reaching its city, not just gathering on Sunday.",
        ],
      },

      { t: "h2", text: "What doesn't matter as much as you think" },
      { t: "p", text: "The size. The music style. The building. Whether the pastor wears a suit or sneakers. Whether it's five minutes away or twenty. These are preferences, and preferences are fine, but they're not the test. Some of the best churches in the city meet in school gyms. Don't let a drum kit, or the absence of one, decide where your soul gets fed." },

      { t: "h2", text: "Churches that stood with Jesus Festival 2026" },
      { t: "p", text: "These congregations partnered with the festival in 2026, and each has an open door. Bethel Gospel Tabernacle led the Friday night worship in Gage Park. Visit their sites for service times and locations:" },
      {
        t: "list",
        items: [
          "**[Bethel Gospel Tabernacle](https://bethelhamilton.com/)**, who led Pure Worship Night.",
          "**[Hamilton Christian Fellowship](https://hcfchurch.ca/)**",
          "**[CIA Church](https://www.ciachurch.com/)**",
          "**[Transformation Centre](https://transformationcentre.ca/)**",
        ],
      },
      { t: "p", text: "This isn't a list of the only good churches in Hamilton; there are many more. If none of these is near you or feels like home, ask the people who prayed with you at the festival, or get in touch through [LoveonHamilton.com](https://www.loveonhamilton.com). The weekly outreach teams there know churches across the city and will gladly walk you into one." },

      { t: "h2", text: "Your first Sunday" },
      {
        t: "list",
        items: [
          "**Arrive ten minutes early** and let someone greet you. Say the true thing: *I'm new, I said yes to Jesus recently.* Watch what happens; it's usually wonderful.",
          "**Wear whatever you own.** Nobody is checking.",
          "**You don't have to sing, give or do anything.** Sit, listen, and see. Nobody will put you on the spot.",
          "**Stay for the coffee.** The ten minutes after the service are where church actually happens.",
          "**Give it three visits** before deciding. One Sunday tells you about one Sunday.",
        ],
      },

      { t: "h2", text: "Then commit" },
      { t: "p", text: "Church-shopping forever is a way of never belonging anywhere. Once you've found a place that preaches Jesus and loves people, plant yourself. Show up when you don't feel like it. Join a small group. Serve somewhere. *God setteth the solitary in families* (Psalm 68:6), and this is how He does it." },
      { t: "p", text: "A year from now, the thing you'll remember about this season isn't the festival. It's the people who walked you through it. Go find them." },
    ],
    faqs: [
      {
        question: "How do I choose a church?",
        answer:
          "Look for a church that teaches the Bible plainly, makes the gospel of grace through faith in Jesus clear, visibly loves people, will baptise and disciple you, and reaches its city. Size, music style and building matter far less. Visit at least three times before deciding.",
      },
      {
        question: "Which churches partnered with Jesus Festival Hamilton 2026?",
        answer:
          "Churches that partnered with Jesus Festival 2026 include Bethel Gospel Tabernacle (which led Friday's worship night), Hamilton Christian Fellowship, CIA Church and Transformation Centre. Many other Hamilton congregations also took part; Love on Hamilton can help connect you with a church near you.",
      },
      {
        question: "What should I expect on my first visit to a church?",
        answer:
          "Expect a greeting at the door, singing, a Bible-based talk, and prayer. You are not required to sing, give money or participate; you can sit and watch. Wear what you own, arrive a little early, and stay for coffee afterwards, which is where people connect.",
      },
      {
        question: "Do I need to go to church to be a Christian?",
        answer:
          "Salvation comes through faith in Jesus, not church attendance, but the Bible commands believers not to give up meeting together (Hebrews 10:25). Christians grow, are taught, are cared for and serve others in a local church; it is the family God gives new believers.",
      },
    ],
    related: ["LoveonHamilton.com", "IAmReborn.net", "JesusFestival.ca"],
  },

  {
    slug: "what-to-do-when-you-feel-far-from-god",
    seoTitle: "What to Do When You Feel Far From God",
    seoDescription:
      "Feeling distant from God doesn't mean He's gone. Why the feeling comes, what the Bible says about dry seasons, and five honest steps back, starting today.",
    title: "What to Do When You Feel Far From God",
    description:
      "The festival high fades. Prayers feel like they hit the ceiling. You wonder if you did something wrong, or if any of it was real. Here's what's going on, what Scripture says about dry seasons, and the way back.",
    eyebrow: "Keep going",
    emoji: "🌧️",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "A few weeks after Jesus Festival, a message came in that said, more or less: *I felt so close to God in the park. Now I feel nothing. Did I do something wrong?*" },
      { t: "p", text: "If that's you, you're in very good company. Nearly every believer in the Bible hit a season like it. David wrote a whole song that opens, *How long wilt thou forget me, O LORD? for ever? how long wilt thou hide thy face from me?* (Psalm 13:1). That's Scripture. God put the feeling of distance in His own book, which tells you He isn't surprised by it." },

      { t: "h2", text: "Feelings aren't the thermometer" },
      { t: "p", text: "Here's the first thing to settle: how close God *feels* and how close God *is* are two different things. Jesus' last words to His friends were *lo, I am with you alway, even unto the end of the world* (Matthew 28:20). Not \"while you feel it.\" Always." },
      { t: "p", text: "A park full of worship, lights and thousands of voices is an intense experience, and intense experiences fade. That's not God leaving; that's adrenaline leaving. The mountain-top is real, but nobody lives there. Even Jesus came down from the mountain of transfiguration and walked straight into an argument and a sick child (Mark 9)." },

      { t: "h2", text: "Why the distance comes" },
      {
        t: "list",
        items: [
          "**Ordinary life.** Work, kids, bills and tiredness crowd out what you felt. Nothing is wrong; you just haven't built the rhythm yet.",
          "**Unconfessed sin.** Sometimes the distance is real and we know why. *If I regard iniquity in my heart, the Lord will not hear me* (Psalm 66:18). The fix is simple, if not easy: say it to Him.",
          "**Isolation.** You met God in a crowd and then went home alone. Faith was never meant to be solo.",
          "**Grief, depression or exhaustion.** Elijah, after the greatest victory of his life, lay under a tree and asked to die. God's response was sleep and food, twice, before a single word (1 Kings 19). Sometimes the most spiritual thing you can do is rest, and see a doctor.",
          "**A test of trust.** Occasionally God lets the feelings go quiet so that faith, not feeling, does the walking. *For we walk by faith, not by sight* (2 Corinthians 5:7).",
        ],
      },

      { t: "h2", text: "What the Bible promises" },
      { t: "quote", text: "Draw nigh to God, and he will draw nigh to you.", ref: "James 4:8 (KJV)" },
      { t: "p", text: "That's a promise with your part in it. You move, He moves. Not because He was far, but because the drawing near is how you notice again that He never left. The prodigal son's father didn't wait on the porch; *when he was yet a great way off, his father saw him, and had compassion, and ran* (Luke 15:20). One step toward home, and He's running." },

      { t: "h2", text: "Five steps back, starting today" },
      {
        t: "list",
        items: [
          "**Tell Him the truth.** \"God, I feel far from You and I don't know why.\" That sentence is a prayer. If words are hard, [this is how to pray when you don't know what to say](https://www.jesusfestival.app/blog/how-to-pray-when-you-dont-know-what-to-say).",
          "**Confess what you know.** If there's something specific, name it. *He is faithful and just to forgive us our sins* (1 John 1:9). Then stop carrying it.",
          "**Open the Bible, small.** One Psalm. Psalm 42 is for exactly this: *Why art thou cast down, O my soul? … hope thou in God.* If you don't know where to start, [here's how](https://www.jesusfestival.app/blog/how-to-start-reading-the-bible).",
          "**Get around people.** Text someone from the festival, walk into a church this Sunday, join an outreach through [LoveonHamilton.com](https://www.loveonhamilton.com). Coals stay hot in a pile and go out alone.",
          "**Do the next kind thing.** Serve someone. Give something away. Distance often shrinks when we stop staring at it and start loving the person in front of us.",
        ],
      },

      { t: "h2", text: "If it was never real" },
      { t: "p", text: "Some people wonder whether the yes in the park even counted. Here is the test: it counted if you meant it, and it still counts now. Salvation doesn't rest on the strength of your feeling but on the strength of His promise: *him that cometh to me I will in no wise cast out* (John 6:37). If you're not sure you ever truly came, come now. Same door, still open. The [first steps guide](https://www.jesusfestival.app/i-said-yes) walks you through it." },
      { t: "quote", text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.", ref: "Psalm 34:18 (KJV)" },
      { t: "p", text: "You haven't lost Him. You've lost the feeling, for a while. Walk toward home anyway. He's already running." },
    ],
    faqs: [
      {
        question: "Why do I feel far from God?",
        answer:
          "Common reasons include ordinary busyness crowding out prayer, unconfessed sin, isolation from other believers, grief, exhaustion or depression, and seasons where God lets feelings go quiet so faith grows. Feeling distant does not mean God has left; Jesus promised to be with His people always (Matthew 28:20).",
      },
      {
        question: "What does the Bible say about feeling distant from God?",
        answer:
          "The Psalms openly voice the feeling (Psalm 13:1, Psalm 42), and James 4:8 promises that if we draw near to God He will draw near to us. The parable of the prodigal son shows the Father running to meet anyone who turns toward home (Luke 15:20).",
      },
      {
        question: "How do I get close to God again?",
        answer:
          "Tell God honestly how you feel, confess anything specific you know is wrong, read a small portion of Scripture such as Psalm 42, get around other believers in a church or outreach, and serve someone. Draw near, and He draws near (James 4:8).",
      },
      {
        question: "Is it normal to feel nothing after a powerful spiritual experience?",
        answer:
          "Yes. Intense experiences like a festival fade as the emotion settles; that is not God leaving. Even Elijah collapsed after his greatest victory (1 Kings 19), and God answered with rest and food before words. Build a daily rhythm of prayer and Scripture so faith does not depend on the feeling.",
      },
    ],
    related: ["IAmReborn.net", "LoveonHamilton.com", "SeekFirst.World"],
  },

  {
    slug: "how-to-start-reading-the-bible",
    seoTitle: "How to Start Reading the Bible: Where to Begin",
    seoDescription:
      "Don't start at Genesis. Where to begin, which translation to pick, how long to read, a simple 7-day plan, and what to do when you don't understand it.",
    title: "How to Start Reading the Bible (Where to Begin, and a Simple 7-Day Plan)",
    description:
      "It's 66 books, written over 1,500 years, and most people who try to read it cover to cover stall somewhere in Leviticus. Here's a better way in: where to start, how to read it, and a plan for your first week.",
    eyebrow: "Next steps",
    emoji: "📖",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "Somebody hands you a Bible. Maybe at a festival, maybe a friend, maybe you downloaded an app in a quiet moment. You open it at page one, read about creation and a garden, keep going through a flood and a tower, and then somewhere around the genealogies or the tabernacle measurements you quietly stop." },
      { t: "p", text: "That's not a failure of faith. It's a navigation problem. The Bible isn't one book; it's a library of 66, written across about 1,500 years in three languages, and nobody hands you a library and says *start at the top left shelf.* Here's where to actually begin." },

      { t: "h2", text: "Start with Jesus" },
      { t: "p", text: "Begin with one of the four Gospels, the eyewitness accounts of Jesus' life. **John** is the best first read for most people: it was written, in the author's own words, *that ye might believe that Jesus is the Christ, the Son of God; and that believing ye might have life through his name* (John 20:31). It's twenty-one chapters, so one a day gets you through it in three weeks." },
      { t: "p", text: "**Mark** is the shortest and fastest-moving if you'd rather see what Jesus did than hear long conversations. Either way: meet the person first. Everything else in the Bible points to Him (Luke 24:27)." },

      { t: "h2", text: "Pick a translation you can actually read" },
      { t: "p", text: "There is no single \"real\" English Bible; they're all translations from Hebrew and Greek. The King James (KJV) is beautiful and the one we quote on this site, but its 1611 English is hard going for a first read. The **NIV**, **ESV**, **CSB** or **NLT** are accurate and written in today's language. Free apps like YouVersion let you switch between them with a tap, so try two and keep the one you understand." },

      { t: "h2", text: "How to read it: four questions" },
      { t: "p", text: "Don't try to read fast or far. A chapter, or even a paragraph, read slowly beats five chapters skimmed. After you read, ask:" },
      {
        t: "list",
        items: [
          "**What does this say about God?** His character, His promises, what He loves and hates.",
          "**What does it say about people?** About me, honestly.",
          "**Is there something to do?** An instruction to obey, a comfort to hold, a sin to turn from, an example to follow.",
          "**What will I pray because of it?** Turn what you read straight into a prayer. If you've never done that, [how to pray when you don't know what to say](https://www.jesusfestival.app/blog/how-to-pray-when-you-dont-know-what-to-say) is the companion to this guide.",
        ],
      },
      { t: "quote", text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105 (KJV)" },

      { t: "h2", text: "A simple first week" },
      { t: "p", text: "Ten to fifteen minutes a day. Same time each day if you can; first coffee works for a lot of people." },
      {
        t: "list",
        items: [
          "**Day 1: John 1.** Who Jesus is, from before the beginning.",
          "**Day 2: John 3.** The most famous verse in the Bible, in its full conversation.",
          "**Day 3: Luke 15.** Three stories about lost things, and a Father who runs.",
          "**Day 4: Psalm 23.** The prayer people have held onto for three thousand years.",
          "**Day 5: John 14.** Jesus the night before He died, calming frightened friends.",
          "**Day 6: Romans 8.** Nothing can separate you from the love of God.",
          "**Day 7: John 20–21.** The empty tomb, and breakfast on a beach with the risen Jesus.",
        ],
      },
      { t: "p", text: "After that, read John from the start, one chapter a day. Then Mark, then Acts (what the first Christians did next), then the Psalms a few at a time. By then you'll have your bearings." },

      { t: "h2", text: "When you don't understand something" },
      { t: "p", text: "You won't understand everything. Nobody does; people spend whole lives on this book. That's fine. Note the question and keep reading; a lot of confusing passages get clearer when you've read more of the story. Ask someone further along. Pray before you read: *Open thou mine eyes, that I may behold wondrous things out of thy law* (Psalm 119:18). And remember the goal isn't to finish; it's to meet God in it." },
      { t: "quote", text: "For the word of God is quick, and powerful, and sharper than any twoedged sword.", ref: "Hebrews 4:12 (KJV)" },

      { t: "h2", text: "Don't read alone forever" },
      { t: "p", text: "The Bible was written to communities and is best read in one. Find a church that teaches it plainly; [LoveonHamilton.com](https://www.loveonhamilton.com) can help you find people in Hamilton. For a structured path through these first months, [IAmReborn.net](https://www.iamreborn.net) was built for new believers, and the [first steps guide](https://www.jesusfestival.app/i-said-yes) in this app keeps it to seven simple things." },
      { t: "p", text: "Open it today. One chapter. John 1. That's enough for a start." },
    ],
    faqs: [
      {
        question: "Where should a beginner start reading the Bible?",
        answer:
          "Start with one of the four Gospels rather than Genesis. The Gospel of John is the best first read for most people, since it was written so readers would believe in Jesus (John 20:31). Mark is the shortest if you prefer a fast-moving account. Read a chapter a day.",
      },
      {
        question: "Which Bible translation is easiest to read?",
        answer:
          "The NIV, NLT, CSB and ESV are accurate translations in modern English and are good first choices. The King James Version is beautiful but uses 1611 English that is harder for a first read. Free apps such as YouVersion let you compare translations.",
      },
      {
        question: "How much of the Bible should I read each day?",
        answer:
          "Ten to fifteen minutes, or about one chapter, read slowly is better than several chapters skimmed. Consistency matters more than volume; attach it to a daily habit such as your morning coffee.",
      },
      {
        question: "What should I do if I don't understand what I'm reading in the Bible?",
        answer:
          "Note the question and keep going, since many passages become clearer with more of the story; ask a more experienced Christian; pray before reading (Psalm 119:18); and read with a church or small group rather than only alone.",
      },
    ],
    related: ["IAmReborn.net", "LoveonHamilton.com", "SeekFirst.World"],
  },

  {
    slug: "how-to-get-baptized",
    seoTitle: "How to Get Baptized: What the Bible Says & What Happens",
    seoDescription:
      "Do you need to be baptized? What happens at a baptism, who can do it, what to wear, and how to take the step in Hamilton. Plain answers from the Bible.",
    title: "How to Get Baptized: What the Bible Says, What Happens, and How to Take the Step",
    description:
      "More than 50 people were baptised at Jesus Festival 2026, many of them the same weekend they met Jesus. If you're wondering whether that step is for you, here's what baptism is, what it isn't, and how to go about it.",
    eyebrow: "Next steps",
    emoji: "💧",
    date: "2026-10-18",
    readMins: 4,
    body: [
      { t: "p", text: "A baptism tank in a public park is a strange and wonderful sight. At Jesus Festival 2026 more than fifty people stepped into one in front of the whole crowd, many of them people who had met Jesus that very weekend. Friends cheered. Strangers cried. And a lot of people watching quietly wondered: *is that something I should do?*" },
      { t: "p", text: "This is the plain answer to that question, from the Bible, with the practical details people are usually too shy to ask about." },

      { t: "h2", text: "What baptism is" },
      { t: "p", text: "Baptism is going under water and coming up again as a public sign that you belong to Jesus. The word itself just means to dip or immerse. It pictures what has already happened inside: your old life buried with Christ, and a new one raised with Him." },
      { t: "quote", text: "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.", ref: "Romans 6:4 (KJV)" },
      { t: "p", text: "It is also a declaration. In the ancient world, baptism was how you announced which teacher you followed. Going under in Jesus' name says out loud, in front of witnesses: *I'm His now.*" },

      { t: "h2", text: "Do I have to be baptized to be saved?" },
      { t: "p", text: "No. Salvation comes by grace through faith in Jesus, not by any act we perform: *by grace are ye saved through faith; and that not of yourselves: it is the gift of God: not of works* (Ephesians 2:8–9). The thief on the cross was never baptised, and Jesus told him, *To day shalt thou be with me in paradise* (Luke 23:43)." },
      { t: "p", text: "But \"not required to be saved\" is very different from \"optional.\" Jesus commanded it. His last instruction to His followers was to make disciples, *baptizing them in the name of the Father, and of the Son, and of the Holy Ghost* (Matthew 28:19). Baptism isn't how you get saved. It's the first thing a saved person does." },

      { t: "h2", text: "Who should be baptized, and when?" },
      { t: "p", text: "Anyone who has personally turned to Jesus and trusted Him. In the book of Acts the pattern is always the same: people hear the good news, believe, and are baptised, usually right away." },
      { t: "quote", text: "Then they that gladly received his word were baptized: and the same day there were added unto them about three thousand souls.", ref: "Acts 2:41 (KJV)" },
      { t: "p", text: "Same day. The Ethiopian official in Acts 8 saw water by the roadside and asked, *what doth hinder me to be baptized?* The jailer in Acts 16 was baptised in the middle of the night. There's no waiting period in Scripture, no course to pass first. If you've said yes to Jesus, you're ready." },
      { t: "p", text: "If you were baptised as a baby and have since come to faith for yourself, many people choose to be baptised as a believer, as their own public declaration. Talk it through with a pastor you trust. It's your yes, and it's worth making clearly." },

      { t: "h2", text: "What actually happens" },
      {
        t: "list",
        items: [
          "**You say why you're doing it.** Usually a sentence or two, sometimes a short testimony. \"I've decided to follow Jesus\" is enough.",
          "**Someone asks you a question.** Something like: *Have you trusted Jesus as your Lord and Saviour?* You say yes.",
          "**You go under, in His name.** They say words like *I baptise you in the name of the Father, the Son and the Holy Spirit*, lean you back under the water, and bring you straight back up. It takes about two seconds.",
          "**People cheer.** Loudly, if it's a park full of Jesus Festival. Heaven is cheering too (Luke 15:10).",
        ],
      },
      { t: "p", text: "It doesn't hurt. You don't have to hold your breath long. Nobody is judging your swimming. If you have a disability, a health concern or a fear of water, say so; it can be done gently, seated, or with sprinkling or pouring if going under isn't possible. God is not grading the technique." },

      { t: "h2", text: "What to wear and bring" },
      {
        t: "list",
        items: [
          "**Dark, modest clothes** you don't mind getting soaked: a t-shirt and shorts or leggings. White goes see-through; avoid it.",
          "**A full change of clothes**, underwear included, plus a towel. A plastic bag for the wet things.",
          "**Flip-flops or sandals** for the walk to and from the water.",
          "**Someone to hold your phone** and film it. You'll want this video for the rest of your life.",
        ],
      },

      { t: "h2", text: "How to get baptized in Hamilton" },
      { t: "p", text: "Ask a church. Any Bible-believing local church will be glad to baptise you; most do it a few times a year, and many will arrange one sooner if you ask. If you don't have a church yet, that's the right first step anyway, and [LoveonHamilton.com](https://www.loveonhamilton.com) can connect you with one and with people who will walk alongside you." },
      { t: "p", text: "And every September, [Jesus Festival](https://www.jesusfestival.ca) baptises people in Gage Park in front of the whole city. You don't have to wait for it. But if you'd love to be baptised outdoors with a crowd roaring for you, [be first to know when 2027 is announced](https://www.jesusfestival.app/jesus-festival-2027)." },

      { t: "h2", text: "What comes next" },
      { t: "p", text: "Baptism is a beginning, not a finish line. Keep going: pray, read the Bible, find your people, tell someone what happened. The [first steps guide](https://www.jesusfestival.app/i-said-yes) walks through all of it, and [IAmReborn.net](https://www.iamreborn.net) is a whole site built for exactly this season." },
      { t: "p", text: "Fifty-some people in a tank in Gage Park didn't have it all figured out. They just said yes, in public, in water. You can too." },
    ],
    faqs: [
      {
        question: "Do you have to be baptized to go to heaven?",
        answer:
          "No. The Bible says salvation is by grace through faith in Jesus, not by works (Ephesians 2:8–9), and the thief on the cross was saved without being baptised (Luke 23:43). But Jesus commanded baptism (Matthew 28:19), so it is the normal first step of obedience for every new believer, not an optional extra.",
      },
      {
        question: "How soon after becoming a Christian can I be baptized?",
        answer:
          "Right away. In the book of Acts people were baptised the same day they believed (Acts 2:41; Acts 8:36–38; Acts 16:33). There is no waiting period or course required in Scripture. If you have personally trusted Jesus, you are ready.",
      },
      {
        question: "What do you wear to get baptized?",
        answer:
          "Dark, modest clothes you don't mind getting wet, such as a t-shirt with shorts or leggings (avoid white, which goes see-through). Bring a towel, a full change of clothes and sandals.",
      },
      {
        question: "Where can I get baptized in Hamilton, Ontario?",
        answer:
          "Any Bible-believing local church will baptise you; ask the pastor. Love on Hamilton (loveonhamilton.com) can connect you with a church. Jesus Festival also baptises people each September in Gage Park, Hamilton; dates for 2027 are not yet announced.",
      },
      {
        question: "I was baptized as a baby. Should I be baptized again?",
        answer:
          "Many people who come to personal faith later choose believer's baptism as their own public declaration of following Jesus. Churches differ on this, so talk it through with a pastor you trust.",
      },
    ],
    related: ["LoveonHamilton.com", "IAmReborn.net", "JesusFestival.ca"],
  },

  {
    slug: "how-to-pray-when-you-dont-know-what-to-say",
    seoTitle: "How to Pray When You Don't Know What to Say",
    seoDescription:
      "Prayer isn't a performance. A simple way to start talking to God today, what the Bible says about it, four honest prayers, and what to do when it feels like nothing happens.",
    title: "How to Pray When You Don't Know What to Say",
    description:
      "You don't need the right words, a quiet room or a religious voice. Here's how to start talking to God today, what Jesus said about prayer, and what to do when it feels like nothing is happening.",
    eyebrow: "Prayer",
    emoji: "🙏",
    date: "2026-10-18",
    readMins: 3,
    body: [
      { t: "p", text: "Most people who stop by the [Prayer Wall](https://www.jesusfestival.app/prayer) have never been taught how to pray. They've seen it done at funerals, maybe in a film. It looks like something you need special words for, or a special voice. So they don't." },
      { t: "p", text: "Here is the whole secret: prayer is talking to God. That's it. Honestly, in your own words, the way you'd talk to someone who already knows everything about you and loves you anyway." },

      { t: "h2", text: "What Jesus said about it" },
      { t: "p", text: "Jesus' disciples asked Him exactly this question: *Lord, teach us to pray* (Luke 11:1). He didn't give them a technique. He warned them off performance first:" },
      { t: "quote", text: "But when ye pray, use not vain repetitions, as the heathen do: for they think that they shall be heard for their much speaking. … for your Father knoweth what things ye have need of, before ye ask him.", ref: "Matthew 6:7–8 (KJV)" },
      { t: "p", text: "Read that again. God already knows what you need. You're not informing Him or impressing Him. Then Jesus gave them a short, plain prayer we call the Lord's Prayer: *Our Father which art in heaven, Hallowed be thy name. Thy kingdom come. Thy will be done…* (Matthew 6:9–13). Not a formula to recite so much as a shape: who God is, what He wants, what we need, what we've done wrong, what we're up against." },

      { t: "h2", text: "Start with one sentence" },
      { t: "p", text: "If you've never prayed, don't start with twenty minutes. Start with one honest sentence. Out loud or silently, eyes open or closed, walking or lying in bed. Something like:" },
      {
        t: "list",
        items: [
          "**\"God, I don't know if You're there, but if You are, I want to know You.\"** That is a real prayer, and He answers it.",
          "**\"God, thank You.\"** Then name one thing. A meal. A friend. The fact that you woke up.",
          "**\"God, help.\"** The shortest prayer in the Bible is Peter sinking in the waves: *Lord, save me* (Matthew 14:30). It worked.",
          "**\"God, I'm sorry.\"** Say what for. He already knows, and *if we confess our sins, he is faithful and just to forgive us* (1 John 1:9).",
        ],
      },
      { t: "p", text: "That's four prayers. Thank you, help, sorry, and *I want to know You*. Most of life fits in them." },

      { t: "h2", text: "You can be completely honest" },
      { t: "p", text: "The prayers in the Bible are not polite. David tells God he feels forgotten (Psalm 13:1). Job argues. Jeremiah complains that God tricked him. Jesus Himself, in the garden, prayed *if it be possible, let this cup pass from me* (Matthew 26:39) and sweat blood doing it. You are allowed to bring God your anger, your doubt, your grief and your boredom. He'd rather have the real you than a performance." },
      { t: "quote", text: "Casting all your care upon him; for he careth for you.", ref: "1 Peter 5:7 (KJV)" },

      { t: "h2", text: "When you can't find any words" },
      { t: "p", text: "Sometimes there are none. The Bible has an answer for that too: *the Spirit itself maketh intercession for us with groanings which cannot be uttered* (Romans 8:26). On the days you can only sit there, sitting there with God is prayer. You can also borrow words: read a Psalm out loud as your own prayer. Psalm 23 and Psalm 139 are good places to start." },

      { t: "h2", text: "Build a rhythm, not a rule" },
      {
        t: "list",
        items: [
          "**Attach it to something you already do.** First coffee. The drive to work. Brushing your teeth. Two minutes, every day, beats an hour once a month.",
          "**Pray about people by name.** Your family, the coworker who's struggling, the neighbour you barely know. [How to pray for your city](https://www.jesusfestival.app/blog/how-to-pray-for-your-city) takes this further.",
          "**Write some of it down.** A prayer you can see later is a prayer you can watch get answered.",
          "**Pray with someone.** It's less awkward than it sounds, and it changes friendships. The [Prayer Wall](https://www.jesusfestival.app/prayer) is a simple place to start: post one line, pray for one other person.",
        ],
      },

      { t: "h2", text: "When it feels like nothing happens" },
      { t: "p", text: "It will, sometimes. Jesus told a story specifically so people *ought always to pray, and not to faint* (Luke 18:1): a widow who kept knocking on a judge's door until he answered. Keep knocking. Some answers come fast, some come slowly, some come as *no* or *not yet*, and some you only recognise years later. But none of it is wasted. *The effectual fervent prayer of a righteous man availeth much* (James 5:16), and in Jesus, that's you." },
      { t: "p", text: "If you've never talked to God before, you could do it right now, before you close this page. One sentence. He's listening." },
    ],
    faqs: [
      {
        question: "How do I start praying if I've never prayed before?",
        answer:
          "Talk to God in your own words, the way you would talk to someone who already knows you. Start with one honest sentence, such as \"God, if You're there, I want to know You,\" \"thank You,\" \"help,\" or \"I'm sorry.\" There are no required words, posture or voice.",
      },
      {
        question: "What did Jesus say about how to pray?",
        answer:
          "In Matthew 6:5–13 Jesus said not to pray to be seen by people or to pile up empty words, because the Father already knows what we need. He then gave the Lord's Prayer as a pattern: honour God, ask for His kingdom and will, ask for daily needs, ask forgiveness, and ask for protection from temptation.",
      },
      {
        question: "Does God hear my prayer if I'm not religious?",
        answer:
          "Yes. The Bible says that everyone who calls on the name of the Lord will be saved (Romans 10:13) and that God is near to all who call on Him in truth (Psalm 145:18). An honest prayer from someone who isn't sure God exists is still heard.",
      },
      {
        question: "What should I do when I can't find words to pray?",
        answer:
          "Sit with God in silence, which is itself prayer, or borrow words by reading a Psalm aloud (Psalm 23 or Psalm 139). Romans 8:26 says the Holy Spirit prays for us when we don't know what to say.",
      },
      {
        question: "Why does it feel like God doesn't answer my prayers?",
        answer:
          "Jesus taught persistence in prayer (Luke 18:1–8). Answers can come quickly, slowly, as \"no\" or \"not yet,\" or in ways we only recognise later. Keep praying honestly; the Bible promises that the prayer of a righteous person is powerful and effective (James 5:16).",
      },
    ],
    related: ["IAmReborn.net", "SeekFirst.World", "LoveonHamilton.com"],
  },

  {
    slug: "hamilton-evangelism-impact-partner-with-e3-canada",
    seoTitle: "From Hamilton to the Nations: Impact & Partnership",
    seoDescription:
      "70+ salvations and 50+ baptisms reported at Jesus Festival 2026, 20+ weekly outreach teams, 12 city groups. See the impact and partner through e3 Canada.",
    title: "The Harvest Isn't Finished: What God Is Doing From Hamilton to the Nations",
    description:
      "A park full of worship. Names written in heaven. Weekly teams on the streets, city groups across the map, and a culture brand on the way. Here's the impact so far, and the open door to partner in what comes next.",
    eyebrow: "Impact report",
    emoji: "🌍",
    date: "2026-10-06",
    readMins: 7,
    body: [
      { t: "p", text: "Some numbers you count once and forget. Others get counted in heaven, and they never stop mattering. This is a report about the second kind." },
      { t: "quote", text: "Lift up your eyes, and look on the fields; for they are white already to harvest.", ref: "John 4:35 (KJV)" },
      { t: "p", text: "Jesus said that to disciples who thought harvest season was still months away. It wasn't then, and it isn't now. Here's what that has looked like for the work Daniel & Katie Ziedins have carried since 2014, and why this is the moment to lean in." },

      { t: "h2", text: "The impact, in one place" },
      {
        t: "list",
        items: [
          "**70+ salvations and 50+ baptisms** reported at Jesus Festival 2026 in Gage Park, September 4–5, as of September 6. These are early ministry reports, and follow-up is still going.",
          "**3,000+ hot dogs and drinks** given away free to the city, in what the team called a record weekend.",
          "**A free festival every year since 2024**, all three at Gage Park, Hamilton, open to everyone. Plan the next one at [JesusFestival.ca](https://www.jesusfestival.ca).",
          "**20+ weekly outreach teams**, grown from one small outreach in 2014: ordinary believers who now go out every week on their own.",
          "**12 listed city groups and prayer for 36 nations** through [Love on The World](https://www.loveontheworld.com), all plotted on one live movement map.",
          "**One goal ahead:** 100 multiplying outreach groups, anywhere and everywhere, through e3 Canada and I Am Second.",
        ],
      },
      { t: "p", text: "Every one of those numbers is a person. Behind \"50+ baptisms\" are fifty-some people who walked into water in front of their city and came up declaring that Jesus is Lord. Heaven threw a party for each of them (Luke 15:7). The full story of the weekend is in the [2026 harvest report](https://www.jesusfestival.app/blog/jesus-festival-hamilton-2026-recap)." },

      { t: "h2", text: "Jesus Festival: the city's front door" },
      { t: "p", text: "[Jesus Festival](https://www.jesusfestival.ca) exists for one reason: to make it as easy as possible for a whole city to hear the Gospel. No tickets, no offering plate, no church walls to get past. Worship, testimonies, food trucks, a Kids Zone, and the clear message that Jesus is alive and He loves Hamilton." },
      { t: "p", text: "That front door matters. Plenty of people will never walk into a sanctuary, but they'll walk into a park on a Saturday. Some of them met Jesus there this year. The 2027 dates haven't been announced yet; you can be first to know at [Jesus Festival 2027](https://www.jesusfestival.app/jesus-festival-2027)." },

      { t: "h2", text: "Love on The World: the weekly frontline" },
      { t: "p", text: "A festival is one weekend. The harvest is fifty-two weeks a year. [Love on The World](https://www.loveontheworld.com) is the Great Commission movement that grew out of Love on Hamilton: believers sharing the Gospel, making disciples, serving their communities and multiplying outreach groups in cities and nations." },
      { t: "p", text: "Sidewalks, bus stops, campuses, hospital hallways. It's not glamorous, and it's the most powerful thing we know: people who are available, everywhere, to everyone. If you've ever wanted to share your faith but didn't know where to start, this is where you start. Join a group, or start one in your city." },
      { t: "quote", text: "And others save with fear, pulling them out of the fire.", ref: "Jude 1:23 (KJV)" },

      { t: "h2", text: "SIX33: carrying the Kingdom into culture" },
      { t: "p", text: "The Gospel was never meant to stay inside Christian spaces. Jesus called His people *the light of the world* and *a city that is set on an hill* (Matthew 5:14). Light goes where the dark is: into gyms, garages, studios, feeds and streets." },
      { t: "p", text: "That's the heart of [SIX33](https://www.six33.world), **coming really soon**. It's a Christian lifestyle and culture brand built on one verse:" },
      { t: "quote", text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", ref: "Matthew 6:33 (KJV)" },
      { t: "p", text: "SIX33 began in 2014 as Seek First Brand and is being rebuilt as a whole world: limited drops, athletes and creators, Field Notes and events, all with the same order of life: seek Jesus first, live with purpose, pursue excellence, impact culture for His Kingdom, give God the glory. **A big part of its heart is raising funds for Love on The World**, so as SIX33 grows, the giving grows with it. It's pre-launch right now; the Inner Circle list at [SIX33.World](https://www.six33.world) is the way in." },

      { t: "h2", text: "The next season: enlarge the tent" },
      { t: "p", text: "Daniel & Katie now serve with **e3 Canada, in collaboration with I Am Second**, equipping believers to share their faith and to establish multiplying, life-changing churches. The assignment is bigger than anything so far: **100 multiplying outreach groups**, anywhere and everywhere." },
      { t: "quote", text: "Enlarge the place of thy tent, and let them stretch forth the curtains of thine habitations: spare not, lengthen thy cords, and strengthen thy stakes.", ref: "Isaiah 54:2 (KJV)" },
      { t: "p", text: "Lengthen the cords, so the work goes further. Strengthen the stakes, so it holds. Multiplication needs both: reach and roots. It means training people who train people, and it means faithful partners who keep the stakes in the ground while the cords stretch to new cities." },

      { t: "h2", text: "This is what plundering hell looks like" },
      { t: "p", text: "It doesn't look like a slogan on a stage. It looks like a man at a bus stop hearing for the first time that God isn't finished with him. It looks like a teenager baptised in a park while her friends cheer. It looks like a team in a city you've never visited, trained by a team trained by a team that started over coffee in Hamilton." },
      { t: "quote", text: "And they that be wise shall shine as the brightness of the firmament; and they that turn many to righteousness as the stars for ever and ever.", ref: "Daniel 12:3 (KJV)" },
      { t: "p", text: "Plunder hell. Populate heaven. In Jesus' name. If you want the full biblical case for why the people who send share the reward, read [Plunder Hell, Populate Heaven](https://www.jesusfestival.app/blog/plunder-hell-populate-heaven-partner-with-daniel-and-katie)." },

      { t: "h2", text: "Your part in the next number" },
      {
        t: "list",
        items: [
          "**Pray.** Ask the Lord of the harvest to send out labourers (Matthew 9:38), and to keep Daniel, Katie and every team strong.",
          "**Go.** Join or start an outreach through [LoveonTheWorld.com](https://www.loveontheworld.com), and invite someone to the next [Jesus Festival](https://www.jesusfestival.ca).",
          "**Carry it into culture.** Join the SIX33 Inner Circle at [SIX33.World](https://www.six33.world) before launch and help turn a brand into fuel for the Gospel.",
          "**Partner.** If the Lord leads, become a monthly or one-time partner through Daniel & Katie's official e3 Canada page, linked from [KD-Ziedins.com](https://www.kd-ziedins.com). It's the backbone that turns a calling into a sustainable sending.",
        ],
      },
      {
        t: "cta",
        eyebrow: "Partner through e3 Canada",
        title: "Help write the next chapter",
        text: "Meet Daniel & Katie, read the stories from the streets, and see how to partner in prayer or giving with e3 Canada and I Am Second.",
        href: "https://www.kd-ziedins.com",
        label: "Partner at KD-Ziedins.com",
      },
      { t: "p", text: "The fields are still white. The gates are still not holding. And somewhere out there is someone whose name is about to be written in heaven because somebody said yes. Let's go together." },
    ],
    faqs: [
      {
        question: "What impact did Jesus Festival 2026 have?",
        answer:
          "As of September 6, 2026, the Jesus Festival team reported 70+ salvations and 50+ baptisms from the September 4–5 festival at Gage Park in Hamilton, plus 3,000+ free hot dogs and drinks and a record turnout. These are preliminary ministry reports and may be updated as follow-up continues.",
      },
      {
        question: "What is Love on The World?",
        answer:
          "Love on The World (LoveonTheWorld.com) is a Great Commission movement founded in Hamilton, Ontario in 2014 by Daniel and Katie Ziedins. It helps believers share the Gospel, make disciples and multiply outreach groups, with 12 listed city groups and prayer for 36 nations.",
      },
      {
        question: "What is SIX33?",
        answer:
          "SIX33 (SIX33.World) is a Christian lifestyle and culture brand founded by Daniel Ziedins, built on Matthew 6:33 and launching soon. It began in 2014 as Seek First Brand, and a big part of its heart is raising funds for Love on The World.",
      },
      {
        question: "How can I partner with Daniel & Katie Ziedins and e3 Canada?",
        answer:
          "Pray for the work, join or start an outreach through Love on The World, and, if the Lord leads, give monthly or once through Daniel & Katie's official e3 Canada staff page, linked from KD-Ziedins.com.",
      },
    ],
    sources: [
      { name: "Jesus Festival Hamilton 2026 recap", url: "https://www.jesusfestival.app/blog/jesus-festival-hamilton-2026-recap" },
      { name: "Jesus Festival: JesusFestival.ca", url: "https://www.jesusfestival.ca" },
      { name: "Love on The World: our impact", url: "https://www.loveontheworld.com/impact" },
      { name: "SIX33: SIX33.World", url: "https://www.six33.world" },
      { name: "Daniel & Katie Ziedins: KD-Ziedins.com", url: "https://www.kd-ziedins.com" },
      { name: "Daniel & Katie's e3 Canada staff page", url: "https://e3ministry.ca/staff/katie-daniel-ziedins" },
      { name: "KD-Ziedins.com: the Jesus Festival 2026 harvest report", url: "https://www.kd-ziedins.com/blog/jesus-festival-2026-harvest-report" },
    ],
    sourcesNote:
      "Festival figures are preliminary reports shared by the Jesus Festival team on September 6, 2026. City-group and nation counts are as listed by Love on The World in October 2026. Every number is a person, and all glory belongs to God.",
    related: ["KD-Ziedins.com", "LoveonTheWorld.com", "JesusFestival.ca", "SIX33.World"],
  },

  {
    slug: "plunder-hell-populate-heaven-partner-with-daniel-and-katie",
    seoTitle: "Plunder Hell, Populate Heaven: Join the Harvest",
    seoDescription:
      "From one coffee in Hamilton in 2014 to 20+ weekly outreach teams and a vision for 100 multiplying groups. How to pray, go and partner through e3 Canada.",
    title: "Plunder Hell, Populate Heaven: An Invitation to Partner in the Harvest",
    description:
      "Jesus didn't build His church to hide behind walls. Here's the vision Daniel & Katie Ziedins are carrying with e3 Canada and I Am Second, what Scripture says about the people who send, and how you can stand in it with them.",
    eyebrow: "The vision",
    emoji: "🔥",
    date: "2026-10-05",
    readMins: 6,
    body: [
      { t: "p", text: "There's a line the evangelist Reinhard Bonnke made famous, and it has stuck to the bones of a whole generation of soul-winners: *plunder hell and populate heaven.* It sounds like a slogan. It's actually a summary of the Gospels." },
      { t: "p", text: "Because when Jesus described His church, He didn't describe a fortress waiting to be attacked. He described a church on the move, and an enemy whose defences would fail." },
      { t: "quote", text: "Upon this rock I will build my church; and the gates of hell shall not prevail against it.", ref: "Matthew 16:18 (KJV)" },
      { t: "p", text: "Gates don't attack anybody. Gates are what you hide behind. Jesus pictured hell on the defensive and His people at the walls, and He promised the walls would not hold." },

      { t: "h2", text: "What \"plunder hell\" actually means" },
      { t: "p", text: "Jesus used this picture Himself. Accused of working by the devil's power, He answered with a story about a break-in:" },
      { t: "quote", text: "How can one enter into a strong man's house, and spoil his goods, except he first bind the strong man? and then he will spoil his house.", ref: "Matthew 12:29 (KJV)" },
      { t: "p", text: "The strong man has been bound. That happened at the cross and the empty tomb, not at our next conference. And the \"goods\" in this story aren't treasure. They're people: sons and daughters held captive, men and women who were made for God and have never once heard that He wants them back." },
      { t: "p", text: "So plundering hell has nothing to do with hype, shouting or winning arguments. People are never the enemy. It means walking into the places darkness assumed it owned and carrying people out, one name at a time, into the light." },
      { t: "quote", text: "Who hath delivered us from the power of darkness, and hath translated us into the kingdom of his dear Son.", ref: "Colossians 1:13 (KJV)" },

      { t: "h2", text: "And \"populate heaven\"" },
      { t: "p", text: "The last book of the Bible lets us peek at the finish line, and it is crowded:" },
      { t: "quote", text: "A great multitude, which no man could number, of all nations, and kindreds, and people, and tongues, stood before the throne, and before the Lamb.", ref: "Revelation 7:9 (KJV)" },
      { t: "p", text: "Every one of them got there because somebody told them. Every one of them is a reason for a party in heaven. Jesus said so: there is *joy in heaven over one sinner that repenteth* (Luke 15:7). Picture that multitude and then picture the faces from your own street in it. That's the vision." },

      { t: "h2", text: "Where this has looked like real life" },
      { t: "p", text: "For Daniel & Katie Ziedins it started small. In 2014 it was two people, some coffee and a question, and the outreach that became [Love on Hamilton](https://www.loveonhamilton.com). Sidewalks, bus stops, shelters, parking lots. No perfect script, just availability: everywhere, to everyone." },
      { t: "p", text: "Twelve-plus years later, that small outreach has grown into **more than 20 weekly outreach teams**, ordinary believers who now go out every week on their own. It became training that turns nervous Christians into confident everyday witnesses. It became a citywide festival: this September Gage Park filled again for Jesus Festival, and you can read the [2026 harvest report](https://www.jesusfestival.app/blog/jesus-festival-hamilton-2026-recap). And it became [Love on The World](https://www.loveontheworld.com), carrying the same heart to more cities." },
      { t: "p", text: "None of it is a success story about two people. It's a story about what God does with a yes that keeps getting said." },

      { t: "h2", text: "The next assignment: 100 multiplying outreach groups" },
      { t: "p", text: "Daniel & Katie now serve with **e3 Canada, in collaboration with I Am Second**, to equip believers to share their faith and to establish multiplying, life-changing churches. The mission in front of them is huge on purpose: help establish **100 multiplying outreach groups, anywhere and everywhere around the world.**" },
      { t: "p", text: "Why multiplying? Because addition will never catch up with the harvest. One team that reaches a city is a blessing. One team that trains a team that trains a team has no ceiling. That has been the pattern from the beginning:" },
      { t: "quote", text: "The things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also.", ref: "2 Timothy 2:2 (KJV)" },
      { t: "p", text: "Count the generations in that one verse: Paul, Timothy, faithful men, others. Four, in a single sentence. That's the engine behind the 100." },

      { t: "h2", text: "The people who send share the reward" },
      { t: "p", text: "Here is something the church often forgets. In Scripture, the people who send are never second-class to the people who go." },
      { t: "quote", text: "How shall they hear without a preacher? And how shall they preach, except they be sent?", ref: "Romans 10:14–15 (KJV)" },
      { t: "p", text: "Look at David after the battle at Ziklag. Some of his men fought; others were too exhausted and stayed back to guard the supplies. When the fighters wanted to keep the spoil for themselves, David made a rule that became law in Israel:" },
      { t: "quote", text: "As his part is that goeth down to the battle, so shall his part be that tarrieth by the stuff: they shall part alike.", ref: "1 Samuel 30:24 (KJV)" },
      { t: "p", text: "Whoever stays by the supplies shares the plunder equally. When someone on a sidewalk in Hamilton, or a campus, or a city we haven't reached yet, meets Jesus, the person who prayed for that outreach and the person who helped fund it stand in that joy too. Paul said the same thing to the church that supported him: he wanted *fruit that may abound to your account* (Philippians 4:17)." },

      { t: "h2", text: "Three ways to stand in it" },
      {
        t: "list",
        items: [
          "**Pray, first and always.** Jesus' own strategy for a harvest with few workers was a prayer request: *pray ye therefore the Lord of the harvest, that he will send forth labourers* (Matthew 9:38). Pray for Daniel & Katie, for the teams, and for the 100. Prayer is not the consolation prize of partnership. It's the engine.",
          "**Go with someone.** You don't need a title. In Hamilton, join a weekly team through [LoveonHamilton.com](https://www.loveonhamilton.com). Anywhere else, start or join a group through [LoveonTheWorld.com](https://www.loveontheworld.com). The outreach that changes your city may be the one you start.",
          "**Give, if the Lord leads.** Monthly partners are the quiet backbone of full-time ministry; they turn a calling into a sustainable sending. Financial partnership is handled securely through Daniel & Katie's official e3 Canada staff page, linked from [KD-Ziedins.com](https://www.kd-ziedins.com).",
        ],
      },
      {
        t: "cta",
        eyebrow: "Partner in the harvest",
        title: "Stand with Daniel & Katie",
        text: "Read the story, see what God is doing on the streets, and find out how to pray, go or give through e3 Canada and I Am Second.",
        href: "https://www.kd-ziedins.com",
        label: "Visit KD-Ziedins.com",
      },

      { t: "h2", text: "One more picture" },
      { t: "p", text: "Somewhere in that multitude in Revelation 7 there will be someone who first heard about Jesus at a bus stop on Barton Street. Someone who prayed in Gage Park with a stranger in a festival T-shirt. Someone on another continent reached by a team trained by a team trained by a team that began over coffee in Hamilton." },
      { t: "p", text: "They will never know your name. Heaven will. *They shall part alike.*" },
      { t: "p", text: "The gates are not going to hold. Let's go get our neighbours, in Jesus' name." },
      { t: "p", text: "Want to see the fruit so far, from Gage Park to the nations? Read [The Harvest Isn't Finished](https://www.jesusfestival.app/blog/hamilton-evangelism-impact-partner-with-e3-canada)." },
    ],
    faqs: [
      {
        question: "What does \"plunder hell and populate heaven\" mean?",
        answer:
          "It's a phrase made famous by the evangelist Reinhard Bonnke. It draws on Jesus' words in Matthew 12:29 about binding the strong man and taking back what he holds: rescuing people from darkness through the Gospel (\"plunder hell\") so that they share eternal life with God (\"populate heaven\", see Revelation 7:9). It describes evangelism, never hostility toward people.",
      },
      {
        question: "Who are Daniel & Katie Ziedins?",
        answer:
          "Daniel & Katie Ziedins are Hamilton, Ontario evangelists who began Love on Hamilton in 2014. Their work has grown into more than 20 weekly outreach teams, evangelism training, Jesus Festival in Gage Park and Love on The World. They now serve with e3 Canada in collaboration with I Am Second.",
      },
      {
        question: "What is the 100 multiplying outreach groups vision?",
        answer:
          "It's Daniel & Katie's current mission with e3 Canada and I Am Second: help establish 100 outreach groups anywhere in the world that train others to share their faith and reproduce themselves, rather than relying on one team to do all the work.",
      },
      {
        question: "How can I partner with Daniel & Katie?",
        answer:
          "Pray for them and the teams, join or start an outreach through Love on Hamilton or Love on The World, and, if the Lord leads, give through their official e3 Canada staff page, which is linked from KD-Ziedins.com. Prayer partners matter as much as financial ones.",
      },
    ],
    sources: [
      { name: "Daniel & Katie Ziedins: KD-Ziedins.com", url: "https://www.kd-ziedins.com" },
      { name: "Daniel & Katie's e3 Canada staff page", url: "https://e3ministry.ca/staff/katie-daniel-ziedins" },
      { name: "Love on Hamilton: weekly outreach teams", url: "https://www.loveonhamilton.com" },
    ],
    related: ["KD-Ziedins.com", "LoveonHamilton.com", "LoveonTheWorld.com"],
  },
  {
    slug: "jesus-festival-hamilton-2026-recap",
    seoTitle: "Jesus Festival 2026 Recap: All Glory to God",
    seoDescription: "Jesus Festival Hamilton 2026 is complete: 70+ salvations and 50+ baptisms reported so far, a record turnout, and ways to keep the fire burning.",
    title: "Jesus Festival Hamilton 2026: Thank You—and All Glory to God",
    description:
      "Jesus Festival Hamilton 2026 has ended. Read the early report of 70+ salvations, 50+ baptisms, 3,000+ hot dogs and drinks shared, a record turnout, heartfelt thanks and practical ways to keep the fire burning.",
    eyebrow: "Jesus Festival 2026 recap",
    emoji: "🙌",
    date: "2026-09-06",
    readMins: 6,
    body: [
      { t: "p", text: "**Jesus Festival 2026 has ended—and it was absolutely amazing.** Hamilton gathered at Gage Park to worship Jesus, hear the Gospel, celebrate baptism, serve neighbours and build relationships across the city. We give God all the glory." },
      { t: "quote", text: "Not unto us, O Lord, not unto us, but unto thy name give glory.", ref: "Psalm 115:1 (KJV)" },
      { t: "h2", text: "The first reports from the weekend" },
      { t: "p", text: "Testimonies are still coming in. As of September 6, 2026, the Jesus Festival team has reported **70+ salvations and 50+ baptisms so far**. More than **3,000 hot dogs and drinks** were shared with the community, and the team reported a record turnout for Jesus Festival this year." },
      { t: "p", text: "These are preliminary ministry reports, not a scoreboard. They may be updated as follow-up continues. Every number represents a person with a name and a story known by God. We celebrate the fruit, and we return every bit of praise to Jesus." },
      { t: "quote", text: "So then neither is he that planteth any thing, neither he that watereth; but God that giveth the increase.", ref: "1 Corinthians 3:7 (KJV)" },
      { t: "h2", text: "To every volunteer: we love you guys" },
      { t: "p", text: "So many people put so much work into making this weekend possible. You prayed before anyone arrived. You lifted, carried, cooked, welcomed, directed, cleaned, served families, stood ready to help, stayed late and kept loving people when you were tired. Many acts of service were never seen from the stage, but they mattered deeply. Thank you." },
      { t: "p", text: "Jesus Festival could not happen through a platform or a small team alone. It happens because ordinary people make themselves available to God and serve with extraordinary love. To every volunteer: we see you, we honour your yes and we love you." },
      { t: "h2", text: "Thank you to every artist, ministry, vendor and partner" },
      { t: "p", text: "To the worship teams, artists, speakers and ministries: thank you for bringing your gifts, your stories and your wholehearted worship. You helped lift one name over Hamilton." },
      { t: "p", text: "To the vendors, community partners and everyone who helped create a joyful place for families: thank you for showing up and supporting the vision. Please continue to support the amazing artists, ministries, makers and vendors you discovered at Jesus Festival. Watch the official [Jesus Festival Instagram](https://www.instagram.com/jesusfestival.ca) and [Jesus Festival Facebook page](https://www.facebook.com/JesusFestival.ca) as moments and featured partners from the weekend are shared." },
      { t: "h2", text: "Thank you to everyone who came" },
      { t: "p", text: "Thank you for coming to Gage Park. Thank you for worshipping, inviting, bringing your family, sharing a post, sending the details to a friend and helping spread the word. Whether you served for months or arrived for one song, you became part of this story." },
      { t: "h2", text: "Keep the fire burning" },
      { t: "p", text: "The festival has ended, but the mission has not. Our encouragement is simple: make yourself available to the Lord’s leading every single day. Pray. Notice the one in front of you. Share Jesus. Serve your neighbourhood. Take the love, courage and unity of Gage Park into ordinary Monday mornings." },
      { t: "quote", text: "The fire shall ever be burning upon the altar; it shall never go out.", ref: "Leviticus 6:13 (KJV)" },
      { t: "h2", text: "Your next step after Jesus Festival" },
      { t: "list", items: [
        "**If you said yes to Jesus:** begin with the private [I Said Yes guide](https://www.jesusfestival.app/i-said-yes) for prayer, Scripture, baptism, church and seven practical first steps.",
        "**If you live in Hamilton:** connect with the local outreach family at [Love on Hamilton](https://loveonhamilton.com).",
        "**If you live outside Hamilton:** join or create an outreach group in your city through [Love on The World](https://loveontheworld.com).",
        "**If you want to partner with Daniel & Katie Ziedins:** follow their continued work through e3 Canada and I Am Second at [KD-Ziedins.com](https://kd-ziedins.com), and read the vision behind it in [Plunder Hell, Populate Heaven](https://www.jesusfestival.app/blog/plunder-hell-populate-heaven-partner-with-daniel-and-katie).",
        "**If you need prayer, want to share a testimony or need help finding your next step:** email [hello@jesusfestival.ca](mailto:hello@jesusfestival.ca). We are here for you.",
      ] },
      { t: "p", text: "We love you guys. Let’s continue to advance God’s Kingdom together—one prayer, one conversation, one act of obedience and one person at a time." },
      { t: "quote", text: "Here am I; send me.", ref: "Isaiah 6:8 (KJV)" },
    ],
    faqs: [
      { question: "What happened at Jesus Festival Hamilton 2026?", answer: "Jesus Festival 2026 gathered the community at Gage Park for worship, the Gospel, prayer, baptisms, artists, family activities, vendors, food and outreach. The festival team reported a record turnout, 70+ salvations and 50+ baptisms so far." },
      { question: "How many salvations were reported at Jesus Festival 2026?", answer: "As of September 6, 2026, the Jesus Festival team reported more than 70 salvations. This is an early ministry report and may be updated as testimonies and follow-up continue." },
      { question: "How many baptisms were reported at Jesus Festival 2026?", answer: "As of September 6, 2026, the Jesus Festival team reported more than 50 baptisms. This is an early ministry report and may be updated as follow-up continues." },
      { question: "How can I stay involved after Jesus Festival?", answer: "Hamilton-area participants can connect with Love on Hamilton. People outside Hamilton can join or create a local outreach group through Love on The World. New believers can use the I Said Yes guide, and ministry partners can connect with Daniel and Katie Ziedins through KD-Ziedins.com." },
      { question: "Where can I see Jesus Festival 2026 photos and videos?", answer: "Follow @jesusfestival.ca on Instagram and JesusFestival.ca on Facebook as photos, videos, testimonies and featured partners from the weekend are shared." },
      { question: "How can I share my Jesus Festival 2026 testimony?", answer: "Email hello@jesusfestival.ca with the subject My Jesus Festival 2026 Testimony. The Jesus Festival team would love to hear what God did in your life." },
    ],
    sources: [
      { name: "Jesus Festival on Instagram", url: "https://www.instagram.com/jesusfestival.ca" },
      { name: "Jesus Festival on Facebook", url: "https://www.facebook.com/JesusFestival.ca" },
      { name: "Love on Hamilton", url: "https://loveonhamilton.com" },
      { name: "Love on The World", url: "https://loveontheworld.com" },
      { name: "Daniel & Katie Ziedins", url: "https://kd-ziedins.com" },
    ],
    related: ["LoveonHamilton.com", "LoveonTheWorld.com", "KD-Ziedins.com"],
  },
  {
    slug: "jesus-festival-starts-tomorrow-final-checklist",
    seoTitle: "Jesus Festival 2026: The Final Checklist",
    seoDescription: "The final checklist from Jesus Festival Hamilton 2026 at Gage Park: times, packing, detours and a before-you-go plan worth keeping for next year.",
    title: "Jesus Festival Starts Tomorrow: Your Final Gage Park Checklist",
    description:
      "Jesus Festival Hamilton starts Friday, September 4 at Gage Park. Get the final times, live weather, packing list, Main and Ottawa detour, offline app and five-minute before-you-go plan.",
    eyebrow: "Tomorrow at Gage Park",
    emoji: "🙌",
    date: "2026-09-03",
    readMins: 5,
    body: [
      { t: "p", text: "**Tomorrow we begin.** Jesus Festival opens at Gage Park on Friday, September 4 at 6:00 PM. Pure Worship Night begins at 6:30 PM and continues until 9:00 PM. Then Saturday’s free Family Festival Day runs from 10:00 AM–7:00 PM, with the full stage program from 11:00 AM–7:00 PM." },
      { t: "p", text: "You do not need a ticket, an account or a perfect plan. But five quiet minutes tonight can remove most of tomorrow’s stress. We built the new [Festival Go Bag](https://www.jesusfestival.app/before-you-go) to walk through all five steps on one screen." },
      { t: "h2", text: "1. Save the app before the park gets busy" },
      { t: "p", text: "A crowded park can mean a crowded mobile network. Open the Festival Go Bag on reliable Wi-Fi and tap **Save now**. The app waits for a real completion response before marking the offline step ready. Your schedule, map, help points and key guides can then keep opening if the signal becomes slow or disappears." },
      { t: "h2", text: "2. Pack for two different festival days" },
      { t: "p", text: "Friday is an evening worship gathering. Saturday is a long open-air family day. The basics are a lawn chair or blanket, a filled refillable water bottle, comfortable shoes, a charged phone or power bank, sun protection for Saturday and a layer for Friday evening." },
      { t: "p", text: "The [What to Bring planner](https://www.jesusfestival.app/what-to-bring) shows the live Gage Park forecast and can adapt the list for children, comfort and accessibility needs, or a volunteer day. The forecast can still move, so check it again shortly before leaving." },
      { t: "h2", text: "3. Do not let Main and Ottawa surprise you" },
      { t: "p", text: "The City of Hamilton says the Main Street East and Ottawa Street North intersection is fully closed during the festival period. HSR Routes **1/1A King, 10 B-Line Express and 41 Mohawk** are detoured around the construction, with some stops moved or closed." },
      { t: "p", text: "Use the [current Gage Park arrival guide](https://www.jesusfestival.app/getting-to-gage-park), check your navigation or HSR information immediately before leaving, and give yourself more time than the normal trip. Gage Park has public parking, but a festival-day space is never guaranteed. HSR, carpooling, rideshare, cycling and walking are all worth considering." },
      { t: "h2", text: "4. Pick the meeting landmark before anyone wanders" },
      { t: "p", text: "A meeting point chosen after someone is already missing is too late. Open the [festival map](https://www.jesusfestival.app/map), drop a private pin near a permanent landmark and tell your group the exact side you mean. Your pin remains on your device unless you deliberately share it." },
      { t: "p", text: "If a child or another person becomes separated from the group, go to the Info and Lost Child Point shown approximately on the map and follow current on-site signs. For first aid, use the mapped First Aid point and ask a volunteer. Call 911 first for any serious or life-threatening emergency." },
      { t: "h2", text: "5. Star the moments you would hate to miss" },
      { t: "p", text: "Friday worship begins at 6:30 PM. Saturday’s stage begins at 11:00 AM, and the updated run of show continues through the 7:00 PM final prayer. Open the [live schedule](https://www.jesusfestival.app/schedule), star your moments and export your personal lineup if a calendar reminder will help." },
      { t: "list", items: [
        "**Friday:** gates at 6:00 PM · Pure Worship Night 6:30–9:00 PM.",
        "**Saturday:** festival activities 10:00 AM–7:00 PM · stage 11:00 AM–7:00 PM.",
        "**Admission:** completely free · no ticket required · all ages welcome.",
        "**Location:** Gage Park, 1000 Main Street East, Hamilton, Ontario.",
        "**Best live screen:** [Day-Of Mode](https://www.jesusfestival.app/day-of) for what is happening now, what comes next, the map, help and offline essentials.",
      ] },
      { t: "h2", text: "There is still time to invite one person" },
      { t: "p", text: "This may be the easiest invitation you make all year: *Jesus Festival starts tomorrow at Gage Park. It is free. Want to come with me?* Send the [Festival Go Bag](https://www.jesusfestival.app/before-you-go) with it so they have every practical detail in one place." },
      { t: "quote", text: "Let us go to the house of the Lord.", ref: "Psalm 122:1" },
      { t: "p", text: "The schedules are ready. The app is ready. The park is waiting. More importantly, people are coming who need hope, prayer, joy and an encounter with Jesus. We cannot wait to worship with you tomorrow." },
    ],
    faqs: [
      { question: "What time does Jesus Festival start tomorrow?", answer: "Jesus Festival opens Friday, September 4, 2026 at 6:00 PM at Gage Park. Pure Worship Night begins at 6:30 PM and concludes at 9:00 PM." },
      { question: "Do I need a ticket for Jesus Festival Hamilton?", answer: "No. Jesus Festival is completely free, no admission ticket is required and all ages are welcome. Food truck, vendor and official shop purchases are optional." },
      { question: "What should I bring to Jesus Festival?", answer: "Bring a lawn chair or blanket, a filled refillable water bottle, comfortable shoes, a charged phone or power bank, sun protection for Saturday and a layer for Friday evening. Check the live Gage Park forecast shortly before leaving." },
      { question: "How do I get to Jesus Festival during the Main and Ottawa closure?", answer: "Check current navigation and HSR information before leaving, use the Jesus Festival arrival guide and allow extra time. HSR Routes 1/1A King, 10 B-Line Express and 41 Mohawk are detoured around the Main and Ottawa closure." },
      { question: "Will the Jesus Festival app work offline?", answer: "Yes. Open the Festival Go Bag on a reliable connection and tap Save now. Once the app confirms completion, the schedule, map, help points and key guides are saved for offline use." },
    ],
    sources: [
      { name: "Jesus Festival — Official Hamilton 2026 Information", url: "https://www.jesusfestival.ca/" },
      { name: "City of Hamilton — Gage Park Features and Services", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
      { name: "City of Hamilton — Current HSR Schedules and Detours", url: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/schedules-detours" },
      { name: "City of Hamilton — Fall 2026 HSR and Main and Ottawa Construction Update", url: "https://www.hamilton.ca/city-council/news-notices/news-releases/bus-news-fall-2026" },
    ],
    related: ["JesusFestival.ca", "LoveonHamilton.com", "ThyKingdom.net"],
  },
  {
    slug: "jesus-festival-saturday-extended-updated-schedule-2026",
    seoTitle: "Jesus Festival 2026 Saturday Schedule",
    seoDescription: "The extended Saturday, September 5, 2026 stage schedule from Jesus Festival Hamilton: 11 AM–7 PM artist times, speakers and planning notes.",
    title: "Jesus Festival Saturday Is Now 10 AM–7 PM: Updated Stage Schedule",
    description:
      "Jesus Festival Family Festival Day has been extended by one hour. See the September 5, 2026 stage schedule from 11 AM–7 PM, artist times, speakers and planning notes.",
    eyebrow: "Important schedule update",
    emoji: "⏰",
    date: "2026-09-01",
    readMins: 6,
    body: [
      { t: "p", text: "More time together at Gage Park: **Saturday’s Family Festival Day is now 10:00 AM–7:00 PM**. The festival opens at 10:00 AM, the stage program begins at 11:00 AM, and the final prayer and encouragement begins at 7:00 PM." },
      { t: "p", text: "The artist and speaker times have moved later to fit the extended day. If you previously saved a screenshot, shared a plan or exported your lineup, use the [live Jesus Festival schedule](https://www.jesusfestival.app/schedule) as the current source and export it again." },
      { t: "h2", text: "Saturday at a glance" },
      { t: "list", items: [
        "**10:00 AM:** Family Festival Day opens—come enjoy the park, food trucks, vendors, Kids Zone and activities.",
        "**11:00 AM:** The stage opens with welcome and prayer.",
        "**11:15 AM–7:00 PM:** Artists, worship, speakers, testimonies and united moments fill the stage program.",
        "**7:00 PM:** Daniel & Katie lead the final prayer and encouragement as the festival closes.",
        "**MCs:** JJ & Rachel will guide the day, keep the program moving and fill the natural gaps between stage moments.",
      ] },
      { t: "h2", text: "Updated Saturday stage schedule" },
      { t: "p", text: "These are the best current stage times. Each band’s combined music time is approximately one hour, with speakers and sound checks woven between sets." },
      { t: "list", items: [
        "**11:00 AM — Stage Welcome & Prayer:** opening welcome and prayer with MCs JJ & Rachel.",
        "**11:15 AM — Terry Posthumus:** singer-songwriter and worship leader opening the music program.",
        "**12:30 PM — I Am Second / e3 Canada:** Tanya shares while Open Heaven prepares.",
        "**12:50 PM — Open Heaven, Set 1.**",
        "**1:20 PM — Pastor Joanna Adams:** 20-minute message.",
        "**1:40 PM — Shofars & Pastors on Stage:** a 20-minute moment of church unity.",
        "**2:00 PM — Open Heaven, Set 2:** worship continues.",
        "**2:20 PM — Rachel Shares:** story while ACTS Kingdom Sound Worship prepares.",
        "**2:40 PM — ACTS Kingdom Sound Worship, Set 1.**",
        "**3:10 PM — Rachel Shares:** 20-minute story.",
        "**3:30 PM — ACTS Kingdom Sound Worship, Set 2:** worship continues.",
        "**3:50 PM — Pastor Charles from Bethel:** sharing while Ant Lee Jr. prepares.",
        "**4:10 PM — Ant Lee Jr., Set 1:** Christian hip-hop.",
        "**4:40 PM — Ant Lee Jr. Testimony:** 20-minute testimony.",
        "**5:00 PM — Ant Lee Jr., Set 2:** the music continues.",
        "**5:20 PM — Daughters of Scripture:** sharing while Friday Night Prayer prepares.",
        "**5:40 PM — Friday Night Prayer, Set 1.**",
        "**6:10 PM — Sons of Scripture:** 20-minute message.",
        "**6:30 PM — Friday Night Prayer, Set 2:** worship continues.",
        "**7:00 PM — Final Prayer:** Daniel & Katie close with prayer and encouragement.",
      ] },
      { t: "h2", text: "A live day has breathing room" },
      { t: "p", text: "This is an outdoor festival, not a television broadcast. Stage times may shift a little while artists change over, stories unfold and the team keeps the day moving. JJ & Rachel will MC the program and help fill those natural gaps. The app’s live Schedule screen is the best place to see what is on now and what is next." },
      { t: "h2", text: "Three things to update in your plan" },
      { t: "list", items: [
        "**Your ride home:** Saturday now closes one hour later. Update pickups, HSR planning and your group meeting time.",
        "**Your personal lineup:** artist and speaker times have moved. Open [Find Your Festival Moments](https://www.jesusfestival.app/find-your-moments), review your picks and export a fresh calendar.",
        "**Your packing plan:** the longer day means one more hour outdoors. Bring water, sun protection, a charged phone and the layer or comfort items your visit needs. Use the [personalized What to Bring planner](https://www.jesusfestival.app/what-to-bring).",
      ] },
      { t: "quote", text: "Let all things be done decently and in order.", ref: "1 Corinthians 14:40 (NKJV)" },
      { t: "p", text: "Jesus Festival remains completely free, all ages and open to everyone. Friday’s Pure Worship Night is unchanged at 6:00–9:00 PM. Saturday is the day that grew: **10:00 AM–7:00 PM, with the stage from 11:00 AM–7:00 PM.** We cannot wait to worship Jesus with Hamilton." },
    ],
    faqs: [
      { question: "What are the new Jesus Festival Saturday hours?", answer: "Family Festival Day on Saturday, September 5, 2026 now runs from 10:00 AM–7:00 PM at Gage Park. The festival opens at 10:00 AM and the stage program runs from 11:00 AM–7:00 PM." },
      { question: "What time does the Jesus Festival stage begin on Saturday?", answer: "The Saturday stage begins with welcome and prayer at 11:00 AM. Terry Posthumus is scheduled at 11:15 AM, and the stage continues through the 7:00 PM final prayer and encouragement." },
      { question: "Who are the MCs for Jesus Festival Saturday?", answer: "JJ & Rachel are the Saturday MCs. They will keep the stage program moving and help fill gaps between artists, speakers and sound checks." },
      { question: "When does Ant Lee Jr. perform at Jesus Festival 2026?", answer: "Ant Lee Jr. is scheduled for music at 4:10 PM and 5:00 PM on Saturday, with his testimony at 4:40 PM between the two sets." },
      { question: "Can the Saturday schedule change during the festival?", answer: "Yes. The published schedule is the best current plan, but stage times may shift slightly during the live outdoor event. Check the Jesus Festival app Schedule and News screens for the latest information." },
    ],
    sources: [
      { name: "Jesus Festival — Official Hamilton 2026 Information", url: "https://www.jesusfestival.ca/" },
      { name: "Jesus Festival App — Live 2026 Schedule", url: "https://www.jesusfestival.app/schedule" },
    ],
    related: ["JesusFestival.ca", "ThyKingdom.net"],
  },
  {
    slug: "free-things-to-do-hamilton-september-2026",
    seoTitle: "Free Things to Do in Hamilton: Sept 2026",
    title: "Free Things to Do in Hamilton in September 2026",
    description:
      "A practical, date-checked guide to free Hamilton events in September 2026—including Jesus Festival, Supercrawl, Open Streets and a great day at Gage Park.",
    eyebrow: "Hamilton weekend guide",
    emoji: "🌆",
    date: "2026-08-17",
    readMins: 8,
    body: [
      { t: "p", text: "September is one of the best months to explore Hamilton without spending much. The heat eases, the city calendar fills up, and some of the year’s biggest gatherings are completely free." },
      { t: "p", text: "This guide is **current as of August 17, 2026** and uses official City of Hamilton, Tourism Hamilton and event sources. Dates, transit and weather plans can still change, so follow the linked official pages before you travel." },
      { t: "h2", text: "At a glance: free Hamilton events in September 2026" },
      { t: "list", items: [
        "**September 4:** Ability First Accessibility Fair at Hamilton City Hall, 11:00 AM–3:00 PM, with the Accessibility Awards presented at 2:00 PM.",
        "**September 4–5:** Jesus Festival Hamilton at Gage Park—Friday worship night and a full Saturday family festival.",
        "**September 11–13:** Supercrawl on James Street North, with free music, art, performances, vendors and family-friendly programming.",
        "**September 27:** Open Streets on King Street East, a free, family-friendly day built around walking, rolling, cycling and community activity.",
        "**Any day:** Explore Gage Park’s 71 acres of lawns, trails, gardens, playgrounds and public spaces.",
      ] },
      { t: "h2", text: "September 4: Ability First Accessibility Fair" },
      { t: "p", text: "Hamilton’s Ability First Accessibility Fair is scheduled for **Friday, September 4 from 11:00 AM to 3:00 PM** on the east walkway at Hamilton City Hall. The City says the event brings together organizations and services that help make Hamilton more accessible, and the 2026 Accessibility Awards are scheduled for 2:00 PM." },
      { t: "p", text: "This is a useful first stop for families, caregivers, community leaders and anyone who wants to learn more about accessibility in Hamilton. Check the [City of Hamilton announcement](https://www.hamilton.ca/city-council/news-notices/news-releases/nominations-open-hamiltons-3rd-annual-accessibility-awards) for the latest event details." },
      { t: "h2", text: "September 4–5: Jesus Festival Hamilton at Gage Park" },
      { t: "p", text: "Jesus Festival is a **free, no-ticket-required outdoor festival** at Gage Park, 1000 Main Street East. Friday’s Pure Worship Night runs from 6:00–9:00 PM. Saturday’s extended all-ages festival runs from 10:00 AM–7:00 PM, with the stage from 11:00 AM–7:00 PM plus live worship and music, testimonies, prayer, baptisms, a Kids Zone, bouncy castles, lawn games and food trucks." },
      { t: "p", text: "You can stay for one set or make a weekend of it. Start with the [complete Hamilton festival guide](https://www.jesusfestival.app/jesus-festival-hamilton), then use [Build My Festival Plan](https://www.jesusfestival.app/jesus-festival-hamilton#build-my-plan) to create an arrival, travel and packing plan that stays privately on your device." },
      { t: "p", text: "If mobility, sensory comfort, hearing or vision access, medication, a service animal or a support person affects your day, use the [Jesus Festival Accessibility and Comfort Guide](https://www.jesusfestival.app/accessibility). It separates confirmed Gage Park and HSR facts from event-day services that still need to be checked, and builds a private Comfort Plan without an account." },
      { t: "p", text: "Bringing children? The [parent’s festival survival guide](https://www.jesusfestival.app/blog/bringing-the-kids-to-jesus-festival) covers meeting points, what to pack and how to plan around naps. Save the [offline essentials](https://www.jesusfestival.app/offline) before leaving home so your core festival information remains available if the park network is crowded." },
      { t: "h2", text: "Make a free Gage Park day" },
      { t: "p", text: "Even without an event, Gage Park is worth exploring. The City lists **28.8 hectares—about 71 acres—of parkland**, along with the George R. Robinson Bandshell, trails, playgrounds, gardens, picnic areas, washrooms and potable water near washroom buildings." },
      { t: "list", items: [
        "Walk the loop and explore the gardens before the busiest part of the day.",
        "Bring lunch and use one of the park’s picnic areas instead of buying every meal out.",
        "Pack refillable bottles; the City lists potable water near the washroom buildings.",
        "Give children a clear meeting point before they run toward the playground or event activities.",
        "Check the City park page for current construction, parking and facility notices.",
      ] },
      { t: "p", text: "The park is large and event-day layouts can change. The City’s [Gage Park event-location page](https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations) is the best source for permanent park facilities, while the festival app provides the event-specific map." },
      { t: "h2", text: "September 7: plan around the Labour Day HSR schedule" },
      { t: "p", text: "If you are planning a free park or waterfront day on **Labour Day, Monday, September 7**, Hamilton’s official 2026 holiday schedule says HSR will operate on a **Sunday service schedule**. The City also notes that routes 12 and 42 do not operate on the Sunday schedule." },
      { t: "p", text: "Use the [official HSR holiday schedule](https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/hsr-holiday-schedules) and current trip planner shortly before leaving. A holiday timetable can turn a ten-minute connection into a much longer wait if you plan from a normal weekday screenshot." },
      { t: "h2", text: "September 11–13: Supercrawl" },
      { t: "p", text: "Supercrawl returns to James Street North from **Friday, September 11 through Sunday, September 13, 2026**. Tourism Hamilton lists it as a free, family-friendly festival bringing together music, art, fashion, performances, vendors and food." },
      { t: "p", text: "Because it stretches across multiple days and a busy downtown corridor, pick a smaller goal instead of trying to see everything. Choose one performance window, allow time to walk, and confirm the latest lineup and road information on the [official Tourism Hamilton listing](https://tourismhamilton.com/event/supercrawl/)." },
      { t: "h2", text: "September 27: Open Streets Hamilton" },
      { t: "p", text: "Open Streets is scheduled for **Sunday, September 27, 2026**, beginning at 10:00 AM on King Street East. Tourism Hamilton describes it as a free, family-friendly event where people can walk, cycle, roll and enjoy community programming without normal through traffic." },
      { t: "p", text: "Bring a bike, stroller, mobility device or comfortable shoes and treat the street itself as the destination. Check the [official Open Streets listing](https://tourismhamilton.com/event/open-streets-2/) closer to the date for the current route and hours." },
      { t: "h2", text: "How to have a better free day out" },
      { t: "list", items: [
        "**Verify the event on the morning you go.** Outdoor plans, route closures and hours can change.",
        "**Pack water, snacks and a layer.** A free outing becomes expensive quickly when everyone arrives hungry and unprepared.",
        "**Choose one anchor activity.** Build the day around the one set, neighbourhood or family activity you care about most.",
        "**Use current transit information.** Holiday schedules and event detours are more reliable than saved screenshots.",
        "**Download essential details.** Save addresses, meeting points and your return route before entering a busy event area.",
        "**Leave margin.** The best free festivals are popular. Twenty extra minutes protects the mood of the whole day.",
      ] },
      { t: "p", text: "Hamilton’s September calendar proves that a memorable weekend does not need an expensive ticket. Pick one event, invite one person, pack what you need and enjoy the city you already live in." },
    ],
    faqs: [
      { question: "What free events are happening in Hamilton in September 2026?", answer: "Major free September events include the Ability First Accessibility Fair on September 4, Jesus Festival Hamilton on September 4–5, Supercrawl on September 11–13 and Open Streets on September 27. Always confirm the latest details with the official organizer before travelling." },
      { question: "Is Jesus Festival Hamilton free?", answer: "Yes. Jesus Festival Hamilton is completely free and no ticket is required. It takes place September 4–5, 2026 at Gage Park. Food truck purchases and official merchandise are optional." },
      { question: "What free family events are in Hamilton in September?", answer: "Jesus Festival on September 5, Supercrawl from September 11–13 and Open Streets on September 27 are all listed as free and family-friendly. Gage Park is also a useful free outdoor destination for playgrounds, trails, gardens and picnics." },
      { question: "Does HSR run on Labour Day 2026?", answer: "Yes. On Labour Day, Monday, September 7, 2026, HSR is scheduled to run Sunday service. The City says routes 12 and 42 do not operate on the Sunday schedule, so check the current official trip planner before leaving." },
      { question: "Where is Gage Park in Hamilton?", answer: "Gage Park is at 1000 Main Street East in Hamilton, Ontario, between Main Street East, Gage Avenue South, Lawrence Road and Rothsay Avenue." },
    ],
    sources: [
      { name: "City of Hamilton — 2026 Accessibility Awards and Ability First Accessibility Fair", url: "https://www.hamilton.ca/city-council/news-notices/news-releases/nominations-open-hamiltons-3rd-annual-accessibility-awards" },
      { name: "City of Hamilton — Gage Park Event Location", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
      { name: "City of Hamilton — HSR Holiday Schedules", url: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/hsr-holiday-schedules" },
      { name: "Tourism Hamilton — Supercrawl", url: "https://tourismhamilton.com/event/supercrawl/" },
      { name: "Tourism Hamilton — Open Streets", url: "https://tourismhamilton.com/event/open-streets-2/" },
      { name: "Jesus Festival — Official Event Website", url: "https://www.jesusfestival.ca/" },
    ],
    related: ["JesusFestival.ca", "LoveonHamilton.com", "ThyKingdom.net"],
  },
  {
    slug: "bringing-the-kids-to-jesus-festival",
    seoTitle: "Bringing Kids to a Festival: Parent Guide",
    seoDescription: "A free outdoor festival, thousands of people and a toddler with opinions. What to pack, where to sit, what to do if someone wanders off.",
    title: "Bringing the Kids: A Parent's Survival Guide",
    description:
      "A free outdoor festival with thousands of people and a toddler who has opinions. What to pack, where to sit, what to do when someone wanders off — and why it's worth the effort.",
    eyebrow: "For parents",
    emoji: "🎈",
    date: "2026-08-14",
    readMins: 6,
    body: [
      { t: "p", text: "Taking small children to a large outdoor event is a calculation every parent runs. Free, ten minutes away, food trucks, bouncy castles — versus heat, crowds, naps, and the particular horror of losing sight of a four-year-old in a field of strangers." },
      { t: "p", text: "Saturday's Family Festival Day is genuinely built for this. But a good day and a hard day are separated by about six decisions you make before you leave the house. Here they are." },
      { t: "h2", text: "Sit at the back. Seriously." },
      { t: "p", text: "Every instinct says get close to the stage. With kids, do the opposite. The back and the edges of the lawn are where you can stand up, walk a grizzly baby in a circle, let a toddler roll around, and leave for the washroom without climbing over forty people." },
      { t: "p", text: "You'll hear everything. Nobody near you will mind noise. And you're ten steps from the exit when it's time." },
      { t: "h2", text: "Do the lost-child conversation before you arrive" },
      { t: "p", text: "This is the one thing worth being slightly systematic about, and it takes two minutes in the car:" },
      { t: "list", items: [
        "**Show them the Info & Lost Child Point on the map** in the app before you get there, and again when you arrive. It's the meeting point the whole team works from and the first place anyone will bring a child who's on their own.",
        "**Write your phone number on their arm** in biro, under the sleeve. Low tech, no battery, works when they're too upset to recite it.",
        "**Photograph them when you arrive**, in what they're actually wearing. If you ever need to describe them, you'll be holding the answer.",
        "**Teach them who to look for** — someone with a festival lanyard, or a mum with her own kids. \"Find a helper\" beats \"stay put\" for a child who is already moving.",
        "**Pick a landmark** as your family meeting point. The Gage Family Fountain is the easiest one in the park to describe and to find.",
      ] },
      { t: "p", text: "You will almost certainly not need any of this. It costs two minutes and it buys you the ability to relax, which is the actual goal." },
      { t: "h2", text: "The bag" },
      { t: "list", items: [
        "**A blanket bigger than you think.** It's your base, your table and your nap zone.",
        "**Sunscreen, and then sunscreen again at 2pm.** Early September sun in an open park is deceptive — there's a breeze, so nobody feels like they're burning until they are.",
        "**Water bottles.** There are drinking fountains in the park, so bring empties and fill up.",
        "**A change of clothes.** The spray pad is right there and children have no self-control about water. Assume they get soaked; be delighted rather than annoyed.",
        "**Snacks they already like.** Food trucks are great and also a queue with a hungry child in it.",
        "**Ear defenders for babies and toddlers.** Live sound at an outdoor stage is loud. Small ears aren't finished developing and this is genuinely worth doing.",
        "**A power bank.** You'll take 200 photos and the park signal will drain your battery hunting for a tower.",
      ] },
      { t: "h2", text: "Plan around the nap, not against it" },
      { t: "p", text: "Saturday now runs 10:00 AM to 7:00 PM, with the stage from 11:00 AM. Nobody needs to do all nine hours with a toddler. Pick your window—the Kids Zone and activities in the morning, or the afternoon sets and final prayer—and leave while everyone is still enjoying themselves." },
      { t: "p", text: "Leaving one hour early with a happy child is a completely different memory from leaving one hour late with a melting one. The [full schedule](https://www.jesusfestival.app/schedule) is in the app, so you can pick your window before you leave home." },
      { t: "h2", text: "Lower the bar for what counts as a good day" },
      { t: "p", text: "You may not hear a full talk. You may spend forty minutes at a bouncy castle and miss the set you came for. A friend will find you at the exact moment someone needs the toilet." },
      { t: "p", text: "That is not a failed day. Your kids will remember that church was outdoors and there was a slide and everyone was happy. That's the memory. The theology can come later — and it will come more easily to a child who associates all this with joy rather than with sitting still." },
      { t: "h2", text: "Why bother at all" },
      { t: "p", text: "When people started bringing children to Jesus, his own disciples — the serious, ministry-minded ones — tried to shoo them away. They had the reasonable adult view that this was an important gathering and children were a disruption." },
      { t: "quote", text: "Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.", ref: "Mark 10:14" },
      { t: "p", text: "The word Mark uses for Jesus' reaction is strong — he was indignant. Not mildly amused at the fuss. Annoyed, on behalf of the children, at the adults managing access to him." },
      { t: "p", text: "So bring them. Bring them noisy and sticky and mid-tantrum. They are not an interruption to what's happening at Gage Park; they're a fairly large part of the point." },
      { t: "p", text: "There's a [park map](https://www.jesusfestival.app/map) with the Kids Zone, the spray pad, the washrooms, first aid and the lost-child point all marked, and it works offline once you've installed the app — worth doing before you leave, because the signal in the park will not be there when you want it." },
      { t: "p", text: "See you on the grass. Sit at the back. 💛" },
    ],
    related: ["JesusFestival.ca", "LoveonHamilton.com", "IAmReborn.net"],
  },
  {
    slug: "never-been-to-anything-like-this",
    seoTitle: "Never Been to Anything Like This?",
    seoDescription: "Invited to Jesus Festival and said yes before thinking it through? Here's honestly what happens, what nobody will ask of you, and why you're welcome.",
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
        "**Saturday is the easy way in.** 10am to 7pm, families everywhere, food, games and a stage program from 11am. It's much less intense than Friday's worship night if intensity is what you're worried about.",
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
    seoTitle: "How to Pray for a City: 5 Biblical Patterns",
    seoDescription: "Praying for a whole city sounds vague. Scripture makes it concrete — five biblical patterns for praying over the streets you actually live on.",
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
    slug: "gage-park-festival-guide",
    seoTitle: "Gage Park Festival Guide: Jesus Festival",
    seoDescription: "Your guide to Jesus Festival at Gage Park, Hamilton: where to enter, when to arrive, parking and HSR, what to pack and tips for families.",
    title: "The Complete Gage Park Festival Guide for Jesus Festival 2026",
    description:
      "Plan your Jesus Festival Hamilton weekend at Gage Park: where to enter, when to arrive, parking and HSR options, what to pack, family tips and the full September 4–5 schedule.",
    eyebrow: "Plan your weekend",
    emoji: "🗺️",
    date: "2026-08-17",
    readMins: 8,
    body: [
      { t: "p", text: "Jesus Festival Hamilton returns to Gage Park on **Friday, September 4 and Saturday, September 5, 2026**. Admission is completely free, no ticket is required, and everyone is welcome. Friday is an open-air Pure Worship Night from 6:00–9:00 PM; Saturday is an extended all-ages festival day from 10:00 AM–7:00 PM, with the stage from 11:00 AM–7:00 PM." },
      { t: "p", text: "This guide puts the practical details in one place so you can spend less time wondering where to go and more time enjoying the weekend. Save the [official 2026 festival guide](https://www.jesusfestival.app/jesus-festival-hamilton), open the [live schedule](https://www.jesusfestival.app/schedule), and use the new [offline essentials screen](https://www.jesusfestival.app/offline) before you leave home." },
      { t: "h2", text: "Where exactly is Jesus Festival Hamilton?" },
      { t: "p", text: "Jesus Festival is held at **Gage Park, 1000 Main Street East, Hamilton, Ontario**. The park sits between Main Street East, Gage Avenue South, Lawrence Road and Rothsay Avenue. The City of Hamilton describes it as a 71-acre festival park with broad open lawns, walking paths and the George R. Robinson Bandshell." },
      { t: "p", text: "The bandshell is the natural landmark to look for once you are inside the park. Final festival-zone placement—including food trucks, Kids Zone, prayer and baptism areas—can change as the event plan is completed, so check the [in-app map and arrival guide](https://www.jesusfestival.app/map) near festival weekend." },
      { t: "h2", text: "When should I arrive?" },
      { t: "list", items: [
        "**Friday:** gates open at 6:00 PM and worship begins at 6:30 PM. Arriving around opening gives you time to park, choose a lawn spot and settle in before worship.",
        "**Saturday:** the festival begins at 10:00 AM and now runs until 7:00 PM; the stage starts at 11:00 AM. Come early if convenient parking and a favourite lawn location matter to you.",
        "**Families:** build in extra time for unloading chairs, water and children’s supplies. The park is large, so a calm arrival is worth the earlier start.",
      ] },
      { t: "p", text: "There is no box office or ticket line. You can simply arrive and join the festival. Star the sets you do not want to miss in the [personal schedule planner](https://www.jesusfestival.app/schedule), then download both days to your device calendar." },
      { t: "h2", text: "Parking, transit and getting to Gage Park" },
      { t: "p", text: "Parking around Gage Park is limited and spaces can fill quickly. City park information lists 150 park spaces, while the official festival site recommends arriving early or considering transit, rideshare, biking, walking or carpooling. Follow festival signs and volunteer directions when you arrive because event-day traffic flow can differ from an ordinary park visit." },
      { t: "p", text: "Nearby street parking, carpooling, rideshare, cycling, walking and HSR are useful alternatives. Transit schedules and detours can change, so use the [City of Hamilton’s official HSR trip-planning tools](https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/trip-planning-tools) on the day you travel rather than relying on an old route screenshot." },
      { t: "list", items: [
        "**Driving from downtown or Highway 403:** approach Main Street East toward Gage Avenue, then follow current traffic and event signage.",
        "**Driving from Niagara or the east:** the Red Hill Valley Parkway and Lawrence Road can provide a practical approach, depending on current conditions.",
        "**Using HSR:** plan for Gage Park or 1000 Main Street East and check live detour information before leaving.",
        "**Rideshare:** choose a safe legal drop-off point outside the busiest entrance and expect a short walk.",
      ] },
      { t: "h2", text: "What should I bring to an outdoor festival at Gage Park?" },
      { t: "p", text: "Think comfort, weather and a full day outdoors. The app now includes a private **Festival Ready** checklist that stays on your device and works offline. The essentials are simple:" },
      { t: "list", items: [
        "A lawn chair or picnic blanket",
        "A refillable water bottle",
        "Sunscreen and a hat for Saturday",
        "A light layer for Friday evening",
        "Comfortable walking shoes",
        "Any medications or family supplies you normally carry",
        "A friend, neighbour or family member to experience it with",
      ] },
      { t: "p", text: "The City lists potable water near park washroom buildings and three washroom areas across Gage Park, but event layouts and access points may change. Bring your water bottle filled, use posted facilities and ask a festival volunteer if you need help finding something." },
      { t: "p", text: "Visitors planning around mobility, sensory, hearing, vision or medical needs can use the [Accessibility and Comfort Guide](https://www.jesusfestival.app/accessibility) for confirmed park and HSR information, a private checklist and the questions worth asking before travelling." },
      { t: "h2", text: "Is Jesus Festival good for families?" },
      { t: "p", text: "Yes. Saturday is designed as a free, all-ages family festival with a Kids Zone, bouncy castles, lawn games, food trucks, worship, live music and open green space. Gage Park itself includes playgrounds, gardens and walking paths, although normal park amenities may operate differently during a major event." },
      { t: "p", text: "Take a photo of your group before spreading out, choose an easy-to-recognize meeting point, and make sure children know which festival volunteers to approach if they need help. A small card with a caregiver’s phone number is a useful extra for younger children." },
      { t: "h2", text: "What happens on Friday and Saturday?" },
      { t: "p", text: "Friday’s **Pure Worship Night** opens at 6:00 PM, with worship led by Bethel Gospel Tabernacle from 6:30–9:00 PM. Saturday’s extended **Family Festival Day** runs 10:00 AM–7:00 PM, with the stage from 11:00 AM–7:00 PM featuring Terry Posthumus, Ant Lee Jr., Open Heaven, ACTS Kingdom Sound Worship, Friday Night Prayer, testimonies, prayer, the Gospel, food trucks, family activities and baptisms." },
      { t: "p", text: "Set times can be easier to follow inside the app, especially once you create a personal lineup. The schedule and offline guide are cached for congested park networks, while live news, community features and Shopify inventory reconnect whenever service is available." },
      { t: "h2", text: "Your simplest festival plan" },
      { t: "list", items: [
        "Save September 4–5 using the app’s two-event calendar download.",
        "Open the Festival Ready checklist and pack the night before.",
        "Choose driving, HSR, rideshare, cycling or walking before you leave.",
        "Arrive early enough to park and settle in without rushing.",
        "Star your must-see sets and invite one person to come with you.",
      ] },
      { t: "p", text: "That is all you need. There is no ticket to buy and no special background required. Come as you are, find a place on the grass, and join a whole city lifting up the name of Jesus." },
    ],
    faqs: [
      { question: "When is Jesus Festival Hamilton 2026?", answer: "Jesus Festival Hamilton is September 4–5, 2026. Friday runs from 6:00–9:00 PM, with worship beginning at 6:30 PM. Saturday has been extended to 10:00 AM–7:00 PM, with the stage from 11:00 AM–7:00 PM." },
      { question: "Where is Jesus Festival held?", answer: "Jesus Festival is held at Gage Park, 1000 Main Street East, Hamilton, Ontario. The main City parking entrance is off Lawrence Road, just east of Gage Avenue South." },
      { question: "Is admission free and do I need a ticket?", answer: "Admission is completely free and no ticket is required. Food truck purchases and official merchandise are optional." },
      { question: "Where can I park for Jesus Festival?", answer: "Free festival parking is available but fills quickly. Follow current event signs and volunteer directions. Nearby street parking, HSR, rideshare, cycling and walking are useful alternatives." },
      { question: "What should I bring to Gage Park?", answer: "Bring a lawn chair or blanket, refillable water bottle, sunscreen, hat, comfortable shoes and a layer for Friday evening. The app includes a private offline packing checklist." },
      { question: "Is Jesus Festival family-friendly?", answer: "Yes. Saturday is an all-ages family festival with a Kids Zone, bouncy castles, games, food trucks, live music and open green space." },
    ],
    sources: [
      { name: "City of Hamilton — Gage Park Features and Event Services", url: "https://www.hamilton.ca/things-do/venues-facilities-bookings/event-planning-information/event-locations" },
      { name: "City of Hamilton — Gage Park and Tropical Greenhouse", url: "https://www.hamilton.ca/things-do/parks-green-space/gage-park-tropical-greenhouse" },
      { name: "City of Hamilton — HSR Trip Planning Tools", url: "https://www.hamilton.ca/home-neighbourhood/hsr/schedule-route-tools/trip-planning-tools" },
    ],
    related: ["JesusFestival.ca", "JesusFestivalMovement.com", "LoveonHamilton.com"],
  },
  {
    slug: "the-light-hunt-gage-park-scavenger-hunt",
    seoTitle: "Light Hunt: Gage Park Scavenger Hunt",
    seoDescription: "Twelve QR codes hide around Gage Park at Jesus Festival — each carries Scripture, lights a lamp on your phone and unlocks shareable badges.",
    title: "The Light Hunt: a Free Scavenger Hunt Hidden Inside Jesus Festival",
    description:
      "Twelve QR codes are hidden around Gage Park at Jesus Festival Hamilton — each one carries Scripture, lights a lamp on your phone, and unlocks shareable badges. Here's how to play.",
    eyebrow: "Play the festival",
    emoji: "🔦",
    date: "2026-08-29",
    readMins: 5,
    body: [
      { t: "p", text: "Somewhere near the main stage at Gage Park, a QR code is taped up where you might not notice it. There's another one by the food trucks. One at the baptism area. Six more are scattered through Vendor Row. Twelve in all — and every one of them is a light waiting to be found." },
      { t: "p", text: "It's called **the Light Hunt**, it's completely free, and it runs all weekend at [Jesus Festival Hamilton](https://www.jesusfestival.ca/), September 4–5, 2026." },
      { t: "h2", text: "How the Light Hunt works" },
      { t: "list", items: [
        "**Find a code.** Twelve Jesus Festival QR codes are hidden around Gage Park, near the places people gather — the stage, the big lawn, the kids zone, the food trucks, the baptism area, the info point, and all through the vendor market.",
        "**Scan it with your camera.** No app to install, nothing to sign up for. The lamp lights up on your phone instantly.",
        "**Collect the Scripture it carries.** Every light hands you a verse and a word of encouragement — twelve small moments with God scattered across a park.",
        "**Earn badges you can actually share.** First Light, Three Flames, Market Blessing, Light Bearer and more — nine in total, each one a real image your phone can post anywhere.",
      ] },
      { t: "p", text: "Every light you find also pours **Light Points** into [Revive the City](https://www.jesusfestival.app/revive-the-city) — the festival-wide game where the whole crowd's prayers, missions and discoveries add up to one shared story of a city coming alive. Find all twelve and you become a **Light Bearer**, with 2,500 points poured in and every badge unlocked." },
      { t: "h2", text: "It works with no signal — on purpose" },
      { t: "p", text: "Thousands of phones on one patch of grass means the network will crawl at exactly the moment you scan. The hunt is built for that: your lamps save on your phone the moment you scan, and your points reach the city as soon as you get a bar back. Nothing is lost, nobody waits on a spinner in a field." },
      { t: "h2", text: "Why half the lights are in the market" },
      { t: "p", text: "Six of the twelve lights sit in Vendor Row, and that's not an accident. Every booth at Jesus Festival is somebody's livelihood and somebody's offering — makers, ministries, and [Kingdom businesses](https://www.lionsdenalliance.com) who show up because they believe in what happens in this park. The hunt walks you right past them." },
      { t: "p", text: "So when a light sends you deep into the market: say hello. Ask the person at the table what they make. It costs you nothing, and it might be the best part of their day." },
      { t: "quote", text: "You are the light of the world. A town built on a hill cannot be hidden.", ref: "Matthew 5:14" },
      { t: "h2", text: "Tips from the people who hid them" },
      { t: "list", items: [
        "**Codes sit at chest height, out of glare.** If you can see the poster, your camera can read it — even creased or rained on.",
        "**Order doesn't matter.** Scanning any code starts your hunt. Station five first? That's your first light.",
        "**Bring the kids.** It's the best festival babysitter we know: a treasure hunt where every treasure is a verse.",
        "**Under an hour and a half is possible.** All twelve inside 90 minutes earns the Swift Light badge. You will not stroll.",
      ] },
      { t: "p", text: "The hunt lives in the [Jesus Festival app](https://www.jesusfestival.app/hunt) — which also carries the full schedule, the park map, and everything else you need for the weekend. It's free, it installs from the browser, and it works offline once it's loaded." },
      { t: "p", text: "Twelve lights. One park. Come find them all." },
    ],
    faqs: [
      { question: "What is the Light Hunt at Jesus Festival?", answer: "A free QR-code scavenger hunt across Gage Park during Jesus Festival Hamilton, September 4–5, 2026. Twelve codes are hidden around the park; scanning each one gives you a Bible verse, lights a lamp in the festival app, and unlocks shareable badges." },
      { question: "Does the Light Hunt cost anything or need an app?", answer: "No. It's completely free, there's nothing to install and nothing to sign up for — your phone's camera and browser are enough. Progress saves on your phone and works even with no signal." },
      { question: "What do you win in the Light Hunt?", answer: "Nine digital badges, each a shareable image — including Light Bearer for finding all twelve lights and Swift Light for finishing inside 90 minutes. Every find also adds Light Points to Revive the City, the festival's community game." },
      { question: "Where are the Light Hunt codes hidden?", answer: "Near the places people gather at Gage Park: the main stage, the big lawn, the kids zone, the food trucks, the baptism area, the info point — and six lights through Vendor Row, among the festival's makers and ministries." },
    ],
    related: ["JesusFestival.ca", "LoveonHamilton.com", "ThyKingdom.net"],
  },
  {
    slug: "wear-the-message",
    seoDescription: "Most Gospel conversations start with a question, not a sermon. On faith worn out loud, the Kingdom Shop and the official Jesus Festival collection.",
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
    seoDescription: "Nobody hands you a manual the moment you believe. An honest, gentle guide to the first weeks of following Jesus — what changes and what to do next.",
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
    seoTitle: "Faith at Work: Your Job Is Your Calling",
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
      { t: "p", text: "A few examples of what this looks like when it's built on purpose: [SIX33Outpost.com](https://www.six33outpost.com) makes apparel designed to start conversations before you say a word. [SIX33Legends.com](https://six33legends.com) builds cinematic storytelling that makes courage and faith feel as epic as they actually are. And [TaskSimply.com](https://www.tasksimply.com) is a quieter kind of Kingdom tool — tasks, teams and budgets in one calm place, because stewarding your days well is genuinely spiritual work." },
      { t: "p", text: "If you want the longer version of the thinking behind building Kingdom things in the everyday world, [DanielZiedins.com](https://www.danielziedins.com) is where that's written out." },
      { t: "p", text: "Your work is not a distraction from your calling. Handled well, it may be the largest part of it." },
    ],
    related: ["LionsDenAlliance.com", "SIX33Outpost.com", "SIX33Legends.com", "TaskSimply.com", "DanielZiedins.com"],
  },

  {
    slug: "one-invitation-changes-everything",
    seoTitle: "One Invitation Can Change Everything",
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

/**
 * Festival-weekend guides and reports. Everything else is evergreen faith
 * writing. New posts default to evergreen; add festival ones here.
 */
const FESTIVAL_POSTS = new Set([
  "jesus-festival-hamilton-2026-recap",
  "jesus-festival-starts-tomorrow-final-checklist",
  "jesus-festival-saturday-extended-updated-schedule-2026",
  "free-things-to-do-hamilton-september-2026",
  "bringing-the-kids-to-jesus-festival",
  "never-been-to-anything-like-this",
  "gage-park-festival-guide",
  "the-light-hunt-gage-park-scavenger-hunt",
]);

/**
 * "Keep reading" picks: the next two posts in the same group (wrapping
 * around), plus one from the other group so festival readers meet the faith
 * writing and vice versa.
 *
 * This used to be "the two newest posts", so every article recommended the
 * same pair: the recap had 33 inbound links and 13 of 16 posts had one.
 * Walking a ring gives every post the same number of inbound links, which is
 * what lets crawlers that follow links (GPTBot, ClaudeBot, Google before it
 * renders) actually reach the whole archive.
 */
export const isFestivalPost = (slug: string) => FESTIVAL_POSTS.has(slug);

/** The wider mission: partnership, impact and the work beyond the festival. */
const MISSION_POSTS = new Set([
  "plunder-hell-populate-heaven-partner-with-daniel-and-katie",
  "hamilton-evangelism-impact-partner-with-e3-canada",
]);

/** The guides a brand-new believer needs first; also linked from /i-said-yes steps. */
export const NEXT_STEP_POSTS = new Set([
  "how-to-get-baptized",
  "how-to-pray-when-you-dont-know-what-to-say",
  "how-to-start-reading-the-bible",
  "how-to-find-a-church-in-hamilton",
  "what-to-do-when-you-feel-far-from-god",
  "doubt-doesnt-disqualify-you",
  "how-to-tell-your-family-you-became-a-christian",
  "what-happens-after-you-say-yes",
]);

export const BLOG_SECTIONS = [
  { id: "next-steps", title: "Said yes? Start here", blurb: "Baptism, prayer, the Bible, finding a church, and the weeks after the yes." },
  { id: "mission", title: "The mission & partnership", blurb: "The vision, the impact so far, and how to stand in it." },
  { id: "festival", title: "Festival guides & reports", blurb: "The 2026 harvest report and every guide to the weekend at Gage Park." },
  { id: "faith", title: "Everyday faith", blurb: "Loving your city, reaching the people closest to you, and faith at work." },
] as const;

export type BlogSectionId = (typeof BLOG_SECTIONS)[number]["id"];

export const postSection = (slug: string): BlogSectionId =>
  NEXT_STEP_POSTS.has(slug) ? "next-steps" : MISSION_POSTS.has(slug) ? "mission" : FESTIVAL_POSTS.has(slug) ? "festival" : "faith";

export function relatedPosts(slug: string): BlogPost[] {
  const all = sortedPosts();
  if (!all.some((p) => p.slug === slug)) return [];
  const festival = FESTIVAL_POSTS.has(slug);
  const same = all.filter((p) => FESTIVAL_POSTS.has(p.slug) === festival);
  const other = all.filter((p) => FESTIVAL_POSTS.has(p.slug) !== festival);
  const i = same.findIndex((p) => p.slug === slug);
  const picks = [same[(i + 1) % same.length], same[(i + 2) % same.length]];
  if (other.length) picks.push(other[i % other.length]);
  const seen = new Set<string>([slug]);
  return picks.filter((p): p is BlogPost => {
    if (!p || seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

const escHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** [label](url), **bold** and *italic* → escaped HTML (mirrors components/blog/Rich.tsx). */
export function inlineHtml(text: string): string {
  return escHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/**
 * The whole article as plain HTML, for the RSS feed's content:encoded so
 * readers and aggregators get the full text, not just the dek.
 */
export function postHtml(post: BlogPost): string {
  return post.body
    .map((b) => {
      if (b.t === "h2") return `<h2>${escHtml(b.text)}</h2>`;
      if (b.t === "quote") return `<blockquote><p>${escHtml(b.text)}</p><cite>${escHtml(b.ref)}</cite></blockquote>`;
      if (b.t === "list") return `<ul>${b.items.map((it) => `<li>${inlineHtml(it)}</li>`).join("")}</ul>`;
      if (b.t === "cta") return `<p><strong>${escHtml(b.title)}</strong> ${inlineHtml(b.text)} <a href="${escHtml(b.href)}">${escHtml(b.label)}</a></p>`;
      return `<p>${inlineHtml(b.text)}</p>`;
    })
    .join("\n");
}

/** Stable anchor id for an article heading, shared by the renderer and the table of contents. */
export const headingId = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** Section headings for the "In this article" list (only worth showing on longer reads). */
export const postHeadings = (post: BlogPost) =>
  post.body.filter((b): b is Extract<Block, { t: "h2" }> => b.t === "h2").map((b) => ({ id: headingId(b.text), text: b.text }));

/** Visible words in an article body, for BlogPosting.wordCount. */
export const postWordCount = (post: BlogPost) =>
  post.body
    .map((b) => (b.t === "list" ? b.items.join(" ") : b.t === "cta" ? `${b.title} ${b.text}` : b.text))
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
