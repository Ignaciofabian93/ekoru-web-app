"use client";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/Primitives/Button";
import { Select } from "@/components/Primitives/Select";
import { Text } from "@/components/Primitives/Text";
import { filterPanelBadgeClass } from "@/design/filter-panel";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SearchSortBy } from "../types";

const SORT_ORDER: SearchSortBy[] = [
  "RELEVANCE",
  "PRICE_ASC",
  "PRICE_DESC",
  "RATING",
];

interface Props {
  /** Already-composed "Showing 1–10 of 128" line. */
  showingLabel: string;
  sortBy: SearchSortBy;
  onSortChange: (value: SearchSortBy) => void;
  activeCount: number;
  /** Opens the rail as a sheet — only rendered below the rail's breakpoint. */
  onOpenFilters: () => void;
}

/** The row above the grid: what is on screen, how it is ordered, and — on
 *  phones, where the rail is hidden — the way into the filters. */
export function SearchToolbar({
  showingLabel,
  sortBy,
  onSortChange,
  activeCount,
  onOpenFilters,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <Text variant="span" size="sm" color="secondary" className="hidden sm:inline">
        {showingLabel}
      </Text>

      <div className="flex flex-1 flex-row items-center gap-2 lg:flex-none">
        <div className="flex-1 lg:hidden">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={SlidersHorizontal}
            text={t("filters.open")}
            onPress={onOpenFilters}
          />
        </div>
        {activeCount > 0 && (
          <span className={`${filterPanelBadgeClass} lg:hidden`}>{activeCount}</span>
        )}

        <div className="w-full sm:w-56">
          <Select
            options={SORT_ORDER.map((value) => ({
              value,
              label: t(`sort.${value}`),
            }))}
            value={sortBy}
            onChange={(value) => onSortChange(value as SearchSortBy)}
            ariaLabel={t("sort.label")}
            searchEnabled={false}
          />
        </div>
      </div>
    </div>
  );
}
