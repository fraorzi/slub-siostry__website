"use client";

import { useId, type Ref } from "react";
import { headTable, type Table } from "@/data/seating";
import type { Focus, Seat } from "./useSeats";

export const VIEW = { w: 800, h: 580 };
export const FULL = `0 0 ${VIEW.w} ${VIEW.h}`;
const ZOOM = { w: 380, h: 276 };
const TABLE_R = 34;

export const zoomBox = (x: number, y: number) => {
  const left = Math.min(Math.max(x - ZOOM.w / 2, 0), VIEW.w - ZOOM.w);
  const top = Math.min(Math.max(y - ZOOM.h / 2, 0), VIEW.h - ZOOM.h);
  return `${left} ${top} ${ZOOM.w} ${ZOOM.h}`;
};

type Props = { tables: Table[]; seats: Seat[]; focus: Focus | null; onTable?: (t: Table) => void; svgRef?: Ref<SVGSVGElement>; className?: string };

/** Plan sali z góry: krzesła wokół stołów, parkiet, wejście. */
export function PlanSvg({ tables, seats, focus, onTable, svgRef, className = "" }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const picked = focus?.guest ?? null;
  return (
    <svg ref={svgRef} viewBox={FULL} role="group" aria-label="Plan sali ze stołami" className={`plan block h-auto w-full ${focus ? "has-focus" : ""} ${className}`}>
      <defs>
        <linearGradient id={`${uid}-foil`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--pg-deep)" }} />
          <stop offset="0.35" style={{ stopColor: "var(--pg-light)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--pg-rich)" }} />
          <stop offset="1" style={{ stopColor: "var(--pg-mid)" }} />
        </linearGradient>
        <pattern id={`${uid}-parquet`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H14 M0 7 H14" className="parquet" />
          <path d="M7 0 V7 M0 7 V14" className="parquet" />
        </pattern>
      </defs>

      <g className="head">
        {[310, 345, 380, 420, 455, 490].map((x) => <rect key={x} x={x - 7} y="26" width="14" height="9" rx="3" className="chair" />)}
        <rect x="285" y="38" width="230" height="30" rx="15" className="tbl" />
        <text x="400" y="92" className="lbl">{headTable.label}</text>
      </g>

      <rect x="268" y="140" width="264" height="250" rx="4" fill={`url(#${uid}-parquet)`} className="floor" />
      <text x="400" y="270" className="lbl floor-lbl">parkiet</text>

      {tables.map((t) => {
        const hit = focus?.table.no === t.no;
        return (
          <g
            key={t.no}
            role={onTable ? "button" : undefined}
            tabIndex={onTable ? 0 : undefined}
            aria-label={`Stół ${t.no}, ${t.guests.length} miejsc`}
            aria-pressed={onTable ? hit : undefined}
            onClick={onTable && (() => onTable(t))}
            onKeyDown={onTable && ((e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTable(t); } })}
            className={`table ${hit ? "is-hit" : ""} ${onTable ? "cursor-pointer" : ""}`}
          >
            {seats.filter((s) => s.table.no === t.no).map((s) => (
              <rect
                key={s.guest}
                x={s.x - 7}
                y={s.y - 4.5}
                width="14"
                height="9"
                rx="3"
                transform={`rotate(${s.angle + 90} ${s.x} ${s.y})`}
                className={`chair${picked?.guest === s.guest ? " is-you" : ""}`}
                style={hit && picked?.guest !== s.guest ? { fill: `url(#${uid}-foil)` } : undefined}
              />
            ))}
            <circle cx={t.x} cy={t.y} r={TABLE_R} className="tbl" style={hit ? { fill: `url(#${uid}-foil)` } : undefined} />
            <circle cx={t.x} cy={t.y} r={TABLE_R - 5} className="tbl-inner" />
            <text x={t.x} y={t.y} className="tno">{t.no}</text>
          </g>
        );
      })}

      {picked && (() => {
        const right = picked.x >= picked.table.x;
        const x = picked.x + (right ? 14 : -14);
        return (
          <g pointerEvents="none">
            <rect x={right ? x : x - 34} y={picked.y - 11} width="34" height="22" rx="11" fill={`url(#${uid}-foil)`} />
            <text x={right ? x + 17 : x - 17} y={picked.y} className="you">Ty</text>
          </g>
        );
      })()}

      <g className="entrance">
        <path d="M388 560 L400 548 L412 560" />
        <text x="400" y="574" className="lbl">wejście</text>
      </g>
    </svg>
  );
}
