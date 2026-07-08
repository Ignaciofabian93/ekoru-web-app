"use client";
import AdBanner, { type AdBannerVariant } from "@/components/AdBanner/AdBanner";
import type { SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { useTranslation } from "@/i18n/context";
import MainButton from "@/components/Button/MainButton";
import { useNavigation } from "@/hooks/useNavigation";

export function AdBannerSection({
  lang,
  variant,
}: {
  lang: SupportedLanguage;
  variant?: AdBannerVariant;
}) {
  const { navigateTo } = useNavigation();
  const { t } = useTranslation(NAMESPACE);
  return (
    <AdBanner
      title={t("adBanner.firstSection.title")}
      description={t("adBanner.firstSection.description")}
      animated
      variant={variant || "primary"}
      cta={
        <MainButton
          text={t("adBanner.firstSection.cta")}
          variant={variant === "outlined" ? "primary" : "outline"}
          onClick={() => navigateTo({ route: `/${lang}/stores` })}
        />
      }
    />
  );
}
