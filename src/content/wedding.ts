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
    video: "https://videos.pexels.com/video-files/29918276/12841510_720_1280_25fps.mp4",
  },
  reception: {
    slug: "przyjecie",
    time: "16:30",
    ends: "04:00",
    title: "Przenosimy się na przyjęcie.",
    lead: "Obiad, toasty, a potem już tylko parkiet.",
    venue: { name: "Sala / dwór — nazwa", address: "ulica, miasto · parking na miejscu", mapUrl: "#" } satisfies Venue,
    image: "https://images.unsplash.com/photo-1677768061409-3d4fbd0250d1?w=1200&q=75&auto=format&fit=crop",
  },
  evening: [
    { time: "21:00", label: "Tort" },
    { time: "21:30", label: "Pierwszy taniec, drugi i trzeci" },
  ],
  contactNote: "Pytania: świadkowie — kontakt wkrótce",
  media: {
    introVideo: "https://videos.pexels.com/video-files/8538349/8538349-hd_1920_1080_25fps.mp4",
    introPoster: "https://images.unsplash.com/photo-1782786400179-ac3a4e8b1409?w=1600&q=70&auto=format&fit=crop",
    goldenHour: "https://images.unsplash.com/photo-1680884150120-c944d0143401?w=2200&q=75&auto=format&fit=crop",
    midnightVideo: "https://videos.pexels.com/video-files/19492425/19492425-hd_720_1280_30fps.mp4",
  },
};
