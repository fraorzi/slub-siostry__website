// Wersje koperty z wyszukiwarką miejsca do porównania. Po wyborze zostaje jedna, reszta do usunięcia.
export const SEARCH_VARIANTS = { obecna: "Obecna", adres: "Adres", okienko: "Okienko", bilecik: "Bilecik" } as const;
export type SearchVariant = keyof typeof SEARCH_VARIANTS;
export const SEARCH_PARAM = "koperta";

export const parseSearchVariant = (value: unknown): SearchVariant =>
  typeof value === "string" && value in SEARCH_VARIANTS ? (value as SearchVariant) : "obecna";
