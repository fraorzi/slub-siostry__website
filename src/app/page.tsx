import Image from "next/image";
import type { ReactNode } from "react";
import { Choreography } from "@/components/Choreography";
import { Intro } from "@/components/Intro";
import { Photos } from "@/components/Photos";
import { SeatFinder } from "@/components/SeatFinder";
import { wedding, type DayTheme } from "@/content/wedding";
import { tables } from "@/data/seating";
import { hasWeddingDay, type CalendarEvent } from "@/lib/calendar";
import { listPhotos } from "@/lib/photos";
import { previewStage, stageFor } from "@/lib/stage";

const HourTime = ({ children }: { children: ReactNode }) => (
  <p data-rise className="foil inline-block font-serif text-[clamp(4.5rem,13vw,12rem)] leading-[0.9] tracking-[-0.03em] lining-nums">{children}</p>
);

const HourTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.01em]">{children}</h2>
);

const Lead = ({ children }: { children: ReactNode }) => <p className="mt-5 max-w-[38ch] text-[1.0625rem] text-muted">{children}</p>;

const Place = ({ event }: { event: CalendarEvent }) => (
  <div className="mt-12 max-w-md">
    <span aria-hidden className="foil-bg block h-px w-12" />
    <p className="mt-5 text-[0.75rem] uppercase tracking-[0.2em] text-muted">{event.time} – {event.ends}</p>
    <p className="mt-2 font-serif text-[clamp(1.6rem,2.4vw,2rem)] leading-tight"><span className="tbd">{event.venue.name}</span></p>
    <p className="mt-1 text-muted">{event.venue.address}</p>
    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      <a href={event.venue.mapUrl} className="btn-gold">Jak dojechać</a>
      {hasWeddingDay() ? (
        <a href={`/kalendarz/${event.slug}`} className="whitespace-nowrap underline decoration-line underline-offset-[6px] transition-colors hover:decoration-fg">Dodaj do kalendarza</a>
      ) : (
        <span className="whitespace-nowrap text-muted">Kalendarz — gdy będzie data</span>
      )}
    </div>
  </div>
);

const Hour = ({ id, time, theme, children, className = "" }: { id?: string; time: string; theme: DayTheme; children: ReactNode; className?: string }) => (
  <section id={id} data-time={time} data-theme={theme} className={`relative px-gutter py-[clamp(6rem,20vh,12rem)] ${className}`}>
    {children}
  </section>
);

export default async function Home({ searchParams }: PageProps<"/">) {
  const stage = previewStage((await searchParams).etap) ?? stageFor(new Date(), wedding.weddingDay);
  const photos = stage === "before" ? [] : await listPhotos();
  const { ceremony, reception, media } = wedding;

  return (
    <>
      <Choreography />
      <main id="top">
        <Intro />

        <div className="relative">
          <span aria-hidden data-thread className="foil-bg absolute bottom-0 left-[calc(var(--gutter)/2)] top-0 hidden w-px origin-top md:block" />
          <span aria-hidden data-bead className="foil-bg absolute left-[calc(var(--gutter)/2)] top-0 z-10 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_14px_2px_oklch(85%_0.1_88/0.55)] md:block" />

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
                  <video data-autoplay autoPlay muted loop playsInline preload="metadata" src={ceremony.video} className="aspect-[3/4.2] size-full object-cover" />
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

          <Hour id="h17" time="17:00" theme="day">
            <HourTime>17:00</HourTime>
            <HourTitle>Siadamy do stołów.</HourTitle>
            <SeatFinder tables={tables} />
          </Hour>

          <section id="h19" data-time="19:30" data-theme="champagne" className="relative">
            <figure data-reveal className="relative h-[85svh] overflow-hidden md:h-[110svh]">
              <Image src={media.goldenHour} alt="Para tańcząca w polu o zachodzie słońca" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(15%_0.012_70/0.7)] via-transparent to-transparent" />
            </figure>
            <div className="absolute inset-x-0 bottom-0 px-gutter pb-[clamp(3rem,10vh,6rem)] text-pearl">
              <HourTime>19:30</HourTime>
              <HourTitle>Złota godzina.</HourTitle>
              <p className="mt-5 max-w-[38ch] text-[1.0625rem] text-pearl/85">My znikamy na chwilę na zdjęcia. Wy nie musicie nigdzie znikać.</p>
            </div>
          </section>

          <section data-time={wedding.evening[0].time} data-theme="champagne" className="relative px-gutter py-[clamp(6rem,18vh,10rem)]">
            <ol className="grid gap-14 md:grid-cols-2 md:gap-gutter">
              {wedding.evening.map((e) => (
                <li key={e.time} className="relative pt-8">
                  <span aria-hidden data-draw className="foil-bg absolute left-0 top-0 h-px w-full origin-left" />
                  <p className="foil inline-block font-serif text-[clamp(3rem,7vw,6rem)] leading-none lining-nums">{e.time}</p>
                  <p className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight">{e.label}</p>
                </li>
              ))}
            </ol>
          </section>

          <Hour id="h22" time="22:00" theme="dusk">
            <HourTime>22:00</HourTime>
            <HourTitle>Wasze zdjęcia.</HourTitle>
            <Lead>Fotograf zobaczy dużo. Wy zobaczycie więcej. Wrzucajcie wszystko — z tego złożymy pamiątkę.</Lead>
            <Photos stage={stage} initial={photos} />
          </Hour>

          <section id="h00" data-time="00:00" data-theme="night" className="relative grid min-h-svh items-end overflow-hidden px-gutter pb-[clamp(4rem,12vh,7rem)]">
            <video data-autoplay autoPlay muted loop playsInline preload="metadata" src={media.midnightVideo} className="absolute inset-0 size-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-night to-transparent to-65%" />
            <div className="relative">
              <HourTime>00:00</HourTime>
              <HourTitle>Północ. Nikt nie idzie do domu.</HourTitle>
            </div>
          </section>

          <Hour time="03:00" theme="night" className="!pb-[clamp(4rem,12vh,8rem)]">
            <HourTime>03:00</HourTime>
            <HourTitle>Zostają najwierniejsi.</HourTitle>
            <p className="mt-6 max-w-[40ch] text-muted">Ostatnia piosenka leci dopiero wtedy, gdy wyjdzie ostatni gość.</p>
          </Hour>
        </div>

        <section data-time="04:00" data-theme="night" className="grid gap-10 px-gutter pb-24 pt-[clamp(6rem,18vh,10rem)]">
          <p className="foil font-serif text-[clamp(3.5rem,12vw,11rem)] leading-[0.95] tracking-[-0.03em]">Do zobaczenia.</p>
          <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-4 text-sm text-muted">
            <span>{wedding.bride} & {wedding.groom}</span>
            <span className="tbd">{wedding.dateLabel}</span>
            <span>{wedding.contactNote}</span>
          </div>
        </section>
      </main>
    </>
  );
}
