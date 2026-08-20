"use client";

import clsx from "clsx";
import { Checkbox } from "@/components/Primitives/Checkbox";
import { Text } from "@/components/Primitives/Text";
import {
  filterOptionCountClass,
  filterOptionLabelClass,
  filterOptionRowClass,
  filterOptionsClass,
} from "@/design/filter-panel";

export interface FilterOption {
  value: string;
  label: string;
  /** Hits behind this option, as the facet reports it. */
  count?: number;
}

export interface FilterOptionsProps {
  options: FilterOption[];
  /** Values currently on. */
  selected: string[];
  onToggle: (value: string) => void;
  className?: string;
}

/**
 * A checkbox list with the facet counts on the right. The row — not just the
 * box — is the hit target, so a narrow tick never costs the user a miss.
 */
export function FilterOptions({
  options,
  selected,
  onToggle,
  className,
}: FilterOptionsProps) {
  if (options.length === 0) return null;

  return (
    <div className={clsx(filterOptionsClass, className)}>
      {options.map((option) => {
        const checked = selected.includes(option.value);
        return (
          <div key={option.value} className={filterOptionRowClass}>
            <Checkbox
              size="sm"
              checked={checked}
              onCheckedChange={() => onToggle(option.value)}
              label={option.label}
              className={filterOptionLabelClass}
            />
            {typeof option.count === "number" && (
              <Text variant="span" size="xs" className={filterOptionCountClass}>
                {option.count}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
}
