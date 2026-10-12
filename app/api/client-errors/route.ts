import { NextResponse } from "next/server";

/** Largest report accepted; anything bigger is cut, not stored. */
const MAX_BYTES = 8 * 1024;
/** Reports per visitor per minute; a crash loop must not flood the log. */
const PER_MINUTE = 20;
const recent = new Map<string, { windowStart: number; count: number }>();

const clip = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max) : undefined;

/**
 * Receives browser errors (WEB-10) and writes each as one JSON line to the
 * server log, tagged with environment and release, for the log stack (INF-5)
 * to collect. Nothing is stored here and nothing is returned.
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const entry = recent.get(ip);
  if (!entry || now - entry.windowStart > 60_000) {
    recent.set(ip, { windowStart: now, count: 1 });
  } else if (++entry.count > PER_MINUTE) {
    return new NextResponse(null, { status: 429 });
  }
  if (recent.size > 5_000) recent.clear();

  let report: Record<string, unknown> = {};
  try {
    const text = (await request.text()).slice(0, MAX_BYTES);
    report = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  console.error(
    JSON.stringify({
      level: "error",
      source: "web-client",
      env: process.env.NEXT_PUBLIC_ENVIRONMENT ?? process.env.NODE_ENV,
      release: process.env.APP_RELEASE ?? "dev",
      time: new Date(now).toISOString(),
      message: clip(report.message, 500),
      digest: clip(report.digest, 100),
      url: clip(report.url, 500),
      route: clip(report.route, 200),
      boundary: clip(report.boundary, 50),
      userAgent: clip(report.userAgent, 200),
      stack: clip(report.stack, 2000),
    }),
  );
  return new NextResponse(null, { status: 204 });
}
