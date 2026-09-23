import type { Metadata } from "next";
import Contact from "@/components/Contact";
import { seo } from "@/data/site";

export const metadata: Metadata = {
  title: seo.contact.title,
  description: seo.contact.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: seo.contact.title,
    description: seo.contact.description,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
