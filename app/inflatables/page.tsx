import type { Metadata } from "next";
import { PageHero, ItemCard, CtaBand } from "@/components/PageBlocks";
import { inflatablesPage, photos } from "@/data/site";
import GalleryLightbox from "@/components/GalleryLightbox";

export const metadata: Metadata = {
  title: "Inflatable Rentals | Above All Tent Rentals - Long Island",
  description:
    "Bounce houses, water slides, obstacle courses rentals — clean, sanitized, delivered and set up anywhere on Long Island.",
};

export default function InflatablesPage() {
  return (
    <main>
      <PageHero title={inflatablesPage.title} intro={inflatablesPage.intro} photo={photos.inflatables.d} />

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
