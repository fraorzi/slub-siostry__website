import type { ComponentType } from "react";
import { Choreography } from "@/components/Choreography";
import { EveningColumns } from "@/components/evening/EveningColumns";
import { EveningProgram } from "@/components/evening/EveningProgram";
import { EveningScroll } from "@/components/evening/EveningScroll";
import { FinaleDawn } from "@/components/finale/FinaleDawn";
import { FinaleNight, Late } from "@/components/finale/FinaleNight";
import { GoldenBlinds } from "@/components/golden/GoldenBlinds";
import { GoldenFrame } from "@/components/golden/GoldenFrame";
import { GoldenSunset } from "@/components/golden/GoldenSunset";
import { Hour, HourTime, HourTitle, Lead } from "@/components/hour";
import { IntroArch } from "@/components/intro/IntroArch";
import { DesignLab } from "@/components/lab/DesignLab";
import { MidnightClock } from "@/components/midnight/MidnightClock";
import { MidnightFilm } from "@/components/midnight/MidnightFilm";
import { MidnightSparklers } from "@/components/midnight/MidnightSparklers";
import { PhotosCamera } from "@/components/photos/PhotosCamera";
import { PhotosDarkroom } from "@/components/photos/PhotosDarkroom";
import { PhotosPolaroid } from "@/components/photos/PhotosPolaroid";
import { PlacesCards } from "@/components/places/PlacesCards";
import { PlacesRoute } from "@/components/places/PlacesRoute";
import { PlacesSplit, PlacesTak } from "@/components/places/PlacesSplit";
import { RouteThread } from "@/components/RouteThread";
import { SeatsCard } from "@/components/seats/SeatsCard";
import { SeatsHall } from "@/components/seats/SeatsHall";
import { SeatsPlan } from "@/components/seats/SeatsPlan";
import { SeatsSky } from "@/components/seats/SeatsSky";
import { wedding } from "@/content/wedding";
import { tables } from "@/data/seating";
import { serializeDesign, type VariantOf } from "@/design/catalog";
import { labEnabled, readDesign } from "@/design/server";
import { listPhotos, type Photo } from "@/lib/photos";
import { previewStage, stageFor, type Stage } from "@/lib/stage";

type Table = typeof tables;

const INTRO: Record<VariantOf<"intro">, ComponentType> = { luk: IntroArch };
const PLACES: Record<VariantOf<"places">, ComponentType> = { tak: PlacesTak, rozklad: () => <PlacesSplit />, karty: PlacesCards, trasa: PlacesRoute };
const SEATS: Record<VariantOf<"seats">, ComponentType<{ tables: Table }>> = { plan: SeatsPlan, sala: SeatsHall, winietki: SeatsCard, niebo: SeatsSky };
const GOLDEN: Record<VariantOf<"golden">, ComponentType> = { kadr: GoldenFrame, zachod: GoldenSunset, paski: GoldenBlinds };
const EVENING: Record<VariantOf<"evening">, ComponentType> = { kolumny: EveningColumns, program: EveningProgram, poziomo: EveningScroll };
const PHOTOS: Record<VariantOf<"photos">, ComponentType<{ stage: Stage; initial: Photo[] }>> = { polaroid: PhotosPolaroid, aparat: PhotosCamera, ciemnia: PhotosDarkroom };
const MIDNIGHT: Record<VariantOf<"midnight">, ComponentType> = { film: MidnightFilm, iskry: MidnightSparklers, zegar: MidnightClock };
const FINALE: Record<VariantOf<"finale">, ComponentType> = { noc: FinaleNight, swit: FinaleDawn };

export default async function Home({ searchParams }: PageProps<"/">) {
  const stage = previewStage((await searchParams).etap) ?? stageFor(new Date(), wedding.weddingDay);
  const photos = stage === "before" ? [] : await listPhotos();
  const design = await readDesign();

  const Intro = INTRO[design.intro];
  const Places = PLACES[design.places];
  const Seats = SEATS[design.seats];
  const Golden = GOLDEN[design.golden];
  const Evening = EVENING[design.evening];
  const Photos = PHOTOS[design.photos];
  const Midnight = MIDNIGHT[design.midnight];
  const Finale = FINALE[design.finale];

  return (
    <>
      <Choreography key={serializeDesign(design)} />
      <main id="top">
        <Intro />

        <div className="relative">
          <RouteThread />

          <Places />

          <Hour id="h17" time="17:00" theme="day">
            <HourTime>17:00</HourTime>
            <HourTitle>Siadamy do stołów.</HourTitle>
            <Seats tables={tables} />
          </Hour>

          <Golden />
          <Evening />

          <Hour id="h22" time="22:00" theme="dusk">
            <HourTime>22:00</HourTime>
            <HourTitle>Wasze zdjęcia.</HourTitle>
            <Lead>Fotograf zobaczy dużo. Wy zobaczycie więcej. Wrzucajcie wszystko — z tego złożymy pamiątkę.</Lead>
            <Photos stage={stage} initial={photos} />
          </Hour>

          <Midnight />
          <Late />
          <Finale />
        </div>
      </main>
      {labEnabled() && <DesignLab design={design} />}
    </>
  );
}
