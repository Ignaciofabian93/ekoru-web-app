"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

/**
 * Localized 404 (WEB-9) for anything under `/[lang]` that does not exist, or
 * calls `notFound()`. Rendered inside the locale layout, so it keeps the
 * visitor's language; the root `app/not-found.tsx` stays for paths outside it.
 */
export default function LocaleNotFound() {
  const { t } = useTranslation();
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
      <p className="max-w-md text-foreground-secondary">{t("notFound.body")}</p>
      <Link
        href={`/${lang}`}
        className="rounded-full bg-primary px-6 py-2 font-medium text-on-primary hover:bg-primary-hover"
      >
        {t("notFound.home")}
      </Link>
    </main>
  );
}
