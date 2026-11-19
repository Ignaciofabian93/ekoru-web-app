"use client";
import clsx from "clsx";
import { ArrowRight, Clock, ImageOff, MapPin, Star, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ProductConditionBadge, ProductInfoBadge } from "@/components/Primitives";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";
import { useIsAuthenticated } from "@/store/useAuthStore";
import type { ProductCondition } from "@/types/enums";
import { formatDuration } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/resolveImage";
import { FlipButton, LikeButton } from "./CardButtons";
import { NAMESPACE } from "./i18n";
import { frontStyles } from "./styles";

export type CardType = "marketplace" | "store" | "service";

export interface FrontSideProps {
  cardId: string;
  cardType: CardType;
  id: number | string;
  href: string;
  name: string;
  image?: string | null;
  price?: number | null;
  /** Only when the item is on offer below `price`. */
  offerPrice?: number;
  discount?: number;
  rating?: number | null;
  reviews?: number | null;
  location?: string | null;
  condition?: ProductCondition | null;
  isExchangeable?: boolean | null;
  isLiked?: boolean | null;
  isSoldOut?: boolean;
  /** Units left, only while stock is low. */
  lowStock?: number;
  duration?: number | null;
  category?: string | null;
  /** First card or two of a page: loads the image eagerly at high priority. */
  priority?: boolean;
  /** Owner view: the card's actions menu replaces the like button. */
  isManaged?: boolean;
}

function Media({
  cardId,
  cardType,
  id,
  image,
  condition,
  discount,
  isSoldOut,
  isLiked,
  priority,
  isManaged,
}: FrontSideProps) {
  const { t } = useTranslation(NAMESPACE);
  const { toggleFavorite } = useToggleFavorite();
  const isAuthenticated = useIsAuthenticated();
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(image ?? "");
  const liked = Boolean(isLiked);

  return (
    <div className={frontStyles.mediaWrap}>
      <div className={frontStyles.media}>
        {cover && !imageError ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            onError={() => setImageError(true)}
            className={clsx(frontStyles.image, isSoldOut && frontStyles.imageSoldOut)}
          />
        ) : (
          <div className={frontStyles.imageFallback}>
            <ImageOff size={36} strokeWidth={1.5} aria-hidden />
          </div>
        )}

        {condition && (
          <div className={frontStyles.condition}>
            <ProductConditionBadge label={t(`condition.${condition}`)} condition={condition} />
          </div>
        )}

        {(discount || isSoldOut) && (
          <div className={frontStyles.badges}>
            {discount ? (
              <ProductInfoBadge
                type="OFFER"
                label={t("badges.discount", { value: String(discount) })}
              />
            ) : null}
            {isSoldOut && <ProductInfoBadge type="SOLD_OUT" label={t("badges.soldOut")} />}
          </div>
        )}

        <div className={frontStyles.buttons}>
          {isAuthenticated && !isManaged && (
            <LikeButton
              isLiked={liked}
              label={t("actions.like")}
              onClick={() => toggleFavorite(Number(id), liked, cardType)}
            />
          )}
          <FlipButton
            cardId={cardId}
            label={t(cardType === "service" ? "actions.showDetails" : "actions.showImpact")}
          />
        </div>
      </div>
    </div>
  );
}

function Label({
  tone,
  icon: Icon,
  children,
}: {
  tone: keyof typeof frontStyles.labelTone;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className={clsx(frontStyles.label, frontStyles.labelTone[tone])}>
      {Icon && <Icon size={12} strokeWidth={2.25} aria-hidden className="shrink-0" />}
      <span className={frontStyles.labelText}>{children}</span>
    </span>
  );
}

function Body({
  cardType,
  href,
  name,
  price,
  offerPrice,
  rating,
  reviews,
  location,
  isExchangeable,
  lowStock,
  duration,
  category,
}: FrontSideProps) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const shownPrice = offerPrice ?? price;
  const hasLabels = isExchangeable || Boolean(lowStock) || Boolean(duration) || Boolean(category);

  return (
    <div className={frontStyles.body}>
      <div className={frontStyles.priceRow}>
        {shownPrice ? (
          <div className={frontStyles.price}>
            {cardType === "service" && (
              <span className={frontStyles.priceFrom}>{t("price.from")}</span>
            )}
            <span className={frontStyles.priceValue}>{formatPrice(shownPrice)}</span>
            {offerPrice !== undefined && price ? (
              <span className={frontStyles.priceWas}>{formatPrice(price)}</span>
            ) : null}
          </div>
        ) : null}

        {rating ? (
          <span className={frontStyles.rating}>
            <span className="sr-only">{t("rating.label", { value: rating.toFixed(1) })}</span>
            <span aria-hidden className={frontStyles.ratingValue}>
              <Star size={12} strokeWidth={1.5} className={frontStyles.ratingStar} />
              {rating.toFixed(1)}
            </span>
            {reviews ? (
              <span aria-hidden className={frontStyles.reviews}>
                {t("rating.reviews", { value: String(reviews) })}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>

      <h3 className={frontStyles.name}>
        <Link href={href} className={frontStyles.link}>
          {name}
        </Link>
      </h3>

      {location && (
        <div className={frontStyles.location}>
          <MapPin size={13} strokeWidth={2} aria-hidden className="shrink-0" />
          <span className={frontStyles.locationText}>{location}</span>
        </div>
      )}

      {hasLabels && (
        <div className={frontStyles.labels}>
          {isExchangeable && <Label tone="success">{t("badges.acceptsExchange")}</Label>}
          {lowStock ? (
            <Label tone="warning">{t("stock.lowStock", { value: String(lowStock) })}</Label>
          ) : null}
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

function Footer() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className={frontStyles.footer}>
      <span aria-hidden className={frontStyles.browse}>
        <span className={frontStyles.browseText}>{t("cta.BROWSE")}</span>
        <ArrowRight size={15} strokeWidth={2.25} className="shrink-0" />
      </span>
    </div>
  );
}

export default function FrontSide(props: FrontSideProps) {
  return (
    <>
      <Media {...props} />
      <Body {...props} />
      <Footer />
    </>
  );
}
