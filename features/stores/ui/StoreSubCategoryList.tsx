"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import Link from "next/link";

import { NAMESPACE } from "../i18n";
import type { StoreCatalogSubItem } from "../types";

interface Props {
  lang: string;
  categorySlug: string;
  subCategoryItems: StoreCatalogSubItem[];
  activeSlug?: string;
}

export function StoreSubCategoryList({
  lang,
  categorySlug,
  subCategoryItems,
  activeSlug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (subCategoryItems.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.subcategories")}
      </Title>
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {subCategoryItems.map((sub) => {
          const isActive = sub.slug === activeSlug;
          return (
            <Link
              key={sub.id}
              href={`/${lang}/stores/${categorySlug}/${sub.slug}`}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {sub.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
