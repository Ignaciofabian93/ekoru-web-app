"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

export function EmptyCart({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary-light-bg">
        <ShoppingBag size={32} className="text-primary" strokeWidth={1.75} />
      </div>
      <Title level="h2" size="h4" weight="semibold" align="center">
        {t("cart.empty.title")}
      </Title>
      <Text variant="p" color="secondary" align="center">
        {t("cart.empty.subtitle")}
      </Text>
      <Link
        href={`/${lang}/marketplace`}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-sans text-base font-bold text-on-primary"
      >
        {t("cart.empty.cta")}
      </Link>
    </div>
  );
}
