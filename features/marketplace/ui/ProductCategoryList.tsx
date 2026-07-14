"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import Link from "next/link";

import { NAMESPACE } from "../i18n";
import type { CatalogProductCategory } from "../types";

interface Props {
  lang: string;
  departmentSlug: string;
  categorySlug: string;
  productCategories: CatalogProductCategory[];
  activeSlug?: string;
}

export function ProductCategoryList({
  lang,
  departmentSlug,
  categorySlug,
  productCategories,
  activeSlug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (productCategories.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.productCategories")}
      </Title>
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {productCategories.map((p) => {
          const isActive = p.slug === activeSlug;
          return (
            <Link
              key={p.id}
              href={`/${lang}/marketplace/${departmentSlug}/${categorySlug}/${p.slug}`}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {p.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
