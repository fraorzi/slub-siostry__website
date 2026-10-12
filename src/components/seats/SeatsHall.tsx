"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent } from "react";
import { headTable, type Table } from "@/data/seating";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { AddressEnvelope } from "./AddressEnvelope";
import { EnvelopeSearch } from "./EnvelopeSearch";
import type { SearchProps } from "./search";
import { TagEnvelope } from "./TagEnvelope";
import { useSeats } from "./useSeats";
import type { SearchVariant } from "./variants";
import { VariantSwitch } from "./VariantSwitch";
import { WindowEnvelope } from "./WindowEnvelope";
import "./seats.css";

const VIEW = { w: 800, h: 580 };

const SEARCHES: Record<SearchVariant, ComponentType<SearchProps>> = {
  obecna: EnvelopeSearch,
  adres: AddressEnvelope,
  okienko: WindowEnvelope,
  bilecik: TagEnvelope,
};

// Pozycje zaokrąglone: serwer i przeglądarka muszą wypisać identyczne style.
const LIGHTS = Array.from({ length: 23 }, (_, i) => {
  const t = i / 22;
  return { left: `${(t * 100).toFixed(2)}%`, top: `${(62 + Math.sin(t * Math.PI * 4) ** 2 * 22).toFixed(2)}%`, delay: `${((i * 0.37) % 2.4).toFixed(2)}s` };
});

type Shot = { x: number; y: number; zoom: number; fit: number };
type Drag = { id: number; x: number; y: number; sx: number; sy: number; moved: boolean };

// Muszą zgadzać się z --tilt i --spin w seats.css (przeliczanie przeciągnięcia na ruch po podłodze).
const TILT = (56 * Math.PI) / 180;
const SPIN = (-32 * Math.PI) / 180;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const applyShot = (floor: HTMLElement | null, camera: HTMLElement | null, s: Shot) => {
  if (floor) floor.style.transform = `rotateX(var(--tilt)) rotateZ(var(--spin)) translate3d(${-s.x}px, ${-s.y}px, 0)`;
  if (camera) camera.style.transform = `scale(${s.fit * s.zoom})`;
};

type Props = { tables: Table[]; variant: SearchVariant; compare?: boolean };

/**
 * Sala w rzucie izometrycznym (CSS 3D). Kamera to dwa transformy: skala i przesunięcie podłogi.
 * Obok koperta z wyszukiwarką miejsca w jednej z wersji do porównania (`compare` pokazuje przełącznik).
 */
export function SeatsHall({ tables, variant, compare = false }: Props) {
  const [kind, setKind] = useState(variant);
  const Search = SEARCHES[kind];
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const shot = useRef<Shot>({ x: VIEW.w / 2, y: VIEW.h / 2 + 20, zoom: 1, fit: 1 });
  const search = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const dragged = useRef(false);
  const api = useSeats(tables, search);
  const { focus, picked } = api;

  // Przeciąganie sali: ruch palca/myszy przeliczony na przesunięcie po obróconej i pochylonej podłodze.
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    dragged.current = false;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: shot.current.x, sy: shot.current.y, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      d.moved = true;
      dragged.current = true;
      gsap.killTweensOf(shot.current);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const scale = shot.current.fit * shot.current.zoom;
    const u = dx / scale, v = dy / scale / Math.cos(TILT);
    const fx = u * Math.cos(-SPIN) - v * Math.sin(-SPIN);
    const fy = u * Math.sin(-SPIN) + v * Math.cos(-SPIN);
    shot.current.x = clamp(d.sx - fx, 0, VIEW.w);
    shot.current.y = clamp(d.sy - fy, 0, VIEW.h);
    applyShot(floor.current, camera.current, shot.current);
  };
  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };
  const browse = (t: Table) => { if (!dragged.current) api.browse(t); };

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
    <div ref={root} className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 items-start gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div ref={search} className="relative z-10 lg:sticky lg:top-24"><Search api={api} /></div>
      <figure
        ref={view}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`hall relative aspect-[1/1.05] overflow-hidden rounded-[2rem] sm:aspect-[4/3] ${focus ? "has-focus touch-none" : "touch-pan-y"}`}
      >
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
              </div>
              <span className="hall__label hall__label--head" style={{ left: 285, top: 78, width: 230 }}>{headTable.label}</span>

              {tables.map((t) => {
                const hit = focus?.table.no === t.no;
                return (
                  <button
                    key={t.no}
                    type="button"
                    onClick={() => browse(t)}
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
      {compare && <VariantSwitch value={kind} onChange={setKind} section={root} />}
    </div>
  );
}
