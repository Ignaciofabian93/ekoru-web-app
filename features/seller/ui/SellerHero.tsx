"use client";

import { BadgeCheck, Check, MapPin, Share2 } from "lucide-react";
import Image from "next/image";

import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { useShareSeller } from "../hooks/useShareSeller";
import { useSellerVisibility } from "../hooks/useSellerVisibility";
import {
  useCoverImage,
  useDisplayName,
  useProfileImage,
  useInitials,
} from "@/hooks/useSellerData";
import { Title } from "@/components/Primitives/Title";
import { Badge } from "@/components/Primitives/Badge";
import { Text } from "@/components/Primitives";
import { Container } from "@/components/Layout";

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  es: "es-CL",
  en: "en-US",
  fr: "fr-FR",
};

function formatJoinDate(value: string | undefined, lang: SupportedLanguage) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

interface Props {
  seller: Seller;
  lang: SupportedLanguage;
  /** Providers get "verified provider" rather than "verified seller". */
  isServiceProvider?: boolean;
}

export function SellerHero({ seller, lang, isServiceProvider = false }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const name = useDisplayName(seller);
  const avatar = useProfileImage(seller);
  const cover = useCoverImage(seller);
  const userInitials = useInitials(seller);
  // Country and region are public for everyone; the finer parts appear only
  // where the seller allows it. See `useSellerVisibility`.
  const { locationLine } = useSellerVisibility(seller);

  const { share, copied } = useShareSeller({ title: name });

  return (
    // Pinned to the same width as the page body below, so the banner reads as
    // this seller's header rather than a full-bleed page hero.
    <Container as="section" width="default" gap={0} paddingY={2}>
      {/* Cover */}
      <div className="relative h-50 w-full overflow-hidden rounded-2xl">
        {cover ? (
          <>
            {/* Ambient backdrop: same image, blown up + blurred so the
                letterbox space fills with the photo's own colors instead of
                dead space. scale-110 zooms past the edges so the blur never
                reveals an empty border. */}
            <Image
              src={cover}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              alt=""
              aria-hidden
              className="scale-110 object-cover blur-2xl"
            />
            <div className="absolute inset-0 bg-black/10" />
            {/* Foreground: the whole image, uncropped and undistorted. */}
            <Image
              src={cover}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              alt=""
              className="object-contain"
              priority
            />
          </>
        ) : (
          <div className="from-primary-light-bg via-background-secondary to-primary-light/30 h-full w-full bg-linear-to-br" />
        )}
        {/* Bottom fade grounds the avatar and adds depth. Kept shallow: the
            cover is only 112px tall on phones, so the old 96px fade covered
            almost all of it. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/25 to-transparent" />
      </div>

      {/* Identity bar */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
        {/* Avatar overlapping the cover (relative+z so it paints above the
              positioned cover, which would otherwise clip its top half). The
              negative margin is half its size, so it always straddles the
              cover's bottom edge. */}
        <div className="relative z-10 -mt-8 shrink-0">
          <div className="border-background bg-surface size-28 overflow-hidden rounded-full border-4 shadow-lg">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                width={224}
                height={224}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-primary-light-bg text-primary flex h-full w-full items-center justify-center text-xl font-bold">
                {userInitials}
              </div>
            )}
          </div>
        </div>

        {/* Name + meta */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 wrap-anywhere">
          <div className="flex flex-col md:flex-row items-center sm:items-start md:items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <Title level="h1" size="h4" weight="semibold">
              {name}
            </Title>
            {seller.isVerified && (
              <Badge
                label={t(isServiceProvider ? "hero.verifiedProvider" : "hero.verified")}
                variant="primary"
                icon={BadgeCheck}
                size="small"
              />
            )}
          </div>

          <div className="text-foreground-secondary flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm sm:justify-start">
            {locationLine && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} strokeWidth={1.8} className="shrink-0" aria-hidden />
                {locationLine}
              </span>
            )}
            {seller.createdAt && (
              <Text variant="span" weight="normal" size="sm" color="secondary">
                {t("hero.memberSince", {
                  date: formatJoinDate(seller.createdAt, lang),
                })}
              </Text>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={share}
            aria-label={t("hero.share")}
            className="border-border bg-surface text-foreground-secondary hover:bg-background-secondary flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors sm:w-auto"
          >
            {copied ? (
              <Check size={15} strokeWidth={2.2} aria-hidden />
            ) : (
              <Share2 size={15} strokeWidth={2} aria-hidden />
            )}
            {copied ? t("hero.shareCopied") : t("hero.share")}
          </button>
        </div>
      </div>
    </Container>
  );
}
