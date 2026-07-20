"use client";

import { useState } from "react";
import { business, navLeft, navRight, navAll, photos } from "@/data/site";

const linkCls =
  "font-display text-[0.95rem] font-semibold text-white/85 transition-colors hover:text-teal-300";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      {/* Desktop: split nav with the logo as the centerpiece */}
      <div className="mx-auto hidden max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-3 md:grid">
        <nav className="flex items-center justify-end gap-10">
          {navLeft.map((item) => (
            <a key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="/" aria-label={business.name} className="px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos.logo}
            alt={business.name}
            className="h-16 w-auto lg:h-20"
          />
        </a>

        <nav className="flex items-center gap-10">
          {navRight.map((item) => (
            <a key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </a>
          ))}
          <a
            href={`tel:${business.phoneDial}`}
            className="rounded-full bg-teal-500 px-4 py-2 font-display text-sm font-bold text-white transition-colors hover:bg-teal-600"
          >
            {business.phoneDisplay}
          </a>
        </nav>
      </div>

      {/* Mobile: logo left, hamburger right */}
      <div className="flex items-center justify-between px-5 py-3 md:hidden">
        <a href="/" aria-label={business.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.logo} alt={business.name} className="h-12 w-auto" />
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-900 md:hidden">
          <nav className="flex flex-col px-5 py-2">
            {navAll.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 font-display font-semibold text-white/90 last:border-0"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 py-3">
              <a href={`tel:${business.phoneDial}`} className="btn btn-outline btn-outline-light">
                Call {business.phoneDisplay}
              </a>
              <a href="/contact" onClick={() => setOpen(false)} className="btn btn-primary">
                Get a quote
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
