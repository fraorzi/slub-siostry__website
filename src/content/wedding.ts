import { media } from "./media";

export type DayTheme = "day" | "champagne" | "dusk" | "night";

export type Venue = {
  name: string;
  address: string;
  mapUrl: string;
  /** Placeholder: nazwa podkreślona przerywaną linią, dopóki para nie poda prawdziwej. */
  tbd?: boolean;
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
    venue: { name: "Kościół / USC — nazwa", address: "ulica, miasto", mapUrl: "#", tbd: true } satisfies Venue as Venue,
    video: media.ceremony,
  },
  reception: {
    slug: "przyjecie",
    time: "16:30",
    ends: "04:00",
    title: "Przenosimy się na przyjęcie.",
    lead: "Obiad przy oknach na sosnowy ogród, toasty, a potem już tylko parkiet.",
    venue: {
      name: "Miodowy Zakątek",
      address: "Prosta 31A, 96-325 Słabomierz",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Miodowy+Zak%C4%85tek%2C+Prosta+31A%2C+S%C5%82abomierz",
    } satisfies Venue as Venue,
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
