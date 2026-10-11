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
