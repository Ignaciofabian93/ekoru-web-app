import type { Instrumentation } from "next";

/**
 * Server error reporting (WEB-10). Every error thrown while rendering a page,
 * running a route handler or a server action is written as one JSON line to
 * the log, tagged with environment, release and route, for the log stack
 * (INF-5) to collect. The `digest` matches the one the error page shows the
 * visitor, so a support message can be traced to its log line.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const error = err as { message?: string; stack?: string; digest?: string };
  console.error(
    JSON.stringify({
      level: "error",
      source: "web-server",
      env: process.env.NEXT_PUBLIC_ENVIRONMENT ?? process.env.NODE_ENV,
      // `pnpm start` exports the package version; APP_RELEASE can override it.
      release: process.env.APP_RELEASE ?? process.env.npm_package_version ?? "dev",
      time: new Date().toISOString(),
      message: String(error?.message ?? err).slice(0, 500),
      digest: error?.digest,
      method: request.method,
      path: request.path,
      route: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource,
      stack: error?.stack?.slice(0, 2000),
    }),
  );
};
