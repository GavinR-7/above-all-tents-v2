import { categoryTiles } from "@/data/site";

// Mosaic like his current homepage: Tents tall on the left, the other two
// stacked on the right. Tiles are black & white until hovered (see globals.css
// .tile) — the detail Gavin specifically wanted kept.
export default function CategoryTiles() {
  const [tentsTile, ...rest] = categoryTiles;

  const Tile = ({
    tile,
    className,
  }: {
    tile: (typeof categoryTiles)[number];
    className?: string;
  }) => (
    <a
      href={tile.href}
      className={`tile group relative block overflow-hidden rounded-2xl ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.photo}
        alt={tile.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{tile.name}</h3>
          <p className="mt-1 max-w-xs text-sm text-white/80">{tile.blurb}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white transition-transform group-hover:translate-x-1"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">What we rent</p>
          <h2 className="mt-2 text-3xl md:text-5xl">Everything the party needs.</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:h-[560px] md:grid-cols-5 md:grid-rows-2">
        <Tile tile={tentsTile} className="h-72 md:col-span-2 md:row-span-2 md:h-auto" />
        {rest.map((tile) => (
          <Tile key={tile.href} tile={tile} className="h-72 md:col-span-3 md:h-auto" />
        ))}
      </div>
    </section>
  );
}
