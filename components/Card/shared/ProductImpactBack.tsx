"use client";

import { ChevronRight, Droplets, Info, Leaf, MapPin, RotateCcw } from "lucide-react";
import Image from "next/image";

import {
  useDisplayName,
  useInitials,
  useProfileImage,
  useSellerLocation,
  useSellerType,
} from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import type { Seller } from "@/types/user";
import { formatMaterialAmount, materialLabel } from "@/utils/impact";

type Accent = "primary" | "secondary";

interface Props {
  title: string;
  environmentalImpact?: EnvironmentalImpact | null;
  seller?: Seller | null;
  accent?: Accent;
  onFlip: () => void;
  /** Opens the detailed environmental-impact modal. */
  onShowImpact: () => void;
}

const ACCENT: Record<
  Accent,
  { headerBg: string; headerText: string; flipBtn: string; border: string }
> = {
  primary: {
    headerBg: "bg-primary-light-bg",
    headerText: "text-primary-dark",
    flipBtn: "bg-primary text-on-primary hover:bg-primary-active",
    border: "border-border-light",
  },
  secondary: {
    headerBg: "bg-secondary/10",
    headerText: "text-secondary-dark",
    flipBtn: "bg-secondary text-white hover:bg-secondary-dark",
    border: "border-secondary/30",
  },
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Shared back side for product flip-cards (marketplace + stores). Shows a
 * compact environmental-impact preview and the seller (avatar + name + type),
 * with an info button that opens the full impact modal. Purely presentational —
 * the parent owns the flip + modal state.
 */
export default function ProductImpactBack({
  title,
  environmentalImpact,
  seller,
  accent = "primary",
  onFlip,
  onShowImpact,
}: Props) {
  const { t } = useTranslation();
  const a = ACCENT[accent];

  const displayName = useDisplayName(seller);
  const sellerType = useSellerType(seller);
  const sellerLocation = useSellerLocation(seller);
  const profileImage = useProfileImage(seller);
  const initials = useInitials(seller);

  const impact = environmentalImpact ?? null;
  const materials = impact?.materialBreakdown ?? [];
  const extraMaterials = Math.max(0, materials.length - 2);

  const typeLabelRaw = sellerType ? t(`impact.sellerTypes.${sellerType}`) : "";
  const typeLabel = typeLabelRaw.startsWith("impact.") ? sellerType : typeLabelRaw;

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-lg border ${a.border} bg-surface shadow-sm`}
    >
      <div
        className={`flex items-center justify-between gap-2 border-b ${a.border} ${a.headerBg} px-3 py-2`}
      >
        <p className={`truncate text-xs font-semibold ${a.headerText}`}>{title}</p>
        <button
          type="button"
          onClick={onFlip}
          aria-label={t("impact.flipToFront")}
          className={`flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors ${a.flipBtn}`}
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {impact && (
          <section className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Leaf size={12} className="text-primary" strokeWidth={2} />
                <span className="text-xs font-bold text-foreground">
                  {t("impact.environmentalImpact")}
                </span>
              </div>
              <button
                type="button"
                onClick={onShowImpact}
                aria-label={t("impact.viewFullImpact")}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              >
                <Info size={12} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-primary-light-bg p-2">
                <div className="mb-0.5 flex items-center gap-1">
                  <Leaf size={10} className="text-primary" strokeWidth={2} />
                  <span className="text-[10px] text-foreground-secondary">
                    {t("impact.co2")}
                  </span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {formatNumber(impact.totalCo2SavingsKG)} kg
                </span>
              </div>
              <div className="rounded-md bg-info/10 p-2">
                <div className="mb-0.5 flex items-center gap-1">
                  <Droplets size={10} className="text-info" strokeWidth={2} />
                  <span className="text-[10px] text-foreground-secondary">
                    {t("impact.water")}
                  </span>
                </div>
                <span className="text-xs font-bold text-info">
                  {formatNumber(impact.totalWaterSavingsLT)} L
                </span>
              </div>
            </div>

            {materials.length > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold tracking-wide text-foreground-tertiary uppercase">
                  {t("impact.materials")}
                </span>
                {materials.slice(0, 2).map((material, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <span className="flex-1 truncate text-xs text-foreground-secondary">
                      {materialLabel(material)}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {formatMaterialAmount(material)}
                    </span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={onShowImpact}
                  className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 text-primary transition-colors hover:bg-primary/20"
                >
                  <span className="text-xs font-semibold">
                    {extraMaterials > 0
                      ? `${t("impact.viewFullImpact")} (+${extraMaterials})`
                      : t("impact.viewFullImpact")}
                  </span>
                  <ChevronRight size={12} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </section>
        )}

        {seller && (
          <section className={`border-t ${a.border} pt-3`}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">{t("impact.seller")}</span>
              {typeLabel && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {typeLabel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-background-secondary">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={displayName || t("impact.seller")}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-foreground-secondary">
                    {initials}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {displayName && (
                  <p className="truncate text-xs font-semibold text-foreground">{displayName}</p>
                )}
                {sellerLocation && (
                  <p className="flex items-center gap-1 truncate text-[11px] text-foreground-secondary">
                    <MapPin size={10} strokeWidth={2} className="shrink-0" />
                    <span className="truncate">{sellerLocation}</span>
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {!impact && !seller && (
          <p className="text-xs text-foreground-tertiary">{t("impact.noExtraInfo")}</p>
        )}
      </div>
    </div>
  );
}
