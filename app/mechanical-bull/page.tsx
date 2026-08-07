import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/PageBlocks";
import GalleryLightbox from "@/components/GalleryLightbox";
import { bull, business, CALL_FOR_PRICING, photos } from "@/data/site";

export const metadata: Metadata = {
  title: "Mechanical Bull Rental Long Island | Above All Tent Rentals",
  description:
    "Mechanical bull rental on Long Island with a professional operator and inflatable safety arena included. Delivery, setup, and takedown handled — book the showstopper for your next event.",
};

export default function MechanicalBullPage() {
  return (
    <main>
      <PageHero title={bull.title} intro={bull.body[0]} photo={photos.inflatables.bull0} />

      <section className="bg-navy-900 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos.inflatables.bull1}
                alt="Mechanical bull in its inflatable safety arena"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="eyebrow text-teal-300">{bull.eyebrow}</p>
            <h2 className="mt-2 text-3xl text-white md:text-5xl">{bull.title}</h2>
            {bull.body.map((p, i) => (
              <p key={i} className="mt-4 text-white/80">
                {p}
              </p>
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
              <span className="text-sm text-white/60">
                {bull.price ?? CALL_FOR_PRICING} · {bull.note}
              </span>
            </div>
          </div>
        </div>
      </section>

      <GalleryLightbox photos={bull.gallery} title="The bull in action" />
      <CtaBand text="Ready to book the showstopper? Give us a call." />
    </main>
  );
}
