"use client";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";
import { Globe, Mail, MapPin, Store, UserRound } from "lucide-react";
import { NAMESPACE } from "../i18n";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { RHYTHM, Stack } from "@/components/Layout";
import { useBusinessType, useIsBusinessProfile } from "@/hooks/useSellerData";
import { useSellerVisibility } from "../hooks/useSellerVisibility";
import { SellerSocials } from "./SellerSocials";

export function SellerDetails({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);

  const businessType = useBusinessType(seller);
  const isBusiness = useIsBusinessProfile(seller);
  const { locationLine, street, socials } = useSellerVisibility(seller);

  const rows = [
    {
      key: "sellerType",
      icon: UserRound,
      label: t("details.sellerType"),
      value: t(`sellerTypes.${seller.sellerType}`),
    },
    businessType && {
      key: "businessType",
      icon: Store,
      label: t("details.businessType"),
      value: t(`businessTypes.${businessType}`),
    },
    locationLine && {
      key: "location",
      icon: MapPin,
      label: t("details.location"),
      value: locationLine,
    },
    street && {
      key: "address",
      icon: MapPin,
      label: t("details.address"),
      value: street,
    },
    // Contact details belong to a storefront, not to someone's personal profile.
    isBusiness &&
      seller.email && {
        key: "email",
        icon: Mail,
        label: t("details.email"),
        value: seller.email,
      },
    isBusiness &&
      seller.website && {
        key: "website",
        icon: Globe,
        label: t("details.website"),
        value: seller.website,
      },
  ].filter(Boolean) as Array<{
    key: string;
    icon: typeof MapPin;
    label: string;
    value: string;
  }>;

  if (rows.length === 0 && socials.length === 0) return null;

  return (
    <Stack gap={RHYTHM.CONTENT}>
      <Title level="h2" size="h6" weight="semibold">
        {t("details.title")}
      </Title>

      <dl className="flex flex-col divide-y divide-border-light">
        {rows.map(({ key, icon: Icon, label, value }) => (
          <div key={key} className="flex items-start justify-between gap-4 py-3">
            <dt className="flex shrink-0 items-center gap-2">
              <Icon
                size={15}
                strokeWidth={2}
                aria-hidden
                className="shrink-0 text-foreground-tertiary"
              />
              <Text variant="span" size="sm" weight="medium">
                {label}
              </Text>
            </dt>
            <dd className="min-w-0">
              <Text
                variant="span"
                size="sm"
                weight="medium"
                color="secondary"
                align="right"
                numberOfLines={2}
              >
                {value}
              </Text>
            </dd>
          </div>
        ))}
      </dl>

      {socials.length > 0 && (
        <Stack gap={RHYTHM.TEXT}>
          <Text variant="span" size="sm" weight="medium">
            {t("details.socials")}
          </Text>
          <SellerSocials socials={socials} />
        </Stack>
      )}
    </Stack>
  );
}
