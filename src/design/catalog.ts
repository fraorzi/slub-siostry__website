export type Option = { id: string; name: string; note: string };
export type StyleOption = Option & { font: string; swatch: readonly [string, string, string, string] };

export const styles = [
  { id: "folia", name: "Folia", font: "--font-cormorant", swatch: ["oklch(98% 0.006 90)", "oklch(93.5% 0.03 82)", "oklch(30% 0.03 60)", "oklch(15% 0.012 70)"], note: "Obecny kierunek: kość słoniowa przechodzi w noc, złoto jak tłoczona folia, Cormorant." },
  { id: "papeteria", name: "Papeteria", font: "--font-fraunces", swatch: ["oklch(97.4% 0.011 84)", "oklch(94.6% 0.02 62)", "oklch(29% 0.045 262)", "oklch(17.5% 0.035 262)"], note: "Bawełniany papier, kaligrafia i ślepe tłoczenia. Wieczór w kolorze granatowego atramentu." },
  { id: "deco", name: "Art déco", font: "--font-poiret", swatch: ["oklch(94.5% 0.02 86)", "oklch(90% 0.032 82)", "oklch(19% 0.01 80)", "oklch(11% 0.006 80)"], note: "Krem, czerń i złoto jak z lat dwudziestych: wachlarze, promienie, ścięte narożniki." },
  { id: "galeria", name: "Galeria", font: "--font-bodoni", swatch: ["oklch(99.4% 0 0)", "oklch(96.6% 0.008 85)", "oklch(22% 0.004 80)", "oklch(12% 0.003 80)"], note: "Edytorial jak magazyn: biel, czerń, Bodoni kursywą. Złoto tylko w kresce." },
  { id: "kino", name: "Kino 35 mm", font: "--font-instrument", swatch: ["oklch(95.2% 0.024 78)", "oklch(89.5% 0.048 60)", "oklch(30% 0.045 222)", "oklch(14% 0.02 240)"], note: "Dzień jako film: ziarno kliszy, ciepłe kolory Portry, numery scen i timecode." },
] as const satisfies readonly StyleOption[];

export const sections = {
  intro: {
    label: "Wejście",
    anchor: "top",
    variants: [
      { id: "luk", name: "Łuk", note: "Obecny: wideo w łuku rozszerza się na cały ekran, imiona zjeżdżają do środka." },
      { id: "koperta", name: "Koperta", note: "Scroll otwiera kopertę z pieczęcią, zaproszenie wysuwa się i rośnie." },
      { id: "okno", name: "Okno w literach", note: "Wideo gra wewnątrz liter imion. Scroll wlatuje przez „&” w film." },
    ],
  },
  places: {
    label: "Ślub i przyjęcie",
    anchor: "h15",
    variants: [
      { id: "rozklad", name: "Rozkład", note: "Obecny: dwie godziny, tekst obok wideo i zdjęcia." },
      { id: "karty", name: "Karty", note: "Dwie karty-wkładki jak z zaproszenia, wlatują z boków." },
      { id: "trasa", name: "Trasa", note: "Złota trasa rysuje się scrollem od kościoła do sali, w tle poziomice mapy." },
    ],
  },
  seats: {
    label: "Twoje miejsce",
    anchor: "h17",
    variants: [
      { id: "plan", name: "Plan drukowany", note: "Obecny: plan sali z góry, przybliżenie do stołu." },
      { id: "sala", name: "Sala 3D", note: "Sala w rzucie izometrycznym ze świecami i girlandą. Kamera przelatuje do Twojego stołu." },
      { id: "winietki", name: "Winietka", note: "Twoje imię pisze się na winietce, karta obraca się i pokazuje numer stołu." },
      { id: "niebo", name: "Gwiazdozbiory", note: "Stoły jako konstelacje na nocnym niebie. Twoja gwiazda świeci najjaśniej." },
    ],
  },
  golden: {
    label: "Złota godzina",
    anchor: "h19",
    variants: [
      { id: "kadr", name: "Pełny kadr", note: "Obecny: zdjęcie na cały ekran z napisem." },
      { id: "zachod", name: "Zachód słońca", note: "Zdjęcie w tarczy słońca, które zachodzi i rośnie na cały ekran." },
      { id: "paski", name: "Żaluzje", note: "Kadr rozcięty na pionowe pasy, każdy płynie z inną prędkością." },
    ],
  },
  evening: {
    label: "Wieczór",
    anchor: "h21",
    variants: [
      { id: "kolumny", name: "Kolumny", note: "Obecny: dwie godziny obok siebie ze złotą kreską." },
      { id: "program", name: "Program", note: "Karta programu dnia jak z menu, z kropkowanymi prowadnicami." },
      { id: "poziomo", name: "W poziomie", note: "Godziny przesuwają się w poziomie, scroll prowadzi jak taśma." },
    ],
  },
  photos: {
    label: "Zdjęcia gości",
    anchor: "h22",
    variants: [
      { id: "polaroid", name: "Polaroidy", note: "Obecny: stos polaroidów, zdjęcie się wywołuje." },
      { id: "aparat", name: "Aparat jednorazowy", note: "Kultowa jednorazówka z licznikiem klatek, album jako stykówka z kliszy." },
      { id: "ciemnia", name: "Ciemnia", note: "Czerwone światło, zdjęcia schną na sznurku przypięte klamerkami." },
    ],
  },
  midnight: {
    label: "Północ",
    anchor: "h00",
    variants: [
      { id: "film", name: "Wideo", note: "Obecny: wideo zimnych ogni na całym ekranie." },
      { id: "iskry", name: "Zimne ognie", note: "Zimny ogień kreśli nieskończoność, gość może pisać palcem." },
      { id: "zegar", name: "Zegar", note: "Wskazówki dochodzą do północy razem ze scrollem i błyskają złotem." },
    ],
  },
  finale: {
    label: "Koniec",
    anchor: "h04",
    variants: [
      { id: "noc", name: "Noc", note: "Obecny: 03:00 i duże „Do zobaczenia.”" },
      { id: "swit", name: "Świt", note: "Noc przechodzi w świt, nad horyzontem wschodzi słońce." },
    ],
  },
} as const satisfies Record<string, { label: string; anchor: string; variants: readonly Option[] }>;

export type StyleId = (typeof styles)[number]["id"];
export type SectionKey = keyof typeof sections;
export type VariantOf<K extends SectionKey> = (typeof sections)[K]["variants"][number]["id"];
export type Design = { style: StyleId } & { [K in SectionKey]: VariantOf<K> };

export const sectionKeys = Object.keys(sections) as SectionKey[];

export const defaultDesign = Object.fromEntries([
  ["style", styles[0].id],
  ...sectionKeys.map((k) => [k, sections[k].variants[0].id]),
]) as Design;

export const DESIGN_COOKIE = "projekt";
export const DESIGN_PARAM = "projekt";

const has = (list: readonly Option[], id: string | null) => id !== null && list.some((o) => o.id === id);

export function parseDesign(raw: string | undefined | null): Design {
  const params = new URLSearchParams(raw ?? "");
  const style = params.get("style");
  const design: Record<string, string> = { style: has(styles, style) ? style! : defaultDesign.style };
  for (const k of sectionKeys) {
    const v = params.get(k);
    design[k] = has(sections[k].variants, v) ? v! : defaultDesign[k];
  }
  return design as Design;
}

export const serializeDesign = (design: Design) =>
  new URLSearchParams(Object.entries(design).filter(([k, v]) => v !== defaultDesign[k as keyof Design])).toString();
