"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import type { Stage } from "@/lib/stage";
import { plural, usePhotoUpload } from "./usePhotoUpload";

const TILT = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.1, -2.2, 1.5];

const Polaroid = ({ children, caption, className = "" }: { children?: ReactNode; caption?: ReactNode; className?: string }) => (
  <span className={`polaroid block rounded-[3px] p-[6.5%] pb-0 ${className}`}>
    <span className="polaroid__photo relative block aspect-square overflow-hidden rounded-[1px]">{children}</span>
    <span className="flex h-[3.4em] items-center justify-center font-hand text-[clamp(1.4rem,2.3vw,1.85rem)] font-semibold leading-none text-ink">{caption}</span>
  </span>
);

const CameraMark = () => (
  <svg aria-hidden viewBox="0 0 32 32" className="size-12 text-pearl/80 transition-transform duration-500 ease-soft group-hover:scale-110">
    <path d="M5 11.5A2.5 2.5 0 0 1 7.5 9h3l2-3h7l2 3h3A2.5 2.5 0 0 1 27 11.5v12A2.5 2.5 0 0 1 24.5 26h-17A2.5 2.5 0 0 1 5 23.5z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="16" cy="17" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function PhotosPolaroid({ stage, initial }: { stage: Stage; initial: Photo[] }) {
  const { photos, shown, more, dragging, open, busy, current, choose, drop, status, input } = usePhotoUpload(stage, initial);

  return (
    <div className="mt-[clamp(3rem,8vh,5rem)]">
      <div {...drop} className="grid items-center gap-[clamp(3rem,6vw,6rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,auto)]">
        <div>
          <p className="max-w-[16ch] font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02]">
            {!open ? "Jeszcze chwila." : dragging ? "Upuść — wywołamy je od razu." : stage === "after" ? "Masz jeszcze coś w telefonie?" : "Każde zdjęcie z telefonu trafi do wspólnego albumu."}
          </p>
          <p aria-live="polite" className="mt-5 max-w-[42ch] text-[0.9375rem] text-muted">{status}</p>
          {open && (
            <button type="button" onClick={choose} disabled={busy} className="btn-gold mt-8 cursor-pointer disabled:cursor-progress disabled:opacity-70">
              {busy ? "Wysyłam…" : "Wybierz zdjęcia"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={choose}
          disabled={!open || busy}
          aria-label={open ? "Dodaj zdjęcia" : "Aparat otworzy się w dniu ślubu"}
          className={`group relative mx-auto block w-[clamp(13rem,26vw,19rem)] [perspective:900px] ${open ? "cursor-pointer" : "cursor-default"} disabled:cursor-default`}
        >
          {[0, 1].map((n) => (
            <Polaroid
              key={n}
              className={`absolute inset-0 origin-bottom transition-transform duration-700 ease-soft ${
                n === 0
                  ? dragging ? "-translate-x-[18%] -rotate-[14deg]" : "-rotate-[7deg] group-hover:-translate-x-[6%] group-hover:-rotate-[10deg]"
                  : dragging ? "translate-x-[18%] rotate-[12deg]" : "rotate-[5deg] group-hover:translate-x-[6%] group-hover:rotate-[8deg]"
              }`}
            >
              {photos[n + 1] && <Image src={photos[n + 1].thumb ?? photos[n + 1].url} alt="" fill unoptimized sizes="20rem" className="object-cover" />}
            </Polaroid>
          ))}
          <Polaroid
            className={`relative -rotate-[1.5deg] transition-transform duration-700 ease-soft ${dragging ? "-translate-y-3 rotate-0 scale-[1.03]" : "group-hover:-translate-y-1.5 group-hover:rotate-0"}`}
            caption={!open ? "w dniu ślubu" : current ? (current.status === "done" ? "wywołane!" : "wywołuje się…") : "dodaj zdjęcie +"}
          >
            {current?.preview ? (
              <Image
                src={current.preview}
                alt=""
                fill
                unoptimized
                sizes="20rem"
                className={`object-cover transition-[filter,opacity] duration-[1600ms] ease-soft ${current.status === "done" ? "" : "opacity-80 [filter:sepia(0.9)_blur(10px)_brightness(1.35)_contrast(0.6)]"}`}
              />
            ) : (
              <span className={`grid size-full place-items-center transition-opacity duration-500 ${open ? "opacity-100" : "opacity-40"}`}><CameraMark /></span>
            )}
          </Polaroid>
        </button>

        {input}
      </div>

      {open && photos.length > 0 && (
        <div className="mt-[clamp(4rem,10vh,6rem)]">
          <p className="font-label text-[0.8125rem] uppercase tracking-[0.22em] text-muted">Album gości · {photos.length} {plural(photos.length)}</p>
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((p, i) => (
              <li key={p.name} className="pop" style={{ "--tilt": `${TILT[i % TILT.length]}deg` } as CSSProperties}>
                <Polaroid className="rotate-(--tilt) transition-[rotate,translate] duration-500 ease-soft hover:-translate-y-1 hover:rotate-0">
                  <Image src={p.thumb ?? p.url} alt="Zdjęcie od gościa" fill unoptimized loading="lazy" sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                </Polaroid>
              </li>
            ))}
          </ul>
          {more && <button type="button" onClick={more} className="btn-ghost mt-12">Pokaż więcej</button>}
        </div>
      )}
    </div>
  );
}
