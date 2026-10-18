# Brief — strona ślubu siostry

Stan na 2026-10-03.

## Zakres (od użytkownika)

Kilka podstron, nie więcej. Obowiązkowo:

1. **Upload zdjęć przez gości.** Każdy gość wrzuca zdjęcia z wesela, później składamy z nich całość (album, film, kolaż — do ustalenia).
2. **Mapa siedzeń.** Gość sprawdza, przy którym stole siedzi, na planie sali. Rzeczywisty układ stołów przyjdzie później.
3. **Easter egg.** Zabawny żart brata dla siostry.

## Gust użytkownika (z projektu `../db-tapety__redesign`)

Pełne werdykty: `../db-tapety__redesign/docs/HANDOFF.md` § „Gust użytkownika”. W skrócie:
- **Chce:** minimalizm z płynnym ruchem przy scrollu, wideo, nowoczesną technikę, kompozycje bez sztywnej siatki.
- **Odrzuca:** szablony i „WordPressowy” grid, skaczący header, slider w hero, liczniki, automatyczne marquee, rysowane zastępniki zamiast zdjęć.

## Werdykty — runda 1

- Japonia (Awwwards 2025): nie podoba się.
- Veley / Ross: najbliżej — klimat „przed” ślubem (narzeczeńsko, nie reportaż ślubny). Zdjęcia ze ślubu jako **drugi etap strony** (po weselu).
- Michelle & Tonye: średnia. **Bez nawigacji** — nie pasuje do tego typu strony.
- Le Sirenuse, Partiful, Riley & Grey: odpadają (reklama miejsca / platforma, a nie strona wydarzenia).
- Kolory: ślubne — biel, złoto.
- Prośba: coś bardziej oryginalnego + makieta do odniesienia.

## Koncepcja — „Dzień godzina po godzinie”

Przyjęta do dalszej pracy 2026-10-04: makieta HTML przeniesiona do Next.js i usunięta. Strona jest dniem ślubu; scroll = upływ czasu 14:00 → 04:00, tło przechodzi kość słoniowa → szampan → zmierzch → noc ze złotem. Zero nawigacji; jedyny element stały to zegar (klik = plan dnia).

- Wejście: „Ona & On” po bokach łuku z wideo (para w polu), łuk rozszerza się scrollem na cały ekran.
- 15:00 ślub, 16:30 przyjęcie — miejsca jako placeholdery.
- 17:00 „Twoje miejsce” — wyszukiwarka gościa + plan sali SVG; stół świeci na złoto, lista sąsiadów. Dane przykładowe.
- 19:30 złota godzina, 21:00 tort / pierwszy taniec — godziny przykładowe.
- 22:00 „Wasze zdjęcia” — 3 etapy (przed / w dniu / po) liczone z daty ślubu, upload przez API, ściana zdjęć.
- 00:00 północ (wideo zimnych ogni), 03:00 miejsce na easter egg, „Do zobaczenia.”
- Easter egg: 5 szybkich kliknięć w złoty „&” na wejściu otwiera ekran-niespodziankę. **Ukryty celowo** — bez podpowiedzi na stronie, bez kursora-rączki, bez reakcji na pojedyncze kliknięcie, poza nawigacją klawiaturą; brat zdradza go osobiście. Treść do ustalenia.

Media: Unsplash i Pexels (licencje darmowe), docelowo zdjęcia pary.

## Runda designu 1 (2026-10-04)

Uwagi użytkownika: łuk wideo psuł zaokrąglenie i drgał; pole z imieniem ma być głównym elementem sekcji z ładnym focusem; złoto jak prawdziwa folia odbijająca światło; propozycje fontów; mniej nudnych elementów, lepszy flow.

Wprowadzone: złota folia (`.foil`, `.foil-bg`, `.foil-rule`, połysk zależny od scrolla), złota nić dnia z koralikiem, karty miejsc z kalendarzem, wieczór w poziomie, kinowa złota godzina, przycisk-migawka, podpowiedź do easter egga o 03:00, zoom planu sali.

Fonty do wyboru (wszystkie z polskimi znakami; przełącznik „Aa” w prawym dolnym rogu, tylko w dev): Bodoni Moda (obecny), Cormorant Garamond, Gilda Display, Instrument Serif, Marcellus. Po wyborze usunąć pozostałe z `layout.tsx` i `FontLab`.

## Runda designu 2 (2026-10-04)

Wybrany font: **Cormorant Garamond** (pozostałe usunięte). Uwagi: złoto za ciemne — za dnia jaśniejsze, „białe złoto w słońcu”, wieczorem cieplejsze; nieczytelny tekst na złotych przyciskach; usunąć „plan dnia” z prawego górnego rogu i podpowiedź „Przewiń…”; ładniejsze „&” (SVG); stan pełnoekranowego wideo wyglądał jak zwykłe hero; poprawić plan sali i upload.

Wprowadzone: paleta folii zależna od pory dnia; przyciski `btn-gold` (ciemne tło, złoty napis); „&” jako SVG (kursywa Cormorant + rysowane ozdobniki); po rozwinięciu wideo imiona zjeżdżają do środka w kompozycję zaproszenia w podwójnej złotej ramce; plan sali jak drukowany plan (krzesła wokół stołów, parkiet, wejście, klikalne stoły, wyciszanie reszty sali); upload z przeciąganiem plików, kolejką miniatur i statusem każdego pliku.

## Runda designu 3 (2026-10-04)

Uwagi: za mocne rozświetlenie złota i cienie pod tekstem za dnia; upload do kompletnego redesignu; główne przyciski jako jasne błyszczące złoto z czarnym tekstem; bez kwadratowych złotych ramek grupujących elementy; nowe pole z imieniem i focus bez kwadratowej ramki.

Wprowadzone: spokojniejsza paleta dnia bez cienia; `btn-gold` jasnozłoty z ciemnym tekstem; usunięte wszystkie złote ramki (także podwójna ramka zaproszenia na wejściu); miejsca jako blok typograficzny z krótką złotą kreską; pole wyszukiwania jako „pigułka” ze złotą poświatą i przebłyskiem przy focusie; plan sali jako arkusz papieru z cieniem; upload jako stos polaroidów — zdjęcie „wywołuje się” podczas wysyłania, album gości z przechylonych polaroidów.

## Runda designu 4 (2026-10-04)

Polaroidy ładniejsze (faktura papieru, połysk zdjęcia, odręczne podpisy Caveat, w tylnych polaroidach ostatnie zdjęcia gości); usunięte podpowiedzi do easter egga i „Wróć na górę” z 03:00.

## Decyzje do podjęcia przed wdrożeniem

1. **Hosting i magazyn zdjęć.** Teraz zdjęcia lądują w `.uploads/` na dysku serwera — na Vercelu to zniknie. Propozycja: Vercel + Cloudflare R2 (tani transfer, upload bezpośrednio z telefonu przez podpisany URL) albo Vercel Blob (najmniej konfiguracji).
2. **Wideo od gości.** Upload przyjmuje tylko zdjęcia (JPEG, PNG, WebP, HEIC), do 25 MB. Filmy wymagają magazynu z punktu 1.
3. **HEIC z iPhone'ów** nie wyświetla się w Chrome — do rozważenia konwersja po stronie serwera.
4. **Moderacja** zdjęć przed pokazaniem w galerii „po weselu” — czy potrzebna.

## Benchmarki — runda 1 (archiwum)

Wygląd:

| Strona | Co pokazuje |
| --- | --- |
| [Zaproszenie ślubne 2025, Japonia](https://wedding20251012-ny.studio.site/) | nominacja Awwwards 2025; zdjęcie pary + odważna limonkowa typografia, magazynowo i lekko szalenie |
| [Veley / Ross](https://veleyross.wedding/) | Site of the Day Awwwards 2019; cisza, rysowany pejzaż, narracja scrollem |
| [Michelle & Tonye](https://www.michelleandtonye.com/) | wyróżnienie Awwwards 2021; klasyka: duże zdjęcie pary, pismo odręczne |
| [Le Sirenuse](https://sirenuse.it/en/) | hotel w Positano; ciepło, ilustracja, śródziemnomorska elegancja |
| [Partiful](https://partiful.com) | zaproszenia na imprezy; zabawa, energia, nowoczesny UX dla gości |
| [Riley & Grey](https://www.rileygrey.com/wedding-websites) | najpopularniejszy „premium” szablon stron ślubnych — punkt odniesienia, od którego chcemy odejść |

Funkcje:

| Funkcja | Wzór | Wniosek |
| --- | --- | --- |
| Upload zdjęć | [GuestCam](https://guestcam.co/use-cases/weddings), Knipsmig, Wedding Arrivals | gość skanuje QR na stole → upload z przeglądarki, bez aplikacji i konta. Do decyzji: własny upload (np. storage S3/R2) czy gotowa usługa. |
| Mapa siedzeń | — | wpisz imię → podświetlony stół na planie sali + kto siedzi obok. Plan sali od użytkownika. |
| Easter egg | — | potrzebny wewnętrzny żart rodzinny od użytkownika. |

## Otwarte pytania

1. Werdykt do benchmarków (jak przy tapetach: co się podoba, co nie).
2. Data ślubu — wyznacza termin oddania strony.
3. Czy strona to niespodzianka od brata, czy narzędzie pary (zaproszenia, info dla gości)? Od tego zależy, kto ją widzi przed ślubem i gdzie schować żart.
4. Imiona pary, miejsce, liczba gości, język (czy są goście zagraniczni).
5. Pomysł na żart / wspólne wspomnienie z siostrą.
6. Co ma powstać ze zdjęć gości: album online, film, kolaż, wydruk.

## Runda designu 5 — pracownia (2026-10-11)

Prośba: kilka propozycji redesignu każdej sekcji i całego stylu strony, do przeklikania w panelu; szczególnie plan sali. Strona ma działać płynnie na telefonie bez utraty jakości animacji.

Wprowadzone: panel „Projekt” (prawy dolny róg; dev, podglądy Vercela albo `DESIGN_LAB=1`) z 5 stylami strony i 2–4 wariantami każdej sekcji. Przycisk „Kopiuj link” daje adres z zestawem.

| Sekcja | Warianty |
| --- | --- |
| Styl strony | Folia (obecny), Papeteria, Art déco, Galeria, Kino 35 mm |
| Wejście | Łuk (obecny), Koperta, Okno w literach |
| Ślub i przyjęcie | Rozkład (obecny), Karty, Trasa |
| Twoje miejsce | Plan drukowany (obecny), Sala 3D, Winietka, Gwiazdozbiory |
| Złota godzina | Pełny kadr (obecny), Zachód słońca, Żaluzje |
| Wieczór | Kolumny (obecny), Program, W poziomie |
| Zdjęcia gości | Polaroidy (obecny), Aparat jednorazowy, Ciemnia |
| Północ | Wideo (obecny), Zimne ognie, Zegar |
| Koniec | Noc (obecny), Świt |

Wydajność: wideo ładuje się dopiero przed wejściem na ekran i gra tylko na ekranie (telefon dostaje 720p), połysk folii liczy CSS (`animation-timeline: scroll()`), animacje opierają się na `transform`/`opacity`, album gości pokazuje miniatury porcjami po 24.

Poprawione błędy: przebudowa animacji wejścia przy każdym chowaniu paska adresu na telefonie; przewijanie strony pod otwartym easter eggiem; klawiatura wyskakująca po „Pokaż całą salę” na telefonie; brak przewinięcia do planu po wyborze osoby na telefonie; wyciek pamięci podglądów uploadu; pełnowymiarowe zdjęcia (3–8 MB) w albumie.

### Media

- Wszystkie zdjęcia i wideo pochodzą z Pexels i Unsplash. Licencje obu serwisów pozwalają na darmowe użycie, także bez podpisu autora i z modyfikacjami; zabronione jest m.in. sprzedawanie niezmienionych kopii i pokazywanie rozpoznawalnych osób w obraźliwym kontekście. Prywatna strona za hasłem mieści się w licencji, także wideo z północy (Pexels 19492425). Pexels nie gwarantuje zgód osób z kadru, więc docelowo lepiej podmienić je na własne nagranie.
- Do czasu `pnpm media` pliki idą prosto z CDN Pexels/Unsplash: wideo intro to plik 1920×1080 bez wersji na telefon. Po `pnpm media` wszystko jest lokalne, skompresowane i z długim cache.

## Decyzje do podjęcia — pracownia

1. Styl strony i wariant każdej sekcji (panel „Projekt”). Po wyborze reszta wariantów i krojów jest usuwana.
2. Prawdziwe zdjęcia i wideo pary: podmiana w `scripts/media-sources.json` (ścieżka do pliku albo URL) + `pnpm media`.

## Runda designu 6 (2026-10-11)

Wybory: krój art déco węższy (Josefin Sans cienki domyślnie, w panelu też Poiret One, Yanone Kaffeesatz, Smooch Sans); Sala 3D, Żaluzje, Wieczór w poziomie, Aparat, Zimne ognie, Świt jako domyślne warianty.

Wprowadzone: koperta przeniesiona z wejścia do sali (wpisujesz imię na kopercie, klapka się otwiera, karta pokazuje stół i sąsiadów); okno w literach przeniesione do ślubu jako wielkie „TAK” z wideo ceremonii; trasa zamiast złotej nici, ciągła przez całą stronę z przystankami na godzinach; salę 3D można przeciągać; etykieta pary młodej leży na podłodze przy ich stole; czytelniejszy napis na żaluzjach; wieczór: kreski wyrównane, na końcu taśmy 21:30 znika; polaroidy na sznurku nad aparatem; trzy wolne zimne ognie i czwarty pod kursorem; świt rozjaśnia się sam po wejściu na ekran, mniejszy odstęp do stopki; poprawione artefakty w rogach okrągłych zdjęć.

## Runda designu 7 (2026-10-11)

Decyzje: styl strony zostaje **Folia** (Cormorant), bez art déco. Wybrane na stałe: wejście Łuk, Sala 3D z kopertą, Żaluzje, wieczór w poziomie, aparat z polaroidami, zimne ognie, świt. Pozostałe warianty, style i ich kroje usunięte z kodu. **Do decyzji zostaje tylko sekcja „Ślub i przyjęcie”** („Tak” w literach, Rozkład, Karty, Mapa).

Wprowadzone: świt gra sam, gdy sekcja jest na ekranie, a po wyjechaniu z niej wraca do nocy; trasa płynie marginesem i między sekcjami przechodzi łukiem na drugą stronę; koperta ma tylko skosy z górnych rogów; usunięta podpowiedź pod kopertą.

## Runda designu 8 (2026-10-11)

Decyzja: „Ślub i przyjęcie” = „Tak” w literach, ale bez wlatywania w film. Wielkie „TAK” z wideo ceremonii w środku zmniejsza się scrollem i ląduje na słowie „tak” w nagłówku „Mówimy sobie „tak””, wokół pojawia się reszta sekcji (opis, miejsce, wideo w łuku), potem strona przewija się dalej. Wszystkie sekcje wybrane: panel „Projekt” i pozostałe warianty usunięte.

## Runda designu 9 (2026-10-12)

Uwagi: usunąć trasę dnia; „TAK” ma zostać tym samym krojem i wielkimi literami, a pod koniec wideo w literach płynnie ciemnieje do czarnego; przy pierwszym ładowaniu wejście miga (inny kadr zamiast filmu, tekst pojawia się i znika); koperta z polem do przeprojektowania, kilka wersji do porównania.

Wprowadzone: trasa dnia usunięta. „TAK” ląduje w nagłówku jako „TAK” tym samym krojem (grubość 600), wideo w literach ciemnieje do koloru tekstu, podmiana na nagłówek niewidoczna. Wejście: plakat Unsplash (inny kadr) usunięty, plakatem jest pierwsza klatka filmu z `pnpm media`; wejście czeka pod zasłoną w kolorze tła na fonty i pierwszą klatkę (po 0,6 s pojawia się pulsująca złota kreska, najdłużej 4 s), potem płynnie wjeżdża. Wideo bez plakatu pojawia się płynnie po załadowaniu pierwszej klatki.

Wyszukiwarka miejsca: po dwóch rundach wersji (najpierw winietka, pieczęć i zdanie zamiast koperty, potem 4 wersje koperty) decyzja: jedna klasyczna koperta ślubna od nowa. Zamknięta, z lakiem i napisem „Sprawdź, gdzie siedzisz”; po kliknięciu otwiera się klapka (podszewka w delikatną złotą kratkę), wychodzi kartka w stylu zaproszenia („Ona i On”, „Twoje miejsce”), na niej pole na imię i nazwisko, a po wyborze numer stołu i sąsiedzi. Kliknięcie stołu na sali też otwiera kopertę. Przełącznik wersji usunięty.

## Decyzje do podjęcia — runda 9

1. Uruchomić `pnpm media`, żeby wejście miało plakat z pierwszej klatki (bez tego czeka na samo wideo).

## Runda designu 10: pod miejsce wesela (2026-10-18)

Miejsce przyjęcia: **Miodowy Zakątek**, Prosta 31A, 96-325 Słabomierz (gm. Radziejowice, ok. 35 km od Warszawy). Prośba: redesign pod estetykę miejsca (zieleń, rośliny) i plan sali bliższy prawdziwemu.

Strona miejsca (miodowy-zakatek.com) jest zablokowana przez politykę sieci środowiska, więc zdjęć i rzutu nie dało się obejrzeć. Z opisów w katalogach weselnych: dwie połączone sale, bankietowa i przeszklona taneczna z widokiem na ogród; stoły okrągłe do 94 osób, prostokątne do 110; ogród z sosnami i brzozami, klimat rustykalny / boho, jasne wnętrza; ślub w plenerze, namiot, strefa chillout.

Wprowadzone:
- Paleta: len i szałwia za dnia, sosnowa zieleń o zmierzchu, leśna czerń w nocy; złota folia zostaje (miód w nazwie miejsca). Podszewka koperty szałwiowa w złotą kratkę.
- Cień gałęzi sosny i brzozy za dnia (jak słońce przez przeszklenie), delikatnie się kołysze; znika wieczorem.
- Sala 3D jako rzut Miodowego Zakątka: sala bankietowa z 8 okrągłymi stołami w trzech rzędach i stołem pary pod ścianą z lampkami, przeszklona sala taneczna z parkietem, wokół ogród z sosnami i brzozami widocznymi przez szkło i nad ścianą; na stołach zielone wianki wokół świec.
- Przyjęcie o 16:30: nazwa i adres miejsca, „Jak dojechać” prowadzi do Map Google.

## Decyzje do podjęcia — runda 10

1. Oficjalny rzut sali od Miodowego Zakątka (albo zdjęcie planu): wymiary, położenie wejścia, stołu pary, DJ-a i wyjścia do ogrodu. Obecny układ jest przybliżony.
2. Liczba stołów i gości przy stole (sala mieści do 94 osób przy okrągłych stołach; teraz 8 przykładowych stołów po 6 osób).
3. Czy ślub też jest w Miodowym Zakątku (plener w ogrodzie)? Wtedy sekcja 15:00 dostaje to samo miejsce.
4. Adres do potwierdzenia: katalogi podają Prosta 31A albo Słabomierz 29.
5. Zdjęcia miejsca (sala, ogród) zamiast zdjęć ze stocku w sekcji przyjęcia: do `scripts/media-sources.json`.
