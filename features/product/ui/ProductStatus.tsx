"use client";

import { AlertCircle, PackageX } from "lucide-react";
import Link from "next/link";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

export function ProductLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="bg-background-secondary aspect-square w-full animate-pulse rounded-2xl" />
      <div className="flex flex-col gap-4">
        <div className="bg-background-secondary h-6 w-24 animate-pulse rounded" />
        <div className="bg-background-secondary h-8 w-3/4 animate-pulse rounded" />
        <div className="bg-background-secondary h-6 w-1/3 animate-pulse rounded" />
        <div className="bg-background-secondary h-24 w-full animate-pulse rounded" />
        <div className="bg-background-secondary h-12 w-full animate-pulse rounded" />
      </div>
    </div>
  );
}

export function ProductNotFound({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <PackageX size={48} className="text-foreground-muted" strokeWidth={1.4} />
      <h2 className="text-xl font-semibold text-foreground">
        {t("page.notFound")}
      </h2>
      <p className="text-sm text-foreground-secondary">
        {t("page.notFoundHint")}
      </p>
      <Link
        href={`/${lang}/marketplace`}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {t("breadcrumbs.marketplace")}
      </Link>
    </div>
  );
}

export function ProductError({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <AlertCircle size={48} className="text-danger" strokeWidth={1.4} />
      <h2 className="text-xl font-semibold text-foreground">{t("page.error")}</h2>
      <p className="text-sm text-foreground-secondary">{t("page.errorHint")}</p>
      <Link
        href={`/${lang}/marketplace`}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {t("breadcrumbs.marketplace")}
      </Link>
    </div>
  );
}
