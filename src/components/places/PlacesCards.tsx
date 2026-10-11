import Image from "next/image";
import { HourTime, HourTitle, Lead, PlaceActions } from "@/components/hour";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";
import type { CalendarEvent } from "@/lib/calendar";

const Card = ({ event, tilt, from, children }: { event: CalendarEvent; tilt: string; from: "left" | "right"; children: React.ReactNode }) => (
  <article data-fly={from} className={`paper group relative rounded-[3px] p-[clamp(1.5rem,4vw,3rem)] shadow-[0_1px_2px_oklch(30%_0.02_70/0.15),0_40px_80px_-40px_oklch(25%_0.03_70/0.55)] transition-transform duration-700 ease-soft hover:rotate-0 ${tilt}`}>
    <div className="flex items-start justify-between gap-6">
      <div>
        <HourTime className="!text-[clamp(3.75rem,8vw,7rem)]">{event.time}</HourTime>
        <HourTitle className="!text-[clamp(1.6rem,2.6vw,2.4rem)] text-ink">{event.title}</HourTitle>
      </div>
      <div className="relative aspect-[3/4] w-[clamp(5.5rem,14vw,9.5rem)] shrink-0 overflow-hidden rounded-t-full [clip-path:inset(0_round_9999px_9999px_0_0)] shadow-[inset_0_0_0_1px_oklch(70%_0.03_80/0.3)]">{children}</div>
    </div>
    <Lead className="!text-ink-soft">{event.lead}</Lead>
    <div className="mt-8 border-t border-dashed border-[oklch(80%_0.03_80)] pt-6">
      <p className="font-label text-[0.75rem] uppercase tracking-[0.2em] text-ink-soft">{event.time} – {event.ends}</p>
      <p className="mt-2 font-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight"><span className="tbd">{event.venue.name}</span></p>
      <p className="mt-1 text-ink-soft">{event.venue.address}</p>
      <div className="mt-6"><PlaceActions event={event} /></div>
    </div>
  </article>
);

export function PlacesCards() {
  const { ceremony, reception } = wedding;
  return (
    <section id="h15" data-time={ceremony.time} data-theme="day" className="relative px-gutter py-[clamp(6rem,20vh,12rem)]">
      <p className="mx-auto max-w-6xl text-center font-label text-[0.8125rem] uppercase tracking-[0.3em] text-muted">Gdzie i kiedy</p>
      <div className="mx-auto mt-[clamp(3rem,8vh,5rem)] grid max-w-6xl gap-[clamp(2.5rem,5vw,4rem)] md:grid-cols-2 md:items-start">
        <Card event={ceremony} tilt="md:-rotate-[1.6deg]" from="left">
          <LoopVideo src={ceremony.video} className="absolute inset-0 size-full object-cover" />
        </Card>
        <div id="h1630" className="md:mt-[clamp(4rem,12vh,9rem)]">
          <Card event={reception} tilt="md:rotate-[1.2deg]" from="right">
            <Image src={reception.image} alt="Nakryty stół weselny" fill sizes="10rem" className="object-cover" />
          </Card>
        </div>
      </div>
    </section>
  );
}
