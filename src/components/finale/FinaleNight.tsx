import { Hour, HourTime, HourTitle } from "@/components/hour";
import { wedding } from "@/content/wedding";

export const Late = () => (
  <Hour id="h03" time="03:00" theme="night" className="!pb-[clamp(4rem,12vh,8rem)]">
    <HourTime>03:00</HourTime>
    <HourTitle>Zostają najwierniejsi.</HourTitle>
    <p className="mt-6 max-w-[40ch] text-muted">Ostatnia piosenka leci dopiero wtedy, gdy wyjdzie ostatni gość.</p>
  </Hour>
);

export const Credits = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-wrap justify-between gap-4 border-t border-line pt-4 text-sm text-muted ${className}`}>
    <span>{wedding.bride} & {wedding.groom}</span>
    <span className="tbd">{wedding.dateLabel}</span>
    <span>{wedding.contactNote}</span>
  </div>
);

export function FinaleNight() {
  return (
    <section id="h04" data-time="04:00" data-theme="night" className="grid gap-10 px-gutter pb-24 pt-[clamp(6rem,18vh,10rem)]">
      <p className="foil font-serif text-[clamp(2.75rem,12vw,11rem)] leading-[0.95] tracking-[-0.03em]">Do zobaczenia.</p>
      <Credits />
    </section>
  );
}
