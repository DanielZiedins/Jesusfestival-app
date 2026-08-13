const CALENDAR_LINES = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Jesus Festival//Hamilton 2026//EN",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "X-WR-CALNAME:Jesus Festival Hamilton 2026",
  "BEGIN:VEVENT",
  "UID:jf2026-friday@jesusfestival.app",
  "DTSTAMP:20260812T120000Z",
  "DTSTART:20260904T220000Z",
  "DTEND:20260905T010000Z",
  "SUMMARY:Jesus Festival — Pure Worship Night",
  "LOCATION:Gage Park\\, 1000 Main St E\\, Hamilton\\, ON",
  "GEO:43.2407;-79.8299",
  "URL:https://www.jesusfestival.app/jesus-festival-hamilton",
  "DESCRIPTION:Free all-ages worship night. Gates open at 6 PM and worship begins at 6:30 PM. Plan your visit: https://www.jesusfestival.app/jesus-festival-hamilton",
  "STATUS:CONFIRMED",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:jf2026-saturday@jesusfestival.app",
  "DTSTAMP:20260812T120000Z",
  "DTSTART:20260905T140000Z",
  "DTEND:20260905T220000Z",
  "SUMMARY:Jesus Festival — Family Festival Day",
  "LOCATION:Gage Park\\, 1000 Main St E\\, Hamilton\\, ON",
  "GEO:43.2407;-79.8299",
  "URL:https://www.jesusfestival.app/jesus-festival-hamilton",
  "DESCRIPTION:Free family festival with live music\\, worship\\, food trucks\\, Kids Zone\\, baptisms and more. Plan your visit: https://www.jesusfestival.app/jesus-festival-hamilton",
  "STATUS:CONFIRMED",
  "END:VEVENT",
  "END:VCALENDAR",
];

// RFC 5545 limits content lines to 75 octets. Folding the longer descriptions
// keeps this feed maximally compatible with Apple, Google and Outlook.
function foldCalendarLine(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let part = "";
  for (const character of line) {
    if (encoder.encode(part + character).length > 75) {
      parts.push(part);
      part = ` ${character}`;
    } else {
      part += character;
    }
  }
  parts.push(part);
  return parts.join("\r\n");
}

const CALENDAR = `${CALENDAR_LINES.map(foldCalendarLine).join("\r\n")}\r\n`;

export function GET() {
  return new Response(CALENDAR, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="jesus-festival-hamilton-2026.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
