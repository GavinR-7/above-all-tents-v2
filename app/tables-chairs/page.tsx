import type { Metadata } from "next";
import { PageHero, ItemCard, CtaBand } from "@/components/PageBlocks";
import { business, loungePage, photos, seo } from "@/data/site";
import GalleryLightbox from "@/components/GalleryLightbox";

export const metadata: Metadata = {
  title: seo.tablesChairs.title,
  description: seo.tablesChairs.description,
  alternates: { canonical: "/tables-chairs" },
  openGraph: {
    title: seo.tablesChairs.title,
    description: seo.tablesChairs.description,
    url: "/tables-chairs",
  },
};

export default function LoungeDecorPage() {
  return (
    <main>
      <PageHero
        title={loungePage.title}
        subtitle={loungePage.subtitle}
        intro={loungePage.intro}
        photo={photos.lounge.b}
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="eyebrow">The inventory</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Furnish the whole event.</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loungePage.items.map((item) => (
            <ItemCard
              key={item.name}
              item={item}
              sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
        <p className="mt-8 rounded-xl bg-mist p-5 text-sm text-ink-soft">
          {loungePage.note}{" "}
          <a href={`tel:${business.phoneDial}`} className="font-bold text-teal-600 hover:underline">
            {business.phoneDisplay}
          </a>
        </p>
      </section>

      <GalleryLightbox photos={loungePage.gallery} title="Set the scene" />
      <CtaBand text="From backyard BBQ to black tie — furnish it in one call." />
    </main>
  );
}
