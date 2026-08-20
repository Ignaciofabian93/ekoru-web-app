"use client";

import { BadgeCheck, Check, MapPin, Share2 } from "lucide-react";

import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { useShareSeller } from "../hooks/useShareSeller";
import { useSellerVisibility } from "../hooks/useSellerVisibility";
import { useCoverImage, useDisplayName, useProfileImage } from "@/hooks/useSellerData";
import { Title } from "@/components/Primitives/Title";
import { Badge } from "@/components/Primitives/Badge";
import { Avatar } from "@/components/Primitives/Avatar";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives";
import { Container } from "@/components/Layout";
import { CoverBanner } from "@/components/Patterns";

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
  // Country and region are public for everyone; the finer parts appear only
  // where the seller allows it. See `useSellerVisibility`.
  const { locationLine } = useSellerVisibility(seller);

  const { share, copied } = useShareSeller({ title: name });

  return (
    // Pinned to the same width as the page body below, so the banner reads as
    // this seller's header rather than a full-bleed page hero.
    <Container as="section" width="default" gap={0} paddingY={2}>
      <CoverBanner image={cover} altText="" />

      {/* Identity bar */}
      <div className="mt-3 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
        {/* The avatar straddles the cover's bottom edge: relative+z so it paints
            above the positioned band, which would otherwise clip its top half. */}
        <div className="relative z-10 -mt-11 shrink-0">
          <Avatar image={avatar} alt={name} size="xl" frame="raised" />
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
                <Text variant="span" weight="normal" size="sm" color="secondary">
                  {locationLine}
                </Text>
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
          <Button
            variant="outline"
            size="sm"
            onPress={share}
            leftIcon={copied ? Check : Share2}
            text={copied ? t("hero.shareCopied") : t("hero.share")}
          />
        </div>
      </div>
    </Container>
  );
}
