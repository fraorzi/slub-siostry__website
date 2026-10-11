"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { HourTime, HourTitle } from "@/components/hour";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { GOLDEN_LINE } from "./GoldenFrame";

const STRIPS = 7;

/** Kadr pocięty na pionowe pasy, każdy płynie z inną prędkością i składa się w całość na środku ekranu. */
export function GoldenBlinds() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".blind").forEach((strip, i) => {
        const dir = i % 2 ? 1 : -1;
        const amp = 10 + ((i * 7) % 4) * 6;
        gsap.fromTo(strip, { yPercent: dir * amp }, { yPercent: -dir * amp * 0.6, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.4 } });
      });
      gsap.fromTo(".blinds__text", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: section, start: "top 30%", once: true } });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h19" data-time="19:30" data-theme="champagne" className="relative py-[clamp(4rem,12vh,8rem)]">
      <div className="relative mx-auto h-[min(118svh,62rem)] w-full">
        <div className="absolute inset-0 grid gap-[clamp(4px,0.6vw,10px)] px-[clamp(0px,2vw,2rem)]" style={{ gridTemplateColumns: `repeat(${STRIPS}, minmax(0, 1fr))` }}>
          {Array.from({ length: STRIPS }, (_, i) => (
            <div key={i} className="relative overflow-hidden">
              <div className="blind absolute inset-y-[-14%] will-change-transform" style={{ left: `calc(${-i * 100}% - ${i} * clamp(4px, 0.6vw, 10px))`, width: `calc(${STRIPS * 100}% + ${STRIPS - 1} * clamp(4px, 0.6vw, 10px))` }}>
                <Image src={wedding.media.goldenHour} alt={i === 0 ? "Para tańcząca w polu o zachodzie słońca" : ""} fill sizes="100vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[oklch(15%_0.012_70/0.65)] via-transparent to-transparent" />
        <div className="blinds__text absolute inset-x-0 bottom-0 px-gutter pb-[clamp(3rem,8vh,5rem)] text-pearl">
          <HourTime>19:30</HourTime>
          <HourTitle>Złota godzina.</HourTitle>
          <p className="lead mt-5 max-w-[38ch] text-[1.0625rem] text-pearl/85">{GOLDEN_LINE}</p>
        </div>
      </div>
    </section>
  );
}
