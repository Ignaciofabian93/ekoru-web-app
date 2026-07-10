"use client";

import { BadgeCheck, Check, MapPin, Share2 } from "lucide-react";
import Image from "next/image";

import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { useShareSeller } from "../hooks/useShareSeller";
import {
  useCoverImage,
  useDisplayName,
  useProfileImage,
  useInitials,
  useSellerLocation,
} from "@/hooks/useSellerData";
import { Title } from "@/components/Title/Title";
import { Badge } from "@/components/Badge/Badge";

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
}

export function SellerHero({ seller, lang }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const name = useDisplayName(seller);
  const avatar = useProfileImage(seller);
  const cover = useCoverImage(seller);
  const location = useSellerLocation(seller);
  const userInitials = useInitials(seller);

  const { share, copied } = useShareSeller({ title: name });

  return (
    <section className="w-full">
      {/* Full-bleed cover */}
      <div className="relative h-40 w-full overflow-hidden sm:h-52 md:h-70">
        {cover ? (
          <>
            {/* Ambient backdrop: same image, blown up + blurred so the
                letterbox space fills with the photo's own colors instead of
                dead space. scale-110 zooms past the edges so the blur never
                reveals an empty border. */}
            <Image
              src={cover}
              fill
              sizes="100vw"
              alt=""
              aria-hidden
              className="scale-110 object-cover blur-2xl"
            />
            <div className="absolute inset-0 bg-black/10" />
            {/* Foreground: the whole image, uncropped and undistorted. */}
            <Image
              src={cover}
              fill
              sizes="100vw"
              alt=""
              className="object-contain"
              priority
            />
          </>
        ) : (
          <div className="from-primary-light-bg via-background-secondary to-primary-light/30 h-full w-full bg-linear-to-br" />
        )}
        {/* Bottom fade grounds the avatar and adds depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/25 to-transparent" />
      </div>

      {/* Identity bar — aligned to the content grid below so nothing floats */}
      <div className="mx-auto w-full max-w-7xl px-4 mt-6">
        <div className="flex flex-col items-center gap-4 pb-5 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
          {/* Avatar overlapping the cover (relative+z so it paints above the
              positioned cover, which would otherwise clip its top half) */}
          <div className="relative z-10 -mt-14 shrink-0 sm:-mt-20">
            <div className="border-background bg-surface size-28 overflow-hidden rounded-full border-4 shadow-lg sm:size-36">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={288}
                  height={288}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary-light-bg text-primary flex h-full w-full items-center justify-center text-2xl font-bold">
                  {userInitials}
                </div>
              )}
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 wrap-anywhere sm:pb-1.5">
            <div className="flex flex-col md:flex-row items-center sm:items-start md:items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
              <Title level="h3" size="h3" weight="medium">
                {name}
              </Title>
              {seller.isVerified && (
                <Badge
                  label={t("hero.verified")}
                  variant="primary"
                  icon={BadgeCheck}
                  size="small"
                />
              )}
            </div>

            <div className="text-foreground-secondary flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} strokeWidth={1.8} className="shrink-0" />
                {location || t("hero.noLocation")}
              </span>
              {seller.createdAt && (
                <span>
                  {t("hero.memberSince", {
                    date: formatJoinDate(seller.createdAt, lang),
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={share}
              aria-label={t("hero.share")}
              className="border-border bg-surface text-foreground-secondary hover:bg-background-secondary flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors sm:w-auto sm:self-end sm:pb-2.5"
            >
              {copied ? (
                <Check size={16} strokeWidth={2.2} />
              ) : (
                <Share2 size={16} strokeWidth={2} />
              )}
              {copied ? t("hero.shareCopied") : t("hero.share")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
