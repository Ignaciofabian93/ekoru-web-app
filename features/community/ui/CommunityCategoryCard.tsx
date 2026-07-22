"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { NAMESPACE } from "../i18n";
import type { CommunityCategory } from "../types";

interface Props {
  lang: string;
  category: CommunityCategory;
}

export function CommunityCategoryCard({ lang, category }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const categoryHref = `/${lang}/community/${category.slug}`;

  return (
    <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border-light bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <Link
        href={categoryHref}
        className="flex flex-col gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Title level="h3" size="h6" weight="semibold">
          {category.category}
        </Title>
        {category.description && (
          <Text size="sm" color="secondary" numberOfLines={3}>
            {category.description}
          </Text>
        )}
      </Link>

      {category.subcategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <Text
            size="xs"
            weight="semibold"
            color="tertiary"
            className="uppercase tracking-wide"
          >
            {t("category.subcategories")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/${lang}/community/${category.slug}/${sub.slug}`}
                className="rounded-full border border-border-light bg-background-secondary px-3 py-1 text-xs font-medium text-foreground-secondary transition-colors duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {sub.subcategory}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href={categoryHref}
        className="mt-auto inline-flex w-fit items-center gap-1 rounded-md pt-1 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {t("category.explore")}
        <ArrowRight
          size={16}
          strokeWidth={2.5}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
