# Runda designu 5 — pracownia (2026-10-11)

- [x] Katalog stylów i wariantów + panel „Projekt” (ciastko `projekt`, link `?projekt=`)
- [x] 5 stylów strony: Folia, Papeteria, Art déco, Galeria, Kino 35 mm
- [x] Warianty sekcji: wejście ×3, miejsca ×3, plan sali ×4, złota godzina ×3, wieczór ×3, zdjęcia ×3, północ ×3, koniec ×2
- [x] Media: `pnpm media` (720p/1080p, plakat, hash w nazwie, cache na rok), `LoopVideo`
- [x] Miniatury zdjęć gości (`sharp`), album porcjami
- [x] Poprawki: resize na telefonie, blokada scrolla pod easter eggiem, fokus po „Pokaż całą salę”, przewinięcie do planu, hydracja SVG
- [x] Weryfikacja: tsc, lint, build, zrzuty 1440 i 390 wszystkich wariantów, przełączanie w panelu

## Review

- Pexels i Unsplash są zablokowane w sieci sesji w chmurze: `pnpm media` sprawdzone na lokalnych plikach testowych, prawdziwe pobranie trzeba uruchomić lokalnie.
- Chromium z Playwrighta nie ma H.264, więc w testach wideo spada na drugie źródło; w Chrome/Safari gra 720p na telefonie.
