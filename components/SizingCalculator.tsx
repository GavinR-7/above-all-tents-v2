"use client";

import { useState } from "react";
import { business, calculatorCopy, tents, type Tent } from "@/data/site";

const PRESETS = [20, 40, 60, 80, 120, 160];
const LARGEST = tents[tents.length - 1]; // 40 × 20, seats up to 80

// For parties bigger than one tent: fill with 40×20s, then cover the
// remainder with the smallest tent that fits it.
// 85 → 40 + 10 · 130 → 40 + 30 · 160 → 40 ×2
function recommend(guests: number): Map<string, { tent: Tent; count: number }> {
  const rec = new Map<string, { tent: Tent; count: number }>();
  const add = (tent: Tent) => {
    const cur = rec.get(tent.size);
    rec.set(tent.size, { tent, count: (cur?.count ?? 0) + 1 });
  };

  let remaining = guests;
  while (remaining > LARGEST.seatsMax) {
    add(LARGEST);
    remaining -= LARGEST.seatsMax;
  }
  if (remaining > 0) {
    add(tents.find((t) => t.seatsMax >= remaining)!); // smallest tent covering the rest
  }
  return rec;
}

export default function SizingCalculator() {
  const [guests, setGuests] = useState(40);
  const clamp = (n: number) => Math.max(1, Math.min(500, n));

  const rec = recommend(guests);
  const combo = [...rec.values()];
  const isCombo = guests > LARGEST.seatsMax;

  return (
    <section id="sizing" className="bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="eyebrow">Find your fit</p>
          <h2 className="mt-2 text-3xl md:text-5xl">{calculatorCopy.title}</h2>
          <p className="mt-3 text-lg text-ink-soft">{calculatorCopy.sub}</p>
        </div>

        {/* Guest counter + readout */}
        <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <label className="block font-display text-sm font-bold uppercase tracking-wider text-ink-soft">
                How many guests?
              </label>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests((g) => clamp(g - 5))}
                  className="h-11 w-11 rounded-full bg-mist text-2xl leading-none text-navy-900 transition-colors hover:bg-teal-200"
                  aria-label="Fewer guests"
                >
                  −
                </button>
                <input
                  type="number"
                  value={guests}
                  min={1}
                  onChange={(e) => setGuests(clamp(Number(e.target.value) || 1))}
                  className="w-24 rounded-lg border border-line px-3 py-2 text-center text-2xl font-bold text-navy-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Number of guests"
                />
                <button
                  type="button"
                  onClick={() => setGuests((g) => clamp(g + 5))}
                  className="h-11 w-11 rounded-full bg-mist text-2xl leading-none text-navy-900 transition-colors hover:bg-teal-200"
                  aria-label="More guests"
                >
                  +
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setGuests(p)}
                    className={`rounded-full px-3.5 py-1 text-sm font-semibold transition-colors ${
                      guests === p
                        ? "bg-teal-500 text-white"
                        : "bg-mist text-ink-soft hover:bg-teal-200 hover:text-navy-900"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Readout */}
            <div className="w-full rounded-xl bg-teal-100 p-5 text-center md:w-80">
              <p className="text-sm text-ink-soft">
                {isCombo
                  ? `For about ${guests} guests, we'd combine:`
                  : `For about ${guests} guests, we'd suggest a`}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-teal-700">
                {combo.map(({ tent, count }, i) => (
                  <span key={tent.size}>
                    {i > 0 && <span className="text-ink-soft"> + </span>}
                    {tent.size}
                    {count > 1 && <span className="text-xl"> ×{count}</span>}
                  </span>
                ))}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {combo.reduce((n, c) => n + c.tent.tables * c.count, 0)} tables ·{" "}
                {combo.reduce((n, c) => n + c.tent.seatsMax * c.count, 0)} seats
              </p>
            </div>
          </div>
          <p className="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
            {calculatorCopy.callLine}{" "}
            <a href={`tel:${business.phoneDial}`} className="font-bold text-teal-600 hover:underline">
              {business.phoneDisplay}
            </a>
          </p>
        </div>

        {/* Size chart */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {tents.map((t) => {
            const inCombo = rec.get(t.size);
            return (
              <div
                key={t.size}
                className={`relative rounded-xl border p-5 transition-all ${
                  inCombo
                    ? "border-teal-500 bg-white shadow-md ring-2 ring-teal-500"
                    : "border-line bg-white"
                }`}
              >
                {inCombo && (
                  <span className="absolute -top-3 left-4 rounded-full bg-teal-500 px-2.5 py-0.5 font-display text-xs font-bold text-white">
                    {inCombo.count > 1 ? `Recommended ×${inCombo.count}` : "Recommended"}
                  </span>
                )}
                <p className="font-display text-2xl font-bold text-navy-900">{t.size}</p>
                <p className="text-sm text-ink-soft">{t.sqft} sq ft</p>
                <dl className="mt-3 space-y-1 text-sm text-ink-soft">
                  <div className="flex justify-between">
                    <dt>Round tables</dt>
                    <dd className="font-bold text-navy-900">{t.tables}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Seats</dt>
                    <dd className="font-bold text-navy-900">{t.seatsMax}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
