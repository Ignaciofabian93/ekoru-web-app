"use client";
import { Chip } from "@/components/Primitives/Chip";
import { filterChipsClass, filterPanelClearClass } from "@/design/filter-panel";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { ActiveFilter } from "../hooks/useSearchFilters";

interface Props {
  filters: ActiveFilter[];
  onClearAll: () => void;
}

/**
 * The filters currently narrowing the results, each one droppable on its own.
 * It repeats what the rail says on purpose: on a phone the rail is behind a
 * sheet, and this row is the only visible account of what is filtered.
 */
export function SearchActiveFilters({ filters, onClearAll }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (filters.length === 0) return null;

  return (
    <div className={filterChipsClass}>
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          selected
          onRemove={filter.remove}
          removeLabel={t("filters.remove")}
        />
      ))}
      <button type="button" onClick={onClearAll} className={filterPanelClearClass}>
        {t("filters.clearAll")}
      </button>
    </div>
  );
}
