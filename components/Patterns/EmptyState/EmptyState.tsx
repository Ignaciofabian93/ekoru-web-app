"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { Check, type LucideIcon } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  emptyStateActionsClass,
  emptyStateClass,
  emptyStateDescriptionClass,
  emptyStateIconClass,
  emptyStateIconSize,
  emptyStateTipClass,
  emptyStateTipIconClass,
  emptyStateTipIconSize,
  emptyStateTipsClass,
  type EmptyStateFrame,
} from "@/design/empty-state";

export interface EmptyStateProps {
  icon: LucideIcon;
  /** Already-translated copy — shared components take text as props. */
  title: string;
  description?: string;
  /** Ticked lines of advice: how to get a result next time. */
  tips?: string[];
  /** Actions or chips under the copy — a "clear filters" button, related terms. */
  children?: ReactNode;
  frame?: EmptyStateFrame;
  className?: string;
}

/**
 * The "nothing here" state, in the two sizes the app needs: inline inside a
 * grid, or framed as the body of a page that found nothing at all.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  tips,
  children,
  frame = "bare",
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx(emptyStateClass[frame], className)}>
      <Icon
        size={emptyStateIconSize}
        strokeWidth={1.5}
        aria-hidden
        className={emptyStateIconClass}
      />

      <Title level="h2" size="h5" weight="semibold">
        {title}
      </Title>

      {description && (
        <Text variant="p" color="secondary" className={emptyStateDescriptionClass}>
          {description}
        </Text>
      )}

      {tips && tips.length > 0 && (
        <ul className={emptyStateTipsClass}>
          {tips.map((tip) => (
            <li key={tip} className={emptyStateTipClass}>
              <Check
                size={emptyStateTipIconSize}
                strokeWidth={2.5}
                aria-hidden
                className={emptyStateTipIconClass}
              />
              <Text variant="span" size="sm" color="secondary">
                {tip}
              </Text>
            </li>
          ))}
        </ul>
      )}

      {children && <div className={emptyStateActionsClass}>{children}</div>}
    </div>
  );
}
