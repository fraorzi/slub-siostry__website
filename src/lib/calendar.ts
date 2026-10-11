import { wedding } from "@/content/wedding";

const events = [wedding.ceremony, wedding.reception] as const;
export type CalendarEvent = (typeof events)[number];

export const findEvent = (slug: string) => events.find((e) => e.slug === slug) ?? null;

export const hasWeddingDay = () => /^\d{4}-\d{2}-\d{2}$/.test(wedding.weddingDay);

const stamp = (day: string, time: string) => `${day.replaceAll("-", "")}T${time.replace(":", "")}00`;

const addDay = (day: string) => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

const escape = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`);

export function toIcs(event: CalendarEvent): string {
  const day = wedding.weddingDay;
  const endDay = event.ends < event.time ? addDay(day) : day;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//slub//PL",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}-${day}@slub`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Europe/Warsaw:${stamp(day, event.time)}`,
    `DTEND;TZID=Europe/Warsaw:${stamp(endDay, event.ends)}`,
    `SUMMARY:${escape(`${wedding.bride} & ${wedding.groom} — ${event.slug === "slub" ? "ślub" : "przyjęcie"}`)}`,
    `LOCATION:${escape(`${event.venue.name}, ${event.venue.address}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
