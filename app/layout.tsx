import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";

export const metadata: Metadata = {
  title: "Above All Tent Rentals | Long Island Tent & Party Rentals Since 2005",
  description:
    "Family-owned tent, inflatable, and party rentals serving all of Long Island for over 20 years. Tents, bounce houses, mechanical bull, tables, chairs & decor. Delivery and setup included.",
  openGraph: {
    title: "Above All Tent Rentals | Long Island Tent & Party Rentals",
    description:
      "Tents, inflatables, and party rentals — delivered and set up across Long Island since 2005.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        {/* Spacer so the mobile call bar never covers the footer */}
        <div className="h-16 md:hidden" aria-hidden="true" />
        <StickyCallBar />
      </body>
    </html>
  );
}
