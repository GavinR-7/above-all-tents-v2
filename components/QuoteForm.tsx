"use client";

import { useState } from "react";
import { eventTypes, interests, referralSources } from "@/data/site";

const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-teal-500";
const labelCls = "block text-sm font-bold text-navy-900";

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(item: string) {
    setPicked((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // -----------------------------------------------------------------------
    // TODO (before launch): wire this to a real handler so Mike gets the lead.
    //   1. Formspree — set the <form action> to your Formspree endpoint, or
    //   2. app/api/quote/route.ts that emails via Resend.
    // -----------------------------------------------------------------------
    const data = new FormData(e.currentTarget);
    console.log("Quote request:", Object.fromEntries(data), { interested: picked });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-line bg-white p-10 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl">Request sent!</h3>
        <p className="mt-2 max-w-sm text-ink-soft">
          Thanks — we&apos;ll get back to you within a day to talk through your event and put a quote together.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className="btn btn-outline btn-outline-navy mt-6">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelCls}>Name</label>
          <input id="name" name="name" required className={`${field} mt-1.5`} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" name="phone" type="tel" required className={`${field} mt-1.5`} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" required className={`${field} mt-1.5`} />
        </div>
        <div>
          <label htmlFor="date" className={labelCls}>Event date</label>
          <input id="date" name="date" type="date" className={`${field} mt-1.5`} />
        </div>
        <div>
          <label htmlFor="guests" className={labelCls}>Estimated guests</label>
          <input id="guests" name="guests" type="number" min={1} className={`${field} mt-1.5`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="eventType" className={labelCls}>What&apos;s the occasion?</label>
          <select id="eventType" name="eventType" defaultValue="" className={`${field} mt-1.5`}>
            <option value="" disabled>Select one…</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={labelCls}>What are you interested in?</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {interests.map((item) => {
            const on = picked.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggle(item)}
                aria-pressed={on}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  on
                    ? "border-teal-500 bg-teal-500 text-white"
                    : "border-line bg-white text-ink-soft hover:border-teal-500"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="referral" className={labelCls}>How&apos;d you hear about us?</label>
          <select id="referral" name="referral" defaultValue="" className={`${field} mt-1.5`}>
            <option value="" disabled>Select one…</option>
            {referralSources.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelCls}>Anything else? (optional)</label>
        <textarea id="message" name="message" rows={4} className={`${field} mt-1.5 resize-y`} />
      </div>

      <button type="submit" className="btn btn-primary mt-6 w-full">
        Request my quote
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        We&apos;ll never share your info. Expect a reply within a day.
      </p>
    </form>
  );
}
