// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

// The route keeps its message counters in the module, so each test loads a
// fresh copy (see beforeEach).
vi.mock("server-only", () => ({}));
let POST: (req: Request) => Promise<Response>;

const VALID = {
  name: "Ana",
  email: "Ana@Example.com",
  subject: "feedback",
  message: "Me gusta mucho la plataforma.",
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    }),
  );

/** The env the server bundles carry today: the inbox under EMAIL_TO, no sender. */
const stubServerEnv = () => {
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("EMAIL_TO", "inbox@ekoru.cl");
  vi.stubEnv("CONTACT_TO_EMAIL", undefined);
  vi.stubEnv("CONTACT_FROM_EMAIL", undefined);
};

describe("POST /api/contact (WEB-8)", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(async () => {
    stubServerEnv();
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    vi.resetModules();
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    send.mockReset();
    consoleError.mockClear();
  });

  it("delivers with the server's env as shipped: EMAIL_TO and the landing site's sender", async () => {
    const res = await post(VALID);

    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Contacto EKORU <contacto@ekoru.cl>",
        to: "inbox@ekoru.cl",
        replyTo: "ana@example.com",
        subject: "[Contact] Feedback & suggestions — Ana",
      }),
    );
  });

  it("prefers CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL when set", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "EKORU <hola@ekoru.cl>");
    vi.stubEnv("CONTACT_TO_EMAIL", "soporte@ekoru.cl");

    await post(VALID);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ from: "EKORU <hola@ekoru.cl>", to: "soporte@ekoru.cl" }),
    );
  });

  it("treats an empty env line as unset", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    vi.stubEnv("CONTACT_TO_EMAIL", "");

    await post(VALID);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Contacto EKORU <contacto@ekoru.cl>",
        to: "inbox@ekoru.cl",
      }),
    );
  });

  it("sends the visitor an acknowledgement", async () => {
    await post(VALID);

    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenLastCalledWith(
      expect.objectContaining({ to: "ana@example.com" }),
    );
  });

  it("answers 500 and names the missing variable when there is no key or inbox", async () => {
    vi.stubEnv("RESEND_API_KEY", undefined);
    vi.stubEnv("EMAIL_TO", undefined);

    const res = await post(VALID);

    expect(res.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      "Contact form not configured: RESEND_API_KEY, CONTACT_TO_EMAIL (or EMAIL_TO) missing",
    );
  });

  it("answers 502 and logs Resend's reason when the send is refused", async () => {
    send.mockResolvedValueOnce({
      data: null,
      error: {
        name: "validation_error",
        message: "The ekoru.cl domain is not verified.",
        statusCode: 403,
      },
    });

    const res = await post(VALID);

    expect(res.status).toBe(502);
    expect(send).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "Contact message refused by Resend: validation_error: The ekoru.cl domain is not verified.",
    );
  });

  it("rejects a submission outside the form's rules", async () => {
    const res = await post({ ...VALID, subject: "anything", message: "short" });

    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact limits (WEB-27)", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(async () => {
    stubServerEnv();
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    vi.resetModules();
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    send.mockReset();
    consoleError.mockClear();
  });

  it.each([
    ["a name over 80 characters", { name: "A".repeat(81) }],
    ["a link in the name", { name: "Gana un premio en http://example.com" }],
    ["a www address in the name", { name: "Visita www.example.com" }],
    ["a line break in the name", { name: "Ana\nTu cuenta fue bloqueada" }],
    ["a message over 3,000 characters", { message: "a".repeat(3001) }],
    ["an email over 254 characters", { email: `${"a".repeat(250)}@example.com` }],
  ])("refuses %s and sends nothing", async (_label, change) => {
    const res = await post({ ...VALID, ...change });

    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("takes a name of 80 characters and a message of 3,000", async () => {
    const res = await post({ ...VALID, name: "A".repeat(80), message: "a".repeat(3000) });

    expect(res.status).toBe(200);
  });

  it("greets without the typed name, so the form can't word a mail to a stranger", async () => {
    await post({ ...VALID, name: "Tu cuenta fue bloqueada" });

    const acknowledgement = send.mock.calls[1][0] as { text: string; html: string };
    expect(acknowledgement.text.startsWith("Hola,")).toBe(true);
    expect(acknowledgement.text).not.toContain("bloqueada");
    expect(acknowledgement.html).not.toContain("bloqueada");
  });

  it("answers 429 to a visitor's 4th message in 10 minutes, and still serves others", async () => {
    const visitor = { "x-real-ip": "203.0.113.7" };
    for (let i = 0; i < 3; i++) expect((await post(VALID, visitor)).status).toBe(200);
    send.mockClear();

    const fourth = await post(VALID, visitor);

    expect(fourth.status).toBe(429);
    expect(send).not.toHaveBeenCalled();
    expect((await post(VALID, { "x-real-ip": "203.0.113.8" })).status).toBe(200);
  });

  it("counts on X-Real-IP, not on an X-Forwarded-For the caller made up", async () => {
    const from = (forwarded: string) => ({
      "x-real-ip": "203.0.113.7",
      "x-forwarded-for": forwarded,
    });
    for (let i = 0; i < 3; i++) await post(VALID, from(`198.51.100.${i}`));

    expect((await post(VALID, from("198.51.100.99"))).status).toBe(429);
  });

  it("doesn't count a refused submission against the visitor", async () => {
    const visitor = { "x-real-ip": "203.0.113.7" };
    for (let i = 0; i < 5; i++) await post({ ...VALID, message: "short" }, visitor);

    expect((await post(VALID, visitor)).status).toBe(200);
  });

  it("answers 429 once 100 messages went out in a day, whoever sends the next", async () => {
    for (let i = 0; i < 100; i++) {
      expect((await post(VALID, { "x-real-ip": `203.0.113.${i}` })).status).toBe(200);
    }
    send.mockClear();

    const res = await post(VALID, { "x-real-ip": "198.51.100.1" });

    expect(res.status).toBe(429);
    expect(send).not.toHaveBeenCalled();
  });

  it("answers 413 to a body declared over 1 MB, before reading it", async () => {
    const res = await post(VALID, { "content-length": String(2 * 1024 * 1024) });

    expect(res.status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });
});
