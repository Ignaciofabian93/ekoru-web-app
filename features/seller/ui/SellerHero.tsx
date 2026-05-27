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
import { Text } from "@/components/Text/Text";

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
    <section className="w-full max-w-4xl mx-auto">
      <div className="relative w-full">
        {cover ? (
          <Image
            src={cover}
            width={1000}
            height={400}
            alt=""
            className="w-full min-h-50 h-auto max-h-60 object-cover"
            priority
          />
        ) : (
          <div className="bg-linear-to-br from-primary-light-bg to-background-secondary w-full min-h-50 h-auto max-h-60" />
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[40%] max-w-45">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={200}
              height={200}
              className="w-full h-auto rounded-full border-4 border-white"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-foreground-muted">
              {userInitials}
            </div>
          )}
        </div>
      </div>
      <div className="wrap-break-word mt-24 flex flex-col items-center gap-4 px-4">
        <Title level="h3" size="h3" align="center" weight="medium">
          {name}
        </Title>
        {seller.isVerified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-light-bg px-2 py-0.5 text-xs font-semibold text-primary">
            <BadgeCheck size={14} strokeWidth={2.2} />
            {t("hero.verified")}
          </span>
        )}
        <div className="w-fit mx-auto rounded-lg bg-primary-light/20 px-4">
          <Text variant="span" size="sm" weight="semibold">
            {t(`sellerTypes.${seller.sellerType}`)}
          </Text>
        </div>
        <div className="w-full flex items-center justify-center gap-1.5 text-sm text-foreground-secondary">
          <MapPin size={14} strokeWidth={1.8} />
          <Text variant="span" size="sm" align="center">
            {location || t("hero.noLocation")}
          </Text>
        </div>
        {seller.createdAt && (
          <Text
            variant="span"
            size="sm"
            align="center"
            className="text-foreground-secondary"
          >
            {t("hero.memberSince", {
              date: formatJoinDate(seller.createdAt, lang),
            })}
          </Text>
        )}
        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={share}
            aria-label={t("hero.share")}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground-secondary transition-colors hover:bg-background-secondary"
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
    </section>
  );
}
