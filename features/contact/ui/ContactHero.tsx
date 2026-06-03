"use client";
import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { useTranslation } from "@/i18n/context";
import { Mail } from "lucide-react";
import { NAMESPACE } from "../i18n";

export function ContactHero() {
  const { t } = useTranslation(NAMESPACE);
  return <ScreenHeader icon={Mail} title={t("page.heroLabel")} subtitle={t("page.heroTitle")} />;
}
