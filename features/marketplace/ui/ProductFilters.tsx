"use client";
import { Input } from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { NAMESPACE } from "../i18n";
import type { ProductFilters as ProductFiltersState, ProductSortValue } from "../types";
import type { ProductCondition } from "@/types/enums";

const CONDITION_VALUES: ProductCondition[] = [
  "NEW",
  "LIKE_NEW",
  "OPEN_BOX",
  "REFURBISHED",
  "FAIR",
  "POOR",
  "FOR_PARTS",
];

const SORT_VALUES: ProductSortValue[] = ["newest", "oldest", "priceAsc", "priceDesc"];

interface Props {
  filters: ProductFiltersState;
  sort: ProductSortValue;
  setField: <K extends keyof ProductFiltersState>(
    key: K,
    value: ProductFiltersState[K],
  ) => void;
  setSort: (value: ProductSortValue) => void;
  reset: () => void;
}

export function ProductFilters({ filters, sort, setField, setSort, reset }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [open, setOpen] = useState(false);

  const sortOptions = SORT_VALUES.map((value) => ({
    value,
    label: t(`sort.${value}`),
  }));

  const conditionOptions = [
    { value: "", label: t("filters.anyCondition") },
    ...CONDITION_VALUES.map((value) => ({
      value,
      label: t(`conditions.${value}`),
    })),
  ];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-foreground-tertiary"
            strokeWidth={2}
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setField("search", e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-border bg-surface pr-3 pl-10 text-sm text-foreground placeholder:text-foreground-tertiary focus:ring-2 focus:ring-border-focus focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
        >
          <SlidersHorizontal size={16} strokeWidth={2} />
          {t("filters.title")}
        </button>

        <div className="md:w-56">
          <Select
            size="md"
            width="full"
            searchEnabled={false}
            value={sort}
            options={sortOptions}
            onChange={(v) => setSort(v as ProductSortValue)}
            placeholder={t("filters.sortBy")}
          />
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 md:flex-row md:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <Text size="sm" weight="medium" color="secondary">
              {t("filters.minPrice")}
            </Text>
            <Input
              type="number"
              size="md"
              value={filters.minPrice}
              onChangeText={(v) => setField("minPrice", v)}
              placeholder="0"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Text size="sm" weight="medium" color="secondary">
              {t("filters.maxPrice")}
            </Text>
            <Input
              type="number"
              size="md"
              value={filters.maxPrice}
              onChangeText={(v) => setField("maxPrice", v)}
              placeholder="0"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Text size="sm" weight="medium" color="secondary">
              {t("filters.condition")}
            </Text>
            <Select
              size="md"
              width="full"
              searchEnabled={false}
              value={filters.condition}
              options={conditionOptions}
              onChange={(v) =>
                setField("condition", v === "" ? "" : (v as ProductCondition))
              }
              placeholder={t("filters.anyCondition")}
            />
          </div>
          <label className="flex shrink-0 items-center gap-2 self-center pt-5 md:pt-0">
            <input
              type="checkbox"
              checked={filters.isExchangeable}
              onChange={(e) => setField("isExchangeable", e.target.checked)}
              className="size-4 accent-primary"
            />
            <Text size="sm">{t("filters.exchangeableOnly")}</Text>
          </label>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 self-center rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
          >
            <X size={14} strokeWidth={2} />
            {t("filters.clear")}
          </button>
        </div>
      )}
    </section>
  );
}
