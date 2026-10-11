"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { Credits } from "./Late";

const STARS = Array.from({ length: 70 }, (_, i) => ({ x: `${((i * 47.3) % 100).toFixed(2)}%`, y: `${((i * 29.7) % 70).toFixed(2)}%`, s: 1 + (i % 3) * 0.5, d: `${((i * 0.41) % 3).toFixed(2)}s` }));

/** 04:00: gdy sekcja jest na ekranie, noc sama, powoli przechodzi w świt i wschodzi słońce. */
export function FinaleDawn() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    if (prefersReducedMotion()) {
      gsap.set(q(".dawn__violet, .dawn__peach, .dawn__title"), { opacity: 1 });
      gsap.set(q(".dawn__stars"), { opacity: 0 });
      gsap.set(q(".dawn__sun"), { yPercent: 0 });
      return;
    }
    // Gra sama, gdy sekcja jest na ekranie; po wyjechaniu wraca do nocy, po powrocie gra od nowa.
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top 35%", end: "bottom 65%", toggleActions: "play none none reset" } })
        .fromTo(".dawn__violet", { opacity: 0 }, { opacity: 1, ease: "sine.inOut", duration: 4 }, 0)
        .fromTo(".dawn__stars", { opacity: 1 }, { opacity: 0, ease: "sine.in", duration: 4.5 }, 1)
        .fromTo(".dawn__sun", { yPercent: 110 }, { yPercent: 0, ease: "sine.out", duration: 6.5 }, 1.2)
        .fromTo(".dawn__peach", { opacity: 0 }, { opacity: 1, ease: "sine.inOut", duration: 4.5 }, 3)
        .fromTo(".dawn__title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power2.out", duration: 2.4 }, 3.6);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h04" data-time="04:00" data-theme="night" className="relative h-svh min-h-[34rem] overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,oklch(13%_0.02_265),oklch(20%_0.04_270))]" />
      <div aria-hidden className="dawn__violet absolute inset-0 bg-[linear-gradient(180deg,oklch(28%_0.06_275),oklch(45%_0.09_320)_60%,oklch(62%_0.1_20))] opacity-0" />
      <div aria-hidden className="dawn__peach absolute inset-0 bg-[linear-gradient(180deg,oklch(62%_0.07_250),oklch(80%_0.07_40)_55%,oklch(90%_0.09_75))] opacity-0" />
      <div aria-hidden className="dawn__stars absolute inset-0">
        {STARS.map((s, i) => (
          <span key={i} className="absolute rounded-full bg-pearl motion-safe:animate-pulse" style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: s.d, animationDuration: "3s" }} />
        ))}
      </div>
      <div aria-hidden className="absolute inset-x-0 top-0 h-[85%] overflow-hidden">
        <span className="dawn__sun absolute bottom-0 left-1/2 aspect-square w-[min(60vw,28rem)] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(98%_0.06_95),oklch(88%_0.13_80)_55%,oklch(80%_0.14_60/0)_72%)]" />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 top-[85%] bg-[linear-gradient(180deg,oklch(30%_0.04_280/0.92),oklch(14%_0.02_265))]">
        <span className="foil-bg absolute inset-x-0 top-0 h-px" />
      </div>
      <div className="dawn__title absolute inset-x-0 top-[24%] px-gutter text-center opacity-0">
        <p className="font-label text-[0.75rem] uppercase tracking-[0.32em] text-pearl/80">04:00</p>
        <p className="foil mt-4 inline-block font-serif text-[clamp(2.75rem,12vw,11rem)] leading-[0.95] tracking-[-0.03em]">Do zobaczenia.</p>
      </div>
      <Credits className="absolute inset-x-gutter bottom-5 !border-pearl/20 !text-pearl/70" />
    </section>
  );
}
