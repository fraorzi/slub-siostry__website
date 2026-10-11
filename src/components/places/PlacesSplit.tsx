import Image from "next/image";
import { Hour, HourTime, HourTitle, Lead, Place } from "@/components/hour";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";

export function PlacesSplit() {
  const { ceremony, reception } = wedding;
  return (
    <>
      <Hour id="h15" time={ceremony.time} theme="day">
        <div className="grid grid-cols-12 items-end gap-gutter">
          <div className="col-span-12 md:col-span-6">
            <HourTime>{ceremony.time}</HourTime>
            <HourTitle>{ceremony.title}</HourTitle>
            <Lead>{ceremony.lead}</Lead>
            <Place event={ceremony} />
          </div>
          <figure data-reveal className="col-span-12 w-[78%] justify-self-end md:col-span-5 md:col-start-8 md:w-full">
            <div className="[clip-path:inset(0_round_9999px_9999px_0_0)]">
              <LoopVideo src={ceremony.video} className="aspect-[3/4.2] size-full object-cover" />
            </div>
          </figure>
        </div>
      </Hour>

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
