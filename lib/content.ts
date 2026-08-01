// Central content for the Jesus Festival app experience.
// Sourced from JesusFestival.ca and JesusFestivalMovement.com.

export const SITE = {
  name: "Jesus Festival",
  url: "https://www.jesusfestival.app",
  description:
    "The official Jesus Festival app. Hamilton 2026 — September 4–5 at Gage Park. Celebration. Worship. Unity. More than a festival — a movement.",
  eventDatesISO: "2026-09-04T18:30:00-04:00", // Friday 6:30pm Pure Worship Night
  tagline: "Celebration. Worship. Unity.",
  motto: "Love God. Love People. Change the World.",
  location: "Gage Park, Hamilton, Ontario",
  address: "1000 Main St E, Hamilton, ON L8M 1N2, Canada",
  dates: "September 4–5, 2026",
  email: "hello@jesusfestival.ca",
};

// Remote imagery from the live JesusFestival.ca CDN.
export const IMG = {
  // Official local brand asset.
  banner: "/brand/banner.png",
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jesus_festival_logo_8b53c5a4.webp",
  heroCrowd:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfgood1_7ef3ec90.jpg",
  rainbow:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfgood4_6c3ce034.jpg",
  worshipDusk:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfgood15_0942a53e.jpg",
  vendorRow:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfgood8_1613dd39.jpg",
  baptismJoy:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfgood10_811165b8.jpg",
  kidsInflatable:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jffun_d7751c78.jpg",
  kidsBandshell:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jffun3_21825498.jpg",
  kidsCarnival:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfunfn_548eacff.jpg",
  bouncyCastle: "https://www.jesusfestival.ca/home/family-festival/kids-bouncy-castle.jpg",
  lawnGames: "https://www.jesusfestival.ca/home/family-festival/family-lawn-games.jpg",
  antLee: "https://www.jesusfestival.ca/artists/ant-lee/ant-lee-live.jpg",
  openHeaven: "https://www.jesusfestival.ca/artists/open-heaven/open-heaven-worship.jpg",
};

export const HERO = {
  eyebrow: "September 4–5, 2026 · Gage Park · Hamilton",
  title: "JESUS FESTIVAL",
  year: "2026",
  subtitle: "Hamilton, we're coming back. One name lifted high.",
  body: "Come celebrate what God is doing in the city.",
};

// Two-day schedule. Times marked comingSoon show as "full schedule coming soon".
export const SCHEDULE = {
  status: "The full schedule is here",
  hosts: "JJ & Rachel",
  approximate:
    "All times are approximate and may shift slightly through the day as we keep things running smoothly. Thanks for your understanding!",
  days: [
    {
      id: "fri",
      label: "Friday",
      date: "September 4",
      theme: "Pure Worship Night",
      window: "6:00 PM – 9:00 PM",
      blurb:
        "A focused night of worship, prayer, and hearts lifted to Jesus — led by Bethel Gospel Tabernacle. Come early to find your spot; worship begins at 6:30 PM.",
      accent: "ember",
      comingSoon: false,
      items: [
        { time: "6:00 PM", title: "Come Early & Find Your Spot", note: "Gates open — arrive at 6:00 PM (or earlier!) to settle in before worship", kind: "moment" },
        { time: "6:30 PM", title: "Worship with Bethel Gospel Tabernacle", note: "Our Friday headliner leads the whole city in worship as the sun sets over Gage Park.", kind: "artist", featured: true, href: "https://bethelhamilton.com/" },
        { time: "9:00 PM", title: "Event Concludes", note: "Goodnight, Hamilton — see you tomorrow for Family Festival Day!", kind: "moment" },
      ],
    },
    {
      id: "sat",
      label: "Saturday",
      date: "September 5",
      theme: "Family Festival Day",
      window: "10:00 AM – 6:00 PM",
      blurb:
        "A full day for the whole family — worship sets, powerful testimonies, food trucks, bouncy castles, games and joy. Free, all ages, all day.",
      accent: "gold",
      comingSoon: false,
      items: [
        { time: "10:00 AM", title: "Opening Session", note: "Welcome · Prayer · Opening Remarks", kind: "moment" },
        { time: "11:35 AM", title: "I Am Second / e3 Canada", note: "Speaker", kind: "speaker" },
        { time: "11:50 AM", title: "Open Heaven — Set 1", note: "Worship", kind: "artist" },
        { time: "12:20 PM", title: "Joanna Adams", note: "Speaker", kind: "speaker" },
        { time: "12:40 PM", title: "Shofar Blowing & Pastors on Stage", note: "A moment of unity for the churches of Hamilton", kind: "moment" },
        { time: "1:00 PM", title: "Open Heaven — Set 2", note: "Worship", kind: "artist" },
        { time: "1:20 PM", title: "Testimony", note: "Speaker", kind: "speaker" },
        { time: "1:40 PM", title: "ACTS Kingdom Sound Worship — Set 1", note: "Worship", kind: "artist" },
        { time: "2:10 PM", title: "Rachel's Testimony", note: "Speaker", kind: "speaker" },
        { time: "2:30 PM", title: "ACTS Kingdom Sound Worship — Set 2", note: "Worship", kind: "artist" },
        { time: "2:50 PM", title: "Pastor Charles", note: "Speaker · Bethel Gospel Tabernacle", kind: "speaker" },
        { time: "3:10 PM", title: "Ant Lee Jr. — Set 1", note: "Christian hip-hop", kind: "artist" },
        { time: "3:40 PM", title: "Ant Lee Jr. — Testimony", note: "Speaker", kind: "speaker" },
        { time: "4:00 PM", title: "Ant Lee Jr. — Set 2", note: "Christian hip-hop", kind: "artist" },
        { time: "4:20 PM", title: "Daughters of Scripture", note: "Speaker", kind: "speaker" },
        { time: "4:40 PM", title: "Friday Night Prayer — Set 1", note: "Worship", kind: "artist" },
        { time: "5:10 PM", title: "Sons of Scripture", note: "Speaker", kind: "speaker" },
        { time: "5:30 PM", title: "Friday Night Prayer — Set 2", note: "Worship", kind: "artist" },
        { time: "5:50 PM", title: "Closing — Daniel & Katie", note: "Prayer & words of encouragement", kind: "moment" },
        { time: "6:00 PM", title: "Event Concludes", note: "Go and love your city. 💛", kind: "moment" },
      ],
    },
  ],
};

// Teaser shown under the Artists section on the home screen.
export const ARTISTS_NOTE = "The full lineup is here — two days of worship, testimonies and the Gospel. See the schedule for set times!";

export const EXPECT = [
  { icon: "worship", title: "Worship", text: "Thousands worshipping the King of Kings together." },
  { icon: "gospel", title: "The Gospel", text: "The Good News proclaimed clearly and publicly." },
  { icon: "baptism", title: "Baptisms", text: "New life celebrated in the heart of the city." },
  { icon: "kids", title: "Kids Zone", text: "Bouncy castles, games & big smiles for little feet." },
  { icon: "food", title: "Food Trucks", text: "Great food, family time & space to meet the city." },
  { icon: "community", title: "Community", text: "Churches, families & neighbours in one welcoming park." },
];

// `img` = square photo · `logo` = wide wordmark on a dark tile · neither = ♪ tile.
export const ARTISTS: {
  name: string;
  role: string;
  img?: string;
  logo?: string;
  blurb: string;
  href?: string;
}[] = [
  {
    name: "Bethel Gospel Tabernacle",
    role: "Friday · Pure Worship Night",
    logo: "/brand/bethel-logo-white.png",
    blurb:
      "Leading the whole city in worship on Friday night, 6:30–9:00 PM at Gage Park.",
    href: "https://bethelhamilton.com/",
  },
  {
    name: "Ant Lee Jr.",
    role: "Christian Hip-Hop · Speaker",
    img: IMG.antLee,
    blurb:
      "A joyful voice of purpose for this generation — two Saturday sets plus his testimony.",
    href: "https://www.jesusfestival.ca/artists/ant-lee",
  },
  {
    name: "Open Heaven",
    role: "Worship Ministry",
    img: IMG.openHeaven,
    blurb:
      "A Canadian ministry bringing worship and the Good News of Jesus into communities across the nation.",
    href: "https://www.jesusfestival.ca/artists/open-heaven",
  },
  {
    name: "ACTS Kingdom Sound Worship",
    role: "Worship",
    blurb: "Two Saturday afternoon sets lifting one name over Hamilton.",
  },
  {
    name: "Friday Night Prayer",
    role: "Worship",
    blurb: "Closing out Saturday with two sets of worship and prayer.",
  },
];

export const IMPACT = [
  { stat: "Hundreds", label: "Baptisms, Salvations & Disciples" },
  { stat: "Thousands", label: "Worshipping the King at Every Event" },
  { stat: "Many", label: "Churches United Across the Region" },
  { stat: "Countless", label: "Lives Touched Through Weekly Outreach" },
  { stat: "2024 → 2026", label: "Three Years of Fruit in Hamilton" },
];

export const TIMELINE = [
  {
    year: "2024",
    title: "The first yes",
    text: "Jesus Festival began in Hamilton with worship, Gospel hope, community, and a city gathering around the name of Jesus.",
  },
  {
    year: "2025",
    title: "The fruit multiplied",
    text: "The gathering returned with growing unity, baptisms, outreach, family joy, and testimonies pointing to Jesus.",
  },
  {
    year: "2026",
    title: "We're coming back",
    text: "September 4–5 at Gage Park. Bethel Gospel Tabernacle leads Friday's Pure Worship Night, with Ant Lee Jr., Open Heaven and more to come.",
  },
];

export const MOVEMENT = {
  vision: "Gather the Church. Reach the city. Leave a movement.",
  line: "More than a festival. A movement that remains.",
  path: "Hamilton → Niagara → The Nations",
  body:
    "We believe this is not just an event — it's a movement. Every gathering is a seed: planted in worship, watered through outreach, multiplied through discipleship. The festival is a launchpad, not the finish line.",
  pillars: [
    "Jesus at the center",
    "The Gospel made clear",
    "Local fruit that lasts",
  ],
  cta: {
    label: "Explore the Movement",
    href: "https://www.jesusfestivalmovement.com/",
  },
  scripture: {
    text:
      "All authority in heaven and on earth has been given to me. Therefore go and make disciples of all nations.",
    ref: "Matthew 28:18–19",
  },
};

// Discipleship — keeping the fire burning together.
export const DISCIPLESHIP = {
  eyebrow: "After the festival",
  title: "Keep the Fire Burning",
  intro:
    "The festival is a spark — discipleship is the fire that keeps burning. Real change doesn't happen in a weekend; it happens in relationship. Stay connected, keep worshipping, keep praying, and walk this out with others who love Jesus.",
  points: [
    {
      icon: "flame",
      title: "Don't let the fire go out",
      text: "Encounters fade fast when we walk alone. Feed the fire daily — the Word, prayer, and worship keep your heart burning.",
    },
    {
      icon: "community",
      title: "You were made for connection",
      text: "We grow together. Find a church, join a group, and do life with people who will cheer you on and carry you when it's hard.",
    },
    {
      icon: "gospel",
      title: "Pass it on",
      text: "The best way to keep what you've received is to give it away. Encourage someone, share Jesus, and make disciples.",
    },
  ],
  scripture: {
    text: "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.",
    ref: "Hebrews 10:24–25",
  },
  churches: [
    { name: "Bethel Gospel Tabernacle", href: "https://bethelhamilton.com/", badge: "🎶 Leading Friday worship" },
    { name: "Hamilton Christian Fellowship", href: "https://hcfchurch.ca/" },
    { name: "CIA Church", href: "https://www.ciachurch.com/" },
    { name: "Transformation Centre", href: "https://transformationcentre.ca/" },
  ],
  ministries: [
    { name: "Thy Kingdom Network", href: "https://www.thykingdom.net" },
    { name: "Love on Hamilton", href: "https://loveonhamilton.com/" },
    { name: "e3 Canada", href: "https://e3ministry.ca/" },
    { name: "Sons of Scripture", href: "https://sonsofscripture.com/" },
    { name: "Daughters of Scripture", href: "https://daughtersofscripture.org/" },
    { name: "Health to You Ministry", href: "https://www.healthtoyouministry.ca/" },
  ],
};

// Encouraging scripture used as accents throughout the app.
export const SCRIPTURES = [
  { text: "I am the light of the world. Whoever follows me will never walk in darkness.", ref: "John 8:12" },
  { text: "Your word is a lamp for my feet, a light on my path.", ref: "Psalm 119:105" },
  { text: "Be strong and courageous. Do not be afraid; the Lord your God will be with you.", ref: "Joshua 1:9" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Let all that you do be done in love.", ref: "1 Corinthians 16:14" },
  { text: "The joy of the Lord is your strength.", ref: "Nehemiah 8:10" },
  { text: "You are the light of the world. A town built on a hill cannot be hidden.", ref: "Matthew 5:14" },
  { text: "Your kingdom come, your will be done, on earth as it is in heaven.", ref: "Matthew 6:10" },
];

export const CITIES = [
  { city: "Hamilton", region: "Ontario", note: "Where it began", active: true },
  { city: "Niagara", region: "Ontario", note: "Worship in the Wild", active: true },
  { city: "Your City", region: "The Nations", note: "Could be next", active: false },
];

// Real, authentic photos from past Jesus Festivals at Gage Park.
export const MOMENTS = [
  { src: "/photos/moment-games.jpg", caption: "Big Throw Down — games for the whole family" },
  { src: "/photos/moment-community.jpg", caption: "Ministries & community on the grass" },
  { src: "/photos/moment-prayer.jpg", caption: "Praying for the city at the Gage Park fountain" },
];

export const RECAPS = [
  {
    year: "2025",
    title: "Jesus Festival 2025 Recap",
    text: "Thousands gathered. Lives changed. The name of Jesus lifted high in Hamilton.",
  },
  {
    year: "2024",
    title: "Jesus Festival 2024 Recap",
    text: "Where it all began — the first Jesus Festival and the spark that started a movement.",
  },
];

export const LINKS = {
  facebook: "https://www.facebook.com/JesusFestival.ca",
  instagram: "https://www.instagram.com/jesusfestival.ca",
  youtube: "https://www.youtube.com/@JesusFestivalCanada",
  facebookEvent: "https://www.facebook.com/share/1B22HVTfin/",
  volunteer: "https://www.jesusfestival.ca/volunteer",
  sponsor: "https://www.jesusfestival.ca/sponsors",
  donate: "https://e3ministry.ca/donate/Jesus-Festival",
  eventDetails: "https://www.jesusfestival.ca/event-details",
  directions: "https://www.google.com/maps/place/Gage+Park/@43.2413,-79.8132,15z",
  community:
    "https://thykingdom.app.clientclub.net/communities/groups/jesus-festival/home?invite=69c06d5b596281f3ec6a5fda",
  movement: "https://www.jesusfestivalmovement.com/",
};

// Donation / sowing into the movement.
export const DONATE = {
  eyebrow: "Sow into good ground",
  title: "Give to Jesus Festival",
  href: "https://e3ministry.ca/donate/Jesus-Festival",
  intro:
    "Every gift helps take the Gospel to the city — worship nights, outreach, baptisms, and a free festival where thousands meet Jesus. When you give, you're not just funding an event; you're sowing into a movement.",
  receipt: "You'll receive a charitable tax receipt for your gift through our ministry partner e3 Canada.",
  scripture: {
    text: "Whoever sows generously will also reap generously. God loves a cheerful giver.",
    ref: "2 Corinthians 9:6–7",
  },
  impact: [
    { emoji: "🎤", text: "Free worship & Gospel nights for the whole city" },
    { emoji: "💧", text: "Baptisms & new life celebrated publicly" },
    { emoji: "🤝", text: "Year-round outreach & discipleship" },
    { emoji: "🎡", text: "A free family festival — no ticket needed" },
  ],
};

// Teaser: features on the way.
export const COMING_SOON = [
  { emoji: "🗺️", title: "Final Zone Map", text: "Exact stage, food, baptism & Kids Zone placement for festival weekend." },
  { emoji: "📸", title: "Photo Wall", text: "Share your festival moments with the whole community." },
  { emoji: "🎟️", title: "Digital Check-In", text: "Save your spot and get personal schedule reminders." },
  { emoji: "📱", title: "QR Missions", text: "Scan around the park to unlock special Revive the City missions." },
];

export const INTERESTS = [
  { id: "updates", label: "Event Updates" },
  { id: "artists", label: "Artist Announcements" },
  { id: "volunteer", label: "Volunteer" },
  { id: "prayer", label: "Prayer & Discipleship" },
] as const;
