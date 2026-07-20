import type { Metadata } from "next";
import { PageHero, Gallery, CtaBand } from "@/components/PageBlocks";
import SizingCalculator from "@/components/SizingCalculator";
import { CALL_FOR_PRICING, photos, tentPage, tents } from "@/data/site";

export const metadata: Metadata = {
  title: "Tent Rentals | Above All Tent Rentals - Long Island",
  description:
    "High-peak frame tent rentals in five sizes, delivered and set up anywhere on Long Island. Use our sizing guide to find the right tent for your guest count.",
};

export default function TentsPage() {
  return (
    <main>
      <PageHero title={tentPage.title} intro={tentPage.intro} photo={photos.tents.new2} />

      <SizingCalculator />

      {/* The five sizes + sidewalls, each with its price slot */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="eyebrow">Our tents</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Five sizes, one call.</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">{tentPage.addOnsNote}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tents.map((t) => (
            <div key={t.size} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-bold text-navy-900">{t.size} Tent</h3>
                <span className="text-sm text-ink-soft">{t.sqft} sq ft</span>
              </div>
              <p className="mt-2 text-[0.95rem] text-ink-soft">
                Fits {t.tables} round tables — seats {t.seatsRec} comfortably, up to {t.seatsMax}.
              </p>
              <p className="price mt-4">{t.price ?? CALL_FOR_PRICING}</p>
            </div>
          ))}

          {/* Sidewalls */}
          <div className="rounded-2xl border border-teal-300 bg-teal-100/50 p-6">
            <h3 className="font-display text-2xl font-bold text-navy-900">{tentPage.sidewalls.name}</h3>
            <p className="mt-2 text-[0.95rem] text-ink-soft">{tentPage.sidewalls.blurb}</p>
            <p className="price mt-4">{tentPage.sidewalls.price ?? CALL_FOR_PRICING}</p>
          </div>
        </div>

        {/* Good to know */}
        <div className="mt-10 rounded-2xl bg-mist p-6 md:p-8">
          <h3 className="font-display text-lg font-bold text-navy-900">Good to know</h3>
          <ul className="mt-3 grid gap-2.5 md:grid-cols-3">
            {tentPage.goodToKnow.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <span className="mt-0.5 text-teal-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Gallery photos={tentPage.gallery} title="Tents we've set up" />
      <CtaBand />
    </main>
  );
}
