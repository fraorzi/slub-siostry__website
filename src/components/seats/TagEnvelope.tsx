"use client";

import { useRef } from "react";
import { closeFlap, EnvelopeBack, openFlap, useEnvelope } from "./envelope";
import { GuestOptions, guestInput, type SearchProps } from "./search";

/**
 * Koperta przewiązana wstążką z bilecikiem: gość wpisuje imię odręcznie na bileciku wsuniętym pod wstążkę.
 * Po wyborze bilecik spada, wstążka się zsuwa, lak puszcza i z koperty wychodzi karta.
 */
export function TagEnvelope({ api, className = "" }: SearchProps) {
  const { id, focus } = api;
  const root = useRef<HTMLDivElement>(null);

  useEnvelope(root, focus, (tl, open, q) => {
    const [tag] = q(".envelope__tag");
    const [ribbon] = q(".envelope__ribbon");
    if (open) {
      tl.to(tag, { y: 50, rotate: 9, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
        .to(ribbon, { scaleY: 0, duration: 0.45, ease: "power2.in" }, 0.25);
      openFlap(tl, q, 0.7);
    } else {
      const end = closeFlap(tl, q, 0);
      tl.to(ribbon, { scaleY: 1, duration: 0.45, ease: "power2.out" }, end - 0.2)
        .fromTo(tag, { y: -24, rotate: -8, opacity: 0 }, { y: 0, rotate: -3, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, end + 0.1);
    }
  });

  return (
    <div ref={root} className={`envelope-search ${className}`}>
      <div className="envelope envelope--tied">
        <EnvelopeBack api={api}>
          <span aria-hidden className="envelope__ribbon" />
          <div className="envelope__tag">
            <span aria-hidden className="envelope__tag-paper"><span /></span>
            <div className="relative flex items-baseline gap-2">
              <label htmlFor={`${id}-q`} className="font-hand text-[clamp(1.3rem,2.6vw,1.6rem)] text-ink-soft">Dla</label>
              <input {...guestInput(api)} placeholder="imię i nazwisko" className="envelope__input envelope__input--hand" />
              <GuestOptions api={api} className="absolute left-0 top-full mt-3 w-[max(100%,17rem)]" />
            </div>
          </div>
        </EnvelopeBack>
      </div>
    </div>
  );
}
