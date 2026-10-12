"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/scroll";
import { tableMates } from "./search";
import type { Focus, SeatsApi } from "./useSeats";

type Q = (selector: string) => Element[];
type Timeline = gsap.core.Timeline;

/** Klapka się otwiera, karta wysuwa się z koperty i wychodzi przed nią. Zwraca czas końca. */
export function openFlap(tl: Timeline, q: Q, at: number) {
  const [flap] = q(".envelope__flap");
  const [card] = q(".envelope__card");
  tl.to(flap, { rotateX: 180, duration: 0.6 }, at)
    .set(flap, { zIndex: 1 }, at + 0.3)
    .to(card, { y: "-72%", duration: 0.55 }, at + 0.45)
    .set(card, { zIndex: 6 }, at + 1)
    .to(card, { y: "-3%", scale: 1.06, duration: 0.7, ease: "expo.out" }, at + 1)
    // Klapka wraca za kartę, żeby nie wystawała nad kopertę i nie zasłaniała nagłówka.
    .to(flap, { rotateX: 0, duration: 0.6 }, at + 1.4);
  return at + 2;
}

/** Odwrotnie: karta wraca do koperty, klapka się zamyka. Zwraca czas końca. */
export function closeFlap(tl: Timeline, q: Q, at: number) {
  const [flap] = q(".envelope__flap");
  const [card] = q(".envelope__card");
  tl.to(flap, { rotateX: 180, duration: 0.45 }, at)
    .to(card, { y: "-72%", scale: 1, duration: 0.45 }, at + 0.3)
    .set(card, { zIndex: 2 }, at + 0.75)
    .to(card, { y: "0%", duration: 0.45 }, at + 0.75)
    .set(flap, { zIndex: 4 }, at + 1.15)
    .to(flap, { rotateX: 0, duration: 0.55 }, at + 1.15);
  return at + 1.7;
}

/**
 * Otwiera kopertę po wyborze osoby i zamyka po „Szukaj kogoś innego”. `play` dokłada kroki wersji
 * (np. obrót koperty, zdjęcie wstążki). Inna osoba przy otwartej kopercie: karta tylko lekko podskakuje.
 */
export function useEnvelope(root: RefObject<HTMLElement | null>, focus: Focus | null, play: (tl: Timeline, open: boolean, q: Q) => void) {
  const opened = useRef(false);
  const running = useRef<Timeline | null>(null);
  const steps = useRef(play);
  useEffect(() => { steps.current = play; });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const instant = prefersReducedMotion();
    const want = Boolean(focus);
    if (want === opened.current) {
      if (want && !instant) gsap.fromTo(q(".envelope__card"), { y: "-8%" }, { y: "-3%", duration: 0.7, ease: "expo.out" });
      return;
    }
    opened.current = want;
    running.current?.progress(1).kill();
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    steps.current(tl, want, q);
    running.current = tl;
    if (instant) tl.progress(1);
  }, [root, focus]);
}

/** Karta z koperty: numer stołu, imię i sąsiedzi. Rozmiary w `cqw`, więc skaluje się z kopertą. */
export function TableCard({ api }: { api: SeatsApi }) {
  const { focus, picked, reset } = api;
  const mates = tableMates(api);
  if (!focus) return null;
  return (
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
  );
}

/** Tył koperty: wnętrze z podszewką z folii, karta, kieszeń i klapka z lakiem. */
export function EnvelopeBack({ api, children }: { api: SeatsApi; children?: ReactNode }) {
  return (
    <>
      <div className="envelope__back"><div className="envelope__liner" /></div>
      <div aria-live="polite" className="envelope__card paper grid grid-cols-[auto_1fr] items-center gap-[6cqw] p-[6cqw] [container-type:inline-size]">
        <TableCard api={api} />
      </div>
      <div className="envelope__pocket" />
      <div className="envelope__flap">
        <div className="envelope__flap-face envelope__flap-face--front" />
        <div className="envelope__flap-face envelope__flap-face--back" />
        <span aria-hidden className="envelope__seal">&amp;</span>
      </div>
      {children}
    </>
  );
}
