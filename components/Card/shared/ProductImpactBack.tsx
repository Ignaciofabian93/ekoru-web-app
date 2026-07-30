"use client";
import { ChevronRight, Droplets, Info, Leaf, MapPin, RotateCcw } from "lucide-react";
import Image from "next/image";
import {
  useDisplayName,
  useInitials,
  useProfileImage,
  useSellerRegion,
  useSellerType,
} from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import type { Seller } from "@/types/user";
import { Text } from "@/components/Primitives/Text";
import clsx from "clsx";
import { Badge } from "@/components/Primitives/Badge";

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
  onFlip,
  onShowImpact,
}: Props) {
  const { t } = useTranslation();
  const displayName = useDisplayName(seller);
  const sellerType = useSellerType(seller);
  const sellerRegion = useSellerRegion(seller);
  const profileImage = useProfileImage(seller);
  const initials = useInitials(seller);

  const impact = environmentalImpact ?? null;

  const typeLabelRaw = sellerType ? t(`impact.sellerTypes.${sellerType}`) : "";
  const typeLabel = typeLabelRaw.startsWith("impact.") ? sellerType : typeLabelRaw;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface border border-border-strong shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b-2 border-border-light">
        <Text variant="p" size="sm" weight="semibold" className="line-clamp-1">
          {title}
        </Text>
        <button
          type="button"
          onClick={onFlip}
          aria-label={t("impact.flipToFront")}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full shadow-sm bg-primary text-white transition-colors"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {impact && (
          <section className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Text variant="label" weight="bold" size="sm">
                  {t("impact.environmentalImpact")}
                </Text>
              </div>
              <button
                type="button"
                onClick={onShowImpact}
                aria-label={t("impact.viewFullImpact")}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-all hover:brightness-110"
              >
                <Info size={12} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-1">
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-1">
                  <Leaf size={14} className="text-primary" strokeWidth={2} />
                  <Text variant="span" size="sm" weight="bold" color="secondary">
                    {t("impact.co2")}
                  </Text>
                </div>
                <Text variant="span" size="sm" weight="bold" color="secondary">
                  {formatNumber(impact.totalCo2SavingsKG)} kg
                </Text>
              </div>
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-1">
                  <Droplets size={14} className="text-info" strokeWidth={2} />
                  <Text variant="span" size="sm" weight="bold" color="secondary">
                    {t("impact.water")}
                  </Text>
                </div>
                <Text variant="span" size="sm" weight="bold" color="secondary">
                  {formatNumber(impact.totalWaterSavingsLT)} L
                </Text>
              </div>
            </div>

            <button
              type="button"
              onClick={onShowImpact}
              className={clsx(
                "my-4 flex w-full cursor-pointer items-center justify-center",
                "gap-1 rounded-sm bg-primary px-2 py-1.5",
                "transition-all hover:brightness-110",
              )}
            >
              <Text variant="label" size="sm" color="white">
                {t("impact.viewFullImpact")}
              </Text>
              <ChevronRight size={12} strokeWidth={2.5} color="#fff" />
            </button>
          </section>
        )}

        {seller && (
          <section className="border-t-2 border-border-light py-1">
            <div className="flex items-center gap-1.5 my-1">
              <Text variant="label" size="sm" weight="bold">
                {t("impact.seller")}
              </Text>
              {typeLabel && <Badge label={typeLabel} variant="primary" size="small" />}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-background-secondary">
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
              <div className="w-full flex flex-col items-start justify-start">
                {displayName && (
                  <Text variant="p" className="line-clamp-1">
                    {displayName}
                  </Text>
                )}
                {sellerRegion && (
                  <div className="flex items-center">
                    <MapPin size={12} className="inline-block" strokeWidth={2} />
                    <Text variant="span" className="line-clamp-1" size="xs">
                      {sellerRegion}
                    </Text>
                  </div>
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
