"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { Table } from "@/data/seating";
import { scrollToElement } from "@/lib/scroll";

export const CHAIR_R = 50;

export type Seat = { guest: string; table: Table; x: number; y: number; angle: number };
export type Focus = { table: Table; guest: Seat | null };

export const normalize = (s: string) => s.toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[̀-ͯ]/g, "");

export const seatsOf = (tables: Table[]): Seat[] =>
  tables.flatMap((table) => table.guests.map((guest, k) => {
    const angle = (k / table.guests.length) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    // Zaokrąglenie: Node i przeglądarka potrafią różnić się na ostatniej cyfrze, a to psuje hydrację SVG.
    return { guest, table, angle, x: Math.round((table.x + Math.cos(rad) * CHAIR_R) * 100) / 100, y: Math.round((table.y + Math.sin(rad) * CHAIR_R) * 100) / 100 };
  }));

/** Logika wyszukiwarki miejsca: podpowiedzi, wybór osoby albo stołu, klawiatura. */
export function useSeats(tables: Table[], view: RefObject<HTMLElement | null>) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const seats = useMemo(() => seatsOf(tables), [tables]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focus, setFocus] = useState<Focus | null>(null);

  const picked = focus?.guest ?? null;
  const q = normalize(query.trim());
  const open = q.length >= 2 && query !== picked?.guest;
  const hits = open ? seats.filter((s) => normalize(s.guest).includes(q)).slice(0, 6) : [];

  // Na telefonie wizualizacja jest pod polem: po wyborze przewijamy do niej, żeby było widać efekt.
  const reveal = () => {
    const el = view.current;
    if (!el || window.innerWidth >= 1024) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.45 || r.bottom < 80) {
      input.current?.blur();
      scrollToElement(el, -24);
    }
  };

  const pick = (seat: Seat) => {
    setFocus({ table: seat.table, guest: seat });
    setQuery(seat.guest);
    reveal();
  };

  const browse = (table: Table) => {
    setFocus({ table, guest: null });
    setQuery("");
  };

  const reset = () => {
    setFocus(null);
    setQuery("");
    if (window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || !hits.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % hits.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + hits.length) % hits.length); }
    if (e.key === "Enter") { e.preventDefault(); pick(hits[active] ?? hits[0]); }
    if (e.key === "Escape") setQuery("");
  };

  const change = (value: string) => { setQuery(value); setActive(0); };

  return { id, input, seats, query, change, active, setActive, hits, open, focus, picked, pick, browse, reset, onKeyDown };
}

export type SeatsApi = ReturnType<typeof useSeats>;
