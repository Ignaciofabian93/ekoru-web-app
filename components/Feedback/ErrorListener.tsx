"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/errors/reportError";

/**
 * Reports browser errors that no React boundary sees (WEB-10): exceptions in
 * event handlers, timers and promises nobody awaited. Renders nothing.
 */
export function ErrorListener() {
  useEffect(() => {
    const onError = (event: ErrorEvent) =>
      reportClientError(event.error ?? event.message, { boundary: "window" });
    const onRejection = (event: PromiseRejectionEvent) =>
      reportClientError(event.reason, { boundary: "promise" });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
