// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// Local development's public address (config/endpoints.ts).
const PUBLIC = "http://localhost:4000";
const INTERNAL = "http://ekoru-gateway:4100";

/** What undici throws when it never reached the host. */
const connectError = (code: string) =>
  Object.assign(new TypeError("fetch failed"), { cause: { code } });

const request = (headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/graphql", { method: "POST", headers });

describe("gateway helper (INF-23)", () => {
  const fetchMock = vi.fn();
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  let gatewayFetch: (path: string, init?: RequestInit) => Promise<Response>;
  let gatewayHeaders: (req: Request) => Record<string, string>;

  beforeEach(async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue(new Response("{}"));
    // The helper remembers when it last warned, so each test loads a fresh copy.
    vi.resetModules();
    ({ gatewayFetch, gatewayHeaders } = await import("./gateway"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    consoleError.mockClear();
  });

  describe("gatewayHeaders", () => {
    it("passes the address nginx set as X-Forwarded-For, and the browser", () => {
      const headers = gatewayHeaders(
        request({ "x-real-ip": "203.0.113.7", "user-agent": "Mozilla/5.0 (test)" }),
      );

      expect(headers).toEqual({
        "X-Forwarded-For": "203.0.113.7",
        "User-Agent": "Mozilla/5.0 (test)",
      });
    });

    it("takes an IPv6 address", () => {
      expect(gatewayHeaders(request({ "x-real-ip": "2001:db8::1" }))).toEqual({
        "X-Forwarded-For": "2001:db8::1",
      });
    });

    it("ignores the X-Forwarded-For the caller sent", () => {
      const headers = gatewayHeaders(request({ "x-forwarded-for": "198.51.100.1" }));

      expect(headers).toEqual({});
    });

    it("sends no address when X-Real-IP isn't one", () => {
      expect(
        gatewayHeaders(request({ "x-real-ip": "203.0.113.7, 198.51.100.1" })),
      ).toEqual({});
    });
  });

  describe("gatewayFetch", () => {
    it("uses the public address when no inside address is set", async () => {
      await gatewayFetch("/graphql", { method: "POST" });

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith(`${PUBLIC}/graphql`, {
        method: "POST",
      });
    });

    it("uses the inside address when compose sets one", async () => {
      vi.stubEnv("GATEWAY_INTERNAL_URL", `${INTERNAL}/`);

      await gatewayFetch("/session/auth", { method: "POST" });

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith(`${INTERNAL}/session/auth`, {
        method: "POST",
      });
    });

    it.each(["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED"])(
      "falls back to the public address when the inside one never connects (%s)",
      async (code) => {
        vi.stubEnv("GATEWAY_INTERNAL_URL", INTERNAL);
        fetchMock.mockRejectedValueOnce(connectError(code));
        const init = { method: "POST", body: "{}" };

        const res = await gatewayFetch("/graphql", init);

        expect(res.ok).toBe(true);
        expect(fetchMock).toHaveBeenNthCalledWith(1, `${INTERNAL}/graphql`, init);
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${PUBLIC}/graphql`, init);
        expect(consoleError).toHaveBeenCalledExactlyOnceWith(
          `[gateway] ${INTERNAL} unreachable (${code}); using ${PUBLIC} instead`,
        );
      },
    );

    it("warns once a minute, not on every call", async () => {
      vi.stubEnv("GATEWAY_INTERNAL_URL", INTERNAL);
      fetchMock.mockRejectedValueOnce(connectError("ENOTFOUND"));
      fetchMock.mockResolvedValueOnce(new Response("{}"));
      fetchMock.mockRejectedValueOnce(connectError("ENOTFOUND"));

      await gatewayFetch("/graphql");
      await gatewayFetch("/graphql");

      expect(fetchMock).toHaveBeenCalledTimes(4);
      expect(consoleError).toHaveBeenCalledTimes(1);
    });

    it("never repeats a call that did connect", async () => {
      vi.stubEnv("GATEWAY_INTERNAL_URL", INTERNAL);
      const dropped = connectError("UND_ERR_SOCKET");
      fetchMock.mockRejectedValueOnce(dropped);

      await expect(gatewayFetch("/graphql", { method: "POST" })).rejects.toBe(dropped);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
