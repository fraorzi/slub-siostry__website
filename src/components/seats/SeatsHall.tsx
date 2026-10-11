"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { headTable, type Table } from "@/data/seating";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { VIEW } from "./PlanSvg";
import { SeatDetails, SeatSearch } from "./SeatSearch";
import { useSeats } from "./useSeats";
import "./seats.css";

// Pozycje zaokrąglone: serwer i przeglądarka muszą wypisać identyczne style.
const LIGHTS = Array.from({ length: 23 }, (_, i) => {
  const t = i / 22;
  return { left: `${(t * 100).toFixed(2)}%`, top: `${(62 + Math.sin(t * Math.PI * 4) ** 2 * 22).toFixed(2)}%`, delay: `${((i * 0.37) % 2.4).toFixed(2)}s` };
});

type Shot = { x: number; y: number; zoom: number; fit: number };

const applyShot = (floor: HTMLElement | null, camera: HTMLElement | null, s: Shot) => {
  if (floor) floor.style.transform = `rotateX(var(--tilt)) rotateZ(var(--spin)) translate3d(${-s.x}px, ${-s.y}px, 0)`;
  if (camera) camera.style.transform = `scale(${s.fit * s.zoom})`;
};

/** Sala w rzucie izometrycznym (CSS 3D). Kamera to dwa transformy: skala i przesunięcie podłogi. */
export function SeatsHall({ tables }: { tables: Table[] }) {
  const view = useRef<HTMLElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const shot = useRef<Shot>({ x: VIEW.w / 2, y: VIEW.h / 2 + 20, zoom: 1, fit: 1 });
  const api = useSeats(tables, view);
  const { focus, picked } = api;

  useEffect(() => {
    const el = view.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      shot.current.fit = Math.min(entry.contentRect.width / 860, entry.contentRect.height / 560);
      applyShot(floor.current, camera.current, shot.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const target = focus ? { x: focus.table.x, y: focus.table.y, zoom: 2.3 } : { x: VIEW.w / 2, y: VIEW.h / 2 + 20, zoom: 1 };
    const tween = gsap.to(shot.current, { ...target, duration: prefersReducedMotion() ? 0 : 1.6, ease: "expo.inOut", onUpdate: () => applyShot(floor.current, camera.current, shot.current) });
    return () => { tween.kill(); };
  }, [focus]);

  return (
    <>
      <SeatSearch api={api} hint="Wystarczą dwie litery. Polskie znaki nie są potrzebne. Możesz też kliknąć stół w sali." />
      <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 items-start gap-gutter lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <figure ref={view} className={`hall relative aspect-[1/1.05] overflow-hidden rounded-[2rem] sm:aspect-[4/3] ${focus ? "has-focus" : ""}`}>
          <div ref={camera} className="hall__camera">
            <div ref={floor} className="hall__floor" style={{ width: VIEW.w, height: VIEW.h }}>
              <div className="hall__wall hall__wall--back">
                {LIGHTS.map((l) => <span key={l.left} className="hall__light" style={{ left: l.left, top: l.top, animationDelay: l.delay }} />)}
              </div>
              <div className="hall__wall hall__wall--side" />

              <div className="hall__dance" style={{ left: 268, top: 140, width: 264, height: 250 }}>
                <span className="hall__label">parkiet</span>
              </div>

              <div className="hall__head" style={{ left: 285, top: 38, width: 230, height: 30 }}>
                <span className="hall__slab" style={{ "--z": "10px" } as CSSProperties} />
                <span className="hall__slab" style={{ "--z": "20px" } as CSSProperties} />
                <span className="hall__slab hall__slab--top" style={{ "--z": "28px" } as CSSProperties} />
                <span className="hall__tag" style={{ "--z": "70px" } as CSSProperties}>{headTable.label}</span>
              </div>

              {tables.map((t) => {
                const hit = focus?.table.no === t.no;
                return (
                  <button
                    key={t.no}
                    type="button"
                    onClick={() => api.browse(t)}
                    aria-label={`Stół ${t.no}, ${t.guests.length} miejsc`}
                    aria-pressed={hit}
                    className={`hall__table ${hit ? "is-hit" : ""}`}
                    style={{ left: t.x, top: t.y }}
                  >
                    <span className="hall__glow" />
                    <span className="hall__shadow" />
                    {api.seats.filter((s) => s.table.no === t.no).map((s) => (
                      <span
                        key={s.guest}
                        className={`hall__chair ${picked?.guest === s.guest ? "is-you" : ""}`}
                        style={{ left: Math.round(s.x - t.x), top: Math.round(s.y - t.y), "--a": `${Math.round(s.angle + 90)}deg` } as CSSProperties}
                      >
                        {picked?.guest === s.guest && <span className="hall__you">Ty</span>}
                      </span>
                    ))}
                    <span className="hall__disc" style={{ "--z": "9px" } as CSSProperties} />
                    <span className="hall__disc" style={{ "--z": "18px" } as CSSProperties} />
                    <span className="hall__disc hall__disc--top" style={{ "--z": "27px" } as CSSProperties} />
                    <span className="hall__flame" />
                    <span className="hall__tag hall__tag--no" style={{ "--z": "78px" } as CSSProperties}>{t.no}</span>
                  </button>
                );
              })}

              <span className="hall__label hall__label--entrance" style={{ left: 400, top: 560 }}>wejście</span>
            </div>
          </div>
        </figure>
        <SeatDetails api={api} empty="Wpisz swoje imię, a kamera przeleci do Twojego stołu." className="lg:sticky lg:top-24" />
      </div>
    </>
  );
}
