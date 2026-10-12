"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSource } from "@/content/media";

type Props = { src: VideoSource; eager?: boolean; className?: string; label?: string; onFirstFrame?: () => void };

const saveData = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/**
 * Zapętlone, wyciszone wideo. Ładuje się dopiero tuż przed wejściem na ekran (chyba że `eager`),
 * gra tylko gdy widać je na ekranie, na telefonie bierze lżejszy plik 720p.
 * Plakat to pierwsza klatka filmu (`pnpm media`), więc przejście z plakatu na wideo jest niewidoczne.
 * Bez plakatu wideo pojawia się płynnie, gdy ma pierwszą klatkę, zamiast mignąć pustym prostokątem.
 * Przy „ogranicz ruch” i oszczędzaniu danych zostaje plakat.
 */
export function LoopVideo({ src, eager = false, className = "", label, onFirstFrame }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(Boolean(src.poster));
  const firstFrame = useRef(onFirstFrame);
  useEffect(() => { firstFrame.current = onFirstFrame; });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const ready = () => {
      setShown(true);
      firstFrame.current?.();
    };
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ready();
    else video.addEventListener("loadeddata", ready, { once: true });
    return () => video.removeEventListener("loadeddata", ready);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || (!eager && saveData())) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== "auto") {
            video.preload = "auto";
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [eager]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      disableRemotePlayback
      preload={eager ? "auto" : "none"}
      poster={src.poster}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`${src.poster ? "" : `transition-opacity duration-700 ease-soft ${shown ? "opacity-100" : "opacity-0"}`} ${className}`}
    >
      {src.mobile !== src.desktop && <source src={src.mobile} media="(max-width: 860px)" type="video/mp4" />}
      <source src={src.desktop} type="video/mp4" />
    </video>
  );
}
