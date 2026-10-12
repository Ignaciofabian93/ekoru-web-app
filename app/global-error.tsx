"use client";

import { useEffect } from "react";

import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { reportClientError } from "@/lib/errors/reportError";

/**
 * Last-resort boundary (WEB-9): an error in the root or locale layout itself,
 * where no dictionary is available. It replaces the whole document, so it
 * brings its own `<html>` and shows the message in all three languages, like
 * the root 404. The error is reported (WEB-10).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, { boundary: "global" });
  }, [error]);

  return (
    <html lang={DEFAULT_LANGUAGE} className="h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center gap-4 bg-background text-foreground p-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Ekoru</h1>
        <p className="text-lg text-foreground-secondary">
          Algo salió mal · Something went wrong · Une erreur s&apos;est produite
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-primary px-6 py-2 font-medium text-on-primary hover:bg-primary-hover"
          >
            Reintentar · Try again · Réessayer
          </button>
          {/* A full reload: the layout that failed is what links would reuse. */}
          <a
            href={`/${DEFAULT_LANGUAGE}`}
            className="rounded-full border border-primary px-6 py-2 font-medium text-primary"
          >
            Inicio · Home · Accueil
          </a>
        </div>
        {error.digest && <p className="text-xs text-foreground-tertiary">{error.digest}</p>}
      </body>
    </html>
  );
}
