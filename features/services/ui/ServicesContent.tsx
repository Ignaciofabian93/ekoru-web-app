"use client";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";

import { useServices } from "../hooks/useServices";
import { useServicesCatalog } from "../hooks/useServicesCatalog";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { ServiceCategoryScroll } from "./ServiceCategoryScroll";
import { ServiceList } from "./ServiceList";
import { Section } from "@/components/Layout";

interface Props {
  lang: string;
  language: Language;
}

export function ServicesContent({ lang, language }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { categories, loading: catalogLoading } = useServicesCatalog(language);
  const { services, loading: servicesLoading } = useServices();

  return (
    <Section>
      <ServiceCategoryScroll
        lang={lang}
        categories={categories}
        loading={catalogLoading}
      />

      <section className="flex flex-col gap-4">
        <Title level="h2" size="h5">
          {t("sections.services")}
        </Title>

        {servicesLoading && services.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 animate-pulse rounded-xl bg-background-secondary"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            variant="compact"
            title={t("detail.noServices")}
            description={t("detail.noServicesHint")}
          />
        ) : (
          <ServiceList services={services} />
        )}
      </section>
    </Section>
  );
}
