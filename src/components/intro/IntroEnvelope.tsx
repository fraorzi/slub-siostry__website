"use client";

import { useEffect, useRef } from "react";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { Ampersand } from "./Ampersand";
import { SecretTrigger, useSecret } from "./secret";
import "./intro.css";

export function IntroEnvelope() {
  const root = useRef<HTMLElement>(null);
  const { tap, egg } = useSecret();

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const [card] = q(".envelope__card");
    const [flap] = q(".envelope__flap");

    if (prefersReducedMotion()) {
      gsap.set(flap, { rotateX: 180, zIndex: 1 });
      gsap.set(card, { zIndex: 5, y: () => -card.offsetHeight * 0.18 });
      return;
    }

    const intro = gsap.context(() => {
      gsap.from(".envelope", { y: 60, rotate: -4, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.1 });
      gsap.fromTo(flap, { rotateX: 0 }, { rotateX: 14, duration: 1.2, ease: "power2.inOut", delay: 1.1, yoyo: true, repeat: 1, repeatDelay: 0.1 });
      gsap.from(".env-label", { opacity: 0, y: 10, duration: 1.4, ease: "power2.out", delay: 0.5 });
    }, section);

    const scroll = gsap.context(() => {
      const fit = () => Math.min((window.innerWidth * 0.94) / card.offsetWidth, (window.innerHeight * 0.8) / card.offsetHeight);
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.7, invalidateOnRefresh: true }, defaults: { ease: "power2.inOut" } })
        .to(".env-label", { opacity: 0, y: -16, duration: 0.12 }, 0)
        .to(flap, { rotateX: 180, duration: 0.24 }, 0.02)
        .set(flap, { zIndex: 1 }, 0.16)
        .to(card, { y: () => -card.offsetHeight * 0.78, duration: 0.3 }, 0.24)
        .set(card, { zIndex: 6 }, 0.54)
        .to(".envelope__back, .envelope__pocket, .envelope__flap", { y: () => window.innerHeight * 0.75, opacity: 0, duration: 0.32, ease: "power2.in" }, 0.54)
        .to(card, { y: 0, scale: fit, rotate: 0, duration: 0.34 }, 0.56)
        .fromTo(".env-card-video", { scale: 1.25 }, { scale: 1, duration: 0.5, ease: "none" }, 0.4)
        .to(".env-date", { opacity: 0, duration: 0.1 }, 0.5)
        .set({}, {}, 1);
    }, section);

    return () => {
      intro.revert();
      scroll.revert();
    };
  }, []);

  return (
    <section ref={root} className="intro relative !h-[320vh]" data-time="14:00" data-theme="day">
      <h1 className="sr-only">{wedding.bride} i {wedding.groom} — zaproszenie na ślub</h1>
      <div className="intro__stage sticky top-0 grid h-svh place-items-center overflow-hidden">
        <p className="env-label absolute inset-x-0 top-[clamp(2.5rem,12svh,7rem)] text-center font-label text-[0.75rem] uppercase tracking-[0.32em] text-muted">
          Zaproszenie dla Ciebie
        </p>

        <div className="envelope">
          <div className="envelope__back"><div className="envelope__liner" /></div>
          <div className="envelope__pocket" />
          <div className="envelope__flap">
            <div className="envelope__flap-face envelope__flap-face--front" />
            <div className="envelope__flap-face envelope__flap-face--back" />
            <span aria-hidden className="envelope__seal">&amp;</span>
          </div>

          <div className="envelope__card paper grid grid-cols-[38%_1fr] items-stretch gap-[5cqw] p-[4.5cqw] [container-type:inline-size]">
            <div className="relative overflow-hidden rounded-t-full">
              <LoopVideo src={wedding.media.intro} eager className="env-card-video absolute inset-0 size-full object-cover" />
            </div>
            <div className="flex flex-col justify-center text-center">
              <p className="font-label text-[2.1cqw] uppercase tracking-[0.3em] text-ink-soft">Zapraszamy na nasz ślub</p>
              <p className="mt-[3cqw] font-serif text-[11cqw] leading-[0.9] text-ink">{wedding.bride}</p>
              <SecretTrigger onTap={tap} className="mx-auto -my-[1cqw] block w-[26cqw]">
                <Ampersand className="block h-auto w-full" />
              </SecretTrigger>
              <p className="font-serif text-[11cqw] leading-[0.9] text-ink">{wedding.groom}</p>
              <span aria-hidden className="foil-bg mx-auto mt-[3.5cqw] block h-px w-[10cqw]" />
              <p className="mt-[2.5cqw] font-serif text-[2.8cqw] tracking-[0.24em] text-ink">{wedding.dateLabel}</p>
            </div>
          </div>
        </div>

        <p className="env-date absolute inset-x-0 bottom-[clamp(2rem,7svh,4rem)] text-center font-serif text-[1.05rem] tracking-[0.24em] md:text-[1.25rem]">
          {wedding.dateLabel}
        </p>
      </div>
      {egg}
    </section>
  );
}
