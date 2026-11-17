"use client";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { ButtonLink } from "@/components/Primitives/Button";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

export function EmptyCart({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");

  return (
    <EmptyState
      variant="prominent"
      bordered={false}
      icon={ShoppingBag}
      title={t("cart.empty.title")}
      description={t("cart.empty.subtitle")}
      className="flex-1 justify-center py-20"
      // The same primary button the pattern draws for `actionLabel`, as a link.
      action={<ButtonLink href={`/${lang}/marketplace`} text={t("cart.empty.cta")} />}
    />
  );
}
