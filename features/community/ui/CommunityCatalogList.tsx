"use client";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CommunityCategory } from "../types";
import { CommunityCategoryCard } from "./CommunityCategoryCard";

interface Props {
  lang: string;
  categories: CommunityCategory[];
  loading?: boolean;
}

export function CommunityCatalogList({ lang, categories, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <section className="flex flex-col gap-4">
      <Title level="h2" size="h5">
        {t("sections.categories")}
      </Title>

      {loading && categories.length === 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl bg-background-secondary"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-surface px-4 py-12 text-center">
          <Text weight="semibold">{t("results.empty")}</Text>
          <Text size="sm" color="secondary">
            {t("results.emptyHint")}
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CommunityCategoryCard key={category.id} lang={lang} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
