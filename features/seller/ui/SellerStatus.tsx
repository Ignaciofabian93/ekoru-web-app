"use client";

import { AlertCircle, UserX } from "lucide-react";
import Link from "next/link";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

export function SellerLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-background-secondary h-40 w-full animate-pulse rounded-2xl md:h-56" />
      <div className="flex items-center gap-4">
        <div className="bg-background-secondary size-24 animate-pulse rounded-2xl md:size-32" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="bg-background-secondary h-6 w-1/3 animate-pulse rounded" />
          <div className="bg-background-secondary h-4 w-1/4 animate-pulse rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}

export function SellerNotFound({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <UserX size={48} className="text-foreground-muted" strokeWidth={1.4} />
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

export function SellerErrorState({ lang }: { lang: string }) {
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
