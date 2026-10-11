"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { EasterEgg } from "./EasterEgg";

const TAPS_TO_OPEN = 5;

/** Easter egg: 5 szybkich kliknięć w „&” otwiera niespodziankę. */
export function useSecret() {
  const taps = useRef({ count: 0, timer: 0 });
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const tap = () => {
    const t = taps.current;
    t.count += 1;
    window.clearTimeout(t.timer);
    t.timer = window.setTimeout(() => (t.count = 0), 1500);
    if (t.count >= TAPS_TO_OPEN) {
      t.count = 0;
      setOpen(true);
    }
  };

  return { tap, egg: <EasterEgg open={open} onClose={close} /> };
}

/** Celowo bez kursora-rączki, bez fokusa z klawiatury i bez reakcji na pojedyncze kliknięcie. */
export const SecretTrigger = ({ onTap, className = "", children }: { onTap: () => void; className?: string; children: ReactNode }) => (
  <button type="button" onClick={onTap} tabIndex={-1} aria-hidden className={`cursor-default focus-visible:outline-none ${className}`}>
    {children}
  </button>
);
