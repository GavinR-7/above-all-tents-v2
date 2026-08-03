import type { Metadata } from "next";
import { PageHero, ItemCard, CtaBand } from "@/components/PageBlocks";
import { bull, business, CALL_FOR_PRICING, inflatablesPage, photos } from "@/data/site";
import GalleryLightbox from "@/components/GalleryLightbox";

export const metadata: Metadata = {
  title: "Inflatable Rentals | Above All Tent Rentals - Long Island",
  description:
    "Bounce houses, water slides, obstacle courses, dunk tanks, and mechanical bull rentals — clean, sanitized, delivered and set up anywhere on Long Island.",
};

export default function InflatablesPage() {
  return (
    <main>
      <PageHero title={inflatablesPage.title} intro={inflatablesPage.intro} photo={photos.inflatables.d} />

      {/* Mechanical bull — the headliner, with its own booking line */}
      <section className="bg-navy-900 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bull.photo} alt="Mechanical bull in its inflatable safety arena" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="eyebrow text-teal-300">{bull.eyebrow}</p>
            <h2 className="mt-2 text-3xl text-white md:text-5xl">{bull.title}</h2>
            {bull.body.map((p, i) => (
              <p key={i} className="mt-4 text-white/80">{p}</p>
            ))}
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {bull.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                  <span className="mt-0.5 text-teal-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href={`tel:${business.bullPhoneDial}`} className="btn btn-primary">
                Reserve the bull — {business.bullPhoneDisplay}
              </a>
              <span className="text-sm text-white/60">{bull.price ?? CALL_FOR_PRICING} · {bull.note}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="eyebrow">The lineup</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Pick your fun.</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inflatablesPage.items.map((item) => (
            <ItemCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <GalleryLightbox photos={inflatablesPage.gallery} title="At the party" />
      <CtaBand text="Kids' favorite day of the summer starts with one call." />
    </main>
  );
}
