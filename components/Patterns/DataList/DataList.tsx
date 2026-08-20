"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { Text } from "@/components/Primitives/Text";
import {
  dataListBodyClass,
  dataListCaptionClass,
  dataListClass,
  dataListRowClass,
} from "@/design/data-list";

export interface DataListRow {
  /** Row heading, rendered as the `dt`. */
  label: string;
  /** Row value, rendered as the `dd`. */
  value: ReactNode;
}

export interface DataListProps {
  rows: DataListRow[];
  /**
   * Optional strip above the rows, uppercased like a table caption. Shared
   * components never read a feature namespace, so the host screen resolves it
   * from its own dictionary and passes the string in.
   */
  caption?: string;
  className?: string;
}

/**
 * The table-like block the product page keeps reaching for: label on the left,
 * value on the right, hairline rules between. It is a description list rather
 * than a `table` because nothing here is a grid — every row is one pair, and a
 * `dl` says that without the row/column scaffolding a real table implies.
 */
export function DataList({ rows, caption, className }: DataListProps) {
  if (rows.length === 0) return null;

  return (
    <div className={clsx(dataListClass, className)}>
      {caption && (
        <div className={dataListCaptionClass}>
          <Text
            variant="span"
            size="xs"
            weight="bold"
            color="secondary"
            className="tracking-wide uppercase"
          >
            {caption}
          </Text>
        </div>
      )}
      <dl className={dataListBodyClass}>
        {rows.map((row) => (
          <div key={row.label} className={dataListRowClass}>
            <dt>
              <Text variant="span" size="sm">
                {row.label}
              </Text>
            </dt>
            <dd>
              <Text variant="span" size="sm" weight="semibold">
                {row.value}
              </Text>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
