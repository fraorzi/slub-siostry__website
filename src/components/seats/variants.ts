// Wersje wyszukiwarki miejsca do porównania. Po wyborze zostaje jedna, reszta do usunięcia.
export const SEARCH_VARIANTS = { koperta: "Koperta", winietka: "Winietka", pieczec: "Pieczęć", zdanie: "Zdanie" } as const;
export type SearchVariant = keyof typeof SEARCH_VARIANTS;
export const SEARCH_PARAM = "koperta";

export const parseSearchVariant = (value: unknown): SearchVariant =>
  typeof value === "string" && value in SEARCH_VARIANTS ? (value as SearchVariant) : "koperta";
