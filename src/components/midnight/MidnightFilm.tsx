import { HourTime, HourTitle } from "@/components/hour";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";

export const MIDNIGHT_TITLE = "Północ. Nikt nie idzie do domu.";

export function MidnightFilm() {
  return (
    <section id="h00" data-time="00:00" data-theme="night" className="relative grid min-h-svh items-end overflow-hidden px-gutter pb-[clamp(4rem,12vh,7rem)]">
      <LoopVideo src={wedding.media.midnight} className="absolute inset-0 size-full object-cover opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-t from-night to-transparent to-65%" />
      <div className="relative">
        <HourTime>00:00</HourTime>
        <HourTitle>{MIDNIGHT_TITLE}</HourTitle>
      </div>
    </section>
  );
}
