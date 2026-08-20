"use client";

import clsx from "clsx";
import {
  promoBadgeBaseClass,
  promoBadgeDefaultToneClass,
  promoBadgeToneClass,
} from "@/design/badge";
import { useTranslation } from "@/i18n/context";
import type { Badge } from "@/types/enums";

import { NAMESPACE } from "../i18n";

/** The seller's promotional claims. Colors come from `design/badge.ts`. */
export function ProductBadges({ badges }: { badges: Badge[] }) {
  const { t } = useTranslation(NAMESPACE);

  if (!badges?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className={clsx(
            promoBadgeBaseClass,
            promoBadgeToneClass[badge] ?? promoBadgeDefaultToneClass,
          )}
        >
          {t(`badges.${badge}`)}
        </span>
      ))}
    </div>
  );
}
