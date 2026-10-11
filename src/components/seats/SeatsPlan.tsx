"use client";

import { useId, useMemo, useRef, useState } from "react";
import { headTable, type Table } from "@/data/seating";
import { gsap } from "@/lib/scroll";

const normalize = (s: string) => s.toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[̀-ͯ]/g, "");

const VIEW = { w: 800, h: 580 };
const ZOOM = { w: 380, h: 276 };
const TABLE_R = 34;
const CHAIR_R = 50;
const FULL = `0 0 ${VIEW.w} ${VIEW.h}`;

type Seat = { guest: string; table: Table; x: number; y: number; angle: number };
type Focus = { table: Table; guest: Seat | null };

const zoomBox = (x: number, y: number) => {
  const left = Math.min(Math.max(x - ZOOM.w / 2, 0), VIEW.w - ZOOM.w);
  const top = Math.min(Math.max(y - ZOOM.h / 2, 0), VIEW.h - ZOOM.h);
  return `${left} ${top} ${ZOOM.w} ${ZOOM.h}`;
};

export function SeatFinder({ tables }: { tables: Table[] }) {
  const id = useId();
  const uid = id.replace(/[^a-zA-Z0-9]/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const seats = useMemo<Seat[]>(
    () => tables.flatMap((table) => table.guests.map((guest, k) => {
      const angle = (k / table.guests.length) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      return { guest, table, angle, x: table.x + Math.cos(rad) * CHAIR_R, y: table.y + Math.sin(rad) * CHAIR_R };
    })),
    [tables],
  );
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focus, setFocus] = useState<Focus | null>(null);

  const picked = focus?.guest ?? null;
  const q = normalize(query.trim());
  const open = q.length >= 2 && query !== picked?.guest;
  const hits = open ? seats.filter((s) => normalize(s.guest).includes(q)).slice(0, 6) : [];

  const zoomTo = (box: string) => {
    if (svg.current) gsap.to(svg.current, { attr: { viewBox: box }, duration: 1.3, ease: "expo.inOut" });
  };

  const pick = (seat: Seat) => {
    setFocus({ table: seat.table, guest: seat });
    setQuery(seat.guest);
    zoomTo(zoomBox(seat.table.x, seat.table.y));
  };

  const browse = (table: Table) => {
    setFocus({ table, guest: null });
    setQuery("");
    zoomTo(zoomBox(table.x, table.y));
  };

  const reset = () => {
    setFocus(null);
    setQuery("");
    zoomTo(FULL);
    input.current?.focus();
  };

  return (
    <>
      <div className="group/search relative mt-[clamp(2.5rem,6vh,4rem)] max-w-4xl">
        <label htmlFor={`${id}-q`} className="block text-[0.8125rem] uppercase tracking-[0.2em] text-muted transition-colors duration-500 group-focus-within/search:text-fg">
          Znajdź swoje miejsce
        </label>
        <div className="group relative mt-4 flex items-center gap-4 rounded-full bg-[oklch(100%_0_0/0.75)] py-3 pl-6 pr-4 shadow-[inset_0_1px_0_oklch(100%_0_0),0_1px_2px_oklch(40%_0.03_75/0.12),0_20px_50px_-28px_oklch(40%_0.05_75/0.5)] transition-shadow duration-700 ease-soft focus-within:shadow-[inset_0_1px_0_oklch(100%_0_0),0_0_0_7px_oklch(88%_0.07_88/0.35),0_28px_70px_-24px_oklch(62%_0.1_82/0.6)] md:gap-5 md:py-4 md:pl-8 md:pr-5">
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,oklch(95%_0.06_92/0.7),transparent)] opacity-0 transition-[translate,opacity] duration-[1400ms] ease-soft group-focus-within:translate-x-[520%] group-focus-within:opacity-100" />
          </span>
          <svg aria-hidden viewBox="0 0 32 32" className="relative size-6 shrink-0 text-ink-soft transition-[transform,color] duration-500 ease-soft group-focus-within:scale-110 group-focus-within:text-[oklch(62%_0.09_80)] md:size-8">
            <circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M21 21l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            id={`${id}-q`}
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Imię i nazwisko"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={open && hits[active] ? `${id}-opt-${active}` : undefined}
            aria-describedby={`${id}-hint`}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={(e) => {
              if (!open || !hits.length) return;
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % hits.length); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + hits.length) % hits.length); }
              if (e.key === "Enter") { e.preventDefault(); pick(hits[active] ?? hits[0]); }
              if (e.key === "Escape") setQuery("");
            }}
            className="relative min-w-0 flex-1 bg-transparent font-serif text-[clamp(1.8rem,4.6vw,3.4rem)] leading-tight text-ink caret-[oklch(62%_0.09_80)] outline-none placeholder:text-ink-soft/40 focus-visible:outline-none"
          />
          {query && (
            <button type="button" onClick={reset} aria-label="Wyczyść" className="relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-xl leading-none text-ink-soft transition-colors hover:bg-champagne hover:text-ink">
              ×
            </button>
          )}
        </div>
        <p id={`${id}-hint`} className="mt-4 pl-6 text-[0.8125rem] text-muted md:pl-8">Wystarczą dwie litery. Polskie znaki nie są potrzebne. Możesz też kliknąć stół na planie.</p>

        {open && (
          <ul id={`${id}-list`} role="listbox" className="absolute inset-x-0 top-full z-20 -mt-5 overflow-hidden rounded-[1.75rem] bg-ivory p-2 text-ink shadow-[0_30px_70px_-24px_oklch(20%_0.03_70/0.45)]">
            {hits.length ? hits.map((s, i) => (
              <li
                key={s.guest}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                className={`flex cursor-pointer items-baseline justify-between gap-4 rounded-[1.25rem] px-5 py-3 transition-colors ${i === active ? "bg-champagne" : ""}`}
              >
                <span className="font-serif text-[1.5rem]">{s.guest}</span>
                <span className="whitespace-nowrap text-[0.8125rem] text-ink-soft">stół {s.table.no}</span>
              </li>
            )) : <li className="px-5 py-4 text-muted">Nie ma takiej osoby na liście. Sprawdź pisownię albo zapytaj świadków.</li>}
          </ul>
        )}
      </div>

      <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 items-start gap-gutter lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <figure className="rounded-[2rem] bg-[oklch(99.2%_0.005_90)] p-4 shadow-[0_1px_2px_oklch(40%_0.03_75/0.1),0_50px_100px_-50px_oklch(30%_0.05_70/0.5)] md:p-8">
          <div>
            <svg
              ref={svg}
              viewBox={FULL}
              role="group"
              aria-label="Plan sali ze stołami"
              className={`plan block h-auto w-full ${focus ? "has-focus" : ""}`}
            >
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
                    role="button"
                    tabIndex={0}
                    aria-label={`Stół ${t.no}, ${t.guests.length} miejsc`}
                    aria-pressed={hit}
                    onClick={() => browse(t)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); browse(t); } }}
                    className={`table ${hit ? "is-hit" : ""}`}
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
                  <g className="you-tag" pointerEvents="none">
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
          </div>
        </figure>

        <div aria-live="polite" className="lg:sticky lg:top-24">
          {focus ? (
            <>
              <p className="text-[0.8125rem] uppercase tracking-[0.16em] text-muted">{picked ? "Twój stół" : "Stół"}</p>
              <p className="foil mt-1 inline-block font-serif text-[clamp(5rem,10vw,8rem)] leading-[0.85]">{focus.table.no}</p>
              <p className="mt-6 text-muted">{picked ? "Siedzisz z:" : "Przy tym stole siedzą:"}</p>
              <ul className="mt-3 grid gap-2 font-serif text-[1.35rem] leading-tight">
                {focus.table.guests.filter((g) => g !== picked?.guest).map((g) => (
                  <li key={g} className="flex items-center gap-3"><span aria-hidden className="foil-bg size-1.5 shrink-0 rotate-45" />{g}</li>
                ))}
              </ul>
              <button type="button" onClick={reset} className="mt-8 cursor-pointer whitespace-nowrap rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-fg">
                Pokaż całą salę
              </button>
            </>
          ) : (
            <>
              <p className="font-serif text-[clamp(1.8rem,2.6vw,2.4rem)] leading-tight">Wpisz swoje imię, a plan przybliży się do Twojego krzesła.</p>
              <p className="mt-4 text-muted">Zobaczysz też, kto siedzi obok.</p>
            </>
          )}
          <p className="mt-8 text-[0.75rem] text-muted">Przykładowa lista gości i plan sali — docelowo prawdziwy układ stołów.</p>
        </div>
      </div>
    </>
  );
}
