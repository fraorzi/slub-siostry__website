"use client";

import { GuestOptions, guestInput, tableMates, type SearchProps } from "./search";

/**
 * Winietka: składana karteczka stojąca na stole. Na przodzie gość wpisuje imię, po wyborze winietka
 * obraca się i z tyłu pokazuje numer stołu i sąsiadów. „Szukaj kogoś innego” obraca ją z powrotem.
 */
export function PlaceCardSearch({ api, className = "" }: SearchProps) {
  const { id, focus, picked, reset } = api;
  const mates = tableMates(api);

  return (
    <div className={`placecard ${className}`}>
      <div className={`placecard__flip ${focus ? "is-flipped" : ""}`}>
        <div className={`placecard__face paper ${focus ? "pointer-events-none" : ""}`}>
          <span aria-hidden className="placecard__rule" />
          <label htmlFor={`${id}-q`} className="mt-6 block font-label text-[0.6875rem] uppercase tracking-[0.3em] text-ink-soft">Winietka dla</label>
          <div className="relative mt-3">
            <input {...guestInput(api)} placeholder="Twoje imię i nazwisko" className="placecard__input" />
            <span aria-hidden className="placecard__line foil-bg" />
            <GuestOptions api={api} className="absolute inset-x-0 top-full mt-4" />
          </div>
        </div>

        <div aria-live="polite" className={`placecard__face placecard__face--back paper ${focus ? "" : "pointer-events-none"}`}>
          {focus && (
            <div key={`${focus.table.no}-${picked?.guest ?? ""}`} className="pop grid justify-items-center">
              <p className="font-label text-[0.6875rem] uppercase tracking-[0.3em] text-ink-soft">{picked ? "Twój stół" : "Stół"}</p>
              <p className="foil mt-1 w-max font-serif text-[clamp(5.5rem,13vw,8rem)] leading-[0.85] lining-nums">{focus.table.no}</p>
              {picked && <p className="mt-3 font-serif text-[1.45rem] italic leading-tight">{picked.guest}</p>}
              <span aria-hidden className="foil-bg mt-5 block h-px w-10" />
              <p className="mt-5 font-label text-[0.6875rem] uppercase tracking-[0.24em] text-ink-soft">{picked ? "Obok Ciebie" : "Siedzą tu"}</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-0.5 font-serif text-[1.1rem] leading-snug">
                {mates.map((g) => <li key={g}>{g}</li>)}
              </ul>
              <button type="button" onClick={reset} className="mt-6 cursor-pointer text-[0.875rem] underline decoration-[oklch(75%_0.05_80)] underline-offset-4 hover:decoration-ink">
                Szukaj kogoś innego
              </button>
            </div>
          )}
        </div>
      </div>
      <span aria-hidden className="placecard__shadow" />
    </div>
  );
}
