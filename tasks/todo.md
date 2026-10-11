# Runda designu 3 (2026-10-04)

- [x] Złoto za dnia: mniejszy kontrast połysku, bez cienia pod tekstem
- [x] `btn-gold`: jasne błyszczące złoto, ciemny tekst
- [x] Usunięte złote ramki: miejsca, plan sali, upload, ramka zaproszenia
- [x] Pole z imieniem: pigułka, focus jako złota poświata + przebłysk; globalny focus w `@layer base`
- [x] Upload od nowa: stos polaroidów, „wywoływanie” zdjęcia, album z polaroidów
- [x] Weryfikacja: tsc, lint, build, 1440/375/320, upload 3 JPEG + 1 txt przez drop

## Review

- Przyczyna „kwadratowego focusu”: globalny `:focus-visible` poza warstwami nadpisywał `outline-none` z Tailwinda — przeniesiony do `@layer base`.
- Pliki testowe z uploadu usunięte.
