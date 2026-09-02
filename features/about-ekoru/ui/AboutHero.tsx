"use client";
import { Container } from "@/components/Layout";
import { CoverBanner } from "@/components/Patterns/CoverBanner";
import { Avatar } from "@/components/Primitives/Avatar";
import { Badge } from "@/components/Primitives/Badge";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { Leaf, MapPin } from "lucide-react";
import { NAMESPACE } from "../i18n";

export function AboutHero() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Container as="section" width="default" gap={0} paddingY={2}>
      {/* No image: the band falls back to the shared wallpaper, the same one a
          profile without a cover shows. */}
      <CoverBanner altText="" />

      <div className="mt-3 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
        <div className="relative z-10 -mt-11 shrink-0">
          {/* No image: the Avatar falls back to the EKORU mark, which is the
              point here — the platform stands where the seller does. */}
          <Avatar alt="" size="xl" frame="raised" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 wrap-anywhere">
          <Text variant="span" size="sm" weight="semibold" color="primary">
            {t("page.heroLabel")}
          </Text>
          <Title level="h1" size="h3" weight="bold">
            {t("page.heroTitle")}
          </Title>
          <Text variant="p" size="base" color="secondary">
            {t("page.heroTagline")}
          </Text>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge
              variant="primary"
              size="small"
              icon={Leaf}
              label={t("page.badges.circular")}
            />
            <Badge
              variant="secondary"
              size="small"
              icon={MapPin}
              label={t("page.badges.origin")}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
