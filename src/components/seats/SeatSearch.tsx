"use client";

import type { SeatsApi } from "./useSeats";

export function SeatSearch({ api, hint = "Wystarczą dwie litery. Polskie znaki nie są potrzebne. Możesz też kliknąć stół na planie.", className = "" }: { api: SeatsApi; hint?: string; className?: string }) {
  const { id, input, query, change, active, setActive, hits, open, pick, reset, onKeyDown } = api;
  return (
    <div className={`group/search relative mt-[clamp(2.5rem,6vh,4rem)] max-w-4xl ${className}`}>
      <label htmlFor={`${id}-q`} className="block font-label text-[0.8125rem] uppercase tracking-[0.2em] text-muted transition-colors duration-500 group-focus-within/search:text-fg">
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
          enterKeyHint="search"
          placeholder="Imię i nazwisko"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && hits[active] ? `${id}-opt-${active}` : undefined}
          aria-describedby={`${id}-hint`}
          value={query}
          onChange={(e) => change(e.target.value)}
          onKeyDown={onKeyDown}
          className="relative min-w-0 flex-1 bg-transparent font-serif text-[clamp(1.8rem,4.6vw,3.4rem)] leading-tight text-ink caret-[oklch(62%_0.09_80)] outline-none placeholder:text-ink-soft/40 focus-visible:outline-none"
        />
        {query && (
          <button type="button" onClick={reset} aria-label="Wyczyść" className="relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-xl leading-none text-ink-soft transition-colors hover:bg-champagne hover:text-ink">
            ×
          </button>
        )}
      </div>
      <p id={`${id}-hint`} className="mt-4 pl-6 text-[0.8125rem] text-muted md:pl-8">{hint}</p>

      {open && (
        <ul id={`${id}-list`} role="listbox" className="absolute inset-x-0 top-full z-20 -mt-5 overflow-hidden rounded-[1.75rem] bg-ivory p-2 text-ink shadow-[0_30px_70px_-24px_oklch(20%_0.03_70/0.45)]">
          {hits.length ? hits.map((s, i) => (
            <li
              key={`${s.table.no}-${s.guest}`}
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
  );
}

export function SeatDetails({ api, empty, className = "" }: { api: SeatsApi; empty?: string; className?: string }) {
  const { focus, picked, reset } = api;
  return (
    <div aria-live="polite" className={className}>
      {focus ? (
        <>
          <p className="font-label text-[0.8125rem] uppercase tracking-[0.16em] text-muted">{picked ? "Twój stół" : "Stół"}</p>
          <p className="foil mt-1 inline-block font-serif text-[clamp(5rem,10vw,8rem)] leading-[0.85] lining-nums">{focus.table.no}</p>
          <p className="mt-6 text-muted">{picked ? "Siedzisz z:" : "Przy tym stole siedzą:"}</p>
          <ul className="mt-3 grid gap-2 font-serif text-[1.35rem] leading-tight">
            {focus.table.guests.filter((g) => g !== picked?.guest).map((g) => (
              <li key={g} className="flex items-center gap-3"><span aria-hidden className="foil-bg size-1.5 shrink-0 rotate-45" />{g}</li>
            ))}
          </ul>
          <button type="button" onClick={reset} className="btn-ghost mt-8">Pokaż całą salę</button>
        </>
      ) : (
        <>
          <p className="font-serif text-[clamp(1.8rem,2.6vw,2.4rem)] leading-tight">{empty ?? "Wpisz swoje imię, a plan przybliży się do Twojego krzesła."}</p>
          <p className="mt-4 text-muted">Zobaczysz też, kto siedzi obok.</p>
        </>
      )}
      <p className="mt-8 text-[0.75rem] text-muted">Przykładowa lista gości i plan sali — docelowo prawdziwy układ stołów.</p>
    </div>
  );
}
