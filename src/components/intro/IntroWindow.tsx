"use client";

import { useEffect, useRef } from "react";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { Ampersand } from "./Ampersand";
import { SecretTrigger, useSecret } from "./secret";
import "./intro.css";

export function IntroWindow() {
  const root = useRef<HTMLElement>(null);
  const { tap, egg } = useSecret();

  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const q = gsap.utils.selector(section);
    const [mask] = q(".window__mask");
    const [amp] = q(".window__amp");

    const intro = gsap.context(() => {
      gsap.from(".window__word", { yPercent: 40, opacity: 0, duration: 1.8, ease: "expo.out", stagger: 0.12, delay: 0.15 });
    }, section);

    const scroll = gsap.context(() => {
      const origin = () => {
        const m = mask.getBoundingClientRect();
        const a = amp.getBoundingClientRect();
        return `${a.left - m.left + a.width / 2}px ${a.top - m.top + a.height * 0.62}px`;
      };
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } })
        .set(mask, { transformOrigin: origin }, 0)
        .to(".window__date", { opacity: 0, duration: 0.1 }, 0)
        .to(mask, { scale: 7, ease: "power3.in", duration: 0.55 }, 0.05)
        .to(mask, { opacity: 0, ease: "power1.in", duration: 0.25 }, 0.35)
        .fromTo(".window__veil", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.55)
        .fromTo(".window__after > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.2, ease: "power2.out" }, 0.62)
        .set({}, {}, 1);
    }, section);

    return () => {
      intro.revert();
      scroll.revert();
    };
  }, []);

  return (
    <section ref={root} className="intro relative !h-[300vh]" data-time="14:00" data-theme="day">
      <h1 className="sr-only">{wedding.bride} i {wedding.groom} — zaproszenie na ślub</h1>
      <div className="intro__stage sticky top-0 h-svh overflow-hidden bg-night">
        <LoopVideo src={wedding.media.intro} eager className="absolute inset-0 size-full object-cover" />
        <div aria-hidden className="window__veil absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(15%_0.012_70/0.5),oklch(15%_0.012_70/0.2)_75%)] opacity-0" />

        <div className="window__mask absolute inset-0 grid place-items-center">
          <div aria-hidden className="flex flex-col items-center font-serif font-semibold leading-[0.78] tracking-[-0.04em]">
            <span className="window__word text-[clamp(6rem,min(34vw,36svh),30rem)]">{wedding.bride}</span>
            <SecretTrigger onTap={tap} className="window__word window__amp relative z-10 -my-[2vw] block w-[clamp(9rem,min(30vw,32svh),26rem)]">
              <Ampersand tone="ink" className="block h-auto w-full" />
            </SecretTrigger>
            <span className="window__word text-[clamp(6rem,min(34vw,36svh),30rem)]">{wedding.groom}</span>
          </div>
        </div>

        <p className="window__date absolute inset-x-0 bottom-[clamp(2rem,6svh,3.5rem)] text-center font-serif text-[1.05rem] tracking-[0.24em] text-ink md:text-[1.25rem]">
          {wedding.dateLabel}
        </p>

        <div className="window__after pointer-events-none absolute inset-0 grid place-content-center gap-5 px-gutter text-center text-pearl [&>*]:opacity-0">
          <p className="font-label text-[0.75rem] uppercase tracking-[0.32em]">Zapraszamy na nasz ślub</p>
          <p className="font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.95]">{wedding.bride} <span className="italic">&amp;</span> {wedding.groom}</p>
          <p className="font-serif text-[1.05rem] tracking-[0.24em] md:text-[1.25rem]">{wedding.dateLabel}</p>
        </div>
      </div>
      {egg}
    </section>
  );
}
