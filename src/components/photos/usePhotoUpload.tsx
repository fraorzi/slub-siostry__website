"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import type { Photo } from "@/lib/photos";
import { ScrollTrigger } from "@/lib/scroll";
import type { Stage } from "@/lib/stage";

export type Status = "waiting" | "sending" | "done" | "failed";
export type Item = { key: string; preview: string; status: Status; error?: string };

export const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export const plural = (n: number) => {
  if (n === 1) return "zdjęcie";
  const last = n % 10, lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20) ? "zdjęcia" : "zdjęć";
};

/** Wspólna logika uploadu zdjęć gości: kolejka, podgląd, przeciąganie, komunikaty. */
const PAGE = 24;

export function usePhotoUpload(stage: Stage, initial: Photo[]) {
  const [photos, setPhotos] = useState(initial);
  const [limit, setLimit] = useState(PAGE);
  const [queue, setQueue] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const previews = useRef<string[]>([]);
  const open = stage !== "before";

  useEffect(() => () => previews.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const busy = queue.some((i) => i.status === "waiting" || i.status === "sending");
  const sent = queue.filter((i) => i.status === "done");
  const failed = queue.filter((i) => i.status === "failed");
  const current = queue.find((i) => i.status === "sending") ?? sent[sent.length - 1] ?? null;
  const position = queue.filter((i) => i.status !== "failed").findIndex((i) => i.status === "sending") + 1;

  const update = (key: string, patch: Partial<Item>) => setQueue((q) => q.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const send = async (files: File[]) => {
    previews.current.forEach((url) => URL.revokeObjectURL(url));
    previews.current = [];
    const stamp = Date.now();
    const items = files.map((file, n) => {
      const key = `${stamp}-${n}-${file.name}`;
      const ok = ACCEPT.includes(file.type);
      const preview = ok ? URL.createObjectURL(file) : "";
      if (preview) previews.current.push(preview);
      const item: Item = ok ? { key, preview, status: "waiting" } : { key, preview, status: "failed", error: `${file.name} to nie zdjęcie` };
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
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const accept = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length && !busy) void send(files);
  };

  const choose = () => { if (open && !busy) picker.current?.click(); };

  const drop = open
    ? {
        onDragOver: (e: DragEvent) => { e.preventDefault(); setDragging(true); },
        onDragLeave: (e: DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); },
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

  const input = (
    <input ref={picker} type="file" accept={ACCEPT.join(",")} multiple className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { accept(e.target.files); e.target.value = ""; }} />
  );

  // Album rośnie z każdym gościem: pokazujemy porcjami, żeby telefon nie ładował setek zdjęć naraz.
  const shown = photos.slice(0, limit);
  const more = photos.length > limit ? () => { setLimit((l) => l + PAGE); requestAnimationFrame(() => ScrollTrigger.refresh()); } : null;

  return { photos, shown, more, queue, dragging, open, busy, sent, failed, current, choose, drop, status, input };
}

export type Upload = ReturnType<typeof usePhotoUpload>;
