"use client";

import Link from "next/link";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useStoresHomeData } from "../hooks/useStores";
import type { SupportedLanguage } from "@/constants/settings";
import StoreCard from "@/components/Card/StoreCard/StoreCard";

export function StoresHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { sellers } = useStoresHomeData({ language: lang });

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("stores.title")}</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            {t("stores.subtitle")}
          </p>
        </div>
        <Link
          href={`/${lang}/stores`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("stores.seeAll")}
        </Link>
      </div>
      <div>
        {sellers && sellers.length > 0 ? (
          <div className="flex overflow-x-scroll gap-4 py-2">
            {sellers.map((seller) => (
              <StoreCard key={seller.id} {...seller} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-secondary">{t("stores.noStores")}</p>
        )}
      </div>
    </div>
  );
}
