import type { ComponentType } from "react";
import { Choreography } from "@/components/Choreography";
import { EveningScroll } from "@/components/evening/EveningScroll";
import { FinaleDawn } from "@/components/finale/FinaleDawn";
import { Late } from "@/components/finale/Late";
import { GoldenBlinds } from "@/components/golden/GoldenBlinds";
import { Hour, HourTime, HourTitle, Lead } from "@/components/hour";
import { IntroArch } from "@/components/intro/IntroArch";
import { DesignLab } from "@/components/lab/DesignLab";
import { MidnightSparklers } from "@/components/midnight/MidnightSparklers";
import { PhotosCamera } from "@/components/photos/PhotosCamera";
import { PlacesCards } from "@/components/places/PlacesCards";
import { PlacesRoute } from "@/components/places/PlacesRoute";
import { PlacesSplit, PlacesTak } from "@/components/places/PlacesSplit";
import { RouteThread } from "@/components/RouteThread";
import { SeatsHall } from "@/components/seats/SeatsHall";
import { wedding } from "@/content/wedding";
import { tables } from "@/data/seating";
import { serializeDesign, type VariantOf } from "@/design/catalog";
import { labEnabled, readDesign } from "@/design/server";
import { listPhotos } from "@/lib/photos";
import { previewStage, stageFor } from "@/lib/stage";

// Jedyna sekcja, w której wybór jeszcze trwa (panel „Projekt”).
const PLACES: Record<VariantOf<"places">, ComponentType> = { tak: PlacesTak, rozklad: () => <PlacesSplit />, karty: PlacesCards, trasa: PlacesRoute };

export default async function Home({ searchParams }: PageProps<"/">) {
  const stage = previewStage((await searchParams).etap) ?? stageFor(new Date(), wedding.weddingDay);
  const photos = stage === "before" ? [] : await listPhotos();
  const design = await readDesign();
  const Places = PLACES[design.places];

  return (
    <>
      <Choreography key={serializeDesign(design)} />
      <main id="top">
        <IntroArch />

        <div className="relative">
          <RouteThread />

          <Places />

          <Hour id="h17" time="17:00" theme="day">
            <HourTime>17:00</HourTime>
            <HourTitle>Siadamy do stołów.</HourTitle>
            <SeatsHall tables={tables} />
          </Hour>

          <GoldenBlinds />
          <EveningScroll />

          <Hour id="h22" time="22:00" theme="dusk">
            <HourTime>22:00</HourTime>
            <HourTitle>Wasze zdjęcia.</HourTitle>
            <Lead>Fotograf zobaczy dużo. Wy zobaczycie więcej. Wrzucajcie wszystko — z tego złożymy pamiątkę.</Lead>
            <PhotosCamera stage={stage} initial={photos} />
          </Hour>

          <MidnightSparklers />
          <Late />
          <FinaleDawn />
        </div>
      </main>
      {labEnabled() && <DesignLab design={design} />}
    </>
  );
}
