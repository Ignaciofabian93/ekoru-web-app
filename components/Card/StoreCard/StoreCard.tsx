"use client";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import type { BusinessProfile, Seller } from "@/types/user";
import {
  getBusinessProfile,
  getProfileImage,
  getSellerLocation,
} from "@/utils/sellerInformation";
import { Badge } from "@/components/Badge/Badge";
import type { SupportedLanguage } from "@/constants/settings";
import { useNavigation } from "@/hooks/useNavigation";
import clsx from "clsx";
import tokens from "@/design/tokens";

function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function StoreCard({
  seller,
  ctaText,
  verifiedLabel,
  lang,
}: {
  seller: Seller;
  ctaText: string;
  verifiedLabel: string;
  lang: SupportedLanguage;
}) {
  const { navigateTo } = useNavigation();
  const profile: BusinessProfile | null = getBusinessProfile(seller);
  const location = getSellerLocation(seller);
  const profileImage = getProfileImage(seller);
  const isVerified = Boolean(seller.isVerified);

  const initials = getInitials(profile?.businessName);

  const { colors, button, card } = tokens;

  return (
    <div className="w-80 shrink-0">
      <div
        style={{
          ...card.horizontal.md,
        }}
      >
        {/* Left panel — brand block, mirrors the home category cards */}
        <figure
          className={clsx(
            "relative w-28",
            "shrink-0",
            "bg-linear-to-br from-secondary-dark to-secondary",
            "flex flex-col items-center justify-between",
            "overflow-hidden",
          )}
        >
          {/* Decorative dots */}
          <div className="absolute w-24 h-24 rounded-full bg-white/10 -top-6 -left-8" />
          <div className="absolute w-16 h-16 rounded-full bg-white/10 bottom-2 -right-6" />

          {/* Logo chip — white tile keeps brand logos legible on the colored panel */}
          <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 pt-4 pb-7">
            <div
              className={clsx(
                "w-20 h-20",
                "p-2.5",
                "rounded-2xl",
                "bg-white",
                "overflow-hidden",
                "flex items-center justify-center",
                "shadow-md",
                "ring-1 ring-black/5",
              )}
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={profile?.businessName ?? "logo"}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-secondary-dark">
                  {initials}
                </span>
              )}
            </div>
          </div>

          {/* Verified pill */}
          {isVerified && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <Badge
                variant="secondary"
                icon={BadgeCheck}
                size="small"
                label={verifiedLabel}
              />
            </div>
          )}
        </figure>

        {/* Right panel — details */}
        <div className="flex flex-col flex-1 min-w-0 px-3.5 py-2">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-foreground truncate">{profile?.businessName}</p>
          </div>

          <div className="flex items-center gap-1 mt-0.5 text-xs text-foreground-secondary">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <p className="mt-1.5 text-sm text-foreground-secondary line-clamp-3">
            {profile?.description}
          </p>

          <div className="flex items-center justify-end gap-2 mt-auto pt-3">
            <button
              onClick={() => navigateTo({ route: `${lang}/seller/${seller.id}` })}
              style={{
                ...button.xs,
                backgroundColor: colors.primary,
                color: colors.onPrimary,
              }}
              className={clsx("hover:brightness-105")}
            >
              {ctaText}
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
