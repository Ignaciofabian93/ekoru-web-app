"use client";
import { Title } from "@/components/Primitives/Title";
import {
  Tabs,
  type Tab,
} from "@/components/Patterns/Tabs";
import { useTranslation } from "@/i18n/context";

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

  const tabs: Tab[] = subCategoryItems.map((sub) => ({
    key: sub.slug,
    label: sub.name,
    href: `/${lang}/stores/${categorySlug}/${sub.slug}`,
  }));

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.subcategories")}
      </Title>
      <Tabs
        tabs={tabs}
        activeKey={activeSlug ?? ""}
        ariaLabel={t("sections.subcategories")}
        remeasureKey={lang}
        scrollable
      />
    </section>
  );
}
