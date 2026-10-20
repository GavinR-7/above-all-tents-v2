# Above All Tent Rentals — website (v2)

Multi-page rebuild of abovealltents.com. Next.js 15 (App Router) + TypeScript + Tailwind v4.
Teal (from his logo) + navy on white, centered-logo header, hero photo carousel.

## Overview

**Problem.** A tent, inflatable and party-rental business on Long Island needed a site customers could use on a phone to work out what size tent fits their guest count and ask for a quote.

**Outcome.** Designed, built, delivered and handed over on the client's own domain, [abovealltents.com](https://abovealltents.com). No traffic or conversion figures are claimed here; none have been recorded with a source.

**Design decisions.**
- **All content in one typed file** (`data/site.ts`): copy, photos, phone numbers, inventory and the sizing chart. Changing a price or phone number is a data edit, not a code change; items with no price render "Call for pricing."
- **A sizing calculator** (`/tents`) with documented rules: one round table per 100 sq ft, 10 chairs per table (the client's rule); above 80 guests it combines tents.
- **Five focused pages** (tents, inflatables, mechanical bull, tables and chairs, contact) rather than one long page.

**Stack.** Next.js 15 (App Router), TypeScript, Tailwind CSS v4. The live site is served from the web contractor's server, which pulls `master` automatically, so a merge to `master` goes live within minutes (the Deploy section below describes the original Vercel demo setup).

> The "Before launch" list at the bottom was written for the pre-launch demo and may be out of date; check it against the live site before relying on it.

## Pages

- `/` — carousel hero, category tiles (B&W → color on hover), about band, contact
- `/tents` — sizing calculator, 5 sizes + sidewalls, gallery
- `/inflatables` — item cards, gallery
- `/mechanical-bull` — the bull on its own page (own 516 number), video, gallery
- `/tables-chairs` — tables/chairs/linens/lighting/LED/lounge items, gallery
- `/contact` — quote form + contact info + map

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub → import in Vercel → Deploy. No env vars needed for the demo.

## Editing content

Everything lives in **`data/site.ts`** — copy, photos, phone numbers, inventory, the sizing chart.

**Prices:** every rentable item has a `price` field set to `null`, which renders a quiet
"Call for pricing." Put a string in (e.g. `"$150/day"`) and it shows automatically. No code changes.

**Calculator math:** one round table per 100 sq ft, 10 chairs per table (`seatsMax = tables × 10`). Over 80
guests it combines tents (fills with 40×20s, covers the remainder with the smallest fit).

## Before launch (not blocking the demo)

1. **Photos hotlink his current site** — download into `/public` and swap paths in `data/site.ts` before the old site comes down. A few item cards reuse gallery shots or show a placeholder (dunk tank) — get real per-item photos from Mike.
2. **Quote form doesn't send yet** — wire to Formspree or a Resend API route (TODO in `components/QuoteForm.tsx`).
3. **Confirm domain control** (registrar: Pzitive) — the only real launch blocker.
4. Confirm hours if he wants them shown; pick which Instagram to feature (currently the tent-rental one).
