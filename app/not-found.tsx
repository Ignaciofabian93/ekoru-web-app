import Link from "next/link";

import { DEFAULT_LANGUAGE } from "@/constants/settings";

/**
 * Global 404 boundary. Because the root layout is a pass-through (the real
 * `<html>`/`<body>` live in `app/[lang]/layout.tsx`), this page must supply its
 * own document shell. The locale is unknown here, so it falls back to the default
 * language and links users back into the localized app.
 */
export default function NotFound() {
  return (
    <html lang={DEFAULT_LANGUAGE} className="h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center gap-4 bg-background text-foreground p-6 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-lg text-foreground-secondary">
          Página no encontrada · Page not found · Page introuvable
        </p>
        <Link
          href={`/${DEFAULT_LANGUAGE}`}
          className="rounded-full bg-primary px-6 py-2 font-medium text-on-primary hover:bg-primary-hover"
        >
          Ekoru
        </Link>
      </body>
    </html>
  );
}
