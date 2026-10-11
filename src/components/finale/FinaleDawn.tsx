"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { Credits } from "./FinaleNight";

const STARS = Array.from({ length: 70 }, (_, i) => ({ x: `${((i * 47.3) % 100).toFixed(2)}%`, y: `${((i * 29.7) % 62).toFixed(2)}%`, s: 1 + (i % 3) * 0.5, d: `${((i * 0.41) % 3).toFixed(2)}s` }));

/** 04:00: noc przechodzi w świt, słońce wschodzi nad horyzontem, „Do zobaczenia.” na tle zorzy. */
export function FinaleDawn() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 } })
        .fromTo(".dawn__violet", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.45 }, 0)
        .fromTo(".dawn__peach", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.45 }, 0.35)
        .to(".dawn__stars", { opacity: 0, ease: "none", duration: 0.5 }, 0.15)
        .fromTo(".dawn__sun", { yPercent: 120 }, { yPercent: 0, ease: "power1.out", duration: 0.7 }, 0.2)
        .fromTo(".dawn__title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.55)
        .set({}, {}, 1);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h04" data-time="04:00" data-theme="night" className="relative h-[230vh] motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,oklch(13%_0.02_265),oklch(20%_0.04_270))]" />
        <div aria-hidden className="dawn__violet absolute inset-0 bg-[linear-gradient(180deg,oklch(28%_0.06_275),oklch(45%_0.09_320)_60%,oklch(62%_0.1_20))] opacity-0" />
        <div aria-hidden className="dawn__peach absolute inset-0 bg-[linear-gradient(180deg,oklch(62%_0.07_250),oklch(80%_0.07_40)_55%,oklch(90%_0.09_75))] opacity-0" />
        <div aria-hidden className="dawn__stars absolute inset-0">
          {STARS.map((s, i) => (
            <span key={i} className="absolute rounded-full bg-pearl motion-safe:animate-pulse" style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: s.d, animationDuration: "3s" }} />
          ))}
        </div>
        <div aria-hidden className="absolute inset-x-0 top-0 h-[64%] overflow-hidden">
          <span className="dawn__sun absolute bottom-0 left-1/2 aspect-square w-[min(60vw,28rem)] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(98%_0.06_95),oklch(88%_0.13_80)_55%,oklch(80%_0.14_60/0)_72%)]" />
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 top-[64%] bg-[linear-gradient(180deg,oklch(30%_0.04_280/0.92),oklch(14%_0.02_265))]">
          <span className="foil-bg absolute inset-x-0 top-0 h-px" />
        </div>
        <div className="dawn__title absolute inset-x-0 top-[22%] px-gutter text-center motion-reduce:static motion-reduce:pt-24">
          <p className="font-label text-[0.75rem] uppercase tracking-[0.32em] text-pearl/80">04:00</p>
          <p className="foil mt-4 inline-block font-serif text-[clamp(2.75rem,12vw,11rem)] leading-[0.95] tracking-[-0.03em]">Do zobaczenia.</p>
        </div>
        <Credits className="absolute inset-x-gutter bottom-8 !border-pearl/20 !text-pearl/70 motion-reduce:static" />
      </div>
    </section>
  );
}
