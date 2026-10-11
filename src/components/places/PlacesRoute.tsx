import Image from "next/image";
import type { ReactNode } from "react";
import { HourTime, HourTitle, Lead, Place } from "@/components/hour";
import { LoopVideo } from "@/components/LoopVideo";
import { wedding } from "@/content/wedding";

/** Gładka zamknięta krzywa „poziomicy” wokół punktu (Catmull-Rom → Bézier), deterministyczna. */
function contour(cx: number, cy: number, r: number, seed: number) {
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.18 * Math.sin(a * 2 + seed) + 0.1 * Math.cos(a * 3 + seed * 1.7);
    return [cx + Math.cos(a) * r * k * 1.35, cy + Math.sin(a) * r * k];
  });
  const p = (i: number) => pts[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

const HILLS = [
  { x: 180, y: 220, rings: 7, seed: 1.3 },
  { x: 1050, y: 520, rings: 8, seed: 4.1 },
  { x: 320, y: 1150, rings: 6, seed: 2.6 },
  { x: 1180, y: 1350, rings: 5, seed: 5.5 },
];

const Topo = () => (
  <svg aria-hidden viewBox="0 0 1400 1600" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 size-full opacity-60">
    {HILLS.flatMap((h) => Array.from({ length: h.rings }, (_, i) => (
      <path key={`${h.x}-${i}`} d={contour(h.x, h.y, 26 + i * 34, h.seed + i * 0.35)} fill="none" stroke="var(--line)" strokeWidth={i % 4 === 3 ? 1.1 : 0.6} />
    )))}
  </svg>
);


const Stop = ({ flip, media, children }: { flip?: boolean; media: ReactNode; children: ReactNode }) => (
  <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-[clamp(4rem,10vw,9rem)]">
    <div className={flip ? "md:order-2" : ""}>{children}</div>
    <figure data-reveal className={`relative aspect-square w-[min(72%,24rem)] overflow-hidden rounded-full shadow-[0_40px_80px_-40px_oklch(30%_0.05_70/0.6)] ${flip ? "md:order-1 md:justify-self-end" : ""}`}>
      {media}
    </figure>
  </div>
);

export function PlacesRoute() {
  const { ceremony, reception } = wedding;
  return (
    <section id="h15" data-time={ceremony.time} data-theme="day" className="relative overflow-hidden px-gutter py-[clamp(6rem,20vh,12rem)]">
      <Topo />
      <div className="relative mx-auto max-w-6xl">

        <Stop media={<LoopVideo src={ceremony.video} className="absolute inset-0 size-full object-cover" />}>
          <HourTime>{ceremony.time}</HourTime>
          <HourTitle>{ceremony.title}</HourTitle>
          <Lead>{ceremony.lead}</Lead>
          <Place event={ceremony} className="mt-10" />
        </Stop>

        <p className="relative my-[clamp(5rem,16vh,10rem)] font-label text-[0.75rem] uppercase tracking-[0.24em] text-muted md:text-center">
          <span>przejazd · <span className="tbd">XX min</span></span>
        </p>

        <div id="h1630">
          <Stop flip media={<Image src={reception.image} alt="Nakryty stół weselny" fill sizes="(max-width: 860px) 72vw, 24rem" className="object-cover" />}>
            <HourTime>{reception.time}</HourTime>
            <HourTitle>{reception.title}</HourTitle>
            <Lead>{reception.lead}</Lead>
            <Place event={reception} className="mt-10" />
          </Stop>
        </div>
      </div>
    </section>
  );
}
