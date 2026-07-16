"use client";
import { Title } from "@/components/Title/Title";
import { UnderlineTabs, type UnderlineTab } from "@/components/UnderlineTabs/UnderlineTabs";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { StoreCatalogCategory } from "../types";

const ALL_KEY = "__all__";

interface Props {
  lang: string;
  categories: StoreCatalogCategory[];
  activeSlug?: string;
  /** Adds an "All" tab that points back to the stores root. */
  showAll?: boolean;
  loading?: boolean;
}

export function StoreCategoryList({
  lang,
  categories,
  activeSlug,
  showAll = true,
  loading,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (loading && categories.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <Title level="h2" size="h5">
          {t("sections.categories")}
        </Title>
        <div className="scrollbar-none flex gap-6 overflow-x-auto border-b border-border-light pb-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-20 shrink-0 animate-pulse rounded bg-background-secondary"
            />
          ))}
        </div>
      </section>
    );
  }

  const tabs: UnderlineTab[] = [
    ...(showAll
      ? [{ key: ALL_KEY, label: t("sections.allCategories"), href: `/${lang}/stores` }]
      : []),
    ...categories.map((cat) => ({
      key: cat.slug,
      label: cat.name,
      href: `/${lang}/stores/${cat.slug}`,
    })),
  ];

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.categories")}
      </Title>
      <UnderlineTabs
        tabs={tabs}
        activeKey={activeSlug ?? ALL_KEY}
        ariaLabel={t("sections.categories")}
        remeasureKey={lang}
        scrollable
      />
    </section>
  );
}
