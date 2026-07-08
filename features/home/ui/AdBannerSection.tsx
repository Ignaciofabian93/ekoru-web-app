"use client";
import AdBanner, { type AdBannerVariant } from "@/components/AdBanner/AdBanner";
import type { SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { useTranslation } from "@/i18n/context";
import { Package, Store, Toolbox, UsersRound } from "lucide-react";

export function AdBannerSection({
  lang,
  variant,
  domain,
}: {
  lang: SupportedLanguage;
  variant?: AdBannerVariant;
  domain?: "marketplace" | "services" | "stores" | "community";
}) {
  const { t } = useTranslation(NAMESPACE);
  const renderIcon = () => {
    switch (domain) {
      case "marketplace":
        return <Package />;
      case "services":
        return <Toolbox />;
      case "stores":
        return <Store />;
      case "community":
        return <UsersRound />;
      default:
        return null;
    }
  };
  return (
    <AdBanner
      title={t(`adSections.${domain}.title`)}
      description={t(`adSections.${domain}.description`)}
      animated
      variant={variant || "green"}
      icon={renderIcon}
      ctaText={t(`adSections.${domain}.cta`)}
      ctaHref={`/${lang}/${domain}`}
    />
  );
}
