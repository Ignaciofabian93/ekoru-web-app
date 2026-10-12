"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { reportClientError } from "@/lib/errors/reportError";

/**
 * Error boundary for every localized page (WEB-9). A failing query or a
 * gateway outage lands here instead of Next's bare error screen: translated,
 * with a retry and a way home. The error is reported (WEB-10); its digest is
 * shown so a support message can be matched to the server log line.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  useEffect(() => {
    reportClientError(error, { boundary: "page" });
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold text-primary">{t("errorPage.title")}</h1>
      <p className="max-w-md text-foreground-secondary">{t("errorPage.body")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-primary px-6 py-2 font-medium text-on-primary hover:bg-primary-hover"
        >
          {t("errorPage.retry")}
        </button>
        <Link
          href={`/${lang}`}
          className="rounded-full border border-primary px-6 py-2 font-medium text-primary hover:bg-primary-light-bg"
        >
          {t("errorPage.home")}
        </Link>
      </div>
      {error.digest && (
        <p className="text-xs text-foreground-tertiary">
          {t("errorPage.code", { code: error.digest })}
        </p>
      )}
    </main>
  );
}
