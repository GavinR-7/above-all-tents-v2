"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The one page-wide runtime.
 *
 * Mounted once, from the root layout. Two observers, not one per card:
 *
 *   - `[data-reveal]` fades in when it arrives. The gallery thumbnails use it.
 *     The hero poster, the hero heading, and the filmstrip photos do not:
 *     the poster is the homepage LCP image, and the filmstrip can peek under
 *     the 78vh hero on a phone.
 *
 *   - `[data-pause-offscreen]` toggles `data-paused`, which stops the filmstrip
 *     while it is off the screen. Hover-pause is CSS and does not come through
 *     here.
 *
 * It renders nothing. If this file never runs, the reveal rules never hide
 * anything (they wait for `data-reveal-ready` AND this observer), and the
 * filmstrip still loops, because that loop is a stylesheet.
 */

const PENDING_SELECTOR = "[data-reveal]:not([data-revealed])";
const PAUSE_SELECTOR = "[data-pause-offscreen]";

/** Past the fourth arrival in one frame, share a delay instead of stacking one. */
const MAX_STAGGER_INDEX = 4;

const SAFETY_NET_MS = 3000;

export default function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (!document.documentElement.hasAttribute("data-reveal-ready")) return;
    if (!("IntersectionObserver" in window)) return;

    const pending = Array.from(document.querySelectorAll<HTMLElement>(PENDING_SELECTOR));
    if (pending.length === 0) return;

    let observerRan = false;

    const reveal = (node: HTMLElement, index: number, instant: boolean) => {
      node.style.setProperty("--reveal-i", String(Math.min(index, MAX_STAGGER_INDEX)));
      node.setAttribute("data-revealed", instant ? "instant" : "");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        observerRan = true;
        const arriving: { node: HTMLElement; rect: DOMRect }[] = [];
        const passed: HTMLElement[] = [];

        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          const rect = node.getBoundingClientRect();
          if (rect.bottom <= 0) {
            passed.push(node);
            continue;
          }
          if (!entry.isIntersecting && rect.top >= window.innerHeight) continue;
          arriving.push({ node, rect });
        }

        for (const node of passed) {
          reveal(node, 0, true);
          observer.unobserve(node);
        }

        arriving.sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
        arriving.forEach(({ node }, index) => {
          reveal(node, index, false);
          observer.unobserve(node);
        });
      },
      { threshold: 0, rootMargin: "0px 0px 8% 0px" },
    );

    // After the first paint, so the observer's layout reads are not inside the
    // LCP window. The hero poster is already on screen by then.
    let frame = requestAnimationFrame(() => {
      frame = 0;
      for (const node of pending) observer.observe(node);
    });

    const net = window.setTimeout(() => {
      if (observerRan) return;
      pending.forEach((node) => reveal(node, 0, true));
      observer.disconnect();
    }, SAFETY_NET_MS);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.clearTimeout(net);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(PAUSE_SELECTOR);
    if (targets.length === 0 || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          if (entry.isIntersecting) delete node.dataset.paused;
          else node.dataset.paused = "";
        }
      },
      { rootMargin: "200px" },
    );

    for (const node of targets) observer.observe(node);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
