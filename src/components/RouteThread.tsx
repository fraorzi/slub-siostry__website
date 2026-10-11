"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/scroll";

type Stop = { y: number; on: boolean };

const SVG_NS = "http://www.w3.org/2000/svg";
const f = (n: number) => n.toFixed(1);

/**
 * Złota trasa dnia: płynie marginesem przez kolejne sekcje, na granicy sekcji miękkim łukiem przechodzi
 * na drugą stronę strony (lewo, prawo, lewo…). Czoło trasy jest zawsze na 60% wysokości ekranu,
 * a na każdej godzinie zapala się przystanek. Kształt liczy się z rzeczywistych pozycji sekcji.
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
    // Tablica wysokość → długość trasy: trasa idzie zawsze w dół, więc wysokość jednoznacznie wyznacza punkt.
    let lutY: number[] = [];
    let lutL: number[] = [];
    let trigger: ScrollTrigger | null = null;

    const lengthAtY = (y: number) => {
      if (!lutY.length) return 0;
      if (y <= lutY[0]) return 0;
      if (y >= lutY[lutY.length - 1]) return length;
      let lo = 0, hi = lutY.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (lutY[mid] < y) lo = mid; else hi = mid;
      }
      const t = (y - lutY[lo]) / Math.max(1e-6, lutY[hi] - lutY[lo]);
      return lutL[lo] + (lutL[hi] - lutL[lo]) * t;
    };

    const update = (headY: number) => {
      if (!length) return;
      const drawn = lengthAtY(headY);
      gold.style.strokeDashoffset = String(length - drawn);
      const p = gold.getPointAtLength(drawn);
      head.setAttribute("transform", `translate(${f(p.x)} ${f(p.y)})`);
      head.style.opacity = drawn > 1 && drawn < length - 1 ? "1" : "0";
      stops.forEach((s, i) => {
        const on = headY >= s.y - 2;
        if (on !== s.on) {
          s.on = on;
          pins.children[i]?.classList.toggle("is-on", on);
        }
      });
    };

    const headY = () => window.scrollY + window.innerHeight * 0.6 - (track.getBoundingClientRect().top + window.scrollY);

    const build = () => {
      const width = host.clientWidth;
      const height = track.offsetHeight;
      if (!width || !height) return;
      const top = track.getBoundingClientRect().top;
      const gutter = host.querySelector<HTMLElement>(".route__probe")?.offsetWidth || 24;
      const sideX = [gutter / 2, width - gutter / 2];
      const bulge = Math.min(gutter * 0.35, 18);

      const sections = [...track.querySelectorAll<HTMLElement>(":scope > [data-time]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top - top, bottom: r.bottom - top };
      });
      if (!sections.length) return;

      // Odcinek w sekcji: łagodny łuk do środka strony. Przejście między sekcjami: miękka „esowata” krzywa
      // z pionowymi stycznymi, więc trasa nie łamie się na zakrętach.
      let side = 0;
      let y = 0;
      let d = `M${f(sideX[side])} 0`;
      sections.forEach((s, i) => {
        const next = sections[i + 1];
        const x = sideX[side];
        const inward = side === 0 ? 1 : -1;
        const reach = next ? Math.min(320, (s.bottom - s.top) * 0.35, (next.bottom - next.top) * 0.35) : 0;
        const end = next ? s.bottom - reach : height;
        if (end > y) {
          const span = end - y;
          d += ` C${f(x + inward * bulge)} ${f(y + span * 0.33)} ${f(x + inward * bulge)} ${f(y + span * 0.67)} ${f(x)} ${f(end)}`;
          y = end;
        }
        if (next) {
          const nx = sideX[1 - side];
          const to = s.bottom + reach;
          d += ` C${f(x)} ${f(s.bottom)} ${f(nx)} ${f(s.bottom)} ${f(nx)} ${f(to)}`;
          y = to;
          side = 1 - side;
        }
      });

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;
      base.setAttribute("d", d);
      gold.setAttribute("d", d);
      length = gold.getTotalLength();
      gold.style.strokeDasharray = `${length} ${length}`;

      lutY = [];
      lutL = [];
      let maxY = -Infinity;
      for (let l = 0; l <= length; l += 6) {
        maxY = Math.max(maxY, gold.getPointAtLength(l).y);
        lutY.push(maxY);
        lutL.push(l);
      }

      // Przystanek = wielka godzina w sekcji (albo górna część sekcji, gdy godziny nie ma).
      const ys = sections.map((s) => {
        const marker = s.el.querySelector(".hour-time");
        if (!marker) return Math.round(s.top + Math.min((s.bottom - s.top) * 0.25, 240));
        const r = marker.getBoundingClientRect();
        return Math.round(r.top - top + r.height / 2);
      }).filter((v, i, all) => v > 0 && v < height && (i === 0 || v - all[i - 1] > 80));

      stops = ys.map((v) => ({ y: v, on: false }));
      pins.replaceChildren(...ys.map((v) => {
        const p = gold.getPointAtLength(lengthAtY(v));
        const g = document.createElementNS(SVG_NS, "g");
        g.setAttribute("class", "route__pin");
        g.setAttribute("transform", `translate(${f(p.x)} ${f(p.y)})`);
        g.innerHTML = `<circle class="route__halo" r="9" /><circle class="route__dot" r="3.5" />`;
        return g;
      }));

      trigger?.kill();
      if (reduced) {
        update(height);
        return;
      }
      trigger = ScrollTrigger.create({ trigger: track, start: "top bottom", end: "bottom top", onUpdate: () => update(headY()), onRefresh: () => update(headY()) });
      update(headY());
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
    <div ref={root} aria-hidden className="route pointer-events-none absolute inset-x-0 top-0 z-20">
      <span className="route__probe absolute h-0 w-(--gutter)" />
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
