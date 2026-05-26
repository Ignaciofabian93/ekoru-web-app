"use client";

import {
  BadgeCheck,
  Check,
  MapPin,
  MessageCircle,
  Share2,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { useShareSeller } from "../hooks/useShareSeller";
import {
  getSellerAvatar,
  getSellerCover,
  getSellerName,
} from "../sellerDisplay";

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
  const [following, setFollowing] = useState(false);

  const name = getSellerName(seller);
  const avatar = getSellerAvatar(seller);
  const cover = getSellerCover(seller);
  const isBusiness = seller.profile?.__typename === "BusinessProfile";
  const location = [seller.county?.county, seller.address]
    .filter(Boolean)
    .join(" · ");

  const { share, copied } = useShareSeller({ title: name });

  return (
    <header className="bg-surface border-b border-border-light">
      <div className="bg-background-secondary relative h-40 w-full md:h-56">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="from-primary-light-bg to-background-secondary h-full w-full bg-gradient-to-br" />
        )}
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="-mt-12 flex items-end gap-4 md:-mt-16">
            <div className="bg-background-secondary relative size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-surface md:size-32">
              {avatar ? (
                <Image src={avatar} alt={name} fill sizes="128px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-foreground-muted">
                  {isBusiness ? <Store size={36} /> : <Users size={36} />}
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold text-foreground md:text-3xl">
                  {name}
                </h1>
                {seller.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-light-bg px-2 py-0.5 text-xs font-semibold text-primary">
                    <BadgeCheck size={14} strokeWidth={2.2} />
                    {t("hero.verified")}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground-tertiary">
                {t(`sellerTypes.${seller.sellerType}`)}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-foreground-secondary">
                <MapPin size={14} strokeWidth={1.8} />
                <span className="truncate">
                  {location || t("hero.noLocation")}
                </span>
              </div>
              {seller.createdAt && (
                <span className="text-xs text-foreground-tertiary">
                  {t("hero.memberSince", {
                    date: formatJoinDate(seller.createdAt, lang),
                  })}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => setFollowing((v) => !v)}
              aria-pressed={following}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                following
                  ? "bg-primary-light-bg text-primary"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              {following ? <Check size={16} strokeWidth={2.2} /> : <UserPlus size={16} strokeWidth={2} />}
              {following ? t("hero.following") : t("hero.follow")}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary"
            >
              <MessageCircle size={16} strokeWidth={2} />
              {t("hero.message")}
            </button>
            <button
              type="button"
              onClick={share}
              aria-label={t("hero.share")}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground-secondary transition-colors hover:bg-background-secondary"
            >
              {copied ? <Check size={16} strokeWidth={2.2} /> : <Share2 size={16} strokeWidth={2} />}
              {copied ? t("hero.shareCopied") : t("hero.share")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
