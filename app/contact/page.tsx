import Contact from "@/components/Contact";
import { pageMetadata } from "@/data/site";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
