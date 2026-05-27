"use client";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CategoryGroup } from "../types";
import clsx from "clsx";
import { Text } from "@/components/Text/Text";

interface Props {
  categories: CategoryGroup[];
  active: string;
  onChange: (id: string) => void;
  totalCount: number;
}

export function SellerCategoriesNav({ categories, active, onChange, totalCount }: Props) {
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
      className="sticky top-0 z-10 -mx-4 px-4 py-2 backdrop-blur md:mx-0 md:px-3"
    >
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-2">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-pressed={isActive}
              className={clsx(
                "flex shrink-0 items-center gap-4 rounded-full",
                "px-3.5 py-1.5 text-sm font-medium",
                "transition-colors shadow-xs hover:shadow-md shadow-gray-200",
                {
                  "bg-primary text-white": isActive,
                  "bg-white text-foreground-secondary": !isActive,
                },
              )}
            >
              <Text
                variant="span"
                size="sm"
                weight={isActive ? "semibold" : "normal"}
                color={isActive ? "white" : "default"}
              >
                {tab.name}
              </Text>
              <Text
                variant="span"
                size="xs"
                color={isActive ? "white" : "default"}
                weight="bold"
              >
                {tab.count}
              </Text>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
