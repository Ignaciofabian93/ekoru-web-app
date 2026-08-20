"use client";

import clsx from "clsx";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Text } from "@/components/Primitives/Text";
import {
  navCardBodyClass,
  navCardChevronClass,
  navCardChevronSize,
  navCardClass,
  navCardIconClass,
  navCardIconSize,
  type NavCardTone,
} from "@/design/nav-card";

export interface NavCardProps {
  href: string;
  icon: LucideIcon;
  /** Already-translated copy — shared components take text as props. */
  title: string;
  hint?: string;
  tone?: NavCardTone;
  className?: string;
}

/**
 * A card that is a link and nothing else: icon, where it goes, and why you'd
 * go there. Used to offer the catalogs as an onward route when a search comes
 * back with nothing.
 */
export function NavCard({
  href,
  icon: Icon,
  title,
  hint,
  tone = "primary",
  className,
}: NavCardProps) {
  return (
    <Link href={href} className={clsx(navCardClass, className)}>
      <span className={navCardIconClass[tone]}>
        <Icon size={navCardIconSize} strokeWidth={1.75} aria-hidden />
      </span>

      <span className={navCardBodyClass}>
        <Text variant="span" size="sm" weight="bold">
          {title}
        </Text>
        {hint && (
          <Text variant="span" size="sm" color="secondary">
            {hint}
          </Text>
        )}
      </span>

      <ChevronRight
        size={navCardChevronSize}
        strokeWidth={2}
        aria-hidden
        className={navCardChevronClass}
      />
    </Link>
  );
}
