"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import type { Stage } from "@/lib/stage";
import { ScrollTrigger } from "@/lib/scroll";

type Status = "waiting" | "sending" | "done" | "failed";
type Item = { key: string; preview: string; status: Status; error?: string };

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const TILT = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.1, -2.2, 1.5];

const plural = (n: number) => {
  if (n === 1) return "zdjęcie";
  const last = n % 10, lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20) ? "zdjęcia" : "zdjęć";
};

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

export function Photos({ stage, initial }: { stage: Stage; initial: Photo[] }) {
  const [photos, setPhotos] = useState(initial);
  const [queue, setQueue] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const open = stage !== "before";

  const busy = queue.some((i) => i.status === "waiting" || i.status === "sending");
  const sent = queue.filter((i) => i.status === "done");
  const failed = queue.filter((i) => i.status === "failed");
  const current = queue.find((i) => i.status === "sending") ?? sent[sent.length - 1] ?? null;
  const position = queue.filter((i) => i.status !== "failed").findIndex((i) => i.status === "sending") + 1;

  const update = (key: string, patch: Partial<Item>) => setQueue((q) => q.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const send = async (files: File[]) => {
    const stamp = Date.now();
    const items = files.map((file, n) => {
      const key = `${stamp}-${n}-${file.name}`;
      const item: Item = ACCEPT.includes(file.type)
        ? { key, preview: URL.createObjectURL(file), status: "waiting" }
        : { key, preview: "", status: "failed", error: `${file.name} to nie zdjęcie` };
      return { file, item };
    });
    setQueue(items.map((x) => x.item));
    for (const { file, item } of items.filter((x) => x.item.status === "waiting")) {
      update(item.key, { status: "sending" });
      const body = new FormData();
      body.append("photo", file);
      const res = await fetch("/api/photos", { method: "POST", body }).catch(() => null);
      const json = res ? await res.json().catch(() => null) : null;
      if (res?.ok && json?.photo) {
        update(item.key, { status: "done" });
        setPhotos((p) => [json.photo as Photo, ...p]);
      } else {
        update(item.key, { status: "failed", error: json?.error ?? "brak połączenia" });
      }
    }
    ScrollTrigger.refresh();
  };

  const accept = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length && !busy) void send(files);
  };

  const drop = open
    ? {
        onDragOver: (e: DragEvent) => { e.preventDefault(); setDragging(true); },
        onDragLeave: () => setDragging(false),
        onDrop: (e: DragEvent) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files); },
      }
    : {};

  const status = !open
    ? "Aparat otworzy się w dniu ślubu. Na każdym stole znajdziesz kod, który tu prowadzi."
    : busy
      ? `Wywołuję ${position} z ${queue.length - failed.length}…`
      : queue.length
        ? `${sent.length ? `Gotowe — ${sent.length} ${plural(sent.length)} w albumie.` : ""}${failed.length ? ` Nie udało się: ${failed.map((f) => f.error).join(", ")}.` : ""}`
        : "Bez aplikacji i logowania. Możesz wybrać kilka naraz.";

  return (
    <div className="mt-[clamp(3rem,8vh,5rem)]">
      <div {...drop} className="grid items-center gap-[clamp(3rem,6vw,6rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,auto)]">
        <div>
          <p className="max-w-[16ch] font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02]">
            {!open ? "Jeszcze chwila." : dragging ? "Upuść — wywołamy je od razu." : stage === "after" ? "Masz jeszcze coś w telefonie?" : "Każde zdjęcie z telefonu trafi do wspólnego albumu."}
          </p>
          <p aria-live="polite" className="mt-5 max-w-[42ch] text-[0.9375rem] text-muted">{status}</p>
          {open && (
            <button type="button" onClick={() => picker.current?.click()} disabled={busy} className="btn-gold mt-8 cursor-pointer disabled:cursor-progress disabled:opacity-70">
              {busy ? "Wysyłam…" : "Wybierz zdjęcia"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => open && picker.current?.click()}
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
              {photos[n + 1] && <Image src={photos[n + 1].url} alt="" fill unoptimized sizes="20rem" className="object-cover" />}
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

        <input ref={picker} type="file" accept={ACCEPT.join(",")} multiple className="sr-only" tabIndex={-1} onChange={(e) => { accept(e.target.files); e.target.value = ""; }} />
      </div>

      {open && photos.length > 0 && (
        <div className="mt-[clamp(4rem,10vh,6rem)]">
          <p className="text-[0.8125rem] uppercase tracking-[0.22em] text-muted">Album gości · {photos.length} {plural(photos.length)}</p>
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.name} className="pop" style={{ "--tilt": `${TILT[i % TILT.length]}deg` } as CSSProperties}>
                <Polaroid className="rotate-(--tilt) transition-[rotate,translate] duration-500 ease-soft hover:-translate-y-1 hover:rotate-0">
                  <Image src={p.url} alt="Zdjęcie od gościa" fill unoptimized sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                </Polaroid>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
