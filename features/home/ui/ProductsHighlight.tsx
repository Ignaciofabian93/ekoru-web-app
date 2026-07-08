"use client";

import Link from "next/link";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { type SupportedLanguage } from "@/constants/settings";

export function ProductsHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("products.title")}</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            {t("products.subtitle")}
          </p>
        </div>
        <Link
          href={`/${lang}/marketplace`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("products.seeAll")}
        </Link>
      </div>
    </div>
  );
}
