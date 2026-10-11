"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, scrollToElement, startSmoothScroll } from "@/lib/scroll";

export function Choreography() {
  useEffect(() => {
    const stop = startSmoothScroll();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const video = e.target as HTMLVideoElement;
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }),
      { threshold: 0.05 },
    );
    document.querySelectorAll<HTMLVideoElement>("video[data-autoplay]").forEach((v) => io.observe(v));

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
      let foils = document.querySelectorAll<HTMLElement>(".foil, .foil-bg, .btn-gold");
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onRefresh: () => { foils = document.querySelectorAll<HTMLElement>(".foil, .foil-bg, .btn-gold"); },
        onUpdate: (self) => {
          const t = (self.progress * 7) % 2;
          const shine = (t < 1 ? t : 2 - t).toFixed(4);
          foils.forEach((el) => el.style.setProperty("--shine", shine));
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((frame) => {
        const media = frame.querySelector("img, video");
        gsap.fromTo(frame, { clipPath: "inset(12% 0% 0% 0%)", opacity: 0.001 }, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 85%", once: true } });
        if (media) gsap.fromTo(media, { scale: 1.14 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-thread]").forEach((line) => {
        const track = { trigger: line.parentElement, start: "top 60%", end: "bottom 60%", scrub: 0.4, invalidateOnRefresh: true };
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: track });
        const bead = line.parentElement?.querySelector("[data-bead]");
        if (bead) gsap.fromTo(bead, { y: 0 }, { y: () => line.offsetHeight, ease: "none", scrollTrigger: track });
      });
      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: line, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    });

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
      document.removeEventListener("click", onAnchor);
      ctx.revert();
      io.disconnect();
      stop();
    };
  }, []);

  return null;
}
