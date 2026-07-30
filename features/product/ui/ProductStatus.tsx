"use client";

import { AlertCircle, PackageX } from "lucide-react";
import Link from "next/link";

import { ErrorState } from "@/components/Feedback/ErrorState";
import { Skeleton } from "@/components/Primitives/Skeleton";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

export function ProductLoading() {
  return (
    <div aria-busy="true" className="grid gap-6 md:grid-cols-2 md:gap-8">
      <Skeleton radius="2xl" className="aspect-square w-full" />
      <div className="flex flex-col gap-4">
        <Skeleton radius="sm" className="h-6 w-24" />
        <Skeleton radius="sm" className="h-8 w-3/4" />
        <Skeleton radius="sm" className="h-6 w-1/3" />
        <Skeleton radius="sm" className="h-24 w-full" />
        <Skeleton radius="sm" className="h-12 w-full" />
      </div>
    </div>
  );
}

/** Link back to the marketplace, shared by both terminal states. */
function BackToMarketplace({ lang, label }: { lang: string; label: string }) {
  return (
    <Link
      href={`/${lang}/marketplace`}
      className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {label}
    </Link>
  );
}

export function ProductNotFound({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <ErrorState
      tone="muted"
      icon={PackageX}
      title={t("page.notFound")}
      description={t("page.notFoundHint")}
      action={<BackToMarketplace lang={lang} label={t("breadcrumbs.marketplace")} />}
    />
  );
}

export function ProductError({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <ErrorState
      tone="error"
      icon={AlertCircle}
      title={t("page.error")}
      description={t("page.errorHint")}
      action={<BackToMarketplace lang={lang} label={t("breadcrumbs.marketplace")} />}
    />
  );
}
