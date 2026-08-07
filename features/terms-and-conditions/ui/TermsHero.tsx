"use client";
import { GradientHeader } from "@/components/Patterns/GradientHeader";
import { useTranslation } from "@/i18n/context";
import { FileText } from "lucide-react";
import { NAMESPACE } from "../i18n";

export function TermsHero() {
  const { t } = useTranslation(NAMESPACE);
  return (
    <GradientHeader
      icon={FileText}
      title={t("page.heroLabel")}
      subtitle={t("page.heroTitle")}
    />
  );
}
