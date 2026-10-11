"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, scrollToElement, startSmoothScroll } from "@/lib/scroll";

const FOILS = ".foil, .foil-bg, .btn-gold";

export function Choreography() {
  useEffect(() => {
    const stop = startSmoothScroll();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-time]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => { if (self.isActive && section.dataset.theme) document.body.dataset.theme = section.dataset.theme; },
        });
      });
      if (prefersReducedMotion()) return;

      // Połysk folii: w nowych przeglądarkach liczy go CSS (animation-timeline), tu tylko zapas dla reszty.
      if (!CSS.supports("animation-timeline: scroll()")) {
        let foils = document.querySelectorAll<HTMLElement>(FOILS);
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onRefresh: () => { foils = document.querySelectorAll<HTMLElement>(FOILS); },
          onUpdate: (self) => {
            const t = (self.progress * 7) % 2;
            const shine = (t < 1 ? t : 2 - t).toFixed(3);
            foils.forEach((el) => el.style.setProperty("--shine", shine));
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((frame) => {
        const media = frame.querySelector("img, video");
        // Zaokrąglenie w samym clip-path: bez niego skalowane zdjęcie wychodzi poza okrągłe rogi (artefakty w rogach).
        const radius = getComputedStyle(frame).borderRadius;
        const round = radius && radius !== "0px" ? ` round ${radius}` : "";
        gsap.fromTo(frame, { clipPath: `inset(12% 0% 0% 0%${round})`, opacity: 0.001 }, { clipPath: `inset(0% 0% 0% 0%${round})`, opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 85%", once: true } });
        if (media) gsap.fromTo(media, { scale: 1.14 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    const onAnchor = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const target = link && document.getElementById(link.hash.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToElement(target);
    };
    document.addEventListener("click", onAnchor);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchor);
      ctx.revert();
      stop();
    };
  }, []);

  return null;
}
