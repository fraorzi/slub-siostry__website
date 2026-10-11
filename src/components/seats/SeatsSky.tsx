"use client";

import { useEffect, useMemo, useRef } from "react";
import { headTable, type Table } from "@/data/seating";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { FULL, VIEW, zoomBox } from "./PlanSvg";
import { SeatDetails, SeatSearch } from "./SeatSearch";
import { useSeats, type Seat } from "./useSeats";
import "./seats.css";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

const round = (n: number) => Math.round(n * 100) / 100;
const FIELD = Array.from({ length: 150 }, (_, i) => ({ x: round((i * 211.7) % VIEW.w), y: round((i * 97.3 + (i % 7) * 31) % VIEW.h), r: round(0.35 + ((i * 13) % 10) / 14), twinkle: i % 6 === 0 }));

type Star = Seat & { sx: number; sy: number; mag: number };

/** Stoły jako gwiazdozbiory. Twoja gwiazda świeci najjaśniej, linie konstelacji rysują się po wyborze. */
export function SeatsSky({ tables }: { tables: Table[] }) {
  const view = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const api = useSeats(tables, view);
  const { focus, picked } = api;

  const stars = useMemo<Star[]>(() => api.seats.map((s) => {
    const j = hash(s.guest);
    const k = hash(`${s.guest}-y`);
    return { ...s, sx: round(s.x + (j - 0.5) * 34), sy: round(s.y + (k - 0.5) * 34), mag: round(1.3 + j * 1.4) };
  }), [api.seats]);

  useEffect(() => {
    if (!svg.current) return;
    const box = focus ? zoomBox(focus.table.x, focus.table.y) : FULL;
    const tween = gsap.to(svg.current, { attr: { viewBox: box }, duration: prefersReducedMotion() ? 0 : 1.6, ease: "expo.inOut" });
    return () => { tween.kill(); };
  }, [focus]);

  return (
    <>
      <SeatSearch api={api} hint="Wystarczą dwie litery. Polskie znaki nie są potrzebne. Możesz też kliknąć gwiazdozbiór." />
      <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 items-start gap-gutter lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <figure ref={view} className="sky overflow-hidden rounded-[2rem]">
          <svg ref={svg} viewBox={FULL} role="group" aria-label="Plan sali jako mapa nieba" className={`block h-auto w-full ${focus ? "has-focus" : ""}`}>
            <defs>
              <radialGradient id="sky-bg" cx="50%" cy="35%" r="80%">
                <stop offset="0" stopColor="oklch(28% 0.06 265)" />
                <stop offset="0.6" stopColor="oklch(17% 0.04 265)" />
                <stop offset="1" stopColor="oklch(11% 0.025 265)" />
              </radialGradient>
              <radialGradient id="sky-glow">
                <stop offset="0" stopColor="oklch(97% 0.04 90)" stopOpacity="0.9" />
                <stop offset="0.35" stopColor="oklch(88% 0.1 85)" stopOpacity="0.35" />
                <stop offset="1" stopColor="oklch(85% 0.1 85)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sky-band">
                <stop offset="0" stopColor="oklch(80% 0.05 280)" stopOpacity="0.2" />
                <stop offset="0.55" stopColor="oklch(75% 0.05 280)" stopOpacity="0.08" />
                <stop offset="1" stopColor="oklch(70% 0.05 280)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="-400" y="-300" width={VIEW.w + 800} height={VIEW.h + 600} fill="url(#sky-bg)" />
            <ellipse cx="400" cy="290" rx="520" ry="110" transform="rotate(-28 400 290)" fill="url(#sky-band)" />
            <g className="sky__field">
              {FIELD.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} className={f.twinkle ? "sky__twinkle" : undefined} style={f.twinkle ? { animationDelay: `${((i % 5) * 0.7).toFixed(1)}s` } : undefined} />)}
            </g>
            <line className="sky__meteor" x1="0" y1="0" x2="60" y2="22" />

            <g className="sky__head">
              <circle cx="390" cy="50" r="22" fill="url(#sky-glow)" />
              <circle cx="410" cy="50" r="22" fill="url(#sky-glow)" />
              <circle cx="390" cy="50" r="3" className="sky__star" />
              <circle cx="410" cy="50" r="3" className="sky__star" />
              <text x="400" y="84" className="sky__label">{headTable.label}</text>
            </g>

            {tables.map((t) => {
              const own = stars.filter((s) => s.table.no === t.no);
              const hit = focus?.table.no === t.no;
              // Otwarta linia przez gwiazdy (jak prawdziwa konstelacja), nie zamknięty wielokąt.
              const ring = own.map((s) => `${s.sx},${s.sy}`).join(" ");
              return (
                <g
                  key={t.no}
                  role="button"
                  tabIndex={0}
                  aria-label={`Stół ${t.no}, ${t.guests.length} miejsc`}
                  aria-pressed={hit}
                  onClick={() => api.browse(t)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); api.browse(t); } }}
                  className={`sky__constellation ${hit ? "is-hit" : ""}`}
                >
                  <circle cx={t.x} cy={t.y} r="62" fill="transparent" />
                  <polyline key={hit ? "on" : "off"} points={ring} pathLength={1} className="sky__lines" />
                  {own.map((s) => {
                    const you = picked?.guest === s.guest;
                    const right = s.sx >= t.x;
                    return (
                      <g key={s.guest}>
                        {(hit || you) && <circle cx={s.sx} cy={s.sy} r={you ? 26 : 12} fill="url(#sky-glow)" className={you ? "sky__you" : undefined} />}
                        <circle cx={s.sx} cy={s.sy} r={you ? 3.4 : s.mag} className="sky__star" />
                        {hit && (
                          <text x={s.sx + (right ? 7 : -7)} y={s.sy} textAnchor={right ? "start" : "end"} className={`sky__name ${you ? "is-you" : ""}`}>
                            {s.guest}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <text x={t.x} y={t.y + 4} className="sky__label">Stół {ROMAN[t.no] ?? t.no}</text>
                </g>
              );
            })}
          </svg>
        </figure>
        <SeatDetails api={api} empty="Wpisz swoje imię, a niebo przybliży się do Twojej gwiazdy." className="lg:sticky lg:top-24" />
      </div>
    </>
  );
}
