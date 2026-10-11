"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Table } from "@/data/seating";
import { PlanSvg } from "./PlanSvg";
import { SeatSearch } from "./SeatSearch";
import { useSeats, type Focus } from "./useSeats";
import "./seats.css";

const FAN = [-24, -12, 0, 12, 24, 36, -36, 48];

/** Karta montuje się od nowa dla każdej osoby: najpierw pisze się imię, potem karta się obraca. */
function Escort({ focus }: { focus: Focus | null }) {
  const picked = focus?.guest ?? null;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!focus) return;
    const t = window.setTimeout(() => setFlipped(true), picked ? 1500 : 200);
    return () => window.clearTimeout(t);
  }, [focus, picked]);

  return (
    <div className={`escort ${flipped ? "is-flipped" : ""}`}>
      <div className="escort__face paper">
        <span aria-hidden className="foil-bg mx-auto block h-px w-10" />
        {picked ? <p className="escort__name">{picked.guest}</p> : <p className="escort__name escort__name--empty">Twoje imię</p>}
        <span aria-hidden className="escort__fold" />
      </div>
      <div className="escort__face escort__face--back paper">
        <p className="font-label text-[0.75rem] uppercase tracking-[0.3em] text-ink-soft">{picked ? "Twój stół" : "Stół"}</p>
        <p className="foil mt-2 inline-block font-serif text-[clamp(6rem,16vw,9rem)] leading-[0.85] lining-nums">{focus?.table.no}</p>
        {picked && <p className="mt-3 font-serif text-[1.2rem] italic text-ink-soft">{picked.guest}</p>}
      </div>
    </div>
  );
}

/** Winietka: Twoje imię pisze się kaligrafią, karta obraca się i pokazuje numer stołu. Obok sąsiedzi i mały plan. */
export function SeatsCard({ tables }: { tables: Table[] }) {
  const view = useRef<HTMLElement>(null);
  const api = useSeats(tables, view);
  const { focus, picked, reset } = api;
  const mates = focus ? focus.table.guests.filter((g) => g !== picked?.guest) : [];

  return (
    <>
      <SeatSearch api={api} hint="Wystarczą dwie litery. Polskie znaki nie są potrzebne. Możesz też kliknąć stół na planie obok." />
      <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 items-center gap-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <figure ref={view} aria-live="polite" className="escort-stage">
          <Escort key={focus ? `card-${focus.table.no}-${picked?.guest ?? ""}` : "card"} focus={focus} />
          {focus && (
            <ul key={`mates-${focus.table.no}-${picked?.guest ?? ""}`} className="escort-mates" aria-label={picked ? "Siedzisz z" : "Przy tym stole siedzą"}>
              {mates.map((g, i) => (
                <li key={g} className={`escort-mate paper ${picked ? "is-delayed" : ""}`} style={{ "--fan": `${FAN[i % FAN.length]}deg`, "--i": i } as CSSProperties}>{g}</li>
              ))}
            </ul>
          )}
        </figure>

        <div>
          <p className="font-label text-[0.8125rem] uppercase tracking-[0.2em] text-muted">Plan sali</p>
          <div className="mt-4 rounded-[1.5rem] bg-[oklch(99.2%_0.005_90)] p-3 shadow-[0_1px_2px_oklch(40%_0.03_75/0.1),0_40px_80px_-50px_oklch(30%_0.05_70/0.5)] md:p-5">
            <PlanSvg tables={tables} seats={api.seats} focus={focus} onTable={api.browse} />
          </div>
          {focus ? (
            <button type="button" onClick={reset} className="btn-ghost mt-6">Wybierz inną osobę</button>
          ) : (
            <p className="mt-6 max-w-[34ch] text-muted">Wpisz imię, a winietka sama się wypisze. Zobaczysz też, kto siedzi obok.</p>
          )}
          <p className="mt-6 text-[0.75rem] text-muted">Przykładowa lista gości i plan sali — docelowo prawdziwy układ stołów.</p>
        </div>
      </div>
    </>
  );
}
