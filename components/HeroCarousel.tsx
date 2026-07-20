"use client";

import { useEffect, useRef, useState } from "react";
import { business, hero, heroSlides } from "@/data/site";

const AUTO_MS = 5000;

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (n: number) => setIdx((n + heroSlides.length) % heroSlides.length);

  // Manual navigation pauses auto-advance so the carousel doesn't fight the user.
  const manual = (n: number) => {
    setPaused(true);
    go(n);
  };

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => go(idx + 1), AUTO_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused]);

  return (
    <section className="relative isolate h-[78vh] min-h-[520px] overflow-hidden" aria-label="Featured photos">
      {/* Slides — stacked, cross-fading */}
      {heroSlides.map((slide, i) => (
        <div
          key={slide.photo}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== idx}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.photo} alt={slide.alt} className="h-full w-full object-cover" />
        </div>
      ))}
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

      {/* Arrows */}
      <button
        type="button"
        onClick={() => manual(idx - 1)}
        aria-label="Previous photo"
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30 md:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => manual(idx + 1)}
        aria-label="Next photo"
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
            aria-label={`Go to photo ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-teal-300" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
