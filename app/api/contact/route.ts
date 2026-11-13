import { NextResponse } from "next/server";
import { Resend } from "resend";
import { RateWindow } from "@/lib/api/rateWindow";
import { refuseLargeBody, visitorAddress } from "@/lib/api/requestLimits";

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

/**
 * Limits against using the form to mail strangers in EKORU's name (WEB-27).
 * The acknowledgement goes to whatever address was typed, so each message is
 * also a mail to someone who may never have written.
 */
const MAX_NAME = 80;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 3000;
/** A name is a name: no link and no line break to dress the email up with. */
const NOT_A_NAME = /https?:|www\.|[\r\n]/i;
/** Messages per visitor, and in all per day. Past either the answer is 429. */
const perVisitor = new RateWindow(3, 10 * 60_000);
const perDay = new RateWindow(100, 24 * 60 * 60_000);

/**
 * The landing site's sender. Both sites send through the same Resend account,
 * and informative-web already delivers from this address, so the form works
 * without CONTACT_FROM_EMAIL on the server (WEB-8).
 */
const DEFAULT_FROM = "Contacto EKORU <contacto@ekoru.cl>";

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

// The acknowledgement carries nothing the visitor typed. With the name in it,
// anyone could send a stranger an EKORU email with words of their choosing.
const ACKNOWLEDGEMENT_TEXT =
  "Hola,\n\nHemos recibido tu mensaje y te responderemos dentro de las próximas 24–48 horas.\n\nEquipo EKORU";

/** Confirmation sent back to whoever wrote in, mirroring the informative site. */
const acknowledgementHtml = () => `
  <div style="margin:0;padding:0;background:#f4f4f4;font-family:system-ui,'Segoe UI',sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#0d9488 0%,#14b8a6 100%);padding:32px 24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:600;">¡Gracias por contactarnos!</h1>
        <p style="margin:8px 0 0;color:#fff;opacity:.95;font-size:14px;">EKORU — Economía Circular</p>
      </div>
      <div style="padding:32px 24px;">
        <p style="margin:0 0 16px;color:#1f2937;font-size:17px;font-weight:600;">Hola 👋</p>
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
  // The server env bundles were copied from informative-web, which names the
  // inbox EMAIL_TO; accept it so the form works with either name (WEB-8).
  // `||` rather than `??`: an empty `KEY=` line in an env file means unset.
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const to = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_TO;

  if (!apiKey || !to) {
    // Say which variable is missing in the log, never to the visitor.
    console.error(
      `Contact form not configured: ${[
        !apiKey && "RESEND_API_KEY",
        !to && "CONTACT_TO_EMAIL (or EMAIL_TO)",
      ]
        .filter(Boolean)
        .join(", ")} missing`,
    );
    return NextResponse.json(
      { message: "Contact service is not configured" },
      { status: 500 },
    );
  }

  const tooLarge = refuseLargeBody(req);
  if (tooLarge) return tooLarge;

  const body = (await req.json().catch(() => ({}))) as ContactPayload;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const subject = typeof body.subject === "string" ? body.subject : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    name.length > MAX_NAME ||
    NOT_A_NAME.test(name) ||
    email.length > MAX_EMAIL ||
    !EMAIL_RE.test(email) ||
    !SUBJECT_LABELS[subject] ||
    message.length < 10 ||
    message.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ message: "Invalid contact submission" }, { status: 400 });
  }

  // Counted only for a message that would be sent, so a typo costs nothing.
  if (!perVisitor.take(visitorAddress(req)) || !perDay.take("all")) {
    return NextResponse.json(
      { message: "Too many messages. Please try again later." },
      { status: 429 },
    );
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
    // Resend reports why (unverified sender domain, revoked key, rate limit);
    // without this line a refused send is a bare 502 and an empty log.
    console.error(`Contact message refused by Resend: ${error.name}: ${error.message}`);
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
      text: ACKNOWLEDGEMENT_TEXT,
      html: acknowledgementHtml(),
    })
    // The SDK resolves with `error` rather than rejecting when Resend refuses.
    .then(({ error: ackError }) => {
      if (ackError) {
        console.error(
          `Contact acknowledgement refused by Resend: ${ackError.name}: ${ackError.message}`,
        );
      }
    })
    .catch((err) => {
      console.error("Contact acknowledgement failed to send", err);
    });

  return NextResponse.json({ success: true });
}
