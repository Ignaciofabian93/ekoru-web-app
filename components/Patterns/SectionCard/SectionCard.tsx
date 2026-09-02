"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  sectionCardClass,
  sectionCardHeaderClass,
  sectionCardHeadingClass,
  sectionCardIconClass,
  sectionCardIconSize,
  sectionCardTitleClass,
  type SectionCardTone,
} from "@/design/section-card";

export interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Tints the icon chip only. The card surface stays white in every tone. */
  tone?: SectionCardTone;
  /** Trailing node pushed to the far edge of the header — a "see all" link. */
  headerRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * The titled panel a dashboard section lives in. Shared rather than owned by
 * the profile, so every surface built out of stacked panels — the profile rail,
 * the about page — keeps the same padding, radius, shadow and chip.
 */
export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  tone = "default",
  headerRight,
  className,
  children,
}: SectionCardProps) {
  return (
    <section className={clsx(sectionCardClass, className)}>
      <header className={sectionCardHeaderClass}>
        <div className={sectionCardHeadingClass}>
          {Icon && (
            <div className={sectionCardIconClass[tone]}>
              <Icon size={sectionCardIconSize} color="currentColor" strokeWidth={2} />
            </div>
          )}
          <div className={sectionCardTitleClass}>
            <Title level="h2" size="h5" weight="semibold">
              {title}
            </Title>
            {subtitle && (
              <Text variant="span" size="sm" color="secondary">
                {subtitle}
              </Text>
            )}
          </div>
        </div>
        {headerRight}
      </header>
      <div>{children}</div>
    </section>
  );
}
