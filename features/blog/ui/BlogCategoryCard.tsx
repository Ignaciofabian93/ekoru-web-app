"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { createElement } from "react";

import { resolveCategoryIcon } from "../constants/icons";
import { NAMESPACE } from "../i18n";
import type { BlogCatalogCategory } from "../types";

interface Props {
  lang: string;
  category: BlogCatalogCategory;
}

export function BlogCategoryCard({ lang, category }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Link
      href={`/${lang}/blog/${category.slug}`}
      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border-light bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
        {createElement(resolveCategoryIcon(category.icon), {
          size: 24,
          strokeWidth: 1.75,
        })}
      </span>

      <div className="flex flex-1 flex-col gap-1.5">
        <Title level="h3" size="h6" weight="semibold">
          {category.name}
        </Title>
        <Text size="sm" color="secondary" numberOfLines={3}>
          {category.description}
        </Text>
      </div>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {t("category.explore")}
        <ArrowRight
          size={16}
          strokeWidth={2.5}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
