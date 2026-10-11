"use client";

import { useEffect, useRef } from "react";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/scroll";

/** Wieczór w poziomie: scroll w dół przesuwa taśmę godzin w bok. Wysokość sekcji = długość taśmy. */
export function EveningScroll() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    const track = section?.querySelector<HTMLElement>(".evening__track");
    if (!section || !track || prefersReducedMotion()) return;
    // Długość taśmy zależy od kroju i szerokości ekranu: wysokość sekcji liczymy z rzeczywistej szerokości.
    const size = () => { section.style.height = `${track.scrollWidth - window.innerWidth + window.innerHeight}px`; };
    size();
    ScrollTrigger.addEventListener("refreshInit", size);
    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true } });
    }, section);
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", size);
      ctx.revert();
      section.style.height = "";
    };
  }, []);

  return (
    <section ref={root} id="h21" data-time={wedding.evening[0].time} data-theme="champagne" className="relative h-[calc(240vw+100svh)] motion-reduce:h-auto md:h-[calc(140vw+100svh)]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <ol className="evening__track flex w-max items-center will-change-transform motion-reduce:flex-col motion-reduce:items-start">
          <li className="evening__panel min-w-[85vw] shrink-0 px-gutter md:min-w-[60vw]">
            <p className="font-label text-[0.8125rem] uppercase tracking-[0.3em] text-muted">Wieczór</p>
            <p className="mt-4 max-w-[14ch] font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[1.02]">Najlepsze dopiero się zaczyna.</p>
          </li>
          {wedding.evening.map((e) => (
            <li key={e.time} className="evening__panel relative min-w-[85vw] shrink-0 px-gutter pr-[12vw] md:min-w-[60vw]">
              <span aria-hidden className="foil-bg absolute left-gutter right-0 top-0 h-px" />
              <p className="evening__time foil inline-block w-max pt-8 font-serif text-[clamp(7rem,30vw,22rem)] leading-[0.85] tracking-[-0.04em] lining-nums">{e.time}</p>
              <p className="mt-6 max-w-[18ch] font-serif text-[clamp(1.8rem,4vw,3.2rem)] leading-tight">{e.label}</p>
            </li>
          ))}
          <li className="evening__panel min-w-[85vw] shrink-0 px-gutter md:min-w-[60vw]">
            <p className="max-w-[16ch] font-serif text-[clamp(2rem,4.5vw,3.8rem)] italic leading-[1.05] text-muted">…a potem już tylko parkiet.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
