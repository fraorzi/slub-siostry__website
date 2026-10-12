"use client";

import { useRef } from "react";
import { wedding } from "@/content/wedding";
import { closeFlap, EnvelopeBack, openFlap, useEnvelope } from "./envelope";
import { GuestOptions, guestInput, type SearchProps } from "./search";

/** Znaczek z perforacją i stempel z datą: wspólne dla kopert widzianych od przodu. */
export function Stamp() {
  return (
    <div aria-hidden className="envelope__stamp">
      <span className="envelope__stamp-art foil-bg">
        <span className="font-serif text-[1.35em] italic leading-none">{wedding.bride[0]}·{wedding.groom[0]}</span>
        <span className="mt-[0.4em] font-label text-[0.42em] uppercase tracking-[0.2em]">poczta weselna</span>
      </span>
      <svg viewBox="0 0 160 90" className="envelope__postmark">
        <defs><path id="postmark-arc" d="M18 45 a27 27 0 1 1 54 0 a27 27 0 1 1 -54 0" /></defs>
        <circle cx="45" cy="45" r="34" />
        <circle cx="45" cy="45" r="21" />
        <text><textPath href="#postmark-arc" startOffset="2">WESELE · {wedding.dateLabel} ·</textPath></text>
        <text x="45" y="49" textAnchor="middle" className="envelope__postmark-hour">{wedding.reception.time}</text>
        {[30, 40, 50, 60].map((y) => <path key={y} d={`M84 ${y} q8 -5 16 0 t16 0 t16 0 t16 0`} />)}
      </svg>
    </div>
  );
}

/**
 * Koperta od strony adresu: znaczek, stempel i adres sali, gość wpisuje się jako adresat.
 * Po wyborze koperta obraca się na drugą stronę, klapka z lakiem się otwiera i wysuwa się karta.
 */
export function AddressEnvelope({ api, className = "" }: SearchProps) {
  const { id, focus, input } = api;
  const root = useRef<HTMLDivElement>(null);

  useEnvelope(root, focus, (tl, open, q) => {
    const [front] = q(".envelope__front");
    const [back] = q(".envelope__side");
    if (open) {
      tl.fromTo(front, { rotateY: 0 }, { rotateY: -90, duration: 0.35, ease: "power2.in" }, 0)
        .set(front, { visibility: "hidden" }, 0.35)
        .set(back, { visibility: "visible" }, 0.35)
        .fromTo(back, { rotateY: 90 }, { rotateY: 0, duration: 0.45, ease: "power2.out" }, 0.35);
      openFlap(tl, q, 0.85);
    } else {
      const end = closeFlap(tl, q, 0);
      tl.to(back, { rotateY: 90, duration: 0.35, ease: "power2.in" }, end)
        .set(back, { visibility: "hidden" }, end + 0.35)
        .set(front, { visibility: "visible" }, end + 0.35)
        .fromTo(front, { rotateY: -90 }, { rotateY: 0, duration: 0.45, ease: "power2.out" }, end + 0.35)
        // Przód był schowany, gdy „Szukaj kogoś innego” chciało ustawić kursor w polu: robimy to po obrocie.
        .call(() => { if (window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true }); });
    }
  });

  return (
    <div ref={root} className={`envelope-search ${className}`}>
      <div className="envelope">
        <div className="envelope__side"><EnvelopeBack api={api} /></div>
        <div className="envelope__front">
          <p aria-hidden className="absolute left-[7%] top-[9%] font-serif text-[0.95rem] italic leading-snug text-ink-soft">
            {wedding.bride} i {wedding.groom}
          </p>
          <Stamp />
          <div className="envelope__to">
            <label htmlFor={`${id}-q`} className="block font-label text-[0.625rem] uppercase tracking-[0.3em] text-ink-soft">Szanowni Goście</label>
            <div className="relative">
              <input {...guestInput(api)} placeholder="Twoje imię i nazwisko" className="envelope__input envelope__input--ruled" />
              <GuestOptions api={api} className="absolute inset-x-0 top-full mt-2" />
            </div>
            <p aria-hidden className="envelope__ruled">{wedding.reception.venue.name}</p>
            <p aria-hidden className="envelope__ruled">{wedding.reception.venue.address.split(" · ")[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
