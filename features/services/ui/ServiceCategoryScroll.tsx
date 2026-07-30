"use client";
import { Title } from "@/components/Primitives/Title";
import {
  Tabs,
  type Tab,
} from "@/components/Patterns/Tabs";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceCatalogItem } from "../types";

const ALL_KEY = "__all__";

interface Props {
  lang: string;
  categories: ServiceCatalogItem[];
  activeSlug?: string;
  /** Adds an "All" tab that points back to the services root. */
  showAll?: boolean;
  loading?: boolean;
}

export function ServiceCategoryScroll({
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

  const tabs: Tab[] = [
    ...(showAll
      ? [{ key: ALL_KEY, label: t("sections.allCategories"), href: `/${lang}/services` }]
      : []),
    ...categories.map((cat) => ({
      key: cat.slug,
      label: cat.name,
      href: `/${lang}/services/${cat.slug}`,
    })),
  ];

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.categories")}
      </Title>
      <Tabs
        tabs={tabs}
        activeKey={activeSlug ?? ALL_KEY}
        ariaLabel={t("sections.categories")}
        remeasureKey={lang}
        scrollable
      />
    </section>
  );
}
