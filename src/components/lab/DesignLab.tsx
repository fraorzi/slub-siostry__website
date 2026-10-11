"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { DESIGN_COOKIE, DESIGN_PARAM, defaultDesign, sectionKeys, sections, serializeDesign, styles, type Design, type Option, type SectionKey } from "@/design/catalog";
import { scrollToElement } from "@/lib/scroll";

const OPEN_KEY = "pracownia-otwarta";

const readOpen = () => {
  try { return localStorage.getItem(OPEN_KEY) === "1"; } catch { return false; }
};
const saveOpen = (open: boolean) => {
  try { localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch {}
};

/** Zapis w ciastku (czyta je serwer) i natychmiastowa zmiana stylu bez czekania na odświeżenie. */
const persist = (design: Design) => {
  document.cookie = `${DESIGN_COOKIE}=${encodeURIComponent(serializeDesign(design))}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.dataset.style = design.style;
};

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Pracownia projektu: przełącza styl całej strony i warianty sekcji. Widoczna tylko w dev albo z DESIGN_LAB=1. */
export function DesignLab({ design }: { design: Design }) {
  const router = useRouter();
  const [draft, setDraft] = useState(design);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const jumpTo = useRef<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(readOpen()));
    return () => cancelAnimationFrame(id);
  }, []);

  // Po przełączeniu wariantu wysokość strony się zmienia: wracamy do sekcji, którą właśnie oglądasz.
  useEffect(() => {
    if (pending || !jumpTo.current) return;
    const el = document.getElementById(jumpTo.current);
    jumpTo.current = null;
    if (el) requestAnimationFrame(() => requestAnimationFrame(() => scrollToElement(el, 0, true)));
  }, [pending]);

  const toggle = (next: boolean) => {
    setOpen(next);
    saveOpen(next);
  };

  const apply = (next: Design, anchor: string | null) => {
    setDraft(next);
    persist(next);
    const changedSection = sectionKeys.some((k) => next[k] !== draft[k]);
    if (!changedSection) return;
    jumpTo.current = anchor;
    startTransition(() => router.refresh());
  };

  const setSection = (key: SectionKey, id: string) => apply({ ...draft, [key]: id } as Design, sections[key].anchor);

  const shuffle = () => {
    const next = { style: pick(styles).id } as Design;
    for (const k of sectionKeys) (next as Record<string, string>)[k] = pick<Option>(sections[k].variants).id;
    apply(next, null);
  };

  const copy = async () => {
    const url = `${location.origin}/?${DESIGN_PARAM}=${encodeURIComponent(serializeDesign(draft) || "domyslny")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Link do tego zestawu:", url);
    }
  };

  const go = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el) return;
    if (window.innerWidth < 768) toggle(false);
    scrollToElement(el);
  };

  return (
    <div className="lab text-[13px] leading-snug tracking-normal" style={{ fontFamily: "var(--font-general), system-ui, sans-serif" }}>
      <button
        type="button"
        onClick={() => toggle(!open)}
        aria-expanded={open}
        aria-controls="pracownia"
        className="fixed bottom-4 right-4 z-[70] flex cursor-pointer items-center gap-2 rounded-full bg-[oklch(17%_0.01_70/0.88)] py-2.5 pl-3 pr-4 text-[oklch(95%_0.01_85)] shadow-[0_10px_30px_-10px_oklch(0%_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-md transition-transform duration-300 hover:scale-[1.03]"
      >
        <span aria-hidden className={`size-2.5 rounded-full bg-[conic-gradient(oklch(80%_0.11_85),oklch(95%_0.05_95),oklch(66%_0.11_76),oklch(80%_0.11_85))] ${pending ? "animate-spin" : ""}`} />
        <span className="font-medium">{open ? "Zamknij" : "Projekt"}</span>
      </button>

      <aside
        id="pracownia"
        aria-label="Pracownia projektu"
        hidden={!open}
        data-lenis-prevent
        className="fixed inset-x-2 bottom-[4.25rem] z-[70] max-h-[72svh] overflow-y-auto overscroll-contain rounded-2xl bg-[oklch(16%_0.01_70/0.94)] text-[oklch(94%_0.01_85)] shadow-[0_30px_80px_-20px_oklch(0%_0_0/0.7)] ring-1 ring-white/10 backdrop-blur-xl md:inset-x-auto md:right-4 md:top-4 md:max-h-none md:w-[23rem]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-[oklch(16%_0.01_70/0.97)] px-5 pb-3 pt-4">
          <div>
            <p className="text-[15px] font-medium">Pracownia projektu</p>
            <p className="mt-0.5 text-[oklch(70%_0.015_80)]">Klikaj warianty. Goście tego panelu nie widzą.</p>
          </div>
          <span aria-live="polite" className="mt-1 shrink-0 text-[11px] uppercase tracking-[0.14em] text-[oklch(80%_0.1_85)]">{pending ? "Ładuję…" : ""}</span>
        </header>

        <section className="px-5 pb-2 pt-2">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[oklch(70%_0.015_80)]">Styl całej strony</h2>
          <div role="radiogroup" aria-label="Styl strony" className="mt-3 grid gap-2">
            {styles.map((s) => {
              const on = draft.style === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => apply({ ...draft, style: s.id }, null)}
                  className={`grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-3 rounded-xl px-3.5 py-3 text-left ring-1 transition-colors ${on ? "bg-white/[0.08] ring-[oklch(80%_0.1_85)]" : "ring-white/10 hover:bg-white/[0.04]"}`}
                >
                  <span className="text-[22px] leading-none" style={{ fontFamily: `var(${s.font})` }}>{s.name}</span>
                  <span aria-hidden className="flex -space-x-1">
                    {s.swatch.map((c) => <span key={c} className="size-4 rounded-full ring-1 ring-black/30" style={{ background: c }} />)}
                  </span>
                  <span className="col-span-2 mt-1.5 text-[12px] text-[oklch(72%_0.015_80)]">{s.note}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-5 pb-4 pt-5">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[oklch(70%_0.015_80)]">Sekcje</h2>
          <ol className="mt-3 grid gap-5">
            {sectionKeys.map((key) => {
              const sec = sections[key];
              const current = sec.variants.find((v) => v.id === draft[key]) ?? sec.variants[0];
              return (
                <li key={key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{sec.label}</p>
                    <button type="button" onClick={() => go(sec.anchor)} className="cursor-pointer text-[12px] text-[oklch(80%_0.1_85)] underline-offset-4 hover:underline">pokaż ↓</button>
                  </div>
                  <div role="radiogroup" aria-label={sec.label} className="mt-2 flex flex-wrap gap-1.5">
                    {sec.variants.map((v) => {
                      const on = v.id === draft[key];
                      return (
                        <button
                          key={v.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setSection(key, v.id)}
                          className={`cursor-pointer rounded-full px-3 py-1.5 transition-colors ${on ? "bg-[linear-gradient(115deg,oklch(87%_0.07_86),oklch(95%_0.045_94),oklch(85%_0.08_84))] font-medium text-[oklch(20%_0.01_70)]" : "bg-white/[0.06] hover:bg-white/[0.12]"}`}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[12px] text-[oklch(72%_0.015_80)]">{current.note}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="sticky bottom-0 flex gap-2 border-t border-white/10 bg-[oklch(16%_0.01_70/0.97)] px-5 py-3">
          <button type="button" onClick={shuffle} className="flex-1 cursor-pointer rounded-full bg-white/[0.08] py-2 hover:bg-white/[0.14]">Losuj</button>
          <button type="button" onClick={() => apply(defaultDesign, null)} className="flex-1 cursor-pointer rounded-full bg-white/[0.08] py-2 hover:bg-white/[0.14]">Obecny</button>
          <button type="button" onClick={copy} className="flex-1 cursor-pointer rounded-full bg-white/[0.08] py-2 hover:bg-white/[0.14]">{copied ? "Skopiowane" : "Kopiuj link"}</button>
        </footer>
      </aside>
    </div>
  );
}
