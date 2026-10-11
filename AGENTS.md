# Strona ślubu siostry

Strona na ślub siostry właściciela repo, robiona przez niego (brata). Etap: **pracownia** — koncepcja „dzień godzina po godzinie” w Next.js 16 + Tailwind 4 + GSAP/Lenis. Styl (Folia) i większość sekcji wybrane; panel porównuje już tylko sekcje, w których wybór trwa.

Brief, werdykty, koncepcja i otwarte pytania: [`docs/BRIEF.md`](docs/BRIEF.md). Przeczytaj przed każdą decyzją projektową.

## Gdzie co jest

- Treści (imiona, data, miejsca, plan dnia): `src/content/wedding.ts`. Lista gości i stoły: `src/data/seating.ts`.
- Media: źródła w `scripts/media-sources.json`, `pnpm media` (wymaga ffmpeg) pobiera je, kompresuje do `public/media` (wideo 720p/1080p + plakat) i przepisuje `src/content/media.ts`. Wideo zawsze przez `LoopVideo` (leniwe ładowanie, pauza poza ekranem).
- Pracownia projektu: w `src/design/catalog.ts` są tylko sekcje, w których wybór jeszcze trwa (teraz: ślub i przyjęcie); panel `src/components/lab/DesignLab.tsx` (dev i podglądy Vercela zawsze, produkcja z `DESIGN_LAB=1`). Wybór siedzi w ciastku `projekt`; link `/?projekt=…` je ustawia. Rozstrzygnięte sekcje są wpięte na stałe w `page.tsx`, a ich alternatywy usunięte.
- Sekcja jest „godziną”, gdy ma `data-time` i `data-theme`; `Choreography` przełącza porę dnia, gdy sekcja wchodzi na środek ekranu.
- Trasa dnia (`RouteThread`) zastąpiła złotą nić: płynie marginesem przez kolejne sekcje i na ich granicy miękkim łukiem przechodzi na drugą stronę (lewo, prawo, lewo…). Kształt i przystanki liczy z pozycji sekcji `[data-time]` i `.hour-time`, które muszą być bezpośrednimi dziećmi kontenera trasy w `page.tsx`.
- Złoto to zawsze folia: klasy `foil` (tekst) i `foil-bg` (tło, linie) z `globals.css`; połysk przesuwa się ze scrollem (`--shine` ustawiane w `Choreography`). Główne przyciski: `btn-gold` — jasne błyszczące złoto z ciemnym tekstem.
- Grupowanie treści: odstępami, typografią i krótką złotą kreską — bez złotych ramek wokół bloków (użytkownik ich nie chce). Focus pól: miękka złota poświata, nie obrys.
- Zmienne pory dnia (`--bg`, `--fg`, paleta folii) żyją wyłącznie na `body[data-theme]`; `data-theme` na sekcji to tylko sygnał. Za dnia folia jest jasna (białe złoto w słońcu), wieczorem cieplejsza.
- Klasy folii i `btn-gold` siedzą w `@layer components`, globalny `:focus-visible` w `@layer base` — muszą tam zostać, inaczej nadpisują utility Tailwinda (np. `absolute`).
- Font nagłówków: Cormorant Garamond (`--font-display`); tekst: General Sans; odręczne podpisy na polaroidach: Caveat (`font-hand`).
- Easter egg (5× „&” w `Intro`) ma pozostać nieodkrywalny: żadnych podpowiedzi w treści, kursora-rączki ani reakcji na pojedyncze kliknięcie.
- Etap sekcji zdjęć (`before` / `day` / `after`) liczy `src/lib/stage.ts` z `WEDDING_DAY`. Podgląd w dev: `/?etap=przed|dzien|po`.
- Dostęp: `SITE_KEY` + `src/proxy.ts`; gość wchodzi linkiem `/?k=…` (np. z QR) albo hasłem na `/wejscie`. API sprawdza to samo ciastko.
- Zdjęcia gości: `src/lib/photos.ts` zapisuje do `.uploads/` (oryginał + miniatura WebP z `sharp` do albumu) — działa tylko lokalnie. Produkcja wymaga magazynu obiektowego (decyzja w BRIEF). Logika uploadu wspólna dla wariantów: `src/components/photos/usePhotoUpload.tsx`.
- Wartości liczone z `Math.sin/cos` w JSX zaokrąglaj: Node i przeglądarka różnią się na ostatniej cyfrze, co psuje hydrację.

## Zasady

- Treści strony i rozmowa po polsku.
- Proces: prawdziwe benchmarki → akceptacja użytkownika → makieta → stack. Nowy kierunek wizualny wraca do benchmarków.
- Zdjęcia i wideo: prawdziwe, z licencją (Unsplash, Pexels) jako zastępstwo, docelowo zdjęcia pary.
- Imiona, data, miejsce, lista gości i plan sali tylko od użytkownika; do tego czasu widoczny placeholder.
- Dane gości (imiona, przypisanie do stołów, zdjęcia) to dane osobowe: dostęp za hasłem lub linkiem z tokenem, bez indeksowania w wyszukiwarkach.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
