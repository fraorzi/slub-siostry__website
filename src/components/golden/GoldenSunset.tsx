"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { HourTime, HourTitle } from "@/components/hour";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { GOLDEN_LINE } from "./GoldenFrame";

/**
 * Zdjęcie w tarczy słońca: słońce zachodzi za horyzont, potem rośnie na cały ekran.
 * Maska to zaokrąglony kontener skalowany transformem (kompozytor, bez przerysowań);
 * zdjęcie w środku dostaje odwrotną skalę, więc stoi w miejscu.
 */
export function GoldenSunset() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const [disc] = q(".sunset__disc");
    const [photo] = q(".sunset__photo");
    const [glow] = q(".sunset__glow");

    const state = { s: 0.14, y: -0.2 };
    const render = () => {
      const vh = window.innerHeight;
      const y = state.y * vh;
      gsap.set(disc, { y, scale: state.s });
      gsap.set(glow, { y, scale: state.s * 2.4 });
      gsap.set(photo, { y: -y / state.s, scale: 1 / state.s });
    };
    if (prefersReducedMotion()) {
      Object.assign(state, { s: 1, y: 0 });
      render();
      gsap.set(q(".sunset__text, .sunset__scrim"), { opacity: 1 });
      return;
    }
    render();

    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 }, onUpdate: render })
        .to(state, { y: 0.12, s: 0.18, ease: "sine.inOut", duration: 0.45 }, 0)
        .to(".sunset__dusk", { opacity: 1, ease: "none", duration: 0.5 }, 0)
        .to(state, { y: 0, s: 1, ease: "power2.in", duration: 0.4 }, 0.45)
        .to(".sunset__land", { opacity: 0, duration: 0.2 }, 0.62)
        .to(".sunset__label", { opacity: 0, duration: 0.1 }, 0.4)
        .to(".sunset__scrim", { opacity: 1, duration: 0.15 }, 0.78)
        .fromTo(".sunset__text", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.8)
        .set({}, {}, 1);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h19" data-time="19:30" data-theme="champagne" className="relative h-[260vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,oklch(90%_0.05_75),oklch(88%_0.08_60)_55%,oklch(84%_0.1_45))]" />
        <div aria-hidden className="sunset__dusk absolute inset-0 bg-[linear-gradient(180deg,oklch(55%_0.08_300),oklch(70%_0.12_30)_55%,oklch(78%_0.14_55))] opacity-0" />
        <div aria-hidden className="sunset__glow absolute left-1/2 top-1/2 size-[100vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(96%_0.09_85/0.9),oklch(90%_0.12_70/0.35)_45%,transparent)] will-change-transform" />
        <div className="sunset__disc absolute left-1/2 top-1/2 size-[150vmax] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full will-change-transform">
          <div className="sunset__photo absolute left-1/2 top-1/2 h-svh w-screen -translate-x-1/2 -translate-y-1/2 will-change-transform">
            <Image src={wedding.media.goldenHour} alt="Para tańcząca w polu o zachodzie słońca" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div aria-hidden className="sunset__land absolute inset-x-0 bottom-0 top-[62%] bg-[linear-gradient(180deg,oklch(62%_0.08_55),oklch(40%_0.05_50))]">
          <span className="foil-bg absolute inset-x-0 top-0 h-px" />
        </div>
        <p className="sunset__label absolute inset-x-0 top-[66%] text-center font-label text-[0.75rem] uppercase tracking-[0.32em] text-pearl/90">19:30 · zachód słońca</p>
        <div aria-hidden className="sunset__scrim absolute inset-0 bg-gradient-to-t from-[oklch(15%_0.012_70/0.75)] via-transparent to-transparent opacity-0" />
        <div className="sunset__text absolute inset-x-0 bottom-0 px-gutter pb-[clamp(3rem,10vh,6rem)] text-pearl opacity-0">
          <HourTime>19:30</HourTime>
          <HourTitle>Złota godzina.</HourTitle>
          <p className="lead mt-5 max-w-[38ch] text-[1.0625rem] text-pearl/85">{GOLDEN_LINE}</p>
        </div>
      </div>
    </section>
  );
}
