"use client";

import Link from "next/link";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { type SupportedLanguage } from "@/constants/settings";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";

export function ProductsHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Section ariaLabel={t("products.title")}>
      <SectionHeader
        align="start"
        title={t("products.title")}
        subtitle={t("products.subtitle")}
        action={
          <Link
            href={`/${lang}/marketplace`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("products.seeAll")}
          </Link>
        }
      />
    </Section>
  );
}
