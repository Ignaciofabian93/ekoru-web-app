"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import { Text } from "../Primitives";
import { NAMESPACE } from "./i18n";
import type { BrandAccent, BusinessCardProps } from "./types/Card.types";
import { getInitials } from "./utils/initials";

/** Stands in for a missing cover photo. */
const COVER_FALLBACK: Record<BrandAccent, string> = {
  primary: "bg-linear-to-br from-primary-dark to-primary",
  secondary: "bg-linear-to-br from-secondary-dark to-secondary",
  // Satin charcoal: neutral zinc so it takes no side against the lime and
  // cyan the other two accents carry, with the mid stop lighter than both
  // ends — that diagonal lift is what reads as sheen rather than flat grey.
  charcoal: "bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-800",
};

/** Stands in for a missing logo: initials on a tint of the same accent. */
const LOGO_FALLBACK: Record<BrandAccent, string> = {
  primary: "bg-primary-light-bg text-primary-dark",
  secondary: "bg-secondary/15 text-secondary-dark",
  charcoal: "bg-zinc-100 text-zinc-800",
};

/**
 * A store or a service provider, as a storefront: a cover photo with the
 * business's logo set over its lower edge, then who they are, what they say
 * about themselves and where they are, and a footer with how much they list
 * and the way in.
 *
 * Fixed width — these live in horizontal rails, where a card that sized to its
 * content would give every business a different footprint. Height follows the
 * row (`h-full`), and the blurb holds two lines whether it needs them or not,
 * so the footers line up across a rail.
 *
 * The whole card is one link (the stretched anchor), named for the business.
 * Nothing inside is interactive, so the footer's "explore" is drawn rather
 * than wired — a second link would be a duplicate tab stop.
 */
export function BusinessCard({
  href,
  name,
  description,
  coverImage,
  logo,
  tagId,
  location,
  isVerified = false,
  count,
  countKind,
  itemType,
  accent = "primary",
  priority = false,
}: BusinessCardProps) {
  const { t } = useTranslation(NAMESPACE);
  const cover = resolveImageUrl(coverImage);
  const logoUrl = resolveImageUrl(logo);
  const [coverError, setCoverError] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);

  const displayName = name?.trim() || t("meta.noBusinessName");
  // The catalog is served (USR-11) and may grow ahead of this dictionary; `t`
  // echoes the key back for an id it doesn't know, which is no label at all.
  const tagKey = tagId ? `businessTag.${tagId}` : null;
  const tag = tagKey && t(tagKey) !== tagKey ? t(tagKey) : null;
  const hasCount = typeof count === "number";
  const countLabel = hasCount
    ? t(`count.${countKind}${count === 1 ? "One" : "Other"}`, { value: String(count) })
    : null;

  return (
    <article
      className={clsx(
        "group relative flex h-full w-72 flex-col overflow-hidden rounded-2xl sm:w-70",
        "border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5",
        "transition duration-200",
      )}
    >
      <Link
        href={href}
        aria-label={displayName}
        className={clsx(
          "absolute inset-0 z-10 rounded-2xl outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        )}
      />

      <div
        className={clsx(
          "relative aspect-2/1 w-full shrink-0 overflow-hidden",
          COVER_FALLBACK[accent],
        )}
      >
        {cover && !coverError ? (
          <Image
            src={cover}
            // Decorative: the business is named right below, and the link
            // carries the name for screen readers.
            alt=""
            fill
            sizes="(max-width: 640px) 288px, 320px"
            priority={priority}
            onError={() => setCoverError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            {/* Soft depth on the fallback gradient, not content. */}
            <div
              aria-hidden
              className="absolute -top-8 -left-6 size-28 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="absolute -right-4 -bottom-10 size-24 rounded-full bg-white/10"
            />
          </>
        )}

        {tag && (
          <span
            className={clsx(
              "pointer-events-none absolute top-3 right-3 z-20 max-w-[60%] truncate",
              "rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm",
            )}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Pulled up over the cover's lower edge. Above the link in paint order
          only so the cover can't cover it — `pointer-events-none` hands the
          click through to the link underneath. */}
      <div className="pointer-events-none relative z-20 -mt-10 px-5">
        <div
          className={clsx(
            "flex size-20 items-center justify-center overflow-hidden rounded-xl",
            "border-4 border-white bg-white shadow-md shadow-slate-900/10",
          )}
        >
          {logoUrl && !logoError ? (
            <Image
              src={logoUrl}
              alt=""
              width={80}
              height={80}
              onError={() => setLogoError(true)}
              className="size-full rounded-lg object-cover"
            />
          ) : (
            <span
              aria-hidden
              className={clsx(
                "flex size-full items-center justify-center rounded-lg text-xl font-bold",
                LOGO_FALLBACK[accent],
              )}
            >
              {getInitials(displayName)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-3 pb-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <Text variant="p" size="xl" weight="bold" leading="snug" numberOfLines={1}>
            {displayName}
          </Text>
          {isVerified && (
            <BadgeCheck
              size={18}
              strokeWidth={2.25}
              role="img"
              aria-label={t("badges.verified")}
              className="shrink-0 text-secondary-dark"
            />
          )}
        </div>

        <Text
          variant="p"
          size="sm"
          color="secondary"
          numberOfLines={2}
          className="mt-1.5 min-h-[2lh]"
        >
          {description?.trim()}
        </Text>

        {location && (
          <div className="mt-4 flex min-w-0 items-center gap-1.5 text-foreground-secondary">
            <MapPin size={14} strokeWidth={2} aria-hidden className="shrink-0" />
            <Text variant="span" size="sm" color="secondary" numberOfLines={1}>
              {location}
            </Text>
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
            {/* Kept even when empty, so the link stays pinned right. */}
            <Text variant="span" size="xs" color="secondary" numberOfLines={1}>
              {countLabel}
            </Text>
            <span
              aria-hidden
              className={clsx(
                "inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary-active",
              )}
            >
              {t(`cta.${itemType}`)}
              <ArrowRight size={15} strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
