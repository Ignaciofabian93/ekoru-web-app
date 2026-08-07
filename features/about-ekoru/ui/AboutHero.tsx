"use client";
import { GradientHeader } from "@/components/Patterns/GradientHeader";
import { useTranslation } from "@/i18n/context";
import { Leaf } from "lucide-react";
import { NAMESPACE } from "../i18n";

export function AboutHero() {
  const { t } = useTranslation(NAMESPACE);
  return (
    <GradientHeader
      icon={Leaf}
      title={t("page.heroLabel")}
      subtitle={t("page.heroTitle")}
    />
  );
}
