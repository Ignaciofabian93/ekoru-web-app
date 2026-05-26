"use client";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CategoryGroup } from "../types";

interface Props {
  categories: CategoryGroup[];
  active: string;
  onChange: (id: string) => void;
  totalCount: number;
}

export function SellerCategoriesNav({
  categories,
  active,
  onChange,
  totalCount,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (categories.length === 0) return null;

  const tabs = [
    { id: "all", name: t("catalog.all"), count: totalCount },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      count: c.products.length,
    })),
  ];

  return (
    <nav
      aria-label={t("catalog.title")}
      className="sticky top-0 z-10 -mx-4 border-b border-border-light bg-background/95 px-4 py-2 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-3"
    >
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-pressed={isActive}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-background-secondary text-foreground-secondary hover:bg-border"
              }`}
            >
              <span>{tab.name}</span>
              <span
                className={`rounded-full px-1.5 text-xs font-semibold ${
                  isActive ? "bg-white/20" : "bg-surface text-foreground-tertiary"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
