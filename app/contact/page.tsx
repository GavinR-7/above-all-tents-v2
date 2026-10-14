import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import Contact from "@/components/Contact";
import { seo } from "@/data/site";

export const metadata: Metadata = pageMetadata("/contact", seo.contact);

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
