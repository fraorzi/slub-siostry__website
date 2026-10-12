"use client";

import type { InputHTMLAttributes, Ref } from "react";
import type { SeatsApi } from "./useSeats";

export type SearchProps = { api: SeatsApi; className?: string };

/**
 * Atrybuty pola z imieniem (combobox z listą podpowiedzi), wspólne dla wszystkich wersji wyszukiwarki.
 * `keep`: pole zostaje widoczne po wyborze i pokazuje wybrane imię (bez tego czyści się, bo znika z widoku).
 */
export const guestInput = (api: SeatsApi, keep = false): InputHTMLAttributes<HTMLInputElement> & { ref: Ref<HTMLInputElement> } => {
  const { id, input, query, change, hits, open, active, focus, onKeyDown } = api;
  return {
    ref: input,
    id: `${id}-q`,
    type: "text",
    autoComplete: "off",
    spellCheck: false,
    enterKeyHint: "search",
    role: "combobox",
    "aria-expanded": open,
    "aria-controls": `${id}-list`,
    "aria-autocomplete": "list",
    "aria-activedescendant": open && hits[active] ? `${id}-opt-${active}` : undefined,
    value: focus && !keep ? "" : query,
    onChange: (e) => change(e.target.value),
    onKeyDown,
  };
};

/** Lista podpowiedzi pod polem. */
export function GuestOptions({ api, className = "" }: SearchProps) {
  const { id, hits, open, active, setActive, pick } = api;
  if (!open) return null;
  return (
    <ul id={`${id}-list`} role="listbox" className={`z-30 overflow-hidden rounded-[1.25rem] bg-ivory p-1.5 text-left text-ink shadow-[0_30px_70px_-24px_oklch(20%_0.03_70/0.45)] ${className}`}>
      {hits.length ? hits.map((s, i) => (
        <li
          key={`${s.table.no}-${s.guest}`}
          id={`${id}-opt-${i}`}
          role="option"
          aria-selected={i === active}
          onMouseEnter={() => setActive(i)}
          onMouseDown={(e) => { e.preventDefault(); pick(s); }}
          className={`flex cursor-pointer items-baseline justify-between gap-4 rounded-[1rem] px-4 py-2.5 transition-colors ${i === active ? "bg-champagne" : ""}`}
        >
          <span className="font-serif text-[1.3rem]">{s.guest}</span>
          <span className="whitespace-nowrap text-[0.8125rem] text-ink-soft">stół {s.table.no}</span>
        </li>
      )) : <li className="px-4 py-3 text-[0.9375rem] text-ink-soft">Nie ma takiej osoby na liście. Sprawdź pisownię albo zapytaj świadków.</li>}
    </ul>
  );
}

/** Pozostali goście przy wybranym stole. */
export const tableMates = (api: SeatsApi) => (api.focus ? api.focus.table.guests.filter((g) => g !== api.picked?.guest) : []);
