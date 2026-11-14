/**
 * Spam protection for the quote form: honeypot, minimum-time trap, reCAPTCHA.
 *
 * Server-side only. Anything can POST to the endpoint, so every check runs
 * here regardless of what the browser did.
 *
 * Env vars (names only, set in your hosting provider's environment, then rebuild):
 *   RECAPTCHA_SITE_KEY    public key, rendered into the page
 *   RECAPTCHA_SECRET_KEY  private key, used to verify tokens
 */

/** How long a person plausibly needs to fill the form. */
export const MIN_FILL_MS = 1500;

/** Honeypot field name. Looks worth filling in; humans never see it. */
export const HONEYPOT_FIELD = "companyUrl";

/** True if the honeypot was filled in. */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * True when the submission arrived impossibly fast after the form rendered.
 *
 * A missing timestamp counts as too fast: the browser always sends one, so a
 * bot that omits the field would otherwise skip the trap entirely. Negative
 * elapsed time (clock skew) is not treated as evidence of a bot.
 */
export function isTooFast(renderedAt: unknown, now = Date.now()): boolean {
  const ts = Number(renderedAt);
  if (!Number.isFinite(ts) || ts <= 0) return true;
  const elapsed = now - ts;
  if (elapsed < 0) return false;
  return elapsed < MIN_FILL_MS;
}

export type CaptchaResult = "ok" | "failed" | "skipped" | "unreachable";

/**
 * Verifies a reCAPTCHA token with Google.
 *
 * - No secret key configured: "skipped". Honeypot and time trap still
 *   enforce, so the form keeps working for humans while keys are pending.
 * - Key configured: a missing or invalid token is "failed". Fails closed.
 * - Google unreachable: "unreachable", which the route treats as a pass so a
 *   Google outage cannot swallow real leads. The honeypot and time trap have
 *   already run by then.
 */
export async function verifyRecaptcha(token: unknown): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // Both keys are needed: with only the secret set the page renders no widget,
  // so enforcing here would reject every human.
  if (!secret || !process.env.RECAPTCHA_SITE_KEY) return "skipped";
  if (typeof token !== "string" || token === "") return "failed";

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "unreachable";
    const json = (await res.json()) as { success?: boolean };
    return json.success === true ? "ok" : "failed";
  } catch {
    return "unreachable";
  }
}
