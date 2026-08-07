import { business, CALL_FOR_PRICING, type RentalItem } from "@/data/site";

// --- Page hero for category pages ------------------------------------------
export function PageHero({
  title,
  subtitle,
  intro,
  photo,
}: {
  title: string;
  subtitle?: string;
  intro: string;
  photo: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 to-navy-950/50" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
        <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 font-display text-lg font-semibold text-teal-300 md:text-xl">{subtitle}</p>
        )}
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{intro}</p>
      </div>
    </section>
  );
}

// --- Rental item card --------------------------------------------------------
// The price line: shows the item's price if Mike sets one in data/site.ts,
// otherwise a quiet "Call for pricing".
export function ItemCard({ item }: { item: RentalItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      {item.photo ? (
        <div className="aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.photo} alt={item.name} className="h-full w-full object-cover" />
        </div>
      ) : (
        // No dedicated photo yet — teal placeholder until Mike supplies one.
        <div className="flex aspect-[4/3] items-center justify-center bg-teal-100">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-teal-500" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 17l5-4 3 2.5L16 12l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold">{item.name}</h3>
        <p className="mt-1.5 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{item.blurb}</p>
        <p className="price mt-3">{item.price ?? CALL_FOR_PRICING}</p>
      </div>
    </div>
  );
}

// --- Bottom CTA band ---------------------------------------------------------
export function CtaBand({ text = "Summer weekends book up early — lock your date in." }: { text?: string }) {
  return (
    <section className="bg-navy-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-14 text-center md:flex-row md:justify-between md:text-left">
        <h2 className="max-w-xl text-2xl text-white md:text-3xl">{text}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/contact" className="btn btn-primary">
            Get a quote
          </a>
          <a href={`tel:${business.phoneDial}`} className="btn btn-outline btn-outline-light">
            Call {business.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
