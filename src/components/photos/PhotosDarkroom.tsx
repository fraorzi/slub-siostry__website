"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import type { Stage } from "@/lib/stage";
import { plural, usePhotoUpload } from "./usePhotoUpload";
import "./photos.css";

const PER_LINE = 6;
const SAG = 34;

type Print = { key: string; node: ReactNode; caption?: string };

/** Sznurek z odbitkami przypiętymi klamerkami. Zwis liczony jak parabola, odbitki lekko się kołyszą. */
const Line = ({ prints }: { prints: Print[] }) => (
  <div className="darkroom__line">
    <div className="darkroom__inner">
    <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="darkroom__string">
      <path d={`M0 6 Q50 ${6 + SAG * 2} 100 6`} fill="none" stroke="oklch(80% 0.04 60 / 0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
    <ul className="darkroom__prints">
      {prints.map((p, i) => {
        const t = (i + 0.5) / PER_LINE;
        const drop = 4 * SAG * t * (1 - t);
        return (
          <li key={p.key} className="darkroom__print" style={{ "--drop": `${drop.toFixed(1)}px`, "--sway": `${((i * 0.7) % 3).toFixed(1)}s`, "--tilt": `${((i * 37) % 7) - 3}deg` } as CSSProperties}>
            <span aria-hidden className="darkroom__pin" />
            <span className="darkroom__paper">
              <span className="darkroom__photo">{p.node}</span>
              {p.caption && <span className="darkroom__caption">{p.caption}</span>}
            </span>
          </li>
        );
      })}
    </ul>
    </div>
  </div>
);

export function PhotosDarkroom({ stage, initial }: { stage: Stage; initial: Photo[] }) {
  const { photos, shown, more, dragging, open, busy, current, choose, drop, status, input } = usePhotoUpload(stage, initial);
  const developing = current && current.status !== "done" ? current : null;

  const slot: Print = {
    key: "slot",
    caption: open ? (dragging ? "puść tutaj" : "Twoje zdjęcie") : "wkrótce",
    node: (
      <button type="button" onClick={choose} disabled={!open || busy} aria-label={open ? "Dodaj zdjęcia" : "Ciemnia otworzy się w dniu ślubu"} className="darkroom__slot">
        <span aria-hidden>{open ? "+" : "…"}</span>
      </button>
    ),
  };
  const fresh: Print[] = developing?.preview
    ? [{ key: developing.key, caption: "wywołuje się…", node: <Image src={developing.preview} alt="" fill unoptimized sizes="12rem" className="darkroom__develop object-cover" /> }]
    : [];
  const album: Print[] = shown.map((p) => ({ key: p.name, node: <Image src={p.thumb ?? p.url} alt="Zdjęcie od gościa" fill unoptimized loading="lazy" sizes="12rem" className="object-cover" /> }));
  // Puste arkusze papieru fotograficznego: sznurek nie wisi pusty, zanim goście coś powieszą.
  const filled = [slot, ...fresh, ...album];
  const blanks: Print[] = Array.from({ length: Math.max(0, PER_LINE * 2 - filled.length) }, (_, i) => ({ key: `blank-${i}`, node: <span className="darkroom__blank" /> }));
  const all = [...filled, ...blanks];
  const lines = Array.from({ length: Math.ceil(all.length / PER_LINE) }, (_, i) => all.slice(i * PER_LINE, (i + 1) * PER_LINE));

  return (
    <div {...drop} className={`darkroom -mx-gutter mt-[clamp(3rem,8vh,5rem)] ${dragging ? "is-drag" : ""}`}>
      <span aria-hidden className="darkroom__lamp" />
      <div className="relative px-gutter pt-[clamp(4rem,10vh,6rem)]">
        <p className="max-w-[18ch] font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02] text-[oklch(92%_0.03_40)]">
          {!open ? "Ciemnia otworzy się w dniu ślubu." : stage === "after" ? "Odbitki jeszcze schną." : "Ciemnia otwarta. Wieszajcie swoje odbitki."}
        </p>
        <p aria-live="polite" className="mt-5 max-w-[42ch] text-[0.9375rem] text-[oklch(78%_0.05_35)]">{status}</p>
        {open && (
          <button type="button" onClick={choose} disabled={busy} className="btn-gold mt-8 cursor-pointer disabled:cursor-progress disabled:opacity-70">
            {busy ? "Wywołuję…" : "Powieś zdjęcia"}
          </button>
        )}
        {open && photos.length > 0 && <p className="mt-10 font-label text-[0.75rem] uppercase tracking-[0.22em] text-[oklch(72%_0.05_35)]">{photos.length} {plural(photos.length)} na sznurkach</p>}
      </div>

      <div className="relative pb-[clamp(4rem,10vh,6rem)] pt-6">
        {lines.map((prints, i) => <Line key={i} prints={prints} />)}
        {more && <div className="px-gutter"><button type="button" onClick={more} className="btn-ghost mt-6 !border-[oklch(50%_0.08_30)] text-[oklch(88%_0.03_40)]">Pokaż więcej</button></div>}
      </div>
      {input}
    </div>
  );
}
