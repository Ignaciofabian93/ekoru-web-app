"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import Link from "next/link";

import { NAMESPACE } from "../i18n";
import type { CatalogDepartment } from "../types";

interface Props {
  lang: string;
  departments: CatalogDepartment[];
  activeSlug?: string;
  /** Adds an "All" pill that points back to the marketplace root. */
  showAll?: boolean;
  loading?: boolean;
}

export function DepartmentList({
  lang,
  departments,
  activeSlug,
  showAll = true,
  loading,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (loading && departments.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <Title level="h2" size="h5">
          {t("sections.departments")}
        </Title>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-background-secondary"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.departments")}
      </Title>
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {showAll && (
          <Link
            href={`/${lang}/marketplace`}
            className={clsx(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !activeSlug
                ? "bg-primary text-white"
                : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
            )}
          >
            {t("sections.allDepartments")}
          </Link>
        )}
        {departments.map((dep) => {
          const isActive = dep.slug === activeSlug;
          return (
            <Link
              key={dep.id}
              href={`/${lang}/marketplace/${dep.slug}`}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {dep.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
