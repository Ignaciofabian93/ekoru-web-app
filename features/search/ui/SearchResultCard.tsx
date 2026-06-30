"use client";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { formatPrice } from "@/data/products";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";

import { NAMESPACE } from "../i18n";
import type { SearchResultItem } from "../types";

/**
 * Destination for a hit. Marketplace + store products open the product detail;
 * services fall back to the services landing until a per-service route exists.
 */
function resultHref(item: SearchResultItem, lang: string): string {
  switch (item.type) {
    case "SERVICE":
      return `/${lang}/services`;
    case "PRODUCT":
    case "STORE_PRODUCT":
    default:
      return `/${lang}/product/${item.id}`;
  }
}

export function SearchResultCard({
  item,
  lang,
}: {
  item: SearchResultItem;
  lang: string;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(item.images?.[0]);
  const offerPrice =
    typeof item.offerPrice === "number" ? item.offerPrice : null;
  const basePrice = typeof item.price === "number" ? item.price : null;
  const showsOffer = item.hasOffer && offerPrice !== null;
  const price = showsOffer ? offerPrice : basePrice;

  return (
    <Link
      href={resultHref(item, lang)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-light bg-surface text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-background-secondary">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff
              size={36}
              strokeWidth={1.5}
              className="text-foreground-muted"
              aria-label={t("card.noImage")}
            />
          </div>
        )}

        <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium tracking-wide text-foreground uppercase">
          {t(`types.${item.type}`)}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div className="min-w-0">
          {item.category && (
            <p className="truncate text-[10px] font-medium tracking-wide text-foreground-tertiary uppercase">
              {item.category}
            </p>
          )}
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-foreground">
            {item.name}
          </p>
        </div>

        {price !== null && (
          <div className="flex items-center gap-2">
            <span className="truncate text-base font-bold text-primary">
              {formatPrice(price)}
            </span>
            {showsOffer && basePrice !== null && (
              <span className="truncate text-xs text-foreground-tertiary line-through">
                {formatPrice(basePrice)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
