import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { gatewayFetch, gatewayHeaders } from "@/lib/api/gateway";
import { MAX_JSON_BYTES, isJsonRequest, refuseLargeBody } from "@/lib/api/requestLimits";

type GraphQLPayload = { data?: unknown; errors?: unknown };

function isGraphQLPayload(value: unknown): value is GraphQLPayload {
  return (
    typeof value === "object" && value !== null && ("data" in value || "errors" in value)
  );
}

export async function POST(req: Request) {
  // Only JSON is passed on (GW-6). A cross-site form can post text/plain with
  // the visitor's cookies and no preflight; refusing it here keeps the
  // gateway's own check against those posts from being bypassed.
  if (!isJsonRequest(req)) {
    return NextResponse.json(
      { errors: [{ message: "Content-Type must be application/json" }] },
      { status: 415 },
    );
  }
  const tooLarge = refuseLargeBody(req);
  if (tooLarge) return tooLarge;

  const body = await req.text();
  if (body.length > MAX_JSON_BYTES) {
    return NextResponse.json({ message: "Request body too large" }, { status: 413 });
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Forward the raw cookie header so the gateway sees the session cookies.
  //
  // NOTE: the gateway no longer falls back to the `refreshToken` cookie when
  // the access token is expired — a 7-day refresh token authenticating ordinary
  // requests meant logout did not end a session. Recovery is now the client's
  // job: the Apollo error link catches UNAUTHORIZED, POSTs /api/auth/refresh to
  // mint a new access token, and replays the operation.
  //
  // The consequence of getting that wrong is quiet rather than loud: an expired
  // token resolves as an anonymous request, so viewer-scoped filters stop
  // applying — the marketplace would show a signed-in seller their own
  // products, which are meant to be excluded — instead of raising an error.
  const cookieHeader = req.headers.get("cookie") ?? "";

  const res = await gatewayFetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...gatewayHeaders(req),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const raw = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  // The gateway sometimes returns 4xx alongside a well-formed GraphQL body
  // (e.g. validation errors). Apollo's HttpLink treats any non-2xx as a
  // network error and throws a generic "Response not successful" message
  // instead of surfacing the actual `errors[]` — so we always return 200
  // when the body is a valid GraphQL payload.
  if (!res.ok) {
    console.error(
      `[graphql-proxy] upstream ${res.status} ${res.statusText} — body:`,
      raw.slice(0, 2000),
    );
  }

  if (isGraphQLPayload(parsed)) {
    return NextResponse.json(parsed, { status: 200 });
  }

  return NextResponse.json(
    { errors: [{ message: `Upstream ${res.status}: ${raw.slice(0, 500)}` }] },
    { status: 200 },
  );
}
