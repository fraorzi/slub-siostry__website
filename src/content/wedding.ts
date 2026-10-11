import { media } from "./media";

export type DayTheme = "day" | "champagne" | "dusk" | "night";

export type Venue = {
  name: string;
  address: string;
  mapUrl: string;
};

export const wedding = {
  bride: "Ona",
  groom: "On",
  dateLabel: "dd · mm · rrrr",
  weddingDay: process.env.WEDDING_DAY ?? "",
  ceremony: {
    slug: "slub",
    time: "15:00",
    ends: "16:00",
    title: "Mówimy sobie „tak”.",
    lead: "Ceremonia zaczyna się punktualnie. Panna młoda podobno też.",
    venue: { name: "Kościół / USC — nazwa", address: "ulica, miasto", mapUrl: "#" } satisfies Venue,
    video: media.ceremony,
  },
  reception: {
    slug: "przyjecie",
    time: "16:30",
    ends: "04:00",
    title: "Przenosimy się na przyjęcie.",
    lead: "Obiad, toasty, a potem już tylko parkiet.",
    venue: { name: "Sala / dwór — nazwa", address: "ulica, miasto · parking na miejscu", mapUrl: "#" } satisfies Venue,
    image: media.reception,
  },
  evening: [
    { time: "21:00", label: "Tort" },
    { time: "21:30", label: "Pierwszy taniec, drugi i trzeci" },
  ],
  contactNote: "Pytania: świadkowie — kontakt wkrótce",
  media: {
    intro: media.intro,
    goldenHour: media.goldenHour,
    midnight: media.midnight,
  },
};
