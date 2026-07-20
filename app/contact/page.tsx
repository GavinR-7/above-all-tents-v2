import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | Above All Tent Rentals - Long Island",
  description:
    "Get a quote for tents, inflatables, and party rentals anywhere on Long Island. Call 631-265-TENT or send us your event details.",
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
