// Central content for the Jesus Festival app experience.
// Sourced from JesusFestival.ca and JesusFestivalMovement.com.

export const SITE = {
  name: "Jesus Festival",
  url: "https://jesusfestival.app",
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
  status: "Full set times coming soon",
  days: [
    {
      id: "fri",
      label: "Friday",
      date: "September 4",
      theme: "Pure Worship Night",
      window: "6:30 PM – 9:00 PM",
      blurb:
        "A focused night of worship, prayer, and hearts lifted to Jesus. No vendors, no distractions — just His presence.",
      accent: "ember",
      items: [
        { time: "6:30 PM", title: "Doors & Gathering", note: "Find your spot as the sun sets over Gage Park" },
        { time: "7:00 PM", title: "Pure Worship Begins", note: "Open Heaven leads the city in worship" },
        { time: "8:00 PM", title: "Prayer & The Word", note: "A moment to encounter Jesus together" },
        { time: "8:30 PM", title: "Ant Lee", note: "A joyful voice of purpose for this generation" },
      ],
    },
    {
      id: "sat",
      label: "Saturday",
      date: "September 5",
      theme: "Family Festival Day",
      window: "10:00 AM – 6:00 PM",
      blurb:
        "Food trucks, vendors, live music, bouncy castles, games, community, and joy. A full day for the whole family.",
      accent: "gold",
      items: [
        { time: "10:00 AM", title: "Festival Opens", note: "Kids Zone, vendors & food trucks open" },
        { time: "11:00 AM", title: "Live Music & Testimonies", note: "The Bandshell stage comes alive" },
        { time: "1:00 PM", title: "Games & Family Fun", note: "Inflatables, lawn games, carnival fun" },
        { time: "3:00 PM", title: "Worship & The Gospel", note: "The name of Jesus lifted over Hamilton" },
        { time: "5:00 PM", title: "Baptisms & Celebration", note: "New life celebrated in the heart of the city" },
      ],
    },
  ],
};

export const EXPECT = [
  { icon: "worship", title: "Worship", text: "Thousands worshipping the King of Kings together." },
  { icon: "gospel", title: "The Gospel", text: "The Good News proclaimed clearly and publicly." },
  { icon: "baptism", title: "Baptisms", text: "New life celebrated in the heart of the city." },
  { icon: "kids", title: "Kids Zone", text: "Bouncy castles, games & big smiles for little feet." },
  { icon: "food", title: "Food Trucks", text: "Great food, family time & space to meet the city." },
  { icon: "community", title: "Community", text: "Churches, families & neighbours in one welcoming park." },
];

export const ARTISTS = [
  {
    name: "Ant Lee",
    role: "Christian Hip-Hop · Speaker",
    img: IMG.antLee,
    blurb:
      "A joyful voice of purpose for this generation — returning to Jesus Festival Hamilton in 2026.",
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
    text: "September 4–5 at Gage Park. Ant Lee and Open Heaven return, with more announcements to follow.",
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
  donate: "https://www.jesusfestival.ca/donate",
  eventDetails: "https://www.jesusfestival.ca/event-details",
  directions: "https://www.google.com/maps/place/Gage+Park/@43.2413,-79.8132,15z",
  community:
    "https://thykingdom.app.clientclub.net/communities/groups/jesus-festival/home?invite=69c06d5b596281f3ec6a5fda",
  movement: "https://www.jesusfestivalmovement.com/",
};

export const INTERESTS = [
  { id: "updates", label: "Event Updates" },
  { id: "artists", label: "Artist Announcements" },
  { id: "volunteer", label: "Volunteer" },
  { id: "prayer", label: "Prayer & Discipleship" },
] as const;
