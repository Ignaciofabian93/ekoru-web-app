"use client";

import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { getSellerBio } from "../sellerDisplay";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";

export function SellerAbout({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);
  const bio = getSellerBio(seller);

  return (
    <section className="mb-3">
      <Title level="h2" size="h6" weight="medium" className="mb-4">
        {t("about.title")}
      </Title>
      {bio ? <Text variant="p">{bio}</Text> : <Text variant="p">{t("about.empty")}</Text>}
    </section>
  );
}
