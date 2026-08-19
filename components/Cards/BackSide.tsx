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
import Image from "next/image";
import { getInitials } from "./utils/initials";
import { resolveImageUrl } from "@/utils/resolveImage";
import {
  useDisplayName,
  useInitials,
  useProfileImage,
  useSellerRegion,
} from "@/hooks/useSellerData";
import type { EnvironmentalImpact } from "@/types/product";
import { useState } from "react";
import { ChevronRight, Droplets, Info, Leaf } from "lucide-react";
import ImpactModal from "./ImpactModal";

function ImpactInformation({ impact }: { impact: EnvironmentalImpact | null }) {
  const { t } = useTranslation(NAMESPACE);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div className={clsx("w-full px-2 py-1 h-2/4")}>
      <section className="mb-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Text variant="label" weight="bold" size="sm">
              {t("impact.title")}
            </Text>
          </div>
          <Info size={12} strokeWidth={2.5} />
        </div>

        <div className="mb-2 grid grid-cols-1">
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-1">
              <Leaf size={14} className="text-primary" strokeWidth={2} />
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="hidden sm:flex line-clamp-1"
              >
                {t("impact.co2")}
              </Text>
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="flex sm:hidden line-clamp-1"
              >
                {t("impact.co2Short")}
              </Text>
            </div>
            <Text variant="span" size="sm" weight="bold" color="secondary">
              {/* Static unit copy lives in the dictionary ("{{value}} kg"); only
                  the number is injected, per the {{ }} value pattern. */}
              {t("impact.co2Value", { value: String(impact?.totalCo2SavingsKG ?? 0) })}
            </Text>
          </div>
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-1">
              <Droplets size={14} className="text-info" strokeWidth={2} />
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="hidden sm:flex truncate"
              >
                {t("impact.water")}
              </Text>
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="flex sm:hidden truncate"
              >
                {t("impact.waterShort")}
              </Text>
            </div>
            <Text variant="span" size="sm" weight="bold" color="secondary">
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
            "gap-1 rounded-sm bg-primary px-2 py-1.5",
            "transition-all hover:brightness-110",
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
          <ChevronRight size={12} strokeWidth={2.5} color="#fff" />
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

export function BackHeader({ itemName }: CardBackHeaderProps) {
  const { hasBackSide } = useCard();
  const { t } = useTranslation(NAMESPACE);

  return (
    <div
      className={clsx(
        "flex items-center justify-between w-full px-3 py-2",
        "border-b border-slate-200",
        "bg-primary/10",
      )}
    >
      <Text
        variant="label"
        weight="bold"
        size="base"
        color="default"
        className="line-clamp-1"
      >
        {itemName}
      </Text>
      {/* `itemName` is dynamic (a prop); the flip control's label is static
          card copy, so it comes from the dictionary. */}
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

export function BackFooter({ seller, name, imageUrl, subtitle }: CardBackFooterProps) {
  // The hooks run unconditionally and the explicit props win afterwards, so a
  // caller holding only a provider name still gets a rendered footer.
  const sellerName = useDisplayName(seller);
  const sellerRegion = useSellerRegion(seller);
  const sellerImage = useProfileImage(seller);
  const sellerInitials = useInitials(seller);

  const displayName = name ?? sellerName;
  const image = imageUrl ? resolveImageUrl(imageUrl) : sellerImage;
  const secondLine = subtitle ?? sellerRegion;
  const initials = name ? getInitials(name) : sellerInitials;

  // Nothing identifies the provider — drop the row rather than leave an empty
  // bar under the back face.
  if (!displayName && !secondLine) return null;

  return (
    <div className="w-full flex px-2 py-2 items-center justify-center sm:justify-start gap-1 border-t border-slate-200">
      <div className="bg-background-secondary rounded-full h-10 w-10 shrink-0 items-center justify-center overflow-hidden hidden sm:flex">
        {image ? (
          <Image
            src={image}
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-foreground-secondary text-xs font-bold">{initials}</span>
        )}
      </div>
      <div className="flex flex-col w-full sm:w-fit min-w-0">
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
