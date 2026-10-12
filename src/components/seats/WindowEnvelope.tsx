"use client";

import { useRef } from "react";
import { wedding } from "@/content/wedding";
import { Stamp } from "./AddressEnvelope";
import { useEnvelope } from "./envelope";
import { GuestOptions, guestInput, tableMates, type SearchProps } from "./search";

/**
 * Koperta z okienkiem: przez kalkę w okienku widać kartę, a imię wpisuje się prosto na nią.
 * Po wyborze karta wysuwa się górą i wychodzi przed kopertę, pod imieniem jest numer stołu i sąsiedzi.
 */
export function WindowEnvelope({ api, className = "" }: SearchProps) {
  const { id, focus, picked, reset } = api;
  const root = useRef<HTMLDivElement>(null);
  const mates = tableMates(api);

  useEnvelope(root, focus, (tl, open, q) => {
    const [card] = q(".envelope__card");
    if (open) {
      tl.to(card, { y: "-70%", duration: 0.6 }, 0)
        .set(card, { zIndex: 6 }, 0.6)
        .to(card, { y: "-3%", scale: 1.05, duration: 0.8, ease: "expo.out" }, 0.6);
    } else {
      tl.to(card, { y: "-70%", scale: 1, duration: 0.45 }, 0)
        .set(card, { zIndex: 2 }, 0.45)
        .to(card, { y: "0%", duration: 0.5 }, 0.45);
    }
  });

  return (
    <div ref={root} className={`envelope-search ${className}`}>
      <div className="envelope">
        <div className="envelope__back" />

        <div className="envelope__card window-card paper [container-type:inline-size]">
          <div className="window-card__head">
            <label htmlFor={`${id}-q`} className="block font-label text-[0.625rem] uppercase tracking-[0.3em] text-ink-soft">Do rąk własnych</label>
            <input {...guestInput(api, true)} placeholder="Twoje imię i nazwisko" className="envelope__input" />
          </div>
          <div aria-live="polite" className="window-card__result">
            {focus && (
              <>
                <div className="text-center">
                  <p className="font-label text-[2.2cqw] uppercase tracking-[0.3em] text-ink-soft">{picked ? "Twój stół" : "Stół"}</p>
                  <p className="foil inline-block w-max font-serif text-[17cqw] leading-[0.9] lining-nums">{focus.table.no}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-label text-[2.2cqw] uppercase tracking-[0.2em] text-ink-soft">{picked ? "Siedzisz z" : "Siedzą tu"}</p>
                  <ul className="mt-[1cqw] grid grid-cols-2 gap-x-[3cqw] font-serif text-[3.3cqw] leading-snug">
                    {mates.map((g) => <li key={g} className="truncate">{g}</li>)}
                  </ul>
                  <button type="button" onClick={reset} className="mt-[1.5cqw] cursor-pointer text-[2.6cqw] underline decoration-[oklch(75%_0.05_80)] underline-offset-4 hover:decoration-ink">
                    Szukaj kogoś innego
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lista poza kartą: karta leży pod przodem koperty i lista by się pod nim schowała. */}
        <GuestOptions api={api} className="window-options" />

        <div aria-hidden className="window-front">
          <span className="window-front__hole" />
          <p className="absolute left-[7%] top-[9%] font-serif text-[0.95rem] italic leading-snug text-ink-soft">{wedding.bride} i {wedding.groom}</p>
          <Stamp />
        </div>
      </div>
    </div>
  );
}
