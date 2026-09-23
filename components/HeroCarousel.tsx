"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { business, hero, heroSlides } from "@/data/site";

const AUTO_MS = 5000;

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // The hero video is multi-megabyte. We hold its `src` back until the browser
  // is idle so it can't compete with the poster, which is the LCP image.
  const [videoAllowed, setVideoAllowed] = useState(false);
  // Index of the video that has buffered a frame; it fades in over its poster.
  const [readyIdx, setReadyIdx] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const go = (n: number) => setIdx((n + heroSlides.length) % heroSlides.length);

  // Manual navigation pauses auto-advance so the carousel doesn't fight the user.
  const manual = (n: number) => {
    setPaused(true);
    go(n);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Let the first paint finish before the video is allowed to start fetching.
  useEffect(() => {
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(() => setVideoAllowed(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const t = setTimeout(() => setVideoAllowed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Photo slides advance on a timer; video slides advance on their own onEnded.
  useEffect(() => {
    if (paused) return;
    if (reducedMotion) return;
    if (heroSlides[idx].kind === "video") return;
    timer.current = setInterval(() => go(idx + 1), AUTO_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, reducedMotion]);

  // A slide change invalidates the ready flag — the next src has to buffer
  // again, so the poster takes over until it can play.
  useEffect(() => {
    setReadyIdx(null);
  }, [idx]);

  // Play the active video slide, pause and rewind every other one. Nothing can
  // play before `videoAllowed`, because until then the element has no src.
  useEffect(() => {
    heroSlides.forEach((slide, i) => {
      if (slide.kind !== "video") return;
      const el = videoRefs.current[i];
      if (!el) return;
      if (i === idx && !reducedMotion && videoAllowed) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }, [idx, reducedMotion, videoAllowed]);

  return (
    <section className="relative isolate h-[78vh] min-h-[520px] overflow-hidden" aria-label="Featured photos">
      {/* Slides — stacked, cross-fading */}
      {heroSlides.map((slide, i) =>
        slide.kind === "photo" ? (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== idx}
          >
            {/* Only the first slide loads eagerly; the rest stay lazy by default. */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== idx}
          >
            {/* The poster is a real optimized image underneath the video, which
                makes it the LCP element instead of the <video> poster attribute. */}
            <Image
              src={slide.poster}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={i === idx && videoAllowed && !reducedMotion ? slide.src : undefined}
              aria-label={slide.alt}
              loop={heroSlides.length === 1}
              muted
              playsInline
              preload="none"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                readyIdx === i ? "opacity-100" : "opacity-0"
              }`}
              onCanPlay={() => setReadyIdx(i)}
              onEnded={() => {
                if (!paused) go(idx + 1);
              }}
            />
          </div>
        )
      )}
      {/* Navy wash for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-navy-950/30" />

      {/* Copy */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <p className="font-display text-lg font-semibold text-teal-300 md:text-xl">{hero.eyebrow}</p>
          <h1 className="mt-2 text-5xl font-bold text-white md:text-7xl">{hero.title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/contact" className="btn btn-primary px-7 py-4 text-lg">
              Get a quote
            </a>
            <a href={`tel:${business.phoneDial}`} className="btn btn-outline btn-outline-light">
              Call {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {heroSlides.length > 1 && (
        <>
        {/* Arrows */}
        <button
          type="button"
          onClick={() => manual(idx - 1)}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30 md:flex"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => manual(idx + 1)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30 md:flex"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => manual(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-teal-300" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
          </>
          )}
    </section>
  );
}
