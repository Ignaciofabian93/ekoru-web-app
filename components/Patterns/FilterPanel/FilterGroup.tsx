"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import {
  filterGroupBodyClass,
  filterGroupChevronClass,
  filterGroupChevronSize,
  filterGroupClass,
  filterGroupToggleClass,
} from "@/design/filter-panel";

export interface FilterGroupProps {
  label: string;
  /** Groups open by default; a long tail (tags, brands) can start collapsed. */
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

/** One collapsible section of the facet rail. */
export function FilterGroup({
  label,
  defaultOpen = true,
  children,
  className,
}: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={clsx(filterGroupClass, className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={filterGroupToggleClass}
      >
        <Text variant="span" size="sm" weight="semibold">
          {label}
        </Text>
        <ChevronDown
          size={filterGroupChevronSize}
          strokeWidth={2}
          aria-hidden
          className={filterGroupChevronClass[open ? "open" : "closed"]}
        />
      </button>

      {open && <div className={filterGroupBodyClass}>{children}</div>}
    </div>
  );
}
