import { Choreography } from "@/components/Choreography";
import { EveningScroll } from "@/components/evening/EveningScroll";
import { FinaleDawn } from "@/components/finale/FinaleDawn";
import { Late } from "@/components/finale/Late";
import { GoldenBlinds } from "@/components/golden/GoldenBlinds";
import { Hour, HourTime, HourTitle, Lead } from "@/components/hour";
import { IntroArch } from "@/components/intro/IntroArch";
import { LeafShade } from "@/components/LeafShade";
import { MidnightSparklers } from "@/components/midnight/MidnightSparklers";
import { PhotosCamera } from "@/components/photos/PhotosCamera";
import { Places } from "@/components/places/Places";
import { SeatsHall } from "@/components/seats/SeatsHall";
import { wedding } from "@/content/wedding";
import { tables } from "@/data/seating";
import { listPhotos } from "@/lib/photos";
import { previewStage, stageFor } from "@/lib/stage";

export default async function Home({ searchParams }: PageProps<"/">) {
  const stage = previewStage((await searchParams).etap) ?? stageFor(new Date(), wedding.weddingDay);
  const photos = stage === "before" ? [] : await listPhotos();

  return (
    <>
      <Choreography />
      <LeafShade />
      <main id="top">
        <IntroArch />
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
      </main>
    </>
  );
}
