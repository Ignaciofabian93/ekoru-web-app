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
import {
  useDisplayName,
  useInitials,
  useProfileImage,
  useSellerRegion,
} from "@/hooks/useSellerData";
import { formatInitials } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/resolveImage";
import type { EnvironmentalImpact } from "@/types/product";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Droplets, Leaf, MapPin, type LucideIcon } from "lucide-react";
import { impactIconStroke, impactToneClass } from "@/design/total-impact";
import { materialLabel, materialPercentage } from "@/utils/impact";
import ImpactModal from "./ImpactModal";

/*
 * `@min-[12rem]` is the one breakpoint the back face has, and it measures the
 * CARD, not the viewport: 192px of the face's CONTENT box — so ~194px of card,
 * since `inline-size` containment excludes the border. Above it there is room
 * for the header, a third material and the full labels; below it the card is a
 * two-column mobile cell and only the essentials fit.
 *
 * The value is bounded by the results grid on both sides, so it has to sit
 * between them:
 *
 *   desktop  `Container` max-w-6xl (1152) less `sm:px-6` (48) = 1104, over
 *            `lg:grid-cols-5` with a 16px gap → 208px cells → a 206px content
 *            box. The 3- and 4-column steps land near 200.
 *   mobile   375 less `px-4` (32) = 343, over 2 columns → ~163px cells → a
 *            ~161px content box.
 *
 * This was 13rem (208px), which no card in that grid ever reaches — the widest
 * is 206 — so every rule behind it was dead and the wide card always rendered
 * the compact layout. 12rem clears the desktop cells by 14px and stays well
 * above the mobile ones. Re-measure against the grid before changing it.
 *
 * Written out longhand at every use — Tailwind only sees complete class names,
 * so a constant would compile to nothing.
 */

/**
 * The composition the card has room to name: largest share first, capped at
 * three. The full list lives in the impact modal, which is what the CTA opens.
 */
function topMaterials(impact: EnvironmentalImpact | null) {
  const all = impact?.materialBreakdown ?? [];
  if (all.length === 0) return [];
  return all
    .map((material) => ({
      key: material.materialType,
      label: materialLabel(material),
      percentage: Math.round(materialPercentage(material, all)),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);
}

/**
 * One saving: icon and label on the left, figure on the right.
 *
 * Both savings render through this, so CO₂ and water are the same object in two
 * colours — they used to be a headline figure and a footnote, which read as a
 * ranking the numbers don't support.
 */
function SavingRow({
  icon: Icon,
  tone,
  label,
  shortLabel,
  value,
  unit,
  className,
}: {
  icon: LucideIcon;
  /** Text colour for both the icon and the figure — see `impactToneClass`. */
  tone: string;
  label: string;
  /** Compact form for a narrow card, where the full label would truncate. */
  shortLabel: string;
  value: string;
  unit: string;
  className?: string;
}) {
  return (
    <div
      className={clsx("flex shrink-0 items-baseline justify-between gap-2", className)}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <Icon
          size={12}
          strokeWidth={impactIconStroke}
          className={clsx("shrink-0", tone)}
          aria-hidden
        />
        {/* The label shares its line with the figure, so on a narrow card it
            swaps for the compact form the dictionary already carries rather
            than truncating to "Water sa…". */}
        <Text
          variant="span"
          size="xs"
          color="secondary"
          numberOfLines={1}
          className="min-w-0 @min-[12rem]:hidden"
        >
          {shortLabel}
        </Text>
        <Text
          variant="span"
          size="xs"
          color="secondary"
          numberOfLines={1}
          className="hidden min-w-0 @min-[12rem]:inline"
        >
          {label}
        </Text>
      </span>
      <span className={clsx("flex shrink-0 items-baseline gap-0.5 font-bold", tone)}>
        <span className="text-base">{value}</span>
        <span className="text-xs">{unit}</span>
      </span>
    </div>
  );
}

/**
 * The product back face: what the item saved, what it is made of, and who is
 * selling it — the same facts the impact modal opens with, at the density a
 * card can hold.
 *
 * Height is deliberately fluid. The savings and the composition sit in a
 * `flex-1` band with `justify-between`, so a taller card spreads its surplus
 * between them rather than collecting it in one gap above the footer, and a
 * shorter one shrinks the composition (the only thing here that may clip)
 * instead of pushing the seller out of the card.
 */
function ImpactInformation({ impact }: { impact: EnvironmentalImpact | null }) {
  const { t } = useTranslation(NAMESPACE);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const materials = topMaterials(impact);

  // `pt-2` at every size: BackHeader has already ruled off above this, so this
  // is the gap under that rule rather than the face's own top padding.
  return (
    <div className="flex min-h-0 flex-1 flex-col px-2.5 pt-2 @min-[12rem]:px-3">
      <div
        className={clsx(
          "flex min-h-0 flex-1 flex-col",
          // With nothing to fill the middle, the savings centre instead of
          // being pushed apart into a hole.
          materials.length > 0 ? "justify-between gap-2" : "justify-center gap-3",
        )}
      >
        <div className="flex shrink-0 flex-col gap-1.5">
          <SavingRow
            icon={Leaf}
            tone={impactToneClass.co2}
            label={t("impact.co2")}
            shortLabel={t("impact.co2Short")}
            value={String(impact?.totalCo2SavingsKG ?? 0)}
            unit={t("impact.co2Unit")}
          />
          <SavingRow
            icon={Droplets}
            tone={impactToneClass.water}
            label={t("impact.water")}
            shortLabel={t("impact.waterShort")}
            value={String(impact?.totalWaterSavingsLT ?? 0)}
            unit={t("impact.waterUnit")}
          />
        </div>

        {materials.length > 0 && (
          <div className="min-h-0 overflow-hidden border-t border-slate-200 pt-2">
            <Text
              variant="span"
              size="xs"
              weight="bold"
              color="secondary"
              className="block uppercase tracking-[0.9px]"
            >
              {t("impact.composition")}
            </Text>
            <ul className="m-0 list-none p-0">
              {materials.map((material, index) => (
                <li
                  key={material.key}
                  className={clsx(
                    "flex items-baseline leading-tight",
                    // The third only earns its line on a card wide enough to
                    // have shown the title too.
                    index === 2 && "hidden @min-[12rem]:flex",
                  )}
                >
                  <Text
                    variant="span"
                    size="xs"
                    color="secondary"
                    numberOfLines={1}
                    className="min-w-0"
                  >
                    {material.label}
                  </Text>
                  {/* Leader rule. `self-center` keeps it off the baseline
                      alignment it would otherwise stretch. */}
                  <span
                    aria-hidden
                    className="mx-1.5 min-w-2 flex-1 self-center border-b border-dotted border-border-strong"
                  />
                  <Text variant="span" size="xs" weight="bold" className="shrink-0">
                    {`${material.percentage}%`}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* A link rather than a slab: the face is quiet enough that a filled
          button would be the loudest thing on it. Still carries a 32px touch
          target. Only rendered with impact data — without it the control had
          no modal to open and did nothing. */}
      {impact && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={clsx(
            "mt-2 flex min-h-8 w-fit shrink-0 cursor-pointer items-center gap-1.5",
            "text-sm font-bold text-primary transition-colors hover:text-primary-active",
          )}
        >
          {t("impact.viewImpact")}
          <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
        </button>
      )}

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

/**
 * Titles the back face: what it is showing, and which item it belongs to.
 *
 * Flipped, the cover image is gone and the name was the one thing the face
 * never carried. The eyebrow above it is impact copy, so only the two product
 * types get it — a service shows its name over a description, not a saving.
 *
 * The flip control keeps its own absolute box: it is pinned to the face's
 * corner rather than to this header, so it sits in the same place whichever
 * title is under it. `pr-10` reserves that corner, and both lines clamp to one
 * — on the narrow card that leaves them about 100px, so they truncate rather
 * than wrap and push the panel down.
 *
 * This renders at every card size on purpose. Hidden on the narrow card, its
 * height went with it and the savings underneath rode up level with the flip
 * control, reading as though they belonged to it.
 */
export function BackHeader({ itemType, itemName }: CardBackHeaderProps) {
  const { hasBackSide } = useCard();
  const { t } = useTranslation(NAMESPACE);

  const showImpactTitle = itemType === "MARKETPLACE" || itemType === "STORE";

  return (
    <>
      <div
        className={clsx(
          "absolute top-2 right-2 z-20 flex items-center justify-end gap-1.5",
        )}
      >
        {hasBackSide && <FlipButton label={t("actions.flipBack")} />}
      </div>

      {(showImpactTitle || itemName) && (
        <div className="shrink-0 px-2.5 pt-2.5 @min-[12rem]:px-3 @min-[12rem]:pt-3">
          {/* `numberOfLines` guards both lines: a long name ellipses rather
              than wrapping and shifting everything under it. */}
          <div className="border-b border-slate-200 pr-10 pb-1.5">
            {showImpactTitle && (
              <Text
                variant="span"
                size="xs"
                weight="bold"
                color="secondary"
                numberOfLines={1}
                className="block uppercase tracking-[0.9px]"
              >
                {t("impact.saved")}
              </Text>
            )}
            {itemName && (
              <Text
                variant="span"
                size="sm"
                weight="semibold"
                numberOfLines={1}
                className="block"
              >
                {itemName}
              </Text>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function BackBody({ itemType, impact, description }: CardBackBodyProps) {
  if (itemType === "MARKETPLACE" || itemType === "STORE") {
    return <ImpactInformation impact={impact ?? null} />;
  }
  return <Description description={description} />;
}

/**
 * Who is selling it, as a byline with an avatar: the identity the front face
 * shows only on hover. Left-aligned rather than centred — two centred lines
 * cost a card back ~32px it does not have, while the avatar and the two short
 * lines beside it fit the height of one.
 *
 * Falls back to initials, so a seller without a photo still gets the same
 * footprint and the row never reflows between cards.
 */
export function BackFooter({ seller, name, imageUrl, subtitle }: CardBackFooterProps) {
  const sellerName = useDisplayName(seller);
  const sellerRegion = useSellerRegion(seller);
  const sellerImage = useProfileImage(seller);
  const sellerInitials = useInitials(seller);

  const displayName = name ?? sellerName;
  const secondLine = subtitle ?? sellerRegion;
  // `imageUrl` arrives as a raw R2 key from sources that carry a provider
  // rather than a full `Seller` (the services list), so it needs resolving;
  // `useProfileImage` has already done that for the seller path.
  const image = resolveImageUrl(imageUrl) ?? sellerImage;
  const initials = name ? formatInitials(name) : sellerInitials;

  if (!displayName && !secondLine) return null;

  return (
    <div className="w-full shrink-0 px-2.5 pb-2.5 @min-[12rem]:px-3 @min-[12rem]:pb-3">
      <div className="flex items-center gap-2 border-t border-slate-200 pt-2">
        <span
          aria-hidden
          className={clsx(
            "flex size-6.5 shrink-0 items-center justify-center overflow-hidden",
            "rounded-full bg-background-tertiary",
          )}
        >
          {image ? (
            // Decorative: the name sits right beside it.
            <Image
              src={image}
              alt=""
              width={52}
              height={52}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-foreground-secondary">
              {initials}
            </span>
          )}
        </span>

        <span className="flex min-w-0 flex-col">
          {displayName && (
            <Text variant="span" size="xs" weight="semibold" numberOfLines={1}>
              {displayName}
            </Text>
          )}
          {secondLine && (
            <span className="flex min-w-0 items-center gap-1">
              <MapPin
                size={10}
                strokeWidth={2}
                className="shrink-0 text-foreground-tertiary"
                aria-hidden
              />
              <Text
                variant="span"
                size="xs"
                color="secondary"
                numberOfLines={1}
                className="min-w-0"
              >
                {secondLine}
              </Text>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
