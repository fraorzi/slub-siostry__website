"use client";

import { useEffect, useRef } from "react";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";

/**
 * Okno w literach: wideo z ceremonii gra wewnątrz wielkiego „TAK” (mix-blend: screen),
 * scroll wlatuje przez „A” w film, a na końcu kadr gaśnie w tło następnej sekcji.
 */
export function TakWindow() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const q = gsap.utils.selector(section);
    const [mask] = q(".tak__mask");
    const [letter] = q(".tak__a");

    const ctx = gsap.context(() => {
      const origin = () => {
        const m = mask.getBoundingClientRect();
        const a = letter.getBoundingClientRect();
        return `${a.left - m.left + a.width / 2}px ${a.top - m.top + a.height * 0.7}px`;
      };
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } })
        .set(mask, { transformOrigin: origin }, 0)
        .to(".tak__label", { opacity: 0, y: -20, duration: 0.12 }, 0.05)
        .to(mask, { scale: 9, ease: "power3.in", duration: 0.55 }, 0.1)
        .to(mask, { opacity: 0, ease: "power1.in", duration: 0.2 }, 0.45)
        .fromTo(".tak__fade", { opacity: 0 }, { opacity: 1, ease: "power1.in", duration: 0.25 }, 0.75)
        .set({}, {}, 1);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h15" data-time={wedding.ceremony.time} data-theme="day" className="relative h-[260vh] motion-reduce:h-svh">
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <LoopVideo src={wedding.ceremony.video} className="absolute inset-0 size-full object-cover" />
        <div className="tak__mask absolute inset-0 grid place-items-center bg-ivory text-black mix-blend-screen will-change-transform">
          <p aria-hidden className="font-serif text-[clamp(9rem,min(56vw,62svh),40rem)] leading-none tracking-[-0.03em]" style={{ fontWeight: 600 }}>
            T<span className="tak__a">A</span>K
          </p>
        </div>
        <p className="tak__label absolute inset-x-0 top-[clamp(2.5rem,10svh,6rem)] text-center font-label text-[0.75rem] uppercase tracking-[0.32em] text-ink">
          {wedding.ceremony.time} · mówimy sobie
        </p>
        <div aria-hidden className="tak__fade absolute inset-0 bg-bg opacity-0" />
      </div>
    </section>
  );
}
