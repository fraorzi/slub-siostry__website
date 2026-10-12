"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";

type Props = { header: ReactNode; details: ReactNode; figure: ReactNode };

/**
 * Ślub o 15:00. Na początku wideo z ceremonii gra w wielkim „TAK” (mix-blend: screen na kości słoniowej).
 * Scroll zmniejsza napis i odkłada go dokładnie na słowo „TAK” w nagłówku (ten sam krój, wielkie litery),
 * pod koniec lotu wideo w literach płynnie ciemnieje do koloru tekstu, a wokół pojawia się sekcja.
 * Cała treść ślubu leży w przypiętej scenie; na telefonie wideo w łuku jest pod nią, bo się nie mieści.
 */
export function TakCeremony({ header, details, figure }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const [word] = q(".tak__word");
    const [target] = q(".tak__target");
    const [head] = q(".tak__header");
    const rest = q(".tak__rest");
    if (!word || !target || !head) return;

    if (prefersReducedMotion()) {
      gsap.set(q(".tak__window, .tak__label"), { opacity: 0 });
      gsap.set([head, target, ...rest], { opacity: 1 });
      return;
    }

    // Przesunięcie i skala liczone z prawdziwych pozycji: napis ląduje dokładnie na słowie w nagłówku.
    const fly = () => {
      const a = word.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      return { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.height / a.height };
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".tak__pin", start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      tl.to(".tak__label", { opacity: 0, y: -20, duration: 0.1 }, 0.05)
        .to(word, { x: () => fly().x, y: () => fly().y, scale: () => fly().scale, ease: "power2.inOut", duration: 0.55 }, 0.12)
        .fromTo(head, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.4)
        .fromTo(".tak__dim", { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.2 }, 0.47)
        // Litery są już w kolorze tekstu i dokładnie na miejscu: podmiana na słowo w nagłówku jest niewidoczna.
        .set(target, { opacity: 1 }, 0.68)
        .set(".tak__window", { opacity: 0 }, 0.68)
        .fromTo(rest, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.18 }, 0.66)
        .set({}, {}, 1);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="h15" data-time={wedding.ceremony.time} data-theme="day" className="relative">
      <div className="tak__pin relative h-[230vh] motion-reduce:h-auto">
        <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto">
          <div aria-hidden className="tak__window absolute inset-0 motion-reduce:hidden">
            <LoopVideo src={wedding.ceremony.video} className="absolute inset-0 size-full object-cover" />
            <div className="tak__dim absolute inset-0 bg-fg opacity-0" />
            <div className="absolute inset-0 grid place-items-center bg-ivory text-black mix-blend-screen">
              <p className="tak__word font-serif text-[clamp(9rem,min(56vw,62svh),40rem)] leading-none tracking-[-0.03em] will-change-transform" style={{ fontWeight: 600 }}>TAK</p>
            </div>
          </div>
          <p className="tak__label absolute inset-x-0 top-[clamp(2.5rem,10svh,6rem)] text-center font-label text-[0.75rem] uppercase tracking-[0.32em] text-ink motion-reduce:hidden">
            {wedding.ceremony.time} · mówimy sobie
          </p>
          <div className="absolute inset-0 grid content-center px-gutter motion-reduce:static motion-reduce:py-[clamp(6rem,20vh,12rem)]">
            <div className="grid grid-cols-12 items-center gap-gutter">
              <div className="col-span-12 md:col-span-6">
                <div className="tak__header opacity-0">{header}</div>
                <div className="tak__rest opacity-0">{details}</div>
              </div>
              <div className="tak__rest col-span-5 col-start-8 hidden opacity-0 md:block">{figure}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-gutter pb-[clamp(5rem,16vh,10rem)] md:hidden">
        <div className="ml-auto w-[78%]">{figure}</div>
      </div>
      <div className="hidden pb-[clamp(3rem,10vh,6rem)] md:block" />
    </section>
  );
}
