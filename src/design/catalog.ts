export type Option = { id: string; name: string; note: string };

/**
 * Sekcje, w których wybór jeszcze trwa. Rozstrzygnięte (styl Folia, wejście Łuk, Sala 3D, Żaluzje, wieczór w poziomie,
 * aparat, zimne ognie, świt) są wpięte na stałe w page.tsx, a ich alternatywy usunięte.
 */
export const sections = {
  places: {
    label: "Ślub i przyjęcie",
    anchor: "h15",
    variants: [
      { id: "tak", name: "„Tak” w literach", note: "Wideo z ceremonii gra w wielkim „TAK”, scroll wlatuje przez literę w dzień ślubu. Dalej rozkład." },
      { id: "rozklad", name: "Rozkład", note: "Dwie godziny, tekst obok wideo i zdjęcia." },
      { id: "karty", name: "Karty", note: "Dwie karty-wkładki jak z zaproszenia, wlatują z boków." },
      { id: "trasa", name: "Mapa", note: "Przystanki naprzemiennie na tle poziomic mapy." },
    ],
  },
} as const satisfies Record<string, { label: string; anchor: string; variants: readonly Option[] }>;

export type SectionKey = keyof typeof sections;
export type VariantOf<K extends SectionKey> = (typeof sections)[K]["variants"][number]["id"];
export type Design = { [K in SectionKey]: VariantOf<K> };

export const sectionKeys = Object.keys(sections) as SectionKey[];

export const defaultDesign = Object.fromEntries(sectionKeys.map((k) => [k, sections[k].variants[0].id])) as Design;

export const DESIGN_COOKIE = "projekt";
export const DESIGN_PARAM = "projekt";

const has = (list: readonly Option[], id: string | null) => id !== null && list.some((o) => o.id === id);

export function parseDesign(raw: string | undefined | null): Design {
  const params = new URLSearchParams(raw ?? "");
  const design: Record<string, string> = {};
  for (const k of sectionKeys) {
    const v = params.get(k);
    design[k] = has(sections[k].variants, v) ? v! : defaultDesign[k];
  }
  return design as Design;
}

export const serializeDesign = (design: Design) =>
  new URLSearchParams(Object.entries(design).filter(([k, v]) => v !== defaultDesign[k as keyof Design])).toString();
