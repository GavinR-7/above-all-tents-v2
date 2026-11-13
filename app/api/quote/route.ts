import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  HONEYPOT_FIELD,
  isHoneypotFilled,
  isTooFast,
  verifyRecaptcha,
} from "@/lib/spam";

type QuoteRequestBody = {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  guests?: string | number;
  eventType?: string;
  referral?: string;
  interested?: string[];
  message?: string;
  companyUrl?: string;
  renderedAt?: string | number;
  recaptchaToken?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: QuoteRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  /*
   * Spam checks run before anything else. Honeypot and time trap return a
   * silent 200 so a bot can't tell it was caught; nothing is sent. A failed
   * captcha is a real 400 because a human can fix it by retrying.
   */
  if (isHoneypotFilled(body[HONEYPOT_FIELD]) || isTooFast(body.renderedAt)) {
    return NextResponse.json({ ok: true });
  }

  const captcha = await verifyRecaptcha(body.recaptchaToken);
  if (captcha === "failed") {
    return NextResponse.json(
      { ok: false, error: "Please tick the \"I'm not a robot\" box and try again." },
      { status: 400 }
    );
  }

  const { name, phone, email, date, guests, eventType, referral, message } = body;
  const interested = Array.isArray(body.interested) ? body.interested : [];

  if (!name || !phone || !email) {
    return NextResponse.json(
      { ok: false, error: "Name, phone, and email are required." },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL;
  const fromEmail = process.env.QUOTE_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    console.error(
      "Quote request email is not configured — set RESEND_API_KEY, QUOTE_TO_EMAIL, and QUOTE_FROM_EMAIL."
    );
    return NextResponse.json(
      { ok: false, error: "Server is not configured to send email." },
      { status: 500 }
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["Event date", date || "—"],
    ["Estimated guests", guests ? String(guests) : "—"],
    ["Occasion", eventType || "—"],
    ["Interested in", interested.length ? interested.join(", ") : "—"],
    ["Heard about us via", referral || "—"],
    ["Message", message || "—"],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="font-weight: bold; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
          <td style="white-space: pre-wrap;">${escapeHtml(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New quote request from ${name}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send quote request email:", err);
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 500 });
  }
}
