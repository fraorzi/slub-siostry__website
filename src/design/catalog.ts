export type Option = { id: string; name: string; note: string };
export type StyleOption = Option & { font: string; swatch: readonly [string, string, string, string] };

export const styles = [
  { id: "folia", name: "Folia", font: "--font-cormorant", swatch: ["oklch(98% 0.006 90)", "oklch(93.5% 0.03 82)", "oklch(30% 0.03 60)", "oklch(15% 0.012 70)"], note: "Kość słoniowa przechodzi w noc, złoto jak tłoczona folia, Cormorant." },
  { id: "papeteria", name: "Papeteria", font: "--font-fraunces", swatch: ["oklch(97.4% 0.011 84)", "oklch(94.6% 0.02 62)", "oklch(29% 0.045 262)", "oklch(17.5% 0.035 262)"], note: "Bawełniany papier, kaligrafia i ślepe tłoczenia. Wieczór w kolorze granatowego atramentu." },
  { id: "deco", name: "Art déco", font: "--font-josefin", swatch: ["oklch(94.5% 0.02 86)", "oklch(90% 0.032 82)", "oklch(19% 0.01 80)", "oklch(11% 0.006 80)"], note: "Krem, czerń i złoto jak z lat dwudziestych: wachlarze, promienie, ścięte narożniki." },
  { id: "galeria", name: "Galeria", font: "--font-bodoni", swatch: ["oklch(99.4% 0 0)", "oklch(96.6% 0.008 85)", "oklch(22% 0.004 80)", "oklch(12% 0.003 80)"], note: "Edytorial jak magazyn: biel, czerń, Bodoni kursywą. Złoto tylko w kresce." },
  { id: "kino", name: "Kino 35 mm", font: "--font-instrument", swatch: ["oklch(95.2% 0.024 78)", "oklch(89.5% 0.048 60)", "oklch(30% 0.045 222)", "oklch(14% 0.02 240)"], note: "Dzień jako film: ziarno kliszy, ciepłe kolory Portry, numery scen i timecode." },
] as const satisfies readonly StyleOption[];

/** Kroje nagłówków dla stylu art déco. `weight` to grubość godzin i tytułów. */
export const decoFonts = [
  { id: "josefin", name: "Josefin Sans", font: "--font-josefin", weight: 200, note: "Najbliżej Poiret One, ale węższy: zera są owalne, nie okrągłe." },
  { id: "poiret", name: "Poiret One", font: "--font-poiret", weight: 400, note: "Pierwotny krój: szeroki, okrągłe zera." },
  { id: "yanone", name: "Yanone Kaffeesatz", font: "--font-yanone", weight: 200, note: "Wąski, inspirowany szyldami kawiarni z lat 20." },
  { id: "smooch", name: "Smooch Sans", font: "--font-smooch", weight: 200, note: "Najwęższy, wysokie proste zera." },
] as const satisfies readonly (Option & { font: string; weight: number })[];

export const sections = {
  intro: {
    label: "Wejście",
    anchor: "top",
    variants: [
      { id: "luk", name: "Łuk", note: "Wideo w łuku rozszerza się na cały ekran, imiona zjeżdżają do środka. Koperta przeszła do sali, okno w literach do ślubu." },
    ],
  },
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
  seats: {
    label: "Twoje miejsce",
    anchor: "h17",
    variants: [
      { id: "sala", name: "Sala 3D", note: "Wpisujesz imię na kopercie, wysuwa się karta z numerem stołu, kamera przelatuje do niego. Salę można przeciągać." },
      { id: "plan", name: "Plan drukowany", note: "Plan sali z góry, przybliżenie do stołu." },
      { id: "winietki", name: "Winietka", note: "Twoje imię pisze się na winietce, karta obraca się i pokazuje numer stołu." },
      { id: "niebo", name: "Gwiazdozbiory", note: "Stoły jako konstelacje na nocnym niebie. Twoja gwiazda świeci najjaśniej." },
    ],
  },
  golden: {
    label: "Złota godzina",
    anchor: "h19",
    variants: [
      { id: "paski", name: "Żaluzje", note: "Kadr rozcięty na pionowe pasy, każdy płynie z inną prędkością." },
      { id: "kadr", name: "Pełny kadr", note: "Zdjęcie na cały ekran z napisem." },
      { id: "zachod", name: "Zachód słońca", note: "Zdjęcie w tarczy słońca, które zachodzi i rośnie na cały ekran." },
    ],
  },
  evening: {
    label: "Wieczór",
    anchor: "h21",
    variants: [
      { id: "poziomo", name: "W poziomie", note: "Godziny przesuwają się w poziomie, scroll prowadzi jak taśma." },
      { id: "kolumny", name: "Kolumny", note: "Dwie godziny obok siebie ze złotą kreską." },
      { id: "program", name: "Program", note: "Karta programu dnia jak z menu, z kropkowanymi prowadnicami." },
    ],
  },
  photos: {
    label: "Zdjęcia gości",
    anchor: "h22",
    variants: [
      { id: "aparat", name: "Aparat jednorazowy", note: "Polaroidy na sznurku nad jednorazówką z licznikiem klatek, album jako stykówka z kliszy." },
      { id: "polaroid", name: "Polaroidy", note: "Stos polaroidów, zdjęcie się wywołuje." },
      { id: "ciemnia", name: "Ciemnia", note: "Czerwone światło, zdjęcia schną na sznurku przypięte klamerkami." },
    ],
  },
  midnight: {
    label: "Północ",
    anchor: "h00",
    variants: [
      { id: "iskry", name: "Zimne ognie", note: "Trzy zimne ognie powoli kreślą wzory, gość pisze czwartym (mysz albo palec)." },
      { id: "film", name: "Wideo", note: "Wideo zimnych ogni na całym ekranie." },
      { id: "zegar", name: "Zegar", note: "Wskazówki dochodzą do północy razem ze scrollem i błyskają złotem." },
    ],
  },
  finale: {
    label: "Koniec",
    anchor: "h04",
    variants: [
      { id: "swit", name: "Świt", note: "Po wejściu na ekran noc sama, powoli przechodzi w świt i wschodzi słońce." },
      { id: "noc", name: "Noc", note: "03:00 i duże „Do zobaczenia.”" },
    ],
  },
} as const satisfies Record<string, { label: string; anchor: string; variants: readonly Option[] }>;

export type StyleId = (typeof styles)[number]["id"];
export type DecoFontId = (typeof decoFonts)[number]["id"];
export type SectionKey = keyof typeof sections;
export type VariantOf<K extends SectionKey> = (typeof sections)[K]["variants"][number]["id"];
export type Design = { style: StyleId; decoFont: DecoFontId } & { [K in SectionKey]: VariantOf<K> };

export const sectionKeys = Object.keys(sections) as SectionKey[];

export const defaultDesign = Object.fromEntries([
  ["style", styles[0].id],
  ["decoFont", decoFonts[0].id],
  ...sectionKeys.map((k) => [k, sections[k].variants[0].id]),
]) as Design;

export const DESIGN_COOKIE = "projekt";
export const DESIGN_PARAM = "projekt";

const has = (list: readonly Option[], id: string | null) => id !== null && list.some((o) => o.id === id);

export function parseDesign(raw: string | undefined | null): Design {
  const params = new URLSearchParams(raw ?? "");
  const style = params.get("style");
  const decoFont = params.get("decoFont");
  const design: Record<string, string> = {
    style: has(styles, style) ? style! : defaultDesign.style,
    decoFont: has(decoFonts, decoFont) ? decoFont! : defaultDesign.decoFont,
  };
  for (const k of sectionKeys) {
    const v = params.get(k);
    design[k] = has(sections[k].variants, v) ? v! : defaultDesign[k];
  }
  return design as Design;
}

export const serializeDesign = (design: Design) =>
  new URLSearchParams(Object.entries(design).filter(([k, v]) => v !== defaultDesign[k as keyof Design])).toString();
