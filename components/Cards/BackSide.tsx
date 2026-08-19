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
import { Droplets, Leaf, TrendingUp } from "lucide-react";
import ImpactModal from "./ImpactModal";

function ImpactInformation({ impact }: { impact: EnvironmentalImpact | null }) {
  const { t } = useTranslation(NAMESPACE);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div className={clsx("w-full mt-10 px-2 py-1 h-2/4")}>
      <section className="mb-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Text variant="label" weight="bold" size="sm">
              {t("impact.title")}
            </Text>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-1">
          <div className="flex flex-col items-start justify-between p-1">
            <div className="flex items-center gap-1">
              <Leaf size={14} className="text-primary" strokeWidth={2} />
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="flex line-clamp-1"
              >
                {t("impact.co2")}:
              </Text>
            </div>
            <Text
              variant="span"
              size="sm"
              weight="bold"
              color="secondary"
              className="ml-4.5"
            >
              {t("impact.co2Value", { value: String(impact?.totalCo2SavingsKG ?? 0) })}
            </Text>
          </div>
          <div className="flex flex-col items-start justify-between p-1">
            <div className="flex items-center gap-1">
              <Droplets size={14} className="text-info" strokeWidth={2} />
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="flex line-clamp-1"
              >
                {t("impact.water")}:
              </Text>
            </div>
            <Text
              variant="span"
              size="sm"
              weight="bold"
              color="secondary"
              className="ml-4.5"
            >
              {t("impact.waterValue", {
                value: String(impact?.totalWaterSavingsLT ?? 0),
              })}
            </Text>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={clsx(
            "flex my-4 w-full cursor-pointer items-center justify-center",
            "gap-1 rounded-sm px-2 py-1.5",
            "border-primary bg-linear-180 from-primary to-primary/60 text-on-primary",
            "hover:from-primary/90 hover:to-primary/80",
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
