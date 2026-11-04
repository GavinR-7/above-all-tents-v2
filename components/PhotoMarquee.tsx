import Image from "next/image";
import type { CSSProperties } from "react";

import { homeFilmstrip } from "@/data/site";

/**
 * One tile, in CSS pixels, including the gap that keeps the loop seamless.
 *
 * `w-64` is 16rem and `pr-4` is 1rem. At the default root size that is 272px.
 * Duration is that width times the tile count times two copies, divided by
 * 29px/s, so adding a photo changes the duration and not the speed.
 */
const TILE_PX = 272;
const PX_PER_SECOND = 29;

function Frames({ duplicate = false }: { duplicate?: boolean }) {
  const { shots } = homeFilmstrip;
  return (
    <ul
      aria-hidden={duplicate || undefined}
      data-marquee-duplicate={duplicate ? "" : undefined}
      data-marquee-row=""
      className="flex shrink-0"
    >
      {shots.map((shot) => (
        <li key={`${duplicate ? "b" : "a"}-${shot.src}`} className="shrink-0 pr-4">
          <div className="relative h-36 w-64 overflow-hidden rounded-2xl border border-line bg-mist">
            <Image
              src={shot.src}
              alt={duplicate ? "" : shot.alt}
              fill
              sizes="16rem"
              className="object-cover"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * A continuous photo strip in the band under the homepage hero.
 *
 * The hero itself is left alone. Its poster image is the LCP element, and the
 * video source stays deferred until the browser is idle. This band is the next
 * section, the photos are not `priority`, and nothing here carries
 * `data-reveal`, so a sliver of the heading that peeks under a tall phone
 * cannot fade in during first paint.
 *
 * The loop pauses while the pointer is over the strip (see `.marquee:hover`
 * in globals.css) and while the strip is offscreen (`data-pause-offscreen`).
 * Reduced motion drops the second copy and wraps the row; the global
 * reduced-motion rule already sets `animation: none`.
 *
 * One row of six tiles is 1632px. The site's column is `max-w-6xl` (72rem,
 * 1152px), so the strip is that wide and the row covers it for the whole
 * loop. Left full-bleed, a 1920px window is wider than the row and the track's
 * right edge opens a blank band at the end of every cycle.
 */
export default function PhotoMarquee() {
  const { shots, eyebrow, title, cta, href } = homeFilmstrip;
  if (shots.length === 0) return null;

  const duration = `${Math.max(40, Math.round((shots.length * TILE_PX * 2) / PX_PER_SECOND))}s`;

  return (
    <section className="bg-white py-14 md:py-20" aria-label={title}>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-3xl md:text-4xl">{title}</h2>
        </div>
        <a href={href} className="btn btn-outline btn-outline-navy min-h-11 w-fit">
          {cta}
        </a>
      </div>

      <div
        data-pause-offscreen=""
        className="marquee mx-auto mt-8 max-w-6xl"
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        <div data-marquee-track="" className="flex">
          <Frames />
          <Frames duplicate />
        </div>
      </div>
    </section>
  );
}
