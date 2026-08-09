import { ARTISTS, LINKS, SITE } from "@/lib/content";

export const LAST_MAJOR_UPDATE = "2026-08-09";
export const FESTIVAL_GUIDE_PATH = "/jesus-festival-hamilton";

export const FESTIVAL_FAQS = [
  {
    question: "When is Jesus Festival Hamilton 2026?",
    answer:
      "Jesus Festival Hamilton takes place September 4–5, 2026 at Gage Park. Friday's Pure Worship Night opens at 6:00 PM, with worship from 6:30–9:00 PM. Saturday's Family Festival Day runs from 10:00 AM–6:00 PM.",
  },
  {
    question: "Is Jesus Festival free?",
    answer:
      "Yes. Jesus Festival is a free, all-ages outdoor Christian festival. No admission ticket is required. Food truck purchases and official shop merchandise are optional.",
  },
  {
    question: "Where is Jesus Festival held?",
    answer:
      "The festival is held at Gage Park, 1000 Main Street East, Hamilton, Ontario, Canada, L8M 1N2.",
  },
  {
    question: "Who is performing at Jesus Festival 2026?",
    answer:
      "Bethel Gospel Tabernacle leads Friday's Pure Worship Night. Saturday includes Open Heaven, ACTS Kingdom Sound Worship, Ant Lee Jr., Friday Night Prayer, speakers, testimonies, prayer and the Gospel.",
  },
  {
    question: "What happens on Saturday's Family Festival Day?",
    answer:
      "Saturday is a free full-day gathering with live worship, Christian hip-hop, testimonies, prayer, food trucks, a Kids Zone, bouncy castles, lawn games and baptisms. It runs from 10:00 AM–6:00 PM.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring a lawn chair or blanket, sunscreen and a hat, a refillable water bottle, comfortable shoes and a layer for Friday evening. Arriving early makes it easier to find a good spot.",
  },
  {
    question: "How do I get to Gage Park and where can I park?",
    answer:
      "Gage Park is at 1000 Main Street East in Hamilton. Free on-site festival parking is available but fills quickly. Nearby street parking, HSR transit, rideshare, cycling and walking are also practical options.",
  },
  {
    question: "Is the festival family-friendly?",
    answer:
      "Yes. Saturday is designed for all ages, with a dedicated Kids Zone, bouncy castles, games, food and open lawn space for families.",
  },
  {
    question: "What does the Jesus Festival app include?",
    answer:
      "The free app includes the complete two-day schedule, a personal lineup planner, Gage Park directions, festival news, live updates, the Prayer Wall, Revive the City activities, notifications and offline essentials.",
  },
  {
    question: "Where can I buy official Jesus Festival apparel?",
    answer:
      "The Festival Shop inside JesusFestival.App features the official Jesus Festival collection from ThyKingdom.Shop, with prices displayed in Canadian dollars.",
  },
] as const;

const PLACE_JSONLD = {
  "@type": "Place",
  "@id": `${SITE.url}/#gage-park`,
  name: "Gage Park",
  url: `${SITE.url}/map`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1000 Main St E",
    addressLocality: "Hamilton",
    addressRegion: "ON",
    postalCode: "L8M 1N2",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.2413,
    longitude: -79.8132,
  },
};

const FREE_OFFER_JSONLD = {
  "@type": "Offer",
  price: "0",
  priceCurrency: "CAD",
  availability: "https://schema.org/InStock",
  url: `${SITE.url}${FESTIVAL_GUIDE_PATH}`,
  validFrom: "2026-01-01T00:00:00-05:00",
};

export const FESTIVAL_EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Festival",
  "@id": `${SITE.url}/#festival-2026`,
  name: "Jesus Festival Hamilton 2026",
  alternateName: "Jesus Festival 2026",
  url: `${SITE.url}${FESTIVAL_GUIDE_PATH}`,
  mainEntityOfPage: `${SITE.url}${FESTIVAL_GUIDE_PATH}`,
  startDate: "2026-09-04T18:00:00-04:00",
  endDate: "2026-09-05T18:00:00-04:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  isAccessibleForFree: true,
  inLanguage: "en-CA",
  typicalAgeRange: "All ages",
  description:
    "A free two-day outdoor Christian festival at Gage Park in Hamilton with worship, the Gospel, testimonies, baptisms, food trucks, family activities and a Kids Zone.",
  image: [
    `${SITE.url}/brand/banner.png`,
    `${SITE.url}/photos/moment-community.jpg`,
    `${SITE.url}/photos/moment-prayer.jpg`,
  ],
  keywords: [
    "Jesus Festival",
    "Hamilton Christian festival",
    "free Hamilton event",
    "worship festival Ontario",
    "family festival Hamilton",
  ],
  location: PLACE_JSONLD,
  organizer: { "@id": `${SITE.url}/#organization` },
  offers: FREE_OFFER_JSONLD,
  performer: ARTISTS.map((artist) => ({
    "@type": artist.name === "Ant Lee Jr." ? "Person" : "MusicGroup",
    name: artist.name,
    ...(artist.href ? { url: artist.href } : {}),
  })),
  subEvent: [
    {
      "@type": "MusicEvent",
      "@id": `${SITE.url}/#pure-worship-night-2026`,
      name: "Pure Worship Night — Jesus Festival Hamilton 2026",
      url: `${SITE.url}/schedule#friday`,
      startDate: "2026-09-04T18:00:00-04:00",
      doorTime: "2026-09-04T18:00:00-04:00",
      endDate: "2026-09-04T21:00:00-04:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      isAccessibleForFree: true,
      description:
        "An open-air night of worship and prayer at Gage Park led by Bethel Gospel Tabernacle. Gates open at 6:00 PM and worship begins at 6:30 PM.",
      image: `${SITE.url}/brand/banner.png`,
      location: PLACE_JSONLD,
      organizer: { "@id": `${SITE.url}/#organization` },
      offers: FREE_OFFER_JSONLD,
      performer: {
        "@type": "MusicGroup",
        name: "Bethel Gospel Tabernacle",
        url: "https://bethelhamilton.com/",
      },
    },
    {
      "@type": "Festival",
      "@id": `${SITE.url}/#family-festival-day-2026`,
      name: "Family Festival Day — Jesus Festival Hamilton 2026",
      url: `${SITE.url}/schedule#saturday`,
      startDate: "2026-09-05T10:00:00-04:00",
      endDate: "2026-09-05T18:00:00-04:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      isAccessibleForFree: true,
      description:
        "A free all-ages day of worship, Christian hip-hop, testimonies, food trucks, games, a Kids Zone and baptisms at Gage Park.",
      image: `${SITE.url}/photos/moment-games.jpg`,
      location: PLACE_JSONLD,
      organizer: { "@id": `${SITE.url}/#organization` },
      offers: FREE_OFFER_JSONLD,
      performer: ARTISTS.slice(1).map((artist) => ({
        "@type": artist.name === "Ant Lee Jr." ? "Person" : "MusicGroup",
        name: artist.name,
        ...(artist.href ? { url: artist.href } : {}),
      })),
    },
  ],
};

export const SITE_GRAPH_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: "Jesus Festival",
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/icons/icon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE.url}/brand/banner.png`,
      email: SITE.email,
      slogan: SITE.motto,
      sameAs: [
        "https://www.jesusfestival.ca",
        LINKS.facebook,
        LINKS.instagram,
        LINKS.youtube,
      ],
      parentOrganization: {
        "@type": "Organization",
        "@id": "https://www.thykingdom.net/#organization",
        name: "Thy Kingdom Network",
        url: "https://www.thykingdom.net",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: "Jesus Festival App",
      alternateName: ["Jesus Festival Hamilton", "JesusFestival.App"],
      url: SITE.url,
      description: SITE.description,
      inLanguage: "en-CA",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE.url}/#app`,
      name: "Jesus Festival App",
      url: SITE.url,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      inLanguage: "en-CA",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
      description: SITE.description,
      featureList: [
        "Complete two-day festival schedule",
        "Personal lineup planner",
        "Live festival updates",
        "Gage Park map and directions",
        "Prayer Wall",
        "Revive the City community activities",
        "Offline access",
        "Push notifications",
        "Official Festival Shop",
      ],
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export const FESTIVAL_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE.url}/faq#faq`,
  mainEntity: FESTIVAL_FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
  about,
}: {
  path: string;
  name: string;
  description: string;
  about?: { "@id": string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}${path === "/" ? "" : path}#webpage`,
    url: `${SITE.url}${path === "/" ? "" : path}`,
    name,
    description,
    inLanguage: "en-CA",
    isPartOf: { "@id": `${SITE.url}/#website` },
    ...(about ? { about } : {}),
    dateModified: LAST_MAJOR_UPDATE,
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
