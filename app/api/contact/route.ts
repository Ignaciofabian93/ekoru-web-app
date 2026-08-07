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

const ACKNOWLEDGEMENT_TEXT = (name: string) =>
  `Hola ${name},\n\nHemos recibido tu mensaje y te responderemos dentro de las próximas 24–48 horas.\n\nEquipo EKORU`;

/** Confirmation sent back to whoever wrote in, mirroring the informative site. */
const acknowledgementHtml = (name: string) => `
  <div style="margin:0;padding:0;background:#f4f4f4;font-family:system-ui,'Segoe UI',sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#0d9488 0%,#14b8a6 100%);padding:32px 24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:600;">¡Gracias por contactarnos!</h1>
        <p style="margin:8px 0 0;color:#fff;opacity:.95;font-size:14px;">EKORU — Economía Circular</p>
      </div>
      <div style="padding:32px 24px;">
        <p style="margin:0 0 16px;color:#1f2937;font-size:17px;font-weight:600;">Hola ${escapeHtml(name)} 👋</p>
        <p style="margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.6;">
          Hemos recibido tu mensaje y queremos agradecerte por ponerte en contacto con nosotros.
        </p>
        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.6;">
          Nuestro equipo lo revisará y te responderá lo antes posible, generalmente dentro de las próximas 24–48 horas.
        </p>
      </div>
      <div style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 6px;color:#1f2937;font-weight:600;font-size:14px;">Equipo EKORU</p>
        <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} EKORU — Economía Circular</p>
      </div>
    </div>
  </div>
`;

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

  // Acknowledgement to the sender, as the informative site does. Deliberately
  // not awaited into the result: the message already reached the team, so a
  // failure here must not report the submission as failed.
  void resend.emails
    .send({
      from,
      to: email,
      subject: "Gracias por contactarnos — EKORU",
      text: ACKNOWLEDGEMENT_TEXT(name),
      html: acknowledgementHtml(name),
    })
    .catch((err) => {
      console.error("Contact acknowledgement failed to send", err);
    });

  return NextResponse.json({ success: true });
}
