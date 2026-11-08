import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";
import { about, business, photos, seo, siteUrl } from "@/data/site";

// Self-hosted at build time and preloaded, so there is no render-blocking
// request to fonts.googleapis.com. Both are variable fonts, so one file per
// family covers every weight the design uses. The CSS variables feed
// --font-display / --font-sans in globals.css.
const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

// LocalBusiness + ProfessionalService, assembled from what the page shows.
// No price range, rating, review count, or coordinates: none of those are
// printed. "Suffolk County" and "Long Island" are regions, not towns.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${siteUrl}/#business`,
  name: business.name,
  description: seo.home.description,
  url: siteUrl,
  telephone: business.phoneE164,
  email: business.email,
  logo: `${siteUrl}${photos.logoSquare}`,
  image: `${siteUrl}${about.photo}`,
  foundingDate: String(business.since),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.addressParts.street,
    addressLocality: business.addressParts.city,
    addressRegion: business.addressParts.state,
    postalCode: business.addressParts.zip,
    addressCountry: business.addressParts.country,
  },
  hasMap: business.mapsLink,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.hours.days,
      opens: business.hours.opens,
      closes: business.hours.closes,
    },
  ],
  areaServed: business.serviceAreas.map((area) => ({
    "@type": /County|Long Island/.test(area) ? "AdministrativeArea" : "City",
    name: `${area}, NY`,
  })),
  sameAs: [business.social.instagram.url, business.social.facebook.url],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunitoSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        {children}
        <Footer />
        {/* Spacer so the mobile call bar never covers the footer */}
        <div className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
        <StickyCallBar />
      </body>
    </html>
  );
}
