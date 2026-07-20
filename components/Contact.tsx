import { business, contactCopy } from "@/data/site";
import QuoteForm from "./QuoteForm";

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="quote" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Get started</p>
          <h2 className="mt-2 text-3xl md:text-5xl">{contactCopy.title}</h2>
          <p className="mt-4 text-lg text-ink-soft">{contactCopy.body}</p>

          <div className="mt-8 space-y-4">
            <a href={`tel:${business.phoneDial}`} className="flex items-center gap-3 text-lg font-bold text-navy-900 transition-colors hover:text-teal-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <PhoneIcon />
              </span>
              {business.phoneDisplay} <span className="text-sm font-normal text-ink-soft">({business.phoneDigits})</span>
            </a>
            <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-ink transition-colors hover:text-teal-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <MailIcon />
              </span>
              {business.email}
            </a>
            <a href={business.mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-ink transition-colors hover:text-teal-600">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <PinIcon />
              </span>
              <span>{business.address}</span>
            </a>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line shadow-sm">
            <iframe
              title="Above All Tent Rentals location"
              src={business.mapsEmbed}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <QuoteForm />
      </div>
    </section>
  );
}
