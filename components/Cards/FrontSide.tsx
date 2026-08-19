import { useTranslation } from "@/i18n/context";
import { useCard } from "./context/Card.context";
import type {
  BrandAccent,
  CardBodyProps,
  CardFooterProps,
  CardFooterState,
  CardHeaderProps,
  Orientation,
} from "./types/Card.types";
import { NAMESPACE } from "./i18n";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  BadgeCheck,
  Clock,
  Heart,
  ImageOff,
  MapPin,
  Pencil,
  Repeat,
  Star,
  X,
} from "lucide-react";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { resolveImageUrl } from "@/utils/resolveImage";
import { FlipButton } from "./FlipButton";
import { Button, Text } from "../Primitives";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useNavigation } from "@/hooks/useNavigation";
import { QuantityStepper } from "../Patterns";

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
      <div
        aria-hidden
        className="absolute -top-6 -left-8 size-24 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="absolute -right-6 bottom-2 size-16 rounded-full bg-white/10"
      />

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

export function Header({
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
  itemId,
  favoriteSource = "marketplace",
  flipTarget = "impact",
  flipLabel,
  isProduct = true,
  isVerified = false,
  initials,
  accent = "secondary",
}: CardHeaderProps) {
  const { orientation, hasBackSide, isManaged } = useCard();
  const { t } = useTranslation(NAMESPACE);
  const { toggleFavorite } = useToggleFavorite();
  const cover = resolveImageUrl(coverImageString);
  const [imageError, setImageError] = useState<boolean>(false);

  // The heart needs an id to toggle against, and an owner manages a listing
  // rather than favoriting it — in either case, don't render a dead control.
  const showLike = isLikeEnabled && !isManaged && typeof itemId === "number";

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
          own clicks instead of navigating. The flip control keeps the top-right
          corner in every mode; management moves the owner's actions menu to the
          bottom-right instead. */}
      <div className="absolute top-2 right-2 z-20 flex flex-col-reverse items-center gap-1.5">
        {showLike && (
          <button
            type="button"
            aria-label={isLiked ? t("actions.unlike") : t("actions.like")}
            aria-pressed={isLiked}
            onClick={() => toggleFavorite(itemId, isLiked, favoriteSource)}
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
        {/* The name follows what the back face actually shows: an impact panel
            on products, a description on services. `flipLabel` overrides it. */}
        {hasBackSide && (
          <FlipButton
            label={
              flipLabel ??
              (flipTarget === "details"
                ? t("actions.showDetails")
                : t("actions.showImpact"))
            }
          />
        )}
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

export function Body({
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
  duration,
  isPriceFrom = false,
  stock,
  isLowStock = false,
  businessName,
  businessType,
  location,
  description,
}: CardBodyProps) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const { navigateTo } = useNavigation();
  const { isManaged } = useCard();

  // An "offer" only counts when it actually undercuts the list price —
  // otherwise the struck-through original would read as nonsense.
  const onOffer =
    hasOffer &&
    typeof offerPrice === "number" &&
    typeof price === "number" &&
    offerPrice < price;
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
          {brand ? brand : t("meta.noBrand")}
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

      {/* Rating and duration share a row: both are short, and a line each would
          push the price below the fold on a narrow card. */}
      {(hasRating || duration) && (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {hasRating && (
            <span className="flex items-center gap-1">
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
            </span>
          )}
          {/* Free text from the backend ("45 min", "2 h") — rendered verbatim,
              so no unit is appended here. */}
          {duration && (
            <span className="flex items-center gap-1">
              <Clock
                size={11}
                strokeWidth={2}
                aria-hidden
                className="text-foreground-secondary shrink-0"
              />
              <Text variant="span" size="xs" color="secondary" numberOfLines={1}>
                {duration}
              </Text>
            </span>
          )}
        </div>
      )}

      {(isSoldOut || isLowStock) && (
        <Text
          variant="span"
          size="xs"
          weight="bold"
          color={isSoldOut ? "error" : "warning"}
        >
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
            <div className="flex items-baseline gap-1">
              {/* Services quote a starting price, so the amount reads
                  "From $X" rather than as a fixed price. */}
              {isPriceFrom && (
                <Text variant="span" size="xs" color="tertiary" weight="bold">
                  {t("price.from")}
                </Text>
              )}
              <Text variant="span" size="lg" color="primary" weight="bold">
                {formatPrice(price)}
              </Text>
            </div>
          )
        )}
        {/* Proposing a swap for your own listing is meaningless, so the
            exchange affordance comes off alongside the other shopper controls. */}
        {isExchangeable && exchangeRedirectUrl && !isManaged && (
          <ExchangeButton
            interests={interests}
            onPropose={() => navigateTo({ route: exchangeRedirectUrl })}
          />
        )}
      </div>
    </div>
  );
}

export function Footer({
  itemType,
  url,
  onAction,
  state = "default",
  disabled = false,
  loading,
  quantity,
  onQuantityChange,
  maxQuantity,
}: CardFooterProps) {
  const { t } = useTranslation(NAMESPACE);
  const { navigateTo } = useNavigation();
  const { isManaged, onEdit } = useCard();

  // An owner edits their listing rather than buying it — "Add to cart" on your
  // own product is meaningless, so the CTA becomes Edit. With no handler there
  // is nothing to offer, so the row goes away entirely.
  if (isManaged) {
    if (!onEdit) return null;
    return (
      <div className="relative z-20 mt-auto flex items-center gap-2 px-2 pb-2">
        <Button
          variant="primary"
          text={t("cta.EDIT")}
          leftIcon={Pencil}
          fullWidth
          size="sm"
          onPress={onEdit}
        />
      </div>
    );
  }

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
      {/* Once the shopper holds units of this item, the CTA has done its job:
          it becomes the stepper in place, so adjusting the count never costs a
          trip to the cart. Falling back to zero brings the CTA back — that
          swap is what removing the last unit looks like. The checks are inline
          because narrowing through an aliased boolean doesn't hold for
          destructured params. */}
      {typeof quantity === "number" &&
      quantity > 0 &&
      typeof maxQuantity === "number" &&
      onQuantityChange ? (
        <QuantityStepper
          value={quantity}
          max={maxQuantity}
          onChange={onQuantityChange}
          size="sm"
          fullWidth
          label={t("quantity.label")}
          decreaseLabel={t("quantity.decrease")}
          increaseLabel={t("quantity.increase")}
        />
      ) : (
        <Button
          variant={state === "added" ? "success" : "primary"}
          text={LABEL[state]}
          fullWidth
          size="sm"
          disabled={disabled || state === "unavailable"}
          loading={loading}
          onPress={onAction ?? (() => navigateTo({ route: url }))}
        />
      )}
    </div>
  );
}
