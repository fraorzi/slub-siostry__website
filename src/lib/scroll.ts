"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};
  const instance = new Lenis({ lerp: 0.085 });
  const tick = (time: number) => instance.raf(time * 1000);
  instance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis = instance;
  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    lenis = null;
  };
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView();
}

export { gsap, ScrollTrigger };
