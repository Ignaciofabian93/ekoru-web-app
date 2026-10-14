// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST } from "./route";

const VALID = {
  name: "Ana",
  email: "Ana@Example.com",
  subject: "feedback",
  message: "Me gusta mucho la plataforma.",
};

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  beforeEach(() => {
    stubServerEnv();
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
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
