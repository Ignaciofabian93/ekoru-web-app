"use client";

import { useTranslation } from "@/i18n/context";
import {
  ChevronRight,
  Droplets,
  Leaf,
  MapPin,
  Phone,
  RotateCcw,
  UserRound,
} from "lucide-react";

import { NAMESPACE } from "@/features/marketplace/i18n";
import type { MarketplaceCardProduct } from "./types";
import { useDisplayName, useSellerLocation, useSellerType } from "@/hooks/useSellerData";

interface Props {
  product: MarketplaceCardProduct;
  onFlip: () => void;
  onShowImpact?: () => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

export default function BackSide({ product, onFlip, onShowImpact }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { environmentalImpact, seller } = product;

  const displayName = useDisplayName(seller);
  const sellerType = useSellerType(seller);
  const sellerLocation = useSellerLocation(seller);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-light bg-surface shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border-light bg-primary-light-bg px-3 py-2">
        <p className="truncate text-xs font-semibold text-primary-dark">{product.name}</p>
        <button
          type="button"
          onClick={onFlip}
          aria-label={t("card.flipToFront")}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-colors hover:bg-primary-active"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {environmentalImpact && (
          <section className="mb-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Leaf size={12} className="text-primary" strokeWidth={2} />
              <span className="text-xs font-bold text-foreground">
                {t("card.environmentalImpact")}
              </span>
            </div>

            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-primary-light-bg p-2">
                <div className="mb-0.5 flex items-center gap-1">
                  <Leaf size={10} className="text-primary" strokeWidth={2} />
                  <span className="text-[10px] text-foreground-secondary">CO₂</span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {formatNumber(environmentalImpact.totalCo2SavingsKG)} kg
                </span>
              </div>
              <div className="rounded-md bg-blue-50 p-2">
                <div className="mb-0.5 flex items-center gap-1">
                  <Droplets size={10} className="text-info" strokeWidth={2} />
                  <span className="text-[10px] text-foreground-secondary">
                    {t("card.water")}
                  </span>
                </div>
                <span className="text-xs font-bold text-info">
                  {formatNumber(environmentalImpact.totalWaterSavingsLT)} L
                </span>
              </div>
            </div>

            {environmentalImpact.materialBreakdown.length > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold tracking-wide text-foreground-tertiary uppercase">
                  {t("card.materials")}
                </span>
                {environmentalImpact.materialBreakdown.slice(0, 2).map((material, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <span className="flex-1 truncate text-xs text-foreground-secondary">
                      {material.materialType}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {material?.percentage?.toFixed(1)}%
                    </span>
                  </div>
                ))}

                {onShowImpact && (
                  <button
                    type="button"
                    onClick={onShowImpact}
                    className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 text-primary transition-colors hover:bg-primary/20"
                  >
                    <span className="text-xs font-semibold">
                      {t("card.viewFullImpact")}
                    </span>
                    <ChevronRight size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {seller && (
          <section className="border-t border-border-light pt-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">
                {t("card.seller")}
              </span>
              {seller.sellerType && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {t(`sellerTypes.${sellerType}`)}
                </span>
              )}
            </div>
            <ul className="flex flex-col gap-1">
              {displayName && (
                <li className="flex items-center gap-1.5 text-foreground-secondary">
                  <UserRound size={11} strokeWidth={2} />
                  <span className="truncate text-xs">{displayName}</span>
                </li>
              )}
              {seller.phone && (
                <li className="flex items-center gap-1.5 text-foreground-secondary">
                  <Phone size={11} strokeWidth={2} />
                  <span className="truncate text-xs">{seller.phone}</span>
                </li>
              )}
              {sellerLocation && (
                <li className="flex items-center gap-1.5 text-foreground-secondary">
                  <MapPin size={11} strokeWidth={2} />
                  <span className="truncate text-xs">{sellerLocation}</span>
                </li>
              )}
            </ul>
          </section>
        )}

        {!environmentalImpact && !seller && (
          <p className="text-xs text-foreground-tertiary">{t("card.noExtraInfo")}</p>
        )}
      </div>
    </div>
  );
}
