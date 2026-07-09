"use client";

import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { resolveImageUrl } from "@/utils/resolveImage";
import {
  BadgeCheck,
  Clock,
  Heart,
  ImageOff,
  MapPin,
  RotateCw,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { ServiceCardData, ServiceCardLabels } from "./types";

interface Props {
  service: ServiceCardData;
  href?: string;
  labels: Required<ServiceCardLabels>;
  onFlip: () => void;
}

function formatDuration(minutes: number, labels: Required<ServiceCardLabels>): string {
  if (minutes < 60) return `${minutes} ${labels.minutesShort}`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0
    ? `${hours} ${labels.hoursShort}`
    : `${hours}${labels.hoursShort} ${mins}${labels.minutesShort}`;
}

export default function FrontSide({ service, href, labels, onFlip }: Props) {
  const formatPrice = useFormatPrice();
  const [imageError, setImageError] = useState(false);
  const { toggleFavorite } = useToggleFavorite();
  const liked = Boolean(service.isLiked);
  const cover = resolveImageUrl(service.image);

  const Container: React.ElementType = href ? Link : "div";
  const containerProps = href ? { href } : {};

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  };

  const location = [service.city].filter(Boolean).join(", ");

  return (
    <Container
      {...containerProps}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-accent/30 bg-surface text-left shadow-sm transition-all hover:border-accent hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-linear-to-br from-accent/15 to-accent/5">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sparkles size={32} strokeWidth={1.5} className="text-accent" />
          </div>
        )}

        {service.category && (
          <span className="absolute bottom-2 left-2 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            {service.category}
          </span>
        )}

        {service.isVerified && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-accent shadow-sm">
            <BadgeCheck size={12} strokeWidth={2.5} />
            {labels.verified}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(Number(service.id), liked, "service");
          }}
          aria-pressed={liked}
          aria-label="favorite"
          className="absolute top-2 right-11 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
        >
          <Heart
            size={14}
            strokeWidth={2}
            className={liked ? "fill-red-500 text-red-500" : "text-foreground-secondary"}
          />
        </button>

        <button
          type="button"
          onClick={handleFlip}
          aria-label={labels.flipToDetails}
          className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-sm transition-colors hover:bg-accent-hover"
        >
          <RotateCw size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
            {service.name}
          </p>
          {service.providerName && (
            <p className="mt-0.5 truncate text-xs text-foreground-secondary">
              {service.providerName}
            </p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-foreground-secondary">
            {typeof service.rating === "number" && (
              <span className="inline-flex items-center gap-1">
                <Star
                  size={12}
                  className="fill-amber-400 text-amber-400"
                  strokeWidth={1.5}
                />
                <span className="font-semibold text-foreground">
                  {service.rating.toFixed(1)}
                </span>
              </span>
            )}
            {typeof service.durationMinutes === "number" && (
              <span className="inline-flex items-center gap-1">
                <Clock size={11} strokeWidth={2} />
                {formatDuration(service.durationMinutes, labels)}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 truncate">
                <MapPin size={11} strokeWidth={2} />
                <span className="truncate">{location}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          {typeof service.priceFrom === "number" ? (
            <div className="min-w-0">
              <p className="text-[10px] text-foreground-tertiary uppercase">
                {labels.priceFromPrefix}
              </p>
              <p className="truncate text-base font-bold text-accent">
                {formatPrice(service.priceFrom)}
              </p>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleFlip}
            className="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            {labels.bookNow}
          </button>
        </div>
      </div>

      {!cover && (
        <span className="sr-only">
          <ImageOff aria-label={labels.noImage} />
        </span>
      )}
    </Container>
  );
}
