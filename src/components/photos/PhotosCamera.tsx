"use client";

import Image from "next/image";
import type { Photo } from "@/lib/photos";
import type { Stage } from "@/lib/stage";
import { plural, usePhotoUpload } from "./usePhotoUpload";
import "./photos.css";

const ROLL = 27;

/** Kultowy aparat jednorazowy: licznik klatek, błysk lampy po każdym wysłanym zdjęciu, album jako stykówka. */
export function PhotosCamera({ stage, initial }: { stage: Stage; initial: Photo[] }) {
  const { photos, shown, more, dragging, open, busy, sent, current, choose, drop, status, input } = usePhotoUpload(stage, initial);
  const left = ROLL - (sent.length % ROLL);

  const developing = current && current.status !== "done" ? current : null;

  return (
    <div className="mt-[clamp(3rem,8vh,5rem)]">
      <div {...drop} className="grid items-center gap-[clamp(3rem,6vw,6rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,auto)]">
        <div>
          <p className="max-w-[16ch] font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02]">
            {!open ? "Aparaty czekają na stołach." : dragging ? "Puść — naświetlamy." : "Pstryk. Każde zdjęcie ląduje na wspólnej kliszy."}
          </p>
          <p aria-live="polite" className="mt-5 max-w-[42ch] text-[0.9375rem] text-muted">{status}</p>
          {open && (
            <button type="button" onClick={choose} disabled={busy} className="btn-gold mt-8 cursor-pointer disabled:cursor-progress disabled:opacity-70">
              {busy ? "Naświetlam…" : "Zrób zdjęcie"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={choose}
          disabled={!open || busy}
          aria-label={open ? "Dodaj zdjęcia" : "Aparat otworzy się w dniu ślubu"}
          className={`camera group relative mx-auto block w-[clamp(17rem,34vw,26rem)] ${open ? "cursor-pointer" : "cursor-default"} ${dragging ? "is-drag" : ""}`}
        >
          <span aria-hidden className="camera__shutter" />
          <span aria-hidden className="camera__body">
            <span className="camera__wrap">
              <span className="camera__brand">Wesele</span>
              <span className="camera__iso">ISO 400 · {ROLL} klatek</span>
            </span>
            <span className="camera__viewfinder" />
            <span key={sent.length} className={`camera__flash ${sent.length ? "is-firing" : ""}`} />
            <span className="camera__lens"><span className="camera__glass" /></span>
            <span className="camera__counter">{open ? String(left).padStart(2, "0") : "--"}</span>
            <span className="camera__wheel" />
            {!open && <span className="camera__tape">otworzę się w dniu ślubu</span>}
          </span>
        </button>

        {input}
      </div>

      {open && (photos.length > 0 || developing) && (
        <div className="mt-[clamp(4rem,10vh,6rem)]">
          <p className="font-label text-[0.8125rem] uppercase tracking-[0.22em] text-muted">Stykówka · {photos.length} {plural(photos.length)}</p>
          <ul className="contact mt-8">
            {developing?.preview && (
              <li className="contact__frame">
                <span className="contact__photo">
                  <Image src={developing.preview} alt="" fill unoptimized sizes="(max-width: 640px) 50vw, 25vw" className="object-cover opacity-80 [filter:sepia(0.9)_blur(8px)_brightness(1.4)_contrast(0.6)]" />
                </span>
                <span className="contact__no">wywołuje się…</span>
              </li>
            )}
            {shown.map((p, i) => (
              <li key={p.name} className="contact__frame pop">
                <span className="contact__photo">
                  <Image src={p.thumb ?? p.url} alt="Zdjęcie od gościa" fill unoptimized loading="lazy" sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                </span>
                <span className="contact__no">{photos.length - i}{i % 3 === 1 ? "A" : ""} ▸</span>
              </li>
            ))}
          </ul>
          {more && <button type="button" onClick={more} className="btn-ghost mt-12">Pokaż więcej</button>}
        </div>
      )}
    </div>
  );
}
