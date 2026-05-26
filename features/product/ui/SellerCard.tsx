"use client";

import { BadgeCheck, MapPin, MessageCircle, Phone, Store, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";
import { resolveImageUrl } from "@/utils/resolveImage";

import { NAMESPACE } from "../i18n";

interface Props {
  lang: string;
  seller: Seller;
}

function getSellerName(seller: Seller): string {
  const profile = seller.profile;
  if (!profile) return seller.email;
  if (profile.__typename === "PersonProfile") {
    return (
      profile.displayName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      seller.email
    );
  }
  return profile.businessName ?? seller.email;
}

function getSellerImage(seller: Seller): string | undefined {
  const profile = seller.profile;
  if (!profile) return undefined;
  const raw =
    profile.__typename === "PersonProfile" ? profile.profileImage : profile.logo;
  return resolveImageUrl(raw);
}

export function SellerCard({ lang, seller }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const name = getSellerName(seller);
  const image = getSellerImage(seller);
  const isBusiness = seller.profile?.__typename === "BusinessProfile";
  const location = [seller.county?.county, seller.address]
    .filter(Boolean)
    .join(" · ");

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("seller.title")}
      </h2>

      <div className="flex flex-col gap-4 rounded-2xl border border-border-light bg-surface p-4">
        <div className="flex items-center gap-3">
          <div className="bg-background-secondary relative size-14 shrink-0 overflow-hidden rounded-full">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-foreground-muted">
                {isBusiness ? <Store size={22} /> : <User size={22} />}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate text-base font-semibold text-foreground">
                {name}
              </span>
              {seller.isVerified && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
                  <BadgeCheck size={14} strokeWidth={2} />
                  {t("seller.verified")}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-foreground-tertiary">
              {t(`seller.types.${seller.sellerType}`)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-foreground-secondary">
          {location ? (
            <div className="flex items-center gap-2">
              <MapPin size={16} strokeWidth={1.8} />
              <span className="truncate">{location}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 italic">
              <MapPin size={16} strokeWidth={1.8} />
              <span>{t("seller.noLocation")}</span>
            </div>
          )}
          {seller.phone && (
            <div className="flex items-center gap-2">
              <Phone size={16} strokeWidth={1.8} />
              <span>{seller.phone}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/${lang}/seller/${seller.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary"
          >
            <Store size={16} strokeWidth={2} />
            {t("actions.viewSeller")}
          </Link>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-light-bg py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <MessageCircle size={16} strokeWidth={2} />
            {t("actions.contactSeller")}
          </button>
        </div>
      </div>
    </section>
  );
}
