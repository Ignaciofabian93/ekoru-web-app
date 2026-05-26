"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

interface Props {
  lang: string;
  categoryName?: string;
  categoryHref?: string;
  productName: string;
}

export function ProductBreadcrumbs({
  lang,
  categoryName,
  categoryHref,
  productName,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <nav
      aria-label="breadcrumb"
      className="flex flex-wrap items-center gap-1 text-sm text-foreground-secondary"
    >
      <Link href={`/${lang}/marketplace`} className="hover:text-primary">
        {t("breadcrumbs.marketplace")}
      </Link>
      {categoryName && (
        <>
          <ChevronRight size={14} strokeWidth={2} className="opacity-60" />
          {categoryHref ? (
            <Link href={`/${lang}${categoryHref}`} className="hover:text-primary">
              {categoryName}
            </Link>
          ) : (
            <span>{categoryName}</span>
          )}
        </>
      )}
      <ChevronRight size={14} strokeWidth={2} className="opacity-60" />
      <span className="truncate font-medium text-foreground">{productName}</span>
    </nav>
  );
}
