import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/scroll";

const noop = () => () => {};

export function EasterEgg({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="egg-title"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-[80] grid place-items-center bg-night p-gutter text-pearl transition-opacity duration-500 ease-soft ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="max-w-lg text-center">
        <p id="egg-title" className="foil font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">Znalazłaś to.</p>
        <p className="mt-4 text-pearl-soft">Tu wjedzie easter egg od brata. Treść ustalimy po kilku pytaniach — na razie działa sam mechanizm.</p>
        <button ref={closeButton} type="button" onClick={onClose} className="mt-8 cursor-pointer rounded-full border border-line-night px-5 py-2.5">
          Wróć na wesele
        </button>
      </div>
    </div>,
    document.body,
  );
}
