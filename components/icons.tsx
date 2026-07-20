import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const HomeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 3v3M16 3v3" />
    <path d="M7.5 13h3M7.5 16.5h3M13.5 13h3" />
  </svg>
);

export const MapIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-10.2A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.8C18.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.3" />
  </svg>
);

export const FlameIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c.6 3-1.8 4.2-2.8 6.1C8 11.4 8 13 8 13.5A4 4 0 0 0 16 14c0-2.2-1.4-3.6-1.4-5.4 1.2.6 2 1.6 2.4 2.8.8-1.4.6-3.2-.4-4.8C15.2 4.7 13.5 3.8 12 3Z" />
  </svg>
);

export const BellIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const CrossIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="7.4" y="8" width="9.2" height="3.1" rx="1.4" fill="currentColor" stroke="none" />
    <rect x="10.45" y="3" width="3.1" height="18" rx="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const MapPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const Sparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
  </svg>
);

export const Share = (p: P) => (
  <svg {...base(p)}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8 15.8 6.2M8.2 13.2l7.6 4.6" />
  </svg>
);

export const Download = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </svg>
);

export const Play = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
  </svg>
);

export const Users = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
  </svg>
);

export const Music = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18V6l10-2v12" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="16" cy="16" r="2.5" />
  </svg>
);

export const Globe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3C9.5 5.5 9.5 18.5 12 21" />
  </svg>
);

export const Heart = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
  </svg>
);
