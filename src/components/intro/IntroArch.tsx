"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { preload } from "react-dom";
import { LoopVideo } from "@/components/LoopVideo";
import type { VideoSource } from "@/content/media";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { Ampersand } from "./Ampersand";
import { SecretTrigger, useSecret } from "./secret";
import "./intro.css";

const ARCH_DESKTOP = [14, 39, 12, 39];
const ARCH_MOBILE = [22, 18, 22, 18];

const Dual = ({ children }: { children: ReactNode }) => (
  <span className="relative inline-block">
    <span className="dual-ink">{children}</span>
    <span aria-hidden className="dual-pearl absolute inset-0 text-pearl opacity-0">{children}</span>
  </span>
);

const center = (el: Element, stage: DOMRect) => {
  const r = el.getBoundingClientRect();
  return { x: r.left - stage.left + r.width / 2, y: r.top - stage.top + r.height / 2, h: r.height };
};

const video: VideoSource = wedding.media.intro;

// Najdłużej, ile ekran ładowania czeka na pierwszą klatkę wideo i fonty. Potem wejście rusza i tak.
const MAX_WAIT = 4000;

/**
 * Wejście pokazuje się dopiero, gdy jest gotowe: fonty i pierwsza klatka (plakat albo samo wideo).
 * Do tego czasu leży ekran ładowania w kolorze tła, więc nic nie miga: ani inny kadr, ani tekst przed animacją.
 */
const whenReady = (poster: string | undefined, firstFrame: Promise<void>) => {
  const fonts = document.fonts?.ready.then(() => {}) ?? Promise.resolve();
  const frame = poster
    ? (() => { const img = new Image(); img.src = poster; return img.decode().catch(() => {}); })()
    : firstFrame;
  return Promise.race([Promise.all([fonts, frame]), new Promise((r) => window.setTimeout(r, MAX_WAIT))]);
};

export function IntroArch() {
  const root = useRef<HTMLElement>(null);
  const { tap, egg } = useSecret();
  const [frame] = useState(() => {
    let resolve = () => {};
    const promise = new Promise<void>((r) => { resolve = r; });
    return { promise, resolve };
  });
  // Plakat (pierwsza klatka) pobiera się od razu, razem z HTML, zanim ruszy JS.
  if (video.poster) preload(video.poster, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    const section = root.current;
    const stageEl = section?.querySelector<HTMLElement>(".intro__stage");
    const media = section?.querySelector<HTMLElement>(".intro__media");
    const cover = section?.querySelector<HTMLElement>(".intro__cover");
    if (!section || !stageEl || !media || !cover) return;

    const mobile = () => window.matchMedia("(max-width: 860px)").matches;
    const ease = gsap.parseEase("power2.inOut");
    const draw = (p: number) => {
      const e = ease(p);
      const [t, r, b, l] = (mobile() ? ARCH_MOBILE : ARCH_DESKTOP).map((v) => v * (1 - e));
      const width = stageEl.clientWidth * (1 - (r + l) / 100);
      const radius = (width / 2) * (1 - e * e);
      media.style.clipPath = `inset(${t}% ${r}% ${b}% ${l}% round ${radius}px ${radius}px 0px 0px)`;
    };
    draw(0);

    if (prefersReducedMotion()) {
      media.style.clipPath = "none";
      cover.style.display = "none";
      return;
    }

    // Stan początkowy wejścia ustawiony pod zasłoną, animacja rusza dopiero po załadowaniu.
    const intro = gsap.context(() => {
      gsap.set(".intro__names, .intro__date, .amp-glyph, .amp-diamond, .intro__media", { opacity: 0 });
      gsap.set(".amp-flourish", { strokeDasharray: 1, strokeDashoffset: 1 });
    }, section);
    let cancelled = false;
    whenReady(video.poster, frame.promise).then(() => {
      if (cancelled) return;
      intro.add(() => {
        gsap.to(cover, { opacity: 0, duration: 0.8, ease: "power1.out", onComplete: () => { cover.style.display = "none"; } });
        gsap.to(".intro__names, .intro__date", { opacity: 1, duration: 1.6, ease: "power2.out", delay: 0.2, stagger: 0.15 });
        gsap.to(media, { opacity: 1, duration: 1.6, ease: "expo.out", delay: 0.1 });
        gsap.to(".amp-flourish", { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", delay: 0.6 });
        gsap.to(".amp-glyph, .amp-diamond", { opacity: 1, duration: 1.6, ease: "power2.out", delay: 0.4 });
      });
    });

    let scroll: gsap.Context | null = null;
    let lastProgress = -1;
    const build = () => {
      scroll?.revert();
      scroll = gsap.context(() => {
        const stage = stageEl.getBoundingClientRect();
        const ona = section.querySelector(".intro__name--l")!;
        const on = section.querySelector(".intro__name--r")!;
        const amp = section.querySelector(".intro__amp")!;
        const small = mobile();
        const nameScale = small ? 1.1 : 0.64;
        const ampScale = small ? 1.2 : 1.55;
        const a = center(amp, stage), n1 = center(ona, stage), n2 = center(on, stage);
        const mid = { x: stage.width / 2, y: stage.height / 2 };
        const gap = (a.h * ampScale) / 2 + (n1.h * nameScale) / 2 - (small ? 8 : 24);

        const arch = { p: 0 };
        const scrollTrigger = { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 };
        // Przycinanie łuku przerysowuje warstwę wideo, więc liczymy je tylko przy realnej zmianie.
        gsap.to(arch, { p: 1, ease: "none", scrollTrigger, onUpdate: () => {
          const p = Math.round(arch.p * 1000) / 1000;
          if (p !== lastProgress) { lastProgress = p; draw(p); }
        } });

        gsap.timeline({ scrollTrigger, defaults: { ease: "power2.inOut" } })
          .to(ona, { x: mid.x - n1.x, y: mid.y - gap - n1.y, scale: nameScale, duration: 0.7 }, 0.15)
          .to(on, { x: mid.x - n2.x, y: mid.y + gap - n2.y, scale: nameScale, duration: 0.7 }, 0.15)
          .to(amp, { x: mid.x - a.x, y: mid.y - a.y, scale: ampScale, duration: 0.7 }, 0.15)
          .to(".dual-pearl", { opacity: 1, duration: 0.3 }, 0.45)
          .to(".dual-ink", { opacity: 0, duration: 0.3 }, 0.45)
          .to(".intro__veil", { opacity: 1, duration: 0.45 }, 0.4)
          .fromTo(".intro__invite", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, 0.8)
          .set({}, {}, 1);
      }, section);
    };

    build();
    // Na telefonie pasek adresu zmienia wysokość okna przy każdym scrollu. Przebudowujemy tylko przy zmianie szerokości.
    let width = window.innerWidth;
    let timer = 0;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
      scroll?.revert();
      intro.revert();
    };
  }, [frame]);

  const nameClass = "font-serif text-[clamp(3rem,11vw,11rem)] font-normal leading-none tracking-[-0.02em] will-change-transform";

  return (
    <section ref={root} className="intro relative" data-time="14:00" data-theme="day">
      <h1 className="sr-only">{wedding.bride} i {wedding.groom} — zaproszenie na ślub</h1>
      <div className="intro__stage sticky top-0 h-svh overflow-hidden">
        <div className="intro__media absolute inset-0">
          <LoopVideo src={video} eager onFirstFrame={frame.resolve} className="size-full object-cover" />
        </div>
        <div aria-hidden className="intro__veil pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(15%_0.012_70/0.55),oklch(15%_0.012_70/0.25)_70%)] opacity-0" />

        <div aria-hidden className="intro__names pointer-events-none absolute inset-0 grid grid-cols-1 content-between px-gutter pb-[13svh] pt-[9svh] min-[861px]:grid-cols-2 min-[861px]:content-center min-[861px]:py-0">
          <span className={`intro__name--l justify-self-start ${nameClass}`}><Dual>{wedding.bride}</Dual></span>
          <span className={`intro__name--r justify-self-end ${nameClass}`}><Dual>{wedding.groom}</Dual></span>
        </div>

        <SecretTrigger onTap={tap} className="intro__amp absolute left-[calc(50%-clamp(4.5rem,11vw,9rem))] top-[12svh] z-10 w-[clamp(9rem,22vw,18rem)] min-[861px]:top-[6svh]">
          <Ampersand className="block h-auto w-full" />
        </SecretTrigger>

        <p className="intro__invite pointer-events-none absolute inset-x-0 top-[clamp(2.5rem,9svh,5rem)] text-center font-label text-[0.75rem] uppercase tracking-[0.32em] text-pearl opacity-0">
          Zapraszamy na nasz ślub
        </p>
        <div aria-hidden className="intro__cover absolute inset-0 z-20 grid place-items-center bg-bg">
          <span className="intro__loader foil-bg block h-px w-16" />
        </div>
        <p className="intro__date absolute inset-x-0 bottom-[clamp(2rem,6svh,3.5rem)] text-center font-serif text-[1.05rem] tracking-[0.24em] min-[861px]:text-[1.25rem]">
          <Dual>{wedding.dateLabel}</Dual>
        </p>
      </div>
      {egg}
    </section>
  );
}
