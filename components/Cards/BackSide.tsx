import { useTranslation } from "@/i18n/context";
import { useCard } from "./context/Card.context";
import { NAMESPACE } from "./i18n";
import type {
  CardBackBodyProps,
  CardBackFooterProps,
  CardBackHeaderProps,
} from "./types/Card.types";
import clsx from "clsx";
import { Text } from "../Primitives";
import { FlipButton } from "./FlipButton";
import { useDisplayName, useSellerRegion } from "@/hooks/useSellerData";
import type { EnvironmentalImpact } from "@/types/product";
import { useState } from "react";
import { Droplets, Leaf, TrendingUp, type LucideIcon } from "lucide-react";
import type { TotalImpactType } from "@/components/Patterns/TotalImpact/TotalImpact";
import { buttonVariantClass } from "@/design/button";
import {
  impactIconSize,
  impactIconStroke,
  impactTileClass,
  impactToneClass,
} from "@/design/total-impact";
import ImpactModal from "./ImpactModal";

/**
 * One saving on the back face — the same surface and hue as the standalone
 * `TotalImpact` tile, at the density a card back can afford: the icon and its
 * caption on one line, the figure under it.
 */
function ImpactTile({
  type,
  icon: Icon,
  label,
  value,
}: {
  type: TotalImpactType;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  const tone = impactToneClass[type];
  return (
    <div
      className={clsx(impactTileClass[type].sm, "w-full items-center justify-between")}
    >
      <div className="flex items-center gap-1">
        <Icon
          size={impactIconSize.sm}
          className={tone}
          strokeWidth={impactIconStroke}
          aria-hidden
        />
        <Text
          variant="span"
          size="sm"
          weight="bold"
          className={clsx(tone, "line-clamp-1")}
        >
          {label}
        </Text>
      </div>
      <Text variant="span" size="sm" weight="bold" className={tone}>
        {value}
      </Text>
    </div>
  );
}

function ImpactInformation({ impact }: { impact: EnvironmentalImpact | null }) {
  const { t } = useTranslation(NAMESPACE);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div className={clsx("w-full mt-10 px-2 py-1 h-2/4")}>
      <section className="my-2">
        <div className="flex flex-col items-center gap-2">
          <ImpactTile
            type="co2"
            icon={Leaf}
            label={t("impact.co2")}
            value={t("impact.co2Value", {
              value: String(impact?.totalCo2SavingsKG ?? 0),
            })}
          />
          <ImpactTile
            type="water"
            icon={Droplets}
            label={t("impact.water")}
            value={t("impact.waterValue", {
              value: String(impact?.totalWaterSavingsLT ?? 0),
            })}
          />
        </div>

        {/* The primary button's own gradient, borrowed rather than restated —
            this is a plain button because it carries two responsive labels. */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={clsx(
            "flex my-2 w-full cursor-pointer items-center justify-center",
            "gap-1 rounded-sm px-2 py-1.5",
            buttonVariantClass.primary,
            "transition-all",
          )}
        >
          <Text
            variant="label"
            size="sm"
            color="white"
            className="hidden sm:flex truncate"
          >
            {t("impact.viewFull")}
          </Text>
          <Text
            variant="label"
            size="sm"
            color="white"
            className="flex sm:hidden truncate"
          >
            {t("impact.viewFullShort")}
          </Text>
          <TrendingUp size={12} strokeWidth={2.5} color="#fff" />
        </button>
      </section>

      {/* Portals to <body>, so it escapes the card's transform-3d/perspective
          and the back face's `inert` — it opens correctly from the flipped
          side. Rendered only when impact data exists. */}
      {impact && (
        <ImpactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          environmentalImpact={impact}
        />
      )}
    </div>
  );
}

// The non-product back face: a blurb rather than an impact panel. Services use
// it, since there is no material composition to compute savings from.
function Description({ description }: { description?: string | null }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      <Text variant="p" size="sm" color="secondary" numberOfLines={6}>
        {description?.trim() || t("meta.noDescription")}
      </Text>
    </div>
  );
}

export function BackHeader({}: CardBackHeaderProps) {
  const { hasBackSide } = useCard();
  const { t } = useTranslation(NAMESPACE);

  return (
    <div
      className={clsx(
        "absolute top-2 right-2 z-20 flex items-center justify-end gap-1.5",
      )}
    >
      {hasBackSide && <FlipButton label={t("actions.flipBack")} />}
    </div>
  );
}

export function BackBody({ itemType, impact, description }: CardBackBodyProps) {
  if (itemType === "MARKETPLACE" || itemType === "STORE") {
    return <ImpactInformation impact={impact ?? null} />;
  }
  return <Description description={description} />;
}

export function BackFooter({ seller, name, subtitle }: CardBackFooterProps) {
  const sellerName = useDisplayName(seller);
  const sellerRegion = useSellerRegion(seller);
  const displayName = name ?? sellerName;
  const secondLine = subtitle ?? sellerRegion;

  if (!displayName && !secondLine) return null;

  return (
    <div className="w-full flex px-2 py-2 items-center justify-center gap-1 border-t border-secondary-light">
      <div className="flex flex-col items-center">
        {displayName && (
          <Text variant="span" weight="semibold" size="sm" className="line-clamp-1">
            {displayName}
          </Text>
        )}
        {secondLine && (
          <Text
            variant="small"
            weight="bold"
            size="xs"
            align="left"
            className="line-clamp-1"
          >
            {secondLine}
          </Text>
        )}
      </div>
    </div>
  );
}
