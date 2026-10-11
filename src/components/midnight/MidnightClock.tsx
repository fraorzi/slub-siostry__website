"use client";

import { useEffect, useRef } from "react";
import { HourTime, HourTitle } from "@/components/hour";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { MIDNIGHT_TITLE } from "./MidnightFilm";

const NUMERALS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

/** Tarcza zegara: scroll przesuwa wskazówki z 23:15 do północy, o północy złoty błysk. */
export function MidnightClock() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    if (prefersReducedMotion()) {
      gsap.set(q(".clock__minute, .clock__hour"), { rotate: 0 });
      gsap.set(q(".clock__text"), { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true } })
        .fromTo(".clock__minute", { rotate: -270 }, { rotate: 0, ease: "power1.inOut", duration: 0.7 }, 0)
        .fromTo(".clock__hour", { rotate: -22.5 }, { rotate: 0, ease: "power1.inOut", duration: 0.7 }, 0)
        .fromTo(".clock__burst", { scale: 0.4, opacity: 0 }, { scale: 1.6, opacity: 1, ease: "power2.out", duration: 0.12 }, 0.7)
        .to(".clock__burst", { opacity: 0, duration: 0.12 }, 0.82)
        .fromTo(".clock__face", { scale: 1, y: 0 }, { scale: 0.72, y: () => -window.innerHeight * 0.13, duration: 0.2, ease: "power2.inOut" }, 0.7)
        .fromTo(".clock__text", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.14 }, 0.78)
        .set({}, {}, 1);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h00" data-time="00:00" data-theme="night" className="relative h-[240vh] motion-reduce:h-auto">
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden px-gutter motion-reduce:static">
        <div className="clock__face relative aspect-square w-[min(80vw,62svh)]">
          <span aria-hidden className="clock__burst absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,oklch(92%_0.1_90/0.85),oklch(80%_0.12_80/0.35)_40%,transparent)] opacity-0" />
          <svg aria-hidden viewBox="-100 -100 200 200" className="absolute inset-0 size-full">
            <defs>
              <linearGradient id="clock-foil" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" style={{ stopColor: "var(--foil-deep)" }} />
                <stop offset="0.4" style={{ stopColor: "var(--foil-light)" }} />
                <stop offset="0.7" style={{ stopColor: "var(--foil-rich)" }} />
                <stop offset="1" style={{ stopColor: "var(--foil-mid)" }} />
              </linearGradient>
            </defs>
            <circle r="97" fill="none" stroke="url(#clock-foil)" strokeWidth="0.8" />
            <circle r="92" fill="none" stroke="url(#clock-foil)" strokeWidth="0.3" />
            {Array.from({ length: 60 }, (_, i) => (
              <line key={i} x1="0" y1={i % 5 ? -88 : -84} x2="0" y2="-91" stroke="url(#clock-foil)" strokeWidth={i % 5 ? 0.4 : 1} transform={`rotate(${i * 6})`} />
            ))}
            {NUMERALS.map((n, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <text key={n} x={(Math.sin(a) * 70).toFixed(2)} y={(-Math.cos(a) * 70).toFixed(2)} textAnchor="middle" dominantBaseline="central" fill="url(#clock-foil)" style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>
                  {n}
                </text>
              );
            })}
          </svg>
          <span aria-hidden className="clock__hour foil-bg absolute bottom-1/2 left-1/2 h-[28%] w-[1.6%] -translate-x-1/2 origin-bottom rounded-full" />
          <span aria-hidden className="clock__minute foil-bg absolute bottom-1/2 left-1/2 h-[40%] w-[0.9%] -translate-x-1/2 origin-bottom rounded-full" />
          <span aria-hidden className="foil-bg absolute left-1/2 top-1/2 size-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
        <div className="clock__text absolute inset-x-0 bottom-0 px-gutter pb-[clamp(3rem,9vh,6rem)] opacity-0 motion-reduce:static motion-reduce:opacity-100">
          <HourTime>00:00</HourTime>
          <HourTitle>{MIDNIGHT_TITLE}</HourTitle>
        </div>
      </div>
    </section>
  );
}
