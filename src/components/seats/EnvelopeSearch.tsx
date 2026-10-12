"use client";

import { useRef } from "react";
import { closeFlap, EnvelopeBack, openFlap, useEnvelope } from "./envelope";
import { GuestOptions, guestInput, type SearchProps } from "./search";

/**
 * Wyszukiwarka miejsca jako koperta: gość wpisuje imię w polu adresata, po wyborze klapka się otwiera,
 * wysuwa się karta z numerem stołu i sąsiadami. „Szukaj kogoś innego” zamyka kopertę.
 */
export function EnvelopeSearch({ api, className = "" }: SearchProps) {
  const { id, focus } = api;
  const root = useRef<HTMLDivElement>(null);

  useEnvelope(root, focus, (tl, open, q) => {
    const [address] = q(".envelope__address");
    if (open) {
      tl.to(address, { opacity: 0, y: 12, duration: 0.3 }, 0);
      openFlap(tl, q, 0.1);
    } else {
      const end = closeFlap(tl, q, 0);
      tl.to(address, { opacity: 1, y: 0, duration: 0.35 }, end - 0.2);
    }
  });

  return (
    <div ref={root} className={`envelope-search ${className}`}>
      <div className="envelope">
        <EnvelopeBack api={api}>
          <div className="envelope__address">
            <label htmlFor={`${id}-q`} className="block font-label text-[0.6875rem] uppercase tracking-[0.28em] text-ink-soft">Do rąk własnych</label>
            <input {...guestInput(api)} placeholder="Twoje imię i nazwisko" className="envelope__input" />
            <GuestOptions api={api} className="absolute inset-x-0 top-full mt-2" />
          </div>
        </EnvelopeBack>
      </div>
    </div>
  );
}
