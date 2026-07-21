"use client";
import { BadgeCheck, Store, User, UserRound } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";
import { resolveImageUrl } from "@/utils/resolveImage";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Title/Title";
import { Badge } from "@/components/Badge/Badge";
import { Text } from "@/components/Text/Text";
import { LinkButton } from "@/components/Links/LinkButton";

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

  return (
    <div className="px-2">
      <Title level="h5" size="h5" weight="semibold" className="mb-3">
        {t("seller.title")}
      </Title>

      <div className="flex flex-col gap-4 rounded-2xl border border-border-light bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="bg-background-secondary relative size-18 shrink-0 overflow-hidden rounded-full">
            {image ? (
              <Image src={image} alt={name} fill sizes="56px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-foreground-muted">
                {isBusiness ? <Store size={22} /> : <User size={22} />}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-1">
            <Text variant="span" size="lg" weight="semibold" className="truncate mb-1">
              {name}
            </Text>
            <div className="flex items-center justify-start gap-1">
              {seller.isVerified && (
                <Badge
                  label={t("seller.verified")}
                  variant="primary"
                  icon={BadgeCheck}
                  size="small"
                />
              )}
              <Badge
                label={t(`seller.types.${seller.sellerType}`)}
                size="small"
                variant="secondary"
                icon={UserRound}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <LinkButton
            href={`/${lang}/seller/${seller.id}`}
            icon={UserRound}
            label={t("actions.viewSeller")}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
