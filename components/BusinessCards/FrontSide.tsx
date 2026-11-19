"use client";
import clsx from "clsx";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/i18n/context";
import { formatInitials } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/resolveImage";
import { NAMESPACE } from "./i18n";
import { frontStyles } from "./styles";

export type BusinessCardType = "store" | "provider";

export interface FrontSideProps {
  cardType: BusinessCardType;
  href: string;
  name?: string | null;
  description?: string | null;
  coverImage?: string | null;
  logo?: string | null;
  tagId?: string | null;
  location?: string | null;
  isVerified?: boolean;
  count?: number;
  /** First card or two of a page: loads the cover eagerly at high priority. */
  priority?: boolean;
}

export default function FrontSide({
  cardType,
  href,
  name,
  description,
  coverImage,
  logo,
  tagId,
  location,
  isVerified,
  count,
  priority,
}: FrontSideProps) {
  const { t } = useTranslation(NAMESPACE);
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const cover = resolveImageUrl(coverImage);
  const logoUrl = resolveImageUrl(logo);

  const displayName = name?.trim() || t("meta.noBusinessName");
  // The tag catalog can grow ahead of this dictionary; `t` echoes unknown keys back.
  const tagKey = tagId ? `businessTag.${tagId}` : null;
  const tag = tagKey && t(tagKey) !== tagKey ? t(tagKey) : null;
  const countKind = cardType === "store" ? "products" : "services";
  const countLabel =
    typeof count === "number"
      ? t(`count.${countKind}${count === 1 ? "One" : "Other"}`, { value: String(count) })
      : null;

  return (
    <>
      <div className={clsx(frontStyles.cover, frontStyles.coverFallback[cardType])}>
        {cover && !coverError ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 640px) 288px, 320px"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            onError={() => setCoverError(true)}
            className={frontStyles.coverImage}
          />
        ) : (
          <>
            <div aria-hidden className={frontStyles.coverGlowTop} />
            <div aria-hidden className={frontStyles.coverGlowBottom} />
          </>
        )}
        {tag && <span className={frontStyles.tag}>{tag}</span>}
      </div>

      <div className={frontStyles.logoWrap}>
        <div className={frontStyles.logo}>
          {logoUrl && !logoError ? (
            <Image
              src={logoUrl}
              alt=""
              width={80}
              height={80}
              onError={() => setLogoError(true)}
              className={frontStyles.logoImage}
            />
          ) : (
            <span
              aria-hidden
              className={clsx(frontStyles.logoFallback, frontStyles.logoFallbackTone[cardType])}
            >
              {formatInitials(displayName)}
            </span>
          )}
        </div>
      </div>

      <div className={frontStyles.body}>
        <div className={frontStyles.nameRow}>
          <h3 className={frontStyles.name}>
            <Link href={href} className={frontStyles.link}>
              {displayName}
            </Link>
          </h3>
          {isVerified && (
            <BadgeCheck
              size={18}
              strokeWidth={2.25}
              role="img"
              aria-label={t("badges.verified")}
              className={frontStyles.verified}
            />
          )}
        </div>

        <p className={frontStyles.description}>{description?.trim()}</p>

        {location && (
          <div className={frontStyles.location}>
            <MapPin size={14} strokeWidth={2} aria-hidden className="shrink-0" />
            <span className={frontStyles.locationText}>{location}</span>
          </div>
        )}

        <div className={frontStyles.footerWrap}>
          <div className={frontStyles.footer}>
            <span className={frontStyles.count}>{countLabel}</span>
            <span aria-hidden className={frontStyles.cta}>
              {t(`cta.${cardType}`)}
              <ArrowRight size={15} strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
