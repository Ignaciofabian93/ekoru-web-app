"use client";

import Link from "next/link";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import ServiceProviderCard from "@/components/Card/ServiceProviderCard/ServiceProviderCard";
import { useServicesHomeData } from "../hooks/useServices";

export function ServicesHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { sellers } = useServicesHomeData({ language: lang });

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("services.title")}</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            {t("services.subtitle")}
          </p>
        </div>
        <Link
          href={`/${lang}/services`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("services.seeAll")}
        </Link>
      </div>
      <div>
        {sellers && sellers.length > 0 ? (
          <div className="flex overflow-x-scroll gap-4 py-2">
            {sellers.map((seller) => (
              <ServiceProviderCard key={seller.id} {...seller} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-secondary">{t("services.noServices")}</p>
        )}
      </div>
    </div>
  );
}
