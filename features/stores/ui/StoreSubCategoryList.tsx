"use client";
import { Title } from "@/components/Title/Title";
import { UnderlineTabs, type UnderlineTab } from "@/components/UnderlineTabs/UnderlineTabs";
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

  const tabs: UnderlineTab[] = subCategoryItems.map((sub) => ({
    key: sub.slug,
    label: sub.name,
    href: `/${lang}/stores/${categorySlug}/${sub.slug}`,
  }));

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.subcategories")}
      </Title>
      <UnderlineTabs
        tabs={tabs}
        activeKey={activeSlug ?? ""}
        ariaLabel={t("sections.subcategories")}
        remeasureKey={lang}
        scrollable
      />
    </section>
  );
}
