"use client";

import { GuestOptions, guestInput, tableMates, type SearchProps } from "./search";

const list = new Intl.ListFormat("pl", { type: "conjunction" });

/**
 * Zdanie: bez koperty i ramek, sama typografia. Gość dopisuje się do zdania „Nazywam się …”,
 * a odpowiedź pojawia się jako dalszy ciąg: wielki numer stołu z folii i lista sąsiadów.
 */
export function SentenceSearch({ api, className = "" }: SearchProps) {
  const { id, query, focus, picked, reset } = api;
  const mates = tableMates(api);
  const placeholder = "imię i nazwisko";

  return (
    <div className={`sentence ${className}`}>
      <label htmlFor={`${id}-q`} className="sr-only">Twoje imię i nazwisko</label>
      <div className="relative">
        <p className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.2]">
          Nazywam się{" "}
          <span className="sentence__slot">
            {/* Niewidoczna kopia tekstu rozpycha pole do szerokości wpisanego imienia. */}
            <span aria-hidden className="sentence__sizer">{query || placeholder}</span>
            <input {...guestInput(api, true)} placeholder={placeholder} size={1} className="sentence__input" />
            <span aria-hidden className="sentence__line foil-bg" />
          </span>
          .
        </p>
        <GuestOptions api={api} className="absolute inset-x-0 top-full mt-3 max-w-[26rem]" />
      </div>

      <div aria-live="polite" className="mt-[clamp(1.75rem,4vh,2.5rem)] min-h-[9rem]">
        {focus && (
          <div key={`${focus.table.no}-${picked?.guest ?? ""}`} className="pop">
            <p className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.25]">
              {picked ? "Siedzisz przy stole" : "Przy stole"}{" "}
              <span className="foil inline-block w-max align-[-0.12em] text-[2.6em] leading-[0.8] lining-nums">{focus.table.no}</span>
              {picked ? "," : " siedzą"}
            </p>
            <p className="mt-3 max-w-[34ch] font-serif text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug text-muted">
              {picked ? "a obok Ciebie " : ""}{list.format(mates)}.
            </p>
            <button type="button" onClick={reset} className="mt-6 cursor-pointer text-[0.875rem] text-muted underline decoration-line underline-offset-4 hover:decoration-fg">
              Szukaj kogoś innego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
