"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { GuestOptions, guestInput, tableMates, type SearchProps } from "./search";

/**
 * Wyszukiwarka miejsca jako koperta: gość wpisuje imię w polu adresata, po wyborze klapka się otwiera,
 * wysuwa się karta z numerem stołu i sąsiadami. „Szukaj kogoś innego” zamyka kopertę.
 */
export function EnvelopeSearch({ api, className = "" }: SearchProps) {
  const { id, focus, picked, reset } = api;
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const [flap] = q(".envelope__flap");
    const [card] = q(".envelope__card");
    const [address] = q(".envelope__address");
    const instant = prefersReducedMotion();
    const want = Boolean(focus);
    if (want === opened.current) {
      // Inna osoba przy otwartej kopercie: karta tylko lekko podskakuje.
      if (want && !instant) gsap.fromTo(card, { y: "-8%" }, { y: "-3%", duration: 0.7, ease: "expo.out" });
      return;
    }
    opened.current = want;
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    if (want) {
      tl.to(address, { opacity: 0, y: 12, duration: 0.3 }, 0)
        .to(flap, { rotateX: 180, duration: 0.6 }, 0.1)
        .set(flap, { zIndex: 1 }, 0.4)
        .to(card, { y: "-72%", duration: 0.55 }, 0.55)
        .set(card, { zIndex: 6 }, 1.1)
        .to(card, { y: "-3%", scale: 1.06, duration: 0.7, ease: "expo.out" }, 1.1)
        // Klapka wraca za kartę, żeby nie wystawała nad kopertę i nie zasłaniała nagłówka.
        .to(flap, { rotateX: 0, duration: 0.6 }, 1.5);
    } else {
      tl.to(flap, { rotateX: 180, duration: 0.45 }, 0)
        .to(card, { y: "-72%", scale: 1, duration: 0.45 }, 0.3)
        .set(card, { zIndex: 2 }, 0.75)
        .to(card, { y: "0%", duration: 0.45 }, 0.75)
        .set(flap, { zIndex: 4 }, 1.15)
        .to(flap, { rotateX: 0, duration: 0.55 }, 1.15)
        .to(address, { opacity: 1, y: 0, duration: 0.35 }, 1.5);
    }
    if (instant) tl.progress(1);
  }, [focus]);

  const mates = tableMates(api);

  return (
    <div ref={root} className={`envelope-search ${className}`}>
      <div className="envelope">
        <div className="envelope__back"><div className="envelope__liner" /></div>

        <div aria-live="polite" className="envelope__card paper grid grid-cols-[auto_1fr] items-center gap-[6cqw] p-[6cqw] [container-type:inline-size]">
          {focus && (
            <>
              <div className="text-center">
                <p className="font-label text-[2.6cqw] uppercase tracking-[0.3em] text-ink-soft">{picked ? "Twój stół" : "Stół"}</p>
                <p className="foil inline-block w-max font-serif text-[28cqw] leading-[0.9] lining-nums">{focus.table.no}</p>
              </div>
              <div className="min-w-0">
                {picked && <p className="truncate font-serif text-[5cqw] italic leading-tight">{picked.guest}</p>}
                <p className="mt-[2cqw] font-label text-[2.6cqw] uppercase tracking-[0.2em] text-ink-soft">{picked ? "Siedzisz z" : "Siedzą tu"}</p>
                <ul className="mt-[1.5cqw] grid gap-[0.6cqw] font-serif text-[3.7cqw] leading-tight">
                  {mates.map((g) => <li key={g} className="truncate">{g}</li>)}
                </ul>
                <button type="button" onClick={reset} className="mt-[3cqw] cursor-pointer text-[2.9cqw] underline decoration-[oklch(75%_0.05_80)] underline-offset-4 hover:decoration-ink">
                  Szukaj kogoś innego
                </button>
              </div>
            </>
          )}
        </div>

        <div className="envelope__pocket" />
        <div className="envelope__flap">
          <div className="envelope__flap-face envelope__flap-face--front" />
          <div className="envelope__flap-face envelope__flap-face--back" />
          <span aria-hidden className="envelope__seal">&amp;</span>
        </div>

        <div className="envelope__address">
          <label htmlFor={`${id}-q`} className="block font-label text-[0.6875rem] uppercase tracking-[0.28em] text-ink-soft">Do rąk własnych</label>
          <input {...guestInput(api)} placeholder="Twoje imię i nazwisko" className="envelope__input" />
          <GuestOptions api={api} className="absolute inset-x-0 top-full mt-2" />
        </div>
      </div>
    </div>
  );
}
