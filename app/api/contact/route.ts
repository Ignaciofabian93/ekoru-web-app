import { NextResponse } from "next/server";
import { Resend } from "resend";

// Subject keys accepted from the contact form, mapped to a readable label for
// the email subject line. Validating server-side against this allow-list keeps
// the incoming `subject` constrained to known values (no arbitrary text reaches
// the mail body's subject line).
const SUBJECT_LABELS: Record<string, string> = {
  platformIssues: "Platform issues",
  accountProblems: "Account problems",
  paymentBilling: "Payment & billing",
  productInquiry: "Product inquiry",
  feedback: "Feedback & suggestions",
  other: "Other",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json({ message: "Contact service is not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as ContactPayload;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const subject = typeof body.subject === "string" ? body.subject : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_RE.test(email) || !SUBJECT_LABELS[subject] || message.length < 10) {
    return NextResponse.json({ message: "Invalid contact submission" }, { status: 400 });
  }

  const subjectLabel = SUBJECT_LABELS[subject];
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `[Contact] ${subjectLabel} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subjectLabel}\n\n${message}`,
    html: `
      <div style="font-family: system-ui, sans-serif; line-height: 1.6;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subjectLabel)}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ message: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
