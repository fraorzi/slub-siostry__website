import Image from "next/image";
import { HourTime, HourTitle } from "@/components/hour";
import { wedding } from "@/content/wedding";

export const GOLDEN_LINE = "My znikamy na chwilę na zdjęcia. Wy nie musicie nigdzie znikać.";

export function GoldenFrame() {
  return (
    <section id="h19" data-time="19:30" data-theme="champagne" className="relative">
      <figure data-reveal className="relative h-[85svh] overflow-hidden md:h-[110svh]">
        <Image src={wedding.media.goldenHour} alt="Para tańcząca w polu o zachodzie słońca" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(15%_0.012_70/0.7)] via-transparent to-transparent" />
      </figure>
      <div className="absolute inset-x-0 bottom-0 px-gutter pb-[clamp(3rem,10vh,6rem)] text-pearl">
        <HourTime>19:30</HourTime>
        <HourTitle>Złota godzina.</HourTitle>
        <p className="lead mt-5 max-w-[38ch] text-[1.0625rem] text-pearl/85">{GOLDEN_LINE}</p>
      </div>
    </section>
  );
}
