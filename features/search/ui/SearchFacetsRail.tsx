"use client";
import { useState } from "react";
import { Input } from "@/components/Primitives/Inputs";
import { Checkbox } from "@/components/Primitives/Checkbox";
import { Chip } from "@/components/Primitives/Chip";
import { FilterGroup, FilterOptions, FilterPanel } from "@/components/Patterns";
import {
  filterRangeDashClass,
  filterRangeRowClass,
  filterTagsClass,
} from "@/design/filter-panel";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SearchFacets as Facets, SearchFilters } from "../types";

interface Props {
  facets?: Facets | null;
  filters: SearchFilters;
  activeCount: number;
  onToggleCategory: (value: string) => void;
  onToggleTag: (value: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onHasOfferChange: (value: boolean) => void;
  onClearAll: () => void;
}

/** Empty string → undefined, so a cleared field drops the bound entirely. */
function toBound(value: string): number | undefined {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return value.trim() === "" || Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * The facet rail, built from whatever the engine reports for this query:
 * categories and tags come back as facet counts, price and offers are bounds
 * the engine accepts. A group with nothing behind it renders nothing.
 */
export function SearchFacetsRail({
  facets,
  filters,
  activeCount,
  onToggleCategory,
  onToggleTag,
  onPriceChange,
  onHasOfferChange,
  onClearAll,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  // The inputs stay local until the user leaves the field: re-querying on every
  // keystroke would fire a search per digit.
  const [min, setMin] = useState(filters.minPrice?.toString() ?? "");
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? "");

  const categories = facets?.categories ?? [];
  const tags = facets?.tags ?? [];

  const commitPrice = () => onPriceChange(toBound(min), toBound(max));

  return (
    <FilterPanel
      title={t("filters.title")}
      activeCount={activeCount}
      clearLabel={t("filters.clear")}
      onClear={() => {
        setMin("");
        setMax("");
        onClearAll();
      }}
    >
      {categories.length > 0 && (
        <FilterGroup label={t("filters.categories")}>
          <FilterOptions
            options={categories.map((f) => ({
              value: f.name,
              label: f.name,
              count: f.count,
            }))}
            selected={filters.categories}
            onToggle={onToggleCategory}
          />
        </FilterGroup>
      )}

      <FilterGroup label={t("filters.price")}>
        <div className={filterRangeRowClass}>
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t("filters.min")}
            aria-label={t("filters.min")}
            value={min}
            onChangeText={setMin}
            onBlur={commitPrice}
            size="sm"
          />
          <span className={filterRangeDashClass}>–</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t("filters.max")}
            aria-label={t("filters.max")}
            value={max}
            onChangeText={setMax}
            onBlur={commitPrice}
            size="sm"
          />
        </div>
      </FilterGroup>

      {tags.length > 0 && (
        <FilterGroup label={t("filters.tags")}>
          <div className={filterTagsClass}>
            {tags.map((tag) => (
              <Chip
                key={tag.name}
                label={tag.name}
                count={tag.count}
                selected={filters.tags.includes(tag.name)}
                onPress={() => onToggleTag(tag.name)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup label={t("filters.offers")}>
        <Checkbox
          size="sm"
          checked={Boolean(filters.hasOffer)}
          onCheckedChange={onHasOfferChange}
          label={t("filters.onlyOffers")}
          description={t("filters.onlyOffersHint")}
        />
      </FilterGroup>
    </FilterPanel>
  );
}
