"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/scroll";

type Stop = { y: number; on: boolean };

/**
 * Złota trasa dnia wzdłuż lewego marginesu: przechodzi przez wszystkie sekcje, rysuje się razem ze scrollem
 * (czoło trasy na 60% wysokości ekranu), a na każdej godzinie zapala się przystanek.
 * Kształt liczy się z rzeczywistych pozycji sekcji, więc dopasowuje się do każdego wariantu.
 */
export function RouteThread() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    const track = host?.parentElement;
    if (!host || !track) return;
    const svg = host.querySelector("svg")!;
    const base = svg.querySelector<SVGPathElement>(".route__base")!;
    const gold = svg.querySelector<SVGPathElement>(".route__gold")!;
    const head = svg.querySelector<SVGGElement>(".route__head")!;
    const pins = svg.querySelector<SVGGElement>(".route__pins")!;
    const reduced = prefersReducedMotion();

    let length = 0;
    let stops: Stop[] = [];
    let trigger: ScrollTrigger | null = null;

    const update = (progress: number) => {
      if (!length) return;
      const drawn = length * progress;
      gold.style.strokeDashoffset = String(length - drawn);
      const p = gold.getPointAtLength(drawn);
      head.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      head.style.opacity = progress > 0.001 && progress < 0.999 ? "1" : "0";
      stops.forEach((s, i) => {
        const on = p.y >= s.y - 2;
        if (on !== s.on) {
          s.on = on;
          pins.children[i]?.classList.toggle("is-on", on);
        }
      });
    };

    const build = () => {
      const width = host.clientWidth;
      const height = track.offsetHeight;
      if (!width || !height) return;
      const top = track.getBoundingClientRect().top;
      const xc = width / 2;
      const amp = Math.min(width * 0.32, 18);

      // Przystanek = wielka godzina w sekcji (albo górna ćwiartka sekcji, gdy jej nie ma).
      const ys = [...track.querySelectorAll<HTMLElement>("[data-time]")].map((section) => {
        const marker = section.querySelector(".hour-time");
        const r = (marker ?? section).getBoundingClientRect();
        return Math.round((marker ? r.top + r.height / 2 : r.top + Math.min(r.height * 0.25, 240)) - top);
      }).filter((y, i, all) => y > 0 && y < height && (i === 0 || y - all[i - 1] > 80));

      const points = [0, ...ys, height];
      let d = `M${xc} 0`;
      for (let i = 1; i < points.length; i++) {
        const y0 = points[i - 1], y1 = points[i], gap = y1 - y0;
        // Długi odcinek dostaje dodatkowe zakręty, żeby trasa nie była prostą linią.
        const bends = Math.max(1, Math.round(gap / 700));
        for (let b = 0; b < bends; b++) {
          const a = y0 + (gap * b) / bends, z = y0 + (gap * (b + 1)) / bends, side = (i + b) % 2 ? 1 : -1;
          d += ` C${(xc + side * amp).toFixed(1)} ${(a + (z - a) * 0.3).toFixed(1)} ${(xc - side * amp).toFixed(1)} ${(a + (z - a) * 0.7).toFixed(1)} ${xc} ${z.toFixed(1)}`;
        }
      }

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;
      base.setAttribute("d", d);
      gold.setAttribute("d", d);
      length = gold.getTotalLength();
      gold.style.strokeDasharray = `${length} ${length}`;

      stops = ys.map((y) => ({ y, on: false }));
      pins.replaceChildren(...ys.map((y) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "route__pin");
        g.setAttribute("transform", `translate(${xc} ${y})`);
        g.innerHTML = `<circle class="route__halo" r="9" /><circle class="route__dot" r="3.5" />`;
        return g;
      }));

      trigger?.kill();
      if (reduced) {
        update(1);
        return;
      }
      trigger = ScrollTrigger.create({ trigger: track, start: "top 60%", end: "bottom 60%", onUpdate: (self) => update(self.progress), onRefresh: (self) => update(self.progress) });
      update(trigger.progress);
    };

    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(build); };
    const ro = new ResizeObserver(schedule);
    ro.observe(track);
    ScrollTrigger.addEventListener("refresh", schedule);
    document.fonts?.ready.then(schedule);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", schedule);
      trigger?.kill();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="route pointer-events-none absolute left-0 top-0 z-20 w-(--gutter)">
      <svg className="block w-full overflow-visible">
        <defs>
          <linearGradient id="route-foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="700" spreadMethod="reflect">
            <stop offset="0" style={{ stopColor: "var(--foil-deep)" }} />
            <stop offset="0.45" style={{ stopColor: "var(--foil-light)" }} />
            <stop offset="1" style={{ stopColor: "var(--foil-mid)" }} />
          </linearGradient>
          <radialGradient id="route-glow">
            <stop offset="0" stopColor="oklch(98% 0.05 92)" />
            <stop offset="0.3" stopColor="oklch(88% 0.11 86)" stopOpacity="0.7" />
            <stop offset="1" stopColor="oklch(85% 0.1 85)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path className="route__base" />
        <path className="route__gold" />
        <g className="route__pins" />
        <g className="route__head"><circle r="14" fill="url(#route-glow)" /><circle r="2.6" fill="oklch(99% 0.03 92)" /></g>
      </svg>
    </div>
  );
}
