"use client";

import { useEffect, useState, type RefObject } from "react";
import { SEARCH_PARAM, SEARCH_VARIANTS, type SearchVariant } from "./variants";

/**
 * Przełącznik wersji wyszukiwarki (tylko dev i podglądy). Widać go, gdy sekcja jest na ekranie;
 * wybór trafia do adresu (`?koperta=…`), więc link pokazuje od razu tę samą wersję.
 */
export function VariantSwitch({ value, onChange, section }: { value: SearchVariant; onChange: (v: SearchVariant) => void; section: RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "-20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [section]);

  const choose = (v: SearchVariant) => {
    onChange(v);
    const url = new URL(window.location.href);
    url.searchParams.set(SEARCH_PARAM, v);
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Wersja wyszukiwarki"
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full bg-ink/90 p-1 text-[0.8125rem] sm:pl-4 text-pearl shadow-[0_18px_40px_-16px_oklch(15%_0.02_70/0.7)] backdrop-blur transition-[opacity,translate] duration-500 ease-soft ${visible ? "" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <span className="mr-2 font-label max-sm:hidden text-[0.6875rem] uppercase tracking-[0.2em] text-pearl-soft">Wersja</span>
      {(Object.keys(SEARCH_VARIANTS) as SearchVariant[]).map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={v === value}
          onClick={() => choose(v)}
          className={`cursor-pointer rounded-full px-3 py-1.5 transition-colors ${v === value ? "bg-pearl text-ink" : "hover:bg-pearl/15"}`}
        >
          {SEARCH_VARIANTS[v]}
        </button>
      ))}
    </div>
  );
}
