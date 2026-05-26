"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import Link from "next/link";

import { NAMESPACE } from "../i18n";
import type { CatalogDepartmentCategory } from "../types";

interface Props {
  lang: string;
  departmentSlug: string;
  categories: CatalogDepartmentCategory[];
  activeSlug?: string;
  showAll?: boolean;
}

export function CategoryList({
  lang,
  departmentSlug,
  categories,
  activeSlug,
  showAll = true,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (categories.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.categories")}
      </Title>
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {showAll && (
          <Link
            href={`/${lang}/marketplace/${departmentSlug}`}
            className={clsx(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !activeSlug
                ? "bg-primary text-white"
                : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
            )}
          >
            {t("sections.allCategories")}
          </Link>
        )}
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <Link
              key={cat.id}
              href={`/${lang}/marketplace/${departmentSlug}/${cat.slug}`}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
