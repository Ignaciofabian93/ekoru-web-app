/**
 * Client error reporting (WEB-10). Sends what broke to `/api/client-errors`,
 * which writes one structured line to the server log, where the log stack
 * (INF-5) picks it up. Never throws: reporting must not become a second error.
 *
 * `sendBeacon` survives the page unloading (a crash often navigates away);
 * `fetch` with `keepalive` is the fallback.
 */
export function reportClientError(
  error: unknown,
  context: Record<string, string | undefined> = {},
): void {
  try {
    if (typeof window === "undefined") return;
    const err = error as { message?: string; stack?: string; digest?: string } | null;
    const body = JSON.stringify({
      message: String(err?.message ?? error).slice(0, 500),
      digest: err?.digest,
      stack: err?.stack?.slice(0, 2000),
      url: window.location.href.slice(0, 500),
      userAgent: navigator.userAgent.slice(0, 200),
      ...context,
    });
    const sent =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/client-errors", new Blob([body], { type: "application/json" }));
    if (!sent) {
      void fetch("/api/client-errors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Reporting is best-effort.
  }
}
