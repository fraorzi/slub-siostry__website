"use client";

import { useEffect, useRef } from "react";
import type { VideoSource } from "@/content/media";

type Props = { src: VideoSource; eager?: boolean; className?: string; label?: string };

const saveData = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/**
 * Zapętlone, wyciszone wideo. Ładuje się dopiero tuż przed wejściem na ekran (chyba że `eager`),
 * gra tylko gdy widać je na ekranie, na telefonie bierze lżejszy plik 720p.
 * Przy „ogranicz ruch” i oszczędzaniu danych zostaje plakat.
 */
export function LoopVideo({ src, eager = false, className = "", label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

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
      className={className}
    >
      {src.mobile !== src.desktop && <source src={src.mobile} media="(max-width: 860px)" type="video/mp4" />}
      <source src={src.desktop} type="video/mp4" />
    </video>
  );
}
