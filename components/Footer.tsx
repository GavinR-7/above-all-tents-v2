import { business, footerStrip, navAll, photos } from "@/data/site";

function IgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
function FbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 8h2V5h-2c-2 0-3 1.2-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.6.3-.9 1-.9z" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer>
      {/* Photo strip — the touch from his current footer Gavin liked */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {footerStrip.map((src) => (
          <div key={src} className="aspect-[16/9] overflow-hidden md:aspect-[4/3] lg:aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Above All Tent Rentals event" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>

      {/* Contact row */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-center sm:grid-cols-2 lg:grid-cols-4">
          <a href={business.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-soft transition-colors hover:text-teal-600">
            {business.address}
          </a>
          <a href={`tel:${business.phoneDial}`} className="font-display font-bold text-navy-900 transition-colors hover:text-teal-600">
            {business.phoneDisplay} <span className="block text-xs font-normal tracking-[0.3em] text-ink-soft">{business.phoneDigits}</span>
          </a>
          <a href={`mailto:${business.email}`} className="text-sm text-ink-soft transition-colors hover:text-teal-600">
            {business.email}
          </a>
          <a href={business.djSite} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-soft underline decoration-teal-300 underline-offset-2 transition-colors hover:text-teal-600">
            In The Mood DJ Productions
          </a>
        </div>
      </div>

      {/* Navy bottom */}
      <div className="bg-navy-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-10 md:flex-row md:justify-between">
          <a href="/" aria-label={business.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.logo} alt={business.name} className="h-12 w-auto" />
          </a>

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {navAll.map((item) => (
              <a key={item.href} href={item.href} className="font-display text-sm font-semibold text-white/75 transition-colors hover:text-teal-300">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-teal-500 hover:text-white">
              <IgIcon />
            </a>
            <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-teal-500 hover:text-white">
              <FbIcon />
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-sm text-white/45">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
