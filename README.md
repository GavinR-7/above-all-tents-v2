# Above All Tent Rentals — website (v2)

Multi-page rebuild of abovealltents.com. Next.js 15 (App Router) + TypeScript + Tailwind v4.
Teal (from his logo) + navy on white, centered-logo header, hero photo carousel.

## Pages

- `/` — carousel hero, category tiles (B&W → color on hover), about band, contact
- `/tents` — sizing calculator, 5 sizes + sidewalls, gallery
- `/inflatables` — mechanical bull feature (own 516 number), item cards, gallery
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

**Calculator math:** 8 chairs/table recommended, up to 10; capacity uses the max. Over 80
guests it combines tents (fills with 40×20s, covers the remainder with the smallest fit).

## Before launch (not blocking the demo)

1. **Photos hotlink his current site** — download into `/public` and swap paths in `data/site.ts` before the old site comes down. A few item cards reuse gallery shots or show a placeholder (dunk tank) — get real per-item photos from Mike.
2. **Quote form doesn't send yet** — wire to Formspree or a Resend API route (TODO in `components/QuoteForm.tsx`).
3. **Confirm domain control** (registrar: Pzitive) — the only real launch blocker.
4. Confirm hours if he wants them shown; pick which Instagram to feature (currently the tent-rental one).
