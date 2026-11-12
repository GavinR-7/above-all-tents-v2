"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { eventTypes, interests, referralSources } from "@/data/site";

type Grecaptcha = {
  render: (el: HTMLElement, opts: { sitekey: string }) => number;
  getResponse: (id?: number) => string;
  reset: (id?: number) => void;
};
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    onRecaptchaLoad?: () => void;
  }
}

const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-teal-500";
const labelCls = "block text-sm font-bold text-navy-900";

export default function QuoteForm({ recaptchaSiteKey }: { recaptchaSiteKey?: string }) {
  const [submitted, setSubmitted] = useState(false);
  // Time trap: when this form instance rendered. Set after mount so server and
  // client markup match; reset each time the form is shown again.
  const [renderedAt, setRenderedAt] = useState("");
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!submitted) setRenderedAt(String(Date.now()));
  }, [submitted]);

  // reCAPTCHA: only when a site key is configured. The Google script loads
  // once; the widget is rendered into whichever container is mounted.
  const captchaRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || !recaptchaSiteKey) return;
      const draw = () => {
        if (!window.grecaptcha || !el.isConnected || el.childElementCount > 0) return;
        widgetId.current = window.grecaptcha.render(el, { sitekey: recaptchaSiteKey });
      };
      if (window.grecaptcha?.render) return draw();
      window.onRecaptchaLoad = draw;
      if (!document.getElementById("recaptcha-script")) {
        const s = document.createElement("script");
        s.id = "recaptcha-script";
        s.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
    },
    [recaptchaSiteKey]
  );
  const [picked, setPicked] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(item: string) {
    setPicked((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const recaptchaToken = recaptchaSiteKey && window.grecaptcha
      ? window.grecaptcha.getResponse(widgetId.current ?? undefined)
      : "";
    if (recaptchaSiteKey && !recaptchaToken) {
      setError("Please tick the “I’m not a robot” box before sending.");
      setSubmitting(false);
      return;
    }
    const payload = { ...Object.fromEntries(data), interested: picked, recaptchaToken };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Token is single-use; a failed attempt needs a fresh tick.
        if (recaptchaSiteKey) window.grecaptcha?.reset(widgetId.current ?? undefined);
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(res.status === 400 && body?.error ? body.error : "Request failed");
      }

      setSubmitted(true);
    } catch (err) {
      const captchaMsg = err instanceof Error && err.message.includes("robot") ? err.message : null;
      setError(captchaMsg ?? "Something went wrong sending your request — please try again or call us.");
    } finally {
      setSubmitting(false);
    }
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
      <input type="hidden" name="renderedAt" value={renderedAt} />
      {/* Honeypot: off-screen, skipped by keyboard and screen readers, ignored by autofill. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="companyUrl">Company website (leave blank)</label>
        <input id="companyUrl" name="companyUrl" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
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

      {recaptchaSiteKey && <div ref={captchaRef} className="mt-5 flex justify-center overflow-x-auto" />}

      <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {submitting ? "Sending…" : "Request my quote"}
      </button>
      {error && (
        <p className="mt-3 text-center text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-center text-xs text-ink-soft">
        We&apos;ll never share your info. Expect a reply within a day.
      </p>
    </form>
  );
}
