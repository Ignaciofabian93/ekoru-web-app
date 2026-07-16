"use client";
import { Title } from "@/components/Title/Title";
import { UnderlineTabs, type UnderlineTab } from "@/components/UnderlineTabs/UnderlineTabs";
import { useTranslation } from "@/i18n/context";

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

  const tabs: UnderlineTab[] = productCategories.map((p) => ({
    key: p.slug,
    label: p.name,
    href: `/${lang}/marketplace/${departmentSlug}/${categorySlug}/${p.slug}`,
  }));

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.productCategories")}
      </Title>
      <UnderlineTabs
        tabs={tabs}
        activeKey={activeSlug ?? ""}
        ariaLabel={t("sections.productCategories")}
        remeasureKey={lang}
        scrollable
      />
    </section>
  );
}
