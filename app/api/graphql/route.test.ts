// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (name === "token" ? { value: "access-token" } : undefined),
  }),
}));

import { POST } from "./route";

const QUERY = JSON.stringify({ query: "{ __typename }" });

const post = (body: string, headers: Record<string, string>) =>
  POST(new Request("http://localhost/api/graphql", { method: "POST", headers, body }));

describe("POST /api/graphql", () => {
  const fetchMock = vi.fn();
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: { __typename: "Query" } }), { status: 200 }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    consoleError.mockClear();
  });

  it("passes a JSON query on with the session and the visitor's address (INF-23)", async () => {
    const res = await post(QUERY, {
      "content-type": "application/json",
      cookie: "token=access-token",
      "x-real-ip": "203.0.113.7",
      "x-forwarded-for": "198.51.100.1",
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: { __typename: "Query" } });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:4000/graphql");
    expect(init.body).toBe(QUERY);
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      "X-Forwarded-For": "203.0.113.7",
      Cookie: "token=access-token",
      Authorization: "Bearer access-token",
    });
  });

  it("takes application/json with a charset", async () => {
    const res = await post(QUERY, { "content-type": "application/json; charset=utf-8" });

    expect(res.status).toBe(200);
  });

  it.each([
    ["text/plain, which a cross-site form can send", "text/plain"],
    ["a form post", "application/x-www-form-urlencoded"],
    ["multipart", "multipart/form-data; boundary=x"],
  ])("answers 415 to %s and calls nothing (GW-6)", async (_label, type) => {
    const res = await post(QUERY, { "content-type": type });

    expect(res.status).toBe(415);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers 413 to a body declared over 1 MB, before reading it (GW-6)", async () => {
    const res = await post(QUERY, {
      "content-type": "application/json",
      "content-length": String(1024 * 1024 + 1),
    });

    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers 413 to a body over 1 MB that declared no length", async () => {
    const big = JSON.stringify({
      query: "{ __typename }",
      variables: { pad: "a".repeat(1024 * 1024) },
    });

    const res = await post(big, { "content-type": "application/json" });

    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers 200 with the gateway's errors when it refuses with a GraphQL body", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ errors: [{ message: "Bad query" }] }), {
        status: 400,
      }),
    );

    const res = await post(QUERY, { "content-type": "application/json" });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ errors: [{ message: "Bad query" }] });
  });
});
