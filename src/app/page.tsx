import { Choreography } from "@/components/Choreography";
import { EveningScroll } from "@/components/evening/EveningScroll";
import { FinaleDawn } from "@/components/finale/FinaleDawn";
import { Late } from "@/components/finale/Late";
import { GoldenBlinds } from "@/components/golden/GoldenBlinds";
import { Hour, HourTime, HourTitle, Lead } from "@/components/hour";
import { IntroArch } from "@/components/intro/IntroArch";
import { MidnightSparklers } from "@/components/midnight/MidnightSparklers";
import { PhotosCamera } from "@/components/photos/PhotosCamera";
import { Places } from "@/components/places/Places";
import { SeatsHall } from "@/components/seats/SeatsHall";
import { parseSearchVariant, SEARCH_PARAM } from "@/components/seats/variants";
import { wedding } from "@/content/wedding";
import { tables } from "@/data/seating";
import { listPhotos } from "@/lib/photos";
import { previewStage, stageFor } from "@/lib/stage";

// Przełącznik wersji wyszukiwarki miejsca: w dev i na podglądach Vercela.
const compare = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const stage = previewStage(params.etap) ?? stageFor(new Date(), wedding.weddingDay);
  const photos = stage === "before" ? [] : await listPhotos();

  return (
    <>
      <Choreography />
      <main id="top">
        <IntroArch />
        <Places />

        <Hour id="h17" time="17:00" theme="day">
          <HourTime>17:00</HourTime>
          <HourTitle>Siadamy do stołów.</HourTitle>
          <SeatsHall tables={tables} variant={parseSearchVariant(params[SEARCH_PARAM])} compare={compare} />
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
      </main>
    </>
  );
}
