import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryTiles from "@/components/CategoryTiles";
import Contact from "@/components/Contact";
import { about } from "@/data/site";

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <CategoryTiles />

      {/* About band */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Since 2005</p>
            <h2 className="mt-2 text-3xl md:text-5xl">{about.title}</h2>
            <p className="mt-1 font-display text-xl font-semibold text-teal-600">{about.subtitle}</p>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{about.body}</p>
            <p className="mt-4 text-ink-soft">{about.serviceLine}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src={about.photo}
                alt="Above All tent set up for an event"
                fill
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}
