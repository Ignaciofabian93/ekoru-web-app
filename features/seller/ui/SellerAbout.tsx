"use client";

import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { getSellerBio } from "../sellerDisplay";
import { RHYTHM, Stack } from "@/components/Layout";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";

export function SellerAbout({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);
  const bio = getSellerBio(seller);

  return (
    <Stack gap={RHYTHM.CONTENT}>
      <Title level="h2" size="h6" weight="semibold">
        {t("about.title")}
      </Title>
      <Text variant="p" size="sm" color={bio ? "secondary" : "tertiary"}>
        {bio || t("about.empty")}
      </Text>
    </Stack>
  );
}
