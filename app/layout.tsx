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
  title: seo.home.title,
  description: seo.home.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.home.title,
    description: seo.home.description,
    url: siteUrl,
    siteName: business.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// LocalBusiness structured data, assembled entirely from data/site.ts so the
// markup can't drift from what the page says. "Suffolk County" and
// "Long Island" are regions, not towns, so they get AdministrativeArea.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: business.name,
  url: siteUrl,
  telephone: business.phoneE164,
  email: business.email,
  priceRange: business.priceRange,
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
  geo: {
    "@type": "GeoCoordinates",
    latitude: business.geo.lat,
    longitude: business.geo.lng,
  },
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
  sameAs: Object.values(business.social).map((profile) => profile.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunitoSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
