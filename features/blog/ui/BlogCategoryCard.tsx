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
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        {createElement(resolveCategoryIcon(category.icon), {
          size: 22,
          strokeWidth: 1.75,
        })}
      </span>

      <Title level="h3" size="h6" weight="semibold">
        {category.name}
      </Title>

      <Text size="sm" color="secondary" numberOfLines={4} className="flex-1">
        {category.description}
      </Text>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {t("category.explore")}
        <ArrowRight
          size={16}
          strokeWidth={2.5}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
