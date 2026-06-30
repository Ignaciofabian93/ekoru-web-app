"use client";
import { PackageSearch } from "lucide-react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { SearchResultItem } from "../types";
import { SearchResultCard } from "./SearchResultCard";

interface Props {
  items: SearchResultItem[];
  lang: string;
  loading?: boolean;
}

export function SearchResultsGrid({ items, lang, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-foreground-secondary py-16 text-center">
        <PackageSearch
          size={48}
          className="mx-auto mb-4 opacity-30"
          strokeWidth={1.5}
        />
        <p className="font-semibold">{t("results.empty")}</p>
        <p className="mt-1 text-sm">{t("results.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <SearchResultCard key={`${item.type}_${item.id}`} item={item} lang={lang} />
      ))}
    </div>
  );
}
