import Image from "next/image";
import { Hour, HourTime, HourTitle, Lead, Place } from "@/components/hour";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";
import { TakCeremony } from "./TakCeremony";

/** Tytuł ceremonii z wyróżnionym słowem „tak”: na nim ląduje wielki napis z wideo. */
const CeremonyTitle = () => {
  const [before, after] = wedding.ceremony.title.split("tak");
  return after === undefined ? <>{before}</> : <>{before}<span className="tak__target inline-block opacity-0">tak</span>{after}</>;
};

/** Ślub („TAK” z wideo zmienia się w sekcję) i przyjęcie. */
export function Places() {
  const { ceremony, reception } = wedding;
  return (
    <>
      <TakCeremony
        header={
          <>
            <HourTime>{ceremony.time}</HourTime>
            <HourTitle><CeremonyTitle /></HourTitle>
          </>
        }
        details={
          <>
            <Lead>{ceremony.lead}</Lead>
            <Place event={ceremony} className="mt-10" />
          </>
        }
        figure={
          <div className="[clip-path:inset(0_round_9999px_9999px_0_0)]">
            <LoopVideo src={ceremony.video} className="aspect-[3/4.2] max-h-[78svh] w-full object-cover" />
          </div>
        }
      />

      <Hour id="h1630" time={reception.time} theme="day">
        <div className="grid grid-cols-12 items-end gap-gutter">
          <div className="col-span-12 md:order-2 md:col-span-6 md:col-start-7">
            <HourTime>{reception.time}</HourTime>
            <HourTitle>{reception.title}</HourTitle>
            <Lead>{reception.lead}</Lead>
            <Place event={reception} />
          </div>
          <figure data-reveal className="relative col-span-12 aspect-[4/5] w-[78%] overflow-hidden md:order-1 md:col-span-5 md:w-full">
            <Image src={reception.image} alt="Nakryty stół weselny" fill sizes="(max-width: 860px) 78vw, 40vw" className="object-cover" />
          </figure>
        </div>
      </Hour>
    </>
  );
}
