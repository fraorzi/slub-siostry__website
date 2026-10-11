import type { ReactNode } from "react";
import type { DayTheme } from "@/content/wedding";
import { hasWeddingDay, type CalendarEvent } from "@/lib/calendar";

/** Duża godzina ze złotej folii. */
export const HourTime = ({ children, className = "" }: { children: string; className?: string }) => (
  <p data-rise className={`hour-time foil ${className}`}>{children}</p>
);

export const HourTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`hour-title mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.01em] ${className}`}>{children}</h2>
);

export const Lead = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`lead mt-5 max-w-[38ch] text-[1.0625rem] text-muted ${className}`}>{children}</p>
);

export const Hour = ({ id, time, theme, children, className = "" }: { id?: string; time: string; theme: DayTheme; children: ReactNode; className?: string }) => (
  <section id={id} data-time={time} data-theme={theme} className={`relative px-gutter py-[clamp(6rem,20vh,12rem)] ${className}`}>
    {children}
  </section>
);

export const PlaceActions = ({ event }: { event: CalendarEvent }) => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
    <a href={event.venue.mapUrl} className="btn-gold">Jak dojechać</a>
    {hasWeddingDay() ? (
      <a href={`/kalendarz/${event.slug}`} className="whitespace-nowrap underline decoration-line underline-offset-[6px] transition-colors hover:decoration-fg">Dodaj do kalendarza</a>
    ) : (
      <span className="whitespace-nowrap text-muted">Kalendarz — gdy będzie data</span>
    )}
  </div>
);

export const Place = ({ event, className = "mt-12" }: { event: CalendarEvent; className?: string }) => (
  <div className={`max-w-md ${className}`}>
    <span aria-hidden className="foil-bg block h-px w-12" />
    <p className="mt-5 font-label text-[0.75rem] uppercase tracking-[0.2em] text-muted">{event.time} – {event.ends}</p>
    <p className="mt-2 font-serif text-[clamp(1.6rem,2.4vw,2rem)] leading-tight"><span className="tbd">{event.venue.name}</span></p>
    <p className="mt-1 text-muted">{event.venue.address}</p>
    <div className="mt-7"><PlaceActions event={event} /></div>
  </div>
);
