import { business } from "@/data/site";

// Mobile-only bottom bar: the two actions a phone visitor actually wants.
export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
      <a href={`tel:${business.phoneDial}`} className="btn btn-outline btn-outline-navy flex-1">
        Call
      </a>
      <a href="/contact" className="btn btn-primary flex-1">
        Get a quote
      </a>
    </div>
  );
}
