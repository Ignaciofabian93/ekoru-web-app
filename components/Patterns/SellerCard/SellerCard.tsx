"use client";
import { BadgeCheck, Store, User, UserRound } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/Primitives/Badge";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  sellerCardAvatarClass,
  sellerCardAvatarFallbackClass,
  sellerCardAvatarIconSize,
  sellerCardAvatarImageClass,
  sellerCardBadgeRowClass,
  sellerCardClass,
  sellerCardFooterClass,
  sellerCardHeaderClass,
  sellerCardIdentityClass,
  sellerCardNameClass,
  sellerCardRootClass,
  sellerCardTitleClass,
} from "@/design/seller-card";
import type { Seller } from "@/types/user";
import { resolveImageUrl } from "@/utils/resolveImage";

interface Props {
  lang: string;
  seller: Seller;
  title: string;
  verifiedLabel: string;
  sellerTypeLabel: string;
  viewSellerLabel: string;
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

export function SellerCard({
  lang,
  seller,
  title,
  verifiedLabel,
  sellerTypeLabel,
  viewSellerLabel,
}: Props) {
  const name = getSellerName(seller);
  const image = getSellerImage(seller);
  const isBusiness = seller.profile?.__typename === "BusinessProfile";

  return (
    <div className={sellerCardRootClass}>
      <Title level="h5" size="h5" weight="semibold" className={sellerCardTitleClass}>
        {title}
      </Title>

      <div className={sellerCardClass}>
        <div className={sellerCardHeaderClass}>
          <div className={sellerCardAvatarClass}>
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="56px"
                className={sellerCardAvatarImageClass}
              />
            ) : (
              <div className={sellerCardAvatarFallbackClass}>
                {isBusiness ? (
                  <Store size={sellerCardAvatarIconSize} />
                ) : (
                  <User size={sellerCardAvatarIconSize} />
                )}
              </div>
            )}
          </div>
          <div className={sellerCardIdentityClass}>
            <Text
              variant="span"
              size="lg"
              weight="semibold"
              className={sellerCardNameClass}
            >
              {name}
            </Text>
            <div className={sellerCardBadgeRowClass}>
              {seller.isVerified && (
                <Badge
                  label={verifiedLabel}
                  variant="primary"
                  icon={BadgeCheck}
                  size="small"
                />
              )}
              <Badge
                label={sellerTypeLabel}
                size="small"
                variant="secondary"
                icon={UserRound}
              />
            </div>
          </div>
        </div>

        <div className={sellerCardFooterClass}>
          <LinkButton
            href={`/${lang}/seller/${seller.id}`}
            icon={UserRound}
            label={viewSellerLabel}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
