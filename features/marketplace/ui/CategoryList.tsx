"use client";
import { Title } from "@/components/Title/Title";
import { UnderlineTabs, type UnderlineTab } from "@/components/UnderlineTabs/UnderlineTabs";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CatalogDepartmentCategory } from "../types";

const ALL_KEY = "__all__";

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

  const tabs: UnderlineTab[] = [
    ...(showAll
      ? [
          {
            key: ALL_KEY,
            label: t("sections.allCategories"),
            href: `/${lang}/marketplace/${departmentSlug}`,
          },
        ]
      : []),
    ...categories.map((cat) => ({
      key: cat.slug,
      label: cat.name,
      href: `/${lang}/marketplace/${departmentSlug}/${cat.slug}`,
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
