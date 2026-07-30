"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/Feedback/EmptyState";
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
      action={
        <Link
          href={`/${lang}/marketplace`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-sans text-base font-bold text-on-primary"
        >
          {t("cart.empty.cta")}
        </Link>
      }
    />
  );
}
