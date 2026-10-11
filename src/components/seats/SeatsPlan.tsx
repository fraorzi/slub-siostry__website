"use client";

import { useEffect, useRef } from "react";
import type { Table } from "@/data/seating";
import { gsap } from "@/lib/scroll";
import { FULL, PlanSvg, zoomBox } from "./PlanSvg";
import { SeatDetails, SeatSearch } from "./SeatSearch";
import { useSeats } from "./useSeats";
import "./seats.css";

export function SeatsPlan({ tables }: { tables: Table[] }) {
  const view = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const api = useSeats(tables, view);
  const { focus } = api;

  useEffect(() => {
    if (!svg.current) return;
    const box = focus ? zoomBox(focus.table.x, focus.table.y) : FULL;
    const tween = gsap.to(svg.current, { attr: { viewBox: box }, duration: 1.3, ease: "expo.inOut" });
    return () => { tween.kill(); };
  }, [focus]);

  return (
    <>
      <SeatSearch api={api} />
      <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 items-start gap-gutter lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <figure ref={view} className="rounded-[2rem] bg-[oklch(99.2%_0.005_90)] p-4 shadow-[0_1px_2px_oklch(40%_0.03_75/0.1),0_50px_100px_-50px_oklch(30%_0.05_70/0.5)] md:p-8">
          <PlanSvg tables={tables} seats={api.seats} focus={focus} onTable={api.browse} svgRef={svg} />
        </figure>
        <SeatDetails api={api} className="lg:sticky lg:top-24" />
      </div>
    </>
  );
}
