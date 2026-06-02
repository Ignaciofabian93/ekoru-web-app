"use client";

import { resolveImageUrl } from "@/utils/resolveImage";
import { BadgeCheck, ImageOff, RotateCw, Star, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { StoreCardData, StoreCardLabels } from "./types";

interface Props {
  store: StoreCardData;
  href?: string;
  labels: StoreCardLabels;
  onFlip: () => void;
}

export default function FrontSide({ store, href, labels, onFlip }: Props) {
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(store.coverImage);
  const logo = resolveImageUrl(store.logo);

  const Container: React.ElementType = href ? Link : "div";
  const containerProps = href ? { href } : {};

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  };

  const businessTypeLabel =
    store.businessType && labels.businessType?.[store.businessType];

  return (
    <Container
      {...containerProps}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-secondary/30 bg-surface text-left shadow-sm transition-all hover:border-secondary hover:shadow-md"
    >
      <div className="relative aspect-16/9 w-full shrink-0 bg-gradient-to-br from-secondary/15 to-secondary/5">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={store.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Store size={32} strokeWidth={1.5} className="text-secondary-dark/60" />
          </div>
        )}

        {store.isVerified && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            <BadgeCheck size={12} strokeWidth={2.5} />
            {labels.verified}
          </span>
        )}

        <button
          type="button"
          onClick={handleFlip}
          aria-label={labels.flipToDetails}
          className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-sm transition-colors hover:bg-secondary-dark"
        >
          <RotateCw size={14} strokeWidth={2.5} />
        </button>

        {logo && (
          <div className="absolute -bottom-5 left-3 size-12 overflow-hidden rounded-lg border-2 border-surface bg-surface shadow-md">
            <Image src={logo} alt={`${store.name} logo`} width={48} height={48} className="size-full object-cover" />
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col justify-between gap-2 p-3 ${logo ? "pt-7" : ""}`}>
        <div className="min-w-0">
          {businessTypeLabel && (
            <p className="truncate text-[10px] font-semibold tracking-wide text-secondary-dark uppercase">
              {businessTypeLabel}
            </p>
          )}
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-foreground">
            {store.name}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-secondary">
            {typeof store.rating === "number" && (
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" strokeWidth={1.5} />
                <span className="font-semibold text-foreground">{store.rating.toFixed(1)}</span>
                {typeof store.reviewsCount === "number" && (
                  <span className="text-foreground-tertiary">({store.reviewsCount})</span>
                )}
              </span>
            )}
            {typeof store.productCount === "number" && (
              <span>
                <span className="font-semibold text-foreground">{store.productCount}</span>{" "}
                {labels.products}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleFlip}
          className="w-full cursor-pointer rounded-md bg-secondary/10 px-2 py-1.5 text-xs font-semibold text-secondary-dark transition-colors hover:bg-secondary hover:text-white"
        >
          {labels.visitStore}
        </button>
      </div>

      {!cover && !logo && (
        <span className="sr-only">
          <ImageOff aria-label={labels.noCoverImage} />
        </span>
      )}
    </Container>
  );
}
