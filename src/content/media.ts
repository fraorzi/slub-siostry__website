// Plik generuje `pnpm media` (scripts/media.mjs). Bez uruchomienia skryptu media idą z Pexels i Unsplash.

export type VideoSource = { mobile: string; desktop: string; poster?: string };

export const media = {
  intro: {
    mobile: "https://videos.pexels.com/video-files/8538349/8538349-hd_1920_1080_25fps.mp4",
    desktop: "https://videos.pexels.com/video-files/8538349/8538349-hd_1920_1080_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1782786400179-ac3a4e8b1409?w=1600&q=70&auto=format&fit=crop",
  },
  ceremony: {
    mobile: "https://videos.pexels.com/video-files/29918276/12841510_720_1280_25fps.mp4",
    desktop: "https://videos.pexels.com/video-files/29918276/12841510_720_1280_25fps.mp4",
  },
  midnight: {
    mobile: "https://videos.pexels.com/video-files/19492425/19492425-hd_720_1280_30fps.mp4",
    desktop: "https://videos.pexels.com/video-files/19492425/19492425-hd_720_1280_30fps.mp4",
  },
  reception: "https://images.unsplash.com/photo-1677768061409-3d4fbd0250d1?w=1200&q=75&auto=format&fit=crop",
  goldenHour: "https://images.unsplash.com/photo-1680884150120-c944d0143401?w=2200&q=75&auto=format&fit=crop",
} satisfies Record<string, VideoSource | string>;
