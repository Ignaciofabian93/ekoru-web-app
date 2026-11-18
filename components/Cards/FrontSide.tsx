import { useState, type ReactNode } from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  ImageOff,
  MapPin,
  Pencil,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { formatDuration } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/resolveImage";
import { QuantityStepper } from "../Patterns";
import { Button, ProductConditionBadge, ProductInfoBadge, Text } from "../Primitives";
import { useCard } from "./context/Card.context";
import { FlipButton } from "./FlipButton";
import { NAMESPACE } from "./i18n";
import { LikeButton } from "./LikeButton";
import type { CardBodyProps, CardFooterProps, CardHeaderProps } from "./types/Card.types";

/**
 * The photo, inset in the face — a `px-2 pt-2` gutter of card around it — with
 * its own rounded corners rather than bleeding to the card's edge. The inset
 * lives here, not on the face, so the back face keeps its own padding.
 *
 * The badges carry no z-index: the face's stretched link passes over them, so a
 * tap on one still navigates, and the link is transparent so they show through.
 * Only the buttons in the top-right corner lift above it.
 */
export function Header({
  coverImageString,
  imageAlt,
  priority,
  condition,
  hasOffer = false,
  discountPercent,
  isSoldOut = false,
  isLiked = false,
  itemId,
  favoriteSource = "marketplace",
  flipTarget = "impact",
}: CardHeaderProps) {
  const { isManaged } = useCard();
  const { t } = useTranslation(NAMESPACE);
  const { toggleFavorite } = useToggleFavorite();
  const isAuthenticated = useIsAuthenticated();
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(coverImageString);

  const showLike = isAuthenticated && !isManaged && typeof itemId === "number";

  return (
    <div className="shrink-0 px-2 pt-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-background-tertiary">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            priority={priority}
            onError={() => setImageError(true)}
            className={clsx(
              "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
              isSoldOut && "opacity-45 saturate-50",
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageOff size={36} strokeWidth={1.5} className="text-foreground-tertiary" />
          </div>
        )}

        {condition && (
          <div className="absolute bottom-2 left-2">
            <ProductConditionBadge
              label={t(`condition.${condition}`)}
              condition={condition}
            />
          </div>
        )}

        {/* Stacked, so a listing on promotion that also sold out shows both
            without the badges overlapping. */}
        {(hasOffer || isSoldOut) && (
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
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
            {isSoldOut && (
              <ProductInfoBadge type="SOLD_OUT" label={t("badges.soldOut")} />
            )}
          </div>
        )}

        {/* Favorite in the corner, the flip to the back face right under it.
            Without the heart (signed out, or the owner managing the listing)
            the flip moves up into the corner. */}
        <div className="absolute top-2 right-2 z-20 flex flex-col items-center gap-1.5">
          {showLike && (
            <LikeButton
              ariaLabel={isLiked ? t("actions.unlike") : t("actions.like")}
              onClick={() => toggleFavorite(itemId, isLiked, favoriteSource)}
              isLiked={isLiked}
            />
          )}
          <FlipButton
            label={
              flipTarget === "details"
                ? t("actions.showDetails")
                : t("actions.showImpact")
            }
          />
        </div>
      </div>
    </div>
  );
}

type LabelTone = "success" | "warning" | "neutral";

const LABEL_TONE: Record<LabelTone, string> = {
  success: "bg-primary/15 text-primary-dark",
  warning: "bg-amber-50 text-amber-800",
  neutral: "bg-background-tertiary text-foreground-secondary",
};

/**
 * A flat tag under the name — quieter than the photo badges, which have to hold
 * their own over an image. Truncates rather than wrapping, so one long
 * sub-category can't grow its card past its row-mates.
 */
function Label({
  tone,
  icon: Icon,
  children,
}: {
  tone: LabelTone;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex h-6 max-w-full min-w-0 items-center gap-1 rounded-md px-2",
        "text-xs leading-none font-semibold",
        LABEL_TONE[tone],
      )}
    >
      {Icon && <Icon size={12} strokeWidth={2.25} aria-hidden className="shrink-0" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Price and rating, the name, where it is, and a row of labels. */
export function Body({
  name,
  price,
  hasOffer = false,
  offerPrice,
  isPriceFrom = false,
  location,
  averageRating,
  reviewsNumber,
  isExchangeable = false,
  stock,
  isLowStock = false,
  duration,
  category,
}: CardBodyProps) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();

  const onOffer =
    hasOffer &&
    typeof offerPrice === "number" &&
    typeof price === "number" &&
    offerPrice < price;
  // A missing or zero price shows nothing rather than "$0".
  const shownPrice = onOffer ? offerPrice : price;
  const hasRating = typeof averageRating === "number" && averageRating > 0;
  // Sold out is already said twice over the photo (badge and dimmed image), so
  // the label row only warns while there is still something left to buy.
  const isSoldOut = typeof stock === "number" && stock <= 0;
  const showLowStock = isLowStock && !isSoldOut;
  const hasLabels =
    isExchangeable || showLowStock || Boolean(duration) || Boolean(category);

  return (
    <div className="flex flex-1 flex-col gap-1 px-3 pt-2.5 pb-1.5">
      <div className="flex min-h-7 items-center gap-2">
        {shownPrice ? (
          <div className="flex min-w-0 items-baseline gap-1.5">
            {isPriceFrom && !onOffer && (
              <Text variant="span" size="xs" color="tertiary" weight="bold">
                {t("price.from")}
              </Text>
            )}
            <span className="text-lg font-bold text-primary @min-[12rem]:text-xl">
              {formatPrice(shownPrice)}
            </span>
            {onOffer && (
              <Text
                variant="span"
                size="xs"
                color="tertiary"
                className="truncate line-through"
              >
                {formatPrice(price)}
              </Text>
            )}
          </div>
        ) : null}

        {hasRating && (
          <span className="ml-auto flex shrink-0 items-center gap-0.5">
            {/* `Text` forwards no ARIA props, so the spoken form is its own
                node and the star and bare figure are hidden from it. */}
            <span className="sr-only">
              {t("rating.label", { value: averageRating.toFixed(1) })}
            </span>
            <span aria-hidden className="flex items-center gap-0.5">
              <Star
                size={12}
                strokeWidth={1.5}
                className="fill-amber-400 text-amber-400"
              />
              <Text variant="span" size="xs" weight="bold">
                {averageRating.toFixed(1)}
              </Text>
            </span>
            {typeof reviewsNumber === "number" && reviewsNumber > 0 && (
              <Text
                variant="span"
                size="xs"
                color="tertiary"
                className="hidden @min-[12rem]:inline"
              >
                {t("rating.reviews", { value: String(reviewsNumber) })}
              </Text>
            )}
          </span>
        )}
      </div>

      {/* Two lines reserved whether the name needs them or not, so the
          location and labels start at the same height across a row. */}
      <Text
        variant="p"
        size="sm"
        weight="semibold"
        leading="normal"
        numberOfLines={2}
        className="min-h-[2lh] @min-[12rem]:text-base"
      >
        {name}
      </Text>

      {location && (
        <div className="flex items-center gap-1 text-foreground-secondary">
          <MapPin size={13} strokeWidth={2} aria-hidden className="shrink-0" />
          <Text variant="span" size="xs" color="secondary" numberOfLines={1}>
            {location}
          </Text>
        </div>
      )}

      {hasLabels && (
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          {isExchangeable && <Label tone="success">{t("badges.acceptsExchange")}</Label>}
          {showLowStock && (
            <Label tone="warning">
              {t("stock.lowStock", { value: String(stock ?? 0) })}
            </Label>
          )}
          {duration ? (
            <Label tone="neutral" icon={Clock}>
              {formatDuration(duration)}
            </Label>
          ) : null}
          {category && <Label tone="neutral">{category}</Label>}
        </div>
      )}
    </div>
  );
}

/**
 * The front face's last row: a rule, then the way in. In order of precedence
 * that is the owner's Edit button, the caller's action (add to cart, behind
 * `FEATURES.cardAddToCart`), or a "view details" link.
 *
 * That link is drawn, not wired. The whole face is already one link (the
 * stretched anchor in `FrontSide`), so a second one here would be a duplicate
 * tab stop with the same destination. The row stays *under* that anchor and a
 * click on the text lands on it; only a real control lifts itself above.
 */
export function Footer({
  itemType,
  onAction,
  isSoldOut = false,
  quantity = 0,
  onQuantityChange,
  maxQuantity,
}: CardFooterProps) {
  const { t } = useTranslation(NAMESPACE);
  const { isManaged, onEdit } = useCard();

  // An owner card without an Edit action has no way in to offer.
  if (isManaged && !onEdit) return null;

  let control: ReactNode = null;
  if (isManaged) {
    control = (
      <Button
        variant="primary"
        text={t("cta.EDIT")}
        leftIcon={Pencil}
        fullWidth
        size="sm"
        onPress={onEdit}
      />
    );
  } else if (onAction && quantity > 0 && onQuantityChange && maxQuantity !== undefined) {
    control = (
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
    );
  } else if (onAction) {
    control = (
      <Button
        variant="primary"
        text={isSoldOut ? t("stock.outOfStock") : t(`cta.${itemType}`)}
        fullWidth
        size="sm"
        disabled={isSoldOut}
        onPress={onAction}
      />
    );
  }

  return (
    <div className="mx-3 mt-auto flex min-h-10 items-center border-t border-slate-200/80 py-1">
      {control ? (
        // Lifted over the face's stretched link so it takes its own clicks.
        <div className="relative z-20 min-w-0 flex-1">{control}</div>
      ) : (
        <span
          aria-hidden
          className={clsx(
            "ml-auto inline-flex min-w-0 items-center gap-1 text-sm font-bold text-primary-active",
          )}
        >
          <span className="truncate">{t("cta.BROWSE")}</span>
          <ArrowRight size={15} strokeWidth={2.25} className="shrink-0" />
        </span>
      )}
    </div>
  );
}
