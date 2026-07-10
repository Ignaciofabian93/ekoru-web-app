"use client";

import { Clock, Leaf, X } from "lucide-react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { RecyclePoint } from "../types";

interface Props {
  point: RecyclePoint;
  onClose: () => void;
}

/**
 * Floating detail card for a selected recycling point: name, operator, opening
 * hours and the accepted-material tags. Mirrors the mobile bottom sheet.
 */
export function RecyclePointCard({ point, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="absolute inset-x-3 bottom-3 z-1000 mx-auto max-w-xl rounded-xl bg-surface p-4 shadow-xl sm:inset-x-4 sm:bottom-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Leaf size={16} strokeWidth={2} className="text-primary shrink-0" />
          <p className="text-foreground line-clamp-2 font-semibold">
            {point.name ?? t("point.fallbackName")}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("point.close")}
          className="text-foreground-secondary hover:text-foreground shrink-0 transition-colors"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {point.operator && (
        <p className="text-foreground-secondary mt-1 text-sm">{point.operator}</p>
      )}

      {point.openingHours && (
        <p className="text-foreground-secondary mt-1 flex items-center gap-1.5 text-sm">
          <Clock size={13} strokeWidth={2} className="shrink-0" />
          {point.openingHours}
        </p>
      )}

      {point.materials.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {point.materials.map((m) => (
            <span
              key={m}
              className="border-primary text-primary bg-background rounded-full border px-2.5 py-0.5 text-xs font-medium"
            >
              {t(`materials.${m}`)}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-foreground-tertiary mt-2 text-xs italic">
          {t("point.noMaterials")}
        </p>
      )}
    </div>
  );
}
