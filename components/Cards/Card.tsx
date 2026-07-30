"use client";
import { resolveImageUrl } from "@/utils/resolveImage";
import clsx from "clsx";
import {
  BadgeCheck,
  ChevronRight,
  Droplets,
  Heart,
  ImageOff,
  Info,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Repeat,
  RotateCw,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Text } from "@/components/Primitives/Text";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import Link from "next/link";
import type {
  BrandAccent,
  CardBackBodyProps,
  CardBackFooterProps,
  CardBackHeaderProps,
  CardBackSideProps,
  CardBodyProps,
  CardFlipButtonProps,
  CardFooterProps,
  CardFooterState,
  CardFrontSideProps,
  CardHeaderProps,
  CardProps,
  Orientation,
} from "./types/Card.types";
import { CardProvider, useCard } from "./context/Card.context";
import { Button } from "../Primitives/Button";
import {
  useDisplayName,
  useInitials,
  useProfileImage,
  useSellerRegion,
} from "@/hooks/useSellerData";
import type { EnvironmentalImpact } from "@/types/product";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";
import ImpactModal from "./ImpactModal";
import { useNavigation } from "@/hooks/useNavigation";

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
                className="hidden sm:flex truncate"
              >
                {t("impact.co2")}
              </Text>
              <Text
                variant="span"
                size="sm"
                weight="bold"
                color="secondary"
                className="flex sm:hidden truncate"
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

function Description() {
  return (
    <div>
      <p>Description</p>
    </div>
  );
}

const STEP_BUTTON =
  "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground";

/**
 * Picks how many units of a store product to add, from 0 up to the available
 * stock. Clamping lives here so a caller can't drive the value out of range.
 *
 * `relative z-20` lifts it above the front face's stretched link, so the
 * buttons take their own clicks instead of navigating.
 */
function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const set = (next: number) => onChange(Math.max(0, Math.min(max, next)));

  return (
    <div
      role="group"
      aria-label={t("quantity.label")}
      className="relative z-20 flex items-center gap-1.5"
    >
      <button
        type="button"
        aria-label={t("quantity.decrease")}
        disabled={value <= 0}
        onClick={() => set(value - 1)}
        className={STEP_BUTTON}
      >
        <Minus size={13} strokeWidth={2.5} aria-hidden />
      </button>
      {/* aria-live so the new count is announced after a press — the buttons
          keep focus, so nothing else would surface the change. */}
      <span
        aria-live="polite"
        className="min-w-5 text-center font-sans text-sm font-bold text-foreground tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={t("quantity.increase")}
        disabled={value >= max}
        onClick={() => set(value + 1)}
        className={STEP_BUTTON}
      >
        <Plus size={13} strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  );
}

// A small round control that toggles the flip. Reused by the front (Header)
// and back faces so both sides flip the same way.
function FlipButton({ label, className }: CardFlipButtonProps) {
  const { flip } = useCard();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => flip()}
      className={clsx(
        "bg-primary text-on-primary hover:bg-primary-active flex size-8 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors",
        className,
      )}
    >
      <RotateCw size={14} strokeWidth={2.5} />
    </button>
  );
}

function BackHeader({ itemName }: CardBackHeaderProps) {
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
        className="line-clamp-1 truncate"
      >
        {itemName}
      </Text>
      {/* `itemName` is dynamic (a prop); the flip control's label is static
          card copy, so it comes from the dictionary. */}
      {hasBackSide && <FlipButton label={t("actions.flipBack")} />}
    </div>
  );
}

function BackBody({ itemType, impact }: CardBackBodyProps) {
  if (itemType === "MARKETPLACE" || itemType === "STORE") {
    return <ImpactInformation impact={impact ?? null} />;
  }
  return <Description />;
}

function BackFooter({ seller }: CardBackFooterProps) {
  const displayName = useDisplayName(seller);
  const sellerRegion = useSellerRegion(seller);
  const profileImage = useProfileImage(seller);
  const initials = useInitials(seller);
  return (
    <div className="w-full flex px-2 py-2 items-center justify-center sm:justify-start gap-1 border-t border-slate-200">
      <div className="rounded-full h-10 w-10 overflow-hidden hidden sm:flex">
        {profileImage ? (
          <Image
            src={profileImage}
            alt=""
            width={100}
            height={100}
            className="w-full h-full"
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex flex-col">
        {seller && (
          <Text variant="span" weight="semibold" size="sm" className="line-clamp-1">
            {displayName}
          </Text>
        )}
        <Text
          variant="small"
          weight="bold"
          size="xs"
          align="left"
          className="line-clamp-1"
        >
          {sellerRegion}
        </Text>
      </div>
    </div>
  );
}

const HEADER_CLASS: Record<Orientation, string> = {
  // Vertical: the image owns a definite height via aspect ratio, so it never
  // depends on a percentage-height chain resolving — that chain silently
  // collapses to 0 the moment an ancestor lacks an explicit height.
  // Horizontal: the card has a fixed height, so `h-full` + `basis` is safe.
  vertical: "w-full aspect-4/3",
  horizontal: "h-full basis-2/5",
};

const CONDITION_STYLES: Record<string, string> = {
  NEW: "bg-primary-light-bg text-primary",
  LIKE_NEW: "bg-primary-light-bg text-primary",
  OPEN_BOX: "bg-primary-light-bg text-primary",
  REFURBISHED: "bg-primary-light-bg text-primary",
  GOOD: "bg-primary-light-bg text-primary",
  FAIR: "bg-amber-50 text-amber-700",
  POOR: "bg-red-50 text-red-600",
  FOR_PARTS: "bg-red-50 text-red-600",
};

const ACCENT_PANEL: Record<BrandAccent, string> = {
  primary: "bg-linear-to-br from-primary-dark to-primary",
  secondary: "bg-linear-to-br from-secondary-dark to-secondary",
  amber: "bg-linear-to-br from-amber-800 to-amber-500",
};

const ACCENT_TEXT: Record<BrandAccent, string> = {
  primary: "text-primary-dark",
  secondary: "text-secondary-dark",
  amber: "text-amber-700",
};

/**
 * The seller-card counterpart to a product photo: a tinted, softly patterned
 * panel with the logo on a light tile, so brand marks of any shape or color
 * stay legible instead of being cropped like a photo.
 */
function BrandPanel({
  logo,
  imageAlt,
  initials,
  accent,
  isVerified,
  priority,
}: {
  logo?: string;
  imageAlt: string;
  initials?: string;
  accent: BrandAccent;
  isVerified: boolean;
  priority?: boolean;
}) {
  const { orientation } = useCard();
  const { t } = useTranslation(NAMESPACE);
  const [logoError, setLogoError] = useState<boolean>(false);

  return (
    <figure
      className={clsx(
        "relative m-0 flex shrink-0 flex-col items-center justify-between overflow-hidden",
        HEADER_CLASS[orientation],
        ACCENT_PANEL[accent],
      )}
    >
      {/* Soft depth, not content — kept out of the a11y tree. */}
      <div aria-hidden className="absolute -top-6 -left-8 size-24 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -right-6 bottom-2 size-16 rounded-full bg-white/10" />

      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-4 pt-4 pb-8">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
          {logo && !logoError ? (
            <Image
              src={logo}
              alt={imageAlt}
              width={80}
              height={80}
              priority={priority}
              onError={() => setLogoError(true)}
              className="size-full object-cover"
            />
          ) : (
            <span className={clsx("text-xl font-bold", ACCENT_TEXT[accent])}>
              {initials}
            </span>
          )}
        </div>
      </div>

      {isVerified && (
        <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center">
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold shadow-md",
              ACCENT_TEXT[accent],
            )}
          >
            <BadgeCheck size={13} strokeWidth={2.5} aria-hidden />
            {t("badges.verified")}
          </span>
        </div>
      )}
    </figure>
  );
}

function Header({
  coverImageString,
  imageAlt,
  priority,
  condition,
  isExchangeable = false,
  hasOffer = false,
  discountPercent,
  isSoldOut = false,
  isLikeEnabled = true,
  isLiked = false,
  flipLabel,
  isProduct = true,
  isVerified = false,
  initials,
  accent = "secondary",
}: CardHeaderProps) {
  const { orientation, hasBackSide } = useCard();
  const { t } = useTranslation(NAMESPACE);
  const cover = resolveImageUrl(coverImageString);
  const [imageError, setImageError] = useState<boolean>(false);

  // Seller cards show a brand panel instead of a photo, and carry none of the
  // product chrome (condition, offer, favorite, flip).
  if (!isProduct) {
    return (
      <BrandPanel
        logo={cover}
        imageAlt={imageAlt}
        initials={initials}
        accent={accent}
        isVerified={isVerified}
        priority={priority}
      />
    );
  }

  return (
    // `relative` is required: <Image fill> is absolutely positioned and would
    // otherwise size itself against the nearest positioned ancestor further up.
    <div
      className={clsx(
        "relative shrink-0 overflow-hidden",
        HEADER_CLASS[orientation],
        "bg-slate-600",
      )}
    >
      {cover && !imageError ? (
        <Image
          src={cover}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          onError={() => setImageError(true)}
          className={clsx(
            "h-full w-full object-cover transition-transform duration-300",
            // Sold-out stock is still browsable, just visually de-emphasised.
            isSoldOut && "opacity-45 saturate-50",
          )}
          loading="eager"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff size={36} strokeWidth={1.5} className="text-foreground-muted" />
        </div>
      )}
      {/* Badges are decorative: `pointer-events-none` lets clicks fall through
          to the stretched link beneath them, so tapping over a badge still
          navigates. `z-20` keeps them painted above that link. */}
      {/* Condition label is resolved from the enum value, not passed in — the
          card owns its own copy: t(`condition.NEW`) etc. */}
      {condition && (
        <span
          className={clsx(
            "pointer-events-none absolute bottom-2 left-2 z-20 rounded-md px-2 py-0.5 text-xs font-medium",
            CONDITION_STYLES[condition] ?? "bg-white/90 text-foreground",
          )}
        >
          {t(`condition.${condition}`)}
        </span>
      )}

      {/* Stacked so a product can carry more than one status at once (an
          exchangeable item on promotion, say) without the badges overlapping. */}
      {(isExchangeable || hasOffer || isSoldOut) && (
        <div className="pointer-events-none absolute top-2 left-2 z-20 flex flex-col items-start gap-1">
          {hasOffer && (
            <span className="inline-flex items-center rounded-md bg-danger px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              {discountPercent
                ? t("badges.discount", { value: String(Math.round(discountPercent)) })
                : t("badges.offer")}
            </span>
          )}
          {isSoldOut && (
            <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              {t("badges.soldOut")}
            </span>
          )}
          {isExchangeable && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-700 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
              <Repeat size={11} strokeWidth={2.5} />
              {t("badges.exchangeable")}
            </span>
          )}
        </div>
      )}

      {/* Controls sit above the stretched link (z-20 > z-10) so they take their
          own clicks instead of navigating. */}
      <div className="absolute top-2 right-2 z-20 flex flex-col-reverse items-center gap-1.5">
        {isLikeEnabled && (
          <button
            type="button"
            aria-label={isLiked ? t("actions.unlike") : t("actions.like")}
            aria-pressed={isLiked}
            onClick={() => {
              // toggleFavorite(product.id, liked);
            }}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow-sm transition-colors hover:bg-white"
          >
            <Heart
              size={15}
              strokeWidth={2}
              className={
                isLiked ? "fill-red-500 text-red-500" : "text-foreground-secondary"
              }
            />
          </button>
        )}
        {/* `flipLabel` lets a card override the default per type (services flip
            to a description, not an impact panel); otherwise the dictionary
            default is used. */}
        {hasBackSide && <FlipButton label={flipLabel ?? t("actions.showImpact")} />}
      </div>
    </div>
  );
}

// The exchange trigger + its in-card panel, self-contained so it manages its
// own open state. Built as a plain button (not the shared IconButton, which
// currently drops onClick/aria-label). The panel covers the front face via
// `absolute inset-0` — an in-card popover, not a portal — so it stays clipped
// to the card's rounded bounds and never overflows the grid cell.
function ExchangeButton({
  interests = [],
  onPropose,
}: {
  interests?: string[];
  onPropose?: () => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* z-20 lifts the trigger above the stretched link (z-10) so it opens the
          panel instead of navigating. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("exchange.trigger")}
        aria-haspopup="dialog"
        className="bg-primary text-on-primary hover:bg-primary-active relative z-20 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors"
      >
        <Repeat size={14} strokeWidth={2.5} />
      </button>

      {/* Panel: above the link (z-10) and the header controls (z-20). Rendered
          inside Body, which is static, so `inset-0` resolves to the front face. */}
      {open && (
        <div
          className={clsx(
            "absolute inset-0 mx-auto my-auto z-30 flex flex-col",
            "border border-slate-200 bg-white h-10/12 w-10/12",
            "rounded-md shadow-lg",
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
            <Text variant="label" weight="bold" size="sm" numberOfLines={1}>
              {t("exchange.title")}
            </Text>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("exchange.close")}
              className="text-foreground-secondary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            {interests.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {interests.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Repeat
                      size={12}
                      strokeWidth={2.5}
                      className="text-primary shrink-0"
                    />
                    <Text variant="span" size="sm" numberOfLines={1}>
                      {item}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Text variant="span" size="sm" color="secondary">
                {t("exchange.anyOffer")}
              </Text>
            )}
          </div>

          <div className="p-2">
            {/* CTA owns no logic itself — it closes the panel and delegates to
                the prop, keeping the exchange flow outside the card. */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onPropose?.();
              }}
              className={clsx(
                "flex w-full cursor-pointer items-center justify-center gap-1",
                "bg-primary rounded-sm px-2 py-2 transition-all hover:brightness-110",
              )}
            >
              <Text variant="label" size="sm" color="white">
                {t("exchange.propose")}
              </Text>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Body({
  isProduct = true,
  brand,
  name,
  price,
  hasOffer = false,
  offerPrice,
  isExchangeable = false,
  interests,
  exchangeRedirectUrl,
  averageRating,
  reviewsNumber,
  stock,
  isLowStock = false,
  quantity,
  onQuantityChange,
  maxQuantity,
  businessName,
  businessType,
  location,
  description,
}: CardBodyProps) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const { navigateTo } = useNavigation();

  // An "offer" only counts when it actually undercuts the list price —
  // otherwise the struck-through original would read as nonsense.
  const onOffer =
    hasOffer && typeof offerPrice === "number" && typeof price === "number" && offerPrice < price;
  const hasRating = typeof averageRating === "number" && averageRating > 0;
  const isSoldOut = typeof stock === "number" && stock <= 0;


  // Seller cards describe a business, not a listing: no brand, price or
  // exchange row, but a location and a blurb instead.
  if (!isProduct) {
    return (
      <div className="flex flex-1 flex-col justify-start gap-1 px-3.5 py-2.5">
        <Text variant="p" size="base" weight="bold" color="default" numberOfLines={1}>
          {businessName ?? t("meta.noBusinessName")}
        </Text>
        <Text
          variant="span"
          size="xs"
          weight="bold"
          color="secondary"
          className="uppercase"
        >
          {businessType ? t(`businessType.${businessType}`) : t("meta.noBusinessType")}
        </Text>

        {location && (
          <div className="mt-0.5 flex items-center gap-1 text-foreground-secondary">
            <MapPin size={13} strokeWidth={2} aria-hidden className="shrink-0" />
            <Text variant="span" size="xs" color="secondary" numberOfLines={1}>
              {location}
            </Text>
          </div>
        )}

        {description && (
          <Text
            variant="p"
            size="sm"
            color="secondary"
            className="mt-1"
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-start gap-2 px-3 py-2">
      <div>
        <Text
          variant="span"
          size="xs"
          weight="bold"
          color="secondary"
          className="uppercase"
        >
          {brand ?? t("meta.noBrand")}
        </Text>
        <Text
          variant="span"
          size="sm"
          weight="normal"
          color="default"
          className="line-clamp-1"
        >
          {name}
        </Text>
      </div>

      {hasRating && (
        <div className="flex items-center gap-1">
          <Star
            size={12}
            strokeWidth={1.5}
            aria-hidden
            className="shrink-0 fill-amber-400 text-amber-400"
          />
          <Text
            variant="span"
            size="xs"
            weight="bold"
            color="default"
            aria-label={t("rating.label", { value: averageRating.toFixed(1) })}
          >
            {averageRating.toFixed(1)}
          </Text>
          {typeof reviewsNumber === "number" && reviewsNumber > 0 && (
            <Text variant="span" size="xs" color="tertiary">
              {t("rating.reviews", { value: String(reviewsNumber) })}
            </Text>
          )}
        </div>
      )}

      {(isSoldOut || isLowStock) && (
        <Text variant="span" size="xs" weight="bold" color={isSoldOut ? "error" : "warning"}>
          {isSoldOut
            ? t("stock.outOfStock")
            : t("stock.lowStock", { value: String(stock ?? 0) })}
        </Text>
      )}

      <div className="flex h-8 w-full items-center justify-between gap-2">
        {onOffer ? (
          <div className="flex items-baseline gap-1.5">
            <Text variant="span" size="lg" color="primary" weight="bold">
              {formatPrice(offerPrice)}
            </Text>
            <Text variant="span" size="xs" color="tertiary" className="line-through">
              {formatPrice(price)}
            </Text>
          </div>
        ) : (
          price && (
            <Text variant="span" size="lg" color="primary" weight="bold">
              {formatPrice(price)}
            </Text>
          )
        )}
        {isExchangeable && exchangeRedirectUrl && (
          <ExchangeButton
            interests={interests}
            onPropose={() => navigateTo({ route: exchangeRedirectUrl })}
          />
        )}
      </div>

      {/* Its own row: the card is narrow, so the stepper would crowd the price
          if it shared that line. Hidden with no stock — the CTA already carries
          the sold-out message. The checks are inline because narrowing through
          an aliased boolean doesn't hold for destructured params. */}
      {typeof quantity === "number" &&
        typeof maxQuantity === "number" &&
        maxQuantity > 0 &&
        onQuantityChange && (
          <div className="flex w-full items-center justify-center">
            <QuantityStepper
              value={quantity}
              max={maxQuantity}
              onChange={onQuantityChange}
            />
          </div>
        )}
    </div>
  );
}

function Footer({
  itemType,
  url,
  onAction,
  state = "default",
  disabled = false,
  loading,
}: CardFooterProps) {
  const { t } = useTranslation(NAMESPACE);
  const { navigateTo } = useNavigation();

  // The CTA label is chosen by item type — t(`cta.MARKETPLACE`) / `cta.STORE` /
  // etc. — unless a state overrides it.
  const LABEL: Record<CardFooterState, string> = {
    default: t(`cta.${itemType}`),
    added: t("actions.added"),
    unavailable: t("stock.outOfStock"),
  };

  // `relative z-20` lifts the footer's controls above the stretched link so
  // they receive their own clicks rather than triggering navigation.
  return (
    <div className="relative z-20 mt-auto flex items-center gap-2 px-2 pb-2">
      <Button
        variant={state === "added" ? "success" : "primary"}
        text={LABEL[state]}
        fullWidth
        size="sm"
        disabled={disabled || state === "unavailable"}
        loading={loading}
        onPress={onAction ?? (() => navigateTo({ route: url }))}
      />
    </div>
  );
}

// Lay each face out along the axis the card is sized on. Horizontal faces fill
// the fixed-height card (`h-full`); vertical faces take their height from
// content (image aspect ratio + body), so nothing needs an explicit height.
const FACE_CLASS: Record<Orientation, string> = {
  vertical: "flex-col",
  horizontal: "h-full flex-row",
};

// The front sits in normal flow and therefore defines the card's height; the
// back is absolutely positioned over it, so it always matches the front's size
// without the outer card needing a definite height. The back is pre-rotated
// 180° so it lands facing the viewer once the wrapper turns. `backface-hidden`
// keeps whichever face is turned away from showing through; `inert` (React 19)
// drops the hidden face out of tab order and the a11y tree — a strict superset
// of the old `pointer-events-none`.
function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  const { orientation, isFlipped } = useCard();
  const active = back ? isFlipped : !isFlipped;
  return (
    <div
      inert={!active}
      className={clsx(
        "flex overflow-hidden justify-between rounded-lg border border-slate-200 bg-white backface-hidden",
        "shadow-md shadow-slate-800/40 hover:shadow-lg",
        FACE_CLASS[orientation],
        back ? "absolute inset-0 rotate-y-180" : "relative",
      )}
    >
      {children}
    </div>
  );
}

function FrontSide({ children }: CardFrontSideProps) {
  const { href, ariaLabel } = useCard();
  return (
    <Face>
      {/* Stretched link: a transparent anchor covering the whole front face, so
          tapping the image or text navigates. Action buttons sit above it
          (z-20) and receive their own clicks directly — the click never reaches
          this anchor, so no preventDefault/stopPropagation is needed and no
          <button> is nested inside an <a>. */}
      <Link href={href} aria-label={ariaLabel} className="absolute inset-0 z-10" />
      {children}
    </Face>
  );
}

function BackSide({ children }: CardBackSideProps) {
  return <Face back>{children}</Face>;
}

const ORIENTATION_SIZE: Record<Orientation, string> = {
  // Vertical height is content-driven (image + body); horizontal is a fixed
  // banner height that the faces fill via `h-full`.
  vertical: "min-w-0",
  horizontal: "min-w-80 h-[170px]",
};

const WRAPPER_SIZE: Record<Orientation, string> = {
  vertical: "w-full",
  horizontal: "h-full",
};

// Reads flip state from context and renders the two stacked layers. Split out
// from Card so it lives *inside* the provider — it needs `isFlipped`, which the
// provider owns.
function CardScene({ children }: { children: React.ReactNode }) {
  const { orientation, isFlipped } = useCard();

  // Stationary layer owns size + the perspective that gives the flip its depth
  // (`perspective-*` must sit on an ancestor of the rotating element, never on
  // the element that rotates). It's a plain <div>, NOT a link — the navigable
  // target is the stretched <Link> inside the front face, so action buttons are
  // never nested inside an anchor.
  return (
    <div
      className={clsx(
        "relative w-full",
        ORIENTATION_SIZE[orientation],
        "rounded-lg",
        "cursor-pointer transition-transform duration-200 ease-in-out hover:scale-[1.02]",
        "perspective-distant",
      )}
    >
      {/* Rotating layer: turns 180° on flip; both faces live inside it. Its
          height comes from the in-flow front face (vertical) or from the
          fixed-height card it fills (horizontal). */}
      <div
        className={clsx(
          "relative w-full transition-transform duration-500 ease-out transform-3d",
          WRAPPER_SIZE[orientation],
          isFlipped && "rotate-y-180",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Card({
  children,
  orientation = "vertical",
  hasBackSide = true,
  href,
  ariaLabel,
}: CardProps) {
  return (
    <CardProvider
      orientation={orientation}
      hasBackSide={hasBackSide}
      href={href}
      ariaLabel={ariaLabel}
    >
      <CardScene>{children}</CardScene>
    </CardProvider>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;
Card.FrontSide = FrontSide;
Card.BackSide = BackSide;
Card.BackHeader = BackHeader;
Card.BackBody = BackBody;
Card.BackFooter = BackFooter;
