import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkFormSpam, countRejection, logSubmission } from "@/lib/formSpam";

const optionalText = z.string().trim().max(5000).optional();
const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(254),
  date: optionalText,
  guests: z.union([z.string().max(20), z.number().finite()]).optional(),
  eventType: optionalText, referral: optionalText, message: optionalText,
  interested: z.array(z.string().max(120)).max(30).default([]),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    countRejection("zod");
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const blocked = await checkFormSpam(body, request);
  if (blocked) return blocked;
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    countRejection("zod");
    return NextResponse.json(
      { ok: false, error: "Name, phone, and email are required." },
      { status: 400 }
    );
  }

  const { name, phone, email, date, guests, eventType, referral, message, interested } = parsed.data;

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

    logSubmission("above-all-tents-v2");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send quote request email:", err);
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 500 });
  }
}
