"use client";

import type { CSSProperties } from "react";
import { wedding } from "@/content/wedding";
import { GuestOptions, guestInput, type SearchProps } from "./search";

const SEATS = 6;

/** Pozycja krzesła na okręgu (w % kwadratu), zaokrąglona: serwer i przeglądarka muszą wypisać to samo. */
const around = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;
  return { left: `${(50 + Math.cos(rad) * r).toFixed(2)}%`, top: `${(50 + Math.sin(rad) * r).toFixed(2)}%` };
};

/**
 * Pieczęć: złota pieczęć jest stołem, wokół niej krzesła. Gość wpisuje imię pod spodem, pieczęć
 * odbija się na nowo z numerem stołu, a przy krzesłach pojawiają się imiona (w tej samej kolejności co na sali).
 */
export function SealSearch({ api, className = "" }: SearchProps) {
  const { id, focus, picked, reset, seats } = api;
  const table = focus ? seats.filter((s) => s.table.no === focus.table.no) : [];
  const chairs = table.length ? table : Array.from({ length: SEATS }, (_, k) => ({ guest: "", angle: (k / SEATS) * 360 - 90 }));

  return (
    <div className={`seal-search mx-auto grid w-[min(100%,30rem)] justify-items-center text-center ${className}`}>
      <div aria-live="polite" className="seal-search__table">
        <span aria-hidden className="seal-search__ring" />
        {chairs.map((c, k) => {
          const you = Boolean(picked && c.guest === picked.guest);
          const [first, ...rest] = c.guest.split(" ");
          const side = Math.cos((c.angle * Math.PI) / 180);
          return (
            <span key={`${focus?.table.no ?? 0}-${k}`} aria-hidden={!c.guest} className="seal-search__seat" style={around(c.angle, 25)}>
              <span className={`seal-search__chair ${you ? "is-you" : ""}`} />
              {c.guest && (
                <span
                  className={`seal-search__name pop ${you ? "is-you" : ""}`}
                  style={{ ...labelAt(c.angle, side), animationDelay: `${0.35 + k * 0.06}s` } as CSSProperties}
                >
                  {you ? "Ty" : <>{first}<br />{rest.join(" ")}</>}
                </span>
              )}
            </span>
          );
        })}
        <div key={focus ? `${focus.table.no}-${picked?.guest ?? ""}` : "idle"} className={`seal-search__wax ${focus ? "is-stamped" : ""}`}>
          {focus ? (
            <span className="grid justify-items-center">
              <span className="font-label text-[0.625rem] uppercase tracking-[0.3em] opacity-70">stół</span>
              <span className="font-serif text-[clamp(3.25rem,9vw,4.5rem)] leading-[0.85] lining-nums">{focus.table.no}</span>
            </span>
          ) : (
            <span className="font-serif text-[clamp(1.75rem,5vw,2.4rem)] italic">{wedding.bride[0]}·{wedding.groom[0]}</span>
          )}
        </div>
      </div>

      <label htmlFor={`${id}-q`} className="mt-4 block font-label text-[0.6875rem] uppercase tracking-[0.3em] text-muted">
        {picked ? "Twoje miejsce" : focus ? `Stół ${focus.table.no}` : "Twoje imię i nazwisko"}
      </label>
      <div className="relative mt-2 w-full">
        <input {...guestInput(api, true)} placeholder={focus ? "Szukaj kogoś innego" : "Wpisz, kim jesteś"} className="placecard__input" />
        <span aria-hidden className="placecard__line foil-bg" />
        <GuestOptions api={api} className="absolute inset-x-0 top-full mt-4" />
      </div>
      {focus && (
        <button type="button" onClick={reset} className="mt-5 cursor-pointer text-[0.875rem] text-muted underline decoration-line underline-offset-4 hover:decoration-fg">
          Wyczyść
        </button>
      )}
    </div>
  );
}

/** Podpis krzesła odsunięty na zewnątrz okręgu: po lewej wyrównany do prawej i odwrotnie. */
function labelAt(angle: number, side: number): CSSProperties {
  const rad = (angle * Math.PI) / 180;
  const dy = Math.sin(rad);
  const x = side > 0.3 ? "0%" : side < -0.3 ? "-100%" : "-50%";
  const y = dy < -0.5 ? "-100%" : dy > 0.5 ? "0%" : "-50%";
  const offset = (v: number) => `${Math.round(v * 22)}px`;
  return {
    transform: `translate(calc(${x} + ${offset(Math.cos(rad))}), calc(${y} + ${offset(dy)}))`,
    textAlign: side > 0.3 ? "left" : side < -0.3 ? "right" : "center",
  };
}
