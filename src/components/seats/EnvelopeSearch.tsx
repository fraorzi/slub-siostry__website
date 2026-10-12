"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import type { SeatsApi } from "./useSeats";

/** Lista podpowiedzi pod polem z imieniem. */
function GuestOptions({ api, className = "" }: { api: SeatsApi; className?: string }) {
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

/**
 * Klasyczna koperta ślubna z napisem „Sprawdź, gdzie siedzisz”. Kliknięcie otwiera klapkę, z koperty
 * wychodzi kartka, a na niej gość wpisuje imię; pod spodem pojawia się numer stołu i sąsiedzi.
 * Kliknięcie stołu na sali przy zamkniętej kopercie też ją otwiera.
 */
export function EnvelopeSearch({ api }: { api: SeatsApi }) {
  const { id, input, query, change, hits, open, active, focus, picked, reset, onKeyDown } = api;
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const mates = focus ? focus.table.guests.filter((g) => g !== picked?.guest) : [];
  if (focus && !opened) setOpened(true);

  useEffect(() => {
    const el = root.current;
    if (!el || !opened) return;
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(q(".invite__note"), { opacity: 0, y: 8, duration: 0.3 }, 0)
      .to(q(".envelope__flap"), { rotateX: 180, duration: 0.75 }, 0.15)
      .set(q(".envelope__flap"), { zIndex: 1 }, 0.5)
      .to(q(".invite-card"), { y: "-62%", duration: 0.65 }, 0.75)
      .set(q(".invite-card"), { zIndex: 6 }, 1.4)
      .to(q(".invite-card"), { y: "-4%", scale: 1.04, duration: 0.9, ease: "expo.out" }, 1.4)
      .call(() => {
        if (!focus && window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
      }, [], 1.7);
    if (prefersReducedMotion()) tl.progress(1);
    return () => { tl.progress(1).kill(); };
    // Animacja otwarcia gra raz, gdy koperta się otwiera; `focus` czytamy tylko w chwili otwarcia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <div ref={root} className={`invite ${opened ? "is-open" : ""} ${focus ? "has-result" : ""}`}>
      <div className="envelope">
        <div className="envelope__back"><div className="envelope__liner" /></div>

        <div className="invite-card paper [container-type:inline-size]" inert={!opened}>
          <p className="font-label text-[0.625rem] uppercase tracking-[0.32em] text-ink-soft">{wedding.bride} i {wedding.groom}</p>
          <span aria-hidden className="invite-card__rule" />
          <label htmlFor={`${id}-q`} className="font-serif text-[clamp(1.5rem,7cqw,2.1rem)] italic leading-tight">Twoje miejsce</label>
          <div className="relative mt-[3cqw] w-[82%]">
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
              value={query}
              onChange={(e) => change(e.target.value)}
              onKeyDown={onKeyDown}
              className="invite-card__input"
            />
            <span aria-hidden className="invite-card__line foil-bg" />
            <GuestOptions api={api} className="absolute inset-x-0 top-full mt-3" />
          </div>

          <div aria-live="polite" className="w-full">
            {focus && (
              <div key={`${focus.table.no}-${picked?.guest ?? ""}`} className="pop mt-[5cqw] grid grid-cols-[auto_1fr] items-center gap-[6cqw] text-left">
                <div className="text-center">
                  <p className="font-label text-[clamp(0.5625rem,2.3cqw,0.6875rem)] uppercase tracking-[0.3em] text-ink-soft">{picked ? "Twój stół" : "Stół"}</p>
                  <p className="foil inline-block w-max font-serif text-[clamp(3.5rem,20cqw,6rem)] leading-[0.9] lining-nums">{focus.table.no}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-label text-[clamp(0.5625rem,2.3cqw,0.6875rem)] uppercase tracking-[0.24em] text-ink-soft">{picked ? "Obok Ciebie" : "Siedzą tu"}</p>
                  <ul className="mt-[1cqw] grid font-serif text-[clamp(0.9375rem,3.9cqw,1.15rem)] leading-snug">
                    {mates.map((g) => <li key={g} className="truncate">{g}</li>)}
                  </ul>
                  <button type="button" onClick={reset} className="mt-[2.5cqw] cursor-pointer text-[clamp(0.75rem,2.8cqw,0.875rem)] underline decoration-[oklch(75%_0.05_80)] underline-offset-4 hover:decoration-ink">
                    Szukaj kogoś innego
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="envelope__pocket">
          <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <path d="M0 100 L50 57 L100 100" className="invite__crease" />
            <path d="M0 0 L50 50.5 L100 0" className="invite__flap-shadow" />
          </svg>
        </div>
        <div className="envelope__flap">
          <div className="envelope__flap-face envelope__flap-face--front" />
          <div className="envelope__flap-face envelope__flap-face--back" />
          <span aria-hidden className="envelope__seal">&amp;</span>
        </div>
        <p aria-hidden className="invite__note">Sprawdź, gdzie siedzisz</p>

        {!opened && (
          <button type="button" onClick={() => setOpened(true)} aria-label="Otwórz kopertę i sprawdź, gdzie siedzisz" className="invite__open" />
        )}
      </div>
    </div>
  );
}
