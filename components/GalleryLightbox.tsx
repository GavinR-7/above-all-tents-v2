"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/data/site";

// Photo/video gallery where clicking any thumbnail opens it full-screen.
// Arrow keys / on-screen arrows move between slides, Escape or a click
// on the backdrop closes it.
export default function GalleryLightbox({
  photos,
  title = "In the wild",
}: {
  photos: GalleryItem[];
  title?: string;
}) {
  // null = closed. A number = the index of the open slide.
  const [open, setOpen] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const pauseVideo = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const close = useCallback(() => {
    pauseVideo();
    setOpen(null);
  }, [pauseVideo]);

  const step = useCallback(
    (dir: number) => {
      pauseVideo();
      setOpen((i) => (i === null ? null : (i + dir + photos.length) % photos.length));
    },
    [photos.length, pauseVideo]
  );

  // Keyboard controls + lock background scrolling while the lightbox is open.
  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step]);

  // Autoplay (muted) whenever the open slide is a video.
  useEffect(() => {
    if (open === null) return;
    if (photos[open].kind !== "video") return;
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [open, photos]);

  const current = open !== null ? photos[open] : null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <p className="eyebrow">Photos</p>
      <h2 className="mt-2 text-3xl md:text-4xl">{title}</h2>

      {/* Uniform grid of thumbnails */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl"
            aria-label={`Open slide ${i + 1} of ${photos.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.kind === "photo" ? item.src : item.poster}
              alt="Above All Tent Rentals event"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
            {item.kind === "video" && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-950/10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="translate-x-0.5 text-teal-500"
                  >
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open !== null && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4"
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close viewer"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* Prev / Next — stopPropagation so clicking them doesn't close the overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous slide"
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 md:left-6"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next slide"
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 md:right-6"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* The slide itself */}
          {current.kind === "photo" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.src}
              alt={`Above All Tent Rentals event, slide ${open + 1} of ${photos.length}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          ) : (
            <video
              key={current.src}
              ref={videoRef}
              src={current.src}
              poster={current.poster}
              controls
              playsInline
              muted
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          )}

          {/* Counter */}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {open + 1} / {photos.length}
          </p>
        </div>
      )}
    </section>
  );
}
