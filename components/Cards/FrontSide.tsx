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
import { BadgeCheck, Clock, ImageOff, MapPin, Pencil, Repeat, Star } from "lucide-react";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { resolveImageUrl } from "@/utils/resolveImage";
import { FlipButton } from "./FlipButton";
import { Button, ProductConditionBadge, ProductInfoBadge, Text } from "../Primitives";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useNavigation } from "@/hooks/useNavigation";
import { QuantityStepper } from "../Patterns";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { LikeButton } from "./LikeButton";

const HEADER_CLASS: Record<Orientation, string> = {
  vertical: "w-full aspect-4/3",
  horizontal: "h-full basis-2/5",
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

function ProviderPanel({
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
  const isAuthenticated = useIsAuthenticated();

  const showLike = isLikeEnabled && !isManaged && typeof itemId === "number";

  if (!isProduct) {
    return (
      <ProviderPanel
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
          to the stretched link beneath, so tapping over one still navigates.
          `z-20` keeps them painted above that link. Position lives here rather
          than in the badge — a badge that placed itself couldn't be stacked. */}
      {condition && (
        <div className="pointer-events-none absolute bottom-2 left-2 z-20">
          <ProductConditionBadge
            label={t(`condition.${condition}`)}
            condition={condition}
          />
        </div>
      )}

      {/* Stacked, so a listing can carry more than one status at once (an
          exchangeable item on promotion, say) without the badges overlapping. */}
      {(isExchangeable || hasOffer || isSoldOut) && (
        <div className="pointer-events-none absolute top-2 left-2 z-20 flex flex-col items-start gap-1">
          {hasOffer && (
            <ProductInfoBadge
              type="OFFER"
              label={
                discountPercent
                  ? t("badges.discount", { value: String(Math.round(discountPercent)) })
                  : t("badges.offer")
              }
            />
          )}
          {isSoldOut && <ProductInfoBadge type="SOLD_OUT" label={t("badges.soldOut")} />}
          {isExchangeable && (
            <ProductInfoBadge
              type="EXCHANGEABLE"
              label={t("badges.exchangeable")}
              icon={Repeat}
            />
          )}
        </div>
      )}

      <div className="absolute top-2 right-2 z-20 flex flex-col-reverse items-center gap-1.5">
        {showLike && isAuthenticated && (
          <LikeButton
            ariaLabel={isLiked ? t("actions.unlike") : t("actions.like")}
            onClick={() => toggleFavorite(itemId, isLiked, favoriteSource)}
            isLiked={isLiked}
          />
        )}
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

export function Body({
  isProduct = true,
  brand,
  name,
  price,
  hasOffer = false,
  offerPrice,
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

  const onOffer =
    hasOffer &&
    typeof offerPrice === "number" &&
    typeof price === "number" &&
    offerPrice < price;
  const hasRating = typeof averageRating === "number" && averageRating > 0;
  const isSoldOut = typeof stock === "number" && stock <= 0;

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

  const LABEL: Record<CardFooterState, string> = {
    default: t(`cta.${itemType}`),
    added: t("actions.added"),
    unavailable: t("stock.outOfStock"),
  };

  return (
    <div className="relative z-20 mt-auto flex items-center gap-2 px-2 pb-2">
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
